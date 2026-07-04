const fs = require("fs");
const path = require("path");
const handler = require("../api/market");

const symbol = String(process.env.MARKET_CACHE_SYMBOL || "600519").replace(/\D/g, "").slice(0, 6) || "600519";
const outputPath = path.join(__dirname, "..", "pages", "data", "market-cache.json");
const stockLimit = process.env.MARKET_CACHE_STOCK_LIMIT || "8000";
const remoteFallbackUrl = process.env.MARKET_CACHE_REMOTE_FALLBACK_URL || "https://quant-a-share.vercel.app/api/market";
const remoteFallbackMinStocks = Number(process.env.MARKET_CACHE_REMOTE_FALLBACK_MIN_STOCKS || 4000);

function readExistingSnapshot() {
  try {
    return JSON.parse(fs.readFileSync(outputPath, "utf8"));
  } catch (error) {
    return null;
  }
}

function callMarketApi() {
  const req = { method: "GET", query: { symbol, stockLimit } };
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        if (this.statusCode >= 400) {
          reject(new Error(payload?.error || `market api returned ${this.statusCode}`));
          return;
        }
        resolve(payload);
      },
      end() {
        resolve(null);
      },
    };
    Promise.resolve(handler(req, res)).catch(reject);
  });
}

async function fetchRemoteFallback() {
  if (!remoteFallbackUrl) return null;
  const url = new URL(remoteFallbackUrl);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("stockLimit", stockLimit);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.MARKET_CACHE_REMOTE_TIMEOUT_MS || 35000));
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`remote fallback returned ${response.status}`);
    const payload = await response.json();
    return payload?.ok ? payload : null;
  } finally {
    clearTimeout(timeout);
  }
}

function preserveRicherMarketUniverse(snapshot, previous) {
  const currentCount = snapshot.stocks?.length || 0;
  const previousCount = previous?.stocks?.length || 0;
  if (!previous?.ok || previousCount < 1000 || previousCount <= currentCount * 1.25) return snapshot;
  return {
    ...snapshot,
    source: `${snapshot.source}+previous-market-universe-preserved`,
    stocks: previous.stocks,
    stockUniverse: previous.stockUniverse,
    featureCoverage: previous.featureCoverage || previous.stockUniverse?.featureCoverage || snapshot.featureCoverage,
    dataCoverage: {
      ...(snapshot.dataCoverage || {}),
      stocks: previous.stocks.length,
      stockUniverseTotal: previous.stockUniverse?.total || previous.stocks.length,
    },
    cacheSnapshot: {
      ...(snapshot.cacheSnapshot || {}),
      preservedMarketUniverseFrom: previous.cacheSnapshot?.generatedAt || previous.asOf || "",
      preservedStockCount: previousCount,
      replacedStockCount: currentCount,
    },
  };
}

async function preserveRemoteMarketUniverse(snapshot) {
  const currentCount = snapshot.stocks?.length || 0;
  if (currentCount >= remoteFallbackMinStocks) return snapshot;
  try {
    const remote = await fetchRemoteFallback();
    const remoteCount = remote?.stocks?.length || 0;
    if (!remote?.ok || remoteCount <= currentCount * 1.25) return snapshot;
    return {
      ...snapshot,
      source: `${snapshot.source}+remote-market-universe-preserved`,
      stocks: remote.stocks,
      stockUniverse: remote.stockUniverse,
      featureCoverage: remote.featureCoverage || remote.stockUniverse?.featureCoverage || snapshot.featureCoverage,
      dataCoverage: {
        ...(snapshot.dataCoverage || {}),
        stocks: remoteCount,
        stockUniverseTotal: remote.stockUniverse?.total || remoteCount,
      },
      cacheSnapshot: {
        ...(snapshot.cacheSnapshot || {}),
        preservedMarketUniverseFromRemote: remote.cacheSnapshot?.generatedAt || remote.asOf || "",
        preservedRemoteStockCount: remoteCount,
        replacedStockCount: currentCount,
      },
    };
  } catch (error) {
    return {
      ...snapshot,
      cacheSnapshot: {
        ...(snapshot.cacheSnapshot || {}),
        remoteFallbackError: error.message,
      },
    };
  }
}

(async () => {
  const previous = readExistingSnapshot();
  const payload = await callMarketApi();
  if (!payload?.ok) throw new Error("market api did not return ok payload");
  const localSnapshot = preserveRicherMarketUniverse({
    ...payload,
    cacheSnapshot: {
      available: true,
      hit: false,
      usedFields: [],
      generatedAt: new Date().toISOString(),
      generatedBy: process.env.GITHUB_ACTIONS === "true" ? "github-actions" : "seed-script",
      symbol,
    },
  }, previous);
  const snapshot = await preserveRemoteMarketUniverse(localSnapshot);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${outputPath}`);
  console.log(
    JSON.stringify(
      {
        symbol,
        source: snapshot.source,
        stocks: snapshot.stocks?.length || 0,
        concepts: snapshot.concepts?.length || 0,
        limitUp: snapshot.limitPools?.limitUp?.length || 0,
        etfs: snapshot.etfs?.rows?.length || 0,
        hotRank: snapshot.popularity?.rank?.items?.length || 0,
        announcements: snapshot.announcements?.items?.length || 0,
        researchReports: snapshot.research?.reports?.length || 0,
      },
      null,
      2
    )
  );
})();
