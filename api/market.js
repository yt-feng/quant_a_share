const STOCK_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f7,f8,f9,f10,f13,f15,f16,f17,f18";
const SECTOR_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f7,f8,f20,f21,f62,f104,f105,f106";
const INDEX_FIELDS = "f12,f14,f2,f3,f4,f5,f6,f13";
const EASTMONEY_A_FS = "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23";
const EASTMONEY_A_SEGMENTS = ["m:1+t:2,m:1+t:23", "m:0+t:6,m:0+t:80"];
const SINA_A_STOCK_URL = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData";
const SINA_A_COUNT_URL = "http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeStockCount?node=hs_a";
const SINA_INDUSTRY_URL = "http://vip.stock.finance.sina.com.cn/q/view/newSinaHy.php";
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

  const [eastmoneyStockResult, sinaStockResult, eastmoneySectorResult, sinaSectorResult, klines, marketKlines, quote, indexResult] = await Promise.all([
    fetchEastmoneyStockUniverse().catch(() => null),
    fetchSinaStockUniverse().catch(() => null),
    fetchEastmoneySectors().catch(() => null),
    fetchSinaSectors().catch(() => null),
    fetchEastmoneyKlines(secid).catch(() => []),
    fetchEastmoneyKlines("1.000001").catch(() => []),
    fetchEastmoneyQuote(secid).catch(() => null),
    fetchEastmoneyIndices().catch(() => null),
  ]);
  const stockUniverse = pickStockUniverse(eastmoneyStockResult, sinaStockResult);
  const sectorUniverse = pickSectorUniverse(eastmoneySectorResult, sinaSectorResult);
  const sectors = sectorUniverse.rows;
  const indices = indexResult?.length ? indexResult : [];
  const source = [
    stockUniverse.source,
    sectorUniverse.source,
    indices.length ? "eastmoney-index-quotes" : "index-fallback",
    quote ? "eastmoney-quote" : "quote-fallback",
  ].join("+");

  const market = buildMarketMetrics(stockUniverse.all, sectors);
  return res.status(200).json({
    ok: true,
    source,
    asOf: new Date().toISOString(),
    market,
    stocks: stockUniverse.leaders,
    sectors,
    indices,
    quote: quote || stockUniverse.leaders.find((stock) => stock.code.includes(symbol)) || stockUniverse.leaders[0] || sampleStocks[0],
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
    .map(normalizeSinaSectorRow)
    .filter((row) => row.code && row.name)
    .sort((a, b) => (b.pct || 0) - (a.pct || 0))
    .map((row, index) => ({ ...row, rank: index + 1 }))
    .slice(0, 80);
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

function normalizeSinaSectorRow(value, index) {
  const [code, name, companyCount, avgPrice, change, pct, volume, amount, leaderCode, leaderPct, leaderPrice, leaderChange, leaderName] = String(value).split(",");
  return {
    code: clean(code),
    name: clean(name),
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

function buildMarketMetrics(stocks, sectors = []) {
  const rows = stocks.length ? stocks : sampleStocks;
  const up = rows.filter((row) => row.pct > 0).length;
  const down = rows.filter((row) => row.pct < 0).length;
  const flat = rows.length - up - down;
  const amount = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const limitUp = rows.filter((row) => row.pct >= 9.8).length;
  const limitDown = rows.filter((row) => row.pct <= -9.8).length;
  const aboveMa5 = Math.round((up / Math.max(rows.length, 1)) * 1000) / 10;
  const netFundYi = Math.round((sectors.reduce((sum, row) => sum + (Number(row.netFund) || 0), 0) / 100000000) * 100) / 100;
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
    limitDistribution: { up, down, flat, limitUp, limitDown },
  };
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
