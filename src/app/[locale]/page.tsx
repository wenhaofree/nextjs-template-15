'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ExternalLink, ArrowUp, Cpu } from "lucide-react"
import Image from "next/image"
// import Link from "next/link"
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Component() {
  const t = useTranslations('HomePage');
  const b = useTranslations('Button');
  const c = useTranslations('Category');
  const f = useTranslations('Filter');

  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      {/* Header */}
      <header className="border-b border-[#2A2A4A] bg-[#12122A] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Cpu className="w-8 h-8 text-[#7B68EE]" />
              <span className="text-xl font-semibold text-[#7B68EE]">Toolify.ai</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="#" className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors">
                {t('aiProducts')}
              </Link>
              <Link href="#" className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors">
                {t('category')}
              </Link>
              <Link href="#" className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors">
                {t('rankings')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-[#E0E0FF] hover:text-[#7B68EE] hover:bg-[#1E1E3A]">
              {b('login')}
            </Button>
            <Button size="sm" className="bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]">{b('joinToolify')}</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#7B68EE] bg-clip-text text-transparent bg-gradient-to-r from-[#7B68EE] to-[#4169E1]">
            {t('heroTitle')}
          </h1>
          <p className="text-[#B0B0DA] mb-8 max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Input
              placeholder={t('searchPlaceholder')}
              className="pl-10 py-6 bg-[#1E1E3A] border-[#3A3A5A] text-[#E0E0FF] placeholder-[#8080AA]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8080AA]" />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]">
              {b('search')}
            </Button>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[f('newest'), f('mostCollected'), f('basedOnCrowd'), f('recommended'), f('apps')].map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer bg-[#1E1E3A] text-[#7B68EE] hover:bg-[#2A2A4A] transition-colors">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 text-sm">
          {[c('writing'), c('image'), c('video'), c('code'), c('audio'), c('website'), c('marketing'), c('painting'), c('chatbot'), c('design')].map(
            (category) => (
              <button
                key={category}
                className="text-[#B0B0DA] hover:text-[#7B68EE] hover:bg-[#1E1E3A] px-4 py-2 rounded-full transition-colors"
              >
                {category}
              </button>
            )
          )}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-[#12122A] border-[#2A2A4A] overflow-hidden hover:shadow-lg hover:shadow-[#7B68EE]/10 transition-all duration-300">
              <Link href="#" className="block">
                <Image
                  src="/placeholder.svg"
                  alt="Tool preview"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#7B68EE]">{t('tool')} {i + 1}</h3>
                    <ExternalLink className="w-4 h-4 text-[#8080AA]" />
                  </div>
                  <p className="text-sm text-[#B0B0DA] mb-3">
                    {t('toolDescription')}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-[#7B68EE] text-[#7B68EE]" />
                      <span className="text-sm text-[#B0B0DA]">4.8</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-[#1E1E3A] text-[#7B68EE]">
                      {t('aiAssistant')}
                    </Badge>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B] p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}