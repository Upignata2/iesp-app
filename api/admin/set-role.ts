import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from '../cors';
import { users } from '../../schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ENV } from '../../_core/env';
import { eq } from 'drizzle-orm';

function getSession(req: VercelRequest) {
  const cookieHeader = (req.headers['cookie'] as string) || '';
  const parts = cookieHeader.split(';').map((v) => v.trim());
  const match = parts.find((p) => p.startsWith('session='));
  const value = match ? decodeURIComponent(match.split('=')[1]) : '';
  let user: any = null;
  try { user = JSON.parse(value); } catch {}
  return user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!ok) { res.status(403).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ success: false, error: 'method_not_allowed' }); return; }

  const me = getSession(req);
  if (!me || me.role !== 'admin') { res.status(403).json({ success: false, error: 'forbidden' }); return; }
  try {
    const raw = await new Promise<string>((resolve) => {
      let buf = ''; req.on('data', (c) => buf += c); req.on('end', () => resolve(buf));
    });
    const body = raw ? JSON.parse(raw) : {};
    const email = String(body?.email || '').trim();
    const role = String(body?.role || 'user');
    if (!email || !['user','admin'].includes(role)) { res.status(400).json({ success: false, error: 'invalid_fields' }); return; }
    const sql = postgres(process.env.DATABASE_URL || '', { max: 1 });
    const db = drizzle(sql);
    const result = await db.update(users).set({ role: role as any }).where(eq(users.email, email));
    await sql.end();
    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: 'unknown', detail: String(e?.message || '') });
  }
}
