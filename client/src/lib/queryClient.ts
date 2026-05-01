import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { saveAuditLocally, getLocalHistory, StoredAudit } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "omit",
  });

  await throwIfResNotOk(res);
  
  if (method === 'POST' && url === '/api/audit' && res.ok) {
    const audit = await res.clone().json();
    if (audit.success !== false) {
      saveAuditLocally(audit);
    }
  }
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    if (url === 'api/history') {
      return getLocalHistory();
    }
    
    if (url.startsWith('api/audit/')) {
      const id = url.split('/')[2];
      const localAudit = getLocalHistory().find(a => a.id === id);
      if (localAudit) {
        return localAudit;
      }
    }
    
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}/${url}`;
    const res = await fetch(fullUrl, {
      credentials: "omit",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    const data = await res.json();
    
    if (url.startsWith('api/audit/') && data.id) {
      saveAuditLocally(data);
    }
    
    return data;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});