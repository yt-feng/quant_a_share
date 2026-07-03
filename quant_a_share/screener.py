from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

import numpy as np
import pandas as pd

from .indicators import add_indicators, compute_rps


@dataclass(frozen=True)
class Factor:
    key: str
    label: str
    group: str
    description: str


FACTOR_CATALOG: list[Factor] = [
    Factor("pe_le_30", "市盈率≤30", "基础与板块 / 估值与市值", "PE 在 0 到 30 之间"),
    Factor("pb_le_3", "市净率≤3", "基础与板块 / 估值与市值", "PB 小于等于 3"),
    Factor("total_mv_ge_500", "总市值≥500亿", "基础与板块 / 估值与市值", "总市值不低于 500 亿"),
    Factor("total_mv_50_200", "总市值50亿-200亿", "基础与板块 / 估值与市值", "中小市值区间"),
    Factor("circ_mv_ge_100", "流通市值≥100亿", "基础与板块 / 估值与市值", "流通市值不低于 100 亿"),
    Factor("circ_mv_le_50", "流通市值≤50亿", "基础与板块 / 估值与市值", "流通市值不超过 50 亿"),
    Factor("limit_up_today", "今日涨停", "基础与板块 / 量能与活跃度", "当日接近涨停或涨停状态"),
    Factor("turnover_ge_3", "换手率≥3%", "基础与板块 / 量能与活跃度", "换手率不低于 3%"),
    Factor("turnover_lt_1", "换手率<1%(低)", "基础与板块 / 量能与活跃度", "换手率低于 1%"),
    Factor("volume_ratio_ge_15", "量比≥1.5", "基础与板块 / 量能与活跃度", "量比不低于 1.5"),
    Factor("amount_ge_1e", "成交额≥1亿", "基础与板块 / 量能与活跃度", "成交额不低于 1 亿"),
    Factor("volume_signal", "倍量信号", "基础与板块 / 量能与活跃度", "量比与成交额同步放大"),
    Factor("amp_ge_8", "振幅≥8%(活跃)", "基础与板块 / 量能与活跃度", "日内振幅不低于 8%"),
    Factor("sector_rps50_ge_80", "板块RPS50≥80", "基础与板块 / 行业强度", "所属行业 50 日强度靠前"),
    Factor("in_sector_rps50_ge_80", "个股/板块RPS≥80", "基础与板块 / 行业强度", "个股在所属行业内相对强"),
    Factor("above_ma5", "站上MA5", "趋势与均线", "收盘价高于 5 日均线"),
    Factor("above_ma10", "站上MA10", "趋势与均线", "收盘价高于 10 日均线"),
    Factor("above_ma20", "站上MA20", "趋势与均线", "收盘价高于 20 日均线"),
    Factor("above_ma60", "站上MA60", "趋势与均线", "收盘价高于 60 日均线"),
    Factor("above_ma90", "站上MA90", "趋势与均线", "收盘价高于 90 日均线"),
    Factor("above_ma144", "站上MA144", "趋势与均线", "收盘价高于 144 日均线"),
    Factor("rps50_ge_70", "RPS50≥70", "趋势与均线", "50 日相对强度不低于 70"),
    Factor("rps120_ge_70", "RPS120≥70", "趋势与均线", "120 日相对强度不低于 70"),
    Factor("rps_combo_ge_80", "RPS综合≥80", "趋势与均线", "50/120 日综合强度靠前"),
    Factor("ema14_gt_ema26", "EMA14>EMA26", "趋势与均线", "短期 EMA 高于中期 EMA"),
    Factor("macd_golden", "MACD金叉", "技术与资金 / 动量与形态", "DIF 上穿 DEA 或位于 DEA 上方且动能改善"),
    Factor("kdj_golden", "KDJ金叉", "技术与资金 / 动量与形态", "K 上穿 D 或位于 D 上方"),
    Factor("rsi_oversold", "RSI超卖", "技术与资金 / 动量与形态", "RSI 小于 35"),
    Factor("rsi_overbought", "RSI超买", "技术与资金 / 动量与形态", "RSI 大于 70"),
    Factor("long_upper_shadow", "长上影线", "技术与资金 / 动量与形态", "K 线出现长上影"),
    Factor("long_lower_shadow", "长下影线", "技术与资金 / 动量与形态", "K 线出现长下影"),
    Factor("control_ge_50", "庄家控盘>50", "技术与资金 / 主力资金与成本", "趋势、资金和量能合成控盘分大于 50"),
    Factor("main_accumulation", "主力吸筹", "技术与资金 / 主力资金与成本", "大单净流入且价格未明显冲高"),
    Factor("strong_accumulation", "强势吸筹选股", "技术与资金 / 主力资金与成本", "主力净流入、趋势向上且量能放大"),
    Factor("strong_accumulation_3", "强势吸筹3+条件", "技术与资金 / 主力资金与成本", "吸筹、趋势、量能、行业强度至少三项满足"),
    Factor("main_attack", "主力攻击", "技术与资金 / 主力资金与成本", "大单净流入、涨幅为正且放量"),
    Factor("main_trigger", "主力触发", "技术与资金 / 主力资金与成本", "资金和动量同步转强"),
    Factor("money_rsi_strong", "资金RSI强(>50)", "技术与资金 / 主力资金与成本", "资金强度分高于 50"),
    Factor("break_cost20", "突破20日成本", "技术与资金 / 主力资金与成本", "收盘价突破 20 日成本线"),
    Factor("break_cost60", "突破60日成本", "技术与资金 / 主力资金与成本", "收盘价突破 60 日成本线"),
    Factor("rsi_v_reduce", "RSI_V减仓信号", "技术与资金 / 主力资金与成本", "RSI 过热且量能走弱"),
    Factor("vwap_score_ge_5", "VWAP趋势分≥5", "技术与资金 / VWAP与高斯", "VWAP 趋势评分不低于 5"),
    Factor("vwap_long", "VWAP允许做多", "技术与资金 / VWAP与高斯", "价格在 VWAP 上方且趋势未走弱"),
    Factor("vwap_pullback", "VWAP低吸回踩", "技术与资金 / VWAP与高斯", "价格贴近 VWAP 且没有破位"),
    Factor("vwap_break_volume", "VWAP突破放量", "技术与资金 / VWAP与高斯", "突破 VWAP 且量能放大"),
    Factor("vwap_accel", "VWAP加速", "技术与资金 / VWAP与高斯", "价格沿 VWAP 上方加速"),
    Factor("vwap_position", "VWAP位置", "技术与资金 / VWAP与高斯", "价格处于 VWAP 上方合理区间"),
    Factor("entry_signal", "入场信号", "技术与资金 / VWAP与高斯", "趋势、资金和位置同步满足"),
    Factor("gauss_up", "高斯趋势向上", "技术与资金 / VWAP与高斯", "短中均线斜率向上"),
    Factor("gauss_start", "高斯趋势起航", "技术与资金 / VWAP与高斯", "趋势刚刚转强"),
    Factor("gauss_turn_up", "高斯拐头向上", "技术与资金 / VWAP与高斯", "均线斜率由弱转强"),
    Factor("super_resonance", "★超级共振★", "信号与形态 / 共振与转强", "趋势、资金、行业、量能多项共振"),
    Factor("resonance_main", "共振:主力拉升", "信号与形态 / 共振与转强", "主力攻击叠加趋势向上"),
    Factor("resonance_trend", "共振:趋势起航", "信号与形态 / 共振与转强", "趋势起航叠加行业强度"),
    Factor("auction_turn_strong", "★竞价弱转强★", "信号与形态 / 共振与转强", "低开或弱势后收复关键均线"),
    Factor("near_support60", "60日支撑附近", "信号与形态 / 支撑阻力", "接近 60 日支撑线"),
    Factor("near_support144", "144日支撑附近", "信号与形态 / 支撑阻力", "接近 144 日支撑线"),
    Factor("break_resistance60", "突破60日压力", "信号与形态 / 支撑阻力", "突破 60 日高点"),
    Factor("break_resistance144", "突破144日压力", "信号与形态 / 支撑阻力", "突破 144 日高点"),
    Factor("chan_bottom", "缠论底分型", "信号与形态 / 缠论与形态", "近三日低点抬升结构"),
    Factor("chan_top", "缠论顶分型", "信号与形态 / 缠论与形态", "近三日高点回落结构"),
    Factor("chan_buy3", "缠论三买", "信号与形态 / 缠论与形态", "突破后回踩不破再转强"),
    Factor("chan_sell3", "缠论三卖", "信号与形态 / 缠论与形态", "跌破后反抽不过再转弱"),
    Factor("pivot_start", "中枢开始", "信号与形态 / 缠论与形态", "波动收敛进入震荡"),
    Factor("pivot_end", "中枢结束", "信号与形态 / 缠论与形态", "波动放大脱离震荡"),
    Factor("pivot_break_up", "中枢向上突破", "信号与形态 / 缠论与形态", "突破震荡高点"),
    Factor("gann_1_1", "江恩1:1支撑", "信号与形态 / 缠论与形态", "靠近 20 日斜率支撑"),
    Factor("gann_1_2", "江恩1:2支撑", "信号与形态 / 缠论与形态", "靠近 60 日斜率支撑"),
    Factor("gann_2_1", "江恩2:1支撑", "信号与形态 / 缠论与形态", "强趋势中的浅回踩支撑"),
    Factor("bullish_engulf", "看涨吞没", "信号与形态 / 缠论与形态", "出现看涨吞没"),
    Factor("morning_star", "早晨之星", "信号与形态 / 缠论与形态", "出现早晨之星"),
    Factor("td_buy9", "TD买入结构9", "信号与形态 / TD序列", "TD 买入计数达到 9"),
    Factor("td_buy13", "TD13买入优选", "信号与形态 / TD序列", "TD 买入计数延伸到 13"),
    Factor("td_sell9", "TD卖出结构9", "信号与形态 / TD序列", "TD 卖出计数达到 9"),
    Factor("td_sell13", "TD13卖出优选", "信号与形态 / TD序列", "TD 卖出计数延伸到 13"),
]


