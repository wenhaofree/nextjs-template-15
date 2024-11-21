'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ExternalLink, ArrowUp } from "lucide-react"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import type { DbTool } from '@/lib/neon'
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ToolsState {
  tools: DbTool[];
  total: number;
  hasMore: boolean;
  page: number;
  loading: boolean;
  error: string | null;
}

export default function Component() {
  const t = useTranslations('HomePage');
  const b = useTranslations('Button');
  const c = useTranslations('Category');
  const f = useTranslations('Filter');

  const [showScrollTop, setShowScrollTop] = useState(false)

  const [toolsState, setToolsState] = useState<ToolsState>({
    tools: [],
    total: 0,
    hasMore: false,
    page: 1,
    loading: true,
    error: null
  });

  const fetchTools = useCallback(async (page: number = 1) => {
    try {
      setToolsState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(
        `/api/tools?page=${page}&limit=12&sortBy=created_at&sortOrder=DESC`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      
      const result = await response.json();
      
      setToolsState(prev => ({
        ...prev,
        tools: page === 1 ? result.tools : [...prev.tools, ...result.tools],
        total: result.total,
        hasMore: result.hasMore,
        page,
        loading: false
      }));
    } catch (error) {
      setToolsState(prev => ({ 
        ...prev, 
        loading: false,
        error: 'Failed to load tools. Please try again later.'
      }));
    }
  }, []);

  useEffect(() => {
    fetchTools(1);
  }, [fetchTools]);

  const handleLoadMore = () => {
    if (toolsState.hasMore && !toolsState.loading) {
      fetchTools(toolsState.page + 1);
    }
  };

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
        {/* <div className="flex flex-wrap gap-2 mb-8">
          {[f('newest'), f('mostCollected'), f('basedOnCrowd'), f('recommended'), f('apps')].map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer bg-[#1E1E3A] text-[#7B68EE] hover:bg-[#2A2A4A] transition-colors">
              {tag}
            </Badge>
          ))}
        </div> */}

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
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toolsState.error ? (
              <Alert variant="destructive" className="col-span-full">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {toolsState.error}
                </AlertDescription>
              </Alert>
            ) : toolsState.loading && toolsState.page === 1 ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="bg-[#12122A] border-[#2A2A4A]">
                  <div className="space-y-3">
                    <Skeleton className="h-48 w-full bg-[#1E1E3A]" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-[250px] bg-[#1E1E3A]" />
                      <Skeleton className="h-4 w-[200px] bg-[#1E1E3A]" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              toolsState.tools.map((tool) => (
                <Card key={tool.id} className="bg-[#12122A] border-[#2A2A4A] overflow-hidden hover:shadow-lg hover:shadow-[#7B68EE]/10 transition-all duration-300">
                  <Link href={`/tools/${tool.slug}`} className="block">
                    <Image
                      src={tool.image_url || "/placeholder.svg"}
                      // src={"/placeholder.svg"}
                      alt={tool.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-[#7B68EE] truncate">{tool.title}</h3>
                        <ExternalLink className="w-4 h-4 text-[#8080AA]" />
                      </div>
                      <p className="text-sm text-[#B0B0DA] mb-3 line-clamp-2">
                        {tool.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        {/* <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-[#7B68EE] text-[#7B68EE]" />
                          <span className="text-sm text-[#B0B0DA]">{tool.rating}</span>
                        </div> */}
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {tool.tags.split(',').slice(0,3).map((tag) => (
                            <Badge 
                              key={tag}
                              variant="secondary" 
                              className="text-xs bg-[#1E1E3A] text-[#7B68EE]"
                            >
                              {tag.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))
            )}
          </div>

          {/* Load More Button */}
          {toolsState.hasMore && !toolsState.loading && (
            <div className="text-center mt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline" 
                className="bg-[#1E1E3A] text-[#7B68EE] hover:bg-[#2A2A4A] border-[#3A3A5A]"
              >
                {t('loadMore')}
              </Button>
            </div>
          )}

          {/* Loading More Indicator */}
          {toolsState.loading && toolsState.page > 1 && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B68EE]"></div>
            </div>
          )}
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