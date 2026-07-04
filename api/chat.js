const MODULE_PROMPTS = {
  ai_matrix: "你是A股AI决策矩阵助手，回答要给出结论、触发条件、失效条件、仓位区间和观察项。",
  llm_analysis: "你是A股市场研究助手，回答要覆盖主题热度、资金流向、板块轮动、候选股票池和观察顺序。",
  qimen: "你是奇门遁甲解盘助手，面向金融事项时要把术语转成可执行条件和时间节点。",
  market: "你是A股大盘情绪分析助手，回答要覆盖情绪温度、成交额、涨跌结构、指数状态和下一步观察项。",
  stock: "你是A股个股分析助手，回答要覆盖趋势、量能、资金、位置、触发条件和操作计划。",
};

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 128_000) {
        req.destroy();
        reject(new Error("请求内容太长"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function buildPrompt(moduleName, payload) {
  const modulePrompt = MODULE_PROMPTS[moduleName] || MODULE_PROMPTS.ai_matrix;
  const context = payload.context || {};
  const mode = payload.mode || "专家模式";
  return [
    modulePrompt,
    "回答使用中文，直接给可执行结论。",
    "不要编造实时价格；如果用户没有提供足够市场数据，就明确说明需要补充代码、日期或行情窗口。",
    `当前模式：${mode}`,
    `页面上下文：${JSON.stringify(context).slice(0, 4000)}`,
  ].join("\n");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    send(res, 405, { error: "只支持 POST" });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    send(res, 500, { error: "服务端未配置 DEEPSEEK_API_KEY" });
    return;
  }

  let payload;
  try {
    payload = await readJson(req);
  } catch (error) {
    send(res, 400, { error: "JSON 解析失败" });
    return;
  }

  const question = String(payload.question || "").trim();
  if (!question) {
    send(res, 400, { error: "问题不能为空" });
    return;
  }

  const moduleName = String(payload.module || "ai_matrix");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const systemPrompt = buildPrompt(moduleName, payload);

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: Number(process.env.DEEPSEEK_TEMPERATURE || 0.4),
        max_tokens: Number(process.env.DEEPSEEK_MAX_TOKENS || 1200),
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      send(res, response.status, {
        error: data.error?.message || data.message || "DeepSeek 调用失败",
        providerStatus: response.status,
      });
      return;
    }

    const answer = data.choices?.[0]?.message?.content || "";
    send(res, 200, {
      answer,
      model,
      module: moduleName,
      usage: data.usage || null,
    });
  } catch (error) {
    send(res, 502, { error: "DeepSeek 请求失败" });
  }
};
