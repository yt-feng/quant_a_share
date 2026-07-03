import pandas as pd

from quant_a_share.indicators import add_indicators, macd, rsi


def test_indicators_add_expected_columns():
    df = pd.DataFrame(
        {
            "ts_code": ["000001.SZ"] * 40,
            "trade_date": [f"202601{i + 1:02d}" for i in range(28)] + [f"202602{i + 1:02d}" for i in range(12)],
            "open": [10 + i * 0.1 for i in range(40)],
            "high": [10.2 + i * 0.1 for i in range(40)],
            "low": [9.8 + i * 0.1 for i in range(40)],
            "close": [10 + i * 0.1 for i in range(40)],
            "pre_close": [9.9 + i * 0.1 for i in range(40)],
            "pct_chg": [1.0] * 40,
            "vol": [1000 + i for i in range(40)],
            "amount": [10000 + i for i in range(40)],
        }
    )
    out = add_indicators(df)
    for column in ["ma5", "ma20", "ema14", "ema26", "rsi14", "macd_dif", "kdj_k", "td_buy_setup"]:
        assert column in out.columns
    assert len(out) == len(df)


def test_macd_and_rsi_lengths_match_input():
    close = pd.Series([10, 10.2, 10.1, 10.4, 10.6, 10.5, 10.8, 11])
    assert len(macd(close)) == len(close)
    assert len(rsi(close, 3)) == len(close)
