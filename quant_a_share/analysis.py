from __future__ import annotations

from datetime import datetime
from typing import Any

import numpy as np
import pandas as pd

from .data_provider import TushareProvider, normalize_ts_code
from .screener import apply_factors, build_feature_frame


def market_emotion(
    provider: TushareProvider,
    start_date: str,
    end_date: str,
    max_symbols: int | None = 1000,
) -> dict[str, Any]:
    daily = provider.market_window(start_date, end_date)
    stock_basic = provider.stock_basic()
    daily_basic = provider.daily_basic(start_date=start_date, end_date=end_date)
    moneyflow = provider.moneyflow(start_date=start_date, end_date=end_date)
    features = build_feature_frame(daily, daily_basic, stock_basic, moneyflow, max_symbols=max_symbols)
    if features.empty:
        return {"features": features, "daily": daily, "metrics": {}, "breadth": pd.DataFrame(), "indices": pd.DataFrame()}
    last_date = features["trade_date"].max()
    latest = features[features["trade_date"] == last_date]
    up = int((latest["change_pct"] > 0).sum())
    down = int((latest["change_pct"] < 0).sum())
    flat = int((latest["change_pct"] == 0).sum())
    limit_up = int(((latest.get("limit_status", 0).isin([2, 3])) | (latest["change_pct"] >= 9.7)).sum())
    limit_down = int(((latest.get("limit_status", 0).isin([5, 6])) | (latest["change_pct"] <= -9.7)).sum())
    above_ma5 = latest["close"].gt(latest["ma5"]).mean() * 100
    amount_yi = latest["amount_yi"].sum()
    net_mf = latest["net_mf_yi"].sum()
    temp = np.clip(above_ma5 * 0.45 + latest["rps_50"].mean() * 0.3 + (up / max(up + down, 1)) * 25, 0, 100)
    state = "强势行情" if temp >= 70 else "震荡偏强" if temp >= 55 else "震荡行情" if temp >= 35 else "弱势整理"
    breadth = (
        daily.groupby("trade_date")
        .agg(
            up=("pct_chg", lambda s: int((s > 0).sum())),
            down=("pct_chg", lambda s: int((s < 0).sum())),
            amount=("amount", "sum"),
            mean_pct=("pct_chg", "mean"),
        )
        .reset_index()
    )
    breadth["up_ratio"] = breadth["up"] / (breadth["up"] + breadth["down"]).replace(0, np.nan) * 100
    breadth["amount_yi"] = breadth["amount"] / 100000
    index_codes = ["000001.SH", "399001.SZ", "399006.SZ", "000300.SH"]
    indices = pd.concat(
        [provider.index_daily(code, start_date=start_date, end_date=end_date) for code in index_codes],
        ignore_index=True,
    )
    metrics = {
        "trade_date": last_date,
        "temperature": round(float(temp), 1),
        "state": state,
        "amount_yi": round(float(amount_yi), 2),
        "net_mf_yi": round(float(net_mf), 2),
        "up": up,
        "down": down,
        "flat": flat,
        "limit_up": limit_up,
        "limit_down": limit_down,
        "above_ma5": round(float(above_ma5), 1),
    }
    return {"features": features, "daily": daily, "metrics": metrics, "breadth": breadth, "indices": indices}


def sector_analysis(features: pd.DataFrame, provider: TushareProvider, kind: str = "行业") -> pd.DataFrame:
    if features.empty:
        return pd.DataFrame()
    work = features.copy()
    if kind == "概念":
        work["sector_name"] = work["industry"].fillna("其他").map(provider.concept_for_industry)
    else:
        work["sector_name"] = work["industry"].fillna("其他")
    grouped = (
        work.groupby("sector_name")
        .agg(
            count=("ts_code", "count"),
            pct_chg=("change_pct", "mean"),
            up_count=("change_pct", lambda s: int((s > 0).sum())),
            down_count=("change_pct", lambda s: int((s < 0).sum())),
            limit_up_count=("change_pct", lambda s: int((s >= 9.7).sum())),
            amount_yi=("amount_yi", "sum"),
            net_mf_yi=("net_mf_yi", "sum"),
            rps50=("rps_50", "mean"),
            top_stock=("name", lambda s: "、".join(s.head(3).astype(str))),
        )
        .reset_index()
    )
    grouped["rank"] = grouped["pct_chg"].rank(ascending=False, method="dense").astype(int)
    grouped["rank_change"] = ((grouped["net_mf_yi"].rank(ascending=False, method="dense") - grouped["rank"]) * -1).fillna(0).astype(int)
    grouped["fund_flow_label"] = grouped["net_mf_yi"].map(lambda x: f"{x:+.2f}亿")
    return grouped.sort_values(["pct_chg", "net_mf_yi"], ascending=False)