def catalog_by_group() -> dict[str, list[Factor]]:
    groups: dict[str, list[Factor]] = {}
    for factor in FACTOR_CATALOG:
        groups.setdefault(factor.group, []).append(factor)
    return groups


def build_feature_frame(
    daily_window: pd.DataFrame,
    daily_basic: pd.DataFrame,
    stock_basic: pd.DataFrame,
    moneyflow: pd.DataFrame | None = None,
    max_symbols: int | None = None,
) -> pd.DataFrame:
    if daily_window.empty:
        return pd.DataFrame()
    work = daily_window.copy()
    work["trade_date"] = work["trade_date"].astype(str)
    if max_symbols:
        symbols = work.groupby("ts_code")["amount"].sum().nlargest(max_symbols).index
        work = work[work["ts_code"].isin(symbols)]
    latest_rows = []
    for _, group in work.groupby("ts_code", sort=False):
        enriched = add_indicators(group)
        latest_rows.append(enriched.iloc[-1])
    features = pd.DataFrame(latest_rows).reset_index(drop=True)
    features["rps_50"] = features["ts_code"].map(compute_rps(work, 50)).fillna(50)
    features["rps_120"] = features["ts_code"].map(compute_rps(work, 120)).fillna(features["rps_50"])
    features["rps_combo"] = features[["rps_50", "rps_120"]].mean(axis=1)

    latest_date = features["trade_date"].max()
    basic_latest = daily_basic.copy()
    if not basic_latest.empty and "trade_date" in basic_latest.columns:
        basic_latest["trade_date"] = basic_latest["trade_date"].astype(str)
        day_basic = basic_latest[basic_latest["trade_date"] == latest_date]
        if day_basic.empty:
            day_basic = basic_latest.sort_values("trade_date").groupby("ts_code").tail(1)
    else:
        day_basic = pd.DataFrame()
    if not day_basic.empty:
        features = features.merge(day_basic.drop(columns=["close"], errors="ignore"), on=["ts_code", "trade_date"], how="left", suffixes=("", "_basic"))

    base_cols = ["ts_code", "symbol", "name", "area", "industry", "market", "list_date"]
    base = stock_basic[[c for c in base_cols if c in stock_basic.columns]].copy()
    features = features.merge(base, on="ts_code", how="left")

    if moneyflow is not None and not moneyflow.empty:
        flow = moneyflow.copy()
        flow["trade_date"] = flow["trade_date"].astype(str)
        flow_latest = flow[flow["trade_date"] == latest_date]
        if flow_latest.empty:
            flow_latest = flow.sort_values("trade_date").groupby("ts_code").tail(1)
        features = features.merge(flow_latest, on=["ts_code", "trade_date"], how="left")
    if "net_mf_amount" not in features.columns:
        features["net_mf_amount"] = 0.0

    features = _add_derived_features(features)
    return features


