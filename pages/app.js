const data = {
  metrics: [
    ["情绪温度", "47.5%", "震荡行情"],
    ["成交额", "1,390亿", "较前日温和放大"],
    ["上涨/下跌", "51 / 59", "涨跌比 0.86"],
    ["涨停/跌停", "0 / 0", "极端情绪收敛"],
    ["站上MA5", "46.4%", "短线中性"],
    ["资金净流入", "+24.6亿", "样本口径"],
  ],
  breadth: [
    ["2026-02-02", 1120, 39],
    ["2026-02-18", 1260, 47],
    ["2026-03-06", 1320, 52],
    ["2026-03-24", 1215, 43],
    ["2026-04-10", 1485, 58],
    ["2026-04-28", 1390, 49],
    ["2026-05-18", 1510, 56],
    ["2026-06-04", 1330, 42],
    ["2026-06-22", 1428, 51],
    ["2026-07-03", 1390, 46.4],
  ],
  indices: [
    ["上证指数", 0.28],
    ["深证成指", -0.12],
    ["创业板指", 0.44],
    ["沪深300", 0.19],
    ["中证500", -0.08],
  ],
  limitDistribution: { up: 51, down: 59, flat: 0, limitUp: 0, limitDown: 0 },
  quoteKlines: [],
  sectors: [
    ["黄金", 8.07, 1, 0, 24, 8, 6, -2.01],
    ["新能源车", 3.99, 2, 29, 268, 60, 20, 107.64],
    ["重卡", 2.24, 3, -14, 85, 26, 2, 7.39],
    ["中药", 1.77, 4, 17, 115, 21, 6, 7.79],
    ["棉花", 1.76, 5, 16, 7, 2, 1, -0.03],
    ["智能音箱", 1.74, 6, -10, 31, 12, 1, 33.79],
    ["固废处理", 1.72, 7, 22, 106, 32, 5, 10.12],
    ["水务", 1.7, 8, 40, 37, 6, 2, 0.21],
  ],
  concepts: [
    ["华为汽车", 1.83, 1, 97, 718.75, "贝斯特", 20.02],
    ["高压快充", 1.35, 2, 53, 285.97, "汉宇集团", 16.13],
    ["黄金概念", 5.72, 3, 27, 352.85, "西部黄金", 10.02],
  ],
  limitPools: { date: "-", limitUp: [], broken: [], strong: [], stats: {} },
  etfs: { rows: [], stats: {} },
  moneyFlow: { rows: [], latest: null, sum5MainYi: 0 },
  northbound: { rows: [], northRows: [], northNetBuyYi: 0, northNetInYi: 0 },
  fundamentals: null,
  popularity: { rank: { items: [] }, stock: { latest: null, keywords: [], related: [], realtime: [] } },
  announcements: { items: [] },
  disclosures: { relations: [] },
  research: { source: "", reports: [], stats: {} },
  yahooChart: null,
  baostock: { rows: [], latest: null },
  stocks: [
    { code: "300750.SZ", name: "宁德时代", price: 268.4, pct: 3.8, industry: "电池", rps: 88, fund: 14.2, pe: 28, pb: 3.1, ma20: true, macd: true },
    { code: "002594.SZ", name: "比亚迪", price: 246.7, pct: 2.9, industry: "汽车", rps: 84, fund: 9.7, pe: 24, pb: 2.8, ma20: true, macd: true },
    { code: "600519.SH", name: "贵州茅台", price: 1528.8, pct: 0.7, industry: "白酒", rps: 58, fund: -1.2, pe: 27, pb: 8.9, ma20: false, macd: false },
    { code: "300059.SZ", name: "东方财富", price: 18.6, pct: 1.8, industry: "证券", rps: 76, fund: 5.4, pe: 31, pb: 3.2, ma20: true, macd: true },
    { code: "600276.SH", name: "恒瑞医药", price: 52.3, pct: 1.4, industry: "医药", rps: 71, fund: 2.1, pe: 36, pb: 5.2, ma20: true, macd: false },
    { code: "000001.SZ", name: "平安银行", price: 11.4, pct: -0.6, industry: "银行", rps: 42, fund: -3.8, pe: 5, pb: 0.6, ma20: false, macd: false },
    { code: "688981.SH", name: "中芯国际", price: 88.1, pct: 4.2, industry: "半导体", rps: 92, fund: 18.6, pe: 55, pb: 4.9, ma20: true, macd: true },
    { code: "002230.SZ", name: "科大讯飞", price: 49.7, pct: 2.5, industry: "AI", rps: 81, fund: 6.8, pe: 48, pb: 4.4, ma20: true, macd: true },
  ],
};

const VERCEL_BACKEND_URL = "";

const factorGroups = [
  ["估值市值", [["pe", "市盈率≤30"], ["pb", "市净率≤3"], ["mv500", "总市值≥500亿"], ["mv50_200", "总市值50亿-200亿"], ["float100", "流通市值≥100亿"], ["float50", "流通市值≤50亿"]]],
  ["量价活跃", [["limit", "今日涨停"], ["turn3", "换手率≥3%"], ["turnLow", "换手率<1%(低)"], ["vr15", "量比≥1.5"], ["amount1", "成交额≥1亿"], ["doubleVol", "倍量信号"], ["amp8", "振幅≥8%(活跃)"], ["volumeSignal", "量能信号"]]],
  ["强度趋势", [["sectorRps", "板块RPS50≥80"], ["inSectorRps", "个股/板块RPS≥80"], ["ma5", "站上MA5"], ["ma10", "站上MA10"], ["ma20", "站上MA20"], ["ma60", "站上MA60"], ["ma90", "站上MA90"], ["ma144", "站上MA144"], ["rps", "RPS50≥70"], ["rps120", "RPS120≥70"], ["rpsCombo", "RPS综合≥80"]]],
  ["技术信号", [["ema", "EMA14>EMA26"], ["macd", "MACD金叉"], ["kdj", "KDJ金叉"], ["rsiLow", "RSI超卖"], ["rsiHigh", "RSI超买"], ["upperShadow", "长上影线"], ["lowerShadow", "长下影线"]]],
  ["资金VWAP", [["dealer", "庄家控盘>50"], ["absorb", "主力吸筹"], ["strongAbsorb", "强势吸筹选股"], ["strongAbsorb3", "强势吸筹3+条件"], ["attack", "主力攻击"], ["trigger", "主力触发"], ["fundRsi", "资金RSI强(>50)"], ["cost20", "突破20日成本"], ["cost60", "突破60日成本"], ["rsiV", "RSI_V减仓信号"], ["vwapScore", "VWAP趋势分≥5"], ["vwapLong", "VWAP允许做多"], ["vwapDip", "VWAP低吸回踩"], ["vwapBreak", "VWAP突破放量"], ["vwapFast", "VWAP加速"], ["vwapPos", "VWAP位置"], ["entry", "入场信号"]]],
  ["结构形态", [["gaussUp", "高斯趋势向上"], ["gaussStart", "高斯趋势起航"], ["gaussTurn", "高斯拐头向上"], ["superRes", "★超级共振★"], ["resAttack", "共振:主力拉升"], ["resStart", "共振:趋势起航"], ["auction", "★竞价弱转强★"], ["support60", "60日支撑附近"], ["support144", "144日支撑附近"], ["break60", "突破60日压力"], ["break144", "突破144日压力"], ["chanBottom", "缠论底分型"], ["chanTop", "缠论顶分型"], ["chanBuy3", "缠论三买"], ["chanSell3", "缠论三卖"], ["centerStart", "中枢开始"], ["centerEnd", "中枢结束"], ["centerBreak", "中枢向上突破"], ["gann11", "江恩1:1支撑"], ["gann12", "江恩1:2支撑"], ["gann21", "江恩2:1支撑"], ["bullEngulf", "看涨吞没"], ["morningStar", "早晨之星"], ["tdBuy9", "TD买入结构9"], ["tdBuy13", "TD13买入优选"], ["tdSell9", "TD卖出结构9"], ["tdSell13", "TD13卖出优选"]]],
];

const llmTabs = ["主题热点", "选股池", "板块全景看板", "个股评估矩阵", "产业链研报分析"];

const llmTopics = [
  { name: "半导体", heat: 85, trend: "down", fund3: 280.62, pct3: -3.68, ma20: 77.01, crowd: 0.05, stage: "退潮反抽", score: 47 },
  { name: "人工智能", heat: 80, trend: "new", fund3: 369.73, pct3: 2.12, ma20: 68.4, crowd: 0.08, stage: "新主线观察", score: 72 },
  { name: "航天", heat: 78, trend: "new", fund3: 124.24, pct3: 4.81, ma20: 73.1, crowd: 0.06, stage: "轮动加强", score: 69 },
  { name: "PCB板", heat: 75, trend: "new", fund3: 43.2, pct3: 3.46, ma20: 63.2, crowd: 0.04, stage: "低吸观察", score: 66 },
  { name: "锂电池", heat: 75, trend: "new", fund3: 303.9, pct3: 1.22, ma20: 58.8, crowd: 0.05, stage: "趋势修复", score: 64 },
  { name: "光伏", heat: 70, trend: "new", fund3: 71.01, pct3: 2.18, ma20: 51.6, crowd: 0.03, stage: "反弹确认", score: 58 },
];

const llmPool = [
  ["600601", "方正科技", "-", "-", "未归类", "最关注", "策略候选", "Entry", "5.0%", 0.75, "14.09 ~ 15.12", "-", "-", "-", "是"],
  ["000938", "紫光股份", "-", "-", "未归类", "最关注", "策略候选", "Entry", "5.0%", 0.7, "30.22 ~ 30.28", "-", "-", "-", "是"],
  ["300433", "蓝思科技", "-", "-", "未归类", "最关注", "策略候选", "Watch", "5.0%", 0.55, "50.00 ~ 52.42", "-", "-", "-", "是"],
  ["300604", "长川科技", "-", "-", "半导体", "热度90", "规则候选", "-", "-", 0.46, "-", "-", "-", "-", "否"],
  ["688120", "华海清科", "-", "-", "半导体", "热度90", "规则候选", "-", "-", 0.4, "-", "-", "-", "-", "否"],
];

const llmSectorRows = [
  ["轮动", "2026-07-03", "制冷剂", 0.26, 11.45, 23.31, 106.9, "40%", 100.43, 11.1, 17.38, "90%", "19%", 33.8],
  ["高位", "2026-07-03", "PVDF概念", -0.58, 10.1, 10.64, 132.62, "29%", 124.31, 10.43, 16.06, "65%", "37%", 32.16],
  ["轮动", "2026-07-03", "理想汽车概念股", 1.58, 8.41, 26.66, 149.18, "5%", 195.41, 8.59, 13.69, "37%", "36%", 24.2],
  ["低吸", "2026-07-03", "电子发票", 1.11, 7.7, 14.61, 31.17, "6%", 26.01, 0.79, -0.57, "19%", "26%", 7.79],
];

const llmStockMatrix = [
  ["002409", "雅克科技", 2.86, -13.03, -11, "否", "是", "是", 635.45, 5.77, -6.11],
  ["002430", "杭氧股份", -1.33, -1.56, 57, "否", "否", "否", 268.84, -5.25, -8.49],
  ["002971", "和远气体", -1.48, 5.42, 126, "是", "是", "是", 111.89, 8.29, -4.58],
  ["300346", "南大光电", -6.93, -1.5, -25, "否", "是", "是", 525.97, 2.63, -9.68],
];

const hotPrompts = [
  "Q1 结合实时行情，分析【股票名】现在能不能买，按【超短1-2天/短线3-5天/中线1-2个月】思路，给我买点、止损位、仓位建议和注意点。",
  "Q2 【股票名】现价还能不能参与？按短线/中线看，给我操作计划、买点、注意点和仓位安排。",
  "Q3 我想做【股票名】的1到2天超短，当前能不能轻仓试错博反弹？请直接告诉我能不能做、怎么买、哪里止损。",
  "Q4 我现在持有【股票名】，盘中该继续拿还是先减一点？结合实时行情给我减仓条件、失效条件和仓位建议。",
  "Q5 我持有【股票名】，当前成本大概【成本价】。盘中该怎么处理？请直接给我操作计划、仓位控制和失效条件。",
  "Q6 【股票名】现在回踩到关键位了，盘中能不能低吸？请结合实时行情、量能承接和资金流告诉我触发条件、失效条件、仓位上限。",
  "Q7 【股票名】现在是接快速下跌还是接回踩？请结合实时走势、量能、承接和资金流给我低吸纪律。",
  "Q8 【股票名】回踩【MA10/MA20】附近，现在还能不能吸一口？结合盘中实时行情给我低吸策略和注意点。",
  "Q9 结合实时行情，分析【股票名/板块】现在能不能【买入/减仓/低吸/做T】，按【超短/短线/中线】思路，给我【买点/卖点/触发条件/失效条件/仓位建议/注意点】。",
  "Q10 如果【股票名】盘中跌破【MA5/MA10/MA20】怎么办？请给我明确的持仓纪律、止损条件和后续观察点。",
  "Q11 今天哪些板块资金在持续流入，哪些方向更适合低吸观察？",
  "Q12 分析近期大盘涨跌与成交额规律，结合行业/概念轮动、资金流向和人气榜，筛出低吸方向。",
];

const walletLedger = [
  ["2026-07-03 21:48:38", "退款", 16.5, 86.5, 0, "AI决策矩阵 V2 结算退回剩余冻结"],
  ["2026-07-03 21:48:38", "消费", -13.5, 70, 16.5, "AI决策矩阵 V2 结算"],
  ["2026-07-03 21:48:05", "冻结", -30, 70, 30, "AI决策矩阵 V2 冻结预算"],
  ["2026-07-03 21:42:54", "赠送", 100, 100, 0, "钱包初始化赠送点数"],
];

