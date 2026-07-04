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

const pages = [
  ["market", "大盘情绪", "情绪温度、成交额、涨跌比与指数表现"],
  ["screener", "量化因子选股", "估值、趋势、资金和技术信号组合筛选"],
  ["sectors", "行业/概念", "板块排名、资金流向和涨跌分布"],
  ["quote", "行情", "单股行情、指标和操作计划"],
  ["watchlist", "自选", "本地演示自选分组"],
  ["llm", "LLM分析", "主题热点、选股池、板块看板和产业链问答"],
  ["qimen", "奇门遁甲", "事项起局、任务提交和解盘问答"],
  ["ai", "AI决策矩阵", "DeepSeek 服务端问答"],
  ["about", "复刻状态", "aiwuchuan 主模块覆盖进度与部署说明"],
];

const coverageRows = [
  ["大盘情绪", "核心覆盖", "情绪温度、成交额、涨跌比、涨跌停、指数趋势；待接多源实时复盘统计。"],
  ["量化因子选股", "核心覆盖", "估值、市值、换手、量比、均线、RPS、MACD/KDJ/RSI、VWAP 等因子骨架；待补完整策略市场、保存/共享。"],
  ["行业/概念", "核心覆盖", "行业与概念排名、资金流、涨跌分布；待接 AKShare 实时行业/概念明细。"],
  ["行情", "部分覆盖", "单股 K 线、指标和操作计划已做；待补 1 分钟分时、FIB/GANN、指标参数弹窗。"],
  ["自选", "部分覆盖", "分组和自选列表演示已做；待补账号级云端持久化。"],
  ["LLM分析", "部分覆盖", "主题热点、选股池、板块看板、产业链问答入口已做；待补完整五个 tab 的真实表格联动。"],
  ["奇门遁甲", "部分覆盖", "起局表单、同步起局、任务提交、结果区已做；待补点数扣费、任务历史和完整排盘详情。"],
  ["AI决策矩阵", "核心覆盖", "DeepSeek 后端问答、热门问题模式、行情上下文已接；待补对话历史和实时搜索开关。"],
  ["订阅账号与点数", "演示覆盖", "商品/点数账本方向已覆盖；真实支付、订单核销、钱包账单还没有接生产流程。"],
];

let currentPage = "market";
let activeFactors = new Set(["ma20", "rps"]);
let watchlist = ["300750.SZ", "688981.SH", "002230.SZ"];
let toastTimer = 0;
let progressTimers = [];

function mount() {
  renderRuntimeShell();
  renderNav();
  render();
  checkBackendStatus();
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
    about: renderAbout,
  };
  view.innerHTML = renderers[currentPage]();
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

function renderMarket() {
  return `
    <section class="grid metrics">${data.metrics.map((m) => metric(...m)).join("")}</section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel"><h2>大盘成交额趋势</h2><div id="amountChart" class="chart"></div></div>
      <div class="panel"><h2>上涨占比趋势</h2><div id="breadthChart" class="chart"></div></div>
      <div class="panel"><h2>涨跌停板分布</h2><div id="limitChart" class="chart"></div></div>
      <div class="panel"><h2>指数涨跌幅</h2><div id="indexChart" class="chart"></div></div>
    </section>
  `;
}

function renderScreener() {
  const chips = [
    ["pe", "市盈率≤30"],
    ["ma20", "站上MA20"],
    ["rps", "RPS50≥70"],
    ["macd", "MACD金叉"],
    ["fund", "主力资金流入"],
  ];
  const filtered = filteredStocks();
  return `
    <div class="panel">
      <div class="toolbar">
        ${chips.map(([key, label]) => `<button class="chip ${activeFactors.has(key) ? "active" : ""}" data-factor="${key}">${label}</button>`).join("")}
      </div>
      <p>筛选结果：${filtered.length} 条。点击因子可组合筛选。</p>
      ${stockTable(filtered)}
    </div>
  `;
}

