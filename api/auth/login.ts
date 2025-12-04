import { loginWithEmail } from '../../db';

function setCors(req: any, res: any) {
  const list = (process.env.WEB_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = (req.headers.origin as string) || '';
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
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-vercel-protection-bypass');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  return ok;
}

async function parseBody(req: any) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on('data', (c: any) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve());
    req.on('error', reject);
  });
  const raw = Buffer.concat(chunks).toString('utf8');
  try { return JSON.parse(raw); } catch { return {}; }
}

export default async function handler(req: any, res: any) {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!ok) { res.status(403).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }
  try {
    const body = await parseBody(req);
    const { email, password } = (body || {}) as { email?: string; password?: string };
    if (!email || !password) { res.status(422).json({ success: false, error: 'missing_fields' }); return; }
    const user = await loginWithEmail(email, password);
    const proto = (req.headers['x-forwarded-proto'] as string) || '';
    const secure = proto === 'https';
    const sameSite = secure ? 'SameSite=None' : 'SameSite=Lax';
    const secureFlag = secure ? '; Secure' : '';
    res.setHeader('Set-Cookie', `session=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly; Max-Age=31536000; ${sameSite}${secureFlag}`);
    res.status(200).json({ success: true, user });
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (msg.includes('Database not available')) { res.status(503).json({ success: false, error: 'database_unavailable' }); return; }
    if (msg.includes('Invalid credentials')) { res.status(401).json({ success: false, error: 'invalid_credentials' }); return; }
    res.status(400).json({ success: false, error: 'login_failed' });
  }
}
