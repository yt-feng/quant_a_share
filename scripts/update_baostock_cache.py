import json
import os
from datetime import date, datetime, timedelta
from pathlib import Path

import baostock as bs


BASE_SYMBOLS = [item.strip() for item in os.getenv("BAOSTOCK_SYMBOLS", "600519,000001,300750,688981,300059,002594").split(",") if item.strip()]
MAX_SYMBOLS = int(os.getenv("BAOSTOCK_MAX_SYMBOLS", "80"))
LOOKBACK_DAYS = int(os.getenv("BAOSTOCK_LOOKBACK_DAYS", "520"))
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "pages" / "data" / "baostock-cache.json"
MARKET_CACHE_PATH = Path(__file__).resolve().parents[1] / "pages" / "data" / "market-cache.json"
FINANCIAL_CACHE_PATH = Path(__file__).resolve().parents[1] / "pages" / "data" / "financial-cache.json"
FIELDS = (
    "date,code,open,high,low,close,preclose,volume,amount,adjustflag,turn,"
    "tradestatus,pctChg,peTTM,pbMRQ,psTTM,pcfNcfTTM,isST"
)


def baostock_code(symbol: str) -> str:
    digits = "".join(ch for ch in symbol if ch.isdigit())[:6]
    return f"sh.{digits}" if digits.startswith(("6", "9")) else f"sz.{digits}"


def normalize_symbol(symbol: str) -> str:
    return "".join(ch for ch in str(symbol) if ch.isdigit())[:6]


def supported_symbol(symbol: str) -> bool:
    return len(symbol) == 6 and symbol[0] in {"0", "3", "6"}


def number_value(value):
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def ranked_rows(rows, key, limit):
    return sorted(rows or [], key=key, reverse=True)[:limit]


def industry_leaders(rows, per_industry=2):
    buckets = {}
    for row in rows or []:
        code = normalize_symbol(row.get("code"))
        if not supported_symbol(code):
            continue
        industry = row.get("industry") or row.get("sector") or "未归类"
        buckets.setdefault(industry, []).append(row)
    leaders = []
    for items in buckets.values():
        leaders.extend(ranked_rows(items, lambda item: number_value(item.get("amount")) or number_value(item.get("totalMv")), per_industry))
    return ranked_rows(leaders, lambda item: number_value(item.get("amount")), len(leaders))


def candidate_symbols():
    symbols = []

    def add(value):
        code = normalize_symbol(value)
        if supported_symbol(code) and code not in symbols:
            symbols.append(code)

    for symbol in BASE_SYMBOLS:
        add(symbol)
    previous_payload = load_previous_payload()
    for symbol in previous_payload.get("symbols", {}).keys():
        add(symbol)
    if MARKET_CACHE_PATH.exists():
        try:
            market = json.loads(MARKET_CACHE_PATH.read_text(encoding="utf-8"))
            add(market.get("quote", {}).get("code"))
            stocks = [row for row in market.get("stocks", []) if supported_symbol(normalize_symbol(row.get("code")))]
            for row in ranked_rows(stocks, lambda item: number_value(item.get("amount")), 140):
                add(row.get("code"))
            for row in ranked_rows(stocks, lambda item: abs(number_value(item.get("mainNet"))), 100):
                add(row.get("code"))
            for row in ranked_rows(stocks, lambda item: number_value(item.get("totalMv")) or number_value(item.get("circMv")), 80):
                add(row.get("code"))
            for row in ranked_rows(stocks, lambda item: abs(number_value(item.get("pct"))) * number_value(item.get("amount")), 80):
                add(row.get("code"))
            for row in ranked_rows([row for row in stocks if row.get("financialCached")], lambda item: number_value(item.get("amount")), 120):
                add(row.get("code"))
            for row in industry_leaders(stocks, 2):
                add(row.get("code"))
            for row in market.get("popularity", {}).get("rank", {}).get("items", [])[:80]:
                add(row.get("code"))
            for row in market.get("limitPools", {}).get("limitUp", [])[:80]:
                add(row.get("code"))
            for row in market.get("limitPools", {}).get("broken", [])[:40]:
                add(row.get("code"))
            for row in market.get("limitPools", {}).get("strong", [])[:40]:
                add(row.get("code"))
        except (OSError, json.JSONDecodeError):
            pass
    if FINANCIAL_CACHE_PATH.exists():
        try:
            financial = json.loads(FINANCIAL_CACHE_PATH.read_text(encoding="utf-8"))
            for symbol in list(financial.get("symbols", {}).keys())[:MAX_SYMBOLS]:
                add(symbol)
        except (OSError, json.JSONDecodeError):
            pass
    return symbols[:MAX_SYMBOLS]


def public_code(bs_code: str) -> str:
    market, code = bs_code.split(".")
    return f"{code}.{'SH' if market == 'sh' else 'SZ'}"


