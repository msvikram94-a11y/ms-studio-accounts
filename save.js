// POST /api/save   body: { shop, entries?, items?, photo? }
const U = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const T = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function cmd(arr) {
  const r = await fetch(U, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + T, 'Content-Type': 'application/json' },
    body: JSON.stringify(arr),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
async function rset(k, val) { return cmd(['SET', k, JSON.stringify(val)]); }

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    if (!U || !T) return res.status(503).json({ error: 'database not configured' });
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    body = body || {};
    const shop = body.shop;
    if (!shop) return res.status(400).json({ error: 'shop required' });
    if (body.entries !== undefined) await rset('msacc:entries:' + shop, body.entries);
    if (body.items   !== undefined) await rset('msacc:items:' + shop,   body.items);
    if (body.photo   !== undefined) await rset('msacc:photo:' + shop,   body.photo);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
