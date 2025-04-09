// 这是服务器端组件
import { getServerSession } from "next-auth/next";
import { config } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { unstable_setRequestLocale } from 'next-intl/server';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 使用 await 获取 locale
  const { locale } = await params;
  // 设置请求的 locale
  unstable_setRequestLocale(locale);
  
  // 使用getTranslations替代useTranslations
  const t = await getTranslations('profile');
  
  // 获取当前会话
  const session = await getServerSession(config);
  
  // 如果未登录，重定向到登录页面
  if (!session?.user?.email) {
    return notFound();
  }
  
  // 获取用户详细信息
  const userDetail = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!userDetail) {
    return notFound();
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-3xl bg-card text-card-foreground shadow overflow-hidden sm:rounded-lg border border-border">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-2xl font-bold leading-6 text-foreground">
            {t('title')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="border-t border-border px-4 py-5 sm:px-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              {userDetail.avatarUrl ? (
                <Image
                  className="h-24 w-24 rounded-full"
                  src={userDetail.avatarUrl}
                  alt={userDetail.nickname || ""}
                  width={96}
                  height={96}
                  unoptimized
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-3xl text-muted-foreground">
                    {userDetail.nickname?.charAt(0) || userDetail.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold leading-tight text-foreground">
                {userDetail.nickname || t('unknown')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {userDetail.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border">
          <dl>
            <div className="bg-muted px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('uuid')}
              </dt>
              <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                {userDetail.uuid}
              </dd>
            </div>
            <div className="bg-card px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('email')}
              </dt>
              <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                {userDetail.email}
              </dd>
            </div>
            <div className="bg-muted px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('nickname')}
              </dt>
              <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                {userDetail.nickname || t('unknown')}
              </dd>
            </div>
            <div className="bg-card px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('registrationDate')}
              </dt>
              <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                {new Date(userDetail.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="bg-muted px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('signinMethod')}
              </dt>
              <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                {userDetail.signinProvider?.toUpperCase() || t('unknown')}
              </dd>
            </div>
            <div className="bg-card px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('lastSigninIp')}
              </dt>
              <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                {userDetail.signinIp || t('unknown')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 