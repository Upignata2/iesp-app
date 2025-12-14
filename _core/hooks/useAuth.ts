import { useEffect, useState } from 'react';

const STORAGE_KEY_SESSION = 'iesp_session_user';

// Force relative path to ensure we hit the same domain (no CORS)
const API_BASE = '';

async function api(path: string, payload?: any) {
  const url = API_BASE ? `${API_BASE}${path}` : path;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try {
        const data = await res.json();
        throw new Error(String(data?.error || 'api'));
      } catch {
        throw new Error('api');
      }
    }
    const code = res.status;
    const map: Record<number, string> = {
      503: 'database_unavailable',
      500: 'database_unavailable',
      409: 'email_in_use',
      401: 'invalid_credentials',
      405: 'method_not_allowed',
      404: 'not_found',
      403: 'forbidden',
      400: 'invalid_fields',
    };
    throw new Error(map[code] || 'api');
  }
  return res.json();
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id?: number; name?: string; email?: string; role?: string; createdAt?: string } | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    (async () => {
      try {
        const meUrl = API_BASE ? `${API_BASE}/api/auth/me` : '/api/auth/me';
        const res = await fetch(meUrl, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(data.user));
            return;
          }
        }
      } catch {}
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch {}
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const data = await api('/api/auth/login', { email, password });
      if (!data?.user) throw new Error('Credenciais inválidas');
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const data = await api('/api/auth/register', { name, email, password });
      if (!data?.success) throw new Error(data?.error || 'Erro ao registrar');
      return true;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api('/api/auth/logout', {});
    } catch {}
    localStorage.removeItem(STORAGE_KEY_SESSION);
    setUser(null);
  }

  return { user, loading, isAuthenticated, login, register, logout } as const;
}
