function setCors(req, res) {
    const list = (process.env.WEB_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
    const origin = req.headers.origin || '*';
    const finalOrigin = list.length ? (list.includes(origin) ? origin : list[0]) : origin;
    res.setHeader('Access-Control-Allow-Origin', finalOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}
export default async function handler(req, res) {
    setCors(req, res);
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
    }
    const cookieHeader = req.headers['cookie'] || '';
    const parts = cookieHeader.split(';').map((v) => v.trim());
    const match = parts.find((p) => p.startsWith('session='));
    const value = match ? decodeURIComponent(match.split('=')[1]) : '';
    let user = null;
    try {
        user = JSON.parse(value);
    }
    catch { }
    res.status(200).json({ user });
}