def _add_derived_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    for col in ["total_mv", "circ_mv", "amount", "net_mf_amount", "turnover_rate", "volume_ratio", "pe", "pb"]:
        if col not in out.columns:
            out[col] = np.nan
    out["change_pct"] = out.get("pct_chg", 0)
    out["amount_yi"] = out["amount"].fillna(0) / 100000
    out["net_mf_yi"] = out["net_mf_amount"].fillna(0) / 100000
    out["total_mv_yi"] = out["total_mv"].fillna(0) / 10000
    out["circ_mv_yi"] = out["circ_mv"].fillna(0) / 10000
    out["amplitude"] = (out["high"] - out["low"]) / out["pre_close"].replace(0, np.nan) * 100
    out["macd_state"] = np.where(out["macd_dif"] >= out["macd_dea"], "金叉区", "死叉区")
    out["volume_signal_text"] = np.where(out["volume_ratio"].fillna(1) >= 1.5, "放量", "常量")
    out["money_strength"] = (
        out["net_mf_yi"].rank(pct=True).fillna(0.5) * 50
        + out["change_pct"].rank(pct=True).fillna(0.5) * 25
        + out["volume_ratio"].rank(pct=True).fillna(0.5) * 25
    )
    out["control_score"] = (
        (out["close"] > out["ma20"]).astype(int) * 20
        + (out["ma20"] > out["ma60"]).astype(int) * 20
        + (out["net_mf_yi"] > 0).astype(int) * 20
        + (out["rps_50"] >= 70).astype(int) * 20
        + (out["volume_ratio"] >= 1.2).astype(int) * 20
    )
    sector_strength = out.groupby("industry")["rps_50"].transform("mean")
    out["sector_rps_50"] = sector_strength.rank(pct=True) * 100
    out["in_sector_rps_50"] = out.groupby("industry")["rps_50"].rank(pct=True) * 100
    out["vwap_score"] = (
        (out["close"] > out["vwap"]).astype(int) * 2
        + (out["vwap"] > out["ma20"]).astype(int) * 2
        + (out["volume_ratio"] >= 1.2).astype(int)
        + (out["net_mf_yi"] > 0).astype(int)
        + (out["change_pct"] > 0).astype(int)
    )
    out["trend_slope"] = (out["ma20"] - out["ma60"]) / out["ma60"].replace(0, np.nan) * 100
    out["gauss_score"] = (
        (out["ma5"] > out["ma10"]).astype(int)
        + (out["ma10"] > out["ma20"]).astype(int)
        + (out["ma20"] > out["ma60"]).astype(int)
        + (out["trend_slope"] > 0).astype(int)
    )
    out["support_line_next"] = out[["ma20", "ma60", "rolling_low_60"]].mean(axis=1)
    out["resistance_line_60"] = out["rolling_high_60"]
    return out


