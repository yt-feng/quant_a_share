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
  - ETF spot quote/fund-flow list from the same Eastmoney ETF grid endpoints used by AKShare `fund_etf_spot_em`.
  - Stock popularity rank, single-stock latest rank, hot concepts/keywords and related stocks from Eastmoney Guba rank endpoints.
  - Single-stock announcements from Eastmoney notice search.
- Eastmoney research report API
  - Industry research and macro/strategy report lists from `reportapi.eastmoney.com/report/list`.
  - `/api/market` exposes normalized report title, institution, author, industry/topic, publish date, pages and detail URL as `research.reports`.
  - The LLM 产业链研报分析 tab and chat context use this feed as low-cost research metadata.
- Sina public market center API
  - Full A-share stock universe fallback, currently used when Eastmoney paginated lists are unavailable.
  - Provides code, name, price, pct/change, open/high/low/pre-close, volume, amount, turnover, PE, PB, total market cap and float market cap.
  - Sina industry board fallback, providing industry name, company count, pct/change, total volume, total amount and leading stock.
  - Sina concept board fallback, providing concept name, company count, pct/change, total volume, total amount and leading stock.
  - Sina financial report API, providing report-period financial fields such as revenue, net profit, EPS, BVPS, ROE, ROA, gross margin, net margin and debt ratio.
- Yahoo Finance chart API
  - yfinance-compatible HTTP source for A-share `.SS/.SZ`, HK, US stocks and ETFs; returned as a global quote/K-line backup.
- Tencent quote endpoint
  - GB18030 quote fallback for selected A-share symbols when the Eastmoney single-stock quote channel is unavailable.
- GitHub Actions market snapshot
  - `.github/workflows/market-cache.yml` runs the same Node adapters in the cloud and writes `pages/data/market-cache.json`.
  - `/api/market` reads this bundled snapshot when live public endpoints return empty data, preserving market breadth, concept, limit-pool, ETF, popularity, announcement and financial fields.
- GitHub Actions financial snapshot
  - `scripts/update-financial-cache.js` reuses the production Eastmoney/Sina financial adapters and writes `pages/data/financial-cache.json`.
  - The cache universe is collected from BaoStock symbols, current market-cache leaders, hot-rank names and limit-up pool names, capped by `FINANCIAL_CACHE_MAX_SYMBOLS`.
  - `/api/market` uses this file as a static financial-field fallback when live financial endpoints are unavailable.
- CNInfo announcements
  - Secondary announcement source using `www.cninfo.com.cn/new/hisAnnouncement/query`; merged with Eastmoney announcements and deduplicated by date/title.
  - CNInfo relation/调研 feed is available as `disclosures.relations` for symbols that have recent investor-relation disclosure records.
- BaoStock cache
  - `scripts/update_baostock_cache.py` queries historical daily K-line, turnover, PE/PB/PS/PCF fields and writes `pages/data/baostock-cache.json`.
  - The symbol universe is expanded from the bundled market snapshot: default core names, current quote, high-amount stocks, hot-rank stocks and limit-up pool names, capped by `BAOSTOCK_MAX_SYMBOLS`.
  - `/api/market` exposes the matching symbol cache as `baostock` for quote, LLM and factor context, reading the bundled file first and the deployed static JSON as a fallback on Vercel.
- DeepSeek API
  - Server-side `/api/chat` only.
- In-app source coverage
  - The 复刻状态 page now shows production-connected sources, cloud-cache sources and reference-only sources side by side.

## Recommended Free / Low-Cost Sources

- Eastmoney public endpoints: best default for this Vercel app because Node serverless can fetch them directly without Python workers.
- Eastmoney report API: now connected for industry-chain research metadata without Python workers or paid data.
- AKShare: used as the endpoint map for the production Node adapters now covering Sina A-share universe, Sina boards, Eastmoney limit pools, ETF spot/fund-flow, stock popularity, money flow, Stock Connect and Sina financial reports.
- BaoStock: now connected through GitHub Actions batch JSON cache for historical K-line, valuation, turnover and MA/return summaries; the default cloud cache expands to 24 symbols from live market context.
- Financial cache: now connected through GitHub Actions batch JSON cache for revenue, profit, EPS, ROE, gross margin, debt ratio and other report fields; the default cache targets up to 40 symbols.
- yfinance: production app now uses the same Yahoo chart backend directly for global quote/K-line backup; still not enough for A-share涨停、板块、资金流.
- efinance: useful open-source Eastmoney wrapper; the production app ports the same Eastmoney-style public endpoints into Node instead of importing Python in Vercel.
- Tencent/Sina quote endpoints: useful as low-cost online fallbacks for current quote fields; names require GBK/GB18030 decoding for some quote APIs.

## Next Enrichment Targets

- Add richer industry research/news metadata for the 产业链研报分析 tab.

## Design

- Keep Vercel runtime Node-only for the online app.
- Fetch public HTTP endpoints on demand and cache with `s-maxage`.
- Cache slow financial and board/popularity endpoints in Vercel serverless memory while the function instance is warm.
- Refresh a compact market snapshot on GitHub Actions during trading days, then use it as bundled read-only fallback in Vercel.
- Refresh compact BaoStock and financial snapshots in the same workflow, then use them as static read-only fallbacks in Vercel.
- Return compact normalized JSON to the frontend.
- Use sample data only when every online source fails.
