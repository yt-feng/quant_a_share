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

## 数据源策略

项目后续按“免费公开源优先、TuShare 作为增强源”的方式接数据：

- `Eastmoney public endpoint`：Vercel `/api/market` 当前用于 A 股成交额榜、行业板块、单股 quote 和 K 线。
- `AKShare`：优先覆盖 A 股实时行情、行业/概念板块、涨停池、资金流、人气榜、公告和特色投研数据。
- `BaoStock`：作为免费历史 K 线、估值、换手率、财务字段的稳定补位，适合批量因子计算。
- `yfinance`：作为全球股票、ETF、港美股，以及 A 股基础 K 线的备用入口。
- `TuShare Pro`：保留为高一致性、标准化字段和更完整特色数据的可选增强源。
- `演示数据`：所有在线源不可用时继续兜底，保证应用可打开、可调试。

本地实测：`BaoStock` 可拿到 `sh.600519` 日线、换手率、PE/PB/PS 等字段；`yfinance` 可拿到 `600519.SS` OHLCV；`AKShare` 的涨停池接口可用，部分东方财富实时接口在当前网络下会偶发断连，所以它更适合做多源自动模式而不是唯一来源。

## 已覆盖能力

- 原站全量可见功能审计见：`docs/AIWUCHUAN_FULL_AUDIT.md`
- 数据源路线图见：`docs/DATA_SOURCES.md`
- 大盘情绪：情绪温度、成交额、涨跌比、涨跌停、指数涨跌、趋势图。
- 量化因子选股：估值、市值、量能、均线、RPS、MACD、KDJ、RSI、VWAP、支撑压力、缠论形态、TD 序列等因子筛选。
- 板块与概念：行业/概念聚合、涨跌幅、排名变化、上涨/下跌家数、涨停家数、资金流向分布。
- 行情：股票检索、日 K/分钟 K 数据入口、复权、均线、MACD、RSI、KDJ、画线工具入口、自选股。
- 自选：本地分组、自选表、删除与分组管理。
- LLM 分析：主题热度、选股池、板块看板、个股评估矩阵、产业链分析的本地研究版。
- AI 决策矩阵：基于 TuShare 数据生成操作计划、触发条件、失效条件、仓位区间和观察点。
- 奇门遁甲：本地任务表单、历史记录、文本解盘。
- 订阅账号与点数：本地商品与点数账本，不接真实支付。

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

## 本地数据

运行后会生成 `.quant_a_share/`：

- `watchlists.json`
- `strategies.json`
- `qimen_jobs.json`
- `wallet.json`

这些都是本地状态，不会提交到 Git。

## 参考

- yfinance 文档：https://ranaroussi.github.io/yfinance/
- AKShare 文档：https://akshare.akfamily.xyz/
- BaoStock PyPI：https://pypi.org/project/baostock/
- TuShare Python SDK 调用方式：https://tushare.pro/document/1?doc_id=131
- TuShare HTTP API 说明：https://tushare.pro/document/1?doc_id=130
- TuShare 通用行情 `pro_bar`：https://tushare.pro/wctapi/documents/109.md
- TuShare 每日指标 `daily_basic`：https://tushare.pro/wctapi/documents/32.md
- TuShare 分钟数据说明：https://tushare.pro/document/1?doc_id=234
