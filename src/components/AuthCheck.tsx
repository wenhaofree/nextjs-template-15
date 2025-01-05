'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 当状态改变时自动刷新页面
    if (status === 'authenticated') {
      router.refresh();
    }
  }, [status, router]);

  // 这个组件不渲染任何内容，只处理登录状态
  return null;
}