def stock_lookup(provider: TushareProvider, query: str) -> str:
    stocks = provider.stock_basic()
    text = str(query or "").strip()
    if not text:
        return ""
    exact = stocks[(stocks["ts_code"].str.upper() == text.upper()) | (stocks["symbol"].astype(str) == text) | (stocks["name"] == text)]
    if not exact.empty:
        return str(exact.iloc[0]["ts_code"])
    contains = stocks[stocks["name"].astype(str).str.contains(text, regex=False, na=False)]
    if not contains.empty:
        return str(contains.iloc[0]["ts_code"])
    return normalize_ts_code(text, stocks)


def stock_feature(provider: TushareProvider, ts_code: str, start_date: str, end_date: str) -> pd.Series:
    code = stock_lookup(provider, ts_code)
    daily = provider.daily(ts_code=code, start_date=start_date, end_date=end_date)
    stock_basic = provider.stock_basic()
    daily_basic = provider.daily_basic(ts_code=code, start_date=start_date, end_date=end_date)
    moneyflow = provider.moneyflow(ts_code=code, start_date=start_date, end_date=end_date)
    features = build_feature_frame(daily, daily_basic, stock_basic, moneyflow)
    if features.empty:
        return pd.Series(dtype=object)
    return features.iloc[-1]


def stock_action_plan(row: pd.Series, horizon: str = "短线3-5天") -> str:
    if row.empty:
        return "没有拿到足够数据，先换一个股票代码或扩大日期范围。"
    name = row.get("name") or row.get("ts_code")
    close = _num(row.get("close"), 0)
    support = _num(row.get("support_line_next"), close * 0.97)
    resistance = _num(row.get("resistance_line_60"), close * 1.08)
    trend_ok = bool(row.get("close", 0) > row.get("ma20", row.get("close", 0)))
    money_ok = float(row.get("net_mf_yi", 0) or 0) > 0
    rps = float(row.get("rps_50", 50) or 50)
    if trend_ok and money_ok and rps >= 60:
        stance = "可跟踪试错"
        position = "20%-35%"
        trigger = f"放量站稳 {close:.2f} 上方，或回踩 {max(support, close * 0.97):.2f} 附近不破"
    elif trend_ok or money_ok:
        stance = "观察为主"
        position = "10%-20%"
        trigger = f"等收盘重新站上 MA20 或资金净流入延续"
    else:
        stance = "先不追"
        position = "0%-10%"
        trigger = f"等价格重新收复 {max(row.get('ma20', close), support):.2f}"
    invalid = f"跌破 {support:.2f} 且无法快速收回"
    target = f"{min(resistance, close * 1.12):.2f}"
    return (
        f"{name}（{row.get('ts_code')}）当前结论：{stance}。\n\n"
        f"- 周期：{horizon}\n"
        f"- 当前价：{close:.2f}，50日RPS：{rps:.1f}，资金净流入：{float(row.get('net_mf_yi', 0) or 0):+.2f}亿\n"
            f"- 触发条件：{trigger}\n"
        f"- 失效条件：{invalid}\n"
        f"- 参考目标：先看 {target} 附近的承压情况\n"
        f"- 仓位区间：{position}\n"
        f"- 观察点：量比、MA20、板块RPS、资金净流入是否同向"
    )


def _num(value: Any, default: float) -> float:
    try:
        out = float(value)
        if np.isnan(out) or np.isinf(out):
            return default
        return out
    except Exception:
        return default


