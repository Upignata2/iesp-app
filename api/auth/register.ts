import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registerUserWithEmail } from '../../db';

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
  return new Promise<any>((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!ok) { res.status(403).end(); return; }

  if (req.method !== 'POST') { res.status(405).json({ success: false, error: 'method_not_allowed' }); return; }

  try {
    const body = await readBody(req);
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');
    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'missing_fields' });
      return;
    }
    const emailOk = /.+@.+\..+/.test(email);
    const passOk = password.length >= 6;
    if (!emailOk || !passOk) {
      res.status(400).json({ success: false, error: 'invalid_fields' });
      return;
    }
    await registerUserWithEmail(name, email, password);
    res.status(200).json({ success: true });
  } catch (e: any) {
    const msg = String(e?.message || '');
    if (msg.includes('Email already exists')) { res.status(409).json({ success: false, error: 'email_in_use' }); return; }
    if (msg.includes('Database not available')) { res.status(503).json({ success: false, error: 'database_unavailable' }); return; }
    res.status(500).json({ success: false, error: 'unknown' });
  }
}

