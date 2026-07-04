# Quant A Share

一个用多源公开金融数据复刻 aiwuchuan 核心投研能力的本地工作台。

## GitHub Pages

静态演示版地址：

https://yt-feng.github.io/quant_a_share/

Pages 由 `.github/workflows/pages.yml` 自动部署，静态文件位于 `pages/`。这个版本不包含服务端密钥；需要 TuShare 实时数据时运行 Streamlit，本地或服务器端再读取 `.env`。

## Vercel 后端版

Vercel 版提供 `/api/chat`、`/api/health` 和 `/api/market`，前端问答模块会调用服务端 DeepSeek API，行情模块会由云端函数拉取公开行情源。

线上地址：

https://quant-a-share.vercel.app/

需要配置环境变量：

```bash
DEEPSEEK_API_KEY=你的 DeepSeek key
DEEPSEEK_MODEL=deepseek-chat
```

本地检查：

```bash
npm run check:pages
```

云端快照脚本：

```bash
npm run cache:market
```

## 数据源策略

项目后续按“免费公开源优先、TuShare 作为增强源”的方式接数据：

- `Eastmoney public endpoint`：Vercel `/api/market` 当前用于指数、行业/概念板块、单股 K 线、涨停/炸板/强势股池、ETF 资金榜、东财人气榜、个股资金流、北向资金、公告等。
- `Eastmoney report API`：Vercel `/api/market` 当前用于近 30 日行业研报、宏观策略研报，供 LLM 产业链研报分析 tab 和问答上下文使用。
- `Sina public endpoint`：当前用于全 A 股票池兜底、行业/概念板块二源兜底和财务报告关键指标。
- `Tencent quote`：当前作为单股报价兜底源，东财单股 quote 不通时仍能返回价格、涨跌幅、市值、PE/PB 等核心字段。
- `AKShare / efinance`：作为公开接口地图使用；生产版已把可用的东财/新浪热路径移植到 Node serverless，包括行业/概念板块、ETF、涨停池、人气榜、资金流、公告和财务摘要。
- `BaoStock`：通过 GitHub Actions 批量生成 `pages/data/baostock-cache.json`，当前会从市场快照扩展到最多 24 只股票，缓存历史 K 线、换手率、PE/PB/PS/PCF、MA 和区间收益。
- `Financial cache`：通过 GitHub Actions 批量生成 `pages/data/financial-cache.json`，默认覆盖最多 40 只股票，缓存营收、利润、EPS、ROE、毛利率、资产负债率等财报字段。
- `yfinance / Yahoo chart`：生产版已直接接 Yahoo chart HTTP，作为 A 股 `.SS/.SZ`、港美股和 ETF 的全球行情/K 线备份。
- `GitHub Actions market cache`：`.github/workflows/market-cache.yml` 会在云端生成 `market-cache`、`baostock-cache` 和 `financial-cache`，Vercel 后端在公开源返回空数据时自动读这些静态快照兜底。
- `CNInfo`：作为公司公告二源，和东财公告合并去重；同时接入调研/关系披露作为 `disclosures.relations`。
- `TuShare Pro`：保留为高一致性、标准化字段和更完整特色数据的可选增强源。
- `演示数据`：所有在线源不可用时继续兜底，保证应用可打开、可调试。
- `数据源体检`：大盘情绪和复刻状态页会直接展示各源覆盖数量、最近样本、云缓存命中字段，并把同一份覆盖明细传入 DeepSeek 上下文。

本地实测：`BaoStock` 可拿到 `sh.600519` 日线、换手率、PE/PB/PS 等字段；`yfinance` 可拿到 `600519.SS` OHLCV；`AKShare` 的涨停池接口可用，部分东方财富实时接口在当前网络下会偶发断连，所以它更适合做多源自动模式而不是唯一来源。

## 已覆盖能力

- 原站全量可见功能审计见：`docs/AIWUCHUAN_FULL_AUDIT.md`
- 数据源路线图见：`docs/DATA_SOURCES.md`
- 大盘情绪：情绪温度、成交额、涨跌比、涨跌停、真实涨停池/炸板池、连板高度、封板资金、北向资金、ETF 资金、人气榜、指数涨跌、趋势图；日期区间与行情状态会联动复盘统计，并显示 14 类数据源实时体检。
- 量化因子选股：估值、市值、量能、均线、RPS、MACD、KDJ、RSI、VWAP、支撑压力、缠论形态、TD 序列等因子筛选；公开行情股票池会派生 RPS/均线/资金代理字段，严格组合为空时仍展示最接近候选。
- 板块与概念：行业/概念聚合、涨跌幅、排名变化、上涨/下跌家数、涨停家数、成交额、领涨股；板块/概念切换、预设、范围、排序、柱状图/饼图会实时影响当前表格和图表。
- 行情：股票检索、东财 1 分钟分时、日 K/BaoStock/Yahoo 切换、日期范围、复权、近半年/近一年、加载更多历史、均线、MACD、RSI、KDJ、画线记录、自选股、个股资金流、财务快照、BaoStock 历史估值、人气关键词、相关股票、公司公告和巨潮调研/关系披露。
- 自选：本地分组、自选表、删除与分组管理。
- LLM 分析：主题热度、主题全字段、新闻证据、主题个股、选股池、板块看板、个股评估矩阵、产业链分析；主题类型、关键词、来源、策略、排序、列集、页大小和翻页都会联动表格并进入问答上下文。
- AI 决策矩阵：基于多源公开行情、资金流、板块、ETF、人气榜、公告和财务快照生成操作计划、触发条件、失效条件、仓位区间和观察点；新对话、实时搜索、模式、最近对话和数据源覆盖明细会持久化或进入上下文。
- 奇门遁甲：本地任务表单、同步起局扣点、钱包账单、持久化任务列表、本地解盘和 DeepSeek 增强解盘。
- 订阅账号与点数：商品筛选、购买确认、扫码状态、订单后四位、待核验/已开通订单表、7000 点旗舰包和点数账本，不接真实支付。

## 快速开始

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
streamlit run streamlit_app.py
```

如果使用 TuShare 增强源，在 `.env` 中填入：

```bash
TUSHARE_TOKEN=你的 TuShare Pro token
```

不填 token 也可以运行，系统会自动切到演示数据。后续接入多源自动模式后，会优先使用免费公开源。

## 数据接口

当前本地 Streamlit 版已实现 TuShare Python SDK 适配：

- `stock_basic`
- `daily`
- `daily_basic`
- `moneyflow`
- `index_daily`
- `index_dailybasic`
- `limit_list_d`
- `pro_bar`
- `stk_mins`

分钟数据在 TuShare 中通常需要单独权限，应用会在拿不到分钟数据时自动回落到日线演示分时。

## 浏览器本地状态

前端只在浏览器 `localStorage` 保存轻量状态：

- `quant_a_share_watchlist`
- `quant_a_share_market`
- `quant_a_share_screener`
- `quant_a_share_quote`
- `quant_a_share_llm`
- `quant_a_share_qimen`
- `quant_a_share_ai`
- `quant_a_share_subscription`
- `quant_a_share_shell`

这些状态不会提交到 Git，也不需要本地后端常驻。

## 参考

- yfinance 文档：https://ranaroussi.github.io/yfinance/
- AKShare 文档：https://akshare.akfamily.xyz/
- BaoStock PyPI：https://pypi.org/project/baostock/
- TuShare Python SDK 调用方式：https://tushare.pro/document/1?doc_id=131
- TuShare HTTP API 说明：https://tushare.pro/document/1?doc_id=130
- TuShare 通用行情 `pro_bar`：https://tushare.pro/wctapi/documents/109.md
- TuShare 每日指标 `daily_basic`：https://tushare.pro/wctapi/documents/32.md
- TuShare 分钟数据说明：https://tushare.pro/document/1?doc_id=234
