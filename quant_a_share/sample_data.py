from __future__ import annotations

from datetime import date, datetime, timedelta

import numpy as np
import pandas as pd


BASE_STOCKS = [
    ("000001.SZ", "000001", "平安银行", "深圳", "银行"),
    ("600519.SH", "600519", "贵州茅台", "贵州", "白酒"),
    ("300750.SZ", "300750", "宁德时代", "福建", "电池"),
    ("002594.SZ", "002594", "比亚迪", "广东", "汽车"),
    ("601318.SH", "601318", "中国平安", "广东", "保险"),
    ("600036.SH", "600036", "招商银行", "广东", "银行"),
    ("000858.SZ", "000858", "五粮液", "四川", "白酒"),
    ("300059.SZ", "300059", "东方财富", "上海", "证券"),
    ("601888.SH", "601888", "中国中免", "北京", "旅游"),
    ("002415.SZ", "002415", "海康威视", "浙江", "电子"),
    ("600276.SH", "600276", "恒瑞医药", "江苏", "医药"),
    ("000063.SZ", "000063", "中兴通讯", "广东", "通信"),
    ("600030.SH", "600030", "中信证券", "广东", "证券"),
    ("601012.SH", "601012", "隆基绿能", "陕西", "光伏"),
    ("002230.SZ", "002230", "科大讯飞", "安徽", "AI"),
    ("688981.SH", "688981", "中芯国际", "上海", "半导体"),
    ("300760.SZ", "300760", "迈瑞医疗", "广东", "医疗器械"),
    ("002475.SZ", "002475", "立讯精密", "广东", "消费电子"),
    ("600809.SH", "600809", "山西汾酒", "山西", "白酒"),
    ("603259.SH", "603259", "药明康德", "江苏", "医药"),
]

INDUSTRIES = [
    "AI",
    "半导体",
    "电池",
    "光伏",
    "汽车",
    "医药",
    "医疗器械",
    "白酒",
    "银行",
    "证券",
    "保险",
    "通信",
    "电子",
    "消费电子",
    "旅游",
    "新能源车",
    "军工",
    "机器人",
    "中药",
    "黄金",
]

CONCEPT_MAP = {
    "AI": "人工智能",
    "半导体": "芯片",
    "电池": "新能源车",
    "光伏": "新能源",
    "汽车": "新能源车",
    "医药": "创新药",
    "医疗器械": "医疗健康",
    "白酒": "大消费",
    "银行": "大金融",
    "证券": "大金融",
    "保险": "大金融",
    "通信": "算力通信",
    "电子": "消费电子",
    "消费电子": "消费电子",
    "旅游": "消费复苏",
    "新能源车": "新能源车",
    "军工": "高端制造",
    "机器人": "机器人",
    "中药": "中药",
    "黄金": "黄金",
}


def normalize_trade_date(value: str | date | datetime | None = None) -> str:
    if value is None:
        dt = date.today()
    elif isinstance(value, datetime):
        dt = value.date()
    elif isinstance(value, date):
        dt = value
    else:
        text = str(value).replace("-", "")
        return text[:8]
    return dt.strftime("%Y%m%d")


def display_date(value: str | date | datetime | None = None) -> str:
    text = normalize_trade_date(value)
    return f"{text[:4]}-{text[4:6]}-{text[6:]}"


def business_dates(end_date: str | date | datetime | None = None, periods: int = 180) -> list[str]:
    end = datetime.strptime(normalize_trade_date(end_date), "%Y%m%d").date()
    dates: list[str] = []
    cursor = end
    while len(dates) < periods:
        if cursor.weekday() < 5:
            dates.append(cursor.strftime("%Y%m%d"))
        cursor -= timedelta(days=1)
    return list(reversed(dates))


