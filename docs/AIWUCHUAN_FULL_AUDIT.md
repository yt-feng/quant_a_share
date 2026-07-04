# aiwuchuan Full Detail Audit

This file tracks the visible product surface audited from the logged-in aiwuchuan site on 2026-07-04. It intentionally excludes credentials, secrets, and any non-read-only action results.

## Global Shell

- Collapsible sidebar.
- Menu items: 大盘情绪, 量化因子选股, 行业, 行情, 自选, LLM分析, 奇门遁甲, Ai决策矩阵, 订阅账号与点数.
- Recent prompt area.
- User identity display, logout, theme switch.
- Clone enrichment: shell now includes sidebar collapse, recent prompt shortcuts, user pill, logout action and persisted light/dark theme state.

## 大盘情绪

- Page title: 市场情绪分析.
- Date range inputs: 开始日期, 结束日期.
- State selector / display: 震荡行情.
- Action: 加载复盘数据统计.
- Expected output: market emotion metrics and replay statistics.
- Clone enrichment: ETF资金排行、东财人气榜、涨停池/炸板池、北向资金 are wired into the Vercel market snapshot and LLM context.

## 量化因子选股

- Page title: 多因子量化模型.
- Factor buttons:
  - Valuation / size: 市盈率<=30, 市净率<=3, 总市值>=500亿, 总市值50亿-200亿, 流通市值>=100亿, 流通市值<=50亿.
  - Price / volume: 今日涨停, 换手率>=3%, 换手率<1%(低), 量比>=1.5, 成交额>=1亿, 倍量信号, 振幅>=8%(活跃), 量能信号.
  - Relative strength / trend: 板块RPS50>=80, 个股/板块RPS>=80, 站上MA5/MA10/MA20/MA60/MA90/MA144, RPS50>=70, RPS120>=70, RPS综合>=80.
  - Technical signals: EMA14>EMA26, MACD金叉, KDJ金叉, RSI超卖/超买, 长上影线, 长下影线.
  - Money / dealer / VWAP: 庄家控盘>50, 主力吸筹, 强势吸筹选股, 强势吸筹3+条件, 主力攻击, 主力触发, 资金RSI强(>50), 突破20日成本, 突破60日成本, RSI_V减仓信号, VWAP趋势分>=5, VWAP允许做多, VWAP低吸回踩, VWAP突破放量, VWAP加速, VWAP位置, 入场信号.
  - Gaussian / resonance / auction: 高斯趋势向上, 高斯趋势起航, 高斯拐头向上, 超级共振, 共振:主力拉升, 共振:趋势起航, 竞价弱转强.
  - Support / Chan / Gann / candle / TD: 60日支撑附近, 144日支撑附近, 突破60日压力, 突破144日压力, 缠论底分型, 缠论顶分型, 缠论三买, 缠论三卖, 中枢开始, 中枢结束, 中枢向上突破, 江恩1:1支撑, 江恩1:2支撑, 江恩2:1支撑, 看涨吞没, 早晨之星, TD买入结构9, TD13买入优选, TD卖出结构9, TD13卖出优选.
- Custom condition controls: field selector, operator selector, value input, 添加.
- Recent-N condition controls: 近N日累计涨跌幅, N number input, operator, value(%), 添加近N日条件.
- Strategy controls: 策略名称, 保存策略, 我的策略.
- Clone enrichment: custom conditions, recent-N conditions, sort settings and saved strategies are now active filters and persist in browser storage.
- Run controls: 交易日(不填则最新日), sort field, sort order, display columns, 筛选.
- Table columns: 代码, 名称, 最新价, 涨跌幅, 量能信号, MACD, 流通市值, 行业整体RPS_50, 行业RPS_50, 行业, K线形态, 趋势支撑线_次日, 趋势压力线_60.
- Clone enrichment: factor buttons show single-factor hit counts; if a strict multi-factor intersection is empty, the table shows similarity-ranked candidates with match counts instead of a blank result area, including the all-zero case for over-strict custom filters.

## 行业

