const fs = require("fs");
const path = require("path");
const { adapters } = require("../api/market");

const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "pages", "data", "financial-cache.json");
const BAOSTOCK_CACHE_PATH = path.join(ROOT, "pages", "data", "baostock-cache.json");
const MARKET_CACHE_PATH = path.join(ROOT, "pages", "data", "market-cache.json");
const DEFAULT_SYMBOLS = ["600519", "000001", "300750", "688981", "300059", "002594", "603986", "300308"];
const MAX_SYMBOLS = Number(process.env.FINANCIAL_CACHE_MAX_SYMBOLS || 500);
const CONCURRENCY = Number(process.env.FINANCIAL_CACHE_CONCURRENCY || 5);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return null;
  }
}

function toSymbol(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 6);
}

function pushSymbol(target, value) {
  const symbol = toSymbol(value);
  if (symbol.length === 6 && isSupportedFinancialSymbol(symbol) && !target.includes(symbol)) target.push(symbol);
}

function isSupportedFinancialSymbol(symbol) {
  return /^[036]\d{5}$/.test(String(symbol || ""));
}

function rankedStocks(rows, score, limit) {
  return (rows || [])
    .filter((row) => isSupportedFinancialSymbol(toSymbol(row.code)))
    .slice()
    .sort((a, b) => (Number(score(b)) || 0) - (Number(score(a)) || 0))
    .slice(0, limit);
}

function pushRankedStocks(symbols, rows, score, limit) {
  rankedStocks(rows, score, limit).forEach((stock) => pushSymbol(symbols, stock.code));
}

function pushIndustryLeaders(symbols, rows, perIndustry = 3) {
  const buckets = new Map();
  (rows || []).forEach((stock) => {
    const symbol = toSymbol(stock.code);
    if (!isSupportedFinancialSymbol(symbol)) return;
    const industry = String(stock.industry || stock.sector || "未归类");
    if (!buckets.has(industry)) buckets.set(industry, []);
    buckets.get(industry).push(stock);
  });
  Array.from(buckets.values())
    .flatMap((items) => rankedStocks(items, (stock) => Number(stock.amount) || Number(stock.totalMv) || 0, perIndustry))
    .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
    .forEach((stock) => pushSymbol(symbols, stock.code));
}

function collectSymbols() {
  const symbols = [];
  DEFAULT_SYMBOLS.forEach((symbol) => pushSymbol(symbols, symbol));

  const baostock = readJson(BAOSTOCK_CACHE_PATH);
  Object.keys(baostock?.symbols || {}).forEach((symbol) => pushSymbol(symbols, symbol));

  const market = readJson(MARKET_CACHE_PATH);
  pushSymbol(symbols, market?.quote?.code);
  const stocks = market?.stocks || [];
  pushRankedStocks(symbols, stocks, (stock) => stock.amount, 280);
  pushRankedStocks(symbols, stocks, (stock) => Math.abs(Number(stock.mainNet) || 0), 180);
  pushRankedStocks(symbols, stocks, (stock) => Number(stock.totalMv) || Number(stock.circMv) || 0, 120);
  pushRankedStocks(symbols, stocks, (stock) => Math.abs(Number(stock.pct) || 0) * Math.log10((Number(stock.amount) || 0) + 10), 120);
  pushIndustryLeaders(symbols, stocks, 3);
  (market?.popularity?.rank?.items || []).slice(0, 100).forEach((item) => pushSymbol(symbols, item.code));
  (market?.limitPools?.limitUp || []).slice(0, 100).forEach((item) => pushSymbol(symbols, item.code));
  (market?.limitPools?.broken || []).slice(0, 60).forEach((item) => pushSymbol(symbols, item.code));
  (market?.limitPools?.strong || []).slice(0, 60).forEach((item) => pushSymbol(symbols, item.code));

  return symbols.slice(0, MAX_SYMBOLS);
}

async function mapLimit(items, limit, mapper) {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      results.push(await mapper(current));
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchOne(symbol) {
  try {
    const payload = await adapters.fetchFundamentals(symbol, adapters.secidFromSymbol(symbol));
    if (!payload) return { symbol, ok: false, error: "empty payload" };
    return {
      symbol,
      ok: true,
      data: {
        ...payload,
        symbol,
        cachedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return { symbol, ok: false, error: error.message };
  }
}

(async () => {
  if (!adapters?.fetchFundamentals || !adapters?.secidFromSymbol) {
    throw new Error("api/market adapters are not available");
  }
  const symbols = collectSymbols();
  const previous = readJson(OUTPUT_PATH);
  const results = await mapLimit(symbols, CONCURRENCY, fetchOne);
  const okRows = [];
  const errors = [];
  const refreshErrors = [];
  const reusedSymbols = [];
  results.forEach((item) => {
    if (item.ok) {
      okRows.push(item);
      return;
    }
    const cached = previous?.symbols?.[item.symbol];
    if (cached?.rows?.length || cached?.financials) {
      okRows.push({
        symbol: item.symbol,
        ok: true,
        data: {
          ...cached,
          reusedFromGeneratedAt: previous.generatedAt || "",
        },
      });
      refreshErrors.push(item);
      reusedSymbols.push(item.symbol);
      return;
    }
    errors.push(item);
  });
  const payload = {
    ok: true,
    source: "financial-cache",
    generatedAt: new Date().toISOString(),
    symbolCount: okRows.length,
    requestedSymbolCount: symbols.length,
    symbols: Object.fromEntries(okRows.map((item) => [item.symbol, item.data])),
    errors,
    refreshErrors,
    reusedSymbols,
  };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(
    JSON.stringify(
      {
        requested: symbols.length,
        cached: okRows.length,
        reused: reusedSymbols.length,
        errors: errors.length,
        refreshErrors: refreshErrors.length,
        sample: okRows.slice(0, 5).map((item) => ({
          symbol: item.symbol,
          source: item.data.source,
          reportLabel: item.data.reportLabel,
          rows: item.data.rows?.length || 0,
        })),
      },
      null,
      2
    )
  );
})();
