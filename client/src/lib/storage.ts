import { getUserId } from './session'; // Import your existing session

const STORAGE_KEY = 'scanvas_history';
const MAX_HISTORY = 50;

export interface StoredAudit {
  id: string;
  url: string;
  score: number;
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    total: number;
  };
  createdAt: string;
  success: boolean;
  error?: string;
}

// Get user-specific storage key
function getUserStorageKey(): string {
  const userId = getUserId();
  return `${STORAGE_KEY}_${userId}`;
}

// Save audit to user-specific localStorage
export function saveAuditLocally(audit: StoredAudit): void {
  try {
    const key = getUserStorageKey();
    const history = getLocalHistory();
    history.unshift(audit);
    
    if (history.length > MAX_HISTORY) {
      history.pop();
    }
    
    localStorage.setItem(key, JSON.stringify(history));
    console.log('💾 Audit saved for user:', getUserId());
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Get user's complete history
export function getLocalHistory(): StoredAudit[] {
  try {
    const key = getUserStorageKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return [];
  }
}

// Get single audit by ID
export function getLocalAuditById(id: string): StoredAudit | null {
  const history = getLocalHistory();
  return history.find(audit => audit.id === id) || null;
}

// Delete single audit
export function deleteAuditLocally(id: string): void {
  const key = getUserStorageKey();
  const history = getLocalHistory();
  const filtered = history.filter(audit => audit.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
  console.log('🗑️ Audit deleted for user:', getUserId());
}

// Delete multiple audits
export function deleteMultipleAuditsLocally(ids: string[]): void {
  const key = getUserStorageKey();
  const history = getLocalHistory();
  const filtered = history.filter(audit => !ids.includes(audit.id));
  localStorage.setItem(key, JSON.stringify(filtered));
}

// Clear all history for this user
export function clearAllHistory(): void {
  const key = getUserStorageKey();
  localStorage.removeItem(key);
  console.log('🧹 All history cleared for user:', getUserId());
}

// Check if history exists
export function hasLocalHistory(): boolean {
  return getLocalHistory().length > 0;
}

// Get history count
export function getLocalHistoryCount(): number {
  return getLocalHistory().length;
}

// Optional: Clear all users' history (for testing/cleanup)
export function clearAllUsersHistory(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEY)) {
      localStorage.removeItem(key);
    }
  });
}