# Quant A Share

一个用多源公开金融数据复刻 aiwuchuan 核心投研能力的本地工作台。

## GitHub Pages

静态前端地址：

https://yt-feng.github.io/quant_a_share/

Pages 由 `.github/workflows/pages.yml` 自动部署，静态文件位于 `pages/`。这个版本不包含服务端密钥，但前端会跨域调用 `https://quant-a-share.vercel.app` 的 `/api/market` 和 `/api/chat`，因此行情、因子选股和问答都走 Vercel 后端。

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

- `Eastmoney public endpoint`：Vercel `/api/market` 当前用于全 A 股票池、全市场主力资金字段、指数、行业/概念板块、板块成分股、单股 K 线、涨停/炸板/强势股池、ETF 资金榜、东财人气榜、个股资金流、北向资金、沪深港通 KAMT 成交/累计流入、公告等；默认向前端返回最多 6000 只股票，并暴露 `stockUniverse` 覆盖元信息。
- `Eastmoney report API`：Vercel `/api/market` 当前用于近 30 日行业研报、宏观策略研报，供 LLM 产业链研报分析 tab 和问答上下文使用。
- `Sina public endpoint`：当前用于全 A 股票池兜底、行业/概念板块二源兜底和财务报告关键指标，沿用同一套 `stockUniverse` 覆盖统计。
- `Tencent quote`：当前作为单股报价兜底源，东财单股 quote 不通时仍能返回价格、涨跌幅、市值、PE/PB 等核心字段。
- `AKShare / efinance`：作为公开接口地图使用；生产版已把可用的东财/新浪热路径移植到 Node serverless，包括行业/概念板块、ETF、涨停池、人气榜、资金流、公告和财务摘要。
- `BaoStock`：通过 GitHub Actions 批量生成 `pages/data/baostock-cache.json`，当前会从市场快照扩展到最多 80 只股票，缓存历史 K 线、换手率、PE/PB/PS/PCF、MA 和区间收益。
- `Financial cache`：通过 GitHub Actions 批量生成 `pages/data/financial-cache.json`，默认覆盖最多 160 只股票，缓存营收、利润、EPS、ROE、毛利率、资产负债率等财报字段。
- `yfinance / Yahoo chart`：生产版已直接接 Yahoo chart HTTP，作为 A 股 `.SS/.SZ`、港美股和 ETF 的全球行情/K 线备份。
- `GitHub Actions market cache`：`.github/workflows/market-cache.yml` 会在云端以 8000 股票上限生成 `market-cache`、`baostock-cache` 和 `financial-cache`，并在公开端点偶发只返回半截股票池时保留更完整旧快照，必要时向线上 Vercel API 回补完整全 A 股票池和主力资金字段；Vercel 后端在公开源返回空数据时自动读这些静态快照兜底。
- `CNInfo`：作为公司公告二源，和东财公告合并去重；同时接入调研/关系披露作为 `disclosures.relations`。
- `TuShare Pro`：保留为高一致性、标准化字段和更完整特色数据的可选增强源。
- `演示数据`：所有在线源不可用时继续兜底，保证应用可打开、可调试。
- `数据源体检`：大盘情绪、因子选股和复刻状态页会直接展示各源覆盖数量、最近样本、实时/缓存模式、云缓存命中字段，并把覆盖明细与新鲜度明细传入 DeepSeek 上下文。
- `CSV 导出`：主要表格可在浏览器内导出当前筛选口径的 CSV，包括涨停池、北向资金、ETF、人气榜、因子选股、板块、个股资金流、财务字段、BaoStock、公告、LLM 表格和研报。

本地实测：`BaoStock` 可拿到 `sh.600519` 日线、换手率、PE/PB/PS 等字段；`yfinance` 可拿到 `600519.SS` OHLCV；`AKShare` 的涨停池接口可用，部分东方财富实时接口在当前网络下会偶发断连，所以它更适合做多源自动模式而不是唯一来源。

## 已覆盖能力