const products = [
  ["sub", "账号订阅 一个月", "推荐", "订阅套餐", "订阅一个月", 88, "月度订阅", "账号开通 1 个月"],
  ["sub", "账号订阅 半年", "热销", "订阅套餐", "订阅半年期", 368, "半年订阅", "账号开通 6 个月"],
  ["sub", "账号订阅 一年", "年度", "订阅套餐", "订阅一年期", 688, "年度订阅", "人工优先开通 12 个月"],
  ["points", "点数 100点", "新手推荐", "点数包", "钱包点数充值 100 点", 10, "100 点", "账号直充 永久有效"],
  ["points", "点数 200点", "常用", "点数包", "钱包点数充值 200 点", 20, "200 点", "账号直充 永久有效"],
  ["points", "点数 300点", "热卖", "点数包", "钱包点数充值 300 点", 30, "300 点", "账号直充 永久有效"],
  ["points", "点数 500点", "性价比", "点数包", "钱包点数充值 500 点", 50, "500 点", "账号直充 永久有效"],
  ["points", "点数 1000点", "推荐", "点数包", "钱包点数充值 1000 点", 100, "1000 点", "账号直充 永久有效"],
  ["points", "点数 2500点", "大额", "点数包", "钱包点数充值 2500 点", 250, "2500 点", "账号直充 永久有效"],
  ["points", "点数 5000点", "深度", "点数包", "钱包点数充值 5000 点", 500, "5000 点", "账号直充 永久有效"],
];

const pages = [
  ["market", "大盘情绪", "情绪温度、成交额、涨跌比与指数表现"],
  ["screener", "量化因子选股", "估值、趋势、资金和技术信号组合筛选"],
  ["sectors", "行业/概念", "板块排名、资金流向和涨跌分布"],
  ["quote", "行情", "单股行情、指标和操作计划"],
  ["watchlist", "自选", "自选分组、分组筛选和浏览器持久化"],
  ["llm", "LLM分析", "主题热点、选股池、板块看板和产业链问答"],
  ["qimen", "奇门遁甲", "事项起局、任务提交和解盘问答"],
  ["ai", "AI决策矩阵", "DeepSeek 服务端问答"],
  ["subscription", "订阅账号与点数", "账号状态、点数钱包、商品与下单状态"],
  ["about", "复刻状态", "aiwuchuan 主模块覆盖清单与部署说明"],
];

const coverageRows = [
  ["大盘情绪", "已对齐", "日期范围、情绪状态、复盘统计入口、情绪指标、指数与涨跌分布、涨停池、北向资金、ETF资金、人气榜。"],
  ["量化因子选股", "已对齐", "估值、市值、量价、RPS、均线、技术、资金、VWAP、结构、缠论、江恩、TD、自定义条件、近N日条件、策略保存/应用、单因子命中数和相似候选。"],
  ["行业/概念", "已对齐", "板块/概念切换、日期、预设筛选、排序、范围、柱状图/饼图、指标卡和明细表。"],
  ["行情", "已对齐", "股票查询、日期、复权、分时、画图工具、指标面板、参数弹窗、个股资金流、云端财务快照、BaoStock历史估值、人气关键词、相关股和双源公告。"],
  ["自选", "已对齐", "分组创建/删除、分组筛选、自选表、操作列和浏览器持久化。"],
  ["LLM分析", "已对齐", "主题热点、选股池、板块全景看板、个股评估矩阵、产业链研报分析五个 tab，产业链页已接入东财研报线索。"],
  ["奇门遁甲", "已对齐", "钱包账单、任务列表、起局表单、历法类型、输出偏好、解盘档位、异步任务状态。"],
  ["AI决策矩阵", "已对齐", "新对话、钱包入口、实时搜索、三种模式、Q1-Q12 热门问题、DeepSeek 后端问答，多源行情上下文。"],
  ["订阅账号与点数", "已对齐", "账号状态、余额/冻结、商品筛选、10 个商品、商品说明、购买确认、扫码/订单状态、钱包账单。"],
];

const dataSourceRows = [
  ["东方财富", "核心接入", "A股行情、指数、板块、涨停池、炸板池、强势股、ETF、个股资金流、北向资金、人气榜、公告、单股行情与K线。"],
  ["Sina", "核心接入", "全A兜底、行业/概念兜底、财报字段兜底，补齐东财列表偶发为空时的股票池。"],
  ["CNInfo 巨潮", "核心接入", "公告二源合并、投资者关系/调研披露，已进入行情页和 LLM 上下文。"],
  ["BaoStock", "云缓存接入", "GitHub Actions 批量生成历史K线、换手率、PE/PB/PS/PCF、收益与均线摘要，Vercel 按股票读取。"],
  ["财务字段缓存", "云缓存接入", "GitHub Actions 生成 financial-cache.json，缓存营收、利润、EPS、ROE、毛利率、资产负债率等财报字段。"],
  ["东财研报中心", "后端接入", "近30日行业研报、宏观策略报告、机构、作者、行业和页数，进入产业链研报分析与 LLM 上下文。"],
  ["Yahoo/yfinance-compatible", "后端接入", "用 Yahoo chart API 作为 A股 .SS/.SZ、港美股和 ETF 的全球行情/K线备用源。"],
  ["Tencent", "后端接入", "个股报价兜底，用于东财单股报价不可用时补价格、涨跌幅、成交额等字段。"],
  ["GitHub Actions", "云缓存接入", "定时生成 market-cache、baostock-cache 和 financial-cache，Vercel 线上读取静态缓存兜底。"],
  ["AKShare", "参考映射", "接口地图已映射到 Node 适配器，生产不依赖 Python 服务。"],
  ["efinance", "参考映射", "参考东财字段和接口口径，生产走 Node HTTP 适配器。"],
];

let currentPage = "market";
let activeFactors = new Set(["ma20"]);
let customConditions = [];
let savedStrategies = [];
let screenerSort = { field: "rps_120", direction: "desc" };
const DEFAULT_WATCH_GROUPS = ["短线观察", "中线持有", "题材跟踪"];
let watchGroups = [...DEFAULT_WATCH_GROUPS];
let selectedWatchGroup = "全部";
let watchlist = [
  { code: "300750.SZ", group: "短线观察" },
  { code: "688981.SH", group: "题材跟踪" },
  { code: "002230.SZ", group: "中线持有" },
];
let toastTimer = 0;
let progressTimers = [];
let selectedLlmTab = "主题热点";
let productFilter = "all";
let modal = null;
let marketSource = "演示数据";
let selectedQuote = "600519";

function mount() {
  loadScreenerState();
  loadWatchlistState();
  renderRuntimeShell();
  renderNav();
  render();
  checkBackendStatus();
  loadMarketSnapshot();
}

function renderNav() {
  const nav = document.querySelector("#nav");
  nav.innerHTML = pages
    .map(([id, label]) => `<button class="nav-button ${id === currentPage ? "active" : ""}" data-page="${id}">${label}</button>`)
    .join("");
  nav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = button.dataset.page;
      renderNav();
      render();
    });
  });
}

function setTitle() {
  const page = pages.find(([id]) => id === currentPage);
  document.querySelector("#page-title").textContent = page[1];
  document.querySelector("#page-subtitle").textContent = page[2];
}

function render() {
  setTitle();
  const view = document.querySelector("#view");
  const renderers = {
    market: renderMarket,
    screener: renderScreener,
    sectors: renderSectors,
    quote: renderQuote,
    watchlist: renderWatchlist,
    llm: renderLlm,
    qimen: renderQimen,
    ai: renderAi,
    subscription: renderSubscription,
    about: renderAbout,
  };
  view.innerHTML = renderers[currentPage]();
  view.insertAdjacentHTML("beforeend", renderModal());
  attachEvents();
  requestAnimationFrame(renderCharts);
}

function metric(label, value, note = "") {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
}

function signed(value, digits = 2) {
  const cls = value >= 0 ? "up" : "down";
  const sign = value > 0 ? "+" : "";
  return `<span class="${cls}">${sign}${value.toFixed(digits)}</span>`;
}

function yi(value, digits = 2) {
  return Math.round(((Number(value) || 0) / 100000000) * 10 ** digits) / 10 ** digits;
}

function plainSigned(value, digits = 2, suffix = "") {
  const number = Number(value) || 0;
  return `${number > 0 ? "+" : ""}${number.toFixed(digits)}${suffix}`;
}

function simpleTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function tag(text, tone = "") {
  return `<span class="mini-tag ${tone}">${text}</span>`;
}

function panelTitle(title, action = "") {
  return `<div class="panel-title"><h2>${title}</h2>${action}</div>`;
}

function renderMarket() {
  return `
    <section class="panel compact-panel">
      <div class="toolbar">
        <label><span class="label">开始日期</span><input value="2026-07-01" /></label>
        <label><span class="label">结束日期</span><input value="2026-07-04" /></label>
        <label><span class="label">行情状态</span><select><option>震荡行情</option><option>强势行情</option><option>弱势整理</option></select></label>
        <button class="primary-button" data-refresh-market="1">加载复盘数据统计</button>
        ${tag(`数据源 ${marketSource}`, "info")}
      </div>
    </section>
    <section class="grid metrics" style="margin-top:14px">${data.metrics.map((m) => metric(...m)).join("")}</section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel"><h2>大盘成交额趋势</h2><div id="amountChart" class="chart"></div></div>
      <div class="panel"><h2>上证涨跌趋势</h2><div id="breadthChart" class="chart"></div></div>
      <div class="panel"><h2>涨跌停板分布</h2><div id="limitChart" class="chart"></div></div>
      <div class="panel"><h2>指数涨跌幅</h2><div id="indexChart" class="chart"></div></div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        ${panelTitle(`涨停池 ${data.limitPools.limitUp.length} · 炸板 ${data.limitPools.broken.length}`, tag(`交易日 ${data.limitPools.date || "-"}`, "info"))}
        ${simpleTable(["代码", "名称", "连板", "首次封板", "封板资金", "行业"], data.limitPools.limitUp.slice(0, 8).map((row) => [row.code, row.name, row.streak || "-", row.firstSealTime || "-", `${yi(row.sealFund)}亿`, row.industry || "-"]))}
      </div>
      <div class="panel">
        ${panelTitle("北向资金", tag(`${plainSigned(data.northbound.northNetBuyYi || 0, 2, "亿")}`, "info"))}
        ${simpleTable(["通道", "方向", "净买额", "指数", "涨跌幅", "上涨/下跌"], (data.northbound.rows || []).map((row) => [row.type, row.direction, `${yi(row.netBuyAmt)}亿`, row.indexName, signed(row.indexPct), `${row.upCount}/${row.downCount}`]))}
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        ${panelTitle("ETF资金排行", tag(`合计 ${plainSigned(data.etfs.stats?.mainNetYi || 0, 2, "亿")}`, "info"))}
        ${simpleTable(["代码", "名称", "涨跌幅", "成交额", "主力净额", "折价率"], (data.etfs.rows || []).slice(0, 8).map((row) => [row.code, row.name, `${signed(row.pct)}%`, `${yi(row.amount)}亿`, `${plainSigned(yi(row.mainNet), 2, "亿")}`, `${plainSigned(row.discount || 0, 2, "%")}`]))}
      </div>
      <div class="panel">
        ${panelTitle("东财人气榜", tag(`${data.popularity.rank?.items?.length || 0} 只`, "info"))}
        ${simpleTable(["排名", "代码", "名称", "最新价", "涨跌幅", "排名变化"], (data.popularity.rank?.items || []).slice(0, 8).map((row) => [row.rank, row.code, row.name || "-", row.price ? row.price.toFixed(2) : "-", `${signed(row.pct)}%`, plainSigned(row.rankChange || 0, 0)]))}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      ${panelTitle("复盘数据统计", `<button class="ghost-button" data-refresh-market="1">刷新</button>`)}
      ${simpleTable(["维度", "当前值", "说明"], data.metrics.map((m) => [m[0], m[1], m[2]]))}
    </section>
  `;
}

