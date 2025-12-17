import { useEffect, useState } from "react";

function useQueryFetch<T>(path: string, initial: T, enabled: boolean = true): { data: T; isLoading: boolean } {
  const [data, setData] = useState<T>(initial as T);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!enabled) { setIsLoading(false); return; }
      setIsLoading(true);
      try {
        const res = await fetch(path, { credentials: "include" });
        const json = await res.json();
        const result = (json?.result ?? json) as T;
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData(initial);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [path, enabled]);
  return { data, isLoading };
}

function useMutation(..._args: any[]) {
  return { mutate: (_input: any) => {}, isPending: false };
}

export const trpc = {
  articles: {
    list: {
      useQuery: ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) =>
        useQueryFetch(`/api/admin/content?type=article&limit=${limit}&offset=${offset}`, [] as any[]),
    },
    getById: {
      useQuery: ({ id }: { id: number }, opts?: { enabled?: boolean }) =>
        useQueryFetch(`/api/admin/content?type=article&id=${id}`, null as any, opts?.enabled ?? true),
    },
  },
  news: {
    list: {
      useQuery: ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) =>
        useQueryFetch(`/api/admin/content?type=news&limit=${limit}&offset=${offset}`, [] as any[]),
    },
    getById: {
      useQuery: ({ id }: { id: number }, opts?: { enabled?: boolean }) =>
        useQueryFetch(`/api/admin/content?type=news&id=${id}`, null as any, opts?.enabled ?? true),
    },
  },
  events: {
    list: {
      useQuery: ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) =>
        useQueryFetch(`/api/admin/content?type=event&limit=${limit}&offset=${offset}`, [] as any[]),
    },
    getById: {
      useQuery: ({ id }: { id: number }, opts?: { enabled?: boolean }) =>
        useQueryFetch(`/api/admin/content?type=event&id=${id}`, null as any, opts?.enabled ?? true),
    },
  },
  hymns: {
    list: {
      useQuery: ({ limit = 100, offset = 0 }: { limit?: number; offset?: number }) =>
        useQueryFetch(`/api/hymns?limit=${limit}&offset=${offset}`, [] as any[]),
    },
    getById: { useQuery: (..._args: any[]) => ({ data: null as any, isLoading: false }) },
    search: { useQuery: (..._args: any[]) => ({ data: [] as any[], isLoading: false }) },
  },
  dailyWord: {
    getByDate: {
      useQuery: ({ date }: { date: string }) =>
        useQueryFetch(`/api/daily-word?date=${encodeURIComponent(date)}`, null as any),
    },
    getLatest: {
      useQuery: () => useQueryFetch(`/api/daily-word/latest`, null as any),
    },
  },
  prayerReasons: {
    list: {
      useQuery: ({ limit = 50, offset = 0 }: { limit?: number; offset?: number }) =>
        useQueryFetch(`/api/admin/content?type=prayerReason&limit=${limit}&offset=${offset}`, [] as any[]),
    },
    create: { useMutation: (...opts: any[]) => useMutation(...opts) },
  },
  serviceSchedules: {
    list: {
      useQuery: () => useQueryFetch(`/api/service-schedules`, [] as any[]),
    },
  },
  gallery: {
    list: {
      useQuery: ({ limit = 50 }: { limit?: number }) =>
        useQueryFetch(`/api/gallery?limit=${limit}`, [] as any[]),
    },
  },
  campaigns: {
    list: { useQuery: (..._args: any[]) => ({ data: [] as any[], isLoading: false }) },
    getById: { useQuery: (..._args: any[]) => ({ data: null as any, isLoading: false }) },
    donate: { useMutation: (...opts: any[]) => useMutation(...opts) },
  },
  favorites: {
    list: { useQuery: (..._args: any[]) => ({ data: [] as any[], isLoading: false }) },
    add: { useMutation: (...opts: any[]) => useMutation(...opts) },
    remove: { useMutation: (...opts: any[]) => useMutation(...opts) },
  },
} as const;
