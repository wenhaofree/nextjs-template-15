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
      const locale = params?.locale || 'zh'
      const callbackUrl = `/${locale}`
      
      console.log('Starting login:', { email, callbackUrl })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: `${window.location.origin}${callbackUrl}`
      })

      console.log('Login result:', result)

      if (result?.error) {
        setError(result.error)
        return
      }

      if (result?.ok) {
        router.replace(callbackUrl)
      }

    } catch (error) {
      console.error('Login error:', error)
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      const locale = params?.locale || 'zh'
      const callbackUrl = `/${locale}`
      
      await signIn('google', {
        callbackUrl: `${window.location.origin}${callbackUrl}`
      })
    } catch (error) {
      console.error('Google login error:', error)
      setError('登录失败，请重试')
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
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                使用谷歌账号登录
              </Button>

              <div className="mt-6 text-sm text-center">
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