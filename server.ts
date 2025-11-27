import 'dotenv/config';
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

function setCors(req: http.IncomingMessage, res: http.ServerResponse) {
  const allowed = process.env.WEB_ORIGIN;
  const origin = (req.headers['origin'] as string) || '*';
  const list = (allowed || '').split(',').map((s) => s.trim()).filter(Boolean);
  const finalOrigin = list.length ? (list.includes(origin) ? origin : list[0]) : origin;
  res.setHeader('Access-Control-Allow-Origin', finalOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

const server = http.createServer(async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const { registerUserWithEmail } = await dbPromise;
      await registerUserWithEmail(body.name, body.email, body.password);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    } catch (e) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false }));
    }
    return;
  }

  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const { loginWithEmail } = await dbPromise;
      const user = await loginWithEmail(body.email, body.password);
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
