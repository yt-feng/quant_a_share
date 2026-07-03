from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from typing import Any

import pandas as pd

from .sample_data import display_date, generate_market_data, normalize_trade_date


def normalize_ts_code(value: str, stock_basic: pd.DataFrame | None = None) -> str:
    text = str(value or "").strip().upper()
    if not text:
        return ""
    if stock_basic is not None and "name" in stock_basic.columns:
        by_name = stock_basic[stock_basic["name"] == text]
        if not by_name.empty:
            return str(by_name.iloc[0]["ts_code"])
    if "." in text and len(text.split(".")[0]) == 6:
        return text
    digits = "".join(ch for ch in text if ch.isdigit())
    if len(digits) != 6:
        return text
    suffix = "SH" if digits.startswith(("5", "6", "9")) else "SZ"
    return f"{digits}.{suffix}"


@dataclass
class TushareProvider:
    token: str = ""
    demo_periods: int = 180
    demo_size: int = 90
    errors: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.token = (self.token or "").strip()
        self._ts: Any = None
        self._pro: Any = None
        self._sample: dict[str, pd.DataFrame] | None = None
        if self.token:
            try:
                import tushare as ts

                self._ts = ts
                self._pro = ts.pro_api(self.token)
            except Exception as exc:  # pragma: no cover - depends on local install/token
                self.errors.append(f"TuShare 初始化失败：{exc}")

    @property
    def online(self) -> bool:
        return self._pro is not None

    def _sample_data(self) -> dict[str, pd.DataFrame]:
        if self._sample is None:
            self._sample = generate_market_data(periods=self.demo_periods, n_extra=self.demo_size)
        return self._sample

    def query(self, api_name: str, fields: str | None = None, **params: Any) -> pd.DataFrame:
        clean_params = {key: value for key, value in params.items() if value not in (None, "")}
        if self._pro is None:
            return pd.DataFrame()
        try:
            if fields:
                return self._pro.query(api_name, fields=fields, **clean_params)
            return self._pro.query(api_name, **clean_params)
        except Exception as exc:  # pragma: no cover - depends on remote API
            self.errors.append(f"{api_name} 调用失败：{exc}")
            return pd.DataFrame()

    def latest_trade_date(self) -> str:
        today = normalize_trade_date(date.today())
        if self._pro is not None:
            start = (datetime.strptime(today, "%Y%m%d").date() - timedelta(days=14)).strftime("%Y%m%d")
            cal = self.query("trade_cal", exchange="", start_date=start, end_date=today)
            if not cal.empty and "is_open" in cal.columns:
                open_days = cal[cal["is_open"] == 1].sort_values("cal_date")
                if not open_days.empty:
                    return str(open_days.iloc[-1]["cal_date"])
        return today

    def stock_basic(self) -> pd.DataFrame:
        fields = "ts_code,symbol,name,area,industry,market,list_date"
        df = self.query("stock_basic", exchange="", list_status="L", fields=fields)
        if df.empty:
            return self._sample_data()["stock_basic"].copy()
        return df

    def daily(self, trade_date: str | None = None, start_date: str | None = None, end_date: str | None = None, ts_code: str = "") -> pd.DataFrame:
        fields = "ts_code,trade_date,open,high,low,close,pre_close,change,pct_chg,vol,amount"
        code = normalize_ts_code(ts_code, self.stock_basic()) if ts_code else ""
        df = self.query("daily", ts_code=code, trade_date=trade_date, start_date=start_date, end_date=end_date, fields=fields)
        if df.empty:
            sample = self._sample_data()["daily"].copy()
            if trade_date:
                sample = sample[sample["trade_date"] == normalize_trade_date(trade_date)]
            if start_date:
                sample = sample[sample["trade_date"] >= normalize_trade_date(start_date)]
            if end_date:
                sample = sample[sample["trade_date"] <= normalize_trade_date(end_date)]
            if code:
                sample = sample[sample["ts_code"] == code]
            return sample
        return df

    def daily_basic(self, trade_date: str | None = None, start_date: str | None = None, end_date: str | None = None, ts_code: str = "") -> pd.DataFrame:
        fields = (
            "ts_code,trade_date,close,turnover_rate,turnover_rate_f,volume_ratio,"
            "pe,pe_ttm,pb,ps,ps_ttm,total_mv,circ_mv,limit_status"
        )
        code = normalize_ts_code(ts_code, self.stock_basic()) if ts_code else ""
        df = self.query(
            "daily_basic",
            ts_code=code,
            trade_date=trade_date,
            start_date=start_date,
            end_date=end_date,
            fields=fields,
        )
        if df.empty:
            sample = self._sample_data()["daily_basic"].copy()
            if trade_date:
                sample = sample[sample["trade_date"] == normalize_trade_date(trade_date)]
            if start_date:
                sample = sample[sample["trade_date"] >= normalize_trade_date(start_date)]
            if end_date:
                sample = sample[sample["trade_date"] <= normalize_trade_date(end_date)]
            if code:
                sample = sample[sample["ts_code"] == code]
            return sample
        return df

    def moneyflow(self, trade_date: str | None = None, start_date: str | None = None, end_date: str | None = None, ts_code: str = "") -> pd.DataFrame:
        fields = "ts_code,trade_date,buy_lg_amount,sell_lg_amount,buy_elg_amount,sell_elg_amount,net_mf_amount"
        code = normalize_ts_code(ts_code, self.stock_basic()) if ts_code else ""
        df = self.query("moneyflow", ts_code=code, trade_date=trade_date, start_date=start_date, end_date=end_date, fields=fields)
        if df.empty:
            sample = self._sample_data()["moneyflow"].copy()
            if trade_date:
                sample = sample[sample["trade_date"] == normalize_trade_date(trade_date)]
            if start_date:
                sample = sample[sample["trade_date"] >= normalize_trade_date(start_date)]
            if end_date:
                sample = sample[sample["trade_date"] <= normalize_trade_date(end_date)]
            if code:
                sample = sample[sample["ts_code"] == code]
            return sample
        return df

    def index_daily(self, ts_code: str = "000001.SH", start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        fields = "ts_code,trade_date,open,high,low,close,pre_close,change,pct_chg,vol,amount"
        df = self.query("index_daily", ts_code=ts_code, start_date=start_date, end_date=end_date, fields=fields)
        if df.empty:
            sample = self._sample_data()["index_daily"].copy()
            sample = sample[sample["ts_code"] == ts_code]
            if start_date:
                sample = sample[sample["trade_date"] >= normalize_trade_date(start_date)]
            if end_date:
                sample = sample[sample["trade_date"] <= normalize_trade_date(end_date)]
            return sample
        return df

    def index_dailybasic(self, trade_date: str | None = None, ts_code: str = "") -> pd.DataFrame:
        fields = "ts_code,trade_date,total_mv,float_mv,total_share,float_share,free_share,turnover_rate,turnover_rate_f,pe,pe_ttm,pb"
        df = self.query("index_dailybasic", ts_code=ts_code, trade_date=trade_date, fields=fields)
        if df.empty:
            sample = self._sample_data()["index_dailybasic"].copy()
            if trade_date:
                sample = sample[sample["trade_date"] == normalize_trade_date(trade_date)]
            if ts_code:
                sample = sample[sample["ts_code"] == ts_code]
            return sample
        return df

    def limit_list_d(self, trade_date: str | None = None) -> pd.DataFrame:
        fields = "trade_date,ts_code,name,close,pct_chg,limit,status"
        df = self.query("limit_list_d", trade_date=trade_date, fields=fields)
        if df.empty:
            sample = self._sample_data()["limit_list_d"].copy()
            if trade_date:
                sample = sample[sample["trade_date"] == normalize_trade_date(trade_date)]
            return sample
        return df

    def pro_bar(
        self,
        ts_code: str,
        start_date: str,
        end_date: str,
        adj: str | None = "qfq",
        freq: str = "D",
    ) -> pd.DataFrame:
        stock_base = self.stock_basic()
        code = normalize_ts_code(ts_code, stock_base)
        if self._ts is not None:
            try:
                df = self._ts.pro_bar(
                    ts_code=code,
                    start_date=normalize_trade_date(start_date),
                    end_date=normalize_trade_date(end_date),
                    adj=adj or None,
                    freq=freq,
                    ma=[5, 10, 20, 60],
                    factors=["tor", "vr"],
                    token=self.token,
                )
                if df is not None and not df.empty:
                    return df
            except Exception as exc:  # pragma: no cover
                self.errors.append(f"pro_bar 调用失败：{exc}")
        return self.daily(start_date=start_date, end_date=end_date, ts_code=code)

    def stk_mins(self, ts_code: str, start_date: str, end_date: str, freq: str = "1min") -> pd.DataFrame:
        code = normalize_ts_code(ts_code, self.stock_basic())
        if self._pro is not None:
            try:
                df = self._pro.stk_mins(ts_code=code, start_date=start_date, end_date=end_date, freq=freq)
                if df is not None and not df.empty:
                    return df
            except Exception as exc:  # pragma: no cover
                self.errors.append(f"stk_mins 调用失败：{exc}")
        return self._fake_mins(code, end_date)

    def market_window(self, start_date: str, end_date: str) -> pd.DataFrame:
        df = self.daily(start_date=start_date, end_date=end_date)
        if df.empty:
            return self._sample_data()["daily"].copy()
        return df

    def concept_for_industry(self, industry: str) -> str:
        from .sample_data import CONCEPT_MAP

        return CONCEPT_MAP.get(industry, industry or "其他")

    def _fake_mins(self, ts_code: str, end_date: str) -> pd.DataFrame:
        daily = self.daily(ts_code=ts_code, end_date=end_date).sort_values("trade_date")
        if daily.empty:
            return pd.DataFrame()
        last = daily.iloc[-1]
        minutes = pd.date_range(f"{display_date(end_date)} 09:30:00", periods=240, freq="min")
        minutes = minutes[~((minutes.hour == 11) & (minutes.minute >= 30))]
        minutes = minutes[:240]
        base = float(last["close"])
        steps = pd.Series(range(len(minutes)), dtype=float)
        curve = base * (1 + (steps - steps.mean()) * float(last.get("pct_chg", 0)) / 100 / len(steps))
        noise = (steps.apply(lambda x: ((x * 17) % 23 - 11)) / 10000 * base).to_numpy()
        close = curve.to_numpy() + noise
        out = pd.DataFrame(
            {
                "ts_code": ts_code,
                "trade_time": [m.strftime("%Y-%m-%d %H:%M:%S") for m in minutes],
                "open": close,
                "high": close * 1.002,
                "low": close * 0.998,
                "close": close,
                "vol": 1000 + (steps.to_numpy() % 37) * 80,
                "amount": close * (1000 + (steps.to_numpy() % 37) * 80) / 1000,
            }
        )
        return out.round(3)
