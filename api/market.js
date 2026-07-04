const fs = require("fs");
const path = require("path");

const STOCK_FIELDS =
  "f12,f14,f2,f3,f4,f5,f6,f7,f8,f9,f10,f13,f15,f16,f17,f18,f20,f21,f23,f62,f66,f69,f72,f75,f78,f81,f84,f87,f184,f100,f102,f103";
const BOARD_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f7,f8,f20,f21,f62,f104,f105,f106,f128,f136,f140,f141";
const BOARD_CONSTITUENT_FIELDS = `${STOCK_FIELDS},f62`;
const INDEX_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f13";
const EASTMONEY_A_FS = "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23";
const EASTMONEY_A_SEGMENTS = ["m:1+t:2,m:1+t:23", "m:0+t:6,m:0+t:80"];
const SINA_A_STOCK_URL = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData";
const SINA_A_COUNT_URL = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeStockCount?node=hs_a";
const SINA_INDUSTRY_URL = "http://vip.stock.finance.sina.com.cn/q/view/newSinaHy.php";
const SINA_CONCEPT_URL = "http://money.finance.sina.com.cn/q/view/newFLJK.php?param=class";
const EASTMONEY_LIMIT_POOL_URL = "https://push2ex.eastmoney.com";
const EASTMONEY_HSGT_URL = "https://datacenter-web.eastmoney.com/api/data/v1/get";
const EASTMONEY_KAMT_URL = "https://push2.eastmoney.com/api/qt/kamt/get";
const EASTMONEY_ETF_URL = "https://push2delay.eastmoney.com/api/qt/clist/get";
const EASTMONEY_STOCK_RANK_URL = "https://emappdata.eastmoney.com/stockrank";
const EASTMONEY_ANNOUNCEMENT_URL = "https://np-anotice-stock.eastmoney.com/api/security/ann";
const EASTMONEY_REPORT_URL = "https://reportapi.eastmoney.com/report/list";
const CNINFO_STOCK_URL = "http://www.cninfo.com.cn/new/data/szse_stock.json";
const CNINFO_ANNOUNCEMENT_URL = "http://www.cninfo.com.cn/new/hisAnnouncement/query";
const TENCENT_QUOTE_URL = "https://qt.gtimg.cn/q=";
const SINA_PAGE_SIZE = 80;
const SINA_MAX_PAGES = 90;
const SHORT_CACHE_MS = 90 * 1000;
const BOARD_CACHE_MS = 8 * 60 * 1000;
const FINANCIAL_CACHE_MS = 6 * 60 * 60 * 1000;
const SNAPSHOT_CACHE_FILE = path.join("pages", "data", "market-cache.json");
const BAOSTOCK_CACHE_FILE = path.join("pages", "data", "baostock-cache.json");
const FINANCIAL_CACHE_FILE = path.join("pages", "data", "financial-cache.json");
const DEFAULT_CLIENT_STOCK_LIMIT = 6000;
const MAX_CLIENT_STOCK_LIMIT = 8000;

const memoryCache = new Map();

const sampleStocks = [
  { code: "300750.SZ", name: "宁德时代", price: 268.4, pct: 3.8, amount: 1420000000, volume: 820000, turnover: 3.2, pe: 28 },
  { code: "688981.SH", name: "中芯国际", price: 88.1, pct: 4.2, amount: 1860000000, volume: 520000, turnover: 4.9, pe: 55 },
  { code: "600519.SH", name: "贵州茅台", price: 1194.45, pct: -0.71, amount: 4099266243, volume: 34268, turnover: 0.27, pe: 17.9 },
];

const sampleSectors = [
  { code: "BK1617", name: "黄金", pct: 8.3, amount: 17825351719, netFund: 2444934352, upCount: 10, downCount: 0, flatCount: 0 },
  { code: "BK1408", name: "机器人", pct: 9.12, amount: 32232328793, netFund: 1990612224, upCount: 21, downCount: 0, flatCount: 0 },
  { code: "BK0428", name: "半导体", pct: 2.4, amount: 28062000000, netFund: 862000000, upCount: 42, downCount: 16, flatCount: 3 },
];

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const symbol = String(req.query?.symbol || "600519").replace(/\D/g, "").slice(0, 6) || "600519";
  const secid = secidFromSymbol(symbol);
  const tradeDate = String(req.query?.date || defaultTradeDate()).replace(/\D/g, "").slice(0, 8) || defaultTradeDate();
  const stockLimit = clientStockLimit(req);
  const boardCode = normalizeBoardCode(req.query?.boardCode);

  const [
    eastmoneyStockResult,
    sinaStockResult,
    eastmoneySectorResult,
    sinaSectorResult,
    eastmoneyConceptResult,
    sinaConceptResult,
    limitPools,
    etfs,
    moneyFlow,
    northbound,
    fundamentals,
    popularityRank,
    stockPopularity,
    eastmoneyAnnouncements,
    cninfoAnnouncements,
    cninfoRelations,
    researchReports,
    yahooChart,
    klines,
    minuteKlines,
    marketKlines,
    quote,
    tencentQuote,
    indexResult,
    boardConstituents,
  ] = await Promise.all([
    fetchEastmoneyStockUniverse().catch(() => null),
    fetchSinaStockUniverse().catch(() => null),
    fetchEastmoneySectors().catch(() => null),
    fetchSinaSectors().catch(() => null),
    fetchCached("eastmoney:concepts", BOARD_CACHE_MS, fetchEastmoneyConcepts).catch(() => null),
    fetchCached("sina:concepts", BOARD_CACHE_MS, fetchSinaConcepts).catch(() => null),
    fetchCached(`eastmoney:limit:${tradeDate}`, SHORT_CACHE_MS, () => fetchEastmoneyLimitPools(tradeDate)).catch(() => null),
    fetchCached("eastmoney:etfs", BOARD_CACHE_MS, fetchEastmoneyEtfs).catch(() => null),
    fetchEastmoneyMoneyFlow(secid).catch(() => null),
    fetchEastmoneyNorthbound().catch(() => null),
    fetchCached(`fundamentals:${symbol}`, FINANCIAL_CACHE_MS, () => fetchFundamentals(symbol, secid), withCacheMeta).catch(() => null),
    fetchCached("eastmoney:hot-rank", SHORT_CACHE_MS, fetchEastmoneyHotRank).catch(() => null),
    fetchCached(`eastmoney:stock-popularity:${symbol}`, SHORT_CACHE_MS, () => fetchEastmoneyStockPopularity(symbol)).catch(() => null),
    fetchCached(`eastmoney:announcements:${symbol}`, BOARD_CACHE_MS, () => fetchEastmoneyAnnouncements(symbol)).catch(() => null),
    fetchCached(`cninfo:announcements:${symbol}`, BOARD_CACHE_MS, () => fetchCninfoAnnouncements(symbol)).catch(() => null),
    fetchCached(`cninfo:relations:${symbol}`, BOARD_CACHE_MS, () => fetchCninfoRelations(symbol)).catch(() => null),
    fetchCached("eastmoney:research-reports", BOARD_CACHE_MS, fetchEastmoneyResearchReports).catch(() => null),
    fetchYahooChart(symbol).catch(() => null),
    fetchEastmoneyKlines(secid).catch(() => []),
    fetchEastmoneyMinuteKlines(secid).catch(() => []),
    fetchEastmoneyKlines("1.000001").catch(() => []),
    fetchEastmoneyQuote(secid).catch(() => null),
    fetchTencentQuote(symbol).catch(() => null),
    fetchEastmoneyIndices().catch(() => null),
    boardCode ? fetchCached(`eastmoney:board-constituents:${boardCode}`, BOARD_CACHE_MS, () => fetchEastmoneyBoardConstituents(boardCode)).catch(() => null) : Promise.resolve(null),
  ]);
  const [financialCachePayload, baostockCachePayload] = await Promise.all([readFullFinancialCache(req), readFullBaoStockCache(req)]);
  const stockUniverse = enrichStockUniverse(pickStockUniverse(eastmoneyStockResult, sinaStockResult), {
    limitPools,
    popularityRank,
    financialCachePayload,
    baostockCachePayload,
  });
  const sectorUniverse = pickSectorUniverse(eastmoneySectorResult, sinaSectorResult);
  const conceptUniverse = pickConceptUniverse(eastmoneyConceptResult, sinaConceptResult);
  const sectors = sectorUniverse.rows;
  const indices = indexResult?.length ? indexResult : [];
  const clientStocks = selectClientStocks(stockUniverse, stockLimit);
  const selectedQuote = quote || tencentQuote || clientStocks.find((stock) => stock.code.includes(symbol)) || stockUniverse.leaders.find((stock) => stock.code.includes(symbol)) || clientStocks[0] || stockUniverse.leaders[0] || sampleStocks[0];
  const financialCache = needsFinancialCache(fundamentals) ? await readFinancialCache(symbol, req, financialCachePayload) : null;
  const enrichedFundamentals = enrichFundamentalsFromQuote(mergeFinancialSources(fundamentals, financialCache), selectedQuote);
  const announcements = mergeAnnouncementSources(eastmoneyAnnouncements, cninfoAnnouncements);
  const baostock = await readBaoStockCache(symbol, req, baostockCachePayload);
  const relationSamples = cninfoRelations?.items?.length ? [] : await fetchCninfoRelationSamples(symbol, clientStocks).catch(() => []);
  const source = [
    stockUniverse.source,
    sectorUniverse.source,
    conceptUniverse.source,
    boardCode ? (boardConstituents?.rows?.length ? "eastmoney-board-constituents" : "board-constituents-fallback") : "",
    limitPools?.source || "limit-pool-fallback",
    etfs?.rows?.length ? "eastmoney-etf-spot" : "etf-fallback",
    moneyFlow?.rows?.length ? "eastmoney-moneyflow" : "moneyflow-fallback",
    northbound?.rows?.length ? northbound.source || "eastmoney-northbound" : "northbound-fallback",
    enrichedFundamentals?.source || "fundamentals-fallback",
    popularityRank?.items?.length ? "eastmoney-hot-rank" : "hot-rank-fallback",
    stockPopularity?.latest ? "eastmoney-stock-popularity" : "stock-popularity-fallback",
    announcements?.items?.length ? announcements.source : "announcement-fallback",
    cninfoRelations?.items?.length ? "cninfo-relations" : relationSamples.length ? "cninfo-relation-samples" : "relation-fallback",
    researchReports?.reports?.length ? "eastmoney-research-reports" : "research-fallback",
    yahooChart?.klines?.length ? "yahoo-chart-yfinance-compatible" : "yahoo-fallback",
    minuteKlines?.length ? "eastmoney-minute-trends" : "minute-fallback",
    baostock?.rows?.length ? "baostock-history-cache" : "baostock-cache-miss",
    indices.length ? "eastmoney-index-quotes" : "index-fallback",
    quote ? "eastmoney-quote" : tencentQuote ? "tencent-quote" : "quote-fallback",
  ].filter(Boolean).join("+");

  const market = buildMarketMetrics(stockUniverse.all, sectors, limitPools, northbound, etfs);
  const payload = {
    ok: true,
    source,
    asOf: new Date().toISOString(),
    tradeDate,
    market,
    stockUniverse: {
      total: stockUniverse.all?.length || stockUniverse.leaders?.length || 0,
      returned: clientStocks.length,
      limit: stockLimit,
      leaderSample: stockUniverse.leaders?.length || 0,
      source: stockUniverse.source,
      featureCoverage: stockFeatureCoverage(stockUniverse.all || clientStocks),
    },
    stocks: clientStocks,
    sectors,
    concepts: conceptUniverse.rows,
    boardConstituents: annotateBoardConstituents(boardConstituents, boardCode, sectors, conceptUniverse.rows),
    limitPools: limitPools || { date: tradeDate, limitUp: [], broken: [], strong: [], stats: {} },
    etfs: etfs || { rows: [], stats: {} },
    moneyFlow: moneyFlow || { rows: [], latest: null, sum5MainYi: 0 },
    northbound: northbound || { rows: [], northNetBuyYi: 0, northNetInYi: 0 },
    fundamentals: enrichedFundamentals,
    popularity: {
      rank: popularityRank || { items: [], source: "" },
      stock: stockPopularity || { latest: null, keywords: [], related: [], realtime: [] },
    },
    announcements: announcements || { items: [], source: "" },
    disclosures: {
      source: cninfoRelations?.source || "",
      relations: cninfoRelations?.items || [],
      samples: relationSamples,
      sampleSource: relationSamples.length ? "cninfo-relations-sample" : "",
      requestedSymbol: selectedQuote?.code || formatCode(symbol, symbol.startsWith("6") ? 1 : 0),
    },
    research: researchReports || { source: "", reports: [], stats: {} },
    yahooChart,
    minuteKlines,
    baostock,
    indices,
    quote: mergeQuoteFundamentals(selectedQuote, enrichedFundamentals),
    klines,
    marketKlines,
  };

  const finalPayload = attachPayloadCoverage(applySnapshotFallback(payload, readMarketSnapshot(), symbol));
  return res.status(200).json(finalPayload);
};

function setCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=45, stale-while-revalidate=240");
}

function readMarketSnapshot() {
  const candidates = [path.join(process.cwd(), SNAPSHOT_CACHE_FILE), path.join(__dirname, "..", SNAPSHOT_CACHE_FILE)];
  for (const filePath of candidates) {
    try {
      if (!fs.existsSync(filePath)) continue;
      const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (payload?.ok) return payload;
    } catch (error) {
      // Snapshot fallback is optional; live sources should continue without it.
    }
  }
  return null;
}

async function readFullBaoStockCache(req) {
  return readBundledJson(BAOSTOCK_CACHE_FILE) || (await readPublicJsonCache(req, BAOSTOCK_CACHE_FILE));
}

async function readFullFinancialCache(req) {
  return readBundledJson(FINANCIAL_CACHE_FILE) || (await readPublicJsonCache(req, FINANCIAL_CACHE_FILE));
}

async function readBaoStockCache(symbol, req, payload = null) {
  const cachePayload = payload || (await readFullBaoStockCache(req));
  const key = String(symbol || "").replace(/\D/g, "").slice(0, 6);
  const item = cachePayload?.symbols?.[key];
  if (!item?.rows?.length) {
    return { source: "baostock-cache-miss", symbol: key, rows: [], latest: null };
  }
  return {
    ...item,
    generatedAt: cachePayload.generatedAt,
    lookbackDays: cachePayload.lookbackDays,
  };
}

async function readFinancialCache(symbol, req, payload = null) {
  const cachePayload = payload || (await readFullFinancialCache(req));
  const key = String(symbol || "").replace(/\D/g, "").slice(0, 6);
  const item = cachePayload?.symbols?.[key];
  if (!item) return null;
  return {
    ...item,
    source: item.source?.includes("financial-cache") ? item.source : `${item.source || "financial-cache"}+financial-cache`,
    cache: {
      scope: "github-actions-json",
      generatedAt: cachePayload.generatedAt,
      symbolCount: Object.keys(cachePayload.symbols || {}).length,
    },
  };
}

function needsFinancialCache(fundamentals) {
  if (!fundamentals) return true;
  return emptyRows(fundamentals.rows) || Object.keys(fundamentals.financials || {}).length === 0;
}

function mergeFinancialSources(live, cached) {
  if (!live) return cached;
  if (!cached) return live;
  const sources = [live.source, cached.source].filter(Boolean);
  return {
    ...cached,
    ...live,
    source: [...new Set(sources.join("+").split("+").filter(Boolean))].join("+"),
    financials: Object.keys(live.financials || {}).length ? live.financials : cached.financials,
    rows: hasRows(live.rows) ? live.rows : cached.rows,
    reportDate: live.reportDate || cached.reportDate,
    reportLabel: live.reportLabel || cached.reportLabel,
    cache: cached.cache,
  };
}

function enrichStockUniverse(universe, context = {}) {
  const allRows = universe?.all?.length ? universe.all : universe?.leaders || [];
  const maps = buildStockFeatureMaps(context);
  const all = allRows.map((row) => enrichStockRowWithContext(row, maps));
  const leaders = selectScreenerUniverse(all, 800);
  return {
    ...universe,
    all,
    leaders,
  };
}

function buildStockFeatureMaps({ limitPools, popularityRank, financialCachePayload, baostockCachePayload } = {}) {
  const limit = new Map();
  const addPool = (items, poolType) => {
    (items || []).forEach((row) => {
      const key = stockKey(row.code);
      if (!key || limit.has(key)) return;
      limit.set(key, { ...row, poolType });
    });
  };
  addPool(limitPools?.limitUp, "limitUp");
  addPool(limitPools?.broken, "broken");
  addPool(limitPools?.strong, "strong");

  const hot = new Map();
  (popularityRank?.items || []).forEach((row) => {
    const key = stockKey(row.code);
    if (key) hot.set(key, row);
  });

  return {
    limit,
    hot,
    financial: financialCachePayload?.symbols || {},
    baostock: baostockCachePayload?.symbols || {},
  };
}

function enrichStockRowWithContext(stock, maps) {
  const key = stockKey(stock?.code);
  const limit = maps.limit.get(key);
  const hot = maps.hot.get(key);
  const financial = maps.financial?.[key];
  const baostock = maps.baostock?.[key];
  const financials = financial?.financials || {};
  const latestHistory = baostock?.latest || {};
  const pe = firstFinite(stock.pe, latestHistory.peTTM, financial?.peDynamic);
  const pb = firstFinite(stock.pb, latestHistory.pbMRQ, financial?.pb);
  return {
    ...stock,
    pe,
    pb,
    mainNet: firstFinite(stock.mainNet, 0),
    mainRatio: firstFinite(stock.mainRatio, 0),
    superNet: firstFinite(stock.superNet, 0),
    bigNet: firstFinite(stock.bigNet, 0),
    midNet: firstFinite(stock.midNet, 0),
    smallNet: firstFinite(stock.smallNet, 0),
    limitPool: limit?.poolType || "",
    isLimitUp: limit?.poolType === "limitUp" || Number(stock.pct) >= 9.8,
    limitStreak: firstFinite(limit?.streak, 0),
    sealFund: firstFinite(limit?.sealFund, 0),
    firstSealTime: limit?.firstSealTime || "",
    hotRank: firstFinite(hot?.rank, 0),
    hotRankChange: firstFinite(hot?.rankChange, 0),
    financialCached: Boolean(financial),
    roe: firstFinite(financials.roe, financial?.roe, 0),
    revenue: firstFinite(financials.revenue, 0),
    netProfit: firstFinite(financials.netProfit, financials.parentNetProfit, 0),
    grossMargin: firstFinite(financials.grossMargin, 0),
    debtRatio: firstFinite(financials.debtRatio, 0),
    reportDate: financial?.reportDate || "",
    baostockCached: Boolean(baostock?.rows?.length),
    ma5Price: firstFinite(baostock?.ma5, 0),
    ma20Price: firstFinite(baostock?.ma20, 0),
    ma60Price: firstFinite(baostock?.ma60, 0),
    pct20: firstFinite(baostock?.pct20, 0),
    pct60: firstFinite(baostock?.pct60, 0),
    high60: firstFinite(baostock?.high60, 0),
    low60: firstFinite(baostock?.low60, 0),
    historyDate: latestHistory.date || "",
  };
}

function stockFeatureCoverage(rows = []) {
  const total = rows.length;
  const count = (predicate) => rows.filter(predicate).length;
  return {
    total,
    mainMoney: count((row) => Number(row.mainNet) !== 0 || Number(row.mainRatio) !== 0),
    limitPool: count((row) => row.limitPool),
    hotRank: count((row) => Number(row.hotRank) > 0),
    financialCache: count((row) => row.financialCached),
    baostockCache: count((row) => row.baostockCached),
  };
}

function attachPayloadCoverage(payload) {
  const featureCoverage = payload.stockUniverse?.featureCoverage || stockFeatureCoverage(payload.stocks || []);
  const limitPools = payload.limitPools || {};
  const limitPoolCounts = {
    limitUp: Array.isArray(limitPools.limitUp) ? limitPools.limitUp.length : 0,
    broken: Array.isArray(limitPools.broken) ? limitPools.broken.length : 0,
    strong: Array.isArray(limitPools.strong) ? limitPools.strong.length : 0,
    maxStreak: Number(limitPools.stats?.maxStreak) || 0,
    sealFundYi: Number(limitPools.stats?.sealFundYi) || 0,
  };
  const dataCoverage = {
    stocks: payload.stocks?.length || 0,
    stockUniverseTotal: payload.stockUniverse?.total || payload.stocks?.length || 0,
    sectors: payload.sectors?.length || 0,
    concepts: payload.concepts?.length || 0,
    boardConstituents: payload.boardConstituents?.rows?.length || 0,
    limitPools: limitPoolCounts.limitUp + limitPoolCounts.broken + limitPoolCounts.strong,
    etfs: payload.etfs?.rows?.length || 0,
    moneyFlowRows: payload.moneyFlow?.rows?.length || 0,
    northboundRows: payload.northbound?.rows?.length || 0,
    northboundHoldings: payload.northbound?.holdings?.length || 0,
    fundamentalsRows: payload.fundamentals?.rows?.length || 0,
    hotRank: payload.popularity?.rank?.items?.length || 0,
    announcements: payload.announcements?.items?.length || 0,
    disclosures: payload.disclosures?.relations?.length || 0,
    disclosureSamples: payload.disclosures?.samples?.length || 0,
    researchReports: payload.research?.reports?.length || 0,
    yahooKlines: payload.yahooChart?.klines?.length || 0,
    minuteKlines: payload.minuteKlines?.length || 0,
    baostockRows: payload.baostock?.rows?.length || 0,
  };
  return { ...payload, featureCoverage, limitPoolCounts, dataCoverage };
}

function stockKey(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 6);
}

function firstFinite(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number !== 0) return number;
  }
  return 0;
}

