// Simple session management using localStorage
const SESSION_KEY = 'scanvas_user_id';

export function getUserId(): string {
  let userId = localStorage.getItem(SESSION_KEY);
  
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(SESSION_KEY, userId);
  }
  
  return userId;
}

function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}