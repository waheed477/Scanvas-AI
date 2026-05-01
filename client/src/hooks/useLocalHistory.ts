import { useState, useEffect, useCallback } from 'react';
import { 
  StoredAudit, 
  getLocalHistory, 
  deleteAuditLocally, 
  deleteMultipleAuditsLocally,
  clearAllHistory,
  getLocalHistoryCount
} from '../lib/storage';
import { getUserId, clearSession } from '../lib/session';

export function useLocalHistory() {
  const [audits, setAudits] = useState<StoredAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState<string>('');

  const refreshHistory = useCallback(() => {
    const history = getLocalHistory();
    setAudits(history);
    setCount(history.length);
    setLoading(false);
    setUserId(getUserId());
  }, []);

  const deleteAudit = useCallback((id: string) => {
    deleteAuditLocally(id);
    refreshHistory();
  }, [refreshHistory]);

  const deleteMultipleAudits = useCallback((ids: string[]) => {
    deleteMultipleAuditsLocally(ids);
    refreshHistory();
  }, [refreshHistory]);

  const clearHistory = useCallback(() => {
    clearAllHistory();
    refreshHistory();
  }, [refreshHistory]);

  const resetSession = useCallback(() => {
    if (confirm('This will clear your session and history. Continue?')) {
      clearSession();
      clearAllHistory();
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return {
    audits,
    loading,
    count,
    userId,
    deleteAudit,
    deleteMultipleAudits,
    clearHistory,
    resetSession,
    refreshHistory
  };
}