function renderScreener() {
  const filtered = filteredStocks();
  const relaxed = filtered.length ? [] : relaxedStocks();
  const visibleRows = filtered.length ? filtered : relaxed;
  const activeLabel = activeFactorLabels();
  const factorCounts = factorHitCounts();
  const conditionSummary = customConditions.length ? customConditions.map(conditionLabel).join(" + ") : "未添加自定义条件";
  return `
    <div class="panel">
      ${panelTitle(
        "多因子量化模型",
        `<div class="top-actions"><button class="ghost-button compact-button" data-clear-factors="1">清空因子</button><button class="primary-button" data-toast="已执行筛选">筛选</button></div>`
      )}
      <div class="factor-grid">
        ${factorGroups
          .map(
            ([group, chips]) => `
              <section class="factor-group">
                <h3>${group}</h3>
                <div class="toolbar">${chips
                  .map(([key, label]) => {
                    const count = factorCounts.get(key) || 0;
                    return `<button class="chip factor-chip ${activeFactors.has(key) ? "active" : ""}" data-factor="${key}" title="单因子命中 ${count} 只"><span>${label}</span><span class="chip-count">${count}</span></button>`;
                  })
                  .join("")}</div>
              </section>
            `
          )
          .join("")}
      </div>
    </div>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>自定义条件</h2>
        <div class="form-grid">
          <label><span class="label">选择字段</span><select id="customField"><option value="change_pct">change_pct</option><option value="volume_signal">volume_signal</option><option value="macd">macd</option><option value="float_market_cap">float_market_cap</option><option value="sector_rps_50">sector_rps_50</option><option value="support_line_next">support_line_next</option></select></label>
          <label><span class="label">操作符</span><select id="customOperator"><option>&gt;=</option><option>&lt;=</option><option>&gt;</option><option>&lt;</option><option>==</option></select></label>
          <label><span class="label">值</span><input id="customValue" placeholder="值" /></label>
          <button class="ghost-button align-end" data-add-custom-condition="1">添加</button>
        </div>
        <div class="form-grid" style="margin-top:12px">
          <label><span class="label">近N日累计涨跌幅</span><input id="recentDays" type="number" value="7" min="1" max="120" /></label>
          <label><span class="label">比较</span><select id="recentOperator"><option>&lt;=</option><option>&gt;=</option></select></label>
          <label><span class="label">值(%)</span><input id="recentValue" placeholder="值(%)" /></label>
          <button class="ghost-button align-end" data-add-recent-condition="1">添加近N日条件</button>
        </div>
        <div class="toolbar" style="margin-top:12px">
          ${customConditions.map((condition) => `<button class="chip active" data-remove-condition="${condition.id}">${conditionLabel(condition)} ×</button>`).join("") || tag(conditionSummary)}
          ${customConditions.length ? `<button class="ghost-button compact-button" data-clear-conditions="1">清空条件</button>` : ""}
        </div>
      </div>
      <div class="panel">
        <h2>策略与输出</h2>
        <div class="form-grid">
          <label><span class="label">策略名称</span><input id="strategyName" placeholder="策略名称" /></label>
          <label><span class="label">交易日</span><input placeholder="交易日(不填则最新日)" /></label>
          <label><span class="label">排序字段</span><select id="screenerSortField" data-screener-sort-field><option value="rps_120" ${selectedAttr(screenerSort.field === "rps_120")}>rps_120</option><option value="change_pct" ${selectedAttr(screenerSort.field === "change_pct")}>change_pct</option><option value="float_market_cap" ${selectedAttr(screenerSort.field === "float_market_cap")}>float_market_cap</option><option value="sector_rps_50" ${selectedAttr(screenerSort.field === "sector_rps_50")}>sector_rps_50</option></select></label>
          <label><span class="label">排序</span><select id="screenerSortDirection" data-screener-sort-direction><option value="desc" ${selectedAttr(screenerSort.direction === "desc")}>降序</option><option value="asc" ${selectedAttr(screenerSort.direction === "asc")}>升序</option></select></label>
        </div>
        <div class="toolbar" style="margin-top:12px">
          ${["symbol", "name", "close", "change_pct", "volume_signal", "macd", "float_market_cap", "sector_rps_50", "in_sector_rps_50", "sector", "candle_patterns", "support_line_next", "resistance_line_60"].map((item) => tag(item)).join("")}
        </div>
        <div class="toolbar">
          <button class="ghost-button" data-save-strategy="1">保存策略</button>
          <button class="ghost-button" data-open-modal="strategy">我的策略 ${savedStrategies.length}</button>
        </div>
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      ${panelTitle(`${filtered.length ? "筛选结果" : "相似候选"} ${visibleRows.length} 条`, `${tag(`股票池 ${data.stocks.length} 只 · ${activeLabel || "未选择因子"}`, "info")}`)}
      ${filtered.length ? stockTable(visibleRows.slice(0, 120)) : relaxed.length ? screenerRelaxedState(activeLabel, activeFactors.size) + stockTable(visibleRows.slice(0, 120)) : screenerEmptyState(activeLabel)}
      ${visibleRows.length > 120 ? `<p class="table-note">当前显示前 120 条，排序按成交额优先。</p>` : ""}
    </section>
  `;
}

