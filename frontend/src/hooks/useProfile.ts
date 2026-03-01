import { useState, useEffect, useCallback } from "react";
import { useApiClient } from "../api/client.ts";
import type { TestHistory, TestStats, PaginatedResponse } from "../types/index.ts";

interface ProfileState {
  stats: TestStats | null;
  tests: TestHistory[];
  pagination: { page: number; totalPages: number };
  isLoading: boolean;
  error: string | null;
}

export function useProfile() {
  const api = useApiClient();
  const [state, setState] = useState<ProfileState>({
    stats: null,
    tests: [],
    pagination: { page: 1, totalPages: 1 },
    isLoading: true,
    error: null,
  });

  const fetchHistory = useCallback(async (page: number) => {
    const data = await api.get<PaginatedResponse<TestHistory>>(`/tests?page=${page}&limit=20`);
    return data;
  }, [api]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [stats, history] = await Promise.all([
          api.get<TestStats>("/tests/stats"),
          fetchHistory(1),
        ]);
        if (cancelled) return;
        setState({
          stats,
          tests: history.tests,
          pagination: { page: history.pagination.page, totalPages: history.pagination.totalPages },
          isLoading: false,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setState((s) => ({ ...s, isLoading: false, error: (e as Error).message }));
      }
    }

    load();
    return () => { cancelled = true; };
  }, [api, fetchHistory]);

  const changePage = useCallback(async (page: number) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const history = await fetchHistory(page);
      setState((s) => ({
        ...s,
        tests: history.tests,
        pagination: { page: history.pagination.page, totalPages: history.pagination.totalPages },
        isLoading: false,
      }));
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false, error: (e as Error).message }));
    }
  }, [fetchHistory]);

  return { ...state, changePage };
}
