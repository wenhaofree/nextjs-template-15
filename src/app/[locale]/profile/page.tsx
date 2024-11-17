'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Star, Calendar } from "lucide-react"
import { useEffect } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#12122A] flex items-center justify-center">
        <div className="text-[#E0E0FF]">加载中...</div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#12122A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-[#1E1E3A] border-[#2A2A4A] p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={session.user.image || ''} />
              <AvatarFallback className="bg-[#2A2A4A] text-[#E0E0FF]">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#E0E0FF] mb-4">
                个人资料
              </h1>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#7B68EE]" />
                  <span className="text-[#E0E0FF]">
                    {session.user.name || '未设置昵称'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#7B68EE]" />
                  <span className="text-[#E0E0FF]">{session.user.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-[#7B68EE]" />
                  <span className="text-[#E0E0FF]">
                    会员等级: {session.user.level || '免费用户'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#7B68EE]" />
                  <span className="text-[#E0E0FF]">
                    注册时间: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="border-[#7B68EE] text-[#7B68EE] hover:bg-[#7B68EE] hover:text-white"
                  onClick={() => router.push('/profile/edit')}
                >
                  编辑资料
                </Button>
                <Button
                  variant="outline"
                  className="border-[#7B68EE] text-[#7B68EE] hover:bg-[#7B68EE] hover:text-white"
                  onClick={() => router.push('/profile/password')}
                >
                  修改密码
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 收藏的工具 */}
        <Card className="mt-8 bg-[#1E1E3A] border-[#2A2A4A] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[#E0E0FF] mb-4">
            收藏���工具
          </h2>
          <div className="text-[#B0B0DA]">
            暂无收藏的工具
          </div>
        </Card>

        {/* 使用记录 */}
        <Card className="mt-8 bg-[#1E1E3A] border-[#2A2A4A] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[#E0E0FF] mb-4">
            使用记录
          </h2>
          <div className="text-[#B0B0DA]">
            暂无使用记录
          </div>
        </Card>
      </div>
    </div>
  )
} 