from __future__ import annotations

import numpy as np
import pandas as pd


def _series(values: pd.Series | np.ndarray | list[float]) -> pd.Series:
    return pd.Series(values, dtype="float64")


def ma(series: pd.Series, window: int) -> pd.Series:
    return _series(series).rolling(window, min_periods=max(2, window // 3)).mean()


def ema(series: pd.Series, span: int) -> pd.Series:
    return _series(series).ewm(span=span, adjust=False).mean()


def macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> pd.DataFrame:
    close = _series(series)
    dif = ema(close, fast) - ema(close, slow)
    dea = ema(dif, signal)
    hist = (dif - dea) * 2
    return pd.DataFrame({"macd_dif": dif, "macd_dea": dea, "macd_hist": hist})


def rsi(series: pd.Series, window: int = 14) -> pd.Series:
    close = _series(series)
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(window, min_periods=window // 2).mean()
    loss = (-delta.clip(upper=0)).rolling(window, min_periods=window // 2).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def kdj(high: pd.Series, low: pd.Series, close: pd.Series, n: int = 9) -> pd.DataFrame:
    high_n = _series(high).rolling(n, min_periods=n // 2).max()
    low_n = _series(low).rolling(n, min_periods=n // 2).min()
    rsv = (_series(close) - low_n) / (high_n - low_n).replace(0, np.nan) * 100
    k = rsv.ewm(com=2, adjust=False).mean()
    d = k.ewm(com=2, adjust=False).mean()
    j = 3 * k - 2 * d
    return pd.DataFrame({"kdj_k": k, "kdj_d": d, "kdj_j": j})


def vwap(close: pd.Series, volume: pd.Series) -> pd.Series:
    price = _series(close)
    vol = _series(volume).replace(0, np.nan)
    return (price * vol).cumsum() / vol.cumsum()


def td_setup(close: pd.Series) -> pd.DataFrame:
    close = _series(close)
    buy = []
    sell = []
    buy_count = sell_count = 0
    for i, value in enumerate(close):
        if i < 4 or pd.isna(value) or pd.isna(close.iloc[i - 4]):
            buy_count = sell_count = 0
        elif value < close.iloc[i - 4]:
            buy_count += 1
            sell_count = 0
        elif value > close.iloc[i - 4]:
            sell_count += 1
            buy_count = 0
        else:
            buy_count = sell_count = 0
        buy.append(buy_count)
        sell.append(sell_count)
    return pd.DataFrame({"td_buy_setup": buy, "td_sell_setup": sell})


def candle_patterns(df: pd.DataFrame) -> pd.Series:
    body = (df["close"] - df["open"]).abs()
    upper = df["high"] - df[["open", "close"]].max(axis=1)
    lower = df[["open", "close"]].min(axis=1) - df["low"]
    prev_open = df["open"].shift(1)
    prev_close = df["close"].shift(1)
    bullish_engulf = (df["close"] > df["open"]) & (prev_close < prev_open) & (df["close"] >= prev_open) & (df["open"] <= prev_close)
    morning_star = (prev_close < prev_open) & (df["close"] > df["open"]) & (df["close"] > (prev_open + prev_close) / 2)
    patterns = []
    for idx in df.index:
        labels = []
        if upper.loc[idx] > body.loc[idx] * 1.8:
            labels.append("长上影线")
        if lower.loc[idx] > body.loc[idx] * 1.8:
            labels.append("长下影线")
        if bullish_engulf.loc[idx]:
            labels.append("看涨吞没")
        if morning_star.loc[idx]:
            labels.append("早晨之星")
        patterns.append(",".join(labels))
    return pd.Series(patterns, index=df.index)


def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df.copy()
    out = df.sort_values("trade_date").copy()
    for window in [5, 10, 20, 50, 60, 90, 120, 144]:
        out[f"ma{window}"] = ma(out["close"], window)
    out["ema14"] = ema(out["close"], 14)
    out["ema26"] = ema(out["close"], 26)
    out["rsi14"] = rsi(out["close"], 14)
    out["vwap"] = vwap(out["close"], out.get("vol", pd.Series(1, index=out.index)))
    out = pd.concat([out.reset_index(drop=True), macd(out["close"]).reset_index(drop=True)], axis=1)
    out = pd.concat([out, kdj(out["high"], out["low"], out["close"]).reset_index(drop=True)], axis=1)
    out = pd.concat([out, td_setup(out["close"]).reset_index(drop=True)], axis=1)
    out["candle_patterns"] = candle_patterns(out)
    out["rolling_high_60"] = out["high"].rolling(60, min_periods=20).max()
    out["rolling_low_60"] = out["low"].rolling(60, min_periods=20).min()
    out["rolling_high_144"] = out["high"].rolling(144, min_periods=40).max()
    out["rolling_low_144"] = out["low"].rolling(144, min_periods=40).min()
    return out


def compute_rps(window: pd.DataFrame, days: int = 50) -> pd.Series:
    if window.empty:
        return pd.Series(dtype=float)
    piv = window.sort_values("trade_date").groupby("ts_code")
    latest = piv["close"].last()
    past = piv["close"].nth(-min(days, max(1, window["trade_date"].nunique())))
    perf = (latest / past.replace(0, np.nan) - 1) * 100
    return perf.rank(pct=True) * 100