def stock_basic(n_extra: int = 80) -> pd.DataFrame:
    rows = list(BASE_STOCKS)
    for i in range(n_extra):
        code_num = 100000 + i
        suffix = "SZ" if i % 3 else "SH"
        industry = INDUSTRIES[i % len(INDUSTRIES)]
        rows.append(
            (
                f"{code_num:06d}.{suffix}",
                f"{code_num:06d}",
                f"{industry}样本{i + 1}",
                ["上海", "深圳", "北京", "杭州", "成都"][i % 5],
                industry,
            )
        )
    df = pd.DataFrame(rows, columns=["ts_code", "symbol", "name", "area", "industry"])
    df["market"] = np.where(df["ts_code"].str.endswith(".SH"), "主板", "深市")
    df["list_date"] = "20150101"
    return df


def generate_market_data(
    end_date: str | date | datetime | None = None,
    periods: int = 180,
    n_extra: int = 80,
) -> dict[str, pd.DataFrame]:
    rng = np.random.default_rng(20260703)
    stocks = stock_basic(n_extra=n_extra)
    dates = business_dates(end_date, periods)
    rows: list[dict[str, float | str]] = []
    basic_rows: list[dict[str, float | str | int]] = []
    flow_rows: list[dict[str, float | str]] = []

    industry_bias = {name: rng.normal(0.0004, 0.0012) for name in INDUSTRIES}
    for idx, row in stocks.iterrows():
        code = row["ts_code"]
        industry = row["industry"]
        start_price = rng.uniform(8, 160) if idx >= len(BASE_STOCKS) else rng.uniform(20, 420)
        drift = industry_bias.get(industry, 0.0002) + rng.normal(0, 0.0005)
        vol_scale = rng.uniform(0.012, 0.04)
        prices = [start_price]
        for _ in dates[1:]:
            ret = np.clip(rng.normal(drift, vol_scale), -0.105, 0.105)
            prices.append(max(1.5, prices[-1] * (1 + ret)))

        shares = rng.uniform(4e8, 45e9)
        free_ratio = rng.uniform(0.25, 0.9)
        prev_close = prices[0]
        for d, close in zip(dates, prices):
            pct_chg = (close / prev_close - 1) * 100 if prev_close else 0
            open_price = prev_close * (1 + rng.normal(0, 0.012))
            high = max(open_price, close) * (1 + abs(rng.normal(0, 0.012)))
            low = min(open_price, close) * (1 - abs(rng.normal(0, 0.012)))
            volume = rng.uniform(2e5, 2e7)
            amount = volume * close / 1000
            turnover = min(35, volume * 100 / (shares * free_ratio))
            volume_ratio = max(0.2, rng.normal(1.1 + abs(pct_chg) / 8, 0.45))
            pe = max(4, rng.normal(28, 18))
            pb = max(0.4, rng.normal(3.0, 1.6))
            total_mv = close * shares / 10000
            circ_mv = total_mv * free_ratio
            limit_status = 0
            if pct_chg >= 9.7:
                limit_status = 2
            elif pct_chg <= -9.7:
                limit_status = 5
            elif pct_chg > 0:
                limit_status = 1
            elif pct_chg < 0:
                limit_status = 4
            net_flow = amount * rng.normal(np.sign(pct_chg) * 0.03, 0.08)
            rows.append(
                {
                    "ts_code": code,
                    "trade_date": d,
                    "open": round(open_price, 2),
                    "high": round(high, 2),
                    "low": round(low, 2),
                    "close": round(close, 2),
                    "pre_close": round(prev_close, 2),
                    "change": round(close - prev_close, 2),
                    "pct_chg": round(pct_chg, 2),
                    "vol": round(volume, 2),
                    "amount": round(amount, 2),
                }
            )
            basic_rows.append(
                {
                    "ts_code": code,
                    "trade_date": d,
                    "close": round(close, 2),
                    "turnover_rate": round(turnover, 3),
                    "turnover_rate_f": round(turnover / max(free_ratio, 0.1), 3),
                    "volume_ratio": round(volume_ratio, 3),
                    "pe": round(pe, 2),
                    "pe_ttm": round(pe * rng.uniform(0.85, 1.15), 2),
                    "pb": round(pb, 2),
                    "ps": round(max(0.2, rng.normal(4, 2)), 2),
                    "ps_ttm": round(max(0.2, rng.normal(4, 2)), 2),
                    "total_mv": round(total_mv, 2),
                    "circ_mv": round(circ_mv, 2),
                    "limit_status": limit_status,
                }
            )
            buy_lg = max(0, amount * rng.uniform(0.08, 0.22))
            sell_lg = max(0, buy_lg - net_flow * rng.uniform(0.3, 0.7))
            flow_rows.append(
                {
                    "ts_code": code,
                    "trade_date": d,
                    "buy_lg_amount": round(buy_lg, 2),
                    "sell_lg_amount": round(sell_lg, 2),
                    "buy_elg_amount": round(buy_lg * rng.uniform(0.2, 0.55), 2),
                    "sell_elg_amount": round(sell_lg * rng.uniform(0.2, 0.55), 2),
                    "net_mf_amount": round(net_flow, 2),
                }
            )
            prev_close = close

    daily = pd.DataFrame(rows)
    daily_basic = pd.DataFrame(basic_rows)
    moneyflow = pd.DataFrame(flow_rows)
    index_daily = _make_index_daily(daily)
    limit_list = _make_limit_list(daily, stocks)
    return {
        "stock_basic": stocks,
        "daily": daily,
        "daily_basic": daily_basic,
        "moneyflow": moneyflow,
        "index_daily": index_daily,
        "index_dailybasic": _make_index_basic(index_daily),
        "limit_list_d": limit_list,
    }


