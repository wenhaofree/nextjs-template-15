import { useTheme as useNextTheme } from 'next-themes';

/**
 * 主题切换的自定义 Hook
 * 封装 next-themes 的功能，提供额外的便利方法
 */
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

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
  };
};
