import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from '../cors.js';

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

import { registerUserWithEmail } from '../../db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const ok = setCors(req, res);
    // If setCors returned true and method is OPTIONS, it handled the response
    if (req.method === 'OPTIONS') return; 
    
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
      console.error('[api/auth/register]', e);
      
      // Retorna o erro real para debug
      const errorResponse = {
        success: false,
        error: 'unknown',
        error_message: msg,
        error_stack: e?.stack
      };

      if (msg.includes('Email already exists')) { 
        res.status(409).json({ success: false, error: 'email_in_use' }); 
        return; 
      }
      if (msg.includes('Database not available')) { 
        res.status(503).json({ ...errorResponse, error: 'database_unavailable' }); 
        return; 
      }
      
      res.status(500).json(errorResponse);
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'api_critical', message: err?.message });
  }
}

