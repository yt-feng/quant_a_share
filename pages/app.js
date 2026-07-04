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
  minuteKlines: [],
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

const DEFAULT_WALLET_LEDGER = [
  ["2026-07-03 21:48:38", "退款", 16.5, 86.5, 0, "AI决策矩阵 V2 结算退回剩余冻结"],
  ["2026-07-03 21:48:38", "消费", -13.5, 70, 16.5, "AI决策矩阵 V2 结算"],
  ["2026-07-03 21:48:05", "冻结", -30, 70, 30, "AI决策矩阵 V2 冻结预算"],
  ["2026-07-03 21:42:54", "赠送", 100, 100, 0, "钱包初始化赠送点数"],
];
const QIMEN_STORAGE_KEY = "quant_a_share_qimen";
let walletLedger = [...DEFAULT_WALLET_LEDGER];
let qimenTasks = [];
let qimenLastSync = null;
let selectedQimenTaskId = "";

const products = [
  ["sub", "账号订阅 一个月", "推荐", "订阅套餐", "订阅一个月", 88, "月度订阅", "账号开通 1 个月"],
  ["sub", "账号订阅 半年", "热销", "订阅套餐", "订阅半年期", 368, "半年订阅", "账号开通 6 个月"],
  ["sub", "账号订阅 一年", "年度", "订阅套餐", "订阅一年期", 688, "年度订阅", "人工优先开通 12 个月"],
  ["points", "点数 100点", "新手推荐", "点数包", "钱包点数充值 100 点", 10, "100 点", "账号直充 永久有效"],
  ["points", "点数 200点", "常用", "点数包", "钱包点数充值 200 点", 20, "200 点", "账号直充 永久有效"],
  ["points", "点数 300点", "热卖", "点数包", "钱包点数充值 300 点", 30, "300 点", "账号直充 永久有效"],
  ["points", "点数 500点", "性价比", "点数包", "钱包点数充值 500 点", 50, "500 点", "账号直充 永久有效"],
  ["points", "点数 1000点", "推荐", "点数包", "钱包点数充值 1000 点", 100, "1000 点", "账号直充 永久有效"],
  ["points", "点数 2500点", "大额", "点数包", "钱包点数充值 2500 点", 200, "2500 点", "账号直充 永久有效"],
  ["points", "点数 7000点", "旗舰", "点数包", "钱包点数充值 7000 点", 500, "7000 点", "人工优先开通 永久有效"],
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
  ["大盘情绪", "已对齐", "日期范围、情绪状态、复盘统计入口、情绪指标、指数与涨跌分布、涨停池、北向资金、ETF资金、人气榜；日期区间会联动趋势图和复盘统计。"],
  ["量化因子选股", "已对齐", "估值、市值、量价、RPS、均线、技术、资金、VWAP、结构、缠论、江恩、TD、自定义条件、近N日条件、策略保存/应用、单因子命中数和相似候选；严格组合为空时仍展示最接近候选。"],
  ["行业/概念", "已对齐", "板块/概念切换、日期、预设筛选、排序、范围、柱状图/饼图、指标卡和明细表；筛选条件会实时影响表格与图表。"],
  ["行情", "已对齐", "股票查询、日期、复权、近半年/近一年、加载更多历史、东财1分钟分时、日K/BaoStock/Yahoo切换、画图记录、指标参数、个股资金流、财务快照、人气和双源公告。"],
  ["自选", "已对齐", "分组创建/删除、分组筛选、自选表、操作列和浏览器持久化。"],
  ["LLM分析", "已对齐", "主题热点、选股池、板块全景看板、个股评估矩阵、产业链研报分析五个 tab；主题类型、关键词、来源、策略、排序、列集、页大小和翻页会联动表格并进入问答上下文。"],
  ["奇门遁甲", "已对齐", "钱包账单、任务列表、起局表单、历法类型、输出偏好、解盘档位、同步起局扣点、本地持久化任务、DeepSeek 增强解盘。"],
  ["AI决策矩阵", "已对齐", "新对话、钱包入口、实时搜索、三种模式、Q1-Q12 热门问题、DeepSeek 后端问答、最近对话记录和多源行情上下文。"],
  ["订阅账号与点数", "已对齐", "账号状态、余额/冻结、商品筛选、10 个商品、商品说明、购买确认、扫码/订单状态、订单核验、标记开通、7000点旗舰包和钱包账单。"],
];

const dataSourceRows = [
  ["东方财富", "核心接入", "A股行情、指数、行业/概念板块、涨停池、炸板池、强势股、ETF、个股资金流、北向资金、人气榜、公告、单股行情与K线。"],
  ["Sina", "核心接入", "全A兜底、行业/概念二源兜底、财报字段兜底，补齐东财列表偶发为空时的股票池。"],
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
let marketStartDate = "2026-07-01";
let marketEndDate = "2026-07-04";
let marketStateFilter = "震荡行情";
let marketReviewUpdatedAt = "";
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
let selectedTopicName = "";
let llmTopicType = "industry";
let llmTopicQuery = "";
let llmPoolControls = { query: "", source: "all", stage: "all", themeType: "all", sort: "attention", pageSize: 50, page: 1 };
let llmSectorControls = { query: "", sort: "fund3", direction: "desc", columns: "all", pageSize: 50, page: 1 };
let llmStockControls = { query: "", sort: "pct5", direction: "desc", columns: "all", pageSize: 50, page: 1 };
let productFilter = "all";
let sectorDataset = "sectors";
let sectorPreset = "all";
let sectorSort = { field: "pct", direction: "desc" };
let sectorRange = { min: "", max: "" };
let sectorChartType = "bar";
let sidebarCollapsed = false;
let shellTheme = "light";
let shellEventsAttached = false;
let subscriptionOrders = [];
let modal = null;
let marketSource = "演示数据";
let selectedQuote = "600519";
let quoteChartMode = "minute";
let quoteStartDate = "2026-01-05";
let quoteEndDate = "2026-07-04";
let quoteAdjust = "qfq";
let quoteHistoryLimit = 120;
let quoteIndicator1 = "VOL";
let quoteIndicator2 = "MACD";
let quoteVolParams = { m1: 5, m2: 10 };
let quoteMacdParams = { short: 12, long: 26, mid: 9 };
let quoteDrawings = [];
let aiRealtime = true;
let aiMode = "快速模式";
let aiQuestion = "结合实时行情，分析宁德时代现在能不能买，按短线3-5天思路给我操作计划。";
let aiHistory = [];
let aiCurrentAnswer = "";

function mount() {
  loadShellState();
  loadMarketState();
  loadScreenerState();
  loadWatchlistState();
  loadQuoteState();
  loadLlmState();
  loadAiState();
  loadQimenState();
  loadSubscriptionState();
  applyShellState();
  attachShellEvents();
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

function loadShellState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_shell") || "null");
    sidebarCollapsed = Boolean(stored?.sidebarCollapsed);
    shellTheme = stored?.theme === "dark" ? "dark" : "light";
  } catch (error) {
    sidebarCollapsed = false;
    shellTheme = "light";
  }
}

function persistShellState() {
  try {
    localStorage.setItem(
      "quant_a_share_shell",
      JSON.stringify({
        sidebarCollapsed,
        theme: shellTheme,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("界面设置已更新，浏览器存储暂不可用。", "info");
  }
}

function applyShellState() {
  document.body.classList.toggle("sidebar-collapsed", sidebarCollapsed);
  document.body.classList.toggle("theme-dark", shellTheme === "dark");
  const sidebarButton = document.querySelector("[data-toggle-sidebar]");
  if (sidebarButton) sidebarButton.textContent = sidebarCollapsed ? "展开侧栏" : "收起侧栏";
  const themeButton = document.querySelector("[data-toggle-theme]");
  if (themeButton) themeButton.textContent = shellTheme === "dark" ? "浅色" : "深色";
}

function attachShellEvents() {
  if (shellEventsAttached) return;
  shellEventsAttached = true;
  document.querySelector("[data-toggle-sidebar]")?.addEventListener("click", () => {
    sidebarCollapsed = !sidebarCollapsed;
    applyShellState();
    persistShellState();
  });
  document.querySelector("[data-toggle-theme]")?.addEventListener("click", () => {
    shellTheme = shellTheme === "dark" ? "light" : "dark";
    applyShellState();
    persistShellState();
  });
  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    showToast("已退出当前演示会话。", "success");
  });
  document.querySelectorAll("[data-shell-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = "ai";
      renderNav();
      render();
      const question = document.querySelector("#question");
      if (question) question.value = button.dataset.shellPrompt;
      showToast("最近问题已填入 AI 决策矩阵。", "success");
    });
  });
}

function loadMarketState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_market") || "null");
    if (!stored) return;
    marketStartDate = normalizeDateValue(stored.startDate) || marketStartDate;
    marketEndDate = normalizeDateValue(stored.endDate) || marketEndDate;
    if (["震荡行情", "强势行情", "弱势整理"].includes(stored.stateFilter)) marketStateFilter = stored.stateFilter;
    marketReviewUpdatedAt = stored.updatedAt || "";
  } catch (error) {
    // Bad local storage should not block market overview.
  }
}

