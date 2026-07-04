module.exports = function handler(_req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(
    JSON.stringify({
      ok: true,
      deepseekConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    })
  );
};
