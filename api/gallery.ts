import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as db from '../db';
import { listGalleryFiles } from '../_core/supabase';
import { setCors } from './cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ok = setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (!ok) { res.status(403).end(); return; }

  try {
    const method = req.method || 'GET';
    if (method === 'GET') {
      const url = new URL((req as any).url || '/', 'http://localhost');
      const limit = Number(url.searchParams.get('limit') || '50');
      const offset = Number(url.searchParams.get('offset') || '0');
      let result: { id: number; title: string; description: string | null; mediaUrl: string; mediaType: 'image' | 'video'; eventId: number | null; }[] = [];
      const rows = await db.getGalleryItems(limit, offset) as any[];
      if (Array.isArray(rows) && rows.length) {
        result = rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description ?? null,
          mediaUrl: r.mediaUrl,
          mediaType: r.mediaType,
          eventId: r.eventId ?? null,
        }));
      } else {
        const files = await listGalleryFiles('gallery', true) as any[];
        result = files.map((f: any, idx: number) => ({
          id: idx + 1,
          title: String(f.name || '').replace(/\.[^.]+$/, ''),
          description: null,
          mediaUrl: f.publicUrl,
          mediaType: f.mediaType,
          eventId: null,
        }));
      }
      res.status(200).json({ success: true, result });
      return;
    }
    res.status(405).json({ success: false, error: 'method_not_allowed' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: 'unknown', detail: String(e?.message || '') });
  }
}