def factor_mask(df: pd.DataFrame, key: str) -> pd.Series:
    rules: dict[str, Callable[[pd.DataFrame], pd.Series]] = {
        "pe_le_30": lambda x: x["pe"].between(0, 30, inclusive="both"),
        "pb_le_3": lambda x: x["pb"].le(3),
        "total_mv_ge_500": lambda x: x["total_mv_yi"].ge(500),
        "total_mv_50_200": lambda x: x["total_mv_yi"].between(50, 200, inclusive="both"),
        "circ_mv_ge_100": lambda x: x["circ_mv_yi"].ge(100),
        "circ_mv_le_50": lambda x: x["circ_mv_yi"].le(50),
        "limit_up_today": lambda x: (x.get("limit_status", 0).isin([2, 3])) | x["change_pct"].ge(9.7),
        "turnover_ge_3": lambda x: x["turnover_rate"].ge(3),
        "turnover_lt_1": lambda x: x["turnover_rate"].lt(1),
        "volume_ratio_ge_15": lambda x: x["volume_ratio"].ge(1.5),
        "amount_ge_1e": lambda x: x["amount_yi"].ge(1),
        "volume_signal": lambda x: x["volume_ratio"].ge(1.5) & x["amount_yi"].ge(1),
        "amp_ge_8": lambda x: x["amplitude"].ge(8),
        "sector_rps50_ge_80": lambda x: x["sector_rps_50"].ge(80),
        "in_sector_rps50_ge_80": lambda x: x["in_sector_rps_50"].ge(80),
        "above_ma5": lambda x: x["close"].gt(x["ma5"]),
        "above_ma10": lambda x: x["close"].gt(x["ma10"]),
        "above_ma20": lambda x: x["close"].gt(x["ma20"]),
        "above_ma60": lambda x: x["close"].gt(x["ma60"]),
        "above_ma90": lambda x: x["close"].gt(x["ma90"]),
        "above_ma144": lambda x: x["close"].gt(x["ma144"]),
        "rps50_ge_70": lambda x: x["rps_50"].ge(70),
        "rps120_ge_70": lambda x: x["rps_120"].ge(70),
        "rps_combo_ge_80": lambda x: x["rps_combo"].ge(80),
        "ema14_gt_ema26": lambda x: x["ema14"].gt(x["ema26"]),
        "macd_golden": lambda x: x["macd_dif"].gt(x["macd_dea"]) & x["macd_hist"].gt(0),
        "kdj_golden": lambda x: x["kdj_k"].gt(x["kdj_d"]),
        "rsi_oversold": lambda x: x["rsi14"].lt(35),
        "rsi_overbought": lambda x: x["rsi14"].gt(70),
        "long_upper_shadow": lambda x: x["candle_patterns"].fillna("").str.contains("长上影线"),
        "long_lower_shadow": lambda x: x["candle_patterns"].fillna("").str.contains("长下影线"),
        "control_ge_50": lambda x: x["control_score"].gt(50),
        "main_accumulation": lambda x: x["net_mf_yi"].gt(0) & x["change_pct"].between(-3, 4),
        "strong_accumulation": lambda x: x["net_mf_yi"].gt(0) & x["close"].gt(x["ma20"]) & x["volume_ratio"].ge(1.2),
        "strong_accumulation_3": lambda x: (
            (x["net_mf_yi"].gt(0)).astype(int)
            + (x["close"].gt(x["ma20"])).astype(int)
            + (x["volume_ratio"].ge(1.2)).astype(int)
            + (x["sector_rps_50"].ge(70)).astype(int)
        ).ge(3),
        "main_attack": lambda x: x["net_mf_yi"].gt(0) & x["change_pct"].gt(1) & x["volume_ratio"].ge(1.2),
        "main_trigger": lambda x: x["net_mf_yi"].gt(0) & x["macd_dif"].gt(x["macd_dea"]),
        "money_rsi_strong": lambda x: x["money_strength"].gt(50),
        "break_cost20": lambda x: x["close"].gt(x["ma20"]),
        "break_cost60": lambda x: x["close"].gt(x["ma60"]),
        "rsi_v_reduce": lambda x: x["rsi14"].gt(70) & x["volume_ratio"].lt(1),
        "vwap_score_ge_5": lambda x: x["vwap_score"].ge(5),
        "vwap_long": lambda x: x["close"].gt(x["vwap"]) & x["trend_slope"].ge(0),
        "vwap_pullback": lambda x: ((x["close"] - x["vwap"]).abs() / x["vwap"]).lt(0.025) & x["close"].gt(x["ma20"] * 0.98),
        "vwap_break_volume": lambda x: x["close"].gt(x["vwap"]) & x["volume_ratio"].ge(1.5),
        "vwap_accel": lambda x: x["close"].gt(x["vwap"]) & x["change_pct"].gt(2),
        "vwap_position": lambda x: x["close"].between(x["vwap"] * 0.98, x["vwap"] * 1.08),
        "entry_signal": lambda x: x["vwap_score"].ge(5) & x["net_mf_yi"].gt(0) & x["rps_50"].ge(60),
        "gauss_up": lambda x: x["gauss_score"].ge(3),
        "gauss_start": lambda x: x["gauss_score"].ge(3) & x["change_pct"].gt(0),
        "gauss_turn_up": lambda x: x["trend_slope"].gt(0) & x["change_pct"].gt(0),
        "super_resonance": lambda x: factor_mask(x, "strong_accumulation_3") & factor_mask(x, "vwap_score_ge_5") & factor_mask(x, "rps_combo_ge_80"),
        "resonance_main": lambda x: factor_mask(x, "main_attack") & x["close"].gt(x["ma20"]),
        "resonance_trend": lambda x: factor_mask(x, "gauss_start") & x["sector_rps_50"].ge(70),
        "auction_turn_strong": lambda x: x["change_pct"].gt(0) & x["close"].gt(x["ma5"]) & x["pre_close"].lt(x["ma5"].fillna(x["pre_close"]) * 1.02),
        "near_support60": lambda x: (x["close"] - x["ma60"]).abs() / x["ma60"].replace(0, np.nan) < 0.035,
        "near_support144": lambda x: (x["close"] - x["ma144"]).abs() / x["ma144"].replace(0, np.nan) < 0.04,
        "break_resistance60": lambda x: x["close"].gt(x["rolling_high_60"] * 0.995),
        "break_resistance144": lambda x: x["close"].gt(x["rolling_high_144"] * 0.995),
        "chan_bottom": lambda x: x["low"].gt(x["low"].shift(1).fillna(x["low"] * 0.99)) & x["change_pct"].gt(0),
        "chan_top": lambda x: x["high"].lt(x["high"].shift(1).fillna(x["high"] * 1.01)) & x["change_pct"].lt(0),
        "chan_buy3": lambda x: x["close"].gt(x["ma20"]) & x["low"].le(x["ma20"] * 1.03) & x["change_pct"].gt(0),
        "chan_sell3": lambda x: x["close"].lt(x["ma20"]) & x["high"].ge(x["ma20"] * 0.97) & x["change_pct"].lt(0),
        "pivot_start": lambda x: x["amplitude"].lt(3) & x["volume_ratio"].lt(1.2),
        "pivot_end": lambda x: x["amplitude"].gt(5) & x["volume_ratio"].gt(1.2),
        "pivot_break_up": lambda x: x["close"].gt(x["rolling_high_60"] * 0.99),
        "gann_1_1": lambda x: (x["close"] - x["ma20"]).abs() / x["ma20"].replace(0, np.nan) < 0.03,
        "gann_1_2": lambda x: (x["close"] - x["ma60"]).abs() / x["ma60"].replace(0, np.nan) < 0.04,
        "gann_2_1": lambda x: x["close"].gt(x["ma20"]) & x["change_pct"].between(-2, 3),
        "bullish_engulf": lambda x: x["candle_patterns"].fillna("").str.contains("看涨吞没"),
        "morning_star": lambda x: x["candle_patterns"].fillna("").str.contains("早晨之星"),
        "td_buy9": lambda x: x["td_buy_setup"].ge(9),
        "td_buy13": lambda x: x["td_buy_setup"].ge(13),
        "td_sell9": lambda x: x["td_sell_setup"].ge(9),
        "td_sell13": lambda x: x["td_sell_setup"].ge(13),
    }
    if key not in rules:
        return pd.Series(True, index=df.index)
    mask = rules[key](df)
    return mask.fillna(False)


