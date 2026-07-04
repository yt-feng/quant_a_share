# Data Sources

## Current Online Sources

- Eastmoney public quote APIs
  - A-share paginated spot quotes for market breadth, amount,涨跌停, watchlist candidates when the `clist` channel is reachable.
  - Industry board quotes and fund flow when the `clist` board channel is reachable.
  - Index quotes for 上证指数、深证成指、创业板指、沪深300、中证500.
  - Single-stock quote and daily K-line.
  - Limit-up pool, broken-board pool, strong-stock pool, seal fund, first/last seal time and streak height.
  - Individual stock money flow day K: main/super/big/mid/small order net flow and ratios.
  - Northbound/southbound Stock Connect quota and net buy summary.
- Sina public market center API
  - Full A-share stock universe fallback, currently used when Eastmoney paginated lists are unavailable.
  - Provides code, name, price, pct/change, open/high/low/pre-close, volume, amount, turnover, PE, PB, total market cap and float market cap.
  - Sina industry board fallback, providing industry name, company count, pct/change, total volume, total amount and leading stock.
  - Sina concept board fallback, providing concept name, company count, pct/change, total volume, total amount and leading stock.
  - Sina financial report API, providing report-period financial fields such as revenue, net profit, EPS, BVPS, ROE, ROA, gross margin, net margin and debt ratio.
- DeepSeek API
  - Server-side `/api/chat` only.

## Recommended Free / Low-Cost Sources

- Eastmoney public endpoints: best default for this Vercel app because Node serverless can fetch them directly without Python workers.
- AKShare: used as the endpoint map for the production Node adapters now covering Sina A-share universe, Sina boards, Eastmoney limit pools, Eastmoney money flow, Stock Connect and Sina financial reports.
- BaoStock: good free source for historical K-line, valuation and financial fields when a Python batch/cache job is acceptable.
- yfinance: useful for US/HK/global stocks and ETFs, not enough for A-share涨停、板块、资金流.
- efinance: useful open-source Eastmoney wrapper; the production app ports the same Eastmoney-style public endpoints into Node instead of importing Python in Vercel.
- Tencent/Sina quote endpoints: useful as low-cost online fallbacks for current quote fields; names require GBK/GB18030 decoding for some quote APIs.

## Next Enrichment Targets

- ETF flow and popularity/attention lists.
- Optional scheduled GitHub Action to cache slow full-market snapshots into JSON artifacts.
- Tencent quote fallback for selected symbols and watchlists.

## Design

- Keep Vercel runtime Node-only for the online app.
- Fetch public HTTP endpoints on demand and cache with `s-maxage`.
- Return compact normalized JSON to the frontend.
- Use sample data only when every online source fails.
