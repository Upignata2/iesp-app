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

export default async function handler(req: any, res: any) {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!ok) { res.status(403).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const proto = (req.headers['x-forwarded-proto'] as string) || '';
  const secure = proto === 'https';
  const sameSite = secure ? 'SameSite=None' : 'SameSite=Lax';
  const secureFlag = secure ? '; Secure' : '';
  res.setHeader('Set-Cookie', `session=; Path=/; HttpOnly; Max-Age=0; ${sameSite}${secureFlag}`);
  res.status(200).json({ success: true });
}