def apply_factors(df: pd.DataFrame, selected_keys: list[str]) -> pd.DataFrame:
    if df.empty or not selected_keys:
        return df.copy()
    out = df.copy()
    mask = pd.Series(True, index=out.index)
    for key in selected_keys:
        if key == "super_resonance":
            mask &= (
                factor_mask(out, "strong_accumulation_3")
                & factor_mask(out, "vwap_score_ge_5")
                & factor_mask(out, "rps_combo_ge_80")
            )
        else:
            mask &= factor_mask(out, key)
    return out[mask].copy()


def apply_custom_conditions(df: pd.DataFrame, conditions: list[dict[str, str | float]]) -> pd.DataFrame:
    if df.empty:
        return df.copy()
    out = df.copy()
    mask = pd.Series(True, index=out.index)
    for condition in conditions:
        field = str(condition.get("field", ""))
        op = str(condition.get("op", ">="))
        value = condition.get("value", 0)
        if field not in out.columns:
            continue
        series = pd.to_numeric(out[field], errors="coerce")
        val = float(value)
        if op == ">=":
            mask &= series >= val
        elif op == "<=":
            mask &= series <= val
        elif op == ">":
            mask &= series > val
        elif op == "<":
            mask &= series < val
        elif op == "==":
            mask &= series == val
    return out[mask].copy()


def display_columns() -> list[str]:
    return [
        "ts_code",
        "name",
        "close",
        "change_pct",
        "volume_signal_text",
        "macd_state",
        "circ_mv_yi",
        "sector_rps_50",
        "in_sector_rps_50",
        "industry",
        "candle_patterns",
        "support_line_next",
        "resistance_line_60",
        "rps_50",
        "rps_120",
        "net_mf_yi",
    ]
