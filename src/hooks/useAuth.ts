import { useSession, signOut } from 'next-auth/react';

/**
 * 认证相关的自定义 Hook
 * 提供用户认证状态和相关操作
 */
export const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    session,
    logout,
  };
};