def answer_ai_matrix(
    provider: TushareProvider,
    question: str,
    mode: str,
    start_date: str,
    end_date: str,
) -> str:
    stocks = provider.stock_basic()
    query = str(question or "")
    candidates = []
    for _, row in stocks.iterrows():
        if str(row["name"]) in query or str(row["symbol"]) in query or str(row["ts_code"]).split(".")[0] in query:
            candidates.append(str(row["ts_code"]))
            break
    if candidates:
        row = stock_feature(provider, candidates[0], start_date, end_date)
        plan = stock_action_plan(row, _horizon_from_question(query))
    else:
        emotion = market_emotion(provider, start_date, end_date, max_symbols=600)
        metrics = emotion["metrics"]
        plan = (
            f"市场当前为{metrics.get('state', '待观察')}，情绪温度 {metrics.get('temperature', 0)}%。\n\n"
            f"- 上涨/下跌家数：{metrics.get('up', 0)} / {metrics.get('down', 0)}\n"
            f"- 涨停/跌停：{metrics.get('limit_up', 0)} / {metrics.get('limit_down', 0)}\n"
            f"- 成交额：{metrics.get('amount_yi', 0)} 亿\n"
            f"- 资金净流入：{metrics.get('net_mf_yi', 0):+} 亿\n"
            f"- 操作节奏：优先找板块RPS靠前、个股站上MA20、资金净流入延续的标的"
        )
    if mode == "深度思考":
        plan += "\n\n深度拆解：先看大盘情绪温度，再看行业强度，最后落到个股触发位。只有三层都同向时才提高仓位。"
    elif mode == "专家模式":
        plan += "\n\n专家模式补充：把触发条件拆成价格、量能、资金、板块四个确认项，盘中只执行已满足的项。"
    else:
        plan += "\n\n快速模式：只保留结论、触发条件、失效条件和仓位区间。"
    return plan


def _horizon_from_question(question: str) -> str:
    if "超短" in question or "1-2" in question or "1到2" in question:
        return "超短1-2天"
    if "中线" in question or "1-2个月" in question:
        return "中线1-2个月"
    return "短线3-5天"


def qimen_reading(payload: dict[str, Any], market_state: str = "震荡行情") -> str:
    target = payload.get("target") or "当前事项"
    stage = payload.get("stage") or "在考虑阶段"
    city = payload.get("city") or "上海"
    preference = payload.get("preference") or "直接结论"
    grade = payload.get("grade") or "深入分析"
    minute = datetime.now().strftime("%Y-%m-%d %H:%M")
    base = (
        f"起局时间：{minute}，城市：{city}。\n\n"
        f"事项：{target}\n"
        f"阶段：{stage}\n"
        f"市场背景：{market_state}\n\n"
    )
    if "进场" in target or "买" in target or "低吸" in target:
        conclusion = "结论：可以观察触发位，不适合无条件追高。"
        actions = [
            "价格回踩关键均线不破时再看承接",
            "放量突破前高时只做小仓试错",
            "若跌破失效位，暂停动作等待下一次结构",
        ]
    elif "减仓" in target or "卖" in target:
        conclusion = "结论：先看是否跌破短线结构，再决定是否降低仓位。"
        actions = [
            "冲高量能不足时先减一部分",
            "若重新放量站回 MA20，可继续观察",
            "若连续两日资金流出，降低仓位到轻仓",
        ]
    else:
        conclusion = "结论：事项仍在确认阶段，先用条件单思路处理。"
        actions = [
            "先确定触发位、失效位和计划仓位",
            "不要在信号不完整时扩大动作",
            "等市场情绪与目标走势同向后再执行",
        ]
    detail = "\n".join(f"- {item}" for item in actions)
    if preference == "直接结论":
        return base + conclusion + "\n\n" + detail
    return base + conclusion + f"\n\n解盘档位：{grade}\n\n" + detail + "\n\n变化节点：开盘30分钟、午后第一小时、收盘前20分钟。"


def stock_pool_from_factors(features: pd.DataFrame, keys: list[str], limit: int = 20) -> pd.DataFrame:
    filtered = apply_factors(features, keys)
    if filtered.empty:
        filtered = features
    return filtered.sort_values(["rps_combo", "net_mf_yi", "change_pct"], ascending=False).head(limit)


def industry_chain_report(sector_df: pd.DataFrame, sector_name: str) -> str:
    if sector_df.empty:
        return "暂无板块数据。"
    row = sector_df[sector_df["sector_name"] == sector_name]
    if row.empty:
        row = sector_df.head(1)
    item = row.iloc[0]
    tone = "偏强" if item["pct_chg"] > 0 else "偏弱"
    return (
        f"{item['sector_name']} 当前表现{tone}，平均涨跌幅 {item['pct_chg']:.2f}%，"
        f"上涨家数 {int(item['up_count'])}，下跌家数 {int(item['down_count'])}，"
        f"资金净流入 {item['net_mf_yi']:+.2f} 亿。\n\n"
        f"观察顺序：先看板块资金是否延续，再看龙头是否维持强度，最后看低位补涨是否开始扩散。"
    )