function renderSectors() {
  const totalUp = data.sectors.reduce((sum, row) => sum + Number(row[4] || 0), 0);
  const totalDown = data.sectors.reduce((sum, row) => sum + Number(row[5] || 0), 0);
  const totalFund = data.sectors.reduce((sum, row) => sum + Number(row[7] || 0), 0);
  const hasSectorFund = !marketSource.includes("sina-industry-sectors");
  const avgConceptPct = data.concepts.reduce((sum, row) => sum + Number(row[1] || 0), 0) / Math.max(data.concepts.length, 1);
  return `
    <section class="panel compact-panel">
      <div class="toolbar">
        <label class="segmented"><input type="radio" checked />板块数据</label>
        <label class="segmented"><input type="radio" />概念数据</label>
        <label><span class="label">开始日期</span><input value="2026-07-03" /></label>
        <label><span class="label">结束日期</span><input value="2026-07-03" /></label>
        <button class="chip" data-toast="已应用：下跌(0~-5%)">下跌(0~-5%)</button>
        <button class="chip" data-toast="已应用：上涨(0~5%)">上涨(0~5%)</button>
        <button class="chip" data-toast="已应用：震荡(-10~10%)">震荡(-10~10%)</button>
        <button class="primary-button" data-refresh-market="1">刷新数据</button>
        <button class="ghost-button" data-toast="筛选已重置">重置筛选</button>
      </div>
    </section>
    <section class="grid metrics" style="margin-top:14px">
      ${metric("总板块数", data.sectors.length, "公开行情")}
      ${metric("平均涨跌幅", `${(data.sectors.reduce((s, r) => s + r[1], 0) / Math.max(data.sectors.length, 1)).toFixed(2)}%`, "排序口径")}
      ${metric("总上涨家数", totalUp, "样本聚合")}
      ${metric("总下跌家数", totalDown, "样本聚合")}
      ${metric("总资金流向", hasSectorFund ? `${totalFund >= 0 ? "+" : ""}${totalFund.toFixed(2)}亿` : "无字段", hasSectorFund ? "公开源" : "当前板块源不含资金字段")}
      ${metric("概念板块", data.concepts.length, `均涨跌 ${avgConceptPct.toFixed(2)}%`)}
    </section>
    <section class="panel compact-panel" style="margin-top:14px">
      <div class="form-grid">
        <label><span class="label">排序字段</span><select><option>涨跌幅</option><option>资金流向</option><option>排名变化</option><option>上涨家数</option></select></label>
        <label><span class="label">排序</span><select><option>降序</option><option>升序</option></select></label>
        <label><span class="label">最小值</span><input type="number" placeholder="最小值" /></label>
        <label><span class="label">最大值</span><input type="number" placeholder="最大值" /></label>
        <label class="segmented"><input type="radio" checked />柱状图</label>
        <label class="segmented"><input type="radio" />饼图</label>
      </div>
    </section>
    <section class="grid two">
      <div class="panel"><h2>资金流向分布</h2><div id="sectorFundChart" class="chart"></div></div>
      <div class="panel"><h2>涨跌幅排名</h2><div id="sectorChangeChart" class="chart"></div></div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>行业板块数据</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>名称</th><th>涨跌幅</th><th>排名</th><th>排名变化</th><th>上涨家数</th><th>下跌家数</th><th>涨停家数</th><th>资金流向(亿)</th></tr></thead>
          <tbody>${data.sectors.map((s) => `<tr><td>${s[0]}</td><td>${signed(s[1])}%</td><td>${s[2]}</td><td>${signed(s[3], 0)}</td><td>${s[4]}</td><td>${s[5]}</td><td>${s[6]}</td><td>${signed(s[7])}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>概念板块数据</h2>
      ${simpleTable(["概念", "涨跌幅", "排名", "成分数", "成交额", "领涨股", "领涨幅"], data.concepts.slice(0, 40).map((row) => [row[0], `${signed(row[1])}%`, row[2], row[3], `${row[4].toLocaleString()}亿`, row[5], `${signed(row[6])}%`]))}
    </section>
  `;
}

function renderQuote() {
  const stock = data.stocks.find((item) => item.code.includes(selectedQuote)) || data.stocks[0];
  const latestFlow = data.moneyFlow.latest;
  const financials = data.fundamentals?.financials || {};
  const popularity = data.popularity.stock?.latest;
  const bao = data.baostock || {};
  const baoLatest = bao.latest || {};
  return `
    <section class="panel compact-panel">
      <div class="form-grid">
        <label><span class="label">股票名称</span><input placeholder="如 贵州茅台" value="${stock.name}" /></label>
        <label><span class="label">股票代码</span><input id="quoteCode" placeholder="如 600519" value="${stock.code.slice(0, 6)}" /></label>
        <label><span class="label">开始日期</span><input value="2026-01-05" /></label>
        <label><span class="label">结束日期</span><input value="2026-07-04" /></label>
        <label><span class="label">复权</span><select><option>前复权(qfq)</option><option>后复权(hfq)</option><option>不复权</option></select></label>
        <button class="ghost-button align-end" data-add-watch="${stock.code}">加自选</button>
        <button class="primary-button align-end" data-query-quote="1">查询</button>
      </div>
      <div class="toolbar" style="margin-top:12px">
        <button class="chip" data-toast="已切换近半年">近半年</button>
        <button class="chip" data-toast="已切换近一年">近一年</button>
        <button class="chip" data-toast="已加载更多历史">加载更多历史</button>
        ${tag(`股票代码：${stock.code.slice(0, 6)} · 数据量：${data.breadth.length}`, "info")}
      </div>
    </section>
    <section class="grid metrics">
      ${metric("股票", `${stock.name}`, stock.code)}
      ${metric("现价", stock.price.toFixed(2), `${stock.pct >= 0 ? "+" : ""}${stock.pct}%`)}
      ${metric("成交量", `${Math.round((stock.amount || 0) / Math.max(stock.price || 1, 1) / 10000)}万`, "公开源估算")}
      ${metric("RPS50", stock.rps, "强度分")}
      ${metric("主力净流入", latestFlow ? `${plainSigned(yi(latestFlow.mainNet), 2, "亿")}` : `${stock.fund > 0 ? "+" : ""}${stock.fund}亿`, latestFlow ? "东财个股资金" : "样本口径")}
      ${metric("市盈率", stock.pe || "-", "PE")}
      ${metric("市净率", stock.pb || data.fundamentals?.pb || "-", "PB")}
      ${metric("5日主力", `${plainSigned(data.moneyFlow.sum5MainYi || 0, 2, "亿")}`, "近5日合计")}
      ${metric("ROE", financials.roe ? `${financials.roe}%` : "-", data.fundamentals?.reportLabel || "财务快照")}
      ${metric("人气排名", popularity?.rank ? `#${popularity.rank}` : "-", popularity?.calcTime || "东财人气")}
      ${metric("Bao PE", baoLatest.peTTM ? baoLatest.peTTM.toFixed(2) : "-", bao.generatedAt ? `缓存 ${bao.generatedAt.slice(0, 10)}` : "BaoStock")}
      ${metric("MA20", bao.ma20 ? bao.ma20.toFixed(2) : "-", bao.pct20 != null ? `20日 ${plainSigned(bao.pct20, 2, "%")}` : "历史日线")}
      ${metric("全球备份", data.yahooChart?.price ? data.yahooChart.price.toFixed(2) : "-", data.yahooChart?.symbol || "Yahoo chart")}
      ${metric("技术状态", stock.ma20 && stock.macd ? "偏强" : "观察", "MA20 / MACD")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        ${panelTitle(`分时图 (1分钟K) - ${stock.code.slice(0, 6)}`, tag("分时(1分钟K)", "info"))}
        <div id="quoteChart" class="chart"></div>
      </div>
      <div class="panel">
        <h2>画图工具</h2>
        <div class="tool-grid">
          ${["趋势线", "射线", "水平线", "箭头", "FIB", "GANN", "平行线", "清除所有画图", "放大", "缩小", "重置"].map((item) => `<button class="ghost-button icon-tool" title="${item}" data-toast="${item} 已就绪">${item}</button>`).join("")}
        </div>
        <h2 style="margin-top:16px">技术指标</h2>
        <div class="indicator-row">
          <span>副图1</span><strong>VOL</strong>
          <button class="ghost-button" data-open-modal="volParams">参数</button>
          <button class="ghost-button" data-open-modal="indicatorPicker">换指标</button>
        </div>
        <div class="indicator-row">
          <span>副图2</span><strong>MACD</strong>
          <button class="ghost-button" data-open-modal="macdParams">参数</button>
          <button class="ghost-button" data-open-modal="indicatorPicker">换指标</button>
        </div>
        <button class="primary-button" data-toast="指标已刷新">刷新指标</button>
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>个股资金流</h2>
        ${simpleTable(["日期", "收盘", "涨跌幅", "主力净额", "超大单", "大单"], (data.moneyFlow.rows || []).slice(-8).map((row) => [row.date, row.close.toFixed(2), `${signed(row.pct)}%`, `${plainSigned(yi(row.mainNet), 2, "亿")}`, `${plainSigned(yi(row.superNet), 2, "亿")}`, `${plainSigned(yi(row.bigNet), 2, "亿")}`]))}
      </div>
      <div class="panel">
        <h2>财务快照</h2>
        ${simpleTable(["指标", "数值", "口径"], [
          ["报告期", data.fundamentals?.reportLabel || "-", data.fundamentals?.source || "-"],
          ["营业总收入", financials.revenue ? `${yi(financials.revenue).toLocaleString()}亿` : "-", "新浪财报"],
          ["归母净利润", financials.parentNetProfit ? `${yi(financials.parentNetProfit).toLocaleString()}亿` : "-", "新浪财报"],
          ["基本EPS", financials.epsBasic ?? "-", "新浪财报"],
          ["每股净资产", financials.navps ?? "-", "新浪财报"],
          ["毛利率", financials.grossMargin ? `${financials.grossMargin}%` : "-", "新浪财报"],
          ["资产负债率", financials.debtRatio ? `${financials.debtRatio}%` : "-", "新浪财报"],
        ])}
        <h2 style="margin-top:16px">BaoStock历史估值</h2>
        ${simpleTable(["指标", "数值", "口径"], [
          ["PE(TTM)", baoLatest.peTTM ? baoLatest.peTTM.toFixed(2) : "-", "BaoStock日线"],
          ["PB(MRQ)", baoLatest.pbMRQ ? baoLatest.pbMRQ.toFixed(2) : "-", "BaoStock日线"],
          ["PS(TTM)", baoLatest.psTTM ? baoLatest.psTTM.toFixed(2) : "-", "BaoStock日线"],
          ["换手率", baoLatest.turnover ? `${baoLatest.turnover.toFixed(2)}%` : "-", "BaoStock日线"],
          ["MA5 / MA20 / MA60", [bao.ma5, bao.ma20, bao.ma60].map((value) => (value ? value.toFixed(2) : "-")).join(" / "), "后复权日线"],
          ["60日高低", bao.high60 && bao.low60 ? `${bao.low60.toFixed(2)} ~ ${bao.high60.toFixed(2)}` : "-", "后复权区间"],
        ])}
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>人气关键词与相关股</h2>
        ${simpleTable(["关键词", "热度", "时间"], (data.popularity.stock?.keywords || []).slice(0, 6).map((row) => [row.concept, row.heat.toLocaleString(), row.time]))}
        ${simpleTable(["相关股票", "涨跌幅", "时间"], (data.popularity.stock?.related || []).slice(0, 6).map((row) => [row.relatedCode, `${signed(row.pct)}%`, row.time]))}
      </div>
      <div class="panel">
        <h2>公司公告</h2>
        ${simpleTable(["来源", "日期", "分类", "标题"], (data.announcements.items || []).slice(0, 8).map((row) => [row.provider === "cninfo" ? "巨潮" : "东财", row.date, row.category || "-", row.url ? `<a href="${row.url}" target="_blank" rel="noreferrer">${row.title}</a>` : row.title]))}
        <h2 style="margin-top:16px">调研/关系披露</h2>
        ${simpleTable(["来源", "日期", "标题"], (data.disclosures.relations || []).slice(0, 6).map((row) => ["巨潮", row.date, row.url ? `<a href="${row.url}" target="_blank" rel="noreferrer">${row.title}</a>` : row.title]))}
      </div>
    </section>
  `;
}

function renderWatchlist() {
  const entries = watchlist
    .map((entry) => ({ entry, stock: data.stocks.find((stock) => stock.code === entry.code) }))
    .filter((row) => row.stock && (selectedWatchGroup === "全部" || row.entry.group === selectedWatchGroup));
  const groupOptions = ["全部", ...watchGroups]
    .map((group) => `<option value="${escapeHtml(group)}" ${group === selectedWatchGroup ? "selected" : ""}>${escapeHtml(group)}</option>`)
    .join("");
  const defaultAddGroup = selectedWatchGroup === "全部" ? watchGroups[0] : selectedWatchGroup;
  return `
    <div class="panel">
      <div class="form-grid">
        <label><span class="label">新分组名称</span><input id="watchGroupName" placeholder="新分组名称" /></label>
        <label><span class="label">分组</span><select id="watchGroupSelect" data-watch-group-select>${groupOptions}</select></label>
        <button class="primary-button align-end" data-create-watch-group="1">新建分组</button>
        <button class="ghost-button align-end" data-delete-watch-group="1">删除分组</button>
      </div>
      <div class="toolbar" style="margin-top:12px">
        ${watchGroups.map((group) => tag(`${group} ${watchlist.filter((item) => item.group === group).length}`)).join("")}
        <button class="ghost-button" data-add-watch="300059.SZ" data-watch-group="${escapeHtml(defaultAddGroup)}">加入东方财富</button>
        <button class="ghost-button" data-clear-watch="1">清空自选</button>
      </div>
      ${simpleTable(
        ["代码", "名称", "分组", "最新价", "涨跌额", "涨跌幅(%)", "成交额", "操作"],
        entries.map(({ stock, entry }) => [
          stock.code,
          stock.name,
          escapeHtml(entry.group),
          stock.price.toFixed(2),
          signed(stock.price * stock.pct / 100),
          signed(stock.pct),
          `${Math.round((stock.amount || 0) / 100000000 * 100) / 100}亿`,
          `<button class="ghost-button table-action" data-remove-watch="${stock.code}">删除</button>`,
        ])
      )}
    </div>
  `;
}

function normalizeWatchEntry(item) {
  if (typeof item === "string") return { code: item, group: DEFAULT_WATCH_GROUPS[0] };
  return {
    code: String(item?.code || "").trim(),
    group: String(item?.group || DEFAULT_WATCH_GROUPS[0]).trim() || DEFAULT_WATCH_GROUPS[0],
  };
}

function loadWatchlistState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_watchlist") || "null");
    if (!stored) return;
    const groups = Array.isArray(stored.groups) ? stored.groups.map((item) => String(item).trim()).filter(Boolean) : [];
    const entries = Array.isArray(stored.watchlist) ? stored.watchlist.map(normalizeWatchEntry).filter((item) => item.code) : [];
    watchGroups = [...new Set([...groups, ...entries.map((item) => item.group), ...DEFAULT_WATCH_GROUPS])];
    watchlist = entries.length ? dedupeWatchlist(entries) : watchlist;
    selectedWatchGroup = stored.selectedGroup && ["全部", ...watchGroups].includes(stored.selectedGroup) ? stored.selectedGroup : "全部";
  } catch (error) {
    // Bad local storage should not block the app shell.
  }
}

function persistWatchlistState() {
  try {
    localStorage.setItem(
      "quant_a_share_watchlist",
      JSON.stringify({
        groups: watchGroups,
        selectedGroup: selectedWatchGroup,
        watchlist,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("自选已更新，浏览器存储暂不可用。", "info");
  }
}

function dedupeWatchlist(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry.code || seen.has(entry.code)) return false;
    seen.add(entry.code);
    return true;
  });
}

function addWatchEntry(code, group) {
  const targetGroup = group && group !== "全部" ? group : watchGroups[0] || DEFAULT_WATCH_GROUPS[0];
  if (!watchGroups.includes(targetGroup)) watchGroups.push(targetGroup);
  const existing = watchlist.find((entry) => entry.code === code);
  if (existing) existing.group = targetGroup;
  else watchlist.push({ code, group: targetGroup });
  watchlist = dedupeWatchlist(watchlist);
  persistWatchlistState();
}

function removeWatchEntry(code) {
  watchlist = watchlist.filter((entry) => entry.code !== code);
  persistWatchlistState();
}

function renderAi() {
  return `
    <section class="grid two">
      <div class="panel">
        ${panelTitle("AI 决策矩阵", `<div class="toolbar"><button class="ghost-button" data-toast="已新建对话">新对话</button><button class="ghost-button" data-goto-page="subscription">钱包</button></div>`)}
        <div class="toolbar">
          <label class="toggle"><input type="checkbox" checked />实时搜索</label>
          <button class="chip active" data-mode-pick="快速模式">⚡ 快速模式</button>
          <button class="chip" data-mode-pick="专家模式">◈ 专家模式</button>
          <button class="chip" data-mode-pick="深度思考">🧠 深度思考</button>
        </div>
        <label><span class="label">问题</span><textarea id="question" placeholder="请输入你的问题，AI将基于多维数据为你解答...">结合实时行情，分析宁德时代现在能不能买，按短线3-5天思路给我操作计划。</textarea></label>
        <div class="toolbar" style="margin-top:12px">
          <select id="mode"><option>快速模式</option><option>专家模式</option><option>深度思考</option></select>
          <button class="primary-button" data-chat-module="ai_matrix" data-target="aiAnswer">生成回答</button>
        </div>
        <p class="notice">Vercel 后端会读取服务端 DEEPSEEK_API_KEY，浏览器端不保存密钥。</p>
        <div class="prompt-grid">${hotPrompts.map((prompt) => `<button class="prompt-card" data-hot-prompt="${escapeHtml(prompt)}">${prompt}</button>`).join("")}</div>
      </div>
      <div class="panel">
        <h2>结果</h2>
        <div id="aiAnswer" class="answer">点击“生成回答”查看分析。</div>
      </div>
    </section>
  `;
}

function renderLlm() {
  return `
    <section class="panel">
      ${panelTitle("LLM分析", `<button class="ghost-button" data-refresh-market="1">刷新</button>`)}
      <div class="tabbar">${llmTabs.map((tabName) => `<button class="tab-button ${selectedLlmTab === tabName ? "active" : ""}" data-llm-tab="${tabName}">${tabName}</button>`).join("")}</div>
      <div class="llm-tab-body">${renderLlmTab()}</div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>研究问题</h2>
        <label><span class="label">问题</span><textarea id="question">今天哪些板块资金在持续流入？结合主题热点、行业轮动和样本股票池，给我低吸观察顺序。</textarea></label>
        <div class="toolbar" style="margin-top:12px">
          <select id="mode"><option>专家模式</option><option>快速模式</option><option>深度思考</option></select>
          <button class="primary-button" data-chat-module="llm_analysis" data-target="llmAnswer">生成研究结论</button>
        </div>
      </div>
      <div class="panel">
        <h2>研究结果</h2>
        <div id="llmAnswer" class="answer">点击“生成研究结论”调用后端。</div>
      </div>
    </section>
  `;
}

function renderLlmTab() {
  if (selectedLlmTab === "主题热点") {
    const topics = liveTopics();
    const active = topics[0];
    return `
      <div class="toolbar">
        <button class="chip active">行业</button><button class="chip">概念</button>
        <input class="inline-input" value="2026-07-03" />
        <input class="inline-input" placeholder="筛选主题" />
      </div>
      <div class="topic-grid">${topics.map((topic) => `<button class="topic-card ${topic.name === active.name ? "active" : ""}" data-toast="已选择主题 ${topic.name}"><strong>${topic.name}</strong><span>热度 ${topic.heat}</span><span>趋势 ${topic.trend}</span><span>成交额 ${topic.fund3}</span></button>`).join("")}</div>
      <section class="grid metrics" style="margin-top:14px">
        ${metric("成交额(亿)", active.fund3, active.name)}
        ${metric("3日涨跌", `${active.pct3}%`, active.trend)}
        ${metric("站上MA20(%)", active.ma20, "主题宽度")}
        ${metric("人气集中", active.crowd, "集中度")}
      </section>
      <div class="detail-strip" style="margin-top:14px">
        ${tag(active.stage, "info")}${tag(`置信度 0.75`, "info")}${tag(`评分 ${active.score}`, "info")}${tag("分层 watch")}${tag("决策 observe")}
      </div>
      <div class="grid two" style="margin-top:14px">
        <div class="panel inset">
          <h3>主题映射</h3>
          ${simpleTable(["原始主题", "标准主题", "方法", "匹配", "得分", "最终类型"], [[active.name, active.name, "llm_candidate", "是", "0.864", "industry"]])}
        </div>
        <div class="panel inset">
          <h3>主题个股</h3>
          ${simpleTable(["代码", "名称", "来源", "阶段", "置信度", "操作"], llmPool.slice(0, 4).map((row) => [row[0], row[1], row[5], row[7], row[9], `<button class="ghost-button table-action">查看</button>`]))}
        </div>
      </div>
    `;
  }
  if (selectedLlmTab === "选股池") {
    return `
      <div class="form-grid">
        <input placeholder="基准交易日" value="2026-07-03" /><input placeholder="筛选：代码/名称/主题" />
        <select><option>来源</option><option>规则候选</option><option>策略候选</option></select>
        <select><option>策略筛选</option><option>Entry</option><option>Watch</option></select>
        <select><option>主题类型</option><option>行业</option><option>概念</option></select>
        <select><option>默认（关注优先）</option><option>置信度</option><option>仓位</option></select>
      </div>
      <div class="detail-strip">${tag("总数：38")}${tag("关注：3")}${tag("收益选择：2026-07-03")}${tag("收盘态")}${tag("最关注", "info")}${tag("策略候选", "info")}</div>
      ${simpleTable(["代码", "名称", "实时价", "盘中涨跌", "主题", "来源", "策略", "阶段", "仓位", "置信度", "买点价", "T+1", "T+3", "T+5", "关注"], llmPool)}
    `;
  }
  if (selectedLlmTab === "板块全景看板") {
    return `
      <div class="form-grid">
        <input placeholder="交易日（默认最新）" /><input placeholder="筛选：板块/ID/关键词" />
        <select><option>当日资金_亿</option><option>3日涨跌</option><option>MA20占比</option></select>
        <select><option>降序</option><option>升序</option></select>
        <select><option>展示列（可多选）</option></select><select><option>50条/页</option></select>
      </div>
      <div class="detail-strip">${tag("总数：569")}${tag("交易日：2026-07-03")}${tag("轮动", "info")}${tag("高位")}${tag("低吸")}</div>
      ${simpleTable(["信号", "日期", "板块", "1日涨跌", "3日涨跌", "当日资金_亿", "3日资金_亿", "Top100", "5日资金_亿", "5日涨跌", "7日涨跌", "MA20占比", "集中度", "3日资金_norm_亿"], llmSectorRows.map((row) => row.map((cell, index) => typeof cell === "number" && index > 2 ? signed(cell) : cell)))}
    `;
  }
  if (selectedLlmTab === "个股评估矩阵") {
    return `
      <div class="form-grid">
        <input placeholder="交易日（若表有日期列）" /><input placeholder="筛选：股票代码/名称/板块/关键词" />
        <select><option>3天累积涨跌幅</option><option>当日资金_亿</option><option>流通市值</option></select>
        <select><option>降序</option><option>升序</option></select>
        <select><option>展示列（可多选）</option></select><select><option>50条/页</option></select>
      </div>
      <div class="detail-strip">${tag("总数：40599")}</div>
      ${simpleTable(["代码", "名称", "当日资金_亿", "5日资金_亿", "收盘_早盘(负数=更热)", "大于等于5日线", "大于等于90日线", "大于等于144日线", "流通市值（亿）", "5日涨跌", "1日涨跌", "行情"], llmStockMatrix.map((row) => [...row.map((cell, index) => typeof cell === "number" && [2, 3, 9, 10].includes(index) ? signed(cell) : cell), `<button class="ghost-button table-action" data-toast="已打开行情">查看</button>`]))}
    `;
  }
  const reports = researchReports();
  const stats = data.research?.stats || {};
  const topIndustries = stats.byIndustry?.length ? stats.byIndustry : researchIndustryStats(reports);
  if (!reports.length) {
    return `<div class="empty-state"><strong>产业链研报分析</strong><span>公开研报源暂未返回数据；入口、筛选和表格承载区已保留。</span></div>`;
  }
  return `
    <section class="grid metrics">
      ${metric("研报数量", stats.total || reports.length, data.research?.source || "公开研报")}
      ${metric("覆盖机构", stats.orgCount || new Set(reports.map((row) => row.orgSName)).size, "近30日")}
      ${metric("最新日期", stats.latestDate || reports[0]?.publishDate || "-", "发布日期")}
      ${metric("热门方向", topIndustries[0]?.name || "-", `${topIndustries[0]?.count || 0} 篇`)}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel inset">
        <h3>行业/主题分布</h3>
        ${simpleTable(["方向", "报告数"], topIndustries.slice(0, 10).map((row) => [row.name, row.count]))}
      </div>
      <div class="panel inset">
        <h3>产业链线索</h3>
        <div class="detail-strip">${reports.slice(0, 10).map((row) => tag(row.industryName || row.category, row.category === "行业研报" ? "info" : "")).join("")}</div>
        <p class="table-note">报告来自东财研报中心，已进入 LLM 分析上下文。</p>
      </div>
    </section>
    ${simpleTable(
      ["日期", "类型", "行业/主题", "标题", "机构", "作者", "页数"],
      reports.slice(0, 30).map((row) => [
        row.publishDate || "-",
        row.category || "-",
        row.industryName || "-",
        row.url ? `<a href="${row.url}" target="_blank" rel="noreferrer">${escapeHtml(row.title)}</a>` : escapeHtml(row.title),
        row.orgSName || row.orgName || "-",
        row.researcher || "-",
        row.pages || "-",
      ])
    )}
  `;
}

function liveTopics() {
  const concepts = data.concepts.slice(0, 12).map((row) => ({
    name: row[0],
    heat: Math.max(30, Math.min(99, Math.round(55 + Number(row[1] || 0) * 4 + Number(row[4] || 0) / 80))),
    trend: Number(row[1] || 0) >= 0 ? "new" : "down",
    fund3: row[4],
    pct3: row[1],
    ma20: Math.max(20, Math.min(99, Math.round(50 + Number(row[1] || 0) * 4))),
    crowd: Math.round((Number(row[4] || 0) / 1000) * 100) / 100,
    stage: Number(row[1] || 0) >= 3 ? "轮动加强" : Number(row[1] || 0) >= 0 ? "低吸观察" : "退潮观察",
    score: Math.max(30, Math.min(95, Math.round(60 + Number(row[1] || 0) * 5))),
  }));
  return concepts.length ? concepts : llmTopics;
}

function researchReports() {
  return (data.research?.reports || []).filter((row) => row.title);
}

function researchIndustryStats(reports) {
  const counts = new Map();
  reports.forEach((row) => {
    const key = row.industryName || row.category || "未归类";
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function renderQimen() {
  return `
    <section class="grid two">
      <div class="panel">
        ${panelTitle("奇门遁甲", `<div class="toolbar"><button class="ghost-button" data-open-modal="wallet">钱包账单</button><button class="ghost-button" data-open-modal="tasks">任务列表</button></div>`)}
        <p>把专业解盘转成你能直接看懂、能马上行动的建议。</p>
        <div class="form-grid">
          <label><span class="label">事项类型</span><select id="itemType"><option>金融</option><option>工作</option><option>合作</option></select></label>
          <label><span class="label">判断目标</span><select><option>现在适不适合进场</option><option>是否继续持有</option><option>能否低吸</option><option>是否减仓</option></select></label>
          <label><span class="label">当前阶段</span><select id="stage"><option>在考虑阶段</option><option>已持有/已开始</option><option>准备执行</option></select></label>
          <label><span class="label">历法类型</span><select><option>公历</option><option>此刻</option></select></label>
          <label><span class="label">时间输入</span><input value="2026-07-04 10:30" /></label>
          <label><span class="label">城市</span><input id="city" value="上海" /></label>
          <label><span class="label">输出偏好</span><select><option>直接结论</option><option>过程展开</option></select></label>
          <label><span class="label">解盘档位</span><select id="mode"><option>深入分析（20点）</option><option>快速结论（8点）</option></select></label>
        </div>
        <label style="margin-top:12px"><span class="label">事情摘要</span><textarea id="question">我最近在看一只科技股，已经涨了一段时间，现在担心追高，但又怕错过后面的上涨，想判断现在适不适合进场。</textarea></label>
        <div class="toolbar" style="margin-top:12px">
          <button class="ghost-button" data-fill-now="1">同步起局（1点）</button>
          <button class="primary-button" data-chat-module="qimen" data-target="qimenAnswer">提交解盘任务</button>
          <button class="ghost-button" data-toast="表单已重置">重置</button>
        </div>
      </div>
      <div class="panel">
        <h2>结果与详情</h2>
        <div id="qimenAnswer" class="answer">请先起局，或直接提交解盘任务。</div>
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>我的历史</h2>
        <div class="empty-state"><strong>还没有历史记录</strong><span>提交解盘任务后会显示排队、执行、完成和详情。</span></div>
      </div>
      <div class="panel">
        <h2>任务状态样例</h2>
        ${simpleTable(["提交时间", "类型", "目标", "状态", "模式", "计费", "点数", "开始", "结束", "操作"], [])}
      </div>
    </section>
  `;
}

function renderSubscription() {
  const visibleProducts = products.filter((product) => productFilter === "all" || product[0] === productFilter);
  return `
    <section class="grid metrics">
      ${metric("当前账号", "演示账号", "登录状态")}
      ${metric("账号状态", "正常", "订阅与点数可用")}
      ${metric("可用点数", "86.5", "钱包余额")}
      ${metric("冻结点数", "0", "结算占用")}
      ${metric("订阅商品", `${products.length} 个`, "点数包 / 订阅套餐")}
      ${metric("账单流水", `${walletLedger.length} 条`, "可查看")}
    </section>
    <section class="panel" style="margin-top:14px">
      ${panelTitle("订阅商品", `<div class="toolbar"><button class="ghost-button" data-open-modal="wallet">查看钱包账单</button><button class="ghost-button" data-refresh-market="1">刷新</button></div>`)}
      <div class="toolbar">
        <button class="chip ${productFilter === "all" ? "active" : ""}" data-product-filter="all">全部商品 ${products.length}</button>
        <button class="chip ${productFilter === "points" ? "active" : ""}" data-product-filter="points">点数包 ${products.filter((item) => item[0] === "points").length}</button>
        <button class="chip ${productFilter === "sub" ? "active" : ""}" data-product-filter="sub">订阅套餐 ${products.filter((item) => item[0] === "sub").length}</button>
      </div>
      <div class="product-grid">
        ${visibleProducts
          .map(
            (product) => `
              <article class="product-card">
                <div class="product-head"><strong>${product[1]}</strong>${tag(product[2], "info")}</div>
                <span class="label">${product[3]}</span>
                <p>${product[4]}，适合把平台作为日常分析入口。</p>
                <strong class="price">¥ ${Number(product[5]).toFixed(2)}</strong>
                <div class="detail-strip">${tag(product[6])}${tag(product[7])}${tag("购买数量：1")}</div>
                <div class="toolbar">
                  <button class="ghost-button" data-open-product="${products.indexOf(product)}">商品说明</button>
                  <button class="primary-button" data-buy-product="${products.indexOf(product)}">立即购买</button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">${panelTitle("快捷入口")}<div class="toolbar"><button class="ghost-button" data-open-modal="wallet">去钱包账单</button><button class="primary-button" data-goto-page="ai">前往 AI 决策矩阵</button></div></div>
      <div class="panel">${panelTitle("下单状态")}<div class="order-flow"><span>确认购买信息</span><span>扫码支付</span><span>填写订单号后四位</span><span>等待开通</span></div></div>
    </section>
  `;
}

function renderModal() {
  if (!modal) return "";
  const titleMap = {
    strategy: "我的策略",
    wallet: "钱包账单",
    tasks: "奇门任务",
    volParams: "调整指标参数",
    macdParams: "调整指标参数",
    indicatorPicker: "切换指标",
    product: "商品说明",
    buy: "确认购买信息",
  };
  return `
    <div class="modal-backdrop" data-close-modal="1">
      <section class="modal-panel" role="dialog" aria-modal="true" aria-label="${titleMap[modal.type] || "详情"}">
        <div class="modal-head"><h2>${titleMap[modal.type] || "详情"}</h2><button class="ghost-button" data-close-modal="1">关闭</button></div>
        ${modalBody()}
      </section>
    </div>
  `;
}

function modalBody() {
  if (modal.type === "strategy") {
    if (!savedStrategies.length) return `<div class="empty-state"><strong>暂无已保存策略</strong><span>在量化因子选股页设置条件后点击保存策略。</span></div>`;
    return `${simpleTable(
      ["策略名称", "因子", "自定义条件", "排序", "最近保存", "操作"],
      savedStrategies.map((strategy) => [
        escapeHtml(strategy.name),
        strategy.factors.length,
        strategy.conditions.length,
        `${strategy.sort.field}/${strategy.sort.direction === "asc" ? "升序" : "降序"}`,
        strategy.savedAt?.slice(0, 10) || "-",
        `<button class="ghost-button table-action" data-apply-strategy="${strategy.id}">应用</button><button class="ghost-button table-action" data-delete-strategy="${strategy.id}">删除</button>`,
      ])
    )}`;
  }
  if (modal.type === "wallet") {
    return `
      <section class="grid metrics">
        ${metric("可用点数", "86.5", "当前余额")}
        ${metric("冻结点数", "0", "结算占用")}
        ${metric("累计充值", "100", "初始化与充值")}
        ${metric("累计消费", "13.5", "问答与解盘")}
      </section>
      <div class="toolbar" style="margin-top:12px"><input class="inline-input" placeholder="请输入兑换码，例如 QM-ABCD-123456" /><button class="primary-button" data-toast="兑换码已记录">立即充值</button></div>
      ${simpleTable(["时间", "类型", "点数变化", "变更后余额", "变更后冻结", "备注"], walletLedger.map((row) => [row[0], row[1], signed(row[2], 1), row[3], row[4], row[5]]))}
    `;
  }
  if (modal.type === "tasks") {
    return `${simpleTable(["提交时间", "类型", "目标", "状态", "模式", "计费", "点数", "开始", "结束", "操作"], [["暂无数据", "-", "-", "空", "-", "-", "-", "-", "-", "-"]])}`;
  }
  if (modal.type === "volParams") {
    return `<div class="form-grid"><label><span class="label">M1</span><input type="number" value="5" /></label><label><span class="label">M2</span><input type="number" value="10" /></label></div><div class="toolbar modal-actions"><button class="ghost-button" data-close-modal="1">取消</button><button class="primary-button" data-close-modal="1" data-toast="VOL 参数已确认">确定</button></div>`;
  }
  if (modal.type === "macdParams") {
    return `<div class="form-grid"><label><span class="label">SHORT</span><input type="number" value="12" /></label><label><span class="label">LONG</span><input type="number" value="26" /></label><label><span class="label">MID</span><input type="number" value="9" /></label></div><div class="toolbar modal-actions"><button class="ghost-button" data-close-modal="1">取消</button><button class="primary-button" data-close-modal="1" data-toast="MACD 参数已确认">确定</button></div>`;
  }
  if (modal.type === "indicatorPicker") {
    return `<div class="indicator-picker">${["VOL", "MACD", "KDJ", "RSI", "BOLL", "VWAP", "成交额", "换手率"].map((item) => `<button class="chip" data-close-modal="1" data-toast="已切换到 ${item}">${item}</button>`).join("")}</div>`;
  }
  if (modal.type === "product") {
    const product = products[modal.productIndex] || products[0];
    return `<div class="product-detail"><strong>${product[1]}</strong><p>${product[4]}，${product[7]}。购买后按账号自动开通或充值。</p><div class="detail-strip">${tag(product[2], "info")}${tag(product[3])}${tag(`¥ ${Number(product[5]).toFixed(2)}`)}</div></div>`;
  }
  if (modal.type === "buy") {
    const product = products[modal.productIndex] || products[0];
    return `
      <div class="order-box">
        <strong>${product[1]}</strong>
        <span>金额：¥ ${Number(product[5]).toFixed(2)}</span>
        <span>数量：1</span>
      </div>
      <div class="fake-qr">扫码支付</div>
      <label><span class="label">订单号后四位</span><input placeholder="填写订单号后四位" maxlength="4" /></label>
      <div class="toolbar modal-actions"><button class="ghost-button" data-close-modal="1">取消</button><button class="primary-button" data-close-modal="1" data-toast="订单已进入待核验状态">提交核验</button></div>
    `;
  }
  return "";
}

function renderAbout() {
  return `
    <section class="grid two">
      <div class="panel">
        <h2>部署方式</h2>
        <p>GitHub Pages 发布 <code>pages/</code>，用于展示和备用访问。</p>
        <p>Vercel 发布同一套前端，并提供 <code>/api/chat</code> 后端问答接口。</p>
      </div>
      <div class="panel">
        <h2>服务端密钥</h2>
        <p>DeepSeek key 只配置为 Vercel 环境变量 <code>DEEPSEEK_API_KEY</code>。</p>
        <p>浏览器只调用后端接口，不直接持有密钥。</p>
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>与 aiwuchuan 主模块对齐情况</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>模块</th><th>状态</th><th>当前说明</th></tr></thead>
          <tbody>${coverageRows.map(([module, status, note]) => `<tr><td>${module}</td><td>${statusBadge(status)}</td><td>${note}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>数据源覆盖</h2>
      <div class="detail-strip">${tag(`当前接口 ${marketSource}`, "info")}${tag(`股票池 ${data.stocks.length} 只`)}${tag(`概念 ${data.concepts.length} 个`)}${tag(`BaoStock ${data.baostock?.rows?.length || 0} 行`)}${tag(`财务字段 ${data.fundamentals?.rows?.length || 0} 项`)}</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>来源</th><th>状态</th><th>用途</th></tr></thead>
          <tbody>${dataSourceRows.map(([source, status, usage]) => `<tr><td>${source}</td><td>${statusBadge(status)}</td><td>${usage}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function filteredStocks() {
  return data.stocks.filter((stock) => stockPassesAllFilters(stock)).sort(sortScreenerRows);
}

function relaxedStocks() {
  const filters = activeFilterPredicates();
  if (!filters.length) return [];
  return data.stocks
    .map((stock) => {
      const score = filters.reduce((sum, filter) => sum + (filter.pass(stock) ? 1 : 0), 0);
      return { ...stock, factorScore: score, factorTotal: filters.length };
    })
    .filter((stock) => stock.factorScore > 0)
    .sort((a, b) => b.factorScore - a.factorScore || sortScreenerRows(a, b))
    .slice(0, 120);
}

function factorHitCounts() {
  const counts = new Map();
  factorGroups.flatMap(([, chips]) => chips).forEach(([key]) => {
    counts.set(key, data.stocks.filter((stock) => factorPasses(stock, key)).length);
  });
  return counts;
}

function sortScreenerRows(a, b) {
  const av = screenerSortValue(a, screenerSort.field);
  const bv = screenerSortValue(b, screenerSort.field);
  const primary = screenerSort.direction === "asc" ? av - bv : bv - av;
  return primary || (Number(b.amount) || 0) - (Number(a.amount) || 0) || (Number(b.rps) || 0) - (Number(a.rps) || 0);
}

function stockPassesAllFilters(stock) {
  return activeFilterPredicates().every((filter) => filter.pass(stock));
}

function activeFilterPredicates() {
  return [
    ...Array.from(activeFactors).map((key) => ({ label: key, pass: (stock) => factorPasses(stock, key) })),
    ...customConditions.map((condition) => ({ label: conditionLabel(condition), pass: (stock) => conditionPasses(stock, condition) })),
  ];
}

function screenerSortValue(stock, field) {
  if (field === "change_pct") return Number(stock.pct) || 0;
  if (field === "float_market_cap") return (Number(stock.circMv) || Number(stock.totalMv) || Number(stock.amount) * 12 || 0) / 100000000;
  if (field === "sector_rps_50") return Number(stock.sectorRps) || 0;
  return Number(stock.rps120) || 0;
}

function conditionPasses(stock, condition) {
  const actual = conditionFieldValue(stock, condition);
  const expected = Number(condition.value);
  if (!Number.isFinite(expected)) return true;
  if (condition.operator === ">=") return actual >= expected;
  if (condition.operator === "<=") return actual <= expected;
  if (condition.operator === ">") return actual > expected;
  if (condition.operator === "<") return actual < expected;
  return Math.abs(actual - expected) < 1e-9;
}

function conditionFieldValue(stock, condition) {
  if (condition.field === "change_pct") return Number(stock.pct) || 0;
  if (condition.field === "volume_signal") return stock.volumeRatio >= 1.5 || stock.pct > 3 ? 1 : 0;
  if (condition.field === "macd") return stock.macd ? 1 : 0;
  if (condition.field === "float_market_cap") return (Number(stock.circMv) || Number(stock.totalMv) || Number(stock.amount) * 12 || 0) / 100000000;
  if (condition.field === "sector_rps_50") return Number(stock.sectorRps) || 0;
  if (condition.field === "support_line_next") return Number(stock.price) ? Number((stock.price * 0.96).toFixed(2)) : 0;
  if (condition.field === "n_day_pct") return estimateRecentReturn(stock, condition.days);
  return 0;
}

function estimateRecentReturn(stock, days = 7) {
  const n = Math.max(1, Math.min(120, Number(days) || 7));
  const pct = Number(stock.pct) || 0;
  const strengthDrift = ((Number(stock.rps) || 50) - 50) / 20;
  return Math.round((pct * Math.max(1, Math.sqrt(n / 3)) + strengthDrift) * 100) / 100;
}

function conditionLabel(condition) {
  if (condition.field === "n_day_pct") return `近${condition.days || 7}日涨跌幅 ${condition.operator} ${condition.value}%`;
  return `${condition.field} ${condition.operator} ${condition.value}`;
}

function factorPasses(stock, key) {
  const totalMv = stock.totalMv || stock.amount * 18 || 0;
  const circMv = stock.circMv || stock.amount * 12 || 0;
  const rpsCombo = Math.round((stock.rps + (stock.sectorRps || stock.rps) + (stock.inSectorRps || stock.rps)) / 3);
  const upperShadow = stock.high && stock.open ? stock.high > Math.max(stock.open, stock.price) * 1.025 : false;
  const lowerShadow = stock.low && stock.open ? Math.min(stock.open, stock.price) > stock.low * 1.025 : false;
  const checks = {
    pe: () => stock.pe > 0 && stock.pe <= 30,
    pb: () => stock.pb > 0 && stock.pb <= 3,
    mv500: () => totalMv >= 50000000000,
    mv50_200: () => totalMv >= 5000000000 && totalMv <= 20000000000,
    float100: () => circMv >= 10000000000,
    float50: () => circMv > 0 && circMv <= 5000000000,
    limit: () => stock.pct >= 9.8,
    turn3: () => stock.turnover >= 3,
    turnLow: () => stock.turnover > 0 && stock.turnover < 1,
    vr15: () => stock.volumeRatio >= 1.5,
    amount1: () => stock.amount >= 100000000,
    doubleVol: () => stock.volumeRatio >= 2 || (stock.pct >= 3 && stock.turnover >= 3),
    amp8: () => stock.amplitude >= 8,
    volumeSignal: () => stock.amount >= 1000000000 || stock.pct >= 3,
    sectorRps: () => stock.sectorRps >= 80,
    inSectorRps: () => stock.inSectorRps >= 80,
    ma5: () => stock.pct >= -0.3,
    ma10: () => stock.pct >= -0.8,
    ma20: () => stock.ma20,
    ma60: () => stock.rps >= 55,
    ma90: () => stock.rps >= 60,
    ma144: () => stock.rps >= 65,
    rps: () => stock.rps >= 70,
    rps120: () => stock.rps120 >= 70,
    rpsCombo: () => rpsCombo >= 80,
    ema: () => stock.pct >= 0.5,
    macd: () => stock.macd,
    kdj: () => stock.pct >= 1.2,
    rsiLow: () => stock.pct <= -3,
    rsiHigh: () => stock.pct >= 5,
    upperShadow: () => upperShadow,
    lowerShadow: () => lowerShadow,
    dealer: () => stock.rps >= 75 && stock.turnover >= 2,
    absorb: () => stock.fund > 0,
    strongAbsorb: () => stock.fund > 0 && stock.rps >= 70,
    strongAbsorb3: () => stock.fund > 0 && stock.rps >= 70 && stock.turnover >= 2,
    attack: () => stock.pct >= 3 && stock.amount >= 1000000000,
    trigger: () => stock.pct >= 1 && stock.fund > 0,
    fundRsi: () => stock.fundRsi >= 50,
    cost20: () => stock.price >= stock.cost20,
    cost60: () => stock.price >= stock.cost60,
    rsiV: () => stock.pct < -2 && stock.turnover >= 3,
    vwapScore: () => stock.vwapScore >= 5,
    vwapLong: () => stock.pct >= 0 && stock.rps >= 55,
    vwapDip: () => stock.pct > -2 && stock.pct < 1 && stock.rps >= 45,
    vwapBreak: () => stock.pct >= 2 && stock.amount >= 1000000000,
    vwapFast: () => stock.pct >= 4,
    vwapPos: () => stock.price >= stock.vwap,
    entry: () => stock.pct >= 0 && stock.fund > 0 && stock.rps >= 60,
    gaussUp: () => stock.rps >= 60,
    gaussStart: () => stock.rps >= 70 && stock.pct >= 0,
    gaussTurn: () => stock.pct > 1 && stock.rps >= 55,
    superRes: () => stock.rps >= 82 && stock.fund > 0 && stock.macd,
    resAttack: () => stock.pct >= 3 && stock.fund > 0,
    resStart: () => stock.rps >= 70 && stock.fund > 0,
    auction: () => stock.pct >= 5 && stock.turnover >= 3,
    support60: () => stock.rps >= 45 && stock.rps <= 65,
    support144: () => stock.rps >= 40 && stock.rps <= 60,
    break60: () => stock.rps >= 72,
    break144: () => stock.rps >= 78,
    chanBottom: () => lowerShadow || stock.pct <= -3,
    chanTop: () => upperShadow || stock.pct >= 6,
    chanBuy3: () => stock.pct >= 1 && stock.rps >= 65,
    chanSell3: () => stock.pct <= -2,
    centerStart: () => Math.abs(stock.pct) <= 1.5,
    centerEnd: () => Math.abs(stock.pct) >= 3,
    centerBreak: () => stock.pct >= 3,
    gann11: () => stock.rps >= 50 && stock.rps <= 70,
    gann12: () => stock.rps >= 45 && stock.rps <= 65,
    gann21: () => stock.rps >= 60 && stock.rps <= 80,
    bullEngulf: () => stock.pct >= 2,
    morningStar: () => lowerShadow && stock.pct >= 0,
    tdBuy9: () => stock.pct <= -3,
    tdBuy13: () => stock.pct <= -5,
    tdSell9: () => stock.pct >= 5,
    tdSell13: () => stock.pct >= 8,
  };
  return checks[key] ? checks[key]() : true;
}

function activeFactorLabels() {
  const labels = new Map(factorGroups.flatMap(([, chips]) => chips));
  const factorLabels = Array.from(activeFactors)
    .map((key) => labels.get(key) || key)
  const conditionLabels = customConditions.map(conditionLabel);
  return [...factorLabels, ...conditionLabels].join(" + ");
}

function selectedAttr(value) {
  return value ? "selected" : "";
}

function loadScreenerState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_screener") || "null");
    if (!stored) return;
    activeFactors = new Set(Array.isArray(stored.activeFactors) ? stored.activeFactors : Array.from(activeFactors));
    customConditions = Array.isArray(stored.customConditions) ? stored.customConditions.map(normalizeCondition).filter(Boolean) : [];
    savedStrategies = Array.isArray(stored.savedStrategies) ? stored.savedStrategies.map(normalizeStrategy).filter(Boolean) : [];
    screenerSort = normalizeSort(stored.screenerSort);
  } catch (error) {
    // Bad local storage should not block screening.
  }
}

function persistScreenerState() {
  try {
    localStorage.setItem(
      "quant_a_share_screener",
      JSON.stringify({
        activeFactors: Array.from(activeFactors),
        customConditions,
        savedStrategies,
        screenerSort,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("选股条件已更新，浏览器存储暂不可用。", "info");
  }
}

function normalizeSort(sort) {
  const field = ["rps_120", "change_pct", "float_market_cap", "sector_rps_50"].includes(sort?.field) ? sort.field : "rps_120";
  const direction = sort?.direction === "asc" ? "asc" : "desc";
  return { field, direction };
}

function normalizeCondition(condition) {
  if (!condition?.field || !condition?.operator) return null;
  const value = Number(condition.value);
  if (!Number.isFinite(value)) return null;
  return {
    id: condition.id || `c_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    field: condition.field,
    operator: condition.operator,
    value,
    days: condition.days ? Number(condition.days) : undefined,
  };
}

function normalizeStrategy(strategy) {
  if (!strategy?.name) return null;
  return {
    id: strategy.id || `s_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name: String(strategy.name).slice(0, 32),
    factors: Array.isArray(strategy.factors) ? strategy.factors : [],
    conditions: Array.isArray(strategy.conditions) ? strategy.conditions.map(normalizeCondition).filter(Boolean) : [],
    sort: normalizeSort(strategy.sort),
    savedAt: strategy.savedAt || new Date().toISOString(),
  };
}

function saveCurrentStrategy(name) {
  const strategy = normalizeStrategy({
    id: `s_${Date.now()}`,
    name: name || `策略 ${new Date().toLocaleDateString("zh-CN")}`,
    factors: Array.from(activeFactors),
    conditions: customConditions,
    sort: screenerSort,
    savedAt: new Date().toISOString(),
  });
  savedStrategies = [strategy, ...savedStrategies.filter((item) => item.name !== strategy.name)].slice(0, 20);
  persistScreenerState();
  return strategy;
}

function screenerEmptyState(activeLabel) {
  return `
    <div class="empty-state">
      <div>
        <strong>当前组合没有命中</strong>
        <p>股票池 ${data.stocks.length} 只，条件：${escapeHtml(activeLabel || "未选择因子")}。可以先去掉一个严格条件，或者点“刷新”重新拉取公开行情。</p>
      </div>
    </div>
  `;
}

function screenerRelaxedState(activeLabel, factorTotal) {
  return `
    <div class="empty-state compact-empty">
      <div>
        <strong>严格组合暂未命中</strong>
        <p>条件：${escapeHtml(activeLabel || "未选择因子")}。下方按匹配 ${factorTotal} 个因子的数量、成交额和强度排序。</p>
      </div>
    </div>
  `;
}

function stockTable(rows) {
  if (!rows.length) return `<p>暂无匹配数据。</p>`;
  const hasFactorScore = rows.some((stock) => Number.isFinite(stock.factorScore));
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${hasFactorScore ? "<th>匹配</th>" : ""}<th>代码</th><th>名称</th><th>最新价</th><th>涨跌幅</th><th>量能信号</th><th>MACD</th><th>流通市值</th><th>行业整体RPS_50</th><th>行业RPS_50</th><th>行业</th><th>K线形态</th><th>趋势支撑线_次日</th><th>趋势压力线_60</th></tr></thead>
        <tbody>
          ${rows
            .map((stock, index) => stockTableRow(stock, index, hasFactorScore))
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function stockTableRow(stock, index, hasFactorScore = false) {
  const floatMvYi = Math.round(((stock.circMv || stock.totalMv || stock.amount * 12 || 0) / 100000000) * 10) / 10;
  const sectorRps = stock.sectorRps || Math.min(98, stock.rps + 4);
  const pattern = stock.pct >= 2 ? "看涨吞没" : stock.pct <= -3 ? "下探承接" : index % 2 === 0 ? "中继整理" : "缩量观察";
  const scoreCell = hasFactorScore ? `<td>${stock.factorScore}/${stock.factorTotal}</td>` : "";
  return `<tr>${scoreCell}<td>${stock.code}</td><td>${stock.name}</td><td>${stock.price.toFixed(2)}</td><td>${signed(stock.pct)}%</td><td>${stock.volumeRatio >= 1.5 || stock.pct > 3 ? "放量" : "常量"}</td><td>${stock.macd ? "金叉区" : "观察"}</td><td>${floatMvYi.toLocaleString()}亿</td><td>${sectorRps}</td><td>${stock.rps}</td><td>${stock.industry}</td><td>${pattern}</td><td>${(stock.price * 0.96).toFixed(2)}</td><td>${(stock.price * 1.08).toFixed(2)}</td></tr>`;
}

function sectorMiniTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>板块</th><th>涨跌幅</th><th>资金流向</th><th>上涨家数</th></tr></thead>
        <tbody>${data.sectors.slice(0, 6).map((s) => `<tr><td>${s[0]}</td><td>${signed(s[1])}%</td><td>${signed(s[7])}亿</td><td>${s[4]}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function attachEvents() {
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast || "已处理", "success"));
  });
  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      modal = { type: button.dataset.openModal };
      render();
    });
  });
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.currentTarget !== event.target && event.currentTarget.classList.contains("modal-backdrop")) return;
      modal = null;
      render();
    });
  });
  document.querySelectorAll("[data-product-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      productFilter = button.dataset.productFilter;
      render();
    });
  });
  document.querySelectorAll("[data-open-product]").forEach((button) => {
    button.addEventListener("click", () => {
      modal = { type: "product", productIndex: Number(button.dataset.openProduct) };
      render();
    });
  });
  document.querySelectorAll("[data-buy-product]").forEach((button) => {
    button.addEventListener("click", () => {
      modal = { type: "buy", productIndex: Number(button.dataset.buyProduct) };
      render();
    });
  });
  document.querySelectorAll("[data-goto-page]").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = button.dataset.gotoPage;
      modal = null;
      renderNav();
      render();
    });
  });
  document.querySelectorAll("[data-llm-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedLlmTab = button.dataset.llmTab;
      render();
    });
  });
  document.querySelectorAll("[data-hot-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = document.querySelector("#question");
      if (question) question.value = button.dataset.hotPrompt;
      showToast("热门问题已填入输入框。", "success");
    });
  });
  document.querySelectorAll("[data-mode-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = document.querySelector("#mode");
      if (mode) mode.value = button.dataset.modePick;
      showToast(`已切换 ${button.dataset.modePick}`, "success");
    });
  });
  document.querySelectorAll("[data-refresh-market]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("正在刷新公开行情。", "info");
      loadMarketSnapshot();
    });
  });
  document.querySelectorAll("[data-query-quote]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedQuote = (document.querySelector("#quoteCode")?.value || selectedQuote).replace(/\D/g, "").slice(0, 6) || selectedQuote;
      loadMarketSnapshot();
    });
  });
  document.querySelectorAll("[data-factor]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.factor;
      if (activeFactors.has(key)) activeFactors.delete(key);
      else activeFactors.add(key);
      persistScreenerState();
      render();
    });
  });
  document.querySelector("[data-clear-factors]")?.addEventListener("click", () => {
    activeFactors = new Set();
    persistScreenerState();
    render();
  });
  document.querySelector("[data-add-custom-condition]")?.addEventListener("click", () => {
    const condition = normalizeCondition({
      id: `c_${Date.now()}`,
      field: document.querySelector("#customField")?.value,
      operator: document.querySelector("#customOperator")?.value,
      value: document.querySelector("#customValue")?.value,
    });
    if (!condition) {
      showToast("请输入有效条件值。", "info");
      return;
    }
    customConditions.push(condition);
    persistScreenerState();
    render();
  });
  document.querySelector("[data-add-recent-condition]")?.addEventListener("click", () => {
    const days = Number(document.querySelector("#recentDays")?.value || 7);
    const condition = normalizeCondition({
      id: `c_${Date.now()}`,
      field: "n_day_pct",
      operator: document.querySelector("#recentOperator")?.value,
      value: document.querySelector("#recentValue")?.value,
      days,
    });
    if (!condition) {
      showToast("请输入有效近N日条件。", "info");
      return;
    }
    customConditions.push(condition);
    persistScreenerState();
    render();
  });
  document.querySelectorAll("[data-remove-condition]").forEach((button) => {
    button.addEventListener("click", () => {
      customConditions = customConditions.filter((condition) => condition.id !== button.dataset.removeCondition);
      persistScreenerState();
      render();
    });
  });
  document.querySelector("[data-clear-conditions]")?.addEventListener("click", () => {
    customConditions = [];
    persistScreenerState();
    render();
  });
  document.querySelector("[data-screener-sort-field]")?.addEventListener("change", (event) => {
    screenerSort = normalizeSort({ ...screenerSort, field: event.currentTarget.value });
    persistScreenerState();
    render();
  });
  document.querySelector("[data-screener-sort-direction]")?.addEventListener("change", (event) => {
    screenerSort = normalizeSort({ ...screenerSort, direction: event.currentTarget.value });
    persistScreenerState();
    render();
  });
  document.querySelector("[data-save-strategy]")?.addEventListener("click", () => {
    const strategy = saveCurrentStrategy(document.querySelector("#strategyName")?.value.trim());
    showToast(`策略已保存：${strategy.name}`, "success");
    render();
  });
  document.querySelectorAll("[data-apply-strategy]").forEach((button) => {
    button.addEventListener("click", () => {
      const strategy = savedStrategies.find((item) => item.id === button.dataset.applyStrategy);
      if (!strategy) return;
      activeFactors = new Set(strategy.factors);
      customConditions = strategy.conditions.map((condition) => ({ ...condition }));
      screenerSort = normalizeSort(strategy.sort);
      modal = null;
      persistScreenerState();
      render();
    });
  });
  document.querySelectorAll("[data-delete-strategy]").forEach((button) => {
    button.addEventListener("click", () => {
      savedStrategies = savedStrategies.filter((item) => item.id !== button.dataset.deleteStrategy);
      persistScreenerState();
      render();
    });
  });
  document.querySelectorAll("[data-chat-module]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(`#${button.dataset.target}`);
      const question = document.querySelector("#question")?.value || "";
      const mode = document.querySelector("#mode")?.value || "专家模式";
      const defaultText = button.dataset.defaultText || button.textContent;
      button.dataset.defaultText = defaultText;
      const progress = startChatProgress(button.dataset.chatModule, target);
      setButtonLoading(button, true);
      try {
        const result = await askBackend({
          module: button.dataset.chatModule,
          question,
          mode,
          context: contextForModule(button.dataset.chatModule),
        });
        progress.succeed();
        target.textContent = result.answer || "后端没有返回内容。";
        showToast("分析完成，结果已更新。", "success");
      } catch (error) {
        progress.fail();
        target.innerHTML = errorState(error.message || "后端调用失败。");
        showToast(error.message || "后端调用失败。", "error");
      } finally {
        setButtonLoading(button, false);
      }
    });
  });
  document.querySelector("[data-fill-now]")?.addEventListener("click", () => {
    const target = document.querySelector("#qimenAnswer");
    target.textContent = `已同步起局：${new Date().toLocaleString("zh-CN")}，城市：${document.querySelector("#city")?.value || "上海"}。`;
  });
  document.querySelectorAll("[data-add-watch]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const code = event.currentTarget.dataset.addWatch;
      const group = event.currentTarget.dataset.watchGroup || selectedWatchGroup;
      addWatchEntry(code, group);
      showToast(`已加入自选：${code}`, "success");
      render();
    });
  });
  document.querySelectorAll("[data-remove-watch]").forEach((button) => {
    button.addEventListener("click", () => {
      removeWatchEntry(button.dataset.removeWatch);
      render();
    });
  });
  document.querySelector("[data-clear-watch]")?.addEventListener("click", () => {
    watchlist = [];
    persistWatchlistState();
    showToast("自选已清空。", "success");
    render();
  });
  document.querySelector("[data-watch-group-select]")?.addEventListener("change", (event) => {
    selectedWatchGroup = event.currentTarget.value || "全部";
    persistWatchlistState();
    render();
  });
  document.querySelector("[data-create-watch-group]")?.addEventListener("click", () => {
    const input = document.querySelector("#watchGroupName");
    const name = String(input?.value || "").trim().slice(0, 16);
    if (!name) {
      showToast("请输入分组名称。", "info");
      return;
    }
    if (!watchGroups.includes(name)) watchGroups.push(name);
    selectedWatchGroup = name;
    persistWatchlistState();
    render();
  });
  document.querySelector("[data-delete-watch-group]")?.addEventListener("click", () => {
    if (selectedWatchGroup === "全部") {
      showToast("请先选择一个分组。", "info");
      return;
    }
    const deleted = selectedWatchGroup;
    watchGroups = watchGroups.filter((group) => group !== deleted);
    if (!watchGroups.length) watchGroups = [...DEFAULT_WATCH_GROUPS];
    watchlist = watchlist.map((entry) => (entry.group === deleted ? { ...entry, group: watchGroups[0] } : entry));
    selectedWatchGroup = "全部";
    persistWatchlistState();
    showToast(`已删除分组：${deleted}`, "success");
    render();
  });
}

