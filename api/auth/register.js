import { registerUserWithEmail } from '../../db';
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
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }
    try {
        const { name, email, password } = (req.body || {});
        await registerUserWithEmail(name, email, password);
        res.status(200).json({ success: true });
    }
    catch {
        res.status(400).json({ success: false });
    }
}
