'use client'

import { Button } from "../ui/button"
import { Cpu } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const handleLoginClick = () => {
    router.push('/sign-in')
  }

  const handleSignUpClick = () => {
    router.push('/sign-up')
  }

  const handleSignOut = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: '/' 
    })
  }

  return (
    <header className="border-b border-[#2A2A4A] bg-[#12122A] sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Cpu className="w-8 h-8 text-[#7B68EE]" />
            <span className="text-xl font-semibold text-[#7B68EE]">Toolify.ai</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors">
              AI产品
            </Link>
            <Link 
              href="/categories" 
              className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors"
            >
              分类
            </Link>
            <Link 
              href="/price" 
              className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors"
            >
              价格
            </Link>
            <Link 
              href="/submit" 
              className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors"
            >
              提交
            </Link>
            <Link href="#" className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors">
              排行榜
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {status === "authenticated" && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#E0E0FF] hover:text-[#7B68EE] hover:bg-[#1E1E3A]"
                >
                  {session.user.name || session.user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="w-56 bg-[#1E1E3A] border-[#2A2A4A]"
              >
                <DropdownMenuItem
                  className="text-[#E0E0FF] focus:bg-[#2A2A4A] focus:text-[#7B68EE] cursor-pointer"
                  onClick={() => router.push(`/profile`)}
                >
                  个人资料
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-[#E0E0FF] focus:bg-[#2A2A4A] focus:text-[#7B68EE] cursor-pointer"
                  onClick={handleSignOut}
                >
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#E0E0FF] hover:text-[#7B68EE] hover:bg-[#1E1E3A]"
                onClick={handleLoginClick}
              >
                登录
              </Button>
              <Button 
                size="sm" 
                className="bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]"
                onClick={handleSignUpClick}
              >
                加入 Toolify
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 