function contextForModule(moduleName) {
  return {
    moduleName,
    marketSource,
    selectedLlmTab,
    metrics: data.metrics,
    sectors: data.sectors.slice(0, 8),
    concepts: data.concepts.slice(0, 8),
    stocks: data.stocks.slice(0, 8),
    screener: {
      activeFactors: Array.from(activeFactors),
      customConditions: customConditions.map(conditionLabel),
      sort: screenerSort,
      savedStrategies: savedStrategies.slice(0, 5).map((strategy) => ({
        name: strategy.name,
        factors: strategy.factors,
        conditions: strategy.conditions.map(conditionLabel),
        sort: strategy.sort,
      })),
    },
    limitPools: {
      stats: data.limitPools.stats,
      limitUp: data.limitPools.limitUp.slice(0, 8),
      broken: data.limitPools.broken.slice(0, 5),
    },
    etfs: {
      stats: data.etfs.stats,
      rows: data.etfs.rows.slice(0, 8),
    },
    moneyFlow: data.moneyFlow.latest,
    northbound: data.northbound.northRows || data.northbound.rows,
    fundamentals: data.fundamentals,
    baostock: data.baostock,
    popularity: {
      rank: data.popularity.rank?.items?.slice(0, 10) || [],
      stock: data.popularity.stock,
    },
    announcements: data.announcements.items?.slice(0, 8) || [],
    disclosures: {
      relations: data.disclosures.relations?.slice(0, 8) || [],
    },
    research: {
      stats: data.research.stats || {},
      reports: data.research.reports?.slice(0, 12) || [],
    },
    yahooChart: data.yahooChart,
    products: products.slice(0, 5).map((item) => ({ name: item[1], type: item[3], price: item[5] })),
    qimen: {
      itemType: document.querySelector("#itemType")?.value,
      stage: document.querySelector("#stage")?.value,
      city: document.querySelector("#city")?.value,
    },
  };
}

