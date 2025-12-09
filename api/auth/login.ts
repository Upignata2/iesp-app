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
  
  // Always allow localhost and vercel app
  const defaultAllowed = ['http://localhost:5173', 'http://localhost:5174', 'https://iesp.vercel.app', 'https://iesp-app.vercel.app'];
  
  const list = [...allowed.split(',').map((s) => s.trim()).filter(Boolean), ...defaultAllowed];
  
  let ok = false;
  if (list.length) {
    ok = !origin || list.some((p) => originMatches(origin, p));
  }
  
  // If no origin, allow (server-to-server or direct access)
  if (!origin) ok = true;
  
  if (ok && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (origin) {
    // If not explicitly allowed but present, try to allow it if it matches our domain patterns
    if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      ok = true;
    }
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization, cookie');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
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

import { loginWithEmail } from '../../db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const ok = setCors(req, res);
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    if (!ok) { res.status(403).end(); return; }
    if (req.method !== 'POST') { res.status(405).json({ success: false, error: 'method_not_allowed' }); return; }
    try {
      const body = await readBody(req);
      const email = String(body?.email || '').trim();
      const password = String(body?.password || '');
      
      const user = await loginWithEmail(email, password);
      const origin = (req.headers['origin'] as string) || '';
      const secure = origin.startsWith('https://');
      const sameSite = secure ? 'SameSite=None' : 'SameSite=Lax';
      const secureFlag = secure ? '; Secure' : '';
      const cookie = `session=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly; Max-Age=31536000; ${sameSite}${secureFlag}`;
      res.setHeader('Set-Cookie', cookie);
      res.status(200).json({ success: true, user });
    } catch (e: any) {
      const msg = String(e?.message || '');
      console.error('[api/auth/login]', e);
      if (msg.includes('Invalid credentials')) { res.status(401).json({ success: false, error: 'invalid_credentials' }); return; }
      if (msg.includes('Database not available')) { res.status(503).json({ success: false, error: 'database_unavailable' }); return; }
      
      const detail = { error_detail: msg };
      res.status(500).json({ success: false, error: 'unknown', ...detail });
    }
  } catch {
    res.status(500).json({ success: false, error: 'api' });
  }
}
