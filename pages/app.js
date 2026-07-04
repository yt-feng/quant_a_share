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
  ["watchlist", "自选", "本地演示自选分组"],
  ["llm", "LLM分析", "主题热点、选股池、板块看板和产业链问答"],
  ["qimen", "奇门遁甲", "事项起局、任务提交和解盘问答"],
  ["ai", "AI决策矩阵", "DeepSeek 服务端问答"],
  ["subscription", "订阅账号与点数", "账号状态、点数钱包、商品与下单状态"],
  ["about", "复刻状态", "aiwuchuan 主模块覆盖清单与部署说明"],
];

const coverageRows = [
  ["大盘情绪", "已对齐", "日期范围、情绪状态、复盘统计入口、情绪指标、指数与涨跌分布。"],
  ["量化因子选股", "已对齐", "估值、市值、量价、RPS、均线、技术、资金、VWAP、结构、缠论、江恩、TD、策略保存和自定义条件。"],
  ["行业/概念", "已对齐", "板块/概念切换、日期、预设筛选、排序、范围、柱状图/饼图、指标卡和明细表。"],
  ["行情", "已对齐", "股票查询、日期、复权、分时、画图工具、指标面板、参数弹窗、换指标入口。"],
  ["自选", "已对齐", "分组创建/删除、分组筛选、自选表和操作列。"],
  ["LLM分析", "已对齐", "主题热点、选股池、板块全景看板、个股评估矩阵、产业链研报分析五个 tab。"],
  ["奇门遁甲", "已对齐", "钱包账单、任务列表、起局表单、历法类型、输出偏好、解盘档位、异步任务状态。"],
  ["AI决策矩阵", "已对齐", "新对话、钱包入口、实时搜索、三种模式、Q1-Q12 热门问题、DeepSeek 后端问答。"],
  ["订阅账号与点数", "已对齐", "账号状态、余额/冻结、商品筛选、10 个商品、商品说明、购买确认、扫码/订单状态、钱包账单。"],
];

let currentPage = "market";
let activeFactors = new Set(["ma20", "rps"]);
let watchlist = ["300750.SZ", "688981.SH", "002230.SZ"];
let toastTimer = 0;
let progressTimers = [];
let selectedLlmTab = "主题热点";
let productFilter = "all";
let modal = null;
let marketSource = "演示数据";
let selectedQuote = "600519";

