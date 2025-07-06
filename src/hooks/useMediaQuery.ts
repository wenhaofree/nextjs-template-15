import { useState, useEffect } from 'react';

/**
 * 媒体查询的自定义 Hook
 * 用于响应式设计
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // 设置初始值
    setMatches(media.matches);

    // 监听变化
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
