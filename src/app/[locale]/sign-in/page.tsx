'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const params = useParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      console.log('开始登录:', { email })
      
      const locale = params?.locale || 'zh'
      const callbackUrl = `/${locale}`
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      console.log('登录结果:', { 
        ok: result?.ok,
        error: result?.error,
        url: result?.url
      })

      if (result?.error) {
        console.error('登录失败:', result.error)
        setError(result.error)
        return
      }

      if (result?.ok) {
        console.log('登录成功，正在跳转到首页:', callbackUrl)
        // 使用 replace 而不是 push，并添加完整的 URL
        router.replace(callbackUrl)
      }

    } catch (error) {
      console.error('登录过程发生错误:', error)
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#12122A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-[#E0E0FF]">
          登录账户
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1E1E3A] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                {error}
              </Alert>
            )}
            
            <div>
              <Label htmlFor="email" className="text-[#E0E0FF]">
                邮箱地址
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF]"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#E0E0FF]">
                密码
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF]"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7B68EE] hover:bg-[#6A5ACD] text-white"
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2A4A]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1E1E3A] text-[#E0E0FF]">
                  或者
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-center">
                <Link
                  href="/sign-up"
                  className="font-medium text-[#7B68EE] hover:text-[#6A5ACD]"
                >
                  还没有账户? 立即注册
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 