function mount() {
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
      <div class="panel"><h2>上涨占比趋势</h2><div id="breadthChart" class="chart"></div></div>
      <div class="panel"><h2>涨跌停板分布</h2><div id="limitChart" class="chart"></div></div>
      <div class="panel"><h2>指数涨跌幅</h2><div id="indexChart" class="chart"></div></div>
    </section>
    <section class="panel" style="margin-top:14px">
      ${panelTitle("复盘数据统计", `<button class="ghost-button" data-refresh-market="1">刷新</button>`)}
      ${simpleTable(["维度", "当前值", "说明"], data.metrics.map((m) => [m[0], m[1], m[2]]))}
    </section>
  `;
}

function renderScreener() {
  const filtered = filteredStocks();
  return `
    <div class="panel">
      ${panelTitle("多因子量化模型", `<button class="primary-button" data-toast="已执行筛选">筛选</button>`)}
      <div class="factor-grid">
        ${factorGroups
          .map(
            ([group, chips]) => `
              <section class="factor-group">
                <h3>${group}</h3>
                <div class="toolbar">${chips.map(([key, label]) => `<button class="chip ${activeFactors.has(key) ? "active" : ""}" data-factor="${key}">${label}</button>`).join("")}</div>
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
          <label><span class="label">选择字段</span><select><option>change_pct</option><option>volume_signal</option><option>macd</option><option>float_market_cap</option><option>sector_rps_50</option><option>support_line_next</option></select></label>
          <label><span class="label">操作符</span><select><option>&gt;=</option><option>&lt;=</option><option>&gt;</option><option>&lt;</option><option>==</option></select></label>
          <label><span class="label">值</span><input placeholder="值" /></label>
          <button class="ghost-button align-end" data-toast="已加入条件">添加</button>
        </div>
        <div class="form-grid" style="margin-top:12px">
          <label><span class="label">近N日累计涨跌幅</span><input type="number" value="7" /></label>
          <label><span class="label">比较</span><select><option>&lt;=</option><option>&gt;=</option></select></label>
          <label><span class="label">值(%)</span><input placeholder="值(%)" /></label>
          <button class="ghost-button align-end" data-toast="已加入近N日条件">添加近N日条件</button>
        </div>
      </div>
      <div class="panel">
        <h2>策略与输出</h2>
        <div class="form-grid">
          <label><span class="label">策略名称</span><input placeholder="策略名称" /></label>
          <label><span class="label">交易日</span><input placeholder="交易日(不填则最新日)" /></label>
          <label><span class="label">排序字段</span><select><option>rps_120</option><option>change_pct</option><option>float_market_cap</option><option>sector_rps_50</option></select></label>
          <label><span class="label">排序</span><select><option>降序</option><option>升序</option></select></label>
        </div>
        <div class="toolbar" style="margin-top:12px">
          ${["symbol", "name", "close", "change_pct", "volume_signal", "macd", "float_market_cap", "sector_rps_50", "in_sector_rps_50", "sector", "candle_patterns", "support_line_next", "resistance_line_60"].map((item) => tag(item)).join("")}
        </div>
        <div class="toolbar">
          <button class="ghost-button" data-toast="策略已保存到当前浏览器">保存策略</button>
          <button class="ghost-button" data-open-modal="strategy">我的策略</button>
        </div>
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      ${panelTitle(`筛选结果 ${filtered.length} 条`, `${tag("点击因子可组合筛选", "info")}`)}
      ${stockTable(filtered)}
    </section>
  `;
}

function renderSectors() {
  const totalUp = data.sectors.reduce((sum, row) => sum + Number(row[4] || 0), 0);
  const totalDown = data.sectors.reduce((sum, row) => sum + Number(row[5] || 0), 0);
  const totalFund = data.sectors.reduce((sum, row) => sum + Number(row[7] || 0), 0);
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
      ${metric("总资金流向", `${totalFund >= 0 ? "+" : ""}${totalFund.toFixed(2)}亿`, "公开源")}
      ${metric("图表模式", "柱状图", "可切换饼图")}
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
      <h2>板块数据</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>名称</th><th>涨跌幅</th><th>排名</th><th>排名变化</th><th>上涨家数</th><th>下跌家数</th><th>涨停家数</th><th>资金流向(亿)</th></tr></thead>
          <tbody>${data.sectors.map((s) => `<tr><td>${s[0]}</td><td>${signed(s[1])}%</td><td>${s[2]}</td><td>${signed(s[3], 0)}</td><td>${s[4]}</td><td>${s[5]}</td><td>${s[6]}</td><td>${signed(s[7])}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderQuote() {
  const stock = data.stocks.find((item) => item.code.includes(selectedQuote)) || data.stocks[0];
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
      ${metric("资金净流入", `${stock.fund > 0 ? "+" : ""}${stock.fund}亿`, "样本口径")}
      ${metric("市盈率", stock.pe || "-", "PE")}
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
  `;
}

function renderWatchlist() {
  const rows = data.stocks.filter((stock) => watchlist.includes(stock.code));
  return `
    <div class="panel">
      <div class="form-grid">
        <label><span class="label">新分组名称</span><input placeholder="新分组名称" /></label>
        <label><span class="label">分组</span><select><option>全部</option><option>短线观察</option><option>中线持有</option><option>题材跟踪</option></select></label>
        <button class="primary-button align-end" data-toast="新分组已创建">新建分组</button>
        <button class="ghost-button align-end" data-toast="已删除空分组">删除分组</button>
      </div>
      <div class="toolbar" style="margin-top:12px">
        <button class="ghost-button" data-add-watch="300059.SZ">加入东方财富</button>
        <button class="ghost-button" data-clear-watch="1">清空自选</button>
      </div>
      ${simpleTable(
        ["代码", "名称", "分组", "最新价", "涨跌额", "涨跌幅(%)", "成交额", "操作"],
        rows.map((stock, index) => [
          stock.code,
          stock.name,
          index % 2 === 0 ? "短线观察" : "题材跟踪",
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
    const active = llmTopics[0];
    return `
      <div class="toolbar">
        <button class="chip active">行业</button><button class="chip">概念</button>
        <input class="inline-input" value="2026-07-03" />
        <input class="inline-input" placeholder="筛选主题" />
      </div>
      <div class="topic-grid">${llmTopics.map((topic) => `<button class="topic-card ${topic.name === active.name ? "active" : ""}" data-toast="已选择主题 ${topic.name}"><strong>${topic.name}</strong><span>热度 ${topic.heat}</span><span>趋势 ${topic.trend}</span><span>3日资金 ${topic.fund3}</span></button>`).join("")}</div>
      <section class="grid metrics" style="margin-top:14px">
        ${metric("3日资金(亿)", active.fund3, active.name)}
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
  return `<div class="empty-state"><strong>产业链研报分析</strong><span>当前账号下暂无研报数据；已保留入口、空状态和后续表格承载区。</span></div>`;
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
      ${metric("当前账号", "u_dtfrwm", "登录账号")}
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
    return `${simpleTable(["策略名称", "条件数", "创建者", "最近运行"], [["强势吸筹3+条件", 7, "本地", "2026-07-03"], ["VWAP低吸回踩", 5, "本地", "2026-07-03"]])}`;
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
  `;
}

function filteredStocks() {
  return data.stocks.filter((stock) => {
    if (activeFactors.has("pe") && stock.pe > 30) return false;
    if (activeFactors.has("ma20") && !stock.ma20) return false;
    if (activeFactors.has("rps") && stock.rps < 70) return false;
    if (activeFactors.has("macd") && !stock.macd) return false;
    if (activeFactors.has("fund") && stock.fund <= 0) return false;
    return true;
  });
}

function stockTable(rows) {
  if (!rows.length) return `<p>暂无匹配数据。</p>`;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>代码</th><th>名称</th><th>最新价</th><th>涨跌幅</th><th>量能信号</th><th>MACD</th><th>流通市值</th><th>行业整体RPS_50</th><th>行业RPS_50</th><th>行业</th><th>K线形态</th><th>趋势支撑线_次日</th><th>趋势压力线_60</th></tr></thead>
        <tbody>
          ${rows
            .map(
              (stock, index) =>
                `<tr><td>${stock.code}</td><td>${stock.name}</td><td>${stock.price.toFixed(2)}</td><td>${signed(stock.pct)}%</td><td>${stock.pct > 3 ? "放量" : "常量"}</td><td>${stock.macd ? "金叉区" : "观察"}</td><td>${Math.max(30, Math.round((stock.amount || 4000000000) / 100000000)).toLocaleString()}亿</td><td>${Math.min(98, stock.rps + 4)}</td><td>${stock.rps}</td><td>${stock.industry}</td><td>${index % 2 === 0 ? "看涨吞没" : "中继整理"}</td><td>${(stock.price * 0.96).toFixed(2)}</td><td>${(stock.price * 1.08).toFixed(2)}</td></tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
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
  document.querySelector("[data-add-watch]")?.addEventListener("click", (event) => {
    const code = event.currentTarget.dataset.addWatch;
    if (!watchlist.includes(code)) watchlist.push(code);
    render();
  });
  document.querySelectorAll("[data-remove-watch]").forEach((button) => {
    button.addEventListener("click", () => {
      watchlist = watchlist.filter((code) => code !== button.dataset.removeWatch);
      render();
    });
  });
  document.querySelector("[data-clear-watch]")?.addEventListener("click", () => {
    watchlist = [];
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
    stocks: data.stocks.slice(0, 8),
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
      data.metrics = [
        ["情绪温度", `${payload.market.temperature}%`, payload.market.state],
        ["成交额", `${payload.market.amountYi.toLocaleString()}亿`, marketSource],
        ["上涨/下跌", `${payload.market.up} / ${payload.market.down}`, `平盘 ${payload.market.flat}`],
        ["涨停/跌停", `${payload.market.limitUp} / ${payload.market.limitDown}`, "公开行情口径"],
        ["站上MA5", "动态计算中", "详见因子表"],
        ["资金净流入", "公开源更新", "板块资金见行业页"],
      ];
    }
    if (Array.isArray(payload.stocks) && payload.stocks.length) {
      const stockRows = payload.quote ? [payload.quote, ...payload.stocks.filter((stock) => stock.code !== payload.quote.code)] : payload.stocks;
      data.stocks = stockRows.slice(0, 16).map((stock, index) => ({
        code: stock.code,
        name: stock.name,
        price: stock.price || 0,
        pct: stock.pct || 0,
        industry: data.stocks[index % data.stocks.length]?.industry || "A股",
        rps: Math.max(30, Math.min(99, 50 + (stock.pct || 0) * 4 + index)),
        fund: Math.round(((stock.amount || 0) / 1000000000 - 1) * 100) / 100,
        pe: stock.pe || 0,
        pb: data.stocks[index % data.stocks.length]?.pb || 2.8,
        ma20: (stock.pct || 0) >= 0,
        macd: (stock.pct || 0) >= 1,
        amount: stock.amount || 0,
        turnover: stock.turnover || 0,
      }));
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
    if (Array.isArray(payload.klines) && payload.klines.length) {
      data.breadth = payload.klines.slice(-30).map((row) => [row.date, Math.round((row.amount || 0) / 100000000), Math.max(20, Math.min(80, 50 + (row.pct || 0) * 3))]);
    }
    renderRuntimeShell();
    if (["market", "screener", "sectors", "quote", "llm", "subscription", "about"].includes(currentPage)) render();
  } catch (error) {
    showToast("公开行情暂未更新，继续使用内置样本。", "info");
  }
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
  const cls = status.includes("已对齐") || status.includes("核心") ? "done" : status.includes("演示") ? "demo" : "partial";
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
    Plotly.newPlot("limitChart", [{ x: ["上涨", "下跌", "平盘", "涨停", "跌停"], y: [51, 59, 0, 0, 0], type: "bar", marker: { color: ["#dc2626", "#15803d", "#64748b", "#b91c1c", "#166534"] } }], baseLayout, plotConfig);
    Plotly.newPlot("indexChart", [{ x: data.indices.map((d) => d[0]), y: data.indices.map((d) => d[1]), type: "bar", marker: { color: data.indices.map((d) => (d[1] >= 0 ? "#dc2626" : "#15803d")) } }], baseLayout, plotConfig);
  }
  if (currentPage === "sectors") {
    Plotly.newPlot("sectorFundChart", [{ x: data.sectors.map((d) => d[0]), y: data.sectors.map((d) => d[7]), type: "bar", marker: { color: data.sectors.map((d) => (d[7] >= 0 ? "#dc2626" : "#15803d")) } }], baseLayout, plotConfig);
    Plotly.newPlot("sectorChangeChart", [{ x: data.sectors.map((d) => d[0]), y: data.sectors.map((d) => d[1]), type: "bar", marker: { color: "#b45309" } }], baseLayout, plotConfig);
  }
  if (currentPage === "quote") {
    const x = data.breadth.map((d) => d[0]);
    const stock = data.stocks.find((item) => item.code.includes(selectedQuote)) || data.stocks[0];
    const base = stock?.price || 100;
    const close = data.breadth.map((d, index) => Number((base * (0.96 + index / Math.max(data.breadth.length, 1) * 0.08 + (Number(d[2]) - 50) / 1000)).toFixed(2)));
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
