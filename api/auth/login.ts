import { loginWithEmail } from '../../db';

function setCors(req: any, res: any) {
  const list = (process.env.WEB_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = (req.headers.origin as string) || '*';
  const finalOrigin = list.length ? (list.includes(origin) ? origin : list[0]) : origin;
  res.setHeader('Access-Control-Allow-Origin', finalOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

export default async function handler(req: any, res: any) {
  setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }
  try {
    const { email, password } = (req.body || {}) as { email: string; password: string };
    const user = await loginWithEmail(email, password);
    const proto = (req.headers['x-forwarded-proto'] as string) || '';
    const secure = proto === 'https';
    const sameSite = secure ? 'SameSite=None' : 'SameSite=Lax';
    const secureFlag = secure ? '; Secure' : '';
    res.setHeader('Set-Cookie', `session=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly; Max-Age=31536000; ${sameSite}${secureFlag}`);
    res.status(200).json({ success: true, user });
  } catch {
    res.status(401).json({ success: false });
  }
}
