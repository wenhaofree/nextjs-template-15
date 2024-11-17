'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    if (error) {
      console.error('Auth error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-[#12122A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-[#E0E0FF]">
          认证错误
        </h2>
        <div className="mt-4 text-center text-[#E0E0FF]">
          {error === 'Configuration' && '系统配置错误，请联系管理员'}
          {error === 'AccessDenied' && '访问被拒绝'}
          {error === 'Verification' && '验证链接无效或已过期'}
          {!error && '发生未知错误'}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/sign-in')}
            className="text-[#7B68EE] hover:text-[#6A5ACD]"
          >
            返回登录
          </button>
        </div>
      </div>
    </div>
  )
} 