import fs from 'fs/promises'
import path from 'path'
import { generateToolContent } from './ai'
import { DbTool } from './neon'
import { getLocale } from 'next-intl/server';

export const TOOLS_CONTENT_DIR = path.join(process.cwd(), 'src/app/content/tools')

async function validateContentDir() {
  try {
    await fs.access(TOOLS_CONTENT_DIR)
  } catch {
    throw new Error(`Content directory not found: ${TOOLS_CONTENT_DIR}`)
  }
}

export async function getToolContent(slug: string): Promise<string | null> {
  try {
    await validateContentDir()
    const locale = await getLocale();
    const filePath = path.join(TOOLS_CONTENT_DIR,locale,`${slug}.md`)
    console.log('Reading content from:', filePath)
    const content = await fs.readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error('Error reading tool content:', error)
    return null
  }
}

export async function getAllToolSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(TOOLS_CONTENT_DIR)
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''))
  } catch (error) {
    console.error('Error reading tool slugs:', error)
    return []
  }
}

export async function generateAndSaveContent(tool: DbTool): Promise<string> {
  try {
    // Generate content using AI
    const content = await generateToolContent(tool)
    
    // Ensure content directory exists
    const locale = await getLocale();
    const contentDir = path.join(process.cwd(),locale,'src/app/content/tools')
    await fs.mkdir(contentDir, { recursive: true })
    
    // Save to markdown file
    const filePath = path.join(contentDir, `${tool.slug}.md`)
    await fs.writeFile(filePath, content, 'utf-8')
    
    console.log('✅ Generated and saved content for:', tool.slug)
    return content
    
  } catch (error) {
    console.error('Error generating/saving content:', error)
    throw error
  }
} 