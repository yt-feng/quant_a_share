from quant_a_share.data_provider import TushareProvider
from quant_a_share.screener import apply_factors, build_feature_frame


def test_build_feature_frame_and_apply_basic_factor():
    provider = TushareProvider()
    daily = provider.market_window("20260101", "20260703")
    daily_basic = provider.daily_basic(start_date="20260101", end_date="20260703")
    moneyflow = provider.moneyflow(start_date="20260101", end_date="20260703")
    features = build_feature_frame(daily, daily_basic, provider.stock_basic(), moneyflow, max_symbols=50)
    assert not features.empty
    assert "rps_50" in features.columns
    assert "sector_rps_50" in features.columns
    filtered = apply_factors(features, ["above_ma20"])
    assert len(filtered) <= len(features)
