// 注意：这是一个基础的状态管理示例
// 在实际项目中，建议使用 Zustand、Redux 或其他状态管理库

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * 主题状态管理 Store
 * 这是一个简化的实现，建议在生产环境中使用专业的状态管理库
 */
let themeState: ThemeState = {
  theme: 'system',

  setTheme: (theme: Theme) => {
    themeState.theme = theme;
  },

  toggleTheme: () => {
    const currentTheme = themeState.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    themeState.theme = newTheme;
  },
};

export const useThemeStore = () => themeState;
