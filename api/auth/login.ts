import type { VercelRequest, VercelResponse } from '@vercel/node';

function originMatches(origin: string, token: string) {
  if (token === '*') return true;
  const hasScheme = token.includes('://');
  if (token.includes('*')) {
    const pattern = '^' + token.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
    const re = new RegExp(pattern);
    if (hasScheme) return re.test(origin);
    try {
      const host = new URL(origin).host;
      return re.test(host);
    } catch {
      return re.test(origin);
    }
  }
  if (hasScheme) return token === origin;
  try {
    const host = new URL(origin).host;
    return token === host;
  } catch {
    return token === origin;
  }
}

function setCors(req: VercelRequest, res: VercelResponse) {
  const allowed = process.env.WEB_ORIGIN || '';
  const origin = (req.headers['origin'] as string) || '';
  const list = allowed.split(',').map((s) => s.trim()).filter(Boolean);
  let ok = true;
  if (list.length) {
    ok = !origin || list.some((p) => originMatches(origin, p));
  }
  if (!list.length) ok = true;
  if (ok && origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  return ok;
}

async function readBody(req: VercelRequest) {
  if ((req as any).body) {
    const b = (req as any).body as any;
    if (typeof b === 'string') {
      try { return JSON.parse(b); } catch { return {}; }
    }
    return b;
  }
  return {} as any;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const ok = setCors(req, res);
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (!ok) { res.status(403).end(); return; }
    if (req.method !== 'POST') { res.status(405).json({ success: false, error: 'method_not_allowed' }); return; }
    const body = await readBody(req);
    const email = String((body as any)?.email || '').trim();
    const password = String((body as any)?.password || '');
    res.status(503).json({ success: false, error: 'database_unavailable' });
  } catch {
    res.status(500).json({ success: false, error: 'api' });
  }
}
