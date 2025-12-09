import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from '../cors';
import { loginWithEmail } from '../../db';

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
  try {
    const ok = setCors(req, res);
    if (req.method === 'OPTIONS') return;

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
