const STOCK_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f7,f8,f9,f10,f13,f15,f16,f17,f18";
const SECTOR_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f7,f8,f20,f21,f62,f104,f105,f106";
const INDEX_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f13";
const EASTMONEY_A_FS = "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23";
const EASTMONEY_A_SEGMENTS = ["m:1+t:2,m:1+t:23", "m:0+t:6,m:0+t:80"];
const SINA_A_STOCK_URL = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData";
const SINA_A_COUNT_URL = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeStockCount?node=hs_a";
const SINA_INDUSTRY_URL = "http://vip.stock.finance.sina.com.cn/q/view/newSinaHy.php";
const SINA_CONCEPT_URL = "http://money.finance.sina.com.cn/q/view/newFLJK.php?param=class";
const EASTMONEY_LIMIT_POOL_URL = "https://push2ex.eastmoney.com";
const EASTMONEY_HSGT_URL = "https://datacenter-web.eastmoney.com/api/data/v1/get";
const SINA_PAGE_SIZE = 80;
const SINA_MAX_PAGES = 90;

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

  const [
    eastmoneyStockResult,
    sinaStockResult,
    eastmoneySectorResult,
    sinaSectorResult,
    conceptResult,
    limitPools,
    moneyFlow,
    northbound,
    fundamentals,
    klines,
    marketKlines,
    quote,
    indexResult,
  ] = await Promise.all([
    fetchEastmoneyStockUniverse().catch(() => null),
    fetchSinaStockUniverse().catch(() => null),
    fetchEastmoneySectors().catch(() => null),
    fetchSinaSectors().catch(() => null),
    fetchSinaConcepts().catch(() => null),
    fetchEastmoneyLimitPools(tradeDate).catch(() => null),
    fetchEastmoneyMoneyFlow(secid).catch(() => null),
    fetchEastmoneyNorthbound().catch(() => null),
    fetchFundamentals(symbol, secid).catch(() => null),
    fetchEastmoneyKlines(secid).catch(() => []),
    fetchEastmoneyKlines("1.000001").catch(() => []),
    fetchEastmoneyQuote(secid).catch(() => null),
    fetchEastmoneyIndices().catch(() => null),
  ]);
  const stockUniverse = pickStockUniverse(eastmoneyStockResult, sinaStockResult);
  const sectorUniverse = pickSectorUniverse(eastmoneySectorResult, sinaSectorResult);
  const sectors = sectorUniverse.rows;
  const indices = indexResult?.length ? indexResult : [];
  const selectedQuote = quote || stockUniverse.leaders.find((stock) => stock.code.includes(symbol)) || stockUniverse.leaders[0] || sampleStocks[0];
  const enrichedFundamentals = enrichFundamentalsFromQuote(fundamentals, selectedQuote);
  const source = [
    stockUniverse.source,
    sectorUniverse.source,
    conceptResult?.length ? "sina-concept-boards" : "concept-fallback",
    limitPools?.source || "limit-pool-fallback",
    moneyFlow?.rows?.length ? "eastmoney-moneyflow" : "moneyflow-fallback",
    northbound?.rows?.length ? "eastmoney-northbound" : "northbound-fallback",
    enrichedFundamentals?.source || "fundamentals-fallback",
    indices.length ? "eastmoney-index-quotes" : "index-fallback",
    quote ? "eastmoney-quote" : "quote-fallback",
  ].join("+");

  const market = buildMarketMetrics(stockUniverse.all, sectors, limitPools, northbound);
  return res.status(200).json({
    ok: true,
    source,
    asOf: new Date().toISOString(),
    tradeDate,
    market,
    stocks: stockUniverse.leaders,
    sectors,
    concepts: conceptResult?.length ? conceptResult : [],
    limitPools: limitPools || { date: tradeDate, limitUp: [], broken: [], strong: [], stats: {} },
    moneyFlow: moneyFlow || { rows: [], latest: null, sum5MainYi: 0 },
    northbound: northbound || { rows: [], northNetBuyYi: 0, northNetInYi: 0 },
    fundamentals: enrichedFundamentals,
    indices,
    quote: mergeQuoteFundamentals(selectedQuote, enrichedFundamentals),
    klines,
    marketKlines,
  });
};

function setCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=45, stale-while-revalidate=240");
}

function pickStockUniverse(eastmoneyStockResult, sinaStockResult) {
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

function pickSectorUniverse(eastmoneySectorResult, sinaSectorResult) {
  if (eastmoneySectorResult?.length) return { rows: eastmoneySectorResult, source: "eastmoney-sector-flow" };
  if (sinaSectorResult?.length) return { rows: sinaSectorResult, source: "sina-industry-sectors" };
  return { rows: sampleSectors, source: "sample-sector-fallback" };
}

async function fetchJson(url, options = {}) {
  const text = await fetchText(url, options);
  return JSON.parse(text);
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
      const response = await fetch(url, { headers, signal: controller.signal });
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
  const leaders = all
    .slice()
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 300);
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
  const payload = await fetchJson(`https://82.push2.eastmoney.com/api/qt/clist/get?${params}`, {
    attempts: 1,
    timeoutMs: 1500,
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
  const leaders = all
    .slice()
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 500);
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
  const url =
    "https://push2.eastmoney.com/api/qt/clist/get" +
    `?pn=1&pz=80&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:90+t:2&fields=${SECTOR_FIELDS}`;
  const payload = await fetchJson(url, { attempts: 1, timeoutMs: 1500, headers: { Referer: "https://quote.eastmoney.com/" } });
  const rows = payload?.data?.diff || [];
  return rows.map((row, index) => ({
    code: clean(row.f12),
    name: clean(row.f14),
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
    upCount: num(row.f104),
    downCount: num(row.f105),
    flatCount: num(row.f106),
  }));
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
  const payload = await fetchJson(`${EASTMONEY_HSGT_URL}?${params}`, {
    attempts: 2,
    timeoutMs: 4500,
    headers: { Referer: "https://data.eastmoney.com/hsgt/index.html" },
  });
  const rows = (payload?.result?.data || []).map(normalizeNorthboundRow);
  const northRows = rows.filter((row) => row.direction === "北向");
  return {
    rows,
    northRows,
    northNetBuyYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.netBuyAmt) || 0), 0)),
    northNetInYi: roundYi(northRows.reduce((sum, row) => sum + (Number(row.dayNetAmtIn) || 0), 0)),
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
    high: num(row.f15),
    low: num(row.f16),
    open: num(row.f17),
    preClose: num(row.f18),
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

function buildMarketMetrics(stocks, sectors = [], limitPools = null, northbound = null) {
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
    limitDistribution: { up, down, flat, limitUp, limitDown },
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

function clean(value) {
  return String(value ?? "").trim();
}

function num(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
