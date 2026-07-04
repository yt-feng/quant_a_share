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

const pages = [
  ["market", "大盘情绪", "情绪温度、成交额、涨跌比与指数表现"],
  ["screener", "量化因子选股", "估值、趋势、资金和技术信号组合筛选"],
  ["sectors", "板块与概念", "板块排名、资金流向和涨跌分布"],
  ["quote", "行情", "单股行情、指标和操作计划"],
  ["watchlist", "自选", "本地演示自选分组"],
  ["ai", "AI决策矩阵", "静态规则版问答，服务端版可接 DeepSeek"],
  ["about", "Pages说明", "GitHub Pages 部署说明"],
];

let currentPage = "market";
let activeFactors = new Set(["ma20", "rps"]);
let watchlist = ["300750.SZ", "688981.SH", "002230.SZ"];

function mount() {
  renderNav();
  render();
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
      <table>
        <thead><tr><th>名称</th><th>涨跌幅</th><th>排名</th><th>排名变化</th><th>上涨家数</th><th>下跌家数</th><th>涨停家数</th><th>资金流向(亿)</th></tr></thead>
        <tbody>${data.sectors.map((s) => `<tr><td>${s[0]}</td><td>${signed(s[1])}%</td><td>${s[2]}</td><td>${signed(s[3], 0)}</td><td>${s[4]}</td><td>${s[5]}</td><td>${s[6]}</td><td>${signed(s[7])}</td></tr>`).join("")}</tbody>
      </table>
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
          <button class="primary-button" data-answer="1">生成回答</button>
        </div>
        <p class="notice">这是 GitHub Pages 静态规则版。DeepSeek 需要后端接口承载密钥，不能放在浏览器端。</p>
      </div>
      <div class="panel">
        <h2>结果</h2>
        <div id="aiAnswer" class="answer">点击“生成回答”查看分析。</div>
      </div>
    </section>
  `;
}

function renderAbout() {
  return `
    <section class="grid two">
      <div class="panel">
        <h2>部署方式</h2>
        <p>本页面由 GitHub Actions 上传 <code>pages/</code> 静态目录，再通过 GitHub Pages 发布。</p>
        <p>Streamlit 版本仍保留在仓库里，适合本地或服务器运行 TuShare 实时数据。</p>
      </div>
      <div class="panel">
        <h2>后端扩展位</h2>
        <p>需要 DeepSeek 实时问答时，用 Vercel / Cloudflare Workers / FastAPI 提供 API route，并把密钥放到服务端 secret。</p>
        <p>Pages 前端只调用自己的后端接口，不直接持有密钥。</p>
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
    <table>
      <thead><tr><th>代码</th><th>名称</th><th>最新价</th><th>涨跌幅</th><th>行业</th><th>RPS50</th><th>资金净流入</th><th>MACD</th></tr></thead>
      <tbody>
        ${rows.map((stock) => `<tr><td>${stock.code}</td><td>${stock.name}</td><td>${stock.price.toFixed(2)}</td><td>${signed(stock.pct)}%</td><td>${stock.industry}</td><td>${stock.rps}</td><td>${signed(stock.fund)}亿</td><td>${stock.macd ? "金叉区" : "观察"}</td></tr>`).join("")}
      </tbody>
    </table>
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
  document.querySelector("[data-answer]")?.addEventListener("click", () => {
    const mode = document.querySelector("#mode").value;
    const answer = `结论：宁德时代当前可跟踪试错。

- 模式：${mode}
- 当前价：268.40，RPS50：88，资金净流入：+14.20亿
- 触发条件：放量站稳 268.40 上方，或回踩 260.35 附近不破
- 失效条件：跌破 260.35 且无法快速收回
- 仓位区间：20%-35%
- 观察点：新能源车板块强度、成交额、MA20、资金净流入是否同向`;
    document.querySelector("#aiAnswer").textContent = answer;
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
