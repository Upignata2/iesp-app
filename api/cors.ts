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

export function setCors(req: VercelRequest, res: VercelResponse) {
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

  // Allow * for development if needed (use with caution)
  // res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization, cookie, x-requested-with');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
  
  // Handle preflight directly in CORS helper if method is OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true; // Return true to indicate handled
  }
  
  return ok;
}
