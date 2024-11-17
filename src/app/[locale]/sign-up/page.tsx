'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const params = useParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('密码不匹配')
      setLoading(false)
      return
    }

    try {
      // Get locale from URL params
      const locale = params?.locale || 'zh'
      
      console.log('Submitting registration:', { email, locale }) // Log attempt
      
      const res = await fetch(`/${locale}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error('Registration failed:', data) // Log error response
        throw new Error(data.message || '注册失败')
      }

      console.log('Registration successful') // Log success
      
      // Automatically sign in after successful registration
      router.push('/sign-in')
    } catch (error) {
      console.error('Registration error:', error) // Log error details
      setError(error instanceof Error ? error.message : '发生错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#12122A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-[#E0E0FF]">
          创建新账户
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
              <Label htmlFor="name" className="text-[#E0E0FF]">
                姓名
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF]"
              />
            </div>

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
                autoComplete="new-password"
                required
                className="mt-1 bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF]"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#E0E0FF]">
                确认密码
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
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
                {loading ? '注册中...' : '注册'}
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
                  href="/sign-in"
                  className="font-medium text-[#7B68EE] hover:text-[#6A5ACD]"
                >
                  已有账户? 立即登录
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 