- Page title: 板块与概念分析.
- Dataset switch: 板块数据 / 概念数据.
- Date range inputs.
- Preset buttons: 下跌(0~-5%), 上涨(0~5%), 震荡(-10~10%).
- Sort controls: metric, direction.
- Range controls: min, max.
- Chart mode: 柱状图 / 饼图.
- Actions: 刷新数据, 重置筛选.
- Metrics: 总板块数, 平均涨跌幅, 总上涨家数, 总下跌家数, 总资金流向.
- Table columns: ID, 名称, 日期, 涨跌幅, 排名, 排名变化, 上涨家数, 下跌家数, 涨停家数, 资金流向(亿).
- Clone enrichment: dataset switch, preset chips, range inputs, sort selectors and chart mode now update the visible table and charts instead of acting as display-only controls.

## 行情

- Page title: 行情 - 分时与日K技术指标.
- Inputs: 股票名称, 股票代码, 日期范围, 复权.
- Actions: 加自选, 查询, 近半年, 近一年, 加载更多历史.
- Chart modes: 分时(1分钟K), technical indicators.
- Header metrics: stock name/code, price, percent change, volume, PE.
- Clone enrichment: single-stock money flow, financial snapshot cache, Eastmoney popularity rank/keywords/related stocks and company announcements are wired into the quote page.
- Clone enrichment: quote charts now use Eastmoney 1-minute intraday trends, Eastmoney daily K-line, BaoStock cache and Yahoo backup as switchable sources. VOL/MACD parameters affect chart calculations, indicator switching updates sub-panels, and drawing-tool selections persist in browser storage as chart overlays.
- Clone enrichment: date range, adjustment selector, 近半年/近一年 and 加载更多历史 now persist and filter the active quote chart rows.
- Drawing tools: trend line, ray, horizontal line, arrow, FIB, GANN, parallel line, clear drawings, zoom in, zoom out, reset.
- Indicator controls: 刷新指标.
- Indicator panels: 副图1 VOL, 副图2 MACD.
- Parameter dialog:
  - VOL: M1=5, M2=10.
  - MACD: SHORT=12, LONG=26, MID=9.
  - Actions: 取消, 确定.
- Indicator switch dialog entry exists for each panel.

## 自选

- Group controls: 新分组名称, 新建分组, group selector, 删除分组.
- Watch table columns: 代码, 名称, 分组, 最新价, 涨跌额, 涨跌幅(%), 成交额, 操作.
- Clone enrichment: groups and watch entries persist in browser storage so Vercel can keep the feature serverless.

## LLM分析

- Tabs: 主题热点, 选股池, 板块全景看板, 个股评估矩阵, 产业链研报分析.
- 主题热点:
  - Type switch: 行业 / 概念.
  - Inputs: base date, 筛选主题.
  - Action: 刷新.
  - Topic cards include heat, trend, 3-day fund flow.
  - Detail metrics: 3日资金(亿), 3日涨跌, 站上MA20(%), 人气集中.
  - Theme detail tags: market stage, confidence, as_of, news snippets, tier, decision, score, reason, invalidation, raw fields.
  - Mapping table: 原始主题, 标准主题, 方法, 匹配, 得分, 最终类型.
  - Candidate table: 代码, 名称, 来源, 阶段, 置信度, 操作.
- Clone enrichment: topic type and keyword filters now update the topic cards and active detail panel.
- 选股池:
  - Inputs: 基准交易日, 筛选:代码/名称/主题, 来源, 策略筛选, 主题类型, sort, page size.
  - Summary tags: 总数, 关注, 收益选择, 收益基准.
  - Table: 代码, 名称, 实时价, 盘中涨跌, 主题, 来源, 策略, 阶段, 仓位, 置信度, 买点价, T+1, T+3, T+5, 关注.
- Clone enrichment: query/source/stage/theme-type/sort/page-size filters now update the pool table and pagination.
- 板块全景看板:
  - Inputs: 交易日, 筛选:板块/ID/关键词, sort metric, sort direction, display columns, page size.
  - Tags: 总数, 交易日, 轮动, 高位, 低吸.
  - Table: 信号, 日期, 板块, 1日涨跌, 3日涨跌, 当日资金_亿, 3日资金_亿, Top100, 5日资金_亿, 5日涨跌, 7日涨跌, MA20占比, 集中度, 3日资金_norm_亿.
