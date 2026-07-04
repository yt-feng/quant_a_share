const fs = require("fs");
const path = require("path");
const { adapters } = require("../api/market");

const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "pages", "data", "financial-cache.json");
const BAOSTOCK_CACHE_PATH = path.join(ROOT, "pages", "data", "baostock-cache.json");
const MARKET_CACHE_PATH = path.join(ROOT, "pages", "data", "market-cache.json");
const DEFAULT_SYMBOLS = ["600519", "000001", "300750", "688981", "300059", "002594", "603986", "300308"];
const MAX_SYMBOLS = Number(process.env.FINANCIAL_CACHE_MAX_SYMBOLS || 160);
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
  if (symbol.length === 6 && !target.includes(symbol)) target.push(symbol);
}

function collectSymbols() {
  const symbols = [];
  DEFAULT_SYMBOLS.forEach((symbol) => pushSymbol(symbols, symbol));

  const baostock = readJson(BAOSTOCK_CACHE_PATH);
  Object.keys(baostock?.symbols || {}).forEach((symbol) => pushSymbol(symbols, symbol));

  const market = readJson(MARKET_CACHE_PATH);
  pushSymbol(symbols, market?.quote?.code);
  (market?.stocks || [])
    .slice()
    .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
    .slice(0, 80)
    .forEach((stock) => pushSymbol(symbols, stock.code));
  (market?.popularity?.rank?.items || []).slice(0, 60).forEach((item) => pushSymbol(symbols, item.code));
  (market?.limitPools?.limitUp || []).slice(0, 60).forEach((item) => pushSymbol(symbols, item.code));
  (market?.limitPools?.broken || []).slice(0, 30).forEach((item) => pushSymbol(symbols, item.code));
  (market?.limitPools?.strong || []).slice(0, 30).forEach((item) => pushSymbol(symbols, item.code));

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
  const results = await mapLimit(symbols, CONCURRENCY, fetchOne);
  const okRows = results.filter((item) => item.ok);
  const errors = results.filter((item) => !item.ok);
  const payload = {
    ok: true,
    source: "financial-cache",
    generatedAt: new Date().toISOString(),
    symbolCount: okRows.length,
    requestedSymbolCount: symbols.length,
    symbols: Object.fromEntries(okRows.map((item) => [item.symbol, item.data])),
    errors,
  };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(
    JSON.stringify(
      {
        requested: symbols.length,
        cached: okRows.length,
        errors: errors.length,
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