async function readPublicJsonCache(req, relativePath) {
  const host = req?.headers?.host;
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) return null;
  const cacheKey = `public-json:${host}:${relativePath}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;
  const protocol = host.includes("vercel.app") || host.includes(".com") || host.includes(".cn") ? "https" : "http";
  const publicPath = `/${String(relativePath).replace(/^pages\//, "")}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`${protocol}://${host}${publicPath}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const payload = await response.json();
    memoryCache.set(cacheKey, { expires: Date.now() + 10 * 60 * 1000, value: payload });
    return payload;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function readBundledJson(relativePath) {
  const candidates = [path.join(process.cwd(), relativePath), path.join(__dirname, "..", relativePath)];
  for (const filePath of candidates) {
    try {
      if (!fs.existsSync(filePath)) continue;
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      // Optional bundled caches should never prevent live requests.
    }
  }
  return null;
}

function applySnapshotFallback(payload, snapshot, symbol) {
  if (!snapshot?.ok) {
    return {
      ...payload,
      cacheSnapshot: { available: false, hit: false, usedFields: [] },
    };
  }
  const next = { ...payload };
  const usedFields = [];
  const sameSymbol = snapshotMatchesSymbol(snapshot, symbol);
  const fill = (field, isEmpty, isUsable, symbolScoped = false) => {
    if (!isEmpty(next[field]) || !isUsable(snapshot[field])) return;
    if (symbolScoped && !sameSymbol) return;
    next[field] = snapshot[field];
    usedFields.push(field);
  };

  fill("stocks", (value) => emptyRows(value) || next.source.includes("sample-stock-fallback"), hasRows);
  fill("sectors", (value) => emptyRows(value) || next.source.includes("sample-sector-fallback"), hasRows);
  fill("concepts", emptyRows, hasRows);
  fill("limitPools", (value) => emptyRows(value?.limitUp), (value) => hasRows(value?.limitUp));
  fill("etfs", (value) => emptyRows(value?.rows), (value) => hasRows(value?.rows));
  fill("northbound", (value) => emptyRows(value?.rows), (value) => hasRows(value?.rows));
  fill("indices", emptyRows, hasRows);
  fill("marketKlines", emptyRows, hasRows);
  fill("quote", (value) => !value || next.source.includes("quote-fallback"), (value) => value?.code, true);
  fill("klines", emptyRows, hasRows, true);
  fill("minuteKlines", emptyRows, hasRows, true);
  fill("moneyFlow", (value) => emptyRows(value?.rows), (value) => hasRows(value?.rows), true);
  fill("fundamentals", emptyFundamentals, (value) => !emptyFundamentals(value), true);
  fill("announcements", (value) => emptyRows(value?.items), (value) => hasRows(value?.items), true);
  fill("disclosures", (value) => emptyRows(value?.relations) && emptyRows(value?.samples), (value) => hasRows(value?.relations) || hasRows(value?.samples), true);
  fill("research", (value) => emptyRows(value?.reports), (value) => hasRows(value?.reports));
  fill("yahooChart", (value) => emptyRows(value?.klines), (value) => hasRows(value?.klines), true);
  fill("baostock", (value) => emptyRows(value?.rows), (value) => hasRows(value?.rows), true);

  if (emptyRows(next.popularity?.rank?.items) && hasRows(snapshot.popularity?.rank?.items)) {
    next.popularity = { ...(next.popularity || {}), rank: snapshot.popularity.rank };
    usedFields.push("popularity.rank");
  }
  if ((!next.popularity?.stock?.latest || emptyRows(next.popularity?.stock?.keywords)) && snapshot.popularity?.stock?.latest && sameSymbol) {
    next.popularity = { ...(next.popularity || {}), stock: snapshot.popularity.stock };
    usedFields.push("popularity.stock");
  }

  const marketFields = new Set(["stocks", "sectors", "concepts", "limitPools", "etfs", "northbound", "indices", "marketKlines", "research"]);
  if (snapshot.market && usedFields.some((field) => marketFields.has(field))) {
    next.market = { ...(next.market || {}), ...snapshot.market };
    usedFields.push("market");
  }
  next.market = attachNorthboundMarketMetrics(next.market, next.northbound);
  if (usedFields.includes("baostock")) {
    next.source = next.source.replace("baostock-cache-miss", "baostock-history-cache");
  }
  if (usedFields.includes("stocks") && snapshot.stockUniverse) {
    next.stockUniverse = snapshot.stockUniverse;
  } else if (!next.stockUniverse || !next.stockUniverse.returned) {
    next.stockUniverse = {
      total: next.stocks?.length || 0,
      returned: next.stocks?.length || 0,
      limit: next.stocks?.length || 0,
      leaderSample: next.stocks?.length || 0,
      source: next.source,
    };
  }
  if (usedFields.length) {
    next.source = `${next.source}+github-action-cache`;
  }
  next.cacheSnapshot = {
    available: true,
    hit: usedFields.length > 0,
    usedFields,
    generatedAt: snapshot.cacheSnapshot?.generatedAt || snapshot.asOf || null,
    symbol: snapshot.cacheSnapshot?.symbol || snapshot.quote?.code || null,
  };
  return next;
}

function snapshotMatchesSymbol(snapshot, symbol) {
  const normalized = String(symbol || "").replace(/\D/g, "").slice(0, 6);
  const candidates = [snapshot.cacheSnapshot?.symbol, snapshot.quote?.code, snapshot.moneyFlow?.code, snapshot.fundamentals?.code]
    .filter(Boolean)
    .map((value) => String(value).replace(/\D/g, "").slice(0, 6));
  return candidates.includes(normalized);
}

function hasRows(value) {
  return Array.isArray(value) && value.length > 0;
}

function emptyRows(value) {
  return !Array.isArray(value) || value.length === 0;
}

function emptyFundamentals(value) {
  if (!value) return true;
  const financials = value.financials || {};
  return Object.keys(financials).length === 0 && emptyRows(value.rows);
}

function clientStockLimit(req) {
  const raw = req.query?.stockLimit || process.env.MARKET_STOCK_LIMIT || DEFAULT_CLIENT_STOCK_LIMIT;
  const parsed = Math.round(Number(raw));
  if (!Number.isFinite(parsed)) return DEFAULT_CLIENT_STOCK_LIMIT;
  return Math.max(100, Math.min(MAX_CLIENT_STOCK_LIMIT, parsed));
}

function normalizeBoardCode(value) {
  const code = String(value || "").trim().toUpperCase();
  return /^BK\d{4,6}$/.test(code) ? code : "";
}

function annotateBoardConstituents(payload, boardCode, sectors = [], concepts = []) {
  if (!boardCode) return { code: "", name: "", type: "", total: 0, returned: 0, rows: [], source: "" };
  const board = [...sectors, ...concepts].find((row) => row.code === boardCode);
  const rows = payload?.rows || [];
  const inferred = board || inferBoardMetaFromConstituents(rows);
  return {
    source: payload?.source || (rows.length ? "eastmoney-board-constituents" : ""),
    code: boardCode,
    name: inferred?.name || "",
    type: inferred?.type || "",
    total: payload?.total || rows.length,
    returned: payload?.returned || rows.length,
    rows,
  };
}

function inferBoardMetaFromConstituents(rows = []) {
  const industryCounts = new Map();
  const conceptCounts = new Map();
  const addCount = (map, value) => {
    const key = clean(value);
    if (!key || key === "-") return;
    map.set(key, (map.get(key) || 0) + 1);
  };
  rows.forEach((row) => {
    addCount(industryCounts, row.industry);
    String(row.concepts || "")
      .split(/[,，、/]/)
      .forEach((item) => addCount(conceptCounts, item));
  });
  const top = (map) => Array.from(map.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  const concept = top(conceptCounts);
  if (concept && concept[1] >= Math.max(3, rows.length * 0.2)) return { name: concept[0], type: "concept" };
  const industry = top(industryCounts);
  if (industry) return { name: industry[0], type: "industry" };
  return null;
}

function selectClientStocks(stockUniverse, limit) {
  const rows = stockUniverse?.all?.length ? stockUniverse.all : stockUniverse?.leaders || [];
  return rows.slice(0, limit);
}

function selectScreenerUniverse(rows, limit) {
  const selected = new Map();
  const addRows = (items) => {
    items.forEach((row) => {
      if (row?.code && !selected.has(row.code)) selected.set(row.code, row);
    });
  };
  const sorted = (score) =>
    rows
      .slice()
      .filter((row) => row?.code)
      .sort((a, b) => score(b) - score(a));
  const lowSorted = (score) =>
    rows
      .slice()
      .filter((row) => row?.code && score(row) > 0)
      .sort((a, b) => score(a) - score(b));

  addRows(sorted((row) => Number(row.amount) || 0).slice(0, 260));
  addRows(sorted((row) => Number(row.pct) || 0).slice(0, 160));
  addRows(sorted((row) => Number(row.turnover) || 0).slice(0, 160));
  addRows(lowSorted((row) => Number(row.circMv) || Number(row.totalMv) || 0).slice(0, 220));
  addRows(lowSorted((row) => Number(row.totalMv) || Number(row.circMv) || 0).slice(0, 180));
  addRows(rows.slice(0, limit));
  return Array.from(selected.values()).slice(0, limit);
}

function pickStockUniverse(eastmoneyStockResult, sinaStockResult) {
  const eastRows = eastmoneyStockResult?.all || [];
  const sinaRows = sinaStockResult?.all || [];
  if (eastRows.length > 1000 && sinaRows.length > eastRows.length * 1.25) {
    return mergeStockUniverses(eastmoneyStockResult, sinaStockResult);
  }
  if (eastmoneyStockResult?.all?.length > 1000) {
    return { ...eastmoneyStockResult, source: "eastmoney-a-share-pages" };
  }
  if (sinaStockResult?.all?.length > 1000) {
    return { ...sinaStockResult, source: "sina-a-share-pages" };
  }
  if (eastmoneyStockResult?.all?.length) {
    return { ...eastmoneyStockResult, source: "eastmoney-a-share-partial" };
  }
  if (sinaStockResult?.all?.length) {
    return { ...sinaStockResult, source: "sina-a-share-partial" };
  }
  return { leaders: sampleStocks, all: sampleStocks, source: "sample-stock-fallback" };
}

function mergeStockUniverses(primary, fallback) {
  const byCode = new Map();
  (fallback?.all || []).forEach((row) => {
    if (row?.code) byCode.set(row.code, row);
  });
  (primary?.all || []).forEach((row) => {
    if (row?.code) byCode.set(row.code, { ...(byCode.get(row.code) || {}), ...row });
  });
  const all = Array.from(byCode.values());
  const leaderCodes = new Set();
  const leaders = [];
  [...(primary?.leaders || []), ...(fallback?.leaders || [])].forEach((row) => {
    if (row?.code && !leaderCodes.has(row.code)) {
      leaderCodes.add(row.code);
      leaders.push(byCode.get(row.code) || row);
    }
  });
  return {
    all,
    leaders: leaders.length ? leaders : all.slice(0, 800),
    total: all.length,
    source: "eastmoney-sina-a-share-merged",
  };
}

function pickSectorUniverse(eastmoneySectorResult, sinaSectorResult) {
  if (eastmoneySectorResult?.length) return { rows: eastmoneySectorResult, source: "eastmoney-sector-flow" };
  if (sinaSectorResult?.length) return { rows: sinaSectorResult, source: "sina-industry-sectors" };
  return { rows: sampleSectors, source: "sample-sector-fallback" };
}

function pickConceptUniverse(eastmoneyConceptResult, sinaConceptResult) {
  if (eastmoneyConceptResult?.length) return { rows: eastmoneyConceptResult, source: "eastmoney-concept-boards" };
  if (sinaConceptResult?.length) return { rows: sinaConceptResult, source: "sina-concept-boards" };
  return { rows: [], source: "concept-fallback" };
}

async function fetchJson(url, options = {}) {
  const text = await fetchText(url, options);
  return JSON.parse(text);
}

async function postJson(url, payload, options = {}) {
  return fetchJson(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
}

async function fetchCached(key, ttlMs, loader, annotate) {
  const now = Date.now();
  const hit = memoryCache.get(key);
  if (hit && hit.expiresAt > now) {
    return annotate ? annotate(hit.value, { hit: true, updatedAt: hit.updatedAt, ttlSeconds: Math.round(ttlMs / 1000) }) : hit.value;
  }
  const value = await loader();
  const updatedAt = new Date().toISOString();
  memoryCache.set(key, { value, updatedAt, expiresAt: now + ttlMs });
  return annotate ? annotate(value, { hit: false, updatedAt, ttlSeconds: Math.round(ttlMs / 1000) }) : value;
}

function withCacheMeta(value, meta) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  return { ...value, cache: { scope: "vercel-serverless-memory", ...meta } };
}

async function fetchDecodedText(url, encoding, options = {}) {
  const attempts = options.attempts || 3;
  const timeoutMs = options.timeoutMs || 5000;
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0", ...(options.headers || {}) },
        method: options.method || "GET",
        body: options.body,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      return new TextDecoder(encoding).decode(buffer);
    } catch (error) {
      lastError = error;
      await sleep(180 * (attempt + 1));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function fetchText(url, options = {}) {
  const attempts = options.attempts || 3;
  const timeoutMs = options.timeoutMs || 5000;
  const headers = {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json,text/plain,*/*",
    Referer: "https://finance.sina.com.cn/",
    ...(options.headers || {}),
  };
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers,
        method: options.method || "GET",
        body: options.body,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(180 * (attempt + 1));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchEastmoneyStockUniverse() {
  const segments = await Promise.all(EASTMONEY_A_SEGMENTS.map((fs) => fetchEastmoneyStockSegment(fs).catch(() => [])));
  const byCode = new Map();
  segments.flat().forEach((row) => {
    if (row.code && !byCode.has(row.code)) byCode.set(row.code, row);
  });
  const all = Array.from(byCode.values());
  const leaders = selectScreenerUniverse(all, 800);
  return { all, leaders };
}

async function fetchEastmoneyStockSegment(fs) {
  const firstPage = await fetchEastmoneyStockPage(1, fs);
  const total = Number(firstPage.total || firstPage.rows.length || 100);
  const pageCount = Math.min(60, Math.ceil(total / 100));
  const pages = [firstPage.rows];
  const pageNumbers = Array.from({ length: pageCount - 1 }, (_, index) => index + 2);
  const chunkSize = 20;
  for (let index = 0; index < pageNumbers.length; index += chunkSize) {
    const chunk = pageNumbers.slice(index, index + chunkSize);
    const results = await Promise.all(chunk.map((page) => fetchEastmoneyStockPage(page, fs).catch(() => ({ rows: [] }))));
    pages.push(...results.map((result) => result.rows));
  }
  return pages.flat().filter((row) => row.code && row.name);
}

async function fetchEastmoneyStockPage(page, fs = EASTMONEY_A_FS) {
  const params = new URLSearchParams({
    pn: String(page),
    pz: "100",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f6",
    fs,
    fields: STOCK_FIELDS,
  });
  const payload = await fetchJson(`${EASTMONEY_ETF_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 2500,
    headers: { Referer: "https://quote.eastmoney.com/" },
  });
  const rows = payload?.data?.diff || [];
  return { total: payload?.data?.total || rows.length, rows: rows.map(normalizeStockRow) };
}

async function fetchSinaStockUniverse() {
  const total = await fetchSinaStockCount().catch(() => 5600);
  const pageCount = Math.min(SINA_MAX_PAGES, Math.ceil(total / SINA_PAGE_SIZE));
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = [];
  const chunkSize = 10;
  for (let index = 0; index < pageNumbers.length; index += chunkSize) {
    const chunk = pageNumbers.slice(index, index + chunkSize);
    const results = await Promise.all(chunk.map((page) => fetchSinaStockPage(page).catch(() => [])));
    pages.push(...results);
  }
  const byCode = new Map();
  pages.flat().forEach((row) => {
    if (row.code && !byCode.has(row.code)) byCode.set(row.code, row);
  });
  const all = Array.from(byCode.values());
  const leaders = selectScreenerUniverse(all, 800);
  return { all, leaders };
}

async function fetchSinaStockCount() {
  const text = await fetchText(SINA_A_COUNT_URL, { attempts: 2, timeoutMs: 3500 });
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : 5600;
}

async function fetchSinaStockPage(page) {
  const params = new URLSearchParams({
    page: String(page),
    num: String(SINA_PAGE_SIZE),
    sort: "symbol",
    asc: "1",
    node: "hs_a",
    symbol: "",
    _s_r_a: "page",
  });
  const payload = await fetchJson(`${SINA_A_STOCK_URL}?${params}`, { attempts: 2, timeoutMs: 4000 });
  return Array.isArray(payload) ? payload.map(normalizeSinaStockRow) : [];
}

async function fetchSinaSectors() {
  const text = await fetchDecodedText(SINA_INDUSTRY_URL, "gb18030", { attempts: 2, timeoutMs: 3500 });
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd < jsonStart) return [];
  const payload = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  return Object.values(payload)
    .map((row, index) => normalizeSinaBoardRow(row, index, "industry"))
    .filter((row) => row.code && row.name)
    .sort((a, b) => (b.pct || 0) - (a.pct || 0))
    .map((row, index) => ({ ...row, rank: index + 1 }))
    .slice(0, 80);
}

async function fetchSinaConcepts() {
  const text = await fetchDecodedText(SINA_CONCEPT_URL, "gb18030", { attempts: 2, timeoutMs: 3500 });
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd < jsonStart) return [];
  const payload = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  return Object.values(payload)
    .map((row, index) => normalizeSinaBoardRow(row, index, "concept"))
    .filter((row) => row.code && row.name)
    .sort((a, b) => (b.pct || 0) - (a.pct || 0))
    .map((row, index) => ({ ...row, rank: index + 1 }))
    .slice(0, 120);
}

async function fetchEastmoneySectors() {
  return fetchEastmoneyBoards("m:90+t:2", "industry", 80);
}

async function fetchEastmoneyConcepts() {
  return fetchEastmoneyBoards("m:90+t:3", "concept", 500);
}

async function fetchEastmoneyBoards(fs, type, limit) {
  const pageSize = Math.min(100, limit);
  const firstPage = await fetchEastmoneyBoardPage(fs, 1, pageSize);
  const total = Number(firstPage.total || firstPage.rows.length || limit);
  const pageCount = Math.min(Math.ceil(total / pageSize), Math.ceil(limit / pageSize));
  const pages = [firstPage.rows];
  const pageNumbers = Array.from({ length: pageCount - 1 }, (_, index) => index + 2);
  const results = await Promise.all(pageNumbers.map((page) => fetchEastmoneyBoardPage(fs, page, pageSize).catch(() => ({ rows: [] }))));
  pages.push(...results.map((result) => result.rows));
  return pages
    .flat()
    .slice(0, limit)
    .map((row, index) => normalizeEastmoneyBoardRow(row, index, type));
}

async function fetchEastmoneyBoardConstituents(boardCode) {
  const limit = 500;
  const pageSize = 100;
  const firstPage = await fetchEastmoneyBoardConstituentPage(boardCode, 1, pageSize);
  const total = Number(firstPage.total || firstPage.rows.length || 0);
  const pageCount = Math.min(Math.ceil(total / pageSize), Math.ceil(limit / pageSize));
  const pages = [firstPage.rows];
  const pageNumbers = Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => index + 2);
  const results = await Promise.all(pageNumbers.map((page) => fetchEastmoneyBoardConstituentPage(boardCode, page, pageSize).catch(() => ({ rows: [] }))));
  pages.push(...results.map((result) => result.rows));
  const rows = pages
    .flat()
    .slice(0, limit)
    .map((row, index) => ({ ...normalizeStockRow(row), rank: index + 1, netFund: num(row.f62) }));
  return {
    source: "eastmoney-board-constituents",
    code: boardCode,
    total,
    returned: rows.length,
    rows,
  };
}

async function fetchEastmoneyBoardConstituentPage(boardCode, page, pageSize) {
  const params = new URLSearchParams({
    pn: String(page),
    pz: String(pageSize),
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f3",
    fs: `b:${boardCode}`,
    fields: BOARD_CONSTITUENT_FIELDS,
  });
  const payload = await fetchJson(`${EASTMONEY_ETF_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 3500,
    headers: { Referer: "https://quote.eastmoney.com/" },
  });
  const rows = payload?.data?.diff || [];
  return { total: payload?.data?.total || rows.length, rows };
}

async function fetchEastmoneyBoardPage(fs, page, pageSize) {
  const params = new URLSearchParams({
    pn: String(page),
    pz: String(pageSize),
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f3",
    fs,
    fields: BOARD_FIELDS,
  });
  const payload = await fetchJson(`${EASTMONEY_ETF_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 2500,
    headers: { Referer: "https://quote.eastmoney.com/" },
  });
  const rows = payload?.data?.diff || [];
  return { total: payload?.data?.total || rows.length, rows };
}

function normalizeEastmoneyBoardRow(row, index, type) {
  const upCount = num(row.f104);
  const downCount = num(row.f105);
  const flatCount = num(row.f106);
  const leaderName = clean(row.f128);
  const leaderCode = clean(row.f140);
  return {
    code: clean(row.f12),
    name: clean(row.f14),
    type,
    price: num(row.f2),
    pct: num(row.f3),
    rank: index + 1,
    change: num(row.f4),
    volume: num(row.f5),
    amount: num(row.f6),
    amplitude: num(row.f7),
    turnover: num(row.f8),
    totalMv: num(row.f20),
    circMv: num(row.f21),
    netFund: num(row.f62),
    upCount,
    downCount,
    flatCount,
    companyCount: upCount + downCount + flatCount,
    leader:
      leaderName && leaderName !== "-"
        ? {
            code: leaderCode ? formatCode(leaderCode, row.f141) : "",
            name: leaderName,
            pct: num(row.f136),
          }
        : null,
  };
}

async function fetchEastmoneyLimitPools(date) {
  const [limitUp, broken, strong] = await Promise.all([
    fetchEastmoneyPool("limitUp", "/getTopicZTPool", date, "fbt:asc").catch(() => []),
    fetchEastmoneyPool("broken", "/getTopicZBPool", date, "fbt:asc").catch(() => []),
    fetchEastmoneyPool("strong", "/getTopicQSPool", date, "zdp:desc").catch(() => []),
  ]);
  const maxStreak = limitUp.reduce((max, row) => Math.max(max, Number(row.streak) || 0), 0);
  const sealFundYi = roundYi(limitUp.reduce((sum, row) => sum + (Number(row.sealFund) || 0), 0));
  return {
    source: "eastmoney-limit-pools",
    date,
    limitUp,
    broken,
    strong,
    stats: {
      limitUpCount: limitUp.length,
      brokenCount: broken.length,
      strongCount: strong.length,
      maxStreak,
      sealFundYi,
    },
  };
}

async function fetchEastmoneyPool(type, path, date, sort) {
  const params = new URLSearchParams({
    ut: "7eea3edcaed734bea9cbfc24409ed989",
    dpt: "wz.ztzt",
    Pageindex: "0",
    pagesize: "5000",
    sort,
    date,
  });
  const payload = await fetchJson(`${EASTMONEY_LIMIT_POOL_URL}${path}?${params}`, {
    attempts: 2,
    timeoutMs: 5000,
    headers: { Referer: "https://quote.eastmoney.com/ztb/detail" },
  });
  const rows = payload?.data?.pool || [];
  return rows.map((row, index) => normalizeLimitPoolRow(row, type, index + 1));
}

async function fetchEastmoneyEtfs() {
  const fields = [
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f10",
    "f12",
    "f13",
    "f14",
    "f15",
    "f16",
    "f17",
    "f18",
    "f20",
    "f21",
    "f62",
    "f66",
    "f72",
    "f78",
    "f84",
    "f184",
    "f297",
    "f402",
    "f441",
  ].join(",");
  const params = new URLSearchParams({
    pn: "1",
    pz: "160",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    wbp2u: "|0|0|0|web",
    fid: "f6",
    fs: "b:MK0021,b:MK0022,b:MK0023,b:MK0024,b:MK0827",
    fields,
  });
  const payload = await fetchJson(`${EASTMONEY_ETF_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 5000,
    headers: { Referer: "https://quote.eastmoney.com/center/gridlist.html#fund_etf" },
  });
  const rows = (payload?.data?.diff || []).map((row, index) => normalizeEtfRow(row, index + 1));
  const mainNetYi = roundYi(rows.reduce((sum, row) => sum + (Number(row.mainNet) || 0), 0));
  return {
    source: "eastmoney-etf-spot",
    rows,
    stats: {
      total: payload?.data?.total || rows.length,
      sample: rows.length,
      mainNetYi,
      topAmountName: rows[0]?.name || "",
      topMainNetName: rows.slice().sort((a, b) => (b.mainNet || 0) - (a.mainNet || 0))[0]?.name || "",
    },
  };
}

async function fetchEastmoneyHotRank() {
  const payload = await postJson(
    `${EASTMONEY_STOCK_RANK_URL}/getAllCurrentList`,
    {
      appId: "appId01",
      globalId: "786e4c21-70dc-435a-93bb-38",
      marketType: "",
      pageNo: 1,
      pageSize: 100,
    },
    { attempts: 2, timeoutMs: 4500, headers: { Referer: "https://guba.eastmoney.com/rank/" } }
  );
  const rankRows = payload?.data || [];
  const secids = rankRows.map((row) => emPrefixedToSecid(row.sc)).filter(Boolean);
  const quoteMap = new Map();
  if (secids.length) {
    const params = new URLSearchParams({
      ut: "f057cbcbce2a86e2866ab8877db1d059",
      fltt: "2",
      invt: "2",
      fields: "f14,f3,f12,f2,f13",
      secids: secids.join(","),
    });
    const quotePayload = await fetchJson(`https://push2.eastmoney.com/api/qt/ulist.np/get?${params}`, {
      attempts: 1,
      timeoutMs: 3500,
      headers: { Referer: "https://guba.eastmoney.com/rank/" },
    }).catch(() => null);
    (quotePayload?.data?.diff || []).forEach((row) => {
      quoteMap.set(formatCode(row.f12, row.f13), {
        name: clean(row.f14),
        price: num(row.f2),
        pct: num(row.f3),
      });
    });
  }
  return {
    source: "eastmoney-hot-rank",
    items: rankRows.map((row) => {
      const code = emPrefixedToCode(row.sc);
      const quote = quoteMap.get(code) || {};
      return {
        rank: num(row.rk),
        code,
        name: quote.name || "",
        price: quote.price || 0,
        pct: quote.pct || 0,
        rankChange: num(row.rc),
        historyRankChange: num(row.hisRc),
      };
    }),
  };
}

async function fetchEastmoneyStockPopularity(symbol) {
  const sourceCode = emPrefixedFromSymbol(symbol);
  const basePayload = {
    appId: "appId01",
    globalId: "786e4c21-70dc-435a-93bb-38",
    marketType: "",
    srcSecurityCode: sourceCode,
  };
  const [latestPayload, keywordsPayload, relatedPayload, realtimePayload] = await Promise.all([
    postJson(`${EASTMONEY_STOCK_RANK_URL}/getCurrentLatest`, basePayload, {
      attempts: 2,
      timeoutMs: 4000,
      headers: { Referer: "https://guba.eastmoney.com/rank/" },
    }).catch(() => null),
    postJson(`${EASTMONEY_STOCK_RANK_URL}/getHotStockRankList`, basePayload, {
      attempts: 2,
      timeoutMs: 4000,
      headers: { Referer: "https://guba.eastmoney.com/rank/" },
    }).catch(() => null),
    postJson(`${EASTMONEY_STOCK_RANK_URL}/getFollowStockRankList`, basePayload, {
      attempts: 2,
      timeoutMs: 4000,
      headers: { Referer: "https://guba.eastmoney.com/rank/" },
    }).catch(() => null),
    postJson(`${EASTMONEY_STOCK_RANK_URL}/getCurrentList`, basePayload, {
      attempts: 2,
      timeoutMs: 4000,
      headers: { Referer: "https://guba.eastmoney.com/rank/" },
    }).catch(() => null),
  ]);
  return {
    source: "eastmoney-stock-popularity",
    latest: normalizePopularityLatest(latestPayload?.data, symbol),
    keywords: (keywordsPayload?.data || []).slice(0, 12).map(normalizeHotKeyword),
    related: (relatedPayload?.data || []).slice(0, 12).map(normalizeRelatedStock),
    realtime: (realtimePayload?.data || []).slice(-36).map((row) => ({ time: clean(row.calcTime), rank: num(row.rank) })),
  };
}

async function fetchEastmoneyAnnouncements(symbol) {
  const params = new URLSearchParams({
    sr: "-1",
    page_size: "12",
    page_index: "1",
    ann_type: "A",
    client_source: "web",
    stock_list: symbol,
    f_node: "0",
    s_node: "0",
  });
  const payload = await fetchJson(`${EASTMONEY_ANNOUNCEMENT_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 4500,
    headers: { Referer: "https://data.eastmoney.com/notices/" },
  });
  return {
    source: "eastmoney-announcements",
    items: (payload?.data?.list || []).map(normalizeAnnouncement),
  };
}

async function fetchCninfoAnnouncements(symbol) {
  return fetchCninfoDisclosure(symbol, "fulltext", "cninfo-announcements", normalizeCninfoAnnouncement);
}

async function fetchCninfoRelations(symbol) {
  return fetchCninfoDisclosure(symbol, "relation", "cninfo-relations", normalizeCninfoRelation);
}

async function fetchCninfoRelationSamples(symbol, stocks = []) {
  const selected = stockKey(symbol);
  const liveCandidates = (stocks || [])
    .slice()
    .sort((a, b) => (Number(b.hotRank) > 0 ? 100000 - Number(b.hotRank) : 0) - (Number(a.hotRank) > 0 ? 100000 - Number(a.hotRank) : 0) || (Number(b.amount) || 0) - (Number(a.amount) || 0))
    .map((stock) => stockKey(stock.code));
  const candidates = Array.from(new Set(["300750", "002156", "000001", "300059", "688981", "000725", ...liveCandidates]))
    .filter((code) => code && code.length === 6 && code !== selected)
    .slice(0, 8);
  const groups = await Promise.all(candidates.map((code) => fetchCninfoRelations(code).catch(() => null)));
  return groups
    .flatMap((group) => group?.items || [])
    .map((row) => ({
      ...row,
      sample: true,
      sampleReason: "当前个股暂无近期调研披露，展示公开源近期样本",
      requestedSymbol: selected,
    }))
    .sort((a, b) => String(b.sortDate || b.date || "").localeCompare(String(a.sortDate || a.date || "")))
    .slice(0, 12);
}

async function fetchEastmoneyResearchReports() {
  const beginTime = formatCompactDate(compactChinaDate(-30));
  const endTime = formatCompactDate(compactChinaDate());
  const groups = await Promise.all(
    [
      [1, "行业研报"],
      [2, "宏观策略"],
    ].map(([qType, label]) => fetchEastmoneyResearchGroup(qType, label, beginTime, endTime).catch(() => []))
  );
  const reports = groups
    .flat()
    .sort((a, b) => String(b.publishDate).localeCompare(String(a.publishDate)))
    .slice(0, 80);
  return {
    source: "eastmoney-research-reports",
    range: { beginTime, endTime },
    reports,
    stats: buildResearchStats(reports),
  };
}

async function fetchEastmoneyResearchGroup(qType, label, beginTime, endTime) {
  const params = new URLSearchParams({
    cb: "",
    pageNo: "1",
    pageSize: "40",
    industryCode: "*",
    rating: "",
    ratingChange: "",
    beginTime,
    endTime,
    fields: "",
    qType: String(qType),
    orgCode: "",
    rcode: "",
    p: "1",
    pageNum: "1",
    pageNumber: "1",
  });
  const payload = await fetchJson(`${EASTMONEY_REPORT_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 5000,
    headers: { Referer: "https://data.eastmoney.com/report/" },
  });
  return (payload?.data || []).map((row) => normalizeResearchReport(row, qType, label));
}

function normalizeResearchReport(row, qType, label) {
  const encodeUrl = clean(row.encodeUrl);
  const detailPath = qType === 1 ? "zw_industry.jshtml" : "zw_macresearch.jshtml";
  const industry = clean(row.industryName || row.indvInduName || row.stockName || label);
  const researcher = Array.isArray(row.author) && row.author.length ? row.author.map((item) => clean(item).split(".").pop()).join(",") : clean(row.researcher);
  return {
    title: clean(row.title),
    category: label,
    qType,
    reportType: num(row.reportType),
    publishDate: clean(row.publishDate).slice(0, 10),
    orgName: clean(row.orgName),
    orgSName: clean(row.orgSName || row.orgName),
    researcher,
    industryCode: clean(row.industryCode || row.emIndustryCode || row.indvInduCode),
    industryName: industry,
    stockCode: clean(row.stockCode),
    stockName: clean(row.stockName),
    ratingName: clean(row.emRatingName || row.sRatingName),
    ratingChange: clean(row.ratingChange),
    pages: num(row.attachPages),
    sizeKb: num(row.attachSize),
    infoCode: clean(row.infoCode),
    encodeUrl,
    url: encodeUrl ? `https://data.eastmoney.com/report/${detailPath}?encodeUrl=${encodeURIComponent(encodeUrl)}` : "https://data.eastmoney.com/report/",
    snippet: [industry, clean(row.orgSName || row.orgName), researcher, row.attachPages ? `${row.attachPages}页` : ""].filter(Boolean).join(" · "),
  };
}

function buildResearchStats(reports) {
  const byIndustry = new Map();
  const orgs = new Set();
  reports.forEach((report) => {
    const industry = report.industryName || report.category || "未归类";
    byIndustry.set(industry, (byIndustry.get(industry) || 0) + 1);
    if (report.orgSName) orgs.add(report.orgSName);
  });
  return {
    total: reports.length,
    orgCount: orgs.size,
    latestDate: reports[0]?.publishDate || "",
    byIndustry: Array.from(byIndustry.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
  };
}

async function fetchCninfoDisclosure(symbol, tabName, sourceName, normalizeRow) {
  const stockMap = await fetchCached("cninfo:stock-map", FINANCIAL_CACHE_MS, fetchCninfoStockMap).catch(() => ({}));
  const orgId = stockMap[symbol];
  if (!orgId) return { source: sourceName, items: [] };
  const endDate = compactChinaDate();
  const startDate = compactChinaDate(-370);
  const body = new URLSearchParams({
    pageNum: "1",
    pageSize: "30",
    column: "szse",
    tabName,
    plate: "",
    stock: `${symbol},${orgId}`,
    searchkey: "",
    secid: "",
    category: "",
    trade: "",
    seDate: `${formatCompactDate(startDate)}~${formatCompactDate(endDate)}`,
    sortName: "",
    sortType: "",
    isHLtitle: "true",
  });
  const payload = await fetchJson(CNINFO_ANNOUNCEMENT_URL, {
    method: "POST",
    body: body.toString(),
    attempts: 2,
    timeoutMs: 5000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "http://www.cninfo.com.cn/new/commonUrl/pageOfSearch?url=disclosure/list/search",
    },
  });
  return {
    source: sourceName,
    items: (payload?.announcements || []).slice(0, 20).map(normalizeRow),
  };
}

async function fetchCninfoStockMap() {
  const payload = await fetchJson(CNINFO_STOCK_URL, {
    attempts: 2,
    timeoutMs: 5000,
    headers: { Referer: "http://www.cninfo.com.cn/new/commonUrl/pageOfSearch?url=disclosure/list/search" },
  });
  const entries = payload?.stockList || [];
  return Object.fromEntries(entries.map((row) => [clean(row.code), clean(row.orgId)]).filter(([code, orgId]) => code && orgId));
}

function mergeAnnouncementSources(eastmoney, cninfo) {
  const items = [];
  const seen = new Set();
  [eastmoney, cninfo].forEach((source) => {
    (source?.items || []).forEach((item) => {
      const key = `${item.date || ""}:${normalizeAnnouncementTitle(item.title || "")}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push(item);
    });
  });
  items.sort((a, b) => String(b.sortDate || b.date || "").localeCompare(String(a.sortDate || a.date || "")));
  const sources = [eastmoney, cninfo].filter((source) => source?.items?.length).map((source) => source.source);
  return {
    source: sources.length ? sources.join("+") : "",
    items: items.slice(0, 20),
    eastmoneyItems: eastmoney?.items || [],
    cninfoItems: cninfo?.items || [],
  };
}

async function fetchEastmoneyKlines(secid) {
  const url =
    "https://push2his.eastmoney.com/api/qt/stock/kline/get" +
    `?secid=${secid}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=1&beg=20250101&end=20500101`;
  const payload = await fetchJson(url);
  return (payload?.data?.klines || []).slice(-120).map((line) => {
    const [date, open, close, high, low, volume, amount, amplitude, pct, change, turnover] = String(line).split(",");
    return {
      date,
      open: num(open),
      high: num(high),
      low: num(low),
      close: num(close),
      volume: num(volume),
      amount: num(amount),
      amplitude: num(amplitude),
      pct: num(pct),
      change: num(change),
      turnover: num(turnover),
    };
  });
}

async function fetchEastmoneyMinuteKlines(secid) {
  const url =
    "https://push2delay.eastmoney.com/api/qt/stock/trends2/get" +
    `?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ndays=1&iscr=0&iscca=0`;
  const payload = await fetchJson(url, {
    attempts: 2,
    timeoutMs: 4500,
    headers: { Referer: "https://quote.eastmoney.com/" },
  });
  return (payload?.data?.trends || []).map((line) => {
    const [time, open, close, high, low, volume, amount, avgPrice] = String(line).split(",");
    return {
      time,
      date: time,
      open: num(open),
      high: num(high),
      low: num(low),
      close: num(close),
      volume: num(volume),
      amount: num(amount),
      avgPrice: num(avgPrice),
    };
  });
}

async function fetchEastmoneyMoneyFlow(secid) {
  const params = new URLSearchParams({
    lmt: "20",
    klt: "101",
    secid,
    fields1: "f1,f2,f3,f7",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65",
    ut: "b2884a393a59ad64002292a3e90d46a5",
    _: String(Date.now()),
  });
  const payload = await fetchJson(`https://push2his.eastmoney.com/api/qt/stock/fflow/daykline/get?${params}`, {
    attempts: 2,
    timeoutMs: 4500,
  });
  const rows = (payload?.data?.klines || []).map(normalizeMoneyFlowLine);
  const latest = rows[rows.length - 1] || null;
  const sum5MainYi = roundYi(rows.slice(-5).reduce((sum, row) => sum + (Number(row.mainNet) || 0), 0));
  return {
    code: formatCode(payload?.data?.code, payload?.data?.market),
    name: clean(payload?.data?.name),
    rows,
    latest,
    sum5MainYi,
  };
}

async function fetchEastmoneyNorthbound() {
  const [quotaPayload, kamtPayload, holdings] = await Promise.all([
    fetchEastmoneyNorthboundQuota(),
    fetchEastmoneyKamt().catch(() => null),
    fetchEastmoneyNorthboundHoldings().catch(() => []),
  ]);
  const rows = mergeKamtRows((quotaPayload?.result?.data || []).map(normalizeNorthboundRow), kamtPayload?.rows || []);
  const northRows = rows.filter((row) => row.direction === "北向");
  return {
    source: [kamtPayload?.rows?.length ? "eastmoney-northbound+eastmoney-kamt" : "eastmoney-northbound", holdings.length ? "eastmoney-northbound-holdings" : ""].filter(Boolean).join("+"),
    rows,
    northRows,
    holdings,
    northNetBuyYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.netBuyAmt) || 0), 0)),
    northNetInYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.dayNetAmtIn) || 0), 0)),
    northTurnoverYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.turnoverAmt) || 0), 0)),
    northMonthNetInYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.monthNetAmtIn) || 0), 0)),
    northYearNetInYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.yearNetAmtIn) || 0), 0)),
    northAllNetInYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.allNetAmtIn) || 0), 0)),
  };
}

async function fetchEastmoneyNorthboundQuota() {
  const params = new URLSearchParams({
    reportName: "RPT_MUTUAL_QUOTA",
    columns: "TRADE_DATE,MUTUAL_TYPE,BOARD_TYPE,MUTUAL_TYPE_NAME,FUNDS_DIRECTION,INDEX_CODE,INDEX_NAME,BOARD_CODE",
    quoteColumns: "status~07~BOARD_CODE,dayNetAmtIn~07~BOARD_CODE,dayAmtRemain~07~BOARD_CODE,dayAmtThreshold~07~BOARD_CODE,f104~07~BOARD_CODE,f105~07~BOARD_CODE,f106~07~BOARD_CODE,f3~03~INDEX_CODE~INDEX_f3,netBuyAmt~07~BOARD_CODE",
    quoteType: "0",
    pageNumber: "1",
    pageSize: "2000",
    sortTypes: "1",
    sortColumns: "MUTUAL_TYPE",
    source: "WEB",
    client: "WEB",
  });
  return fetchJson(`${EASTMONEY_HSGT_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 4500,
    headers: { Referer: "https://data.eastmoney.com/hsgt/index.html" },
  });
}

async function fetchEastmoneyKamt() {
  const params = new URLSearchParams({
    fields1: "f1,f2,f3,f4",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63",
  });
  const payload = await fetchJson(`${EASTMONEY_KAMT_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 4500,
    headers: { Referer: "https://data.eastmoney.com/hsgt/index.html" },
  });
  const rows = [
    normalizeKamtRow(payload?.data?.hk2sh, "沪股通", "沪港通", "北向"),
    normalizeKamtRow(payload?.data?.hk2sz, "深股通", "深港通", "北向"),
    normalizeKamtRow(payload?.data?.sh2hk, "港股通(沪)", "沪港通", "南向"),
    normalizeKamtRow(payload?.data?.sz2hk, "港股通(深)", "深港通", "南向"),
  ].filter(Boolean);
  return { source: "eastmoney-kamt", rows };
}

async function fetchEastmoneyNorthboundHoldings() {
  const params = new URLSearchParams({
    reportName: "RPT_MUTUAL_HOLDSTOCKNORTH_STA",
    columns: "ALL",
    pageNumber: "1",
    pageSize: "80",
    sortColumns: "TRADE_DATE,HOLD_MARKET_CAP",
    sortTypes: "-1,-1",
    source: "WEB",
    client: "WEB",
  });
  const payload = await fetchJson(`${EASTMONEY_HSGT_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 5000,
    headers: { Referer: "https://data.eastmoney.com/hsgt/index.html" },
  });
  return (payload?.result?.data || []).map((row, index) => normalizeNorthboundHoldingRow(row, index + 1));
}

async function fetchYahooChart(symbol) {
  const yahooSymbol = yahooSymbolFromAshare(symbol);
  const payload = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?range=6mo&interval=1d`, {
    attempts: 2,
    timeoutMs: 4500,
    headers: { Referer: "https://finance.yahoo.com/" },
  });
  const result = payload?.chart?.result?.[0];
  if (!result) return null;
  const timestamps = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const klines = timestamps.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toISOString().slice(0, 10),
    open: num(quote.open?.[index]),
    high: num(quote.high?.[index]),
    low: num(quote.low?.[index]),
    close: num(quote.close?.[index]),
    volume: num(quote.volume?.[index]),
  }));
  return {
    source: "yahoo-chart-yfinance-compatible",
    symbol: yahooSymbol,
    price: num(result.meta?.regularMarketPrice),
    currency: clean(result.meta?.currency),
    exchange: clean(result.meta?.exchangeName),
    klines: klines.slice(-120),
  };
}

async function fetchEastmoneyIndices() {
  const codes = ["1.000001", "0.399001", "0.399006", "1.000300", "1.000905"];
  const url =
    "https://push2.eastmoney.com/api/qt/ulist.np/get" +
    `?fltt=2&invt=2&fields=${INDEX_FIELDS}&secids=${codes.join(",")}`;
  const payload = await fetchJson(url);
  return (payload?.data?.diff || []).map((row) => ({
    code: formatCode(row.f12, row.f13),
    name: clean(row.f14),
    price: num(row.f2),
    pct: num(row.f3),
    change: num(row.f4),
    volume: num(row.f5),
    amount: num(row.f6),
  }));
}

async function fetchFundamentals(symbol, secid) {
  const [eastmoney, sina] = await Promise.all([
    fetchEastmoneyFundamentals(secid).catch(() => null),
    fetchSinaFinancialSummary(symbol).catch(() => null),
  ]);
  if (eastmoney && sina) {
    return {
      ...sina,
      ...eastmoney,
      source: "eastmoney-fundamentals+sina-financial-report",
      financials: sina.financials,
      reportDate: sina.reportDate,
      reportLabel: sina.reportLabel,
    };
  }
  return eastmoney || sina;
}

async function fetchEastmoneyFundamentals(secid) {
  const fields = [
    "f43",
    "f57",
    "f58",
    "f116",
    "f117",
    "f152",
    "f162",
    "f167",
    "f168",
    "f171",
    "f173",
    "f183",
    "f184",
    "f185",
    "f186",
    "f187",
    "f190",
    "f191",
    "f192",
  ].join(",");
  const payload = await fetchJson(`https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields=${fields}`, {
    attempts: 2,
    timeoutMs: 3500,
  });
  const row = payload?.data;
  if (!row) return null;
  return { ...normalizeFundamentals(row, secid), source: "eastmoney-fundamentals" };
}

async function fetchSinaFinancialSummary(symbol) {
  const paperCode = `${symbol.startsWith("6") ? "sh" : "sz"}${symbol}`;
  const params = new URLSearchParams({
    paperCode,
    source: "gjzb",
    type: "0",
    page: "1",
    num: "1000",
  });
  const payload = await fetchJson(`https://quotes.sina.cn/cn/api/openapi.php/CompanyFinanceService.getFinanceReport2022?${params}`, {
    attempts: 2,
    timeoutMs: 5000,
    headers: { Referer: "https://finance.sina.com.cn/" },
  });
  const data = payload?.result?.data;
  const reportList = data?.report_list || {};
  const reportMeta =
    (data?.report_date || []).find((item) => reportList[item.date_value]?.data?.length) ||
    Object.keys(reportList)
      .sort()
      .reverse()
      .map((date) => ({ date_value: date, date_description: date }))[0];
  if (!reportMeta) return null;
  const rows = (reportList[reportMeta.date_value]?.data || [])
    .filter((item) => Number(item.item_display_type) === 2 && item.item_title)
    .map((item) => ({
      field: clean(item.item_field),
      title: clean(item.item_title),
      value: item.item_value === null || item.item_value === "" ? null : num(item.item_value),
      group: num(item.item_group_no),
    }));
  const byTitle = new Map(rows.map((row) => [row.title, row.value]));
  return {
    source: "sina-financial-report",
    code: formatCode(symbol, symbol.startsWith("6") ? 1 : 0),
    name: "",
    reportDate: reportMeta.date_value,
    reportLabel: reportMeta.date_description,
    financials: {
      parentNetProfit: byTitle.get("归母净利润") ?? null,
      revenue: byTitle.get("营业总收入") ?? null,
      netProfit: byTitle.get("净利润") ?? null,
      operatingCashFlow: byTitle.get("经营现金流量净额") ?? null,
      epsBasic: byTitle.get("基本每股收益") ?? null,
      navps: byTitle.get("每股净资产") ?? null,
      roe: byTitle.get("净资产收益率(ROE)") ?? null,
      roa: byTitle.get("总资产报酬率(ROA)") ?? null,
      grossMargin: byTitle.get("毛利率") ?? null,
      netMargin: byTitle.get("销售净利率") ?? null,
      debtRatio: byTitle.get("资产负债率") ?? null,
    },
    rows: rows.slice(0, 36),
  };
}

async function fetchEastmoneyQuote(secid) {
  const url =
    "https://push2.eastmoney.com/api/qt/stock/get" +
    `?secid=${secid}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields=f43,f44,f45,f46,f47,f48,f49,f57,f58,f60,f168,f169,f170,f152`;
  const payload = await fetchJson(url);
  const row = payload?.data;
  if (!row) return null;
  const scale = 10 ** Number(row.f152 || 2);
  return {
    code: formatCode(row.f57, secid.startsWith("1.") ? 1 : 0),
    name: clean(row.f58),
    price: num(row.f43) / scale,
    high: num(row.f44) / scale,
    low: num(row.f45) / scale,
    open: num(row.f46) / scale,
    volume: num(row.f47),
    amount: num(row.f48),
    preClose: num(row.f60) / scale,
    turnover: num(row.f168) / 100,
    change: num(row.f169) / scale,
    pct: num(row.f170) / 100,
  };
}

async function fetchTencentQuote(symbol) {
  const prefix = symbol.startsWith("6") ? "sh" : "sz";
  const text = await fetchDecodedText(`${TENCENT_QUOTE_URL}${prefix}${symbol}`, "gb18030", {
    attempts: 2,
    timeoutMs: 3500,
    headers: { Referer: "https://stockapp.finance.qq.com/" },
  });
  const raw = text.split('"')[1] || "";
  const parts = raw.split("~");
  if (parts.length < 35 || !parts[2]) return null;
  const amount = num((parts[35] || "").split("/")[2]) || num(parts[57]) * 10000;
  return {
    code: formatSinaCode(`${prefix}${parts[2]}`, parts[2]),
    name: clean(parts[1]),
    price: num(parts[3]),
    high: num(parts[33]),
    low: num(parts[34]),
    open: num(parts[5]),
    volume: num(parts[36]),
    amount,
    preClose: num(parts[4]),
    turnover: num(parts[38]),
    change: num(parts[31]),
    pct: num(parts[32]),
    totalMv: num(parts[44]) * 100000000,
    circMv: num(parts[45]) * 100000000,
    pe: num(parts[52]) || num(parts[39]),
    pb: num(parts[46]),
    ticktime: clean(parts[30]),
  };
}

function normalizeStockRow(row) {
  return {
    code: formatCode(row.f12, row.f13),
    name: clean(row.f14),
    price: num(row.f2),
    pct: num(row.f3),
    change: num(row.f4),
    volume: num(row.f5),
    amount: num(row.f6),
    amplitude: num(row.f7),
    turnover: num(row.f8),
    pe: num(row.f9),
    volumeRatio: num(row.f10),
    pb: num(row.f23),
    mainNet: num(row.f62),
    superNet: num(row.f66),
    superRatio: num(row.f69),
    bigNet: num(row.f72),
    bigRatio: num(row.f75),
    midNet: num(row.f78),
    midRatio: num(row.f81),
    smallNet: num(row.f84),
    smallRatio: num(row.f87),
    mainRatio: num(row.f184),
    industry: clean(row.f100),
    area: clean(row.f102),
    concepts: clean(row.f103),
    high: num(row.f15),
    low: num(row.f16),
    open: num(row.f17),
    preClose: num(row.f18),
    totalMv: num(row.f20),
    circMv: num(row.f21),
  };
}

function normalizeSinaStockRow(row) {
  return {
    code: formatSinaCode(row.symbol, row.code),
    name: clean(row.name),
    price: num(row.trade),
    pct: num(row.changepercent),
    change: num(row.pricechange),
    volume: num(row.volume),
    amount: num(row.amount),
    turnover: num(row.turnoverratio),
    pe: num(row.per),
    pb: num(row.pb),
    totalMv: num(row.mktcap) * 10000,
    circMv: num(row.nmc) * 10000,
    high: num(row.high),
    low: num(row.low),
    open: num(row.open),
    preClose: num(row.settlement),
    ticktime: clean(row.ticktime),
  };
}

function normalizeSinaBoardRow(value, index, type) {
  const [code, name, companyCount, avgPrice, change, pct, volume, amount, leaderCode, leaderPct, leaderPrice, leaderChange, leaderName] = String(value).split(",");
  return {
    code: clean(code),
    name: clean(name),
    type,
    price: num(avgPrice),
    pct: num(pct),
    rank: index + 1,
    change: num(change),
    volume: num(volume),
    amount: num(amount),
    netFund: 0,
    companyCount: num(companyCount),
    upCount: 0,
    downCount: 0,
    flatCount: 0,
    leader: {
      code: formatSinaCode(leaderCode, String(leaderCode || "").replace(/\D/g, "")),
      name: clean(leaderName),
      pct: num(leaderPct),
      price: num(leaderPrice),
      change: num(leaderChange),
    },
  };
}

function normalizeLimitPoolRow(row, type, rank) {
  const stats = row.zttj || {};
  return {
    rank,
    type,
    code: formatCode(row.c, row.m),
    name: clean(row.n),
    price: num(row.p) / 1000,
    limitPrice: num(row.ztp) ? num(row.ztp) / 1000 : 0,
    pct: num(row.zdp),
    amount: num(row.amount),
    circMv: num(row.ltsz),
    totalMv: num(row.tshare),
    turnover: num(row.hs),
    streak: num(row.lbc),
    firstSealTime: formatPoolTime(row.fbt),
    lastSealTime: formatPoolTime(row.lbt),
    sealFund: num(row.fund),
    brokenCount: num(row.zbc),
    amplitude: num(row.zf),
    speed: num(row.zs),
    volumeRatio: num(row.lb),
    industry: clean(row.hybk),
    limitStats: stats.days && stats.ct ? `${stats.days}/${stats.ct}` : "",
    rawReason: row.reason || row.r || row.tj || "",
  };
}

function normalizeEtfRow(row, rank) {
  return {
    rank,
    code: formatCode(row.f12, row.f13),
    name: clean(row.f14),
    price: num(row.f2),
    pct: num(row.f3),
    change: num(row.f4),
    volume: num(row.f5),
    amount: num(row.f6),
    amplitude: num(row.f7),
    turnover: num(row.f8),
    volumeRatio: num(row.f10),
    high: num(row.f15),
    low: num(row.f16),
    open: num(row.f17),
    preClose: num(row.f18),
    totalMv: num(row.f20),
    circMv: num(row.f21),
    mainNet: num(row.f62),
    superNet: num(row.f66),
    bigNet: num(row.f72),
    midNet: num(row.f78),
    smallNet: num(row.f84),
    mainRatio: num(row.f184),
    dataDate: clean(row.f297),
    discount: num(row.f402),
    iopv: num(row.f441),
  };
}

function normalizePopularityLatest(row, symbol) {
  if (!row) return null;
  return {
    code: emPrefixedToCode(row.srcSecurityCode) || formatCode(symbol, symbol.startsWith("6") ? 1 : 0),
    rank: num(row.rank),
    rankChange: num(row.rankChange),
    historyRankChange: num(row.hisRankChange),
    historyRank: num(row.hisRankChange_rank),
    total: num(row.marketAllCount),
    calcTime: clean(row.calcTime),
  };
}

function normalizeHotKeyword(row) {
  return {
    time: clean(row.calcTime),
    code: emPrefixedToCode(row.srcSecurityCode),
    concept: clean(row.conceptName),
    conceptId: clean(row.conceptId),
    heat: num(row.hitCount),
  };
}

function normalizeRelatedStock(row) {
  return {
    time: clean(row.calcTime),
    code: emPrefixedToCode(row.srcSecurityCode),
    relatedCode: emPrefixedToCode(row.followSrcSecurityCode),
    pct: num(String(row.rate || "").replace("%", "")),
  };
}

function normalizeAnnouncement(row) {
  const stock = row.codes?.[0] || {};
  const column = row.columns?.[0] || {};
  const code = clean(stock.stock_code);
  return {
    provider: "eastmoney",
    title: clean(row.title_ch || row.title),
    date: clean(row.notice_date).slice(0, 10),
    sortDate: clean(row.sort_date),
    code: code ? formatCode(code, stock.market_code) : "",
    name: clean(stock.short_name),
    category: clean(column.column_name),
    artCode: clean(row.art_code),
    url: code && row.art_code ? `https://data.eastmoney.com/notices/detail/${code}/${row.art_code}.html` : "",
  };
}

function normalizeCninfoAnnouncement(row) {
  const time = cninfoTime(row.announcementTime);
  const code = clean(row.secCode);
  const url =
    code && row.announcementId && row.orgId
      ? `http://www.cninfo.com.cn/new/disclosure/detail?stockCode=${code}&announcementId=${row.announcementId}&orgId=${row.orgId}&announcementTime=${encodeURIComponent(time)}`
      : "";
  return {
    provider: "cninfo",
    title: clean(row.announcementTitle).replace(/<[^>]+>/g, ""),
    date: time.slice(0, 10),
    sortDate: time,
    code: code ? formatCode(code, code.startsWith("6") ? 1 : 0) : "",
    name: clean(row.secName),
    category: clean(row.announcementTypeName || row.announcementType || "信息披露"),
    artCode: clean(row.announcementId),
    url,
    pdfUrl: row.adjunctUrl ? `http://static.cninfo.com.cn/${row.adjunctUrl}` : "",
  };
}

function normalizeCninfoRelation(row) {
  return {
    ...normalizeCninfoAnnouncement(row),
    provider: "cninfo-relation",
    category: clean(row.announcementTypeName || row.announcementType || "调研/关系披露"),
  };
}

function cninfoTime(value) {
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp)) return "";
  return new Date(timestamp).toLocaleString("sv-SE", { timeZone: "Asia/Shanghai", hour12: false });
}

function normalizeAnnouncementTitle(title) {
  return clean(title)
    .replace(/<[^>]+>/g, "")
    .replace(/^(.*?:)/, "")
    .replace(/\s+/g, "");
}

function normalizeMoneyFlowLine(line) {
  const [date, mainNet, smallNet, midNet, bigNet, superNet, mainRatio, smallRatio, midRatio, bigRatio, superRatio, close, pct] = String(line).split(",");
  return {
    date,
    close: num(close),
    pct: num(pct),
    mainNet: num(mainNet),
    smallNet: num(smallNet),
    midNet: num(midNet),
    bigNet: num(bigNet),
    superNet: num(superNet),
    mainRatio: num(mainRatio),
    smallRatio: num(smallRatio),
    midRatio: num(midRatio),
    bigRatio: num(bigRatio),
    superRatio: num(superRatio),
  };
}

function normalizeNorthboundRow(row) {
  return {
    tradeDate: clean(row.TRADE_DATE).slice(0, 10),
    type: clean(row.MUTUAL_TYPE_NAME),
    board: clean(row.BOARD_TYPE),
    direction: clean(row.FUNDS_DIRECTION),
    status: num(row.status),
    indexName: clean(row.INDEX_NAME),
    indexPct: num(row.INDEX_f3),
    upCount: num(row.f104),
    downCount: num(row.f105),
    flatCount: num(row.f106),
    netBuyAmt: num(row.netBuyAmt) * 10000,
    dayNetAmtIn: num(row.dayNetAmtIn) * 10000,
    dayAmtRemain: num(row.dayAmtRemain) * 10000,
    threshold: num(row.dayAmtThreshold) * 10000,
  };
}

function normalizeKamtRow(row, type, board, direction) {
  if (!row) return null;
  return {
    tradeDate: clean(row.date2) || clean(row.date),
    type,
    board,
    direction,
    status: num(row.status),
    netBuyAmt: num(row.netBuyAmt) * 10000,
    dayNetAmtIn: num(row.dayNetAmtIn) * 10000,
    dayAmtRemain: num(row.dayAmtRemain) * 10000,
    threshold: num(row.dayAmtThreshold) * 10000,
    buyAmt: num(row.buyAmt) * 10000,
    sellAmt: num(row.sellAmt) * 10000,
    turnoverAmt: num(row.buySellAmt) * 10000,
    monthNetAmtIn: num(row.monthNetAmtIn) * 10000,
    yearNetAmtIn: num(row.yearNetAmtIn) * 10000,
    allNetAmtIn: num(row.allNetAmtIn) * 10000,
  };
}

function mergeKamtRows(quotaRows = [], kamtRows = []) {
  const keyOf = (row) => `${row.type}|${row.direction}`;
  const kamtByKey = new Map(kamtRows.map((row) => [keyOf(row), row]));
  const merged = quotaRows.map((row) => {
    const kamt = kamtByKey.get(keyOf(row));
    if (!kamt) return row;
    return {
      ...kamt,
      ...row,
      tradeDate: row.tradeDate || kamt.tradeDate,
      status: row.status || kamt.status,
      netBuyAmt: row.netBuyAmt || kamt.netBuyAmt,
      dayNetAmtIn: row.dayNetAmtIn || kamt.dayNetAmtIn,
      dayAmtRemain: row.dayAmtRemain || kamt.dayAmtRemain,
      threshold: row.threshold || kamt.threshold,
    };
  });
  const existingKeys = new Set(merged.map(keyOf));
  kamtRows.forEach((row) => {
    if (!existingKeys.has(keyOf(row))) merged.push(row);
  });
  return merged;
}

function normalizeNorthboundHoldingRow(row, rank) {
  const type = clean(row.MUTUAL_TYPE);
  return {
    rank,
    tradeDate: clean(row.TRADE_DATE).slice(0, 10),
    code: formatCode(row.SECURITY_CODE, String(row.SECUCODE || "").endsWith(".SH") ? 1 : 0),
    name: clean(row.SECURITY_NAME),
    type: type === "001" ? "沪股通" : type === "003" ? "深股通" : type,
    close: num(row.CLOSE_PRICE),
    pct: num(row.CHANGE_RATE),
    holdShares: num(row.HOLD_SHARES),
    holdMarketCap: num(row.HOLD_MARKET_CAP),
    aShareRatio: num(row.A_SHARES_RATIO),
    holdSharesRatio: num(row.HOLD_SHARES_RATIO),
    freeSharesRatio: num(row.FREE_SHARES_RATIO),
    totalSharesRatio: num(row.TOTAL_SHARES_RATIO),
    marketCapChange1: num(row.HOLD_MARKETCAP_CHG1),
    marketCapChange5: num(row.HOLD_MARKETCAP_CHG5),
    marketCapChange10: num(row.HOLD_MARKETCAP_CHG10),
  };
}

function normalizeFundamentals(row, secid) {
  return {
    code: formatCode(row.f57, secid.startsWith("1.") ? 1 : 0),
    name: clean(row.f58),
    totalMv: num(row.f116),
    circMv: num(row.f117),
    peDynamic: num(row.f162) / 100,
    pb: num(row.f167) / 100,
    turnover: num(row.f168) / 100,
    amplitude: num(row.f171) / 100,
    roe: num(row.f173),
    raw: {
      f183: num(row.f183),
      f184: num(row.f184),
      f185: num(row.f185),
      f186: num(row.f186),
      f187: num(row.f187),
      f190: num(row.f190),
      f191: num(row.f191),
      f192: num(row.f192),
    },
  };
}

function buildMarketMetrics(stocks, sectors = [], limitPools = null, northbound = null, etfs = null) {
  const rows = stocks.length ? stocks : sampleStocks;
  const up = rows.filter((row) => row.pct > 0).length;
  const down = rows.filter((row) => row.pct < 0).length;
  const flat = rows.length - up - down;
  const amount = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const limitUp = rows.filter((row) => row.pct >= 9.8).length;
  const limitDown = rows.filter((row) => row.pct <= -9.8).length;
  const aboveMa5 = Math.round((up / Math.max(rows.length, 1)) * 1000) / 10;
  const netFundYi = Math.round((sectors.reduce((sum, row) => sum + (Number(row.netFund) || 0), 0) / 100000000) * 100) / 100;
  const poolStats = limitPools?.stats || {};
  const etfStats = etfs?.stats || {};
  return {
    temperature: Math.round(((up / Math.max(up + down, 1)) * 70 + Math.min(amount / 200000000000, 1) * 30) * 10) / 10,
    state: up >= down * 1.5 ? "强势行情" : up > down ? "震荡偏强" : up === down ? "震荡行情" : "弱势整理",
    amountYi: Math.round((amount / 100000000) * 100) / 100,
    netFundYi,
    aboveMa5,
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
    northNetBuyYi: northbound?.northNetBuyYi || 0,
    northNetInYi: northbound?.northNetInYi || 0,
    northTurnoverYi: northbound?.northTurnoverYi || 0,
    northMonthNetInYi: northbound?.northMonthNetInYi || 0,
    northYearNetInYi: northbound?.northYearNetInYi || 0,
    northAllNetInYi: northbound?.northAllNetInYi || 0,
    etfMainNetYi: etfStats.mainNetYi || 0,
    etfCount: etfStats.total || etfs?.rows?.length || 0,
    limitDistribution: { up, down, flat, limitUp, limitDown },
  };
}

function attachNorthboundMarketMetrics(market = {}, northbound = null) {
  if (!northbound) return market || {};
  return {
    ...(market || {}),
    northNetBuyYi: northbound.northNetBuyYi ?? market?.northNetBuyYi ?? 0,
    northNetInYi: northbound.northNetInYi ?? market?.northNetInYi ?? 0,
    northTurnoverYi: northbound.northTurnoverYi ?? market?.northTurnoverYi ?? 0,
    northMonthNetInYi: northbound.northMonthNetInYi ?? market?.northMonthNetInYi ?? 0,
    northYearNetInYi: northbound.northYearNetInYi ?? market?.northYearNetInYi ?? 0,
    northAllNetInYi: northbound.northAllNetInYi ?? market?.northAllNetInYi ?? 0,
  };
}

function mergeQuoteFundamentals(quote, fundamentals) {
  if (!quote || !fundamentals) return quote;
  return {
    ...quote,
    totalMv: quote.totalMv || fundamentals.totalMv,
    circMv: quote.circMv || fundamentals.circMv,
    pe: quote.pe || fundamentals.peDynamic,
    pb: quote.pb || fundamentals.pb,
    fundamentals,
  };
}

function enrichFundamentalsFromQuote(fundamentals, quote) {
  if (!fundamentals && !quote) return null;
  const base = fundamentals || { source: "quote-valuation-fallback", rows: [], financials: {} };
  return {
    ...base,
    code: base.code || quote?.code,
    name: base.name || quote?.name,
    totalMv: base.totalMv || quote?.totalMv || 0,
    circMv: base.circMv || quote?.circMv || 0,
    peDynamic: base.peDynamic || quote?.pe || 0,
    pb: base.pb || quote?.pb || 0,
  };
}

function defaultTradeDate() {
  const date = new Date();
  const china = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
  const day = china.getDay();
  const offset = day === 0 ? 2 : day === 6 ? 1 : 0;
  china.setDate(china.getDate() - offset);
  const year = china.getFullYear();
  const month = String(china.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(china.getDate()).padStart(2, "0");
  return `${year}${month}${dayOfMonth}`;
}

function compactChinaDate(offsetDays = 0) {
  const date = new Date();
  const china = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
  china.setDate(china.getDate() + offsetDays);
  const year = china.getFullYear();
  const month = String(china.getMonth() + 1).padStart(2, "0");
  const day = String(china.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatCompactDate(value) {
  const raw = String(value || "").replace(/\D/g, "").padEnd(8, "0").slice(0, 8);
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

function yahooSymbolFromAshare(symbol) {
  if (symbol.includes(".")) return symbol;
  if (symbol.startsWith("6")) return `${symbol}.SS`;
  if (symbol.startsWith("0") || symbol.startsWith("3")) return `${symbol}.SZ`;
  return symbol;
}

function emPrefixedFromSymbol(symbol) {
  return `${symbol.startsWith("6") ? "SH" : "SZ"}${symbol}`;
}

function emPrefixedToCode(value) {
  const raw = clean(value);
  if (!raw) return "";
  const code = raw.replace(/\D/g, "").padStart(6, "0");
  if (raw.startsWith("SH")) return `${code}.SH`;
  if (raw.startsWith("BJ")) return `${code}.BJ`;
  return `${code}.SZ`;
}

function emPrefixedToSecid(value) {
  const raw = clean(value);
  const code = raw.replace(/\D/g, "").padStart(6, "0");
  if (!code) return "";
  return `${raw.startsWith("SH") ? 1 : 0}.${code}`;
}

function roundYi(value) {
  return Math.round((Number(value || 0) / 100000000) * 100) / 100;
}

function formatPoolTime(value) {
  const raw = String(value || "").padStart(6, "0");
  if (raw === "000000") return "";
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4, 6)}`;
}

function secidFromSymbol(symbol) {
  return `${symbol.startsWith("6") ? 1 : 0}.${symbol}`;
}

function formatCode(symbol, market) {
  const code = String(symbol || "").padStart(6, "0");
  const suffix = Number(market) === 1 ? "SH" : code.startsWith("8") || code.startsWith("4") || code.startsWith("9") ? "BJ" : "SZ";
  return `${code}.${suffix}`;
}

function formatSinaCode(symbol, code) {
  const raw = String(symbol || "");
  const cleanCode = String(code || raw.replace(/\D/g, "")).padStart(6, "0");
  if (raw.startsWith("sh")) return `${cleanCode}.SH`;
  if (raw.startsWith("bj")) return `${cleanCode}.BJ`;
  return `${cleanCode}.SZ`;
}

module.exports.adapters = {
  fetchFundamentals,
  secidFromSymbol,
};

function clean(value) {
  return String(value ?? "").trim();
}

function num(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