- Clone enrichment: query/sort/direction/column-set/page-size filters now update the sector panorama table and pager.
- 个股评估矩阵:
  - Inputs: 交易日, 筛选:股票代码/名称/板块/关键词, sort metric, sort direction, display columns, page size.
  - Table: 代码, 名称, 当日资金_亿, 5日资金_亿, 收盘_早盘(负数=更热), 大于等于5日线, 大于等于90日线, 大于等于144日线, 流通市值（亿）, 5日涨跌, 1日涨跌, 行情.
  - Row action: 查看.
- Clone enrichment: stock query/sort/direction/column-set/page-size filters now update the stock matrix table and pager.
- 产业链研报分析:
  - Empty state visible in the audited account.
  - Clone enrichment: Eastmoney research-report metadata now fills this tab with recent industry/macro report titles, institutions, authors, dates, industries and links, and adds the same context to LLM prompts.

## 奇门遁甲

- Page title: 奇门遁甲.
- Description: 把专业解盘转成你能直接看懂、能马上行动的建议。
- Actions: 钱包账单, 任务列表, 同步起局（1点）, 提交解盘任务, 重置.
- Form controls: 事项类型, 判断目标, 当前阶段, 历法类型(公历/此刻), 时间输入, 城市, 输出偏好, 解盘档位, 事情摘要.
- Wallet bill view:
  - Metrics: 可用点数, 冻结点数, 累计充值, 累计消费.
  - Recharge code input.
  - Ledger columns: 时间, 类型, 点数变化, 变更后余额, 变更后冻结, 备注.
- Task list view:
  - Columns: 提交时间, 类型, 目标, 状态, 模式, 计费, 点数, 开始, 结束, 操作.
  - Empty state supported.
- Clone enrichment: sync 起局 deducts local points, wallet and task records persist in browser storage, submissions create task detail rows immediately, and DeepSeek responses are saved back into the selected task.

## Ai决策矩阵

- Chat controls: 新对话, 钱包, 实时搜索, 快速模式, 专家模式, 深度思考.
- Textarea placeholder: 请输入你的问题，AI将基于多维数据为你解答...
- Hot prompts Q1-Q12:
  - Buy/hold/low-absorb/do-T prompts by stock/sector and horizon.
  - Market, volume, sector rotation, fund flow, popularity list prompts.
- Wallet entry routes to 订阅账号与点数.
- Clone enrichment: live prompt context includes ETF flow, hot rank, stock popularity, announcements, fundamentals and Yahoo/yfinance-compatible backup quotes.
- Clone enrichment: the LLM 主题热点 tab now derives topic heat, trend, theme_score, tier, decision, evidence snippets, mapping rows and theme stock candidates from Eastmoney industry/concept boards, A-share industry/concept tags, popularity keywords and Eastmoney research reports. 选股池、板块全景看板 and 个股评估矩阵 now use live market-derived rows instead of fixed sample rows.

## 订阅账号与点数

- Page title: 订阅账号与点数.
- Actions: 刷新, 查看钱包账单, 商品说明, 立即购买, 去钱包账单, 前往 Ai 决策矩阵.
- Account metrics: 当前账号, 账号状态, 可用点数, 冻结点数.
- Product filters: 全部商品 10, 点数包 7, 订阅套餐 3.
- Subscription products:
  - 账号订阅 一个月, 88.00, 月度订阅, 账号开通 1 个月.
  - 账号订阅 半年, 368.00, 半年订阅, 账号开通 6 个月.
  - 账号订阅 一年, 688.00, 年度订阅, 人工优先开通 12 个月.
- Point packages:
  - 100 / 200 / 300 / 500 / 1000 / 2500 / 7000 points.
- Product cards include title, tag, category, description, price, features, quantity, 商品说明, 立即购买.
- Clone enrichment: purchase flow includes confirmation modal, QR/pay state, order suffix input, pending verification orders, mark-open action and point-credit ledger update for point packages.