function renderSectors() {
  return `
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
  const stock = data.stocks[0];
  return `
    <section class="grid metrics">
      ${metric("股票", `${stock.name}`, stock.code)}
      ${metric("现价", stock.price.toFixed(2), `${stock.pct >= 0 ? "+" : ""}${stock.pct}%`)}
      ${metric("行业", stock.industry, "样本口径")}
      ${metric("RPS50", stock.rps, "强度分")}
      ${metric("资金净流入", `${stock.fund > 0 ? "+" : ""}${stock.fund}亿`, "样本口径")}
      ${metric("技术状态", stock.ma20 && stock.macd ? "偏强" : "观察", "MA20 / MACD")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel"><h2>K线走势</h2><div id="quoteChart" class="chart"></div></div>
      <div class="panel">
        <h2>操作计划</h2>
        <div class="answer">结论：${stock.name} 可跟踪试错。

- 触发条件：放量站稳 ${stock.price.toFixed(2)} 上方，或回踩 ${Math.round(stock.price * 0.97 * 100) / 100} 附近不破
- 失效条件：跌破短线支撑且无法快速收回
- 仓位区间：20%-35%
- 观察点：量比、MA20、板块RPS、资金净流入是否同向</div>
      </div>
    </section>
  `;
}

function renderWatchlist() {
  const rows = data.stocks.filter((stock) => watchlist.includes(stock.code));
  return `
    <div class="panel">
      <div class="toolbar">
        <button class="ghost-button" data-add-watch="300059.SZ">加入东方财富</button>
        <button class="ghost-button" data-clear-watch="1">清空自选</button>
      </div>
      ${stockTable(rows)}
    </div>
  `;
}

function renderAi() {
  return `
    <section class="grid two">
      <div class="panel">
        <h2>向 AI 决策矩阵提问</h2>
        <label><span class="label">问题</span><textarea id="question">结合实时行情，分析宁德时代现在能不能买，按短线3-5天思路给我操作计划。</textarea></label>
        <div class="toolbar" style="margin-top:12px">
          <select id="mode"><option>快速模式</option><option>专家模式</option><option>深度思考</option></select>
          <button class="primary-button" data-chat-module="ai_matrix" data-target="aiAnswer">生成回答</button>
        </div>
        <p class="notice">Vercel 后端会读取服务端 DEEPSEEK_API_KEY，浏览器端不保存密钥。</p>
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
    <section class="grid two">
      <div class="panel">
        <h2>LLM分析</h2>
        <div class="toolbar">
          <span class="chip active">主题热点</span>
          <span class="chip active">选股池</span>
          <span class="chip active">板块全景看板</span>
          <span class="chip active">产业链研报分析</span>
        </div>
        <label><span class="label">研究问题</span><textarea id="question">今天哪些板块资金在持续流入？结合主题热点、行业轮动和样本股票池，给我低吸观察顺序。</textarea></label>
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
    <section class="grid two" style="margin-top:14px">
      <div class="panel"><h2>主题热度样本</h2>${sectorMiniTable()}</div>
      <div class="panel"><h2>选股池样本</h2>${stockTable(filteredStocks().slice(0, 5))}</div>
    </section>
  `;
}

function renderQimen() {
  return `
    <section class="grid two">
      <div class="panel">
        <h2>奇门遁甲</h2>
        <div class="form-grid">
          <label><span class="label">事项类型</span><select id="itemType"><option>金融</option><option>工作</option><option>合作</option></select></label>
          <label><span class="label">当前阶段</span><select id="stage"><option>在考虑阶段</option><option>已持有/已开始</option><option>准备执行</option></select></label>
          <label><span class="label">城市</span><input id="city" value="上海" /></label>
          <label><span class="label">解盘档位</span><select id="mode"><option>深入分析</option><option>快速结论</option></select></label>
        </div>
        <label style="margin-top:12px"><span class="label">事情摘要</span><textarea id="question">我最近在看一只科技股，已经涨了一段时间，现在担心追高，但又怕错过后面的上涨，想判断现在适不适合进场。</textarea></label>
        <div class="toolbar" style="margin-top:12px">
          <button class="ghost-button" data-fill-now="1">同步起局</button>
          <button class="primary-button" data-chat-module="qimen" data-target="qimenAnswer">提交解盘任务</button>
        </div>
      </div>
      <div class="panel">
        <h2>结果与详情</h2>
        <div id="qimenAnswer" class="answer">请先起局，或直接提交解盘任务。</div>
      </div>
    </section>
  `;
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
        <thead><tr><th>代码</th><th>名称</th><th>最新价</th><th>涨跌幅</th><th>行业</th><th>RPS50</th><th>资金净流入</th><th>MACD</th></tr></thead>
        <tbody>
          ${rows.map((stock) => `<tr><td>${stock.code}</td><td>${stock.name}</td><td>${stock.price.toFixed(2)}</td><td>${signed(stock.pct)}%</td><td>${stock.industry}</td><td>${stock.rps}</td><td>${signed(stock.fund)}亿</td><td>${stock.macd ? "金叉区" : "观察"}</td></tr>`).join("")}
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
  document.querySelector("[data-clear-watch]")?.addEventListener("click", () => {
    watchlist = [];
    render();
  });
}

function contextForModule(moduleName) {
  return {
    moduleName,
    metrics: data.metrics,
    sectors: data.sectors.slice(0, 8),
    stocks: data.stocks.slice(0, 8),
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
    source.textContent = "DeepSeek 后端";
    note.textContent = "问答请求经由 /api/chat 处理。";
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
  const cls = status.includes("核心") ? "done" : status.includes("演示") ? "demo" : "partial";
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
    const close = [243, 248, 251, 249, 255, 260, 258, 263, 266, 268.4];
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
