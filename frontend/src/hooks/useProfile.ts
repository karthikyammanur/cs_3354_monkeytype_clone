import { useState, useEffect, useCallback } from "react";
import { useApiClient } from "../api/client.ts";
import { useAuthStore } from "../stores/authStore.ts";
import type { TestHistory, TestStats, PaginatedResponse, User } from "../types/index.ts";

interface ProfileState {
  stats: TestStats | null;
  tests: TestHistory[];
  pagination: { page: number; totalPages: number };
  isLoading: boolean;
  error: string | null;
}

export function useProfile() {
  const api = useApiClient();
  const setUser = useAuthStore((s) => s.setUser);
  const [state, setState] = useState<ProfileState>({
    stats: null,
    tests: [],
    pagination: { page: 1, totalPages: 1 },
    isLoading: true,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    return api.get<TestStats>("/tests/stats");
  }, [api]);

  const fetchHistory = useCallback(async (page: number) => {
    return api.get<PaginatedResponse<TestHistory>>(`/tests?page=${page}&limit=20`);
  }, [api]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [stats, history] = await Promise.all([
          fetchStats(),
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
  }, [api, fetchStats, fetchHistory]);

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

  const deleteTest = useCallback(async (testId: string) => {
    await api.del(`/tests/${testId}`);
    const [stats, history] = await Promise.all([
      fetchStats(),
      fetchHistory(state.pagination.page),
    ]);
    setState((s) => ({
      ...s,
      stats,
      tests: history.tests,
      pagination: { page: history.pagination.page, totalPages: history.pagination.totalPages },
    }));
  }, [api, fetchStats, fetchHistory, state.pagination.page]);

  const updateUsername = useCallback(async (username: string) => {
    const updated = await api.put<User>("/users/me", { username });
    setUser(updated);
  }, [api, setUser]);

  return { ...state, changePage, deleteTest, updateUsername };
}
