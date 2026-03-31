const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Audit {
  id?: string;        // ✅ ADDED: optional id field
  _id: string;        // Keep _id for MongoDB
  url: string;
  score: number;
  createdAt: string;
  results?: {
    violations: any[];
  };
  summary?: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    total: number;
  };
}

export const api = {
  async get(url: string) {
    try {
      const res = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      return res.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },
  
  async post(url: string, data: any) {
    try {
      console.log('🌐 POST request to:', `${API_BASE_URL}${url}`);
      
      const res = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(data)
      });
      
      console.log('📥 Response status:', res.status);
      
      const responseData = await res.json();
      console.log('📦 Response data:', responseData);
      
      if (!res.ok) {
        // ✅ FIX: Check for either id or _id
        if (responseData.id || responseData._id) {
          return responseData;
        }
        throw new Error(responseData.error || `API request failed with status ${res.status}`);
      }
      
      return responseData;
    } catch (error) {
      console.error('❌ API POST error:', error);
      throw error;
    }
  },

  audits: {
    list: '/api/history',
    get: (id: string) => `/api/audit/${id}`,
    create: '/api/audit',
  },
};

// Build URL function
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}

// Get or create user ID
export function getUserId(): string {
  let userId = localStorage.getItem('scanvas_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('scanvas_user_id', userId);
  }
  return userId;
}