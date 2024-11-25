import { NextResponse } from 'next/server'
import { generateToolJsonContent } from '@/lib/tools'
import { getToolsDB,DbTool,ToolsDB } from '@/lib/neon'
import { getToolContent, generateAndSaveContent, generateAndSaveToolJson,getToolJson } from '@/lib/content'


export async function POST(request: Request) {
  const { title, url } = await request.json()
  
  // Log input params
  console.log('📥 Update tool request:', JSON.stringify({ title, url }))
  
  try {
    const { summary, tags, success, error } = await generateToolJsonContent({
      submissionName: title,
      submissionUrl: url,
      userId: 'userId',
      planType: 'free'
    })

    // Log JSON generation result
    console.log('🔄 Generate JSON result:', JSON.stringify({ 
      success,
      error,
      summaryLength: summary?.length,
      tagsCount: tags?.length 
    }))

    if (!success) {
      console.error('❌ Failed to generate tool JSON:', error)
    }

    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    console.log('🔑 Generated slug:', slug)

    const tool = await ToolsDB.getToolBySlug(slug)
    console.log('🔍 Existing tool found:', !!tool)
    if (tool) {
      const content = await getToolContent(slug)
      if (!content) {
        const newTool: DbTool = {
          slug,
          title,
          url,
          id: 0,
          tags,
          language_support:'en',
          favorite_count: 0,
          view_count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'pending',
          summary: '',
          price_type: 'free',
          rating: 0
        }
        console.log('📝 Generating content for new tool:', JSON.stringify({
          slug,
          title,
          tags
        }))
        
        const content = generateAndSaveContent(newTool).catch(err => {
          console.error('❌ Failed to generate content:', err)
        })
        
      }
    }
    
    console.log('✅ Tool update completed successfully')
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Tool update failed:', error)
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    )
  }
} 