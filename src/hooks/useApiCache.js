// src/hooks/useApiCache.js
// Hook để cache API responses và tối ưu performance

import { useState, useEffect, useCallback, useRef } from 'react';

// In-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

/**
 * Hook để cache API responses
 * @param {string} key - Cache key
 * @param {Function} fetcher - Async function để fetch data
 * @param {Object} options - Tùy chọn
 * @param {number} options.cacheDuration - Thời gian cache (ms)
 * @param {boolean} options.enabled - Có enable fetch không
 * @param {Array} options.deps - Dependencies để refetch
 */
export function useApiCache(key, fetcher, options = {}) {
  const {
    cacheDuration = CACHE_DURATION,
    enabled = true,
    deps = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Kiểm tra cache
    if (!forceRefresh) {
      const cached = cache.get(key);
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        setData(cached.data);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();

      if (mountedRef.current) {
        // Lưu vào cache
        cache.set(key, { data: result, timestamp: Date.now() });
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
        console.error('useApiCache error:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [key, fetcher, cacheDuration, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [key, ...deps]);

  // Refresh function để force refetch
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Clear cache function
  const clearCache = useCallback(() => {
    cache.delete(key);
  }, [key]);

  return { data, loading, error, refresh, clearCache };
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cache.clear();
}

/**
 * Clear cache by prefix
 * @param {string} prefix - Key prefix
 */
export function clearCacheByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

/**
 * Hook để debounce search
 * @param {string} value - Giá trị search
 * @param {number} delay - Delay time (ms)
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook để throttle actions
 * @param {Function} callback - Callback function
 * @param {number} delay - Delay time (ms)
 */
export function useThrottle(callback, delay = 300) {
  const lastRunRef = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRunRef.current >= delay) {
      lastRunRef.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}

/**
 * Hook để lazy load data khi element visible
 * @param {Function} fetcher - Async function để fetch data
 * @param {Object} options - IntersectionObserver options
 */
export function useLazyLoad(fetcher, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isVisible && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      setLoading(true);

      fetcher()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [isVisible, fetcher]);

  return { data, loading, error, elementRef, isVisible };
}

export default useApiCache;
