// GET /api/load?shop=yercaud   -> { entries, items, photo }
// GET /api/load?shop=all       -> { yercaud:{...}, photobox:{...}, ... }
const U = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const T = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const SHOPS = ['yercaud', 'photobox', 'pykara', 'ooty'];

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
async function rget(k) { const v = await cmd(['GET', k]); return v ? JSON.parse(v) : null; }

module.exports = async (req, res) => {
  try {
    if (!U || !T) return res.status(200).json({ entries: null, items: null, photo: null, _nodb: true });
    const shop = (req.query && req.query.shop) || '';
    if (!shop) return res.status(400).json({ error: 'shop required' });
    const list = shop === 'all' ? SHOPS : [shop];
    const out = {};
    for (const s of list) {
      out[s] = {
        entries: await rget('msacc:entries:' + s),
        items:   await rget('msacc:items:' + s),
        photo:   await rget('msacc:photo:' + s),
      };
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(shop === 'all' ? out : out[shop]);
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
