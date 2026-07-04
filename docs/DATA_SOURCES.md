# Data Sources

## Current Online Sources

- Eastmoney public quote APIs
  - A-share paginated spot quotes for market breadth, amount,涨跌停, watchlist candidates when the `clist` channel is reachable.
  - Industry board quotes and fund flow when the `clist` board channel is reachable.
  - Index quotes for 上证指数、深证成指、创业板指、沪深300、中证500.
  - Single-stock quote and daily K-line.
- Sina public market center API
  - Full A-share stock universe fallback, currently used when Eastmoney paginated lists are unavailable.
  - Provides code, name, price, pct/change, open/high/low/pre-close, volume, amount, turnover, PE, PB, total market cap and float market cap.
  - Sina industry board fallback, providing industry name, company count, pct/change, total volume, total amount and leading stock.
- DeepSeek API
  - Server-side `/api/chat` only.

## Recommended Free / Low-Cost Sources

- Eastmoney public endpoints: best default for this Vercel app because Node serverless can fetch them directly without Python workers.
- AKShare: best research/reference library for discovering Eastmoney/Sina/Tencent endpoints and validating fields. Use its documented interfaces as a map, then port hot paths to Node.
- BaoStock: good free source for historical K-line, valuation and financial fields when a Python batch job is acceptable.
- yfinance: useful for US/HK/global stocks and ETFs, not enough for A-share涨停、板块、资金流.
- efinance: useful open-source Eastmoney wrapper; good reference when adding more Eastmoney endpoints.
- Tencent/Sina quote endpoints: useful as low-cost online fallbacks for current quote fields; names require GBK/GB18030 decoding for some quote APIs.

## Next Enrichment Targets

- Eastmoney limit-up pool / broken-board pool.
- Eastmoney concept boards in addition to industry boards.
- Northbound capital and ETF flow.
- Financial statement snapshot for PE/PB/PS validation.
- Optional scheduled GitHub Action to cache slow full-market snapshots into JSON artifacts.
- Tencent quote fallback for selected symbols and watchlists.

## Design

- Keep Vercel runtime Node-only for the online app.
- Fetch public HTTP endpoints on demand and cache with `s-maxage`.
- Return compact normalized JSON to the frontend.
- Use sample data only when every online source fails.