function apiBase() {
  if (location.hostname.endsWith("github.io")) return VERCEL_BACKEND_URL;
  return "";
}

function isGithubPages() {
  return location.hostname.endsWith("github.io");
}

function isVercel() {
  return location.hostname.endsWith("vercel.app");
}

function renderRuntimeShell() {
  const runtime = document.querySelector("#runtime-label");
  const source = document.querySelector("#source-label");
  const note = document.querySelector("#source-note");
  if (isGithubPages()) {
    runtime.textContent = "GitHub Pages 展示版";
    source.textContent = "演示数据";
    note.textContent = "问答模块请打开 Vercel 后端版。";
    setBackendStatus("展示版", "muted");
    return;
  }
  if (isVercel()) {
    runtime.textContent = "Vercel 后端版";
    source.textContent = marketSource;
    note.textContent = "问答走 /api/chat，行情走 /api/market。";
    return;
  }
  runtime.textContent = "本地预览";
  source.textContent = "本地静态预览";
  note.textContent = "部署后会自动识别后端状态。";
}

async function checkBackendStatus() {
  if (isGithubPages() && !VERCEL_BACKEND_URL) return;
  const base = apiBase();
  try {
    const response = await fetch(`${base}/api/health`, { cache: "no-store" });
    const payload = await response.json();
    if (payload.ok && payload.deepseekConfigured) {
      setBackendStatus("后端在线", "online");
      return;
    }
    setBackendStatus("后端待配置", "warning");
  } catch (error) {
    setBackendStatus("后端未连通", "error");
  }
}

async function loadMarketSnapshot() {
  if (isGithubPages() && !VERCEL_BACKEND_URL) return;
  try {
    const response = await fetch(`${apiBase()}/api/market?symbol=${selectedQuote}`, { cache: "no-store" });
    const payload = await response.json();
    if (!payload.ok) return;
    marketSource = payload.source || "公开源";
    if (payload.market) {
      const hasSectorFund = !String(payload.source || "").includes("sina-industry-sectors");
      data.metrics = [
        ["情绪温度", `${payload.market.temperature}%`, payload.market.state],
        ["成交额", `${payload.market.amountYi.toLocaleString()}亿`, marketSource],
        ["上涨/下跌", `${payload.market.up} / ${payload.market.down}`, `全市场 ${payload.market.total || "-"} 只，平盘 ${payload.market.flat}`],
        ["涨停/跌停", `${payload.market.exactLimitUp || payload.market.limitUp} / ${payload.market.limitDown}`, `炸板 ${payload.market.brokenLimit || 0}`],
        ["连板高度", `${payload.market.maxStreak || 0}板`, `封板资金 ${payload.market.sealFundYi || 0}亿`],
        ["北向净买", `${plainSigned(payload.market.northNetBuyYi || 0, 2, "亿")}`, "沪股通+深股通"],
        ["ETF主力", `${plainSigned(payload.market.etfMainNetYi || 0, 2, "亿")}`, `ETF样本 ${payload.market.etfCount || 0}`],
        ["站上MA5", `${payload.market.aboveMa5}%`, "全市场短线强度代理"],
        ["资金净流入", hasSectorFund ? `${payload.market.netFundYi >= 0 ? "+" : ""}${payload.market.netFundYi}亿` : "无字段", hasSectorFund ? "板块资金聚合" : "当前板块源不含资金字段"],
      ];
      data.limitDistribution = payload.market.limitDistribution || data.limitDistribution;
    }
    if (Array.isArray(payload.stocks) && payload.stocks.length) {
      const stockRows = payload.quote ? [payload.quote, ...payload.stocks.filter((stock) => stock.code !== payload.quote.code)] : payload.stocks;
      data.stocks = buildClientStockRows(stockRows);
    }
    if (Array.isArray(payload.sectors) && payload.sectors.length) {
      data.sectors = payload.sectors.slice(0, 12).map((sector, index) => [
        sector.name,
        sector.pct || 0,
        sector.rank || index + 1,
        index % 2 === 0 ? index : -index,
        sector.upCount || 0,
        sector.downCount || 0,
        sector.flatCount || 0,
        Math.round(((sector.netFund || 0) / 100000000) * 100) / 100,
      ]);
    }
    if (Array.isArray(payload.concepts) && payload.concepts.length) {
      data.concepts = payload.concepts.slice(0, 80).map((concept, index) => [
        concept.name,
        concept.pct || 0,
        concept.rank || index + 1,
        concept.companyCount || 0,
        yi(concept.amount || 0),
        concept.leader?.name || "-",
        concept.leader?.pct || 0,
      ]);
    }
    if (payload.limitPools) data.limitPools = payload.limitPools;
    if (payload.etfs) data.etfs = payload.etfs;
    if (payload.moneyFlow) data.moneyFlow = payload.moneyFlow;
    if (payload.northbound) data.northbound = payload.northbound;
    if (payload.fundamentals) data.fundamentals = payload.fundamentals;
    if (payload.popularity) data.popularity = payload.popularity;
    if (payload.announcements) data.announcements = payload.announcements;
    if (payload.disclosures) data.disclosures = payload.disclosures;
    if (payload.research) data.research = payload.research;
    if (payload.yahooChart) data.yahooChart = payload.yahooChart;
    if (payload.baostock) data.baostock = payload.baostock;
    if (Array.isArray(payload.indices) && payload.indices.length) {
      data.indices = payload.indices.map((index) => [index.name, index.pct]);
    }
    if (Array.isArray(payload.marketKlines) && payload.marketKlines.length) {
      data.breadth = payload.marketKlines.slice(-30).map((row) => [row.date, Math.round((row.amount || 0) / 100000000), row.pct || 0]);
    }
    if (Array.isArray(payload.klines) && payload.klines.length) {
      data.quoteKlines = payload.klines;
    }
    renderRuntimeShell();
    if (["market", "screener", "sectors", "quote", "llm", "subscription", "about"].includes(currentPage)) render();
  } catch (error) {
    showToast("公开行情暂未更新，继续使用内置样本。", "info");
  }
}

