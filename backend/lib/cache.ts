interface CacheEntry {
  result: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedResult(url: string, standards: string[]) {
  const key = `${url}-${standards.join(',')}`;
  const entry = cache.get(key);
  
  if (entry && (Date.now() - entry.timestamp) < CACHE_TTL) {
    console.log('✅ Cache hit for:', url);
    return entry.result;
  }
  
  console.log('❌ Cache miss for:', url);
  return null;
}

export function setCachedResult(url: string, standards: string[], result: any) {
  const key = `${url}-${standards.join(',')}`;
  cache.set(key, {
    result,
    timestamp: Date.now()
  });
}