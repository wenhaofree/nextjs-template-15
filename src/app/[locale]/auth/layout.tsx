import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "登录",
  description: "账户登录",
};

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 使用 await 获取 locale
  const { locale } = await params;
  
  // 设置请求的 locale
  setRequestLocale(locale);

  return (
    <>
      {children}
    </>
  );
} 