- 原站全量可见功能审计见：`docs/AIWUCHUAN_FULL_AUDIT.md`
- 数据源路线图见：`docs/DATA_SOURCES.md`
- 大盘情绪：情绪温度、成交额、涨跌比、涨跌停、真实涨停池/炸板池、连板高度、连板梯队结构、封板资金、北向资金、ETF 资金、人气榜、指数涨跌、趋势图；日期区间与行情状态会联动复盘统计，并显示 15 类数据源实时体检和表格新鲜度，重点表格支持 CSV 导出。
- 量化因子选股：估值、市值、量能、均线、RPS、MACD、KDJ、RSI、VWAP、支撑压力、缠论形态、TD 序列等因子筛选；公开行情股票池默认扩到接近全 A，并用东财全市场主力资金、涨停/炸板/强势池、热榜、财务缓存和 BaoStock 历史缓存增强 RPS/均线/资金字段，严格组合为空时仍展示最接近候选。
- 策略回测与对比：策略条件复用、多区间快捷回测、最大持仓数、买入排序、动态仓位、持有天数、止损比例、系统状态、信号样本、收益/胜率/回撤/夏普、版本记录、进化候选、跨 strategy_id 对比、队列预算和盘后批量预演/提交。
- 板块与概念：行业/概念聚合、涨跌幅、排名变化、上涨/下跌家数、涨停家数、成交额、领涨股、东财板块成分股下钻；板块/概念切换、日期区间、预设、范围、排序、柱状图/饼图会实时影响当前表格和图表，并在刷新时进入公开接口参数。
- 行情：股票检索、东财 1 分钟分时、日 K/BaoStock/Yahoo 切换、日期范围、复权、近半年/近一年、加载更多历史、均线、MACD、RSI、KDJ、趋势线/射线/水平线/箭头/FIB/GANN/平行线图表覆盖层、自选股、个股资金流、财务快照、BaoStock 历史估值、人气关键词、相关股票、公司公告和巨潮调研/关系披露；各表格显示实时/缓存/备用源新鲜度。
- 自选：本地分组、自选表、查看日线、移除与分组管理。
- LLM 分析：主题热度、主题全字段、新闻证据、主题个股、选股池、板块看板、个股评估矩阵、产业链分析；主题类型、交易日、关键词、来源、策略、排序、列集、页大小和翻页都会联动表格并进入问答上下文，主题表、选股池、板块矩阵、个股矩阵和研报支持 CSV 导出。
- AI 决策矩阵：基于多源公开行情、资金流、板块、ETF、人气榜、公告和财务快照生成操作计划、触发条件、失效条件、仓位区间和观察点；新对话、实时搜索、模式、最近对话、侧栏最近历史、数据源覆盖明细和数据新鲜度会持久化或进入上下文，问句生成器支持多股票/板块、5 档周期、操作方向、关键均线和 9 个策略模板，独立钱包账单页支持点数余额、冻结点数、兑换码充值、管理员流水和 CSV 导出。
- 奇门遁甲：本地任务表单、同步起局扣点、钱包账单、持久化任务列表、本地解盘和 DeepSeek 增强解盘；事项类型、判断目标、阶段、国家、时区、农历/闰月、10/20/30 点档位、历法明细、局式和九宫盘面已补齐。
- 订阅账号与点数：账号状态、有效期剩余天数、商品筛选、购买确认、开通方式、支付宝扫码、联系信息、订单后四位核对说明、待核验/已开通订单表、7000 点旗舰包和点数账本，不接真实支付。
- 管理后台：承接原站管理员路由，包含账号管理、Ai 历史管理、奇门运营面板、订阅与充值核对、奇门任务监控和操作日志；当前实现以本地状态/只读表格为主，支持 CSV 导出和本地操作反馈。
- 数据覆盖验收：复刻状态页显示 `/api/market` 顶层 `featureCoverage`、`limitPoolCounts`、`dataCoverage` 生产摘要，并可导出 CSV；AI/奇门问答上下文也会携带同一份覆盖摘要。
- 开源能力映射：复刻状态页展示 AKShare、BaoStock、yfinance/Yahoo、efinance 风格能力分别落到哪些 Vercel Node 适配器或 GitHub Actions 缓存，并可导出 CSV。

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
- `quant_a_share_sector`
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
