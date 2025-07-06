// 注意：这是一个基础的状态管理示例
// 在实际项目中，建议使用 Zustand、Redux 或其他状态管理库

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

/**
 * 认证状态管理 Store
 * 这是一个简化的实现，建议在生产环境中使用专业的状态管理库
 */
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  setUser: (user: User | null) => {
    authState.user = user;
    authState.isAuthenticated = !!user;
  },
  logout: () => {
    authState.user = null;
    authState.isAuthenticated = false;
  },
};

export const useAuthStore = () => authState;
