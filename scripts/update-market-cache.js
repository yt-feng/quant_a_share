const fs = require("fs");
const path = require("path");
const handler = require("../api/market");

const symbol = String(process.env.MARKET_CACHE_SYMBOL || "600519").replace(/\D/g, "").slice(0, 6) || "600519";
const outputPath = path.join(__dirname, "..", "pages", "data", "market-cache.json");
const stockLimit = process.env.MARKET_CACHE_STOCK_LIMIT || "8000";
const remoteFallbackUrl = process.env.MARKET_CACHE_REMOTE_FALLBACK_URL || "https://quant-a-share.vercel.app/api/market";
const remoteFallbackMinStocks = Number(process.env.MARKET_CACHE_REMOTE_FALLBACK_MIN_STOCKS || 4000);
const remoteMoneyCoverageMinRatio = Number(process.env.MARKET_CACHE_REMOTE_MONEY_MIN_RATIO || 0.7);
const richerUniverseMinExtra = Number(process.env.MARKET_CACHE_RICHER_UNIVERSE_MIN_EXTRA || 100);
const MONEY_FIELDS = ["mainNet", "mainRatio", "superNet", "superRatio", "bigNet", "bigRatio", "midNet", "midRatio", "smallNet", "smallRatio"];
const FINANCIAL_FIELDS = ["financialCached", "roe", "revenue", "netProfit", "grossMargin", "debtRatio", "reportDate"];
const HISTORY_FIELDS = ["baostockCached", "ma5Price", "ma20Price", "ma60Price", "pct20", "pct60", "high60", "low60", "historyDate"];

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
  if (!previous?.ok || previousCount < 1000 || previousCount < currentCount + richerUniverseMinExtra) return snapshot;
  const stocks = mergeRemoteStockFeatures(previous.stocks, snapshot.stocks);
  return {
    ...snapshot,
    source: `${snapshot.source}+previous-market-universe-preserved`,
    stocks,
    stockUniverse: previous.stockUniverse,
    featureCoverage: previous.featureCoverage || previous.stockUniverse?.featureCoverage || snapshot.featureCoverage,
    dataCoverage: {
      ...(snapshot.dataCoverage || {}),
      stocks: stocks.length,
      stockUniverseTotal: previous.stockUniverse?.total || stocks.length,
    },
    cacheSnapshot: {
      ...(snapshot.cacheSnapshot || {}),
      preservedMarketUniverseFrom: previous.cacheSnapshot?.generatedAt || previous.asOf || "",
      preservedStockCount: previousCount,
      replacedStockCount: currentCount,
    },
  };
}

function stockKey(row) {
  return String(row?.code || "").replace(/\D/g, "").slice(0, 6);
}

function hasMainMoney(row) {
  return MONEY_FIELDS.some((field) => Number(row?.[field]) !== 0);
}

function hasPositive(row, field) {
  return Number(row?.[field]) > 0;
}

function stockFeatureCoverage(rows = []) {
  const count = (predicate) => rows.filter(predicate).length;
  return {
    total: rows.length,
    mainMoney: count(hasMainMoney),
    limitPool: count((row) => row.limitPool),
    hotRank: count((row) => Number(row.hotRank) > 0),
    financialCache: count((row) => row.financialCached),
    baostockCache: count((row) => row.baostockCached),
  };
}

function copyIfEmpty(target, source, field) {
  if (target[field] === undefined || target[field] === null || target[field] === "" || Number(target[field]) === 0) {
    if (source[field] !== undefined && source[field] !== null && source[field] !== "") target[field] = source[field];
  }
}

function mergeStockFeatureRow(local, remote) {
  if (!remote) return local;
  const next = { ...local };
  ["industry", "area", "concepts", "limitPool", "firstSealTime"].forEach((field) => copyIfEmpty(next, remote, field));
  ["price", "pct", "change", "volume", "amount", "amplitude", "turnover", "pe", "pb", "volumeRatio", "totalMv", "circMv", "high", "low", "open", "preClose"].forEach((field) =>
    copyIfEmpty(next, remote, field)
  );
  if (!hasMainMoney(next) && hasMainMoney(remote)) MONEY_FIELDS.forEach((field) => copyIfEmpty(next, remote, field));
  if (!hasPositive(next, "hotRank") && hasPositive(remote, "hotRank")) {
    next.hotRank = remote.hotRank;
    next.hotRankChange = remote.hotRankChange;
  }
  if (!next.financialCached && remote.financialCached) FINANCIAL_FIELDS.forEach((field) => copyIfEmpty(next, remote, field));
  if (!next.baostockCached && remote.baostockCached) HISTORY_FIELDS.forEach((field) => copyIfEmpty(next, remote, field));
  if (!next.isLimitUp && remote.isLimitUp) next.isLimitUp = true;
  if (!next.limitStreak && remote.limitStreak) next.limitStreak = remote.limitStreak;
  if (!next.sealFund && remote.sealFund) next.sealFund = remote.sealFund;
  return next;
}

function mergeRemoteStockFeatures(stocks = [], remoteStocks = []) {
  const remoteByCode = new Map();
  remoteStocks.forEach((row) => {
    const key = stockKey(row);
    if (key) remoteByCode.set(key, row);
  });
  return stocks.map((row) => mergeStockFeatureRow(row, remoteByCode.get(stockKey(row))));
}

function rebuildMarketMetrics(snapshot) {
  const rows = snapshot.stocks || [];
  if (!rows.length) return snapshot;
  const up = rows.filter((row) => Number(row.pct) > 0).length;
  const down = rows.filter((row) => Number(row.pct) < 0).length;
  const flat = rows.length - up - down;
  const amount = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const limitUp = rows.filter((row) => Number(row.pct) >= 9.8).length;
  const limitDown = rows.filter((row) => Number(row.pct) <= -9.8).length;
  const netFund = (snapshot.sectors || []).reduce((sum, row) => sum + (Number(row.netFund) || 0), 0);
  const poolStats = snapshot.limitPools?.stats || {};
  const etfStats = snapshot.etfs?.stats || {};
  const featureCoverage = stockFeatureCoverage(rows);
  return {
    ...snapshot,
    market: {
      ...(snapshot.market || {}),
      temperature: Math.round(((up / Math.max(up + down, 1)) * 70 + Math.min(amount / 200000000000, 1) * 30) * 10) / 10,
      state: up >= down * 1.5 ? "强势行情" : up > down ? "震荡偏强" : up === down ? "震荡行情" : "弱势整理",
      amountYi: Math.round((amount / 100000000) * 100) / 100,
      netFundYi: Math.round((netFund / 100000000) * 100) / 100,
      aboveMa5: Math.round((up / Math.max(rows.length, 1)) * 1000) / 10,
      total: rows.length,
      up,
      down,
      flat,
      limitUp,
      limitDown,
      exactLimitUp: poolStats.limitUpCount || 0,
      brokenLimit: poolStats.brokenCount || 0,
      strongPool: poolStats.strongCount || 0,
      maxStreak: poolStats.maxStreak || 0,
      sealFundYi: poolStats.sealFundYi || 0,
      northNetBuyYi: snapshot.northbound?.northNetBuyYi || 0,
      northNetInYi: snapshot.northbound?.northNetInYi || 0,
      etfMainNetYi: etfStats.mainNetYi || 0,
      etfCount: etfStats.total || snapshot.etfs?.rows?.length || 0,
      limitDistribution: { up, down, flat, limitUp, limitDown },
    },
    stockUniverse: {
      ...(snapshot.stockUniverse || {}),
      total: rows.length,
      returned: rows.length,
      limit: Number(stockLimit) || rows.length,
      featureCoverage,
    },
    featureCoverage,
    dataCoverage: {
      ...(snapshot.dataCoverage || {}),
      stocks: rows.length,
      stockUniverseTotal: rows.length,
    },
  };
}

async function preserveRemoteMarketUniverse(snapshot) {
  const currentCount = snapshot.stocks?.length || 0;
  const currentCoverage = stockFeatureCoverage(snapshot.stocks || []);
  const shouldCheckRemote = currentCount < remoteFallbackMinStocks || (currentCount > 1000 && currentCoverage.mainMoney / currentCount < remoteMoneyCoverageMinRatio);
  if (!shouldCheckRemote) return rebuildMarketMetrics(snapshot);
  try {
    const remote = await fetchRemoteFallback();
    const remoteCount = remote?.stocks?.length || 0;
    if (!remote?.ok) return rebuildMarketMetrics(snapshot);
    if (remoteCount >= currentCount + richerUniverseMinExtra) {
      const stocks = mergeRemoteStockFeatures(remote.stocks || [], snapshot.stocks || []);
      return rebuildMarketMetrics({
        ...snapshot,
        source: `${snapshot.source}+remote-market-universe-preserved`,
        market: remote.market || snapshot.market,
        stocks,
        stockUniverse: remote.stockUniverse,
        featureCoverage: remote.featureCoverage || remote.stockUniverse?.featureCoverage || snapshot.featureCoverage,
        limitPoolCounts: remote.limitPoolCounts || snapshot.limitPoolCounts,
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
      });
    }
    const remoteCoverage = stockFeatureCoverage(remote.stocks || []);
    if (remoteCoverage.mainMoney > currentCoverage.mainMoney * 1.25) {
      const mergedStocks = mergeRemoteStockFeatures(snapshot.stocks || [], remote.stocks || []);
      return rebuildMarketMetrics({
        ...snapshot,
        source: `${snapshot.source}+remote-stock-features-merged`,
        stocks: mergedStocks,
        cacheSnapshot: {
          ...(snapshot.cacheSnapshot || {}),
          mergedRemoteFeatureCount: remoteCoverage.mainMoney,
          previousMainMoneyCount: currentCoverage.mainMoney,
        },
      });
    }
    return rebuildMarketMetrics(snapshot);
  } catch (error) {
    return rebuildMarketMetrics({
      ...snapshot,
      cacheSnapshot: {
        ...(snapshot.cacheSnapshot || {}),
        remoteFallbackError: error.message,
      },
    });
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
