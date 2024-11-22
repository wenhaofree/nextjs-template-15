'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'

export default function SignUpPage() {
  const t = useTranslations('SignUp')
  const router = useRouter()
  const pathname = usePathname()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Get locale from pathname
  const locale = pathname.split('/')[1] || 'zh'

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
      setError(t('error.passwordMismatch'))
      setLoading(false)
      return
    }

    try {
      console.log('Submitting registration:', { email, locale })
      
      const res = await fetch(`/api/auth/register`, {
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
        console.error('Registration failed:', data)
        throw new Error(data.message || t('error.registrationFailed'))
      }

      console.log('Registration successful')
      
      // Redirect to sign-in page with correct locale
      router.push(`/sign-in`)
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : t('error.default'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#12122A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-[#E0E0FF]">
          {t('title')}
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
                {t('name')}
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
                {t('email')}
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
                {t('password')}
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
                {t('confirmPassword')}
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
                {loading ? t('button.loading') : t('button.signUp')}
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
                  {t('divider')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-center">
                <Link
                  href={`/sign-in`}
                  className="font-medium text-[#7B68EE] hover:text-[#6A5ACD]"
                >
                  {t('login.text')} {t('login.link')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 