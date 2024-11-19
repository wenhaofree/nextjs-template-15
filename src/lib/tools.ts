import { getToolsDB } from './neon'
import { getToolContent } from './content';

export interface Tool {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  summary: string | null;
  tags: string;
  language_support: string;
  content_markdown: string | null;
  updated_at: Date;
  price_type: typeof PRICE_TYPES[keyof typeof PRICE_TYPES];
  rating: number;
  slug: string;
}

// Add price type enum
const PRICE_TYPES = {
  FREE: 'free',
  PAID: 'paid', 
  FREEMIUM: 'freemium'
} as const;

// Update DbTool interface to match schema
interface DbTool {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  summary: string | null;
  tags: string;
  language_support: string;
  content_markdown: string | null;
  updated_at: Date;
  price_type: typeof PRICE_TYPES[keyof typeof PRICE_TYPES];
  rating: number;
  slug: string;
  // Add other fields as needed
}

// 将数据库工具转换为前端工具格式
function convertDbToolToTool(dbTool: DbTool): Tool {
  return {
    name: dbTool.title,
    description: dbTool.summary || '',
    link: dbTool.url,
    rating: Number(dbTool.rating.toFixed(2)), // Handle numeric precision
    categories: dbTool.tags ? dbTool.tags.split(',').map(tag => tag.trim()) : [],
    slug: dbTool.slug,
    imageUrl: dbTool.image_url || undefined,
    features: dbTool.content_markdown 
      ? extractFeatures(dbTool.content_markdown)
      : undefined,
    pricing: getPricingInfo(dbTool),
    updateDate: dbTool.updated_at.toISOString().split('T')[0],
    content_markdown: dbTool.content_markdown || undefined,
    languageSupport: dbTool.language_support ? 
      dbTool.language_support.split(',').map(lang => lang.trim()) :
      []
  }
}

// 从markdown内容中提取特性列表
function extractFeatures(markdown: string): string[] {
  const features: string[] = []
  const lines = markdown.split('\n')
  let inFeaturesList = false

  for (const line of lines) {
    if (line.includes('## Features') || line.includes('## 特性')) {
      inFeaturesList = true
      continue
    } else if (inFeaturesList && line.startsWith('##')) {
      break
    }

    if (inFeaturesList && line.trim().startsWith('- ')) {
      features.push(line.trim().slice(2))
    }
  }

  return features
}

// 根据数据库中的价格类型生成价格信息
function getPricingInfo(dbTool: DbTool): Tool['pricing'] {
  const pricingMap: Record<typeof PRICE_TYPES[keyof typeof PRICE_TYPES], Tool['pricing']> = {
    [PRICE_TYPES.FREE]: {
      startingPrice: 'Free',
      plans: ['Free']
    },
    [PRICE_TYPES.PAID]: {
      startingPrice: 'Paid',
      plans: ['Pro']  
    },
    [PRICE_TYPES.FREEMIUM]: {
      startingPrice: 'Free to start',
      plans: ['Free', 'Pro', 'Enterprise']
    }
  };

  return pricingMap[dbTool.price_type];
}

export const ToolsDB = {
  async getAll(): Promise<Tool[]> {
    const db = await getToolsDB()
    const dbTools = await db.getTools()
    return dbTools.map(convertDbToolToTool)
  },

  async getToolBySlug(slug: string): Promise<Tool | undefined> {
    const db = await getToolsDB()
    const dbTool = await db.getToolBySlug(slug)
    
    if (!dbTool) return undefined

    // 获取markdown内容
    const content = await getToolContent(slug)
    
    const tool = convertDbToolToTool(dbTool)
    if (content) {
      tool.content_markdown = content
    }
    
    return tool
  }
} 