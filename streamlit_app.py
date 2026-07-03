from __future__ import annotations

from datetime import date, timedelta

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
from plotly.subplots import make_subplots

from quant_a_share.analysis import (
    answer_ai_matrix,
    industry_chain_report,
    market_emotion,
    qimen_reading,
    sector_analysis,
    stock_action_plan,
    stock_feature,
    stock_lookup,
    stock_pool_from_factors,
)
from quant_a_share.config import AppConfig, ensure_dirs
from quant_a_share.data_provider import TushareProvider
from quant_a_share.indicators import add_indicators
from quant_a_share.sample_data import display_date, normalize_trade_date
from quant_a_share.screener import (
    FACTOR_CATALOG,
    apply_custom_conditions,
    apply_factors,
    build_feature_frame,
    catalog_by_group,
    display_columns,
)
from quant_a_share.storage import (
    get_qimen_jobs,
    get_strategies,
    get_wallet,
    get_watchlists,
    save_qimen_jobs,
    save_strategies,
    save_wallet,
    save_watchlists,
)


st.set_page_config(page_title="Quant A Share", layout="wide", initial_sidebar_state="expanded")
ensure_dirs()
CONFIG = AppConfig()


st.markdown(
    """
    <style>
    .block-container { padding-top: 1rem; }
    .qa-card {
        border: 1px solid rgba(120, 130, 150, .22);
        border-radius: 8px;
        padding: 14px 16px;
        background: rgba(250, 250, 252, .03);
    }
    .qa-small { color: #6b7280; font-size: 0.86rem; }
    .qa-pill {
        display: inline-block;
        border: 1px solid rgba(99, 102, 241, .28);
        border-radius: 999px;
        padding: 2px 9px;
        margin: 2px 4px 2px 0;
        font-size: 12px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


def trade_date(value: date) -> str:
    return value.strftime("%Y%m%d")


def sidebar() -> tuple[TushareProvider, str, str, str, int]:
    st.sidebar.title("Quant A Share")
    token = st.sidebar.text_input("TuShare Token", value=CONFIG.tushare_token, type="password")
    provider = TushareProvider(token=token)
    today = date.today()
    default_start = today - timedelta(days=180)
    start = st.sidebar.date_input("开始日期", default_start)
    end = st.sidebar.date_input("结束日期", today)
    max_symbols = st.sidebar.slider("最大计算股票数", 100, 3000, 800, 100)
    page = st.sidebar.radio(
        "功能",
        [
            "大盘情绪",
            "量化因子选股",
            "板块与概念",
            "行情",
            "自选",
            "LLM分析",
            "AI决策矩阵",
            "奇门遁甲",
            "订阅账号与点数",
            "网站能力清单",
        ],
    )
    if provider.online:
        st.sidebar.success("TuShare 在线")
    else:
        st.sidebar.info("演示数据模式")
    if provider.errors:
        with st.sidebar.expander("接口消息"):
            for item in provider.errors[-5:]:
                st.write(item)
    return provider, page, trade_date(start), trade_date(end), max_symbols


def get_features(provider: TushareProvider, start: str, end: str, max_symbols: int) -> pd.DataFrame:
    daily = provider.market_window(start, end)
    if daily.empty:
        return pd.DataFrame()
    latest_date = daily["trade_date"].max()
    daily_basic = provider.daily_basic(start_date=start, end_date=end)
    moneyflow = provider.moneyflow(start_date=start, end_date=end)
    return build_feature_frame(daily, daily_basic, provider.stock_basic(), moneyflow, max_symbols=max_symbols)


def metric_row(metrics: dict) -> None:
    cols = st.columns(6)
    cols[0].metric("情绪温度", f"{metrics.get('temperature', 0)}%")
    cols[1].metric("行情状态", metrics.get("state", "-"))
    cols[2].metric("成交额", f"{metrics.get('amount_yi', 0):,.0f}亿")
    cols[3].metric("上涨/下跌", f"{metrics.get('up', 0)}/{metrics.get('down', 0)}")
    cols[4].metric("涨停/跌停", f"{metrics.get('limit_up', 0)}/{metrics.get('limit_down', 0)}")
    cols[5].metric("站上MA5", f"{metrics.get('above_ma5', 0)}%")


def page_market(provider: TushareProvider, start: str, end: str, max_symbols: int) -> None:
    st.title("市场情绪分析")
    st.caption("基于历史与公开数据的市场资金流向与指标研究。")
    data = market_emotion(provider, start, end, max_symbols=max_symbols)
    metrics = data["metrics"]
    if not metrics:
        st.warning("没有拿到市场数据。")
        return
    metric_row(metrics)
    breadth = data["breadth"]
    indices = data["indices"]
    c1, c2 = st.columns([1.2, 1])
    with c1:
        fig = px.line(breadth, x="trade_date", y="amount_yi", title="大盘成交额趋势")
        st.plotly_chart(fig, use_container_width=True)
    with c2:
        fig = px.line(breadth, x="trade_date", y="up_ratio", title="大盘情绪(上涨占比)趋势")
        st.plotly_chart(fig, use_container_width=True)
    c3, c4 = st.columns([1, 1])
    latest = pd.DataFrame(
        {
            "类型": ["上涨", "下跌", "平盘", "涨停", "跌停"],
            "数量": [metrics["up"], metrics["down"], metrics["flat"], metrics["limit_up"], metrics["limit_down"]],
        }
    )
    with c3:
        st.plotly_chart(px.bar(latest, x="类型", y="数量", title="涨跌停板分布对比"), use_container_width=True)
    with c4:
        if not indices.empty:
            fig = px.line(indices, x="trade_date", y="pct_chg", color="ts_code", title="指数涨跌幅")
            st.plotly_chart(fig, use_container_width=True)


def page_screener(provider: TushareProvider, start: str, end: str, max_symbols: int) -> None:
    st.title("多因子量化模型")
    st.caption("点击因子、组合条件并生成股票池。")
    features = get_features(provider, start, end, max_symbols)
    if features.empty:
        st.warning("没有拿到可筛选数据。")
        return
    strategies = get_strategies()
    saved_names = [s["name"] for s in strategies]
    with st.expander("我的策略", expanded=bool(saved_names)):
        selected_strategy = st.selectbox("载入策略", [""] + saved_names)
        strategy_keys: list[str] = []
        if selected_strategy:
            strategy_keys = next((s["factors"] for s in strategies if s["name"] == selected_strategy), [])

    groups = catalog_by_group()
    selected_labels: list[str] = []
    selected_keys = set(strategy_keys)
    for group, factors in groups.items():
        with st.expander(group, expanded=group.startswith("基础")):
            labels = [f.label for f in factors]
            defaults = [f.label for f in factors if f.key in selected_keys]
            picks = st.multiselect(group, labels, default=defaults, label_visibility="collapsed")
            selected_labels.extend(picks)
    label_to_key = {f.label: f.key for f in FACTOR_CATALOG}
    keys = [label_to_key[label] for label in selected_labels]

    st.subheader("自定义条件")
    c1, c2, c3, c4 = st.columns([1.2, 0.8, 1, 1])
    numeric_fields = [
        "change_pct",
        "close",
        "turnover_rate",
        "volume_ratio",
        "amount_yi",
        "pe",
        "pb",
        "rps_50",
        "rps_120",
        "sector_rps_50",
        "net_mf_yi",
    ]
    field = c1.selectbox("字段", numeric_fields)
    op = c2.selectbox("操作符", [">=", "<=", ">", "<", "=="])
    value = c3.number_input("值", value=0.0)
    add_condition = c4.checkbox("启用自定义条件")
    conditions = [{"field": field, "op": op, "value": value}] if add_condition else []

    filtered = apply_custom_conditions(apply_factors(features, keys), conditions)
    sort_col = st.selectbox("排序", ["rps_combo", "rps_50", "net_mf_yi", "change_pct", "amount_yi", "circ_mv_yi"], index=0)
    ascending = st.checkbox("升序", value=False)
    filtered = filtered.sort_values(sort_col, ascending=ascending)

    save_cols = st.columns([1.5, 1, 4])
    strategy_name = save_cols[0].text_input("策略名称", placeholder="例如：强势吸筹")
    if save_cols[1].button("保存策略") and strategy_name:
        strategies = [s for s in strategies if s["name"] != strategy_name]
        strategies.append({"name": strategy_name, "factors": keys, "conditions": conditions, "sort": sort_col})
        save_strategies(strategies)
        st.success("已保存")

    st.write(f"筛选结果：{len(filtered)} 条")
    cols = [c for c in display_columns() if c in filtered.columns]
    shown = filtered[cols].head(300).copy()
    shown = shown.rename(
        columns={
            "ts_code": "代码",
            "name": "名称",
            "close": "最新价",
            "change_pct": "涨跌幅",
            "volume_signal_text": "量能信号",
            "macd_state": "MACD",
            "circ_mv_yi": "流通市值(亿)",
            "industry": "行业",
            "candle_patterns": "K线形态",
            "support_line_next": "趋势支撑线_次日",
            "resistance_line_60": "趋势压力线_60",
            "net_mf_yi": "资金净流入(亿)",
        }
    )
    st.dataframe(shown, width="stretch", height=520)


def page_sectors(provider: TushareProvider, start: str, end: str, max_symbols: int) -> None:
    st.title("板块与概念分析")
    features = get_features(provider, start, end, max_symbols)
    kind = st.radio("数据类型", ["行业", "概念"], horizontal=True)
    sectors = sector_analysis(features, provider, kind=kind)
    if sectors.empty:
        st.warning("暂无板块数据。")
        return
    min_pct, max_pct = st.slider("涨跌幅范围", -10.0, 10.0, (-10.0, 10.0), 0.5)
    filtered = sectors[sectors["pct_chg"].between(min_pct, max_pct)]
    c1, c2 = st.columns([1, 1])
    with c1:
        st.plotly_chart(px.bar(filtered.head(30), x="sector_name", y="net_mf_yi", title="资金流向分布"), use_container_width=True)
    with c2:
        st.plotly_chart(px.pie(filtered.head(15), values="amount_yi", names="sector_name", title="成交额占比"), use_container_width=True)
    st.dataframe(
        filtered.rename(
            columns={
                "sector_name": "名称",
                "pct_chg": "涨跌幅",
                "rank": "排名",
                "rank_change": "排名变化",
                "up_count": "上涨家数",
                "down_count": "下跌家数",
                "limit_up_count": "涨停家数",
                "fund_flow_label": "资金流向",
                "top_stock": "代表股票",
            }
        ),
        width="stretch",
        height=520,
    )


def page_quote(provider: TushareProvider, start: str, end: str) -> None:
    st.title("行情 - 分时与日K技术指标")
    stocks = provider.stock_basic()
    choices = (stocks["name"] + " · " + stocks["ts_code"]).tolist()
    default_index = 0
    selected = st.selectbox("股票名称", choices, index=default_index)
    code = selected.split(" · ")[-1]
    c1, c2, c3, c4 = st.columns([1, 1, 1, 1])
    adj = c1.selectbox("复权", ["qfq", "hfq", "不复权"], format_func=lambda x: {"qfq": "前复权(qfq)", "hfq": "后复权(hfq)", "不复权": "不复权"}[x])
    freq = c2.selectbox("周期", ["D", "1min", "5min", "15min"])
    show_macd = c3.checkbox("MACD", True)
    show_rsi = c4.checkbox("RSI", True)
    if st.button("加自选"):
        watchlists = get_watchlists()
        watchlists.setdefault("全部", [])
        if code not in watchlists["全部"]:
            watchlists["全部"].append(code)
            save_watchlists(watchlists)
            st.success("已加入自选")
    if freq == "D":
        data = provider.pro_bar(code, start, end, adj=None if adj == "不复权" else adj, freq="D")
        data = data.sort_values("trade_date")
        required = {"open", "high", "low", "close", "vol", "trade_date"}
        if required.issubset(data.columns):
            data = add_indicators(data)
        x = data["trade_date"]
    else:
        data = provider.stk_mins(code, f"{display_date(start)} 09:30:00", f"{display_date(end)} 15:00:00", freq=freq)
        data = data.sort_values(data.columns[1])
        x = data.get("trade_time", data.iloc[:, 1])
    if data.empty:
        st.warning("没有行情数据。")
        return
    latest = data.iloc[-1]
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("现价", f"{float(latest['close']):.2f}")
    m2.metric("成交量", f"{float(latest.get('vol', 0)):,.0f}")
    m3.metric("数据量", len(data))
    m4.metric("代码", code)
    fig = make_subplots(rows=3 if show_macd or show_rsi else 2, cols=1, shared_xaxes=True, vertical_spacing=0.03, row_heights=[0.62, 0.18, 0.2] if show_macd or show_rsi else [0.72, 0.28])
    fig.add_trace(go.Candlestick(x=x, open=data["open"], high=data["high"], low=data["low"], close=data["close"], name="K线"), row=1, col=1)
    for window in [5, 10, 20, 60]:
        if f"ma{window}" in data.columns:
            fig.add_trace(go.Scatter(x=x, y=data[f"ma{window}"], name=f"MA{window}", mode="lines"), row=1, col=1)
    fig.add_trace(go.Bar(x=x, y=data.get("vol", pd.Series([0] * len(data))), name="VOL"), row=2, col=1)
    if show_macd and {"macd_dif", "macd_dea", "macd_hist"}.issubset(data.columns):
        fig.add_trace(go.Bar(x=x, y=data["macd_hist"], name="MACD柱"), row=3, col=1)
        fig.add_trace(go.Scatter(x=x, y=data["macd_dif"], name="DIF"), row=3, col=1)
        fig.add_trace(go.Scatter(x=x, y=data["macd_dea"], name="DEA"), row=3, col=1)
    elif show_rsi and "rsi14" in data.columns:
        fig.add_trace(go.Scatter(x=x, y=data["rsi14"], name="RSI14"), row=3, col=1)
    fig.update_layout(height=720, xaxis_rangeslider_visible=False)
    st.plotly_chart(fig, use_container_width=True)

    row = stock_feature(provider, code, start, end)
    st.subheader("操作计划")
    st.markdown(stock_action_plan(row))


def page_watchlist(provider: TushareProvider, start: str, end: str) -> None:
    st.title("自选")
    watchlists = get_watchlists()
    c1, c2, c3 = st.columns([1, 1, 1])
    group = c1.selectbox("分组", list(watchlists.keys()))
    new_group = c2.text_input("新分组名称")
    if c2.button("新建分组") and new_group:
        watchlists.setdefault(new_group, [])
        save_watchlists(watchlists)
        st.success("已新建")
    if c3.button("删除分组") and group != "全部":
        watchlists.pop(group, None)
        save_watchlists(watchlists)
        st.success("已删除")
    codes = watchlists.get(group, [])
    if not codes:
        st.info("暂无自选股票，前往行情页点击“加自选”。")
        return
    rows = []
    stocks = provider.stock_basic().set_index("ts_code")
    for code in codes:
        row = stock_feature(provider, code, start, end)
        if row.empty:
            continue
        rows.append(
            {
                "代码": code,
                "名称": stocks.loc[code]["name"] if code in stocks.index else code,
                "分组": group,
                "最新价": row.get("close"),
                "涨跌幅(%)": row.get("change_pct"),
                "成交额(亿)": row.get("amount_yi"),
            }
        )
    table = pd.DataFrame(rows)
    st.dataframe(table, width="stretch")
    remove = st.multiselect("移除代码", codes)
    if st.button("移除所选") and remove:
        watchlists[group] = [c for c in codes if c not in remove]
        if group != "全部":
            watchlists["全部"] = [c for c in watchlists.get("全部", []) if c not in remove]
        save_watchlists(watchlists)
        st.success("已移除")


def page_llm(provider: TushareProvider, start: str, end: str, max_symbols: int) -> None:
    st.title("LLM分析")
    features = get_features(provider, start, end, max_symbols)
    sectors = sector_analysis(features, provider, kind="概念")
    tabs = st.tabs(["主题热点", "选股池", "板块全景看板", "个股评估矩阵", "产业链研报分析"])
    with tabs[0]:
        st.dataframe(sectors.head(30), width="stretch")
        if not sectors.empty:
            st.plotly_chart(px.bar(sectors.head(20), x="sector_name", y="rps50", title="主题热度"), use_container_width=True)
    with tabs[1]:
        keys = st.multiselect("组合因子", [f.label for f in FACTOR_CATALOG], default=["站上MA20", "RPS50≥70"])
        label_to_key = {f.label: f.key for f in FACTOR_CATALOG}
        pool = stock_pool_from_factors(features, [label_to_key[k] for k in keys])
        st.dataframe(pool[[c for c in display_columns() if c in pool.columns]], width="stretch")
    with tabs[2]:
        st.plotly_chart(px.scatter(sectors, x="pct_chg", y="net_mf_yi", size="amount_yi", hover_name="sector_name", title="板块强度矩阵"), use_container_width=True)
    with tabs[3]:
        code = st.text_input("股票代码或名称", "000001")
        row = stock_feature(provider, code, start, end)
        st.markdown(stock_action_plan(row))
    with tabs[4]:
        sector_name = st.selectbox("板块", sectors["sector_name"].tolist() if not sectors.empty else [""])
        st.markdown(industry_chain_report(sectors, sector_name))


def page_ai(provider: TushareProvider, start: str, end: str) -> None:
    st.title("AI决策矩阵")
    mode = st.radio("模式", ["快速模式", "专家模式", "深度思考"], horizontal=True)
    real_time = st.toggle("实时搜索", value=True)
    question = st.text_area("请输入你的问题", placeholder="例如：结合实时行情，分析东方财富现在能不能买，按短线3-5天思路给我操作计划。", height=130)
    if st.button("发送", type="primary") and question:
        answer = answer_ai_matrix(provider, question, mode, start, end)
        if real_time:
            answer += "\n\n已结合当前 TuShare 数据窗口。"
        st.session_state.setdefault("ai_messages", []).append((question, answer))
    prompts = [
        "结合实时行情，分析【股票名】现在能不能买，按短线3-5天思路，给我买点、止损位、仓位建议和注意点。",
        "我现在持有【股票名】，盘中该继续拿还是先减一点？给我减仓条件、失效条件和仓位建议。",
        "今天哪些板块资金在持续流入，哪些方向更适合低吸观察？",
        "分析近期大盘涨跌、成交额、行业轮动和资金流向，找出低吸候选方向。",
    ]
    st.subheader("热门问句")
    for item in prompts:
        st.markdown(f"<span class='qa-pill'>{item}</span>", unsafe_allow_html=True)
    for q, a in reversed(st.session_state.get("ai_messages", [])):
        with st.chat_message("user"):
            st.write(q)
        with st.chat_message("assistant"):
            st.markdown(a)


def page_qimen(provider: TushareProvider, start: str, end: str, max_symbols: int) -> None:
    st.title("奇门遁甲")
    st.caption("把专业解盘转成能直接执行的条件。")
    emotion = market_emotion(provider, start, end, max_symbols=max_symbols)["metrics"]
    c1, c2, c3 = st.columns(3)
    item_type = c1.selectbox("事项类型", ["金融", "工作", "合作", "其他"])
    stage = c2.selectbox("当前阶段", ["在考虑阶段", "已持有/已开始", "准备执行", "等待确认"])
    calendar = c3.radio("历法类型", ["公历", "此刻"], horizontal=True)
    c4, c5, c6 = st.columns(3)
    city = c4.text_input("城市", "上海")
    preference = c5.selectbox("输出偏好", ["直接结论", "详细拆解"])
    grade = c6.selectbox("解盘档位", ["简要分析", "深入分析（20点）"])
    target = st.text_area("事情摘要", placeholder="例如：我最近在看一只科技股，已经涨了一段时间，现在想判断适不适合进场。", height=110)
    cols = st.columns([1, 1, 5])
    if cols[0].button("同步起局（1点）"):
        st.session_state["qimen_draft"] = {
            "item_type": item_type,
            "stage": stage,
            "calendar": calendar,
            "city": city,
            "preference": preference,
            "grade": grade,
            "target": target or "当前事项",
        }
        st.success("已起局")
    if cols[1].button("提交解盘任务", type="primary"):
        payload = st.session_state.get(
            "qimen_draft",
            {
                "item_type": item_type,
                "stage": stage,
                "calendar": calendar,
                "city": city,
                "preference": preference,
                "grade": grade,
                "target": target or "当前事项",
            },
        )
        result = qimen_reading(payload, emotion.get("state", "震荡行情"))
        jobs = get_qimen_jobs()
        jobs.insert(0, {"created_at": pd.Timestamp.now().isoformat(), "payload": payload, "result": result})
        save_qimen_jobs(jobs[:100])
        st.session_state["qimen_result"] = result
    c1, c2 = st.columns([1, 1])
    with c1:
        st.subheader("我的历史")
        jobs = get_qimen_jobs()
        if jobs:
            for idx, job in enumerate(jobs[:12]):
                if st.button(f"{idx + 1}. {job['payload'].get('target', '任务')[:28]}", key=f"job-{idx}"):
                    st.session_state["qimen_result"] = job["result"]
        else:
            st.info("还没有历史记录")
    with c2:
        st.subheader("结果与详情")
        st.markdown(st.session_state.get("qimen_result", "请先起局、提交解盘任务，或打开一条历史记录。"))


def page_subscription() -> None:
    st.title("订阅账号与点数")
    wallet = get_wallet()
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("当前账号", "本地账号")
    c2.metric("账号状态", "正常")
    c3.metric("可用点数", wallet.get("points", 0))
    c4.metric("冻结点数", wallet.get("frozen", 0))
    products = [
        ("账号订阅 一个月", "订阅套餐", 88, 0, "账号开通 1 个月"),
        ("账号订阅 半年", "订阅套餐", 368, 0, "账号开通 6 个月"),
        ("账号订阅 一年", "订阅套餐", 688, 0, "账号开通 12 个月"),
        ("点数 100点", "点数包", 10, 100, "账号直充"),
        ("点数 200点", "点数包", 20, 200, "账号直充"),
        ("点数 500点", "点数包", 50, 500, "账号直充"),
        ("点数 1000点", "点数包", 100, 1000, "账号直充"),
    ]
    product_type = st.radio("商品筛选", ["全部商品", "点数包", "订阅套餐"], horizontal=True)
    shown = [p for p in products if product_type == "全部商品" or p[1] == product_type]
    for idx, (name, kind, price, points, desc) in enumerate(shown):
        with st.container(border=True):
            c1, c2, c3, c4 = st.columns([2, 1, 1, 1])
            c1.subheader(name)
            c1.caption(f"{kind} · {desc}")
            c2.metric("价格", f"¥{price}")
            c3.metric("点数", points)
            if c4.button("本地记账", key=f"buy-{idx}"):
                wallet["points"] = float(wallet.get("points", 0)) + points
                wallet["charged"] = float(wallet.get("charged", 0)) + points
                wallet.setdefault("orders", []).insert(0, {"name": name, "price": price, "points": points, "created_at": pd.Timestamp.now().isoformat()})
                save_wallet(wallet)
                st.success("已写入本地点数账本")
    st.subheader("点数概览")
    st.dataframe(pd.DataFrame(wallet.get("orders", [])), width="stretch")


def page_capability() -> None:
    st.title("网站能力清单")
    rows = [
        ("大盘情绪", "情绪温度、成交额、涨跌比、涨跌停、连板梯队、指数涨跌幅", "已实现：市场温度、涨跌分布、成交额、指数图"),
        ("量化因子选股", "估值/市值/量能/均线/RPS/MACD/KDJ/RSI/VWAP/缠论/TD", "已实现：因子按钮、组合筛选、自定义条件、策略保存"),
        ("板块与概念", "板块/概念涨跌、排名变化、涨跌家数、资金流向", "已实现：行业与概念聚合、表格与图表"),
        ("行情", "分时、日K、复权、技术指标、画线、加自选", "已实现：K线、均线、成交量、MACD/RSI入口、自选"),
        ("自选", "分组、自选列表、行情字段", "已实现：本地分组与表格"),
        ("LLM分析", "主题热点、选股池、板块看板、个股矩阵、产业链研报", "已实现：研究版看板与文本报告"),
        ("AI决策矩阵", "实时行情问答、快速/专家/深度模式、热门问句", "已实现：TuShare上下文问答与本地规则生成"),
        ("奇门遁甲", "起局、提交任务、历史、结果详情、点数", "已实现：本地任务、历史、解盘文本"),
        ("订阅账号与点数", "账号状态、点数、商品、钱包账单", "已实现：本地点数账本"),
    ]
    st.dataframe(pd.DataFrame(rows, columns=["模块", "原站能力", "本项目实现"]), width="stretch", hide_index=True)


def main() -> None:
    provider, page, start, end, max_symbols = sidebar()
    if start > end:
        st.error("开始日期不能晚于结束日期。")
        return
    if page == "大盘情绪":
        page_market(provider, start, end, max_symbols)
    elif page == "量化因子选股":
        page_screener(provider, start, end, max_symbols)
    elif page == "板块与概念":
        page_sectors(provider, start, end, max_symbols)
    elif page == "行情":
        page_quote(provider, start, end)
    elif page == "自选":
        page_watchlist(provider, start, end)
    elif page == "LLM分析":
        page_llm(provider, start, end, max_symbols)
    elif page == "AI决策矩阵":
        page_ai(provider, start, end)
    elif page == "奇门遁甲":
        page_qimen(provider, start, end, max_symbols)
    elif page == "订阅账号与点数":
        page_subscription()
    else:
        page_capability()


if __name__ == "__main__":
    main()
