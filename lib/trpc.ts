import { useState } from "react";

function useQueryStub<T>(initial: T): { data: T; isLoading: boolean } {
  const [data] = useState<T>(initial);
  return { data, isLoading: false };
}

function useMutation(_options?: any) {
  return { mutate: (_input: any) => {}, isPending: false };
}

export const trpc = {
  articles: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
    getById: { useQuery: (..._args: any[]) => useQueryStub<any | null>(null) },
  },
  news: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
    getById: { useQuery: (..._args: any[]) => useQueryStub<any | null>(null) },
  },
  events: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
    getById: { useQuery: (..._args: any[]) => useQueryStub<any | null>(null) },
  },
  hymns: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
    getById: { useQuery: (..._args: any[]) => useQueryStub<any | null>(null) },
    search: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
  },
  dailyWord: {
    getByDate: { useQuery: (..._args: any[]) => useQueryStub<any | null>(null) },
    getLatest: { useQuery: (..._args: any[]) => useQueryStub<any | null>(null) },
  },
  prayerReasons: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
    create: { useMutation: (opts?: any) => useMutation(opts) },
  },
  serviceSchedules: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
  },
  gallery: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
  },
  campaigns: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
    getById: { useQuery: (..._args: any[]) => useQueryStub<any | null>(null) },
    donate: { useMutation: (opts?: any) => useMutation(opts) },
  },
  favorites: {
    list: { useQuery: (..._args: any[]) => useQueryStub<any[]>([]) },
    add: { useMutation: (opts?: any) => useMutation(opts) },
    remove: { useMutation: (opts?: any) => useMutation(opts) },
  },
} as const;
