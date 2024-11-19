import fs from 'fs/promises'
import path from 'path'

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
    const filePath = path.join(TOOLS_CONTENT_DIR, `${slug}.md`)
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