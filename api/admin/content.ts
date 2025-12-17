import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from '../cors';
import * as db from '../../db';

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
  const me = getSession(req);
  if (!me || me.role !== 'admin') { res.status(403).json({ success: false, error: 'forbidden' }); return; }
  try {
    const method = req.method || 'GET';
    if (method === 'GET') {
      const url = new URL((req as any).url || '/', 'http://localhost');
      const type = String(url.searchParams.get('type') || '').trim();
      const limit = Number(url.searchParams.get('limit') || '50');
      const offset = Number(url.searchParams.get('offset') || '0');
      let result: any = null;
      if (type === 'article') result = await db.getArticles(limit, offset);
      else if (type === 'news') result = await db.getNews(limit, offset);
      else if (type === 'event') result = await db.getEvents(limit, offset);
      else if (type === 'dailyWord') result = await db.getDailyWord(new Date().toISOString().slice(0, 10)) || null;
      else if (type === 'prayerReason') result = await db.getPrayerReasons(limit, offset);
      else if (type === 'gallery') result = await db.getGalleryItems(limit, offset);
      else { res.status(400).json({ success: false, error: 'invalid_type' }); return; }
      res.status(200).json({ success: true, result });
      return;
    }
    const raw = await new Promise<string>((resolve) => {
      let buf = ''; req.on('data', (c) => buf += c); req.on('end', () => resolve(buf));
    });
    const body = raw ? JSON.parse(raw) : {};
    const type = String(body?.type || '').trim();
    if (method === 'POST') {
      const data = body?.data || {};
      let result: any = null;
      if (type === 'article') result = await db.createArticle({ ...data, authorId: me.id });
      else if (type === 'news') result = await db.createNews({ ...data, authorId: me.id });
      else if (type === 'event') {
        const sd = new Date(data?.startDate);
        const ed = data?.endDate ? new Date(data.endDate) : null;
        if (isNaN(sd.getTime())) { res.status(400).json({ success: false, error: 'invalid_startDate' }); return; }
        const eventData = {
          title: String(data?.title || ''),
          description: data?.description || null,
          content: data?.content || null,
          location: data?.location || null,
          imageUrl: data?.imageUrl || null,
          startDate: sd,
          endDate: ed,
        };
        result = await db.createEvent(eventData as any);
      }
      else if (type === 'dailyWord') result = await db.createDailyWord(data);
      else if (type === 'prayerReason') result = await db.createPrayerReason(data);
      else if (type === 'gallery') result = await db.createGalleryItem({ ...data, uploadedBy: me.id });
      else { res.status(400).json({ success: false, error: 'invalid_type' }); return; }
      res.status(200).json({ success: true, result });
      return;
    }
    if (method === 'PATCH') {
      const id = Number(body?.id || 0);
      const data = body?.data || {};
      if (!id) { res.status(400).json({ success: false, error: 'missing_id' }); return; }
      let result: any = null;
      if (type === 'article') result = await db.updateArticle(id, data);
      else if (type === 'news') result = await db.updateNews(id, data);
      else if (type === 'event') result = await db.updateEvent(id, data);
      else if (type === 'dailyWord') result = await db.updateDailyWord(id, data);
      else if (type === 'prayerReason') result = await db.updatePrayerReason(id, data);
      else if (type === 'gallery') result = await db.updateGalleryItem(id, data);
      else { res.status(400).json({ success: false, error: 'invalid_type' }); return; }
      res.status(200).json({ success: true, result });
      return;
    }
    if (method === 'DELETE') {
      const id = Number(body?.id || 0);
      if (!id) { res.status(400).json({ success: false, error: 'missing_id' }); return; }
      let result: any = null;
      if (type === 'article') result = await db.deleteArticle(id);
      else if (type === 'news') result = await db.deleteNews(id);
      else if (type === 'event') result = await db.deleteEvent(id);
      else if (type === 'dailyWord') result = await db.deleteDailyWord(id);
      else if (type === 'prayerReason') result = await db.deletePrayerReason(id);
      else if (type === 'gallery') result = await db.deleteGalleryItem(id);
      else { res.status(400).json({ success: false, error: 'invalid_type' }); return; }
      res.status(200).json({ success: true, result });
      return;
    }
    res.status(405).json({ success: false, error: 'method_not_allowed' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: 'unknown', detail: String(e?.message || '') });
  }
}
