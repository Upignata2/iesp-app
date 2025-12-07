import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCors(req: VercelRequest, res: VercelResponse) {
  const allowed = process.env.WEB_ORIGIN || '';
  const origin = (req.headers['origin'] as string) || '';
  const list = allowed.split(',').map((s) => s.trim()).filter(Boolean);
  let ok = !!origin && list.some((p) => {
    if (p === '*') return true;
    if (p.includes('*')) {
      const re = new RegExp('^' + p.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
      return re.test(origin);
    }
    return p === origin;
  });
  if (!list.length && origin) ok = true;
  if (ok) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  return ok;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!ok) { res.status(403).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ success: false, error: 'method_not_allowed' }); return; }

  const origin = (req.headers['origin'] as string) || '';
  const secure = origin.startsWith('https://');
  const sameSite = secure ? 'SameSite=None' : 'SameSite=Lax';
  const secureFlag = secure ? '; Secure' : '';
  res.setHeader('Set-Cookie', `session=; Path=/; HttpOnly; Max-Age=0; ${sameSite}${secureFlag}`);
  res.status(200).json({ success: true });
}

