import { getToolsDB,DbTool,ToolsDB } from '@/lib/neon'

import { notFound } from 'next/navigation'
import { ToolDetail } from './tool-detail'
import { Suspense } from 'react'
import { getToolContent, generateAndSaveContent, generateAndSaveToolJson,getToolJson } from '@/lib/content'
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
  params: Promise<{ 
    slug: string
    locale: string 
  }>
}

export default async function ToolPage({ params }: PageProps) {
  const { slug, locale } = await params
  
  console.log('🔍 Fetching tool with slug:', slug)
  const tool = await ToolsDB.getToolBySlug(slug)
  
  if (!tool) {
    console.log('❌ Tool not found for slug:', slug)
    notFound()
  }
  console.log('✅ Tool found:', tool.title)

  // Try to get existing content
  let content = await getToolContent(slug)
  
  // If no content exists, generate it
  if (!content) {
    console.log('📝 Generating content for:', slug)
    content = await generateAndSaveContent(tool)
  }

  if (content) {
    tool.content_markdown = content
  }  

  // Read data from JSON file
  const toolsJson = await getToolJson(slug, locale)
  console.log('toolsJson:',toolsJson);
  if (!toolsJson) {
    console.log('📝 Generating JSON content for:', slug)
    const generatedJson = await generateAndSaveToolJson(tool, locale)
    if (generatedJson) {
      tool.summary = generatedJson.summary
      tool.tags = generatedJson.tags
    }
  } else {
    tool.summary = toolsJson.summary
    tool.tags = toolsJson.tags
  }

  return (
    <Suspense fallback={<Loading />}>
      <ToolDetail tool={tool} />
    </Suspense>
  )
} 