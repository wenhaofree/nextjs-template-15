import { useTheme as useNextTheme } from 'next-themes';
import { useState, useEffect } from 'react';

/**
 * 主题切换的自定义 Hook
 * 封装 next-themes 的功能，提供额外的便利方法
 * 包含防止水合不匹配的逻辑
 */
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only returning theme values after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Return safe values before mount to prevent hydration mismatch
  if (!mounted) {
    return {
      theme: 'system',
      setTheme,
      resolvedTheme: 'light',
      systemTheme: 'light',
      toggleTheme,
      isDark: false,
      isLight: true,
      isSystem: true,
      mounted: false,
    };
  }

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';
  const isSystem = theme === 'system';

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    toggleTheme,
    isDark,
    isLight,
    isSystem,
    mounted: true,
  };
};