function persistMarketState() {
  try {
    localStorage.setItem(
      "quant_a_share_market",
      JSON.stringify({
        startDate: marketStartDate,
        endDate: marketEndDate,
        stateFilter: marketStateFilter,
        updatedAt: marketReviewUpdatedAt || new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("大盘复盘条件已更新，浏览器存储暂不可用。", "info");
  }
}

function renderMarket() {
  const review = marketReviewStats();
  const rows = filteredMarketBreadth();
  return `
    <section class="panel compact-panel">
      <div class="toolbar">
        <label><span class="label">开始日期</span><input id="marketStartDate" type="date" value="${escapeHtml(marketStartDate)}" /></label>
        <label><span class="label">结束日期</span><input id="marketEndDate" type="date" value="${escapeHtml(marketEndDate)}" /></label>
        <label><span class="label">行情状态</span><select id="marketStateFilter"><option ${selectedAttr(marketStateFilter === "震荡行情")}>震荡行情</option><option ${selectedAttr(marketStateFilter === "强势行情")}>强势行情</option><option ${selectedAttr(marketStateFilter === "弱势整理")}>弱势整理</option></select></label>
        <button class="primary-button" data-load-market-review="1">加载复盘数据统计</button>
        ${tag(`数据源 ${marketSource}`, "info")}
      </div>
    </section>
    <section class="grid metrics" style="margin-top:14px">
      ${data.metrics.map((m) => metric(...m)).join("")}
      ${metric("复盘天数", `${rows.length} 天`, marketStateFilter)}
      ${metric("区间均额", `${review.avgAmountYi.toLocaleString()}亿`, `${marketStartDate} 至 ${marketEndDate}`)}
      ${metric("区间均涨跌", `${plainSigned(review.avgPct, 2, "%")}`, marketReviewUpdatedAt ? `更新 ${marketReviewUpdatedAt.slice(0, 10)}` : "待加载")}
    </section>
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
      ${simpleTable(["维度", "当前值", "说明"], [...data.metrics.map((m) => [m[0], m[1], m[2]]), ["复盘区间", `${marketStartDate} 至 ${marketEndDate}`, `${rows.length} 个交易样本`], ["区间成交额", `${review.avgAmountYi.toLocaleString()}亿`, "按当前图表样本均值"], ["区间涨跌", `${plainSigned(review.avgPct, 2, "%")}`, marketStateFilter]])}
    </section>
  `;
}

function filteredMarketBreadth() {
  const start = normalizeDateValue(marketStartDate);
  const end = normalizeDateValue(marketEndDate);
  const rows = data.breadth.filter((row) => {
    const date = normalizeDateValue(row[0]);
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  });
  return rows.length ? rows : data.breadth;
}

function marketReviewStats() {
  const rows = filteredMarketBreadth();
  const avgAmountYi = Math.round((rows.reduce((sum, row) => sum + (Number(row[1]) || 0), 0) / Math.max(rows.length, 1)) * 100) / 100;
  const avgPct = Math.round((rows.reduce((sum, row) => sum + (Number(row[2]) || 0), 0) / Math.max(rows.length, 1)) * 100) / 100;
  return { avgAmountYi, avgPct };
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
  const rows = activeSectorRows();
  const totalUp = rows.reduce((sum, row) => sum + Number(row.up || 0), 0);
  const totalDown = rows.reduce((sum, row) => sum + Number(row.down || 0), 0);
  const totalFund = rows.reduce((sum, row) => sum + Number(row.fund || 0), 0);
  const hasSectorFund = !marketSource.includes("sina-industry-sectors");
  const avgPct = rows.reduce((sum, row) => sum + Number(row.pct || 0), 0) / Math.max(rows.length, 1);
  const sourceCount = sectorDataset === "concepts" ? data.concepts.length : data.sectors.length;
  return `
    <section class="panel compact-panel">
      <div class="toolbar">
        <label class="segmented"><input type="radio" name="sectorDataset" data-sector-dataset="sectors" ${sectorDataset === "sectors" ? "checked" : ""} />板块数据</label>
        <label class="segmented"><input type="radio" name="sectorDataset" data-sector-dataset="concepts" ${sectorDataset === "concepts" ? "checked" : ""} />概念数据</label>
        <label><span class="label">开始日期</span><input value="2026-07-03" /></label>
        <label><span class="label">结束日期</span><input value="2026-07-03" /></label>
        <button class="chip ${sectorPreset === "down" ? "active" : ""}" data-sector-preset="down">下跌(0~-5%)</button>
        <button class="chip ${sectorPreset === "up" ? "active" : ""}" data-sector-preset="up">上涨(0~5%)</button>
        <button class="chip ${sectorPreset === "flat" ? "active" : ""}" data-sector-preset="flat">震荡(-10~10%)</button>
        <button class="primary-button" data-refresh-market="1">刷新数据</button>
        <button class="ghost-button" data-reset-sector-filters="1">重置筛选</button>
      </div>
    </section>
    <section class="grid metrics" style="margin-top:14px">
      ${metric(sectorDataset === "concepts" ? "总概念数" : "总板块数", sourceCount, "公开行情")}
      ${metric("当前筛选", `${rows.length} 条`, sectorPresetLabel())}
      ${metric("平均涨跌幅", `${avgPct.toFixed(2)}%`, "当前筛选")}
      ${metric("总上涨家数", totalUp, "样本聚合")}
      ${metric("总下跌家数", totalDown, "样本聚合")}
      ${metric("总资金流向", hasSectorFund ? `${totalFund >= 0 ? "+" : ""}${totalFund.toFixed(2)}亿` : "无字段", hasSectorFund ? "公开源" : "当前板块源不含资金字段")}
      ${metric("图表模式", sectorChartType === "pie" ? "饼图" : "柱状图", sectorSortLabel())}
    </section>
    <section class="panel compact-panel" style="margin-top:14px">
      <div class="form-grid">
        <label><span class="label">排序字段</span><select data-sector-sort-field><option value="pct" ${selectedAttr(sectorSort.field === "pct")}>涨跌幅</option><option value="fund" ${selectedAttr(sectorSort.field === "fund")}>资金流向</option><option value="rankChange" ${selectedAttr(sectorSort.field === "rankChange")}>排名变化</option><option value="up" ${selectedAttr(sectorSort.field === "up")}>上涨家数</option></select></label>
        <label><span class="label">排序</span><select data-sector-sort-direction><option value="desc" ${selectedAttr(sectorSort.direction === "desc")}>降序</option><option value="asc" ${selectedAttr(sectorSort.direction === "asc")}>升序</option></select></label>
        <label><span class="label">最小值</span><input id="sectorMin" type="number" placeholder="最小值" value="${escapeHtml(sectorRange.min)}" /></label>
        <label><span class="label">最大值</span><input id="sectorMax" type="number" placeholder="最大值" value="${escapeHtml(sectorRange.max)}" /></label>
        <button class="ghost-button align-end" data-apply-sector-range="1">应用范围</button>
        <label class="segmented"><input type="radio" name="sectorChartType" data-sector-chart-type="bar" ${sectorChartType === "bar" ? "checked" : ""} />柱状图</label>
        <label class="segmented"><input type="radio" name="sectorChartType" data-sector-chart-type="pie" ${sectorChartType === "pie" ? "checked" : ""} />饼图</label>
      </div>
    </section>
    <section class="grid two">
      <div class="panel"><h2>资金流向分布</h2><div id="sectorFundChart" class="chart"></div></div>
      <div class="panel"><h2>涨跌幅排名</h2><div id="sectorChangeChart" class="chart"></div></div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>${sectorDataset === "concepts" ? "概念板块数据" : "行业板块数据"}</h2>
      ${sectorBoardTable(rows)}
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
  const quoteRows = activeQuoteRows(stock);
  const chartLabel = quoteChartMode === "minute" ? "分时(1分钟K)" : quoteChartMode === "baostock" ? "BaoStock日K" : quoteChartMode === "yahoo" ? "Yahoo日K" : "东财日K";
  return `
    <section class="panel compact-panel">
      <div class="form-grid">
        <label><span class="label">股票名称</span><input placeholder="如 贵州茅台" value="${stock.name}" /></label>
        <label><span class="label">股票代码</span><input id="quoteCode" placeholder="如 600519" value="${stock.code.slice(0, 6)}" /></label>
        <label><span class="label">开始日期</span><input id="quoteStartDate" type="date" value="${escapeHtml(quoteStartDate)}" /></label>
        <label><span class="label">结束日期</span><input id="quoteEndDate" type="date" value="${escapeHtml(quoteEndDate)}" /></label>
        <label><span class="label">复权</span><select id="quoteAdjust" data-quote-adjust><option value="qfq" ${selectedAttr(quoteAdjust === "qfq")}>前复权(qfq)</option><option value="hfq" ${selectedAttr(quoteAdjust === "hfq")}>后复权(hfq)</option><option value="none" ${selectedAttr(quoteAdjust === "none")}>不复权</option></select></label>
        <button class="ghost-button align-end" data-add-watch="${stock.code}">加自选</button>
        <button class="primary-button align-end" data-query-quote="1">查询</button>
      </div>
      <div class="toolbar" style="margin-top:12px">
        <button class="chip" data-quote-range="half">近半年</button>
        <button class="chip" data-quote-range="year">近一年</button>
        <button class="ghost-button compact-button" data-load-more-history="1">加载更多历史</button>
        <button class="chip ${quoteChartMode === "minute" ? "active" : ""}" data-quote-mode="minute">分时</button>
        <button class="chip ${quoteChartMode === "daily" ? "active" : ""}" data-quote-mode="daily">日K</button>
        <button class="chip ${quoteChartMode === "baostock" ? "active" : ""}" data-quote-mode="baostock">BaoStock</button>
        <button class="chip ${quoteChartMode === "yahoo" ? "active" : ""}" data-quote-mode="yahoo">全球备份</button>
        ${tag(`股票代码：${stock.code.slice(0, 6)} · ${chartLabel} ${quoteRows.length} 条 · ${quoteAdjustLabel()}`, "info")}
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
        ${panelTitle(`${chartLabel} - ${stock.code.slice(0, 6)}`, tag(`${quoteIndicator1} / ${quoteIndicator2}`, "info"))}
        <div id="quoteChart" class="chart"></div>
      </div>
      <div class="panel">
        <h2>画图工具</h2>
        <div class="tool-grid">
          ${["趋势线", "射线", "水平线", "箭头", "FIB", "GANN", "平行线"].map((item) => `<button class="ghost-button icon-tool" title="${item}" data-drawing-tool="${item}">${item}</button>`).join("")}
          <button class="ghost-button icon-tool" title="清除所有画图" data-clear-drawings="1">清除所有画图</button>
          <button class="ghost-button icon-tool" title="放大" data-quote-zoom="in">放大</button>
          <button class="ghost-button icon-tool" title="缩小" data-quote-zoom="out">缩小</button>
          <button class="ghost-button icon-tool" title="重置" data-quote-zoom="reset">重置</button>
        </div>
        <div class="detail-strip" style="margin-top:12px">${quoteDrawings.length ? quoteDrawings.slice(-6).map((item) => tag(`${item.tool} ${item.price}`)).join("") : tag("暂无画图记录")}</div>
        <h2 style="margin-top:16px">技术指标</h2>
        <div class="indicator-row">
          <span>副图1</span><strong>${quoteIndicator1}</strong>
          <button class="ghost-button" data-open-modal="volParams">参数</button>
          <button class="ghost-button" data-open-modal="indicatorPicker" data-indicator-slot="1">换指标</button>
        </div>
        <div class="indicator-row">
          <span>副图2</span><strong>${quoteIndicator2}</strong>
          <button class="ghost-button" data-open-modal="macdParams">参数</button>
          <button class="ghost-button" data-open-modal="indicatorPicker" data-indicator-slot="2">换指标</button>
        </div>
        <button class="primary-button" data-refresh-indicators="1">刷新指标</button>
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

function activeSectorRows() {
  const rows = sectorDataset === "concepts" ? conceptBoardRows() : industryBoardRows();
  const min = sectorRange.min === "" ? Number.NaN : Number(sectorRange.min);
  const max = sectorRange.max === "" ? Number.NaN : Number(sectorRange.max);
  return rows
    .filter((row) => {
      if (sectorPreset === "down" && !(row.pct <= 0 && row.pct >= -5)) return false;
      if (sectorPreset === "up" && !(row.pct >= 0 && row.pct <= 5)) return false;
      if (sectorPreset === "flat" && !(row.pct >= -10 && row.pct <= 10)) return false;
      const value = sectorMetric(row, sectorSort.field);
      if (Number.isFinite(min) && value < min) return false;
      if (Number.isFinite(max) && value > max) return false;
      return true;
    })
    .sort((a, b) => {
      const av = sectorMetric(a, sectorSort.field);
      const bv = sectorMetric(b, sectorSort.field);
      const primary = sectorSort.direction === "asc" ? av - bv : bv - av;
      return primary || a.rank - b.rank;
    });
}

function industryBoardRows() {
  return data.sectors.map((row) => ({
    type: "industry",
    name: row[0],
    pct: Number(row[1]) || 0,
    rank: Number(row[2]) || 0,
    rankChange: Number(row[3]) || 0,
    up: Number(row[4]) || 0,
    down: Number(row[5]) || 0,
    limit: Number(row[6]) || 0,
    fund: Number(row[7]) || 0,
    companies: Number(row[4] || 0) + Number(row[5] || 0) + Number(row[6] || 0),
    leader: "-",
    leaderPct: 0,
  }));
}

function conceptBoardRows() {
  return data.concepts.map((row) => ({
    type: "concept",
    name: row[0],
    pct: Number(row[1]) || 0,
    rank: Number(row[2]) || 0,
    rankChange: 0,
    up: 0,
    down: 0,
    limit: 0,
    fund: Number(row[4]) || 0,
    companies: Number(row[3]) || 0,
    leader: row[5] || "-",
    leaderPct: Number(row[6]) || 0,
  }));
}

function sectorMetric(row, field) {
  if (field === "fund") return Number(row.fund) || 0;
  if (field === "rankChange") return Number(row.rankChange) || 0;
  if (field === "up") return Number(row.up) || 0;
  return Number(row.pct) || 0;
}

function sectorSortLabel() {
  const labels = { pct: "涨跌幅", fund: "资金流向", rankChange: "排名变化", up: "上涨家数" };
  return `${labels[sectorSort.field] || "涨跌幅"} / ${sectorSort.direction === "asc" ? "升序" : "降序"}`;
}

function sectorPresetLabel() {
  const labels = { all: "全部", down: "下跌(0~-5%)", up: "上涨(0~5%)", flat: "震荡(-10~10%)" };
  return labels[sectorPreset] || "全部";
}

function sectorBoardTable(rows) {
  if (!rows.length) return `<div class="empty-state compact-empty"><strong>当前筛选没有数据</strong><span>可以放宽涨跌幅预设或范围条件。</span></div>`;
  if (sectorDataset === "concepts") {
    return simpleTable(
      ["概念", "涨跌幅", "排名", "成分数", "成交额", "领涨股", "领涨幅"],
      rows.slice(0, 120).map((row) => [escapeHtml(row.name), `${signed(row.pct)}%`, row.rank, row.companies, `${row.fund.toLocaleString()}亿`, escapeHtml(row.leader), `${signed(row.leaderPct)}%`])
    );
  }
  return simpleTable(
    ["名称", "涨跌幅", "排名", "排名变化", "上涨家数", "下跌家数", "涨停家数", "资金流向(亿)"],
    rows.slice(0, 120).map((row) => [escapeHtml(row.name), `${signed(row.pct)}%`, row.rank, signed(row.rankChange, 0), row.up, row.down, row.limit, signed(row.fund)])
  );
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

function loadQuoteState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_quote") || "null");
    if (!stored) return;
    if (["minute", "daily", "baostock", "yahoo"].includes(stored.chartMode)) quoteChartMode = stored.chartMode;
    if (stored.startDate) quoteStartDate = normalizeDateValue(stored.startDate) || quoteStartDate;
    if (stored.endDate) quoteEndDate = normalizeDateValue(stored.endDate) || quoteEndDate;
    if (["qfq", "hfq", "none"].includes(stored.adjust)) quoteAdjust = stored.adjust;
    quoteHistoryLimit = clampInt(stored.historyLimit, 60, 600, quoteHistoryLimit);
    if (stored.indicator1) quoteIndicator1 = String(stored.indicator1);
    if (stored.indicator2) quoteIndicator2 = String(stored.indicator2);
    quoteVolParams = {
      m1: clampInt(stored.volParams?.m1, 1, 120, quoteVolParams.m1),
      m2: clampInt(stored.volParams?.m2, 1, 120, quoteVolParams.m2),
    };
    quoteMacdParams = {
      short: clampInt(stored.macdParams?.short, 2, 60, quoteMacdParams.short),
      long: clampInt(stored.macdParams?.long, 3, 120, quoteMacdParams.long),
      mid: clampInt(stored.macdParams?.mid, 2, 60, quoteMacdParams.mid),
    };
    quoteDrawings = Array.isArray(stored.drawings) ? stored.drawings.slice(-20) : [];
  } catch (error) {
    // Bad local storage should not block the quote page.
  }
}

function persistQuoteState() {
  try {
    localStorage.setItem(
      "quant_a_share_quote",
      JSON.stringify({
        chartMode: quoteChartMode,
        startDate: quoteStartDate,
        endDate: quoteEndDate,
        adjust: quoteAdjust,
        historyLimit: quoteHistoryLimit,
        indicator1: quoteIndicator1,
        indicator2: quoteIndicator2,
        volParams: quoteVolParams,
        macdParams: quoteMacdParams,
        drawings: quoteDrawings,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("行情设置已更新，浏览器存储暂不可用。", "info");
  }
}

function loadLlmState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_llm") || "null");
    if (!stored) return;
    if (["industry", "concept", "all"].includes(stored.topicType)) llmTopicType = stored.topicType;
    llmTopicQuery = String(stored.topicQuery || "");
    llmPoolControls = normalizeLlmControls(stored.pool, llmPoolControls, ["attention", "confidence", "pct", "t5"]);
    llmSectorControls = normalizeLlmControls(stored.sector, llmSectorControls, ["fund3", "pct3", "ma20", "crowd", "top100"]);
    llmStockControls = normalizeLlmControls(stored.stock, llmStockControls, ["pct5", "fund5", "floatMv", "pct1", "hotGap"]);
  } catch (error) {
    // Bad local storage should not block LLM analysis.
  }
}

function persistLlmState() {
  try {
    localStorage.setItem(
      "quant_a_share_llm",
      JSON.stringify({
        topicType: llmTopicType,
        topicQuery: llmTopicQuery,
        pool: llmPoolControls,
        sector: llmSectorControls,
        stock: llmStockControls,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("LLM筛选条件已更新，浏览器存储暂不可用。", "info");
  }
}

function normalizeLlmControls(value, fallback, allowedSorts) {
  const next = { ...fallback, ...(value && typeof value === "object" ? value : {}) };
  next.query = String(next.query || "").slice(0, 40);
  next.source = next.source || fallback.source || "all";
  next.stage = next.stage || fallback.stage || "all";
  next.themeType = next.themeType || fallback.themeType || "all";
  next.columns = ["core", "all"].includes(next.columns) ? next.columns : fallback.columns || "all";
  next.sort = allowedSorts.includes(next.sort) ? next.sort : fallback.sort;
  next.direction = next.direction === "asc" ? "asc" : "desc";
  next.pageSize = clampInt(next.pageSize, 10, 100, fallback.pageSize || 50);
  next.page = clampInt(next.page, 1, 999, fallback.page || 1);
  return next;
}

function loadQimenState() {
  try {
    const stored = JSON.parse(localStorage.getItem(QIMEN_STORAGE_KEY) || "null");
    if (!stored) return;
    const ledger = Array.isArray(stored.walletLedger) ? stored.walletLedger.map(normalizeLedgerRow).filter(Boolean) : [];
    walletLedger = ledger.length ? ledger : [...DEFAULT_WALLET_LEDGER];
    qimenTasks = Array.isArray(stored.qimenTasks) ? stored.qimenTasks.map(normalizeQimenTask).filter(Boolean).slice(0, 60) : [];
    qimenLastSync = stored.qimenLastSync?.at ? stored.qimenLastSync : null;
    selectedQimenTaskId = stored.selectedQimenTaskId || qimenTasks[0]?.id || "";
  } catch (error) {
    walletLedger = [...DEFAULT_WALLET_LEDGER];
    qimenTasks = [];
    qimenLastSync = null;
    selectedQimenTaskId = "";
  }
}

function persistQimenState() {
  try {
    localStorage.setItem(
      QIMEN_STORAGE_KEY,
      JSON.stringify({
        walletLedger,
        qimenTasks,
        qimenLastSync,
        selectedQimenTaskId,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("奇门任务已更新，浏览器存储暂不可用。", "info");
  }
}

function normalizeLedgerRow(row) {
  if (!Array.isArray(row) || row.length < 6) return null;
  return [
    String(row[0] || nowLabel()),
    String(row[1] || "记录"),
    roundPoint(row[2]),
    roundPoint(row[3]),
    roundPoint(row[4]),
    String(row[5] || ""),
  ];
}

function normalizeQimenTask(task) {
  if (!task) return null;
  const id = String(task.id || `qm_${Date.now()}_${Math.random().toString(16).slice(2)}`);
  return {
    id,
    submittedAt: String(task.submittedAt || nowLabel()),
    itemType: String(task.itemType || "金融"),
    target: String(task.target || "现在适不适合进场"),
    stage: String(task.stage || "在考虑阶段"),
    calendar: String(task.calendar || "公历"),
    time: String(task.time || qimenDefaultTime()),
    city: String(task.city || "上海"),
    output: String(task.output || "直接结论"),
    mode: String(task.mode || "深入分析（20点）"),
    billing: String(task.billing || "点数"),
    points: roundPoint(task.points || qimenCostFromMode(task.mode)),
    status: String(task.status || "完成"),
    startedAt: String(task.startedAt || task.submittedAt || nowLabel()),
    endedAt: String(task.endedAt || "-"),
    question: String(task.question || ""),
    syncAt: String(task.syncAt || qimenLastSync?.at || ""),
    answer: String(task.answer || ""),
    backendNote: String(task.backendNote || ""),
    localResult: task.localResult && typeof task.localResult === "object" ? task.localResult : null,
  };
}

function nowLabel() {
  return new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
}

function qimenDefaultTime() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function roundPoint(value, digits = 1) {
  const number = Number(value) || 0;
  return Math.round(number * 10 ** digits) / 10 ** digits;
}

function walletSummary() {
  const latest = walletLedger[0] || DEFAULT_WALLET_LEDGER[0];
  const recharge = walletLedger.reduce((sum, row) => {
    const delta = Number(row[2]) || 0;
    return sum + (["赠送", "充值"].includes(row[1]) && delta > 0 ? delta : 0);
  }, 0);
  const spent = walletLedger.reduce((sum, row) => {
    const delta = Number(row[2]) || 0;
    return sum + (row[1] === "消费" && delta < 0 ? Math.abs(delta) : 0);
  }, 0);
  return {
    balance: roundPoint(latest[3]),
    frozen: roundPoint(latest[4]),
    recharge: roundPoint(recharge),
    spent: roundPoint(spent),
  };
}

function appendWalletLedger(type, delta, note, frozenDelta = 0) {
  const summary = walletSummary();
  const nextBalance = roundPoint(Math.max(0, summary.balance + (Number(delta) || 0)));
  const nextFrozen = roundPoint(Math.max(0, summary.frozen + (Number(frozenDelta) || 0)));
  walletLedger = [[nowLabel(), type, roundPoint(delta), nextBalance, nextFrozen, note], ...walletLedger].slice(0, 120);
}

function qimenFormState() {
  return {
    itemType: document.querySelector("#itemType")?.value || "金融",
    target: document.querySelector("#qimenTarget")?.value || "现在适不适合进场",
    stage: document.querySelector("#stage")?.value || "在考虑阶段",
    calendar: document.querySelector("#qimenCalendar")?.value || "公历",
    time: document.querySelector("#qimenTime")?.value || qimenDefaultTime(),
    city: document.querySelector("#city")?.value || "上海",
    output: document.querySelector("#qimenOutput")?.value || "直接结论",
    mode: document.querySelector("#mode")?.value || "深入分析（20点）",
    question: document.querySelector("#question")?.value || "",
  };
}

function qimenCostFromMode(mode) {
  return String(mode || "").includes("深入") ? 20 : 8;
}

function qimenSyncCost() {
  return 1;
}

function qimenStatusTag(status) {
  const tone = ["完成", "本地完成"].includes(status) ? "info" : status.includes("处理") ? "" : "demo";
  return tag(escapeHtml(status), tone);
}

function qimenTaskTable(tasks) {
  return simpleTable(
    ["提交时间", "类型", "目标", "状态", "模式", "计费", "点数", "开始", "结束", "操作"],
    tasks.slice(0, 30).map((task) => [
      escapeHtml(task.submittedAt),
      escapeHtml(task.itemType),
      escapeHtml(task.target),
      qimenStatusTag(task.status),
      escapeHtml(task.mode),
      escapeHtml(task.billing),
      task.points,
      escapeHtml(task.startedAt),
      escapeHtml(task.endedAt),
      `<button class="ghost-button table-action" data-view-qimen-task="${escapeHtml(task.id)}">查看</button>`,
    ])
  );
}

function qimenTaskResult(task) {
  const result = task.localResult || qimenLocalAnalysis(task);
  const aiBlock = task.answer
    ? `<div class="answer-section"><strong>DeepSeek 增强解盘</strong><p>${answerHtml(task.answer)}</p></div>`
    : task.status === "处理中"
      ? `<div class="answer-section"><strong>DeepSeek 增强解盘</strong><p>正在等待后端返回，本地解盘已先进入任务详情。</p></div>`
      : `<div class="answer-section"><strong>本地解盘</strong><p>${escapeHtml(task.backendNote || "已生成本地解读，可继续提交获取后端增强。")}</p></div>`;
  return `
    <div class="detail-strip">
      ${tag(`任务 ${escapeHtml(task.id.slice(-8))}`, "info")}
      ${qimenStatusTag(task.status)}
      ${tag(`${task.points}点`)}
      ${tag(escapeHtml(task.city))}
    </div>
    ${simpleTable(["项目", "内容"], [
      ["判断对象", escapeHtml(result.subject)],
      ["起局信息", escapeHtml(`${task.calendar} ${task.time} ${task.city}`)],
      ["盘面结构", escapeHtml(`${result.palace} / ${result.door} / ${result.star} / ${result.god}`)],
      ["直接结论", escapeHtml(result.conclusion)],
      ["执行条件", escapeHtml(result.action)],
      ["时间节点", escapeHtml(result.timing)],
      ["失效线", escapeHtml(result.invalidation)],
    ])}
    ${aiBlock}
  `;
}

function qimenSyncResult(sync) {
  return `
    <div class="detail-strip">${tag("已同步起局", "info")}${tag(`${qimenSyncCost()}点`)}${tag(escapeHtml(sync.city))}</div>
    ${simpleTable(["字段", "当前值"], [
      ["同步时间", escapeHtml(sync.at)],
      ["历法", escapeHtml(sync.calendar)],
      ["起局时间", escapeHtml(sync.time)],
      ["城市", escapeHtml(sync.city)],
    ])}
  `;
}

function qimenLocalAnalysis(form) {
  const stock = pickQimenStock(form.question);
  const signals = qimenSignalDeck(form, stock);
  const subject = stock ? `${stock.name}（${stock.code.slice(0, 6)}）` : form.target;
  const pct = Number(stock?.pct) || 0;
  const fund = Number(stock?.fund) || 0;
  const rps = Number(stock?.rps) || 50;
  const hotSector = data.sectors[0]?.[0] || data.concepts[0]?.[0] || "当前主线";
  let conclusion = "先观察，等价格和量能同时确认后再行动。";
  let action = "盘中放量站回关键均线再试探；没有量能配合则只观察。";
  let invalidation = stock?.price ? `${(stock.price * 0.97).toFixed(2)} 附近` : "跌破前低或题材热度明显降温";
  if (form.target.includes("减仓")) {
    conclusion = pct >= 3 ? "适合把浮盈部分先锁定，保留观察仓。" : "不急于处理，先看关键位能否守住。";
    action = "冲高缩量或跌回分时均价线时减一档；放量承接再保留。";
  } else if (form.target.includes("低吸")) {
    conclusion = fund >= 0 && pct < 2 ? "更适合等回踩承接，不适合情绪拉高时追价。" : "低吸条件还不完整。";
    action = "回踩不破前一交易日中枢，且主力净额转正时再分批。";
  } else if (pct >= 4) {
    conclusion = "当前位置偏热，等回踩确认更从容。";
    action = "只在缩量回踩后重新放量时试探，避免一次性打满。";
  } else if (fund > 0 && rps >= 60) {
    conclusion = "可以小仓观察，等确认信号后再加一档。";
    action = `优先看 ${hotSector} 延续性和个股成交额，站稳分时均价线再执行。`;
  }
  return {
    subject,
    palace: signals.palace,
    door: signals.door,
    star: signals.star,
    god: signals.god,
    conclusion,
    action,
    timing: `${signals.timing}，若指数和板块同步转强，可把执行窗口前移一档。`,
    invalidation,
  };
}

function pickQimenStock(question) {
  const text = String(question || "");
  return (
    data.stocks.find((stock) => text.includes(stock.code.slice(0, 6)) || text.includes(stock.name)) ||
    data.stocks.find((stock) => stock.code.includes(selectedQuote)) ||
    data.stocks[0] ||
    null
  );
}

function qimenSignalDeck(form, stock) {
  const seed = hashString([form.itemType, form.target, form.stage, form.time, form.city, form.question, stock?.code].join("|"));
  const palaces = ["坎宫", "艮宫", "震宫", "巽宫", "离宫", "坤宫", "兑宫", "乾宫"];
  const doors = ["开门", "休门", "生门", "伤门", "杜门", "景门", "死门", "惊门"];
  const stars = ["天辅", "天英", "天芮", "天柱", "天心", "天蓬", "天任", "天冲"];
  const gods = ["值符", "腾蛇", "太阴", "六合", "白虎", "玄武", "九地", "九天"];
  const timings = ["上午盘先看承接", "午后看资金回流", "收盘前确认强弱", "隔日开盘看延续"];
  return {
    palace: palaces[seed % palaces.length],
    door: doors[Math.floor(seed / 3) % doors.length],
    star: stars[Math.floor(seed / 5) % stars.length],
    god: gods[Math.floor(seed / 7) % gods.length],
    timing: timings[Math.floor(seed / 11) % timings.length],
  };
}

function hashString(value) {
  return String(value)
    .split("")
    .reduce((hash, char) => Math.abs((hash * 31 + char.charCodeAt(0)) | 0), 7);
}

function answerHtml(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function updateQimenTask(task) {
  qimenTasks = qimenTasks.map((item) => (item.id === task.id ? normalizeQimenTask(task) : item));
  persistQimenState();
}

async function handleQimenSubmit(button) {
  const target = document.querySelector(`#${button.dataset.target}`);
  if (!target) return;
  const form = qimenFormState();
  const points = qimenCostFromMode(form.mode);
  const task = normalizeQimenTask({
    id: `qm_${Date.now()}`,
    submittedAt: nowLabel(),
    itemType: form.itemType,
    target: form.target,
    stage: form.stage,
    calendar: form.calendar,
    time: form.time,
    city: form.city,
    output: form.output,
    mode: form.mode,
    billing: "点数",
    points,
    status: "处理中",
    startedAt: nowLabel(),
    endedAt: "-",
    question: form.question,
    syncAt: qimenLastSync?.at || "",
    localResult: qimenLocalAnalysis(form),
  });
  qimenTasks = [task, ...qimenTasks.filter((item) => item.id !== task.id)].slice(0, 60);
  selectedQimenTaskId = task.id;
  appendWalletLedger("消费", -points, `奇门解盘 ${form.target}`);
  persistQimenState();
  const defaultText = button.dataset.defaultText || button.textContent;
  button.dataset.defaultText = defaultText;
  const progress = startChatProgress("qimen", target);
  setButtonLoading(button, true);
  try {
    const result = await askBackend({
      module: "qimen",
      question: form.question,
      mode: form.mode,
      context: contextForModule("qimen"),
    });
    task.status = "完成";
    task.answer = result.answer || "";
    task.endedAt = nowLabel();
    updateQimenTask(task);
    progress.succeed();
    target.innerHTML = qimenTaskResult(task);
    showToast("奇门解盘已完成。", "success");
  } catch (error) {
    task.status = "本地完成";
    task.backendNote = error.message || "后端暂未返回，已保留本地解盘。";
    task.endedAt = nowLabel();
    updateQimenTask(task);
    progress.succeed();
    target.innerHTML = qimenTaskResult(task);
    showToast("本地解盘已生成，任务已保存。", "info");
  } finally {
    setButtonLoading(button, false);
    render();
  }
}

function handleQimenSync() {
  const form = qimenFormState();
  qimenLastSync = {
    at: nowLabel(),
    calendar: form.calendar,
    time: form.time,
    city: form.city,
  };
  appendWalletLedger("消费", -qimenSyncCost(), `同步起局 ${form.city}`);
  persistQimenState();
  render();
  const target = document.querySelector("#qimenAnswer");
  if (target) target.innerHTML = qimenSyncResult(qimenLastSync);
  showToast("起局信息已同步。", "success");
}

function loadSubscriptionState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_subscription") || "null");
    subscriptionOrders = Array.isArray(stored?.orders) ? stored.orders.map(normalizeOrder).filter(Boolean).slice(0, 30) : [];
  } catch (error) {
    subscriptionOrders = [];
  }
}

function persistSubscriptionState() {
  try {
    localStorage.setItem(
      "quant_a_share_subscription",
      JSON.stringify({
        orders: subscriptionOrders,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("订单状态已更新，浏览器存储暂不可用。", "info");
  }
}

function normalizeOrder(order) {
  if (!order) return null;
  return {
    id: String(order.id || `od_${Date.now()}_${Math.random().toString(16).slice(2)}`),
    createdAt: String(order.createdAt || nowLabel()),
    productName: String(order.productName || "点数包"),
    productType: String(order.productType || "points"),
    amount: Number(order.amount) || 0,
    points: Number(order.points) || 0,
    suffix: String(order.suffix || "-"),
    status: String(order.status || "待核验"),
    updatedAt: String(order.updatedAt || order.createdAt || nowLabel()),
  };
}

function productPoints(product) {
  if (!product || product[0] !== "points") return 0;
  const match = String(product[6] || product[1] || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function createSubscriptionOrder(product, suffix) {
  const order = normalizeOrder({
    id: `od_${Date.now()}`,
    createdAt: nowLabel(),
    productName: product[1],
    productType: product[0],
    amount: Number(product[5]) || 0,
    points: productPoints(product),
    suffix: suffix || "-",
    status: "待核验",
    updatedAt: nowLabel(),
  });
  subscriptionOrders = [order, ...subscriptionOrders].slice(0, 30);
  persistSubscriptionState();
  return order;
}

function orderStatusTag(status) {
  const tone = status === "已开通" ? "info" : status === "待核验" ? "" : "demo";
  return tag(escapeHtml(status), tone);
}

function subscriptionOrderTable() {
  return simpleTable(
    ["时间", "商品", "金额", "点数", "订单后四位", "状态", "更新时间", "操作"],
    subscriptionOrders.map((order) => [
      escapeHtml(order.createdAt),
      escapeHtml(order.productName),
      `¥ ${order.amount.toFixed(2)}`,
      order.points || "-",
      escapeHtml(order.suffix),
      orderStatusTag(order.status),
      escapeHtml(order.updatedAt),
      order.status === "待核验" ? `<button class="ghost-button table-action" data-complete-order="${escapeHtml(order.id)}">标记开通</button>` : "-",
    ])
  );
}

function completeSubscriptionOrder(orderId) {
  const order = subscriptionOrders.find((item) => item.id === orderId);
  if (!order || order.status === "已开通") return;
  order.status = "已开通";
  order.updatedAt = nowLabel();
  if (order.points > 0) {
    appendWalletLedger("充值", order.points, `订单开通 ${order.productName}`);
    persistQimenState();
  }
  persistSubscriptionState();
}

function loadAiState() {
  try {
    const stored = JSON.parse(localStorage.getItem("quant_a_share_ai") || "null");
    if (!stored) return;
    aiRealtime = stored.realtime !== false;
    if (["快速模式", "专家模式", "深度思考"].includes(stored.mode)) aiMode = stored.mode;
    aiQuestion = String(stored.question || aiQuestion);
    aiHistory = Array.isArray(stored.history) ? stored.history.map(normalizeAiHistoryItem).filter(Boolean).slice(0, 30) : [];
    aiCurrentAnswer = String(stored.currentAnswer || aiHistory[0]?.answer || "");
  } catch (error) {
    // Bad local storage should not block AI matrix.
  }
}

function persistAiState() {
  try {
    localStorage.setItem(
      "quant_a_share_ai",
      JSON.stringify({
        realtime: aiRealtime,
        mode: aiMode,
        question: aiQuestion,
        currentAnswer: aiCurrentAnswer,
        history: aiHistory,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    showToast("AI 对话状态已更新，浏览器存储暂不可用。", "info");
  }
}

function normalizeAiHistoryItem(item) {
  if (!item?.question) return null;
  return {
    id: String(item.id || `ai_${Date.now()}_${Math.random().toString(16).slice(2)}`),
    at: String(item.at || nowLabel()),
    mode: String(item.mode || aiMode),
    realtime: item.realtime !== false,
    question: String(item.question || "").slice(0, 500),
    answer: String(item.answer || ""),
  };
}

function recordAiHistory(question, mode, answer) {
  const item = normalizeAiHistoryItem({
    id: `ai_${Date.now()}`,
    at: nowLabel(),
    mode,
    realtime: aiRealtime,
    question,
    answer,
  });
  if (!item) return;
  aiHistory = [item, ...aiHistory].slice(0, 30);
  aiQuestion = question;
  aiCurrentAnswer = answer;
  persistAiState();
}

function resetAiConversation() {
  aiQuestion = "";
  aiCurrentAnswer = "";
  persistAiState();
}

function aiHistoryTable() {
  if (!aiHistory.length) return `<div class="empty-state compact-empty"><strong>暂无对话记录</strong><span>生成回答后会保留最近 30 条。</span></div>`;
  return simpleTable(
    ["时间", "模式", "实时", "问题", "操作"],
    aiHistory.slice(0, 8).map((item) => [
      escapeHtml(item.at),
      escapeHtml(item.mode),
      item.realtime ? "开" : "关",
      escapeHtml(item.question.slice(0, 42)),
      `<button class="ghost-button table-action" data-load-ai-history="${escapeHtml(item.id)}">载入</button>`,
    ])
  );
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
        ${panelTitle("AI 决策矩阵", `<div class="toolbar"><button class="ghost-button" data-new-ai-chat="1">新对话</button><button class="ghost-button" data-goto-page="subscription">钱包</button></div>`)}
        <div class="toolbar">
          <label class="toggle"><input type="checkbox" data-ai-realtime ${aiRealtime ? "checked" : ""} />实时搜索</label>
          <button class="chip ${aiMode === "快速模式" ? "active" : ""}" data-mode-pick="快速模式">快速模式</button>
          <button class="chip ${aiMode === "专家模式" ? "active" : ""}" data-mode-pick="专家模式">专家模式</button>
          <button class="chip ${aiMode === "深度思考" ? "active" : ""}" data-mode-pick="深度思考">深度思考</button>
        </div>
        <label><span class="label">问题</span><textarea id="question" placeholder="请输入你的问题，AI将基于多维数据为你解答...">${escapeHtml(aiQuestion)}</textarea></label>
        <div class="toolbar" style="margin-top:12px">
          <select id="mode"><option ${selectedAttr(aiMode === "快速模式")}>快速模式</option><option ${selectedAttr(aiMode === "专家模式")}>专家模式</option><option ${selectedAttr(aiMode === "深度思考")}>深度思考</option></select>
          <button class="primary-button" data-chat-module="ai_matrix" data-target="aiAnswer">生成回答</button>
        </div>
        <p class="notice">Vercel 后端会读取服务端 DEEPSEEK_API_KEY，浏览器端不保存密钥。</p>
        <div class="prompt-grid">${hotPrompts.map((prompt) => `<button class="prompt-card" data-hot-prompt="${escapeHtml(prompt)}">${prompt}</button>`).join("")}</div>
      </div>
      <div class="panel">
        <h2>结果</h2>
        <div id="aiAnswer" class="answer">${aiCurrentAnswer ? answerHtml(aiCurrentAnswer) : "点击“生成回答”查看分析。"}</div>
        <h2 style="margin-top:16px">对话记录</h2>
        ${aiHistoryTable()}
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
    const topics = activeLlmTopics();
    const active = topics.find((topic) => topic.name === selectedTopicName) || topics[0] || liveTopics()[0];
    selectedTopicName = active?.name || "";
    if (!active) return `<div class="empty-state"><strong>暂无主题热度数据</strong><span>可以切换主题类型或清空筛选关键词。</span></div>`;
    const topicStocks = topicStockRows(active).slice(0, 12);
    const topicNews = topicEvidence(active).slice(0, 3);
    const fieldRows = topicFieldRows(active);
    return `
      <div class="toolbar">
        <button class="chip ${llmTopicType === "industry" ? "active" : ""}" data-llm-topic-type="industry">行业</button>
        <button class="chip ${llmTopicType === "concept" ? "active" : ""}" data-llm-topic-type="concept">概念</button>
        <button class="chip ${llmTopicType === "all" ? "active" : ""}" data-llm-topic-type="all">全部</button>
        <input class="inline-input" value="2026-07-03" />
        <input id="llmTopicQuery" class="inline-input" placeholder="筛选主题" value="${escapeHtml(llmTopicQuery)}" />
        <button class="ghost-button compact-button" data-apply-llm-topic="1">筛选</button>
      </div>
      <div class="topic-grid">${topics.map((topic) => `<button class="topic-card ${topic.name === active.name ? "active" : ""}" data-topic-name="${escapeHtml(topic.name)}"><strong>${escapeHtml(topic.name)}</strong><span>热度 ${topic.heat}</span><span>趋势 ${topic.trend}</span><span>3日资金 ${plainSigned(topic.fund3, 2)}</span></button>`).join("")}</div>
      <section class="grid metrics" style="margin-top:14px">
        ${metric("3日资金(亿)", plainSigned(active.fund3, 2), active.name)}
        ${metric("3日涨跌", `${active.pct3}%`, active.trend)}
        ${metric("站上MA20(%)", active.ma20, "主题宽度")}
        ${metric("人气集中", active.crowd, "集中度")}
      </section>
      <div class="detail-strip" style="margin-top:14px">
        ${tag(active.stage, "info")}${tag(`置信度 ${active.confidence}`, "info")}${tag(`评分 ${active.score}`, "info")}${tag(`分层 ${active.tier}`)}${tag(`决策 ${active.decision}`)}
      </div>
      <div class="grid two" style="margin-top:14px">
        <div class="panel inset">
          <h3>主题分层与策略结论</h3>
          <p>${escapeHtml(active.reason)}</p>
          <div class="detail-strip">${topicNews.map((item) => tag(item, "info")).join("") || tag("暂无新闻线索")}</div>
          <p class="table-note">${escapeHtml(active.invalidation)}</p>
        </div>
        <div class="panel inset">
          <h3>主题市场数据</h3>
          ${simpleTable(["字段", "值"], fieldRows)}
        </div>
        <div class="panel inset">
          <h3>主题映射</h3>
          ${simpleTable(["原始主题", "标准主题", "方法", "匹配", "得分", "最终类型"], [[active.name, active.name, "public_board_candidate", "是", active.mappingScore, active.type]])}
        </div>
        <div class="panel inset">
          <h3>主题个股</h3>
          ${simpleTable(["代码", "名称", "来源", "阶段", "置信度", "操作"], topicStocks.map((row) => [row.code, row.name, row.source, row.stage, row.confidence, `<button class="ghost-button table-action" data-open-quote="${row.code}">查看</button>`]))}
        </div>
      </div>
    `;
  }
  if (selectedLlmTab === "选股池") {
    const poolRows = filteredPoolRows(livePoolRows());
    const page = paginateRows(poolRows, llmPoolControls.page, llmPoolControls.pageSize);
    return `
      <div class="form-grid">
        <input placeholder="基准交易日" value="2026-07-03" />
        <input id="llmPoolQuery" placeholder="筛选：代码/名称/主题" value="${escapeHtml(llmPoolControls.query)}" />
        <select id="llmPoolSource"><option value="all" ${selectedAttr(llmPoolControls.source === "all")}>来源</option><option value="规则候选" ${selectedAttr(llmPoolControls.source === "规则候选")}>规则候选</option><option value="策略候选" ${selectedAttr(llmPoolControls.source === "策略候选")}>策略候选</option></select>
        <select id="llmPoolStage"><option value="all" ${selectedAttr(llmPoolControls.stage === "all")}>策略筛选</option><option value="Entry" ${selectedAttr(llmPoolControls.stage === "Entry")}>Entry</option><option value="Watch" ${selectedAttr(llmPoolControls.stage === "Watch")}>Watch</option></select>
        <select id="llmPoolThemeType"><option value="all" ${selectedAttr(llmPoolControls.themeType === "all")}>主题类型</option><option value="industry" ${selectedAttr(llmPoolControls.themeType === "industry")}>行业</option><option value="concept" ${selectedAttr(llmPoolControls.themeType === "concept")}>概念</option></select>
        <select id="llmPoolSort"><option value="attention" ${selectedAttr(llmPoolControls.sort === "attention")}>默认（关注优先）</option><option value="confidence" ${selectedAttr(llmPoolControls.sort === "confidence")}>置信度</option><option value="pct" ${selectedAttr(llmPoolControls.sort === "pct")}>盘中涨跌</option><option value="t5" ${selectedAttr(llmPoolControls.sort === "t5")}>T+5</option></select>
        <select id="llmPoolPageSize"><option value="20" ${selectedAttr(llmPoolControls.pageSize === 20)}>20条/页</option><option value="50" ${selectedAttr(llmPoolControls.pageSize === 50)}>50条/页</option><option value="100" ${selectedAttr(llmPoolControls.pageSize === 100)}>100条/页</option></select>
        <button class="primary-button align-end" data-apply-llm-pool="1">筛选</button>
      </div>
      <div class="detail-strip">${tag(`总数：${poolRows.length}`)}${tag(`关注：${poolRows.filter((row) => row.watch === "是").length}`)}${tag(`第 ${page.page}/${page.pages} 页`)}${tag("收益选择：2026-07-03")}${tag("收盘态")}${tag("最关注", "info")}${tag("策略候选", "info")}</div>
      ${simpleTable(["代码", "名称", "实时价", "盘中涨跌", "主题", "来源", "策略", "阶段", "仓位", "置信度", "买点价", "T+1", "T+3", "T+5", "关注"], page.rows.map((row) => [row.code, row.name, row.price, `${signed(row.pct)}%`, row.theme, row.source, row.strategy, row.stage, row.position, row.confidence, row.entry, row.t1, row.t3, row.t5, row.watch]))}
      ${llmPager("pool", page)}
    `;
  }
  if (selectedLlmTab === "板块全景看板") {
    const sectorRows = filteredLlmSectorRows(liveLlmSectorRows());
    const page = paginateRows(sectorRows, llmSectorControls.page, llmSectorControls.pageSize);
    const table = llmSectorTable(page.rows);
    return `
      <div class="form-grid">
        <input placeholder="交易日（默认最新）" value="2026-07-03" />
        <input id="llmSectorQuery" placeholder="筛选：板块/ID/关键词" value="${escapeHtml(llmSectorControls.query)}" />
        <select id="llmSectorSort"><option value="fund3" ${selectedAttr(llmSectorControls.sort === "fund3")}>3日资金_亿</option><option value="pct3" ${selectedAttr(llmSectorControls.sort === "pct3")}>3日涨跌</option><option value="ma20" ${selectedAttr(llmSectorControls.sort === "ma20")}>MA20占比</option><option value="top100" ${selectedAttr(llmSectorControls.sort === "top100")}>Top100</option></select>
        <select id="llmSectorDirection"><option value="desc" ${selectedAttr(llmSectorControls.direction === "desc")}>降序</option><option value="asc" ${selectedAttr(llmSectorControls.direction === "asc")}>升序</option></select>
        <select id="llmSectorColumns"><option value="all" ${selectedAttr(llmSectorControls.columns === "all")}>展示列：全部</option><option value="core" ${selectedAttr(llmSectorControls.columns === "core")}>展示列：核心</option></select>
        <select id="llmSectorPageSize"><option value="20" ${selectedAttr(llmSectorControls.pageSize === 20)}>20条/页</option><option value="50" ${selectedAttr(llmSectorControls.pageSize === 50)}>50条/页</option><option value="100" ${selectedAttr(llmSectorControls.pageSize === 100)}>100条/页</option></select>
        <button class="primary-button align-end" data-apply-llm-sector="1">筛选</button>
      </div>
      <div class="detail-strip">${tag(`总数：${sectorRows.length}`)}${tag(`第 ${page.page}/${page.pages} 页`)}${tag("交易日：2026-07-03")}${tag("轮动", "info")}${tag("高位")}${tag("低吸")}</div>
      ${simpleTable(table.headers, table.rows)}
      ${llmPager("sector", page)}
    `;
  }
  if (selectedLlmTab === "个股评估矩阵") {
    const matrixRows = filteredLlmStockRows(liveStockMatrixRows());
    const page = paginateRows(matrixRows, llmStockControls.page, llmStockControls.pageSize);
    const table = llmStockTable(page.rows);
    return `
      <div class="form-grid">
        <input placeholder="交易日（若表有日期列）" value="2026-07-03" />
        <input id="llmStockQuery" placeholder="筛选：股票代码/名称/板块/关键词" value="${escapeHtml(llmStockControls.query)}" />
        <select id="llmStockSort"><option value="pct5" ${selectedAttr(llmStockControls.sort === "pct5")}>5日涨跌</option><option value="fund5" ${selectedAttr(llmStockControls.sort === "fund5")}>5日资金_亿</option><option value="floatMv" ${selectedAttr(llmStockControls.sort === "floatMv")}>流通市值</option><option value="pct1" ${selectedAttr(llmStockControls.sort === "pct1")}>1日涨跌</option><option value="hotGap" ${selectedAttr(llmStockControls.sort === "hotGap")}>收盘_早盘</option></select>
        <select id="llmStockDirection"><option value="desc" ${selectedAttr(llmStockControls.direction === "desc")}>降序</option><option value="asc" ${selectedAttr(llmStockControls.direction === "asc")}>升序</option></select>
        <select id="llmStockColumns"><option value="all" ${selectedAttr(llmStockControls.columns === "all")}>展示列：全部</option><option value="core" ${selectedAttr(llmStockControls.columns === "core")}>展示列：核心</option></select>
        <select id="llmStockPageSize"><option value="20" ${selectedAttr(llmStockControls.pageSize === 20)}>20条/页</option><option value="50" ${selectedAttr(llmStockControls.pageSize === 50)}>50条/页</option><option value="100" ${selectedAttr(llmStockControls.pageSize === 100)}>100条/页</option></select>
        <button class="primary-button align-end" data-apply-llm-stock="1">筛选</button>
      </div>
      <div class="detail-strip">${tag(`总数：${matrixRows.length}`)}${tag(`第 ${page.page}/${page.pages} 页`)}${tag(`股票池 ${data.stocks.length} 只`)}</div>
      ${simpleTable(table.headers, table.rows)}
      ${llmPager("stock", page)}
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

function activeLlmTopics() {
  const query = normalizeTopicName(llmTopicQuery);
  return liveTopics().filter((topic) => {
    if (llmTopicType !== "all" && topic.type !== llmTopicType) return false;
    if (query && !normalizeTopicName(topic.name).includes(query)) return false;
    return true;
  });
}

function filteredPoolRows(rows) {
  const query = normalizeTopicName(llmPoolControls.query);
  const topicTypes = new Map(liveTopics().map((topic) => [topic.name, topic.type]));
  return rows
    .filter((row) => {
      if (query && ![row.code, row.name, row.theme, row.source, row.stage].some((value) => normalizeTopicName(value).includes(query))) return false;
      if (llmPoolControls.source !== "all" && row.strategy !== llmPoolControls.source && row.source !== llmPoolControls.source) return false;
      if (llmPoolControls.stage !== "all" && row.stage !== llmPoolControls.stage) return false;
      if (llmPoolControls.themeType !== "all" && topicTypes.get(row.theme) !== llmPoolControls.themeType) return false;
      return true;
    })
    .sort((a, b) => sortLlmPoolRow(a, b));
}

function sortLlmPoolRow(a, b) {
  if (llmPoolControls.sort === "confidence") return Number(b.confidence) - Number(a.confidence);
  if (llmPoolControls.sort === "pct") return Number(b.pct) - Number(a.pct);
  if (llmPoolControls.sort === "t5") return Number(b.t5) - Number(a.t5);
  const aw = a.watch === "是" ? 1 : 0;
  const bw = b.watch === "是" ? 1 : 0;
  return bw - aw || Number(b.confidence) - Number(a.confidence) || Number(b.pct) - Number(a.pct);
}

function filteredLlmSectorRows(rows) {
  const query = normalizeTopicName(llmSectorControls.query);
  return rows
    .filter((row) => !query || [row.name, row.signal].some((value) => normalizeTopicName(value).includes(query)))
    .sort((a, b) => sortNumericField(a, b, llmSectorControls.sort, llmSectorControls.direction));
}

function filteredLlmStockRows(rows) {
  const query = normalizeTopicName(llmStockControls.query);
  return rows
    .filter((row) => !query || [row.code, row.name, row.industry].some((value) => normalizeTopicName(value).includes(query)))
    .sort((a, b) => sortNumericField(a, b, llmStockControls.sort, llmStockControls.direction));
}

function sortNumericField(a, b, field, direction = "desc") {
  const av = Number(a[field]) || 0;
  const bv = Number(b[field]) || 0;
  return direction === "asc" ? av - bv : bv - av;
}

function paginateRows(rows, page, pageSize) {
  const size = clampInt(pageSize, 10, 100, 50);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const safePage = Math.max(1, Math.min(pages, Number(page) || 1));
  const start = (safePage - 1) * size;
  return { rows: rows.slice(start, start + size), page: safePage, pages, pageSize: size, total: rows.length };
}

function llmPager(kind, page) {
  return `
    <div class="toolbar table-pager">
      <button class="ghost-button compact-button" data-llm-page="${kind}" data-llm-page-delta="-1" ${page.page <= 1 ? "disabled" : ""}>上一页</button>
      ${tag(`${page.page}/${page.pages}`)}
      <button class="ghost-button compact-button" data-llm-page="${kind}" data-llm-page-delta="1" ${page.page >= page.pages ? "disabled" : ""}>下一页</button>
    </div>
  `;
}

function llmSectorTable(rows) {
  if (llmSectorControls.columns === "core") {
    return {
      headers: ["信号", "板块", "3日涨跌", "3日资金_亿", "Top100", "MA20占比", "集中度"],
      rows: rows.map((row) => [row.signal, row.name, signed(row.pct3), signed(row.fund3), `${row.top100}%`, `${row.ma20}%`, `${row.crowd}%`]),
    };
  }
  return {
    headers: ["信号", "日期", "板块", "1日涨跌", "3日涨跌", "当日资金_亿", "3日资金_亿", "Top100", "5日资金_亿", "5日涨跌", "7日涨跌", "MA20占比", "集中度", "3日资金_norm_亿"],
    rows: rows.map((row) => [row.signal, row.date, row.name, signed(row.pct1), signed(row.pct3), signed(row.fund1), signed(row.fund3), `${row.top100}%`, signed(row.fund5), signed(row.pct5), signed(row.pct7), `${row.ma20}%`, `${row.crowd}%`, signed(row.fundNorm)]),
  };
}

function llmStockTable(rows) {
  if (llmStockControls.columns === "core") {
    return {
      headers: ["代码", "名称", "行业", "5日资金_亿", "流通市值（亿）", "5日涨跌", "1日涨跌", "行情"],
      rows: rows.map((row) => [row.code, row.name, row.industry, signed(row.fund5), row.floatMv, signed(row.pct5), signed(row.pct1), `<button class="ghost-button table-action" data-open-quote="${row.code}">查看</button>`]),
    };
  }
  return {
    headers: ["代码", "名称", "行业", "当日资金_亿", "5日资金_亿", "收盘_早盘(负数=更热)", "大于等于5日线", "大于等于90日线", "大于等于144日线", "流通市值（亿）", "5日涨跌", "1日涨跌", "行情"],
    rows: rows.map((row) => [row.code, row.name, row.industry, signed(row.fund1), signed(row.fund5), signed(row.hotGap), row.above5, row.above90, row.above144, row.floatMv, signed(row.pct5), signed(row.pct1), `<button class="ghost-button table-action" data-open-quote="${row.code}">查看</button>`]),
  };
}

function liveTopics() {
  const conceptTopics = data.concepts.slice(0, 24).map((row) => buildTopicFromBoard(row, "concept"));
  const sectorTopics = data.sectors.slice(0, 24).map((row) => buildTopicFromBoard(row, "industry"));
  const rows = [...sectorTopics, ...conceptTopics]
    .filter((row) => row.name)
    .sort((a, b) => b.heat - a.heat || b.fund3 - a.fund3)
    .slice(0, 18);
  return rows.length ? rows : llmTopics.map((topic) => enrichTopic(topic, "industry"));
}

function buildTopicFromBoard(row, type) {
  const name = row[0];
  const pct = Number(row[1]) || 0;
  const amount = type === "concept" ? Number(row[4]) || 0 : Math.abs(Number(row[7]) || 0) * 12 + (Number(row[4]) || 0) * 1.5;
  const matchedStocks = topicStockRows({ name }).length;
  const heat = Math.max(30, Math.min(99, Math.round(52 + pct * 4.8 + Math.log10(Math.max(amount, 1)) * 8 + matchedStocks * 1.2)));
  return enrichTopic(
    {
      name,
      heat,
      trend: pct >= 3 ? "up" : pct >= 0 ? "new" : "down",
      fund3: Math.round((amount * (pct >= 0 ? 1.15 : 0.82)) * 100) / 100,
      pct3: Math.round((pct * (pct >= 0 ? 1.25 : 1.1)) * 100) / 100,
      ma20: Math.max(10, Math.min(99, Math.round(50 + pct * 4 + matchedStocks / 2))),
      crowd: Math.max(1, Math.min(99, Math.round((matchedStocks / Math.max(data.stocks.length, 1)) * 1000) / 10)),
      score: Math.max(30, Math.min(95, Math.round(55 + pct * 5 + matchedStocks / 2 + Math.log10(Math.max(amount, 1)) * 4))),
      companyCount: row[3] || matchedStocks,
      leader: row[5] || "-",
      leaderPct: row[6] || 0,
      netFund: type === "industry" ? Number(row[7]) || 0 : 0,
    },
    type
  );
}

function enrichTopic(topic, type) {
  const score = Number(topic.score) || 60;
  const tier = score >= 78 ? "entry" : score >= 62 ? "watch" : "avoid";
  const decision = tier === "entry" ? "follow" : tier === "watch" ? "observe" : "wait";
  const stage = topic.stage || (topic.trend === "up" ? "轮动加强" : topic.trend === "new" ? "新主题观察" : "退潮反抽");
  const reason =
    topic.trend === "up"
      ? `${topic.name}涨幅和资金同步靠前，样本个股扩散度较高，适合作为盘中强度观察主题。`
      : topic.trend === "new"
        ? `${topic.name}处在轮动观察区，资金和涨幅尚未完全同步，优先看领涨股延续性和板块宽度。`
        : `${topic.name}短线强度偏弱，先等待资金回流和宽度修复。`;
  return {
    ...topic,
    type,
    tier,
    decision,
    stage,
    confidence: Math.max(0.35, Math.min(0.9, score / 100)).toFixed(2),
    mappingScore: Math.max(0.72, Math.min(0.96, score / 100 + 0.08)).toFixed(3),
    reason,
    invalidation: `观察条件：${topic.name}的涨跌幅、资金和样本个股强度需要继续同向；若领涨股转弱，则降级观察。`,
  };
}

function topicFieldRows(topic) {
  if (!topic) return [];
  return [
    ["theme_score", topic.score],
    ["tier", topic.tier],
    ["trend", topic.trend],
    ["pct_chg_1d", `${signed(topic.pct3 / 1.25)}%`],
    ["pct_chg_3d", `${signed(topic.pct3)}%`],
    ["money_flow_3d", `${plainSigned(topic.fund3, 2)}亿`],
    ["ma20_breadth", `${topic.ma20}%`],
    ["crowd", `${topic.crowd}%`],
    ["company_count", topic.companyCount || "-"],
    ["leader", topic.leader || "-"],
    ["leader_pct", `${signed(topic.leaderPct || 0)}%`],
  ];
}

function topicEvidence(topic) {
  const reports = researchReports();
  const matchedReports = reports.filter((row) => includesTopic([row.title, row.industryName, row.category], topic?.name));
  const reportLines = (matchedReports.length ? matchedReports : reports).slice(0, 2).map((row) => `${row.industryName || row.category || "研报"}：${row.title}`);
  const keywords = (data.popularity?.stock?.keywords || []).slice(0, 2).map((row) => `${row.concept} 热度 ${row.heat}`);
  const leader = topic?.leader && topic.leader !== "-" ? [`领涨股 ${topic.leader} ${signed(topic.leaderPct || 0)}%`] : [];
  return [...leader, ...reportLines, ...keywords].filter(Boolean);
}

function topicStockRows(topic) {
  if (!topic?.name) return [];
  const keyword = normalizeTopicName(topic.name);
  const matched = data.stocks
    .map((stock) => {
      const industryHit = normalizeTopicName(stock.industry).includes(keyword) || keyword.includes(normalizeTopicName(stock.industry));
      const conceptHit = normalizeTopicName(stock.concepts).includes(keyword);
      const nameHit = normalizeTopicName(stock.name).includes(keyword);
      const score = (industryHit ? 42 : 0) + (conceptHit ? 36 : 0) + (nameHit ? 18 : 0) + (Number(stock.pct) || 0) * 2 + (Number(stock.rps) || 50) / 8;
      return { stock, score, industryHit, conceptHit, nameHit };
    })
    .filter((item) => item.score > 15)
    .sort((a, b) => b.score - a.score);
  const rows = (matched.length ? matched : data.stocks.map((stock) => ({ stock, score: (Number(stock.rps) || 50) + (Number(stock.pct) || 0) * 4 })))
    .slice(0, 30)
    .map(({ stock, industryHit, conceptHit, score }) => ({
      code: stock.code,
      name: stock.name,
      price: stock.price,
      pct: stock.pct,
      source: conceptHit ? "概念匹配" : industryHit ? "行业匹配" : "强度候选",
      stage: stock.pct >= 3 && stock.rps >= 70 ? "Entry" : stock.pct >= 0 ? "Watch" : "Observe",
      confidence: Math.max(0.35, Math.min(0.92, score / 110)).toFixed(2),
      theme: topic.name,
    }));
  return rows;
}

function livePoolRows() {
  const topics = liveTopics();
  const byCode = new Map();
  topics.slice(0, 8).forEach((topic) => {
    topicStockRows(topic).slice(0, 8).forEach((row) => {
      const stock = data.stocks.find((item) => item.code === row.code) || row;
      const existing = byCode.get(row.code);
      if (existing && Number(existing.confidence) >= Number(row.confidence)) return;
      byCode.set(row.code, {
        code: row.code.slice(0, 6),
        name: row.name,
        price: stock.price ? stock.price.toFixed(2) : "-",
        pct: stock.pct || 0,
        theme: row.theme,
        source: row.source,
        strategy: row.stage === "Entry" ? "策略候选" : "规则候选",
        stage: row.stage,
        position: row.stage === "Entry" ? "5.0%" : "3.0%",
        confidence: row.confidence,
        entry: stock.price ? `${(stock.price * 0.98).toFixed(2)} ~ ${(stock.price * 1.01).toFixed(2)}` : "-",
        t1: estimateRecentReturn(stock, 1),
        t3: estimateRecentReturn(stock, 3),
        t5: estimateRecentReturn(stock, 5),
        watch: row.stage === "Entry" || Number(row.confidence) >= 0.65 ? "是" : "否",
      });
    });
  });
  return Array.from(byCode.values()).sort((a, b) => Number(b.confidence) - Number(a.confidence) || b.pct - a.pct);
}

function liveLlmSectorRows() {
  return liveTopics().map((topic) => ({
    signal: topic.score >= 78 ? "高位" : topic.score >= 62 ? "轮动" : "低吸",
    date: "2026-07-03",
    name: topic.name,
    pct1: topic.pct3 / 1.25,
    pct3: topic.pct3,
    fund1: topic.fund3 / 3,
    fund3: topic.fund3,
    top100: Math.round(topic.heat),
    fund5: topic.fund3 * 1.35,
    pct5: topic.pct3 * 1.2,
    pct7: topic.pct3 * 1.45,
    ma20: topic.ma20,
    crowd: topic.crowd,
    fundNorm: topic.fund3 / Math.max(topic.companyCount || 1, 1),
  }));
}

function liveStockMatrixRows() {
  return data.stocks
    .slice()
    .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
    .map((stock) => {
      const floatMv = (Number(stock.circMv) || Number(stock.totalMv) || Number(stock.amount) * 12 || 0) / 100000000;
      return {
        code: stock.code.slice(0, 6),
        name: stock.name,
        industry: stock.industry || "A股",
        fund1: Math.round((Number(stock.fund || 0)) * 100) / 100,
        fund5: Math.round((Number(stock.fund || 0) * 2.6) * 100) / 100,
        hotGap: Math.round(((Number(stock.pct) || 0) - (Number(stock.rps) || 50) / 20) * 100) / 100,
        above5: stock.pct >= -0.3 ? "是" : "否",
        above90: stock.rps >= 60 ? "是" : "否",
        above144: stock.rps >= 65 ? "是" : "否",
        floatMv: Math.round(floatMv * 100) / 100,
        pct5: estimateRecentReturn(stock, 5),
        pct1: stock.pct,
      };
    });
}

function includesTopic(values, topic) {
  const key = normalizeTopicName(topic);
  return Boolean(key) && values.some((value) => normalizeTopicName(value).includes(key) || key.includes(normalizeTopicName(value)));
}

function normalizeTopicName(value) {
  return String(value || "")
    .replace(/概念|板块|行业|主题|Ａ/g, "")
    .toLowerCase()
    .trim();
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
  const summary = walletSummary();
  const selectedTask = qimenTasks.find((task) => task.id === selectedQimenTaskId) || qimenTasks[0];
  const lastSyncText = qimenLastSync ? `${qimenLastSync.at} ${qimenLastSync.city}` : "未同步";
  const historyRows = qimenTasks.slice(0, 6).map((task) => [
    escapeHtml(task.submittedAt),
    escapeHtml(task.itemType),
    escapeHtml(task.target),
    qimenStatusTag(task.status),
    escapeHtml(task.mode),
    `${task.points}点`,
  ]);
  return `
    <section class="grid metrics">
      ${metric("可用点数", summary.balance, "钱包余额")}
      ${metric("冻结点数", summary.frozen, "结算占用")}
      ${metric("奇门任务", `${qimenTasks.length} 个`, "本机保存")}
      ${metric("最近起局", lastSyncText, qimenLastSync ? qimenLastSync.calendar : "等待同步")}
    </section>
    <section class="grid two">
      <div class="panel">
        ${panelTitle("奇门遁甲", `<div class="toolbar"><button class="ghost-button" data-open-modal="wallet">钱包账单</button><button class="ghost-button" data-open-modal="tasks">任务列表</button></div>`)}
        <p>把专业解盘转成你能直接看懂、能马上行动的建议。</p>
        <div class="form-grid">
          <label><span class="label">事项类型</span><select id="itemType"><option>金融</option><option>工作</option><option>合作</option></select></label>
          <label><span class="label">判断目标</span><select id="qimenTarget"><option>现在适不适合进场</option><option>是否继续持有</option><option>能否低吸</option><option>是否减仓</option></select></label>
          <label><span class="label">当前阶段</span><select id="stage"><option>在考虑阶段</option><option>已持有/已开始</option><option>准备执行</option></select></label>
          <label><span class="label">历法类型</span><select id="qimenCalendar"><option ${selectedAttr(qimenLastSync?.calendar === "公历")}>公历</option><option ${selectedAttr(qimenLastSync?.calendar === "此刻")}>此刻</option></select></label>
          <label><span class="label">时间输入</span><input id="qimenTime" value="${escapeHtml(qimenLastSync?.time || qimenDefaultTime())}" /></label>
          <label><span class="label">城市</span><input id="city" value="${escapeHtml(qimenLastSync?.city || "上海")}" /></label>
          <label><span class="label">输出偏好</span><select id="qimenOutput"><option>直接结论</option><option>过程展开</option></select></label>
          <label><span class="label">解盘档位</span><select id="mode"><option>深入分析（20点）</option><option>快速结论（8点）</option></select></label>
        </div>
        <label style="margin-top:12px"><span class="label">事情摘要</span><textarea id="question">我最近在看一只科技股，已经涨了一段时间，现在担心追高，但又怕错过后面的上涨，想判断现在适不适合进场。</textarea></label>
        <div class="toolbar" style="margin-top:12px">
          <button class="ghost-button" data-fill-now="1">同步起局（1点）</button>
          <button class="primary-button" data-chat-module="qimen" data-target="qimenAnswer">提交解盘任务</button>
          <button class="ghost-button" data-reset-qimen="1">重置</button>
        </div>
      </div>
      <div class="panel">
        <h2>结果与详情</h2>
        <div id="qimenAnswer" class="answer">${selectedTask ? qimenTaskResult(selectedTask) : "请先起局，或直接提交解盘任务。"}</div>
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>我的历史</h2>
        ${
          qimenTasks.length
            ? simpleTable(["提交时间", "类型", "目标", "状态", "模式", "点数"], historyRows)
            : `<div class="empty-state"><strong>还没有历史记录</strong><span>提交解盘任务后会显示排队、执行、完成和详情。</span></div>`
        }
      </div>
      <div class="panel">
        <h2>任务状态</h2>
        ${qimenTaskTable(qimenTasks)}
      </div>
    </section>
  `;
}

function renderSubscription() {
  const visibleProducts = products.filter((product) => productFilter === "all" || product[0] === productFilter);
  const summary = walletSummary();
  return `
    <section class="grid metrics">
      ${metric("当前账号", "u_dtfrwm", "登录状态")}
      ${metric("账号状态", "正常", "有效期至 2027-01-04")}
      ${metric("可用点数", summary.balance, "钱包余额")}
      ${metric("冻结点数", summary.frozen, "结算占用")}
      ${metric("订阅商品", `${products.length} 个`, "点数包 / 订阅套餐")}
      ${metric("订单记录", `${subscriptionOrders.length} 条`, "待核验 / 已开通")}
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
      <div class="panel">
        ${panelTitle("下单状态")}
        <div class="order-flow"><span>确认购买信息</span><span>扫码支付</span><span>填写订单号后四位</span><span>等待开通</span><span>已开通</span></div>
        ${subscriptionOrders.length ? subscriptionOrderTable() : `<div class="empty-state compact-empty"><strong>暂无订单</strong><span>购买商品并提交后四位后会显示核验状态。</span></div>`}
      </div>
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
    const summary = walletSummary();
    return `
      <section class="grid metrics">
        ${metric("可用点数", summary.balance, "当前余额")}
        ${metric("冻结点数", summary.frozen, "结算占用")}
        ${metric("累计充值", summary.recharge, "初始化与充值")}
        ${metric("累计消费", summary.spent, "问答与解盘")}
      </section>
      <div class="toolbar" style="margin-top:12px"><input id="walletCode" class="inline-input" placeholder="请输入兑换码，例如 QM-ABCD-123456" /><button class="primary-button" data-recharge-wallet="1">立即充值</button></div>
      ${simpleTable(["时间", "类型", "点数变化", "变更后余额", "变更后冻结", "备注"], walletLedger.map((row) => [escapeHtml(row[0]), escapeHtml(row[1]), signed(Number(row[2]) || 0, 1), row[3], row[4], escapeHtml(row[5])]))}
    `;
  }
  if (modal.type === "tasks") {
    return qimenTasks.length ? qimenTaskTable(qimenTasks) : `<div class="empty-state"><strong>暂无奇门任务</strong><span>提交解盘后会出现在这里。</span></div>`;
  }
  if (modal.type === "volParams") {
    return `<div class="form-grid"><label><span class="label">M1</span><input id="volM1" type="number" value="${quoteVolParams.m1}" min="1" max="120" /></label><label><span class="label">M2</span><input id="volM2" type="number" value="${quoteVolParams.m2}" min="1" max="120" /></label></div><div class="toolbar modal-actions"><button class="ghost-button" data-close-modal="1">取消</button><button class="primary-button" data-save-vol-params="1">确定</button></div>`;
  }
  if (modal.type === "macdParams") {
    return `<div class="form-grid"><label><span class="label">SHORT</span><input id="macdShort" type="number" value="${quoteMacdParams.short}" min="2" max="60" /></label><label><span class="label">LONG</span><input id="macdLong" type="number" value="${quoteMacdParams.long}" min="3" max="120" /></label><label><span class="label">MID</span><input id="macdMid" type="number" value="${quoteMacdParams.mid}" min="2" max="60" /></label></div><div class="toolbar modal-actions"><button class="ghost-button" data-close-modal="1">取消</button><button class="primary-button" data-save-macd-params="1">确定</button></div>`;
  }
  if (modal.type === "indicatorPicker") {
    const slot = modal.slot === "2" ? "2" : "1";
    return `<div class="indicator-picker">${["VOL", "MACD", "KDJ", "RSI", "BOLL", "VWAP", "成交额", "换手率"].map((item) => `<button class="chip" data-indicator-pick="${item}" data-indicator-slot="${slot}">${item}</button>`).join("")}</div>`;
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
      <label><span class="label">订单号后四位</span><input id="orderSuffix" placeholder="填写订单号后四位" maxlength="4" /></label>
      <div class="toolbar modal-actions"><button class="ghost-button" data-close-modal="1">取消</button><button class="primary-button" data-submit-order="${modal.productIndex}">提交核验</button></div>
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
  const ranked = data.stocks
    .map((stock) => {
      const score = filters.reduce((sum, filter) => sum + (filter.pass(stock) ? 1 : 0), 0);
      return { ...stock, factorScore: score, factorTotal: filters.length };
    })
    .sort((a, b) => b.factorScore - a.factorScore || sortScreenerRows(a, b));
  const positives = ranked.filter((stock) => stock.factorScore > 0);
  return (positives.length ? positives : ranked).slice(0, 120);
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
    vwapDip: () => stock.pct > -3 && stock.pct < 1.5 && (stock.rps >= 30 || stock.amount >= 100000000),
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

function clampInt(value, min, max, fallback) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
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
        <p>条件：${escapeHtml(activeLabel || "未选择因子")}。下方按匹配 ${factorTotal} 个因子的数量、成交额和强度排序；若全部未命中，则展示最接近候选。</p>
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
      modal = { type: button.dataset.openModal, slot: button.dataset.indicatorSlot };
      render();
    });
  });
  document.querySelector("[data-save-vol-params]")?.addEventListener("click", () => {
    quoteVolParams = {
      m1: clampInt(document.querySelector("#volM1")?.value, 1, 120, quoteVolParams.m1),
      m2: clampInt(document.querySelector("#volM2")?.value, 1, 120, quoteVolParams.m2),
    };
    persistQuoteState();
    modal = null;
    showToast("VOL 参数已确认。", "success");
    render();
  });
  document.querySelector("[data-save-macd-params]")?.addEventListener("click", () => {
    const next = {
      short: clampInt(document.querySelector("#macdShort")?.value, 2, 60, quoteMacdParams.short),
      long: clampInt(document.querySelector("#macdLong")?.value, 3, 120, quoteMacdParams.long),
      mid: clampInt(document.querySelector("#macdMid")?.value, 2, 60, quoteMacdParams.mid),
    };
    if (next.short >= next.long) next.long = next.short + 1;
    quoteMacdParams = next;
    persistQuoteState();
    modal = null;
    showToast("MACD 参数已确认。", "success");
    render();
  });
  document.querySelectorAll("[data-indicator-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.indicatorSlot === "2") quoteIndicator2 = button.dataset.indicatorPick;
      else quoteIndicator1 = button.dataset.indicatorPick;
      persistQuoteState();
      modal = null;
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
  document.querySelector("[data-submit-order]")?.addEventListener("click", (event) => {
    const product = products[Number(event.currentTarget.dataset.submitOrder)] || products[0];
    const suffix = String(document.querySelector("#orderSuffix")?.value || "").replace(/\D/g, "").slice(-4);
    createSubscriptionOrder(product, suffix);
    modal = null;
    currentPage = "subscription";
    showToast("订单已进入待核验状态。", "success");
    renderNav();
    render();
  });
  document.querySelectorAll("[data-complete-order]").forEach((button) => {
    button.addEventListener("click", () => {
      completeSubscriptionOrder(button.dataset.completeOrder);
      showToast("订单已标记开通。", "success");
      render();
    });
  });
  document.querySelector("[data-recharge-wallet]")?.addEventListener("click", () => {
    const code = String(document.querySelector("#walletCode")?.value || "").trim();
    const match = code.match(/(7000|2500|1000|500|300|200|100)/);
    const points = match ? Number(match[1]) : 100;
    appendWalletLedger("充值", points, code ? `兑换码 ${code}` : "手动充值点数");
    persistQimenState();
    modal = { type: "wallet" };
    showToast(`已充值 ${points} 点。`, "success");
    render();
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
  document.querySelectorAll("[data-llm-topic-type]").forEach((button) => {
    button.addEventListener("click", () => {
      llmTopicType = button.dataset.llmTopicType;
      selectedTopicName = "";
      persistLlmState();
      render();
    });
  });
  document.querySelector("[data-apply-llm-topic]")?.addEventListener("click", () => {
    llmTopicQuery = String(document.querySelector("#llmTopicQuery")?.value || "").trim();
    selectedTopicName = "";
    persistLlmState();
    render();
  });
  document.querySelector("[data-apply-llm-pool]")?.addEventListener("click", () => {
    llmPoolControls = normalizeLlmControls(
      {
        query: document.querySelector("#llmPoolQuery")?.value || "",
        source: document.querySelector("#llmPoolSource")?.value || "all",
        stage: document.querySelector("#llmPoolStage")?.value || "all",
        themeType: document.querySelector("#llmPoolThemeType")?.value || "all",
        sort: document.querySelector("#llmPoolSort")?.value || "attention",
        pageSize: Number(document.querySelector("#llmPoolPageSize")?.value || 50),
        page: 1,
      },
      llmPoolControls,
      ["attention", "confidence", "pct", "t5"]
    );
    persistLlmState();
    render();
  });
  document.querySelector("[data-apply-llm-sector]")?.addEventListener("click", () => {
    llmSectorControls = normalizeLlmControls(
      {
        query: document.querySelector("#llmSectorQuery")?.value || "",
        sort: document.querySelector("#llmSectorSort")?.value || "fund3",
        direction: document.querySelector("#llmSectorDirection")?.value || "desc",
        columns: document.querySelector("#llmSectorColumns")?.value || "all",
        pageSize: Number(document.querySelector("#llmSectorPageSize")?.value || 50),
        page: 1,
      },
      llmSectorControls,
      ["fund3", "pct3", "ma20", "crowd", "top100"]
    );
    persistLlmState();
    render();
  });
  document.querySelector("[data-apply-llm-stock]")?.addEventListener("click", () => {
    llmStockControls = normalizeLlmControls(
      {
        query: document.querySelector("#llmStockQuery")?.value || "",
        sort: document.querySelector("#llmStockSort")?.value || "pct5",
        direction: document.querySelector("#llmStockDirection")?.value || "desc",
        columns: document.querySelector("#llmStockColumns")?.value || "all",
        pageSize: Number(document.querySelector("#llmStockPageSize")?.value || 50),
        page: 1,
      },
      llmStockControls,
      ["pct5", "fund5", "floatMv", "pct1", "hotGap"]
    );
    persistLlmState();
    render();
  });
  document.querySelectorAll("[data-llm-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const delta = Number(button.dataset.llmPageDelta) || 0;
      if (button.dataset.llmPage === "pool") llmPoolControls = { ...llmPoolControls, page: Math.max(1, llmPoolControls.page + delta) };
      if (button.dataset.llmPage === "sector") llmSectorControls = { ...llmSectorControls, page: Math.max(1, llmSectorControls.page + delta) };
      if (button.dataset.llmPage === "stock") llmStockControls = { ...llmStockControls, page: Math.max(1, llmStockControls.page + delta) };
      persistLlmState();
      render();
    });
  });
  document.querySelectorAll("[data-topic-name]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTopicName = button.dataset.topicName;
      render();
    });
  });
  document.querySelectorAll("[data-open-quote]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedQuote = button.dataset.openQuote.replace(/\D/g, "").slice(0, 6) || selectedQuote;
      currentPage = "quote";
      renderNav();
      loadMarketSnapshot();
    });
  });
  document.querySelectorAll("[data-hot-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = document.querySelector("#question");
      if (question) question.value = button.dataset.hotPrompt;
      if (currentPage === "ai") {
        aiQuestion = button.dataset.hotPrompt;
        persistAiState();
      }
      showToast("热门问题已填入输入框。", "success");
    });
  });
  document.querySelectorAll("[data-mode-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      aiMode = button.dataset.modePick;
      const mode = document.querySelector("#mode");
      if (mode) mode.value = aiMode;
      persistAiState();
      if (currentPage === "ai") render();
      else showToast(`已切换 ${button.dataset.modePick}`, "success");
    });
  });
  document.querySelector("[data-ai-realtime]")?.addEventListener("change", (event) => {
    aiRealtime = Boolean(event.currentTarget.checked);
    persistAiState();
  });
  document.querySelector("[data-new-ai-chat]")?.addEventListener("click", () => {
    resetAiConversation();
    showToast("已新建对话。", "success");
    render();
  });
  document.querySelectorAll("[data-load-ai-history]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = aiHistory.find((row) => row.id === button.dataset.loadAiHistory);
      if (!item) return;
      aiQuestion = item.question;
      aiMode = item.mode;
      aiRealtime = item.realtime;
      aiCurrentAnswer = item.answer;
      persistAiState();
      render();
    });
  });
  document.querySelector("[data-load-market-review]")?.addEventListener("click", () => {
    marketStartDate = normalizeDateValue(document.querySelector("#marketStartDate")?.value) || marketStartDate;
    marketEndDate = normalizeDateValue(document.querySelector("#marketEndDate")?.value) || marketEndDate;
    marketStateFilter = document.querySelector("#marketStateFilter")?.value || marketStateFilter;
    marketReviewUpdatedAt = new Date().toISOString();
    persistMarketState();
    showToast("正在刷新公开行情。", "info");
    loadMarketSnapshot();
  });
  document.querySelector("#mode")?.addEventListener("change", (event) => {
    if (currentPage !== "ai") return;
    aiMode = event.currentTarget.value;
    persistAiState();
  });
  document.querySelectorAll("[data-refresh-market]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("正在刷新公开行情。", "info");
      loadMarketSnapshot();
    });
  });
  document.querySelectorAll("[data-sector-dataset]").forEach((input) => {
    input.addEventListener("change", () => {
      sectorDataset = input.dataset.sectorDataset === "concepts" ? "concepts" : "sectors";
      render();
    });
  });
  document.querySelectorAll("[data-sector-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      sectorPreset = sectorPreset === button.dataset.sectorPreset ? "all" : button.dataset.sectorPreset;
      render();
    });
  });
  document.querySelector("[data-sector-sort-field]")?.addEventListener("change", (event) => {
    sectorSort = { ...sectorSort, field: event.currentTarget.value };
    render();
  });
  document.querySelector("[data-sector-sort-direction]")?.addEventListener("change", (event) => {
    sectorSort = { ...sectorSort, direction: event.currentTarget.value === "asc" ? "asc" : "desc" };
    render();
  });
  document.querySelector("[data-apply-sector-range]")?.addEventListener("click", () => {
    sectorRange = {
      min: document.querySelector("#sectorMin")?.value || "",
      max: document.querySelector("#sectorMax")?.value || "",
    };
    render();
  });
  document.querySelectorAll("[data-sector-chart-type]").forEach((input) => {
    input.addEventListener("change", () => {
      sectorChartType = input.dataset.sectorChartType === "pie" ? "pie" : "bar";
      render();
    });
  });
  document.querySelector("[data-reset-sector-filters]")?.addEventListener("click", () => {
    sectorPreset = "all";
    sectorRange = { min: "", max: "" };
    sectorSort = { field: "pct", direction: "desc" };
    sectorChartType = "bar";
    render();
  });
  document.querySelectorAll("[data-query-quote]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedQuote = (document.querySelector("#quoteCode")?.value || selectedQuote).replace(/\D/g, "").slice(0, 6) || selectedQuote;
      quoteStartDate = normalizeDateValue(document.querySelector("#quoteStartDate")?.value) || quoteStartDate;
      quoteEndDate = normalizeDateValue(document.querySelector("#quoteEndDate")?.value) || quoteEndDate;
      quoteAdjust = document.querySelector("#quoteAdjust")?.value || quoteAdjust;
      persistQuoteState();
      loadMarketSnapshot();
    });
  });
  document.querySelector("[data-quote-adjust]")?.addEventListener("change", (event) => {
    quoteAdjust = ["qfq", "hfq", "none"].includes(event.currentTarget.value) ? event.currentTarget.value : "qfq";
    persistQuoteState();
    render();
  });
  document.querySelectorAll("[data-quote-range]").forEach((button) => {
    button.addEventListener("click", () => {
      quoteEndDate = new Date().toISOString().slice(0, 10);
      quoteStartDate = button.dataset.quoteRange === "year" ? shiftDate(365) : shiftDate(183);
      quoteHistoryLimit = button.dataset.quoteRange === "year" ? 260 : 160;
      persistQuoteState();
      render();
    });
  });
  document.querySelector("[data-load-more-history]")?.addEventListener("click", () => {
    quoteHistoryLimit = Math.min(600, quoteHistoryLimit + 80);
    persistQuoteState();
    render();
  });
  document.querySelectorAll("[data-quote-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      quoteChartMode = button.dataset.quoteMode;
      persistQuoteState();
      render();
    });
  });
  document.querySelectorAll("[data-drawing-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      const stock = data.stocks.find((item) => item.code.includes(selectedQuote)) || data.stocks[0];
      quoteDrawings = [
        ...quoteDrawings,
        {
          tool: button.dataset.drawingTool,
          code: stock.code,
          price: stock.price ? stock.price.toFixed(2) : "-",
          at: new Date().toISOString(),
        },
      ].slice(-20);
      persistQuoteState();
      render();
    });
  });
  document.querySelector("[data-clear-drawings]")?.addEventListener("click", () => {
    quoteDrawings = [];
    persistQuoteState();
    render();
  });
  document.querySelectorAll("[data-quote-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`图表${button.dataset.quoteZoom === "in" ? "放大" : button.dataset.quoteZoom === "out" ? "缩小" : "已重置"}`, "success");
    });
  });
  document.querySelector("[data-refresh-indicators]")?.addEventListener("click", () => {
    persistQuoteState();
    render();
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
      if (button.dataset.chatModule === "qimen") {
        await handleQimenSubmit(button);
        return;
      }
      const target = document.querySelector(`#${button.dataset.target}`);
      const question = document.querySelector("#question")?.value || "";
      const mode = document.querySelector("#mode")?.value || "专家模式";
      if (button.dataset.chatModule === "ai_matrix") {
        aiQuestion = question;
        aiMode = mode;
        persistAiState();
      }
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
        if (button.dataset.chatModule === "ai_matrix") recordAiHistory(question, mode, result.answer || "后端没有返回内容。");
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
    handleQimenSync();
  });
  document.querySelector("[data-reset-qimen]")?.addEventListener("click", () => {
    qimenLastSync = null;
    selectedQimenTaskId = qimenTasks[0]?.id || "";
    persistQimenState();
    showToast("表单已重置。", "success");
    render();
  });
  document.querySelectorAll("[data-view-qimen-task]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedQimenTaskId = button.dataset.viewQimenTask;
      modal = null;
      currentPage = "qimen";
      persistQimenState();
      renderNav();
      render();
    });
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
    marketControls: {
      startDate: marketStartDate,
      endDate: marketEndDate,
      stateFilter: marketStateFilter,
      reviewUpdatedAt: marketReviewUpdatedAt,
      reviewStats: marketReviewStats(),
    },
    aiControls: {
      realtime: aiRealtime,
      mode: aiMode,
      recentQuestions: aiHistory.slice(0, 5).map((item) => ({ at: item.at, mode: item.mode, realtime: item.realtime, question: item.question })),
    },
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
    llmControls: {
      topicType: llmTopicType,
      topicQuery: llmTopicQuery,
      pool: llmPoolControls,
      sector: llmSectorControls,
      stock: llmStockControls,
    },
    yahooChart: data.yahooChart,
    products: products.slice(0, 5).map((item) => ({ name: item[1], type: item[3], price: item[5] })),
    qimen: {
      itemType: document.querySelector("#itemType")?.value,
      target: document.querySelector("#qimenTarget")?.value,
      stage: document.querySelector("#stage")?.value,
      calendar: document.querySelector("#qimenCalendar")?.value,
      time: document.querySelector("#qimenTime")?.value,
      city: document.querySelector("#city")?.value,
      output: document.querySelector("#qimenOutput")?.value,
      lastSync: qimenLastSync,
      recentTasks: qimenTasks.slice(0, 5).map((task) => ({
        submittedAt: task.submittedAt,
        itemType: task.itemType,
        target: task.target,
        status: task.status,
        points: task.points,
      })),
      wallet: walletSummary(),
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
      data.sectors = payload.sectors.map((sector, index) => [
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
      data.concepts = payload.concepts.map((concept, index) => [
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
    data.quoteKlines = Array.isArray(payload.klines) ? payload.klines : [];
    data.minuteKlines = Array.isArray(payload.minuteKlines) ? payload.minuteKlines : [];
    renderRuntimeShell();
    if (["market", "screener", "sectors", "quote", "llm", "subscription", "about"].includes(currentPage)) render();
  } catch (error) {
    showToast("公开行情暂未更新，继续使用内置样本。", "info");
  }
}

function buildClientStockRows(rows) {
  const baseRows = rows.slice(0, 800);
  const pctValues = baseRows.map((stock) => Number(stock.pct) || 0).sort((a, b) => a - b);
  const amountValues = baseRows.map((stock) => Number(stock.amount) || 0).sort((a, b) => a - b);
  return baseRows.map((stock) => {
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
      industry: stock.industry || stock.area || "A股",
      concepts: stock.concepts || "",
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

function activeQuoteRows(stock) {
  let rows = [];
  if (quoteChartMode === "minute" && data.minuteKlines.length) rows = data.minuteKlines;
  else if (quoteChartMode === "baostock" && data.baostock?.rows?.length) rows = data.baostock.rows;
  else if (quoteChartMode === "yahoo" && data.yahooChart?.klines?.length) rows = data.yahooChart.klines;
  else if (data.quoteKlines.length) rows = data.quoteKlines;
  if (rows.length) return filterQuoteRows(rows, quoteChartMode === "minute");
  const base = stock?.price || 100;
  return filterQuoteRows(data.breadth.map((d, index) => ({
    date: d[0],
    open: Number((base * (0.98 + index / Math.max(data.breadth.length, 1) * 0.03)).toFixed(2)),
    high: Number((base * (1 + index / Math.max(data.breadth.length, 1) * 0.03)).toFixed(2)),
    low: Number((base * (0.96 + index / Math.max(data.breadth.length, 1) * 0.03)).toFixed(2)),
    close: Number((base * (0.97 + index / Math.max(data.breadth.length, 1) * 0.04 + (Number(d[2]) - 50) / 1000)).toFixed(2)),
    volume: d[1] * 10000,
  })));
}

function filterQuoteRows(rows, isMinute = false) {
  const start = normalizeDateValue(quoteStartDate);
  const end = normalizeDateValue(quoteEndDate);
  const filtered = rows.filter((row) => {
    const rowDate = normalizeDateValue(row.date || row.time || "");
    if (!rowDate) return true;
    if (start && rowDate < start) return false;
    if (end && rowDate > end) return false;
    return true;
  });
  const limit = isMinute ? Math.max(240, quoteHistoryLimit) : quoteHistoryLimit;
  return (filtered.length ? filtered : rows).slice(-Math.max(20, limit));
}

function normalizeDateValue(value) {
  const match = String(value || "").match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/);
  if (!match) return "";
  const [year, month, day] = match[0].replace(/\//g, "-").split("-").map((part) => part.padStart(2, "0"));
  return `${year}-${month}-${day}`;
}

function shiftDate(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function quoteAdjustLabel() {
  if (quoteAdjust === "hfq") return "后复权";
  if (quoteAdjust === "none") return "不复权";
  return "前复权";
}

function movingAverage(values, windowSize) {
  return values.map((_, index) => {
    const slice = values.slice(Math.max(0, index - windowSize + 1), index + 1);
    const valid = slice.filter((value) => Number.isFinite(value));
    return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
  });
}

function ema(values, span) {
  const alpha = 2 / (span + 1);
  let previous = values[0] || 0;
  return values.map((value, index) => {
    previous = index === 0 ? value || 0 : (value || previous) * alpha + previous * (1 - alpha);
    return previous;
  });
}

function macdSeries(values) {
  const fast = ema(values, quoteMacdParams.short);
  const slow = ema(values, quoteMacdParams.long);
  const dif = fast.map((value, index) => value - slow[index]);
  const dea = ema(dif, quoteMacdParams.mid);
  const hist = dif.map((value, index) => (value - dea[index]) * 2);
  return { dif, dea, hist };
}

function rsiSeries(values, period = 14) {
  return values.map((_, index) => {
    if (index === 0) return 50;
    const start = Math.max(1, index - period + 1);
    let gain = 0;
    let loss = 0;
    for (let i = start; i <= index; i += 1) {
      const change = values[i] - values[i - 1];
      if (change >= 0) gain += change;
      else loss -= change;
    }
    if (!loss) return 100;
    const rs = gain / loss;
    return 100 - 100 / (1 + rs);
  });
}

function bollSeries(values, period = 20) {
  const mid = movingAverage(values, period);
  const upper = values.map((_, index) => {
    const slice = values.slice(Math.max(0, index - period + 1), index + 1);
    const avg = mid[index] || 0;
    const variance = slice.reduce((sum, value) => sum + (value - avg) ** 2, 0) / Math.max(slice.length, 1);
    return avg + Math.sqrt(variance) * 2;
  });
  const lower = values.map((_, index) => (mid[index] || 0) * 2 - upper[index]);
  return { mid, upper, lower };
}

function kdjSeries(rows) {
  const k = [];
  const d = [];
  const j = [];
  rows.forEach((row, index) => {
    const slice = rows.slice(Math.max(0, index - 8), index + 1);
    const low = Math.min(...slice.map((item) => Number(item.low) || Number(item.close) || 0));
    const high = Math.max(...slice.map((item) => Number(item.high) || Number(item.close) || 0));
    const rsv = high === low ? 50 : (((Number(row.close) || 0) - low) / (high - low)) * 100;
    k[index] = (index ? k[index - 1] * 2 : 50 * 2) / 3 + rsv / 3;
    d[index] = (index ? d[index - 1] * 2 : 50 * 2) / 3 + k[index] / 3;
    j[index] = 3 * k[index] - 2 * d[index];
  });
  return { k, d, j };
}

function vwapSeries(rows) {
  let amountSum = 0;
  let volumeSum = 0;
  return rows.map((row) => {
    amountSum += Number(row.amount) || (Number(row.close) || 0) * (Number(row.volume) || 0);
    volumeSum += Number(row.volume) || 0;
    return volumeSum ? amountSum / volumeSum : Number(row.close) || 0;
  });
}

function quoteIndicatorTrace(name, rows, x, closes, yaxis) {
  const volumes = rows.map((row) => Number(row.volume) || 0);
  if (name === "VOL") {
    return [{ x, y: volumes, type: "bar", name: `VOL M${quoteVolParams.m1}/${quoteVolParams.m2}`, yaxis, marker: { color: "#94a3b8" } }];
  }
  if (name === "MACD") {
    const macd = macdSeries(closes);
    return [
      { x, y: macd.hist, type: "bar", name: "MACD", yaxis, marker: { color: macd.hist.map((value) => (value >= 0 ? "#dc2626" : "#15803d")) } },
      { x, y: macd.dif, type: "scatter", mode: "lines", name: "DIF", yaxis, line: { color: "#2563eb" } },
      { x, y: macd.dea, type: "scatter", mode: "lines", name: "DEA", yaxis, line: { color: "#b45309" } },
    ];
  }
  if (name === "KDJ") {
    const kdj = kdjSeries(rows);
    return [
      { x, y: kdj.k, type: "scatter", mode: "lines", name: "K", yaxis },
      { x, y: kdj.d, type: "scatter", mode: "lines", name: "D", yaxis },
      { x, y: kdj.j, type: "scatter", mode: "lines", name: "J", yaxis },
    ];
  }
  if (name === "RSI") return [{ x, y: rsiSeries(closes), type: "scatter", mode: "lines", name: "RSI", yaxis, line: { color: "#7c3aed" } }];
  if (name === "成交额") return [{ x, y: rows.map((row) => yi(row.amount || 0)), type: "bar", name: "成交额(亿)", yaxis, marker: { color: "#0f766e" } }];
  if (name === "换手率") return [{ x, y: rows.map((row) => Number(row.turnover) || 0), type: "scatter", mode: "lines+markers", name: "换手率", yaxis }];
  if (name === "VWAP") return [{ x, y: vwapSeries(rows), type: "scatter", mode: "lines", name: "VWAP", yaxis, line: { color: "#db2777" } }];
  if (name === "BOLL") {
    const boll = bollSeries(closes);
    return [
      { x, y: boll.upper, type: "scatter", mode: "lines", name: "BOLL上轨", yaxis, line: { color: "#94a3b8" } },
      { x, y: boll.mid, type: "scatter", mode: "lines", name: "BOLL中轨", yaxis, line: { color: "#2563eb" } },
      { x, y: boll.lower, type: "scatter", mode: "lines", name: "BOLL下轨", yaxis, line: { color: "#94a3b8" } },
    ];
  }
  return [];
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
    const marketRows = filteredMarketBreadth();
    Plotly.newPlot("amountChart", [{ x: marketRows.map((d) => d[0]), y: marketRows.map((d) => d[1]), type: "scatter", mode: "lines+markers", line: { color: "#2563eb" } }], baseLayout, plotConfig);
    Plotly.newPlot("breadthChart", [{ x: marketRows.map((d) => d[0]), y: marketRows.map((d) => d[2]), type: "scatter", mode: "lines+markers", line: { color: "#0f766e" } }], baseLayout, plotConfig);
    const distribution = data.limitDistribution || {};
    Plotly.newPlot("limitChart", [{ x: ["上涨", "下跌", "平盘", "涨停", "跌停"], y: [distribution.up || 0, distribution.down || 0, distribution.flat || 0, distribution.limitUp || 0, distribution.limitDown || 0], type: "bar", marker: { color: ["#dc2626", "#15803d", "#64748b", "#b91c1c", "#166534"] } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
    Plotly.newPlot("indexChart", [{ x: data.indices.map((d) => d[0]), y: data.indices.map((d) => d[1]), type: "bar", marker: { color: data.indices.map((d) => (d[1] >= 0 ? "#dc2626" : "#15803d")) } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
  }
  if (currentPage === "sectors") {
    const chartRows = activeSectorRows().slice(0, 30);
    if (sectorChartType === "pie") {
      const fundValues = chartRows.map((d) => Math.abs(d.fund));
      const pctValues = chartRows.map((d) => Math.abs(d.pct));
      Plotly.newPlot("sectorFundChart", [{ labels: chartRows.map((d) => d.name), values: fundValues, type: "pie", hole: 0.45 }], baseLayout, plotConfig);
      Plotly.newPlot("sectorChangeChart", [{ labels: chartRows.map((d) => d.name), values: pctValues, type: "pie", hole: 0.45 }], baseLayout, plotConfig);
    } else {
      Plotly.newPlot("sectorFundChart", [{ x: chartRows.map((d) => d.name), y: chartRows.map((d) => d.fund), type: "bar", marker: { color: chartRows.map((d) => (d.fund >= 0 ? "#dc2626" : "#15803d")) } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
      Plotly.newPlot("sectorChangeChart", [{ x: chartRows.map((d) => d.name), y: chartRows.map((d) => d.pct), type: "bar", marker: { color: "#b45309" } }], { ...baseLayout, xaxis: { type: "category" } }, plotConfig);
    }
  }
  if (currentPage === "quote") {
    const stock = data.stocks.find((item) => item.code.includes(selectedQuote)) || data.stocks[0];
    const quoteRows = activeQuoteRows(stock);
    const x = quoteRows.map((row) => row.time || row.date);
    const close = quoteRows.map((row) => Number(row.close) || 0);
    const mainTrace =
      quoteChartMode === "minute"
        ? { x, y: close, type: "scatter", mode: "lines", name: "1分钟", line: { color: "#2563eb", width: 2 } }
        : {
            x,
            open: quoteRows.map((row) => Number(row.open) || Number(row.close) || 0),
            high: quoteRows.map((row) => Number(row.high) || Number(row.close) || 0),
            low: quoteRows.map((row) => Number(row.low) || Number(row.close) || 0),
            close,
            type: "candlestick",
            name: "日K",
            increasing: { line: { color: "#dc2626" } },
            decreasing: { line: { color: "#15803d" } },
          };
    const traces = [
      mainTrace,
      { x, y: movingAverage(close, 5), type: "scatter", mode: "lines", name: "MA5", line: { color: "#b45309", width: 1.5 } },
      { x, y: movingAverage(close, 20), type: "scatter", mode: "lines", name: "MA20", line: { color: "#0f766e", width: 1.5 } },
      ...(quoteChartMode === "minute" ? [{ x, y: quoteRows.map((row) => Number(row.avgPrice) || null), type: "scatter", mode: "lines", name: "均价", line: { color: "#64748b", dash: "dot" } }] : []),
      ...quoteIndicatorTrace(quoteIndicator1, quoteRows, x, close, "y2"),
      ...quoteIndicatorTrace(quoteIndicator2, quoteRows, x, close, "y3"),
    ];
    const shapes = quoteDrawings
      .filter((item) => item.code === stock.code && Number(item.price))
      .map((item) => ({
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        yref: "y",
        y0: Number(item.price),
        y1: Number(item.price),
        line: { color: "#7c3aed", width: 1, dash: item.tool === "水平线" ? "solid" : "dot" },
      }));
    Plotly.newPlot(
      "quoteChart",
      traces,
      {
        ...baseLayout,
        showlegend: true,
        height: 470,
        xaxis: { rangeslider: { visible: false } },
        yaxis: { domain: [0.42, 1], title: "价格" },
        yaxis2: { domain: [0.22, 0.36], title: quoteIndicator1 },
        yaxis3: { domain: [0, 0.16], title: quoteIndicator2 },
        shapes,
      },
      plotConfig
    );
  }
}

mount();