def number(value):
    try:
        if value in ("", None):
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def compact_row(fields, row):
    item = dict(zip(fields, row))
    return {
        "date": item.get("date"),
        "code": public_code(item.get("code", "")),
        "open": number(item.get("open")),
        "high": number(item.get("high")),
        "low": number(item.get("low")),
        "close": number(item.get("close")),
        "preClose": number(item.get("preclose")),
        "volume": number(item.get("volume")),
        "amount": number(item.get("amount")),
        "turnover": number(item.get("turn")),
        "pct": number(item.get("pctChg")),
        "peTTM": number(item.get("peTTM")),
        "pbMRQ": number(item.get("pbMRQ")),
        "psTTM": number(item.get("psTTM")),
        "pcfNCFTTM": number(item.get("pcfNcfTTM")),
        "tradeStatus": item.get("tradestatus"),
        "isST": item.get("isST") == "1",
    }


def moving_average(rows, window):
    values = [row["close"] for row in rows[-window:] if row.get("close") is not None]
    return round(sum(values) / len(values), 4) if values else None


def summarize(rows):
    if not rows:
        return {}
    latest = rows[-1]
    close = latest.get("close") or 0
    close_20 = rows[-21]["close"] if len(rows) > 20 else None
    close_60 = rows[-61]["close"] if len(rows) > 60 else None
    highs = [row["high"] for row in rows[-60:] if row.get("high") is not None]
    lows = [row["low"] for row in rows[-60:] if row.get("low") is not None]
    return {
        "latest": latest,
        "ma5": moving_average(rows, 5),
        "ma20": moving_average(rows, 20),
        "ma60": moving_average(rows, 60),
        "pct20": round((close / close_20 - 1) * 100, 4) if close and close_20 else None,
        "pct60": round((close / close_60 - 1) * 100, 4) if close and close_60 else None,
        "high60": max(highs) if highs else None,
        "low60": min(lows) if lows else None,
        "rows": rows[-260:],
    }


def fetch_symbol(symbol: str, start_date: str, end_date: str):
    rs = bs.query_history_k_data_plus(baostock_code(symbol), FIELDS, start_date=start_date, end_date=end_date, frequency="d", adjustflag="2")
    if rs.error_code != "0":
        raise RuntimeError(f"{symbol} query failed: {rs.error_msg}")
    rows = []
    while rs.next():
        rows.append(compact_row(rs.fields, rs.get_row_data()))
    rows = [row for row in rows if row.get("tradeStatus") == "1"]
    summary = summarize(rows)
    summary["source"] = "baostock-history-cache"
    summary["symbol"] = symbol
    summary["baostockCode"] = baostock_code(symbol)
    return summary


def load_previous_payload():
    if not OUTPUT_PATH.exists():
        return {}
    try:
        return json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def previous_symbol_cache(previous_payload, symbol: str):
    cached = previous_payload.get("symbols", {}).get(symbol)
    if not cached or not cached.get("rows"):
        return None
    item = dict(cached)
    item["reusedFromGeneratedAt"] = previous_payload.get("generatedAt", "")
    return item


def main():
    end_date = date.today()
    start_date = end_date - timedelta(days=LOOKBACK_DAYS)
    symbols = candidate_symbols()
    previous_payload = load_previous_payload()
    payload = {
        "ok": True,
        "source": "baostock-history-cache",
        "generatedAt": datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "lookbackDays": LOOKBACK_DAYS,
        "maxSymbols": MAX_SYMBOLS,
        "requestedSymbols": symbols,
        "symbols": {},
        "errors": {},
        "refreshErrors": {},
        "reusedSymbols": [],
    }
    login = bs.login()
    if login.error_code == "0":
        try:
            for symbol in symbols:
                try:
                    payload["symbols"][symbol] = fetch_symbol(symbol, start_date.isoformat(), end_date.isoformat())
                except Exception as error:
                    cached = previous_symbol_cache(previous_payload, symbol)
                    if cached:
                        payload["symbols"][symbol] = cached
                        payload["refreshErrors"][symbol] = str(error)
                        payload["reusedSymbols"].append(symbol)
                    else:
                        payload["errors"][symbol] = str(error)
        finally:
            bs.logout()
    else:
        payload["refreshErrors"]["login"] = login.error_msg
        for symbol in symbols:
            cached = previous_symbol_cache(previous_payload, symbol)
            if cached:
                payload["symbols"][symbol] = cached
                payload["reusedSymbols"].append(symbol)
            else:
                payload["errors"][symbol] = login.error_msg
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(OUTPUT_PATH),
        "symbols": list(payload["symbols"].keys()),
        "cached": len(payload["symbols"]),
        "reused": len(payload["reusedSymbols"]),
        "errors": payload["errors"],
        "refreshErrors": payload["refreshErrors"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
