import 'dotenv/config';
console.log("Starting server...");
import http from 'http';
import { URL } from 'url';
const COOKIE_NAME = 'session';
const dbPromise = import('./db');

function readBody(req: http.IncomingMessage) {
  return new Promise<string>((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
  });
}

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

function setCors(req: http.IncomingMessage, res: http.ServerResponse) {
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

const server = http.createServer(async (req, res) => {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (!ok) {
    res.statusCode = 403;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const name = String(body?.name || '').trim();
      const email = String(body?.email || '').trim().toLowerCase();
      const password = String(body?.password || '');
      if (!name || !email || !password) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'missing_fields' }));
        return;
      }
      const emailOk = /.+@.+\..+/.test(email);
      const passOk = password.length >= 6;
      if (!emailOk || !passOk) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'invalid_fields' }));
        return;
      }
      const { registerUserWithEmail } = await dbPromise;
      await registerUserWithEmail(name, email, password);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    } catch (e: any) {
      const msg = String(e?.message || '');
      if (msg.includes('Email already exists')) {
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'email_in_use' }));
        return;
      }
      if (msg.includes('Database not available')) {
        res.statusCode = 503;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'database_unavailable' }));
        return;
      }
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'unknown' }));
    }
    return;
  }

  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const { loginWithEmail } = await dbPromise;
      const user = await loginWithEmail(String(body.email || '').toLowerCase().trim(), body.password);
      const origin = (req.headers['origin'] as string) || '';
      const secure = origin.startsWith('https://');
      const sameSite = secure ? 'SameSite=None' : 'SameSite=Lax';
      const secureFlag = secure ? '; Secure' : '';
      const cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly; Max-Age=31536000; ${sameSite}${secureFlag}`;
      res.setHeader('Set-Cookie', cookie);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, user }));
    } catch (e) {
      res.statusCode = 401;
      res.end(JSON.stringify({ success: false }));
    }
    return;
  }

  if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
    const origin = (req.headers['origin'] as string) || '';
    const secure = origin.startsWith('https://');
    const sameSite = secure ? 'SameSite=None' : 'SameSite=Lax';
    const secureFlag = secure ? '; Secure' : '';
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; ${sameSite}${secureFlag}`);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true }));
    return;
  }

  if (url.pathname === '/api/auth/me' && req.method === 'GET') {
    const cookieHeader = req.headers['cookie'] || '';
    const parts = cookieHeader.split(';').map((v) => v.trim());
    const match = parts.find((p) => p.startsWith(`${COOKIE_NAME}=`));
    const value = match ? decodeURIComponent(match.split('=')[1]) : '';
    let user = null as any;
    try { user = JSON.parse(value); } catch {}
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ user }));
    return;
  }

  res.statusCode = 404;
  res.end('not found');
});

const port = process.env.PORT ? Number(process.env.PORT) : 5174;
server.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
