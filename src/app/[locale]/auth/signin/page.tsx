import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import SignInForm from './SignInForm';

// 服务器组件
export default async function SignIn(
  props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ callbackUrl?: string; error?: string; email?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  // 使用 await 获取 locale
  const { locale } = await props.params;

  // 设置请求的 locale
  unstable_setRequestLocale(locale);

  // 获取翻译
  const t = await getTranslations('auth');

  // 正确处理searchParams（Next.js 15需要这种写法）
  const error = searchParams?.error;
  const callbackUrl = searchParams?.callbackUrl || '/';
  const email = searchParams?.email || '';

  // 获取错误提示文本
  let errorMessage = '';
  if (error) {
    switch (error) {
      case 'OAuthCallback':
        errorMessage = t('oauthError');
        break;
      case 'CredentialsSignin':
        errorMessage = t('invalidCredentials');
        break;
      default:
        errorMessage = t('authError');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t('signInTitle')}
          </h2>
          {errorMessage && (
            <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 rounded-md">
              {errorMessage}
            </div>
          )}
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SignInForm callbackUrl={callbackUrl} initialEmail={email} />
        </Suspense>
      </div>
    </div>
  );
} 