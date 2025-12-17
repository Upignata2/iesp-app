import 'dotenv/config';
console.log("Starting server...");
import http from 'http';
import { URL } from 'url';
const COOKIE_NAME = 'session';
const dbPromise = import('./db.ts');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
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
      const email = String(body?.email || '').trim();
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

  // Admin content CRUD
  if (url.pathname === '/api/admin/content') {
    try {
      const cookieHeader = req.headers['cookie'] || '';
      const parts = cookieHeader.split(';').map((v) => v.trim());
      const match = parts.find((p) => p.startsWith(`${COOKIE_NAME}=`));
      const value = match ? decodeURIComponent(match.split('=')[1]) : '';
      let me = null as any;
      try { me = JSON.parse(value); } catch {}
      const method = req.method || 'GET';
      const { 
        getArticles, createArticle, updateArticle, deleteArticle,
        getNews, createNews, updateNews, deleteNews,
        getEvents, createEvent, updateEvent, deleteEvent,
        createDailyWord, updateDailyWord,
        getPrayerReasons, createPrayerReason, updatePrayerReason, deletePrayerReason,
        getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem
      } = await dbPromise as any;
      if (method === 'GET') {
        const type = String(url.searchParams.get('type') || '').trim();
        const limit = Number(url.searchParams.get('limit') || '50');
        const offset = Number(url.searchParams.get('offset') || '0');
        const id = Number(url.searchParams.get('id') || '0');
        let result: any = [];
        if (id) {
          if (type === 'article') result = await (await import('./db.ts')).getArticleById(id);
          else if (type === 'news') result = await (await import('./db.ts')).getNewsById(id);
          else if (type === 'event') result = await (await import('./db.ts')).getEventById(id);
          else { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'invalid_type' })); return; }
        } else {
          if (type === 'article') result = await getArticles(limit, offset);
          else if (type === 'news') result = await getNews(limit, offset);
          else if (type === 'event') result = await getEvents(limit, offset);
          else if (type === 'dailyWord') result = []; // see dedicated endpoints below
          else if (type === 'prayerReason') result = await getPrayerReasons(limit, offset);
          else if (type === 'gallery') result = await getGalleryItems(limit, offset);
          else { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'invalid_type' })); return; }
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, result }));
        return;
      }
      // write operations require admin
      if (!me || me.role !== 'admin') {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'forbidden' }));
        return;
      }
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const type = String(body?.type || '').trim();
      if (method === 'POST') {
        const data = body?.data || {};
        let result: any = null;
        if (type === 'article') result = await createArticle({ ...data, authorId: me.id });
        else if (type === 'news') result = await createNews({ ...data, authorId: me.id });
        else if (type === 'event') {
          const sd = typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate;
          const ed = data.endDate ? (typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate) : null;
          if (!sd || isNaN(sd.getTime())) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'invalid_startDate' }));
            return;
          }
          result = await createEvent({ 
            title: String(data.title || ''),
            description: data.description || null,
            content: data.content || null,
            imageUrl: data.imageUrl || null,
            location: data.location || null,
            startDate: sd,
            endDate: ed,
          });
        }
        else if (type === 'dailyWord') result = await createDailyWord(data);
        else if (type === 'prayerReason') result = await createPrayerReason(data);
        else if (type === 'gallery') result = await createGalleryItem({ ...data, uploadedBy: me.id });
        else { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'invalid_type' })); return; }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, result }));
        return;
      }
      if (method === 'PATCH') {
        const id = Number(body?.id || 0);
        const data = body?.data || {};
        if (!id) { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'missing_id' })); return; }
        let result: any = null;
        if (type === 'article') result = await updateArticle(id, data);
        else if (type === 'news') result = await updateNews(id, data);
        else if (type === 'event') result = await updateEvent(id, data);
        else if (type === 'dailyWord') result = await updateDailyWord(id, data);
        else if (type === 'prayerReason') result = await updatePrayerReason(id, data);
        else if (type === 'gallery') result = await updateGalleryItem(id, data);
        else { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'invalid_type' })); return; }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, result }));
        return;
      }
      if (method === 'DELETE') {
        const id = Number(body?.id || 0);
        if (!id) { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'missing_id' })); return; }
        let result: any = null;
        if (type === 'article') result = await deleteArticle(id);
        else if (type === 'news') result = await deleteNews(id);
        else if (type === 'event') result = await deleteEvent(id);
        else if (type === 'dailyWord') { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'delete_not_supported' })); return; }
        else if (type === 'prayerReason') result = await deletePrayerReason(id);
        else if (type === 'gallery') result = await deleteGalleryItem(id);
        else { res.statusCode = 400; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ success: false, error: 'invalid_type' })); return; }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, result }));
        return;
      }
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'method_not_allowed' }));
      return;
    } catch (e: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'unknown', detail: String(e?.message || '') }));
      return;
    }
  }

  // Daily Word - latest
  if (url.pathname === '/api/daily-word/latest' && req.method === 'GET') {
    try {
      const { getLatestDailyWord } = await dbPromise as any;
      const result = await getLatestDailyWord();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, result }));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'unknown' }));
    }
    return;
  }

  // Daily Word - by date
  if (url.pathname === '/api/daily-word' && req.method === 'GET') {
    try {
      const { getDailyWord } = await dbPromise as any;
      const date = String(url.searchParams.get('date') || '');
      const result = date ? await getDailyWord(date) : null;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, result }));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'unknown' }));
    }
    return;
  }

  // Service Schedules
  if (url.pathname === '/api/service-schedules' && req.method === 'GET') {
    try {
      const { getServiceSchedules } = await dbPromise as any;
      const result = await getServiceSchedules();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, result }));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'unknown' }));
    }
    return;
  }

  // Public gallery listing
  if (url.pathname === '/api/gallery' && req.method === 'GET') {
    try {
      const { getGalleryItems } = await dbPromise as any;
      const { listGalleryFiles } = await import('./_core/supabase.ts');
      const limit = Number(url.searchParams.get('limit') || '50');
      const offset = Number(url.searchParams.get('offset') || '0');
      let result = await getGalleryItems(limit, offset);
      if (!Array.isArray(result) || result.length === 0) {
        const files = await listGalleryFiles('gallery', true);
        result = files.map((f: any, idx: number) => ({
          id: idx + 1,
          title: f.name.replace(/\.[^.]+$/, ''),
          description: null,
          mediaUrl: f.publicUrl,
          mediaType: f.mediaType,
          eventId: null,
        }));
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, result }));
    } catch (e: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'unknown' }));
    }
    return;
  }

  res.statusCode = 404;
  res.end('not found');
});

const port = process.env.PORT ? Number(process.env.PORT) : 5174;
server.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
