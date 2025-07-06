// 注意：这是一个基础的状态管理示例
// 在实际项目中，建议使用 Zustand、Redux 或其他状态管理库

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  preferences?: {
    language: string;
    notifications: boolean;
    theme: string;
  };
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
}

/**
 * 用户信息状态管理 Store
 * 这是一个简化的实现，建议在生产环境中使用专业的状态管理库
 */
let userState: UserState = {
  profile: null,
  isLoading: false,
  error: null,

  setProfile: (profile: UserProfile | null) => {
    userState.profile = profile;
    userState.error = null;
  },

  setLoading: (isLoading: boolean) => {
    userState.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    userState.error = error;
    userState.isLoading = false;
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    if (userState.profile) {
      userState.profile = { ...userState.profile, ...updates };
      userState.error = null;
    }
  },

  clearUser: () => {
    userState.profile = null;
    userState.isLoading = false;
    userState.error = null;
  },
};

export const useUserStore = () => userState;
