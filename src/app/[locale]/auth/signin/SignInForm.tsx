'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

// 预先定义SVG组件以提高性能
const GoogleIcon = () => (
  <svg className="h-5 w-5" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <title>Google Logo</title>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GithubIcon = () => (
  <svg className="h-5 w-5" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <title>GitHub Logo</title>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
  </svg>
);

export default function SignInForm({ 
  callbackUrl, 
  initialEmail = '' 
}: { 
  callbackUrl: string;
  initialEmail?: string;
}) {
  const [loading, setLoading] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const t = useTranslations('auth');
  const router = useRouter();

  // 当initialEmail参数变化时更新email状态
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSignIn = async (provider: string) => {
    try {
      setLoading(provider);
      setError('');
      const result = await signIn(provider, { 
        callbackUrl: callbackUrl || '/',
        redirect: false,
      });

      // 检查是否成功
      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        // 成功，手动导航到URL
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(t('signInError'));
    } finally {
      setLoading('');
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading('credentials');
      
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: callbackUrl || '/',
        redirect: false,
      });
      
      if (result?.error) {
        console.error("登录错误:", result.error);
        setError(t('invalidCredentials'));
      } else if (result?.url) {
        // 成功，手动导航到URL
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(t('signInError'));
    } finally {
      setLoading('');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading('signup');
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('signUpError'));
      }
      
      // 注册成功
      setSuccess(t('signUpSuccess'));
      
      // 切换到登录表单，准备登录
      setIsSignUp(false);
      
      // 3秒后自动尝试登录
      setTimeout(() => {
        handleCredentialsSignIn(e);
      }, 1000);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : t('signUpError'));
    } finally {
      setLoading('');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  return (
    <div className="mt-8 space-y-6">
      {success && (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}
      
      {isSignUp ? (
        // 注册表单
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!!loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!!loading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              {t('confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!!loading}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={!!loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'signup' ? t('signingUp') : t('signUp')}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <button 
              type="button"
              onClick={toggleMode}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('alreadyHaveAccount')}
            </button>
          </div>
        </form>
      ) : (
        // 登录表单
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!!loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!!loading}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={!!loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'credentials' ? t('signingIn') : t('signIn')}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <button 
              type="button"
              onClick={toggleMode}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('noAccount')}
            </button>
          </div>
        </form>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{t('orContinueWith')}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" && (
          <button
            type="button"
            onClick={() => handleSignIn('google')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {loading === 'google' ? t('signingIn') : t('signInWithGoogle')}
          </button>
        )}
        {process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" && (
          <button
            type="button"
            onClick={() => handleSignIn('github')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#24292F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GithubIcon />
            {loading === 'github' ? t('signingIn') : t('signInWithGithub')}
          </button>
        )}
      </div>
    </div>
  );
} 