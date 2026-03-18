"use client";

import { useState, useCallback, useEffect } from "react";
import {
  AdminService,
  ModerationLog,
  BookValidation,
  ModerationAction,
  ValidationStatus,
  UserStatus,
} from "@/lib/admin-service";

interface UseAdminOptions {
  autoFetch?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Use Moderation Logs.
 * @param options - options value.
 */
export function useModerationLogs(options: UseAdminOptions = {}) {
  const { autoFetch = true, limit = 50, offset = 0 } = options;
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminService.getModerationLogs({ limit, offset });
      setLogs(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load moderation logs");
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    if (autoFetch) {
      fetchLogs();
    }
  }, [autoFetch, fetchLogs]);

  const createLog = useCallback(async (data: { action: ModerationAction; targetId: string; reason?: string }) => {
    try {
      const created = await AdminService.createModerationLog(data);
      setLogs((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      throw new Error(err?.response?.data?.error || "Failed to create moderation log");
    }
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    createLog,
  };
}

/**
 * Use Book Validation.
 * @param bookId - book Id value.
 */
export function useBookValidation(bookId?: string) {
  const [validation, setValidation] = useState<BookValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchValidation = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await AdminService.getBookValidation(bookId);
      setValidation(data);
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        setError(err?.response?.data?.error || "Failed to load book validation");
      }
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (bookId) {
      fetchValidation();
    }
  }, [bookId, fetchValidation]);

  const updateValidation = useCallback(
    async (status: ValidationStatus, notes?: string) => {
      if (!bookId) return;
      try {
        const updated = await AdminService.updateBookValidation(bookId, { status, ...(notes && { notes }) });
        setValidation(updated);
        return updated;
      } catch (err: any) {
        throw new Error(err?.response?.data?.error || "Failed to update book validation");
      }
    },
    [bookId]
  );

  return {
    validation,
    loading,
    error,
    fetchValidation,
    updateValidation,
  };
}

/**
 * Use User Management.
 */
export function useUserManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserStatus = useCallback(async (userId: string, status: UserStatus) => {
    setLoading(true);
    setError(null);
    try {
      await AdminService.updateUserStatus(userId, status);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Failed to update user status";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetUserPreferences = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await AdminService.resetUserPreferences(userId);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Failed to reset user preferences";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateUserStatus,
    resetUserPreferences,
  };
}