def _make_index_daily(daily: pd.DataFrame) -> pd.DataFrame:
    rows: list[dict[str, float | str]] = []
    index_defs = {
        "000001.SH": ("上证指数", 3100),
        "399001.SZ": ("深证成指", 10000),
        "399006.SZ": ("创业板指", 2100),
        "000300.SH": ("沪深300", 3700),
        "000905.SH": ("中证500", 5700),
    }
    grouped = daily.groupby("trade_date")
    for code, (_, base) in index_defs.items():
        close = base
        for trade_date, day in grouped:
            pct = day["pct_chg"].mean() / 100 + (hash(code) % 13 - 6) / 10000
            pre_close = close
            close = max(800, close * (1 + pct))
            rows.append(
                {
                    "ts_code": code,
                    "trade_date": trade_date,
                    "close": round(close, 2),
                    "open": round(pre_close * (1 + pct * 0.2), 2),
                    "high": round(max(pre_close, close) * 1.008, 2),
                    "low": round(min(pre_close, close) * 0.992, 2),
                    "pre_close": round(pre_close, 2),
                    "change": round(close - pre_close, 2),
                    "pct_chg": round(pct * 100, 2),
                    "vol": round(day["vol"].sum() / 5, 2),
                    "amount": round(day["amount"].sum() / 5, 2),
                }
            )
    return pd.DataFrame(rows)


def _make_index_basic(index_daily: pd.DataFrame) -> pd.DataFrame:
    df = index_daily[["ts_code", "trade_date"]].copy()
    df["turnover_rate"] = 0.8
    df["turnover_rate_f"] = 1.1
    df["pe"] = 15.0
    df["pe_ttm"] = 14.5
    df["pb"] = 1.4
    df["total_mv"] = 8.8e13
    df["float_mv"] = 6.2e13
    df["total_share"] = 1.0e12
    df["float_share"] = 7.0e11
    df["free_share"] = 6.0e11
    return df


def _make_limit_list(daily: pd.DataFrame, stocks: pd.DataFrame) -> pd.DataFrame:
    names = stocks.set_index("ts_code")["name"].to_dict()
    latest = daily[(daily["pct_chg"] >= 9.7) | (daily["pct_chg"] <= -9.7)].copy()
    if latest.empty:
        latest = daily.sort_values(["trade_date", "pct_chg"], ascending=[True, False]).groupby("trade_date").head(2)
    latest["name"] = latest["ts_code"].map(names)
    latest["limit"] = np.where(latest["pct_chg"] >= 0, "U", "D")
    latest["status"] = np.where(latest["pct_chg"] >= 0, "涨停", "跌停")
    return latest[["trade_date", "ts_code", "name", "close", "pct_chg", "limit", "status"]]
