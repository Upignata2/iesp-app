import { useState } from "react";
function useQueryStub(initial) {
    const [data] = useState(initial);
    return { data, isLoading: false };
}
function useMutation() {
    return { mutate: (_input) => { }, isPending: false };
}
export const trpc = {
    articles: {
        list: { useQuery: (..._args) => useQueryStub([]) },
        getById: { useQuery: (..._args) => useQueryStub(null) },
    },
    news: {
        list: { useQuery: (..._args) => useQueryStub([]) },
        getById: { useQuery: (..._args) => useQueryStub(null) },
    },
    events: {
        list: { useQuery: (..._args) => useQueryStub([]) },
        getById: { useQuery: (..._args) => useQueryStub(null) },
    },
    hymns: {
        list: { useQuery: (..._args) => useQueryStub([]) },
        getById: { useQuery: (..._args) => useQueryStub(null) },
        search: { useQuery: (..._args) => useQueryStub([]) },
    },
    dailyWord: {
        getByDate: { useQuery: (..._args) => useQueryStub(null) },
        getLatest: { useQuery: (..._args) => useQueryStub(null) },
    },
    prayerReasons: {
        list: { useQuery: (..._args) => useQueryStub([]) },
        create: { useMutation: () => useMutation() },
    },
    serviceSchedules: {
        list: { useQuery: (..._args) => useQueryStub([]) },
    },
    gallery: {
        list: { useQuery: (..._args) => useQueryStub([]) },
    },
    campaigns: {
        list: { useQuery: (..._args) => useQueryStub([]) },
        getById: { useQuery: (..._args) => useQueryStub(null) },
        donate: { useMutation: () => useMutation() },
    },
    favorites: {
        list: { useQuery: (..._args) => useQueryStub([]) },
        add: { useMutation: () => useMutation() },
        remove: { useMutation: () => useMutation() },
    },
};