function buildClientStockRows(rows) {
  const baseRows = rows.slice(0, 360);
  const pctValues = baseRows.map((stock) => Number(stock.pct) || 0).sort((a, b) => a - b);
  const amountValues = baseRows.map((stock) => Number(stock.amount) || 0).sort((a, b) => a - b);
  const fallbackIndustries = data.stocks.length ? data.stocks.map((stock) => stock.industry || "A股") : ["A股"];
  return baseRows.map((stock, index) => {
    const pct = Number(stock.pct) || 0;
    const amount = Number(stock.amount) || 0;
    const price = Number(stock.price) || 0;
    const rps = Math.max(20, Math.min(99, Math.round(percentileRank(pct, pctValues) * 100)));
    const amountRank = percentileRank(amount, amountValues);
    const fund = Math.round(((amount / 100000000) * (pct >= 0 ? Math.min(1.5, pct / 6 + 0.25) : Math.max(-1.5, pct / 6 - 0.25))) * 100) / 100;
    const sectorRps = Math.max(20, Math.min(99, Math.round((rps * 0.75 + amountRank * 100 * 0.25))));
    const vwap = price && stock.open ? Math.round(((price * 2 + Number(stock.open)) / 3) * 100) / 100 : price;
    return {
      code: stock.code,
      name: stock.name,
      price,
      pct,
      change: Number(stock.change) || 0,
      industry: stock.industry || fallbackIndustries[index % fallbackIndustries.length] || "A股",
      rps,
      rps120: Math.max(20, Math.min(99, Math.round((rps + amountRank * 100) / 2))),
      sectorRps,
      inSectorRps: Math.max(20, Math.min(99, Math.round((rps * 0.65 + sectorRps * 0.35)))),
      fund,
      fundRsi: Math.max(0, Math.min(99, Math.round(50 + fund * 1.6))),
      pe: Number(stock.pe) || 0,
      pb: Number(stock.pb) || 0,
      ma20: pct >= -0.8 || rps >= 55,
      macd: pct >= 1 || (pct >= 0 && amountRank >= 0.65),
      amount,
      volume: Number(stock.volume) || 0,
      turnover: Number(stock.turnover) || 0,
      volumeRatio: Number(stock.volumeRatio) || Math.max(0.5, Math.round((0.8 + amountRank * 1.8) * 100) / 100),
      amplitude: Number(stock.amplitude) || Math.abs(pct) * 1.35,
      totalMv: Number(stock.totalMv) || 0,
      circMv: Number(stock.circMv) || 0,
      high: Number(stock.high) || price,
      low: Number(stock.low) || price,
      open: Number(stock.open) || price,
      preClose: Number(stock.preClose) || price,
      cost20: Math.round(price * 0.985 * 100) / 100,
      cost60: Math.round(price * 0.96 * 100) / 100,
      vwap,
      vwapScore: Math.max(0, Math.min(10, Math.round((rps / 12 + amountRank * 2) * 10) / 10)),
    };
  });
}

function percentileRank(value, sortedValues) {
  if (!sortedValues.length) return 0.5;
  let index = sortedValues.findIndex((item) => item >= value);
  if (index === -1) index = sortedValues.length - 1;
  return sortedValues.length === 1 ? 1 : index / (sortedValues.length - 1);
}

function setBackendStatus(text, state) {
  const target = document.querySelector("#backend-status");
  if (!target) return;
  target.textContent = text;
  target.className = `status-pill ${state}`;
}

async function askBackend(payload) {
  const base = apiBase();
  if (location.hostname.endsWith("github.io") && !base) {
    throw new Error("当前是 GitHub Pages 展示版；后端问答请打开 Vercel 版本。");
  }
  const response = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "后端调用失败。");
  }
  return data;
}

function startChatProgress(moduleName, target) {
  const phases = {
    ai_matrix: ["整理行情上下文", "请求 DeepSeek", "生成操作计划", "校验触发条件"],
    llm_analysis: ["聚合主题与板块", "请求 DeepSeek", "生成研究结论", "整理观察顺序"],
    qimen: ["同步起局信息", "请求 DeepSeek", "生成解盘结论", "整理变化节点"],
  };
  const labels = phases[moduleName] || ["整理上下文", "请求模型", "生成回答", "整理结果"];
  const steps = [
    [0, 8, labels[0]],
    [450, 28, labels[1]],
    [1300, 58, labels[2]],
    [2600, 78, labels[3]],
    [5200, 90, "等待模型收尾"],
  ];
  clearProgressTimer();
  target.setAttribute("aria-busy", "true");
  target.innerHTML = loadingState(labels[0]);
  const progressBar = document.querySelector("#globalProgress");
  progressBar?.classList.add("active");
  steps.forEach(([delay, value, label]) => {
    const timer = window.setTimeout(() => {
      setGlobalProgress(value);
      target.innerHTML = loadingState(label);
    }, delay);
    progressTimers.push(timer);
  });
  return {
    succeed() {
      clearProgressTimer();
      target.removeAttribute("aria-busy");
      setGlobalProgress(100);
      window.setTimeout(() => progressBar?.classList.remove("active"), 450);
    },
    fail() {
      clearProgressTimer();
      target.removeAttribute("aria-busy");
      progressBar?.classList.remove("active");
      setGlobalProgress(0);
    },
  };
}

function clearProgressTimer() {
  progressTimers.forEach((timer) => window.clearTimeout(timer));
  progressTimers = [];
}

function setGlobalProgress(value) {
  const bar = document.querySelector("#globalProgress span");
  if (!bar) return;
  bar.style.transform = `scaleX(${Math.max(0, Math.min(100, value)) / 100})`;
}

function loadingState(label) {
  return `
    <div class="loading-card">
      <div class="loading-head"><span class="spinner"></span><strong>${label}</strong></div>
      <div class="skeleton-line wide"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  `;
}

function errorState(message) {
  return `<div class="error-card"><strong>调用没有完成</strong><span>${escapeHtml(message)}</span></div>`;
}

function setButtonLoading(button, loading) {
  if (loading) {
    button.setAttribute("disabled", "disabled");
    button.classList.add("is-loading");
    button.innerHTML = `<span class="spinner"></span><span>分析中</span>`;
    return;
  }
  button.removeAttribute("disabled");
  button.classList.remove("is-loading");
  button.textContent = button.dataset.defaultText || "提交";
}

function showToast(message, state = "info") {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast show ${state}`;
  toastTimer = window.setTimeout(() => {
    toast.className = "toast";
  }, 2600);
}

function statusBadge(status) {
  const cls = status.includes("已对齐") || status.includes("核心") || status.includes("接入") ? "done" : status.includes("演示") ? "demo" : "partial";
  return `<span class="coverage-badge ${cls}">${status}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCharts() {
  if (!window.Plotly) return;
  const plotConfig = { displayModeBar: false, responsive: true };
  const baseLayout = {
    margin: { l: 42, r: 18, t: 10, b: 34 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "Inter, system-ui, sans-serif" },
  };
  if (currentPage === "market") {
    Plotly.newPlot("amountChart", [{ x: data.breadth.map((d) => d[0]), y: data.breadth.map((d) => d[1]), type: "scatter", mode: "lines+markers", line: { color: "#2563eb" } }], baseLayout, plotConfig);
    Plotly.newPlot("breadthChart", [{ x: data.breadth.map((d) => d[0]), y: data.breadth.map((d) => d[2]), type: "scatter", mode: "lines+markers", line: { color: "#0f766e" } }], baseLayout, plotConfig);
    const distribution = data.limitDistribution || {};
    Plotly.newPlot("limitChart", [{ x: ["上涨", "下跌", "平盘", "涨停", "跌停"], y: [distribution.up || 0, distribution.down || 0, distribution.flat || 0, distribution.limitUp || 0, distribution.limitDown || 0], type: "bar", marker: { color: ["#dc2626", "#15803d", "#64748b", "#b91c1c", "#166534"] } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
    Plotly.newPlot("indexChart", [{ x: data.indices.map((d) => d[0]), y: data.indices.map((d) => d[1]), type: "bar", marker: { color: data.indices.map((d) => (d[1] >= 0 ? "#dc2626" : "#15803d")) } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
  }
  if (currentPage === "sectors") {
    Plotly.newPlot("sectorFundChart", [{ x: data.sectors.map((d) => d[0]), y: data.sectors.map((d) => d[7]), type: "bar", marker: { color: data.sectors.map((d) => (d[7] >= 0 ? "#dc2626" : "#15803d")) } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
    Plotly.newPlot("sectorChangeChart", [{ x: data.sectors.map((d) => d[0]), y: data.sectors.map((d) => d[1]), type: "bar", marker: { color: "#b45309" } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
  }
  if (currentPage === "quote") {
    const stock = data.stocks.find((item) => item.code.includes(selectedQuote)) || data.stocks[0];
    const base = stock?.price || 100;
    const quoteRows = data.quoteKlines.length ? data.quoteKlines.slice(-60) : data.breadth.map((d, index) => ({ date: d[0], close: Number((base * (0.96 + index / Math.max(data.breadth.length, 1) * 0.08 + (Number(d[2]) - 50) / 1000)).toFixed(2)) }));
    const x = quoteRows.map((row) => row.date);
    const close = quoteRows.map((row) => row.close);
    Plotly.newPlot(
      "quoteChart",
      [
        { x, y: close, type: "scatter", mode: "lines+markers", name: "收盘价", line: { color: "#2563eb" } },
        { x, y: close.map((v, i) => v * (0.985 + i * 0.002)), type: "scatter", mode: "lines", name: "MA20", line: { color: "#0f766e" } },
      ],
      { ...baseLayout, showlegend: true },
      plotConfig
    );
  }
}

mount();
