import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from '../cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!ok) { res.status(403).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ success: false, error: 'method_not_allowed' }); return; }

  const cookieHeader = req.headers['cookie'] || '';
  const parts = cookieHeader.split(';').map((v) => v.trim());
  const match = parts.find((p) => p.startsWith('session='));
  const value = match ? decodeURIComponent(match.split('=')[1]) : '';
  let user: any = null;
  try { user = JSON.parse(value); } catch {}
  res.status(200).json({ user });
}
