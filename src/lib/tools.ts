import { DbTool } from './neon'
import { getToolJson, generateAndSaveToolJson } from './content'
import { getLocale } from 'next-intl/server'

interface GenerateToolJsonResult {
  summary: string
  tags: string
  success: boolean
  error?: string
}

interface GenerateToolJsonParams {
  submissionName: string
  submissionUrl: string
  userId: string|undefined
  planType?: 'free' | 'one-time' | 'unlimited' | 'sponsor'
}

export async function generateToolJsonContent({
  submissionName,
  submissionUrl,
  userId,
  planType = 'free'
}: GenerateToolJsonParams): Promise<GenerateToolJsonResult> {
  try {
    console.log('🔄 Starting tool JSON generation:', {
      name: submissionName,
      url: submissionUrl,
      timestamp: new Date().toISOString()
    })

    const locale = await getLocale()
    const slug = submissionName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Check if JSON already exists
    const toolsJson = await getToolJson(slug, locale)
    if (toolsJson) {
      console.log('✅ Tool JSON already exists for:', slug)
      return {
        summary: toolsJson.summary,
        tags: Array.isArray(toolsJson.tags) ? toolsJson.tags.join(',') : toolsJson.tags,
        success: true
      }
    }

    // Create new tool object
    const newTool: DbTool = {
      id: 0,
      slug,
      url: submissionUrl,
      title: submissionName,
      summary: '',
      tags: '',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
      image_url: '',
      price_type: planType,
      submit_user_id: userId,
      language_support: locale,
      favorite_count: 0,
      view_count: 0,
      rating: 0
    }

    console.log('📝 Generating new JSON content for:', slug)
    const generatedJson = await generateAndSaveToolJson(newTool, locale)

    if (!generatedJson) {
      throw new Error('Failed to generate JSON content')
    }

    console.log('✅ Successfully generated JSON for:', {
      slug,
      timestamp: new Date().toISOString()
    })

    return {
      summary: generatedJson.summary,
      tags: Array.isArray(generatedJson.tags) ? generatedJson.tags.join(',') : generatedJson.tags,
      success: true
    }

  } catch (error) {
    console.error('❌ Error generating tool JSON:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: submissionName,
      timestamp: new Date().toISOString()
    })

    return {
      summary: '',
      tags: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate tool JSON'
    }
  }
} 