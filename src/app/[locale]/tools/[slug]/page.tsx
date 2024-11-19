import { getToolsDB,DbTool,ToolsDB } from '@/lib/neon'

import { notFound } from 'next/navigation'
import { ToolDetail } from './tool-detail'
import { Suspense } from 'react'
import { getToolContent } from '@/lib/content'
function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#7B68EE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#B0B0DA]">加载中...</p>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ToolPage({ params }: PageProps) {
  // 等待params解析完成
  const { slug } = await params
  
  console.log('🔍 Fetching tool with slug:', slug)
  const tool = await ToolsDB.getToolBySlug(slug)
  
  if (!tool) {
    console.log('❌ Tool not found for slug:', slug)
    notFound()
  }
  console.log('✅ Tool found:', tool.title)

  // 获取markdown内容
  const content = await getToolContent(slug)
  
  if (content) {
    tool.content_markdown = content
  }  
  return (
    <Suspense fallback={<Loading />}>
      <ToolDetail tool={tool} />
    </Suspense>
  )
} 