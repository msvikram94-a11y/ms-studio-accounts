// Health check. Tells the app whether a database is configured.
module.exports = (req, res) => {
  const configured = !!(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );
  res.status(200).json({ ok: true, db: configured });
};
