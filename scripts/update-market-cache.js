const fs = require("fs");
const path = require("path");
const handler = require("../api/market");

const symbol = String(process.env.MARKET_CACHE_SYMBOL || "600519").replace(/\D/g, "").slice(0, 6) || "600519";
const outputPath = path.join(__dirname, "..", "pages", "data", "market-cache.json");

function callMarketApi() {
  const req = { method: "GET", query: { symbol } };
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        if (this.statusCode >= 400) {
          reject(new Error(payload?.error || `market api returned ${this.statusCode}`));
          return;
        }
        resolve(payload);
      },
      end() {
        resolve(null);
      },
    };
    Promise.resolve(handler(req, res)).catch(reject);
  });
}

(async () => {
  const payload = await callMarketApi();
  if (!payload?.ok) throw new Error("market api did not return ok payload");
  const snapshot = {
    ...payload,
    cacheSnapshot: {
      available: true,
      hit: false,
      usedFields: [],
      generatedAt: new Date().toISOString(),
      generatedBy: process.env.GITHUB_ACTIONS === "true" ? "github-actions" : "seed-script",
      symbol,
    },
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${outputPath}`);
  console.log(
    JSON.stringify(
      {
        symbol,
        source: snapshot.source,
        stocks: snapshot.stocks?.length || 0,
        concepts: snapshot.concepts?.length || 0,
        limitUp: snapshot.limitPools?.limitUp?.length || 0,
        etfs: snapshot.etfs?.rows?.length || 0,
        hotRank: snapshot.popularity?.rank?.items?.length || 0,
        announcements: snapshot.announcements?.items?.length || 0,
      },
      null,
      2
    )
  );
})();
