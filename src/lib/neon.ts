import { Pool } from 'pg'

// 创建连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

// 工具数据类型
export interface DbTool {
  id: number
  title: string
  url: string
  image_url?: string
  summary?: string
  tags: string
  language_support: string
  favorite_count: number
  content_markdown?: string
  created_at: Date
  updated_at: Date
  status: 'active' | 'inactive' | 'pending' | 'removed' | 'featured'
  view_count: number
  price_type: 'free' | 'one-time' | 'unlimited' | 'sponsor'
  submit_user_id?: string
  last_check_time?: Date
  rating: number
  slug: string
}

interface GetToolsOptions {
  page?: number
  limit?: number
  sortBy?: 'created_at' | 'rating' | 'view_count'
  sortOrder?: 'ASC' | 'DESC'
  status?: DbTool['status']
}

interface GetToolsResult {
  tools: DbTool[]
  total: number
  hasMore: boolean
}

export class ToolsDB {
  private static instance: ToolsDB
  private initialized = false

  private constructor() {}

  static async getInstance(): Promise<ToolsDB> {
    if (!ToolsDB.instance) {
      ToolsDB.instance = new ToolsDB()
      await ToolsDB.instance.initialize()
    }
    return ToolsDB.instance
  }

  private async initialize() {
    if (!this.initialized) {
      await this.initDb()
      this.initialized = true
    }
  }

  private async initDb() {
    const client = await pool.connect()
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS tools (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          url VARCHAR(512) NOT NULL,
          image_url VARCHAR(512),
          summary VARCHAR(1000),
          tags VARCHAR(255) DEFAULT '',
          language_support VARCHAR(100) DEFAULT '',
          favorite_count INTEGER DEFAULT 0,
          content_markdown TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(20) DEFAULT 'active',
          view_count INTEGER DEFAULT 0,
          price_type VARCHAR(20) DEFAULT 'free',
          submit_user_id BIGINT,
          last_check_time TIMESTAMPTZ,
          rating NUMERIC(3,2) DEFAULT 0.0,
          slug VARCHAR(255) NOT NULL UNIQUE,

          CONSTRAINT url_unique UNIQUE (url),
          CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5.0),
          CONSTRAINT status_values CHECK (status IN ('active', 'inactive', 'pending', 'removed', 'featured')),
          CONSTRAINT price_type_values CHECK (price_type IN ('free', 'paid', 'freemium'))
        )
      `)
      console.log('✅ Database initialized')
    } catch (error) {
      console.error('❌ Database initialization error:', error)
      throw error
    } finally {
      client.release()
    }
  }

  async addTool(tool: Omit<DbTool, 'id' | 'created_at' | 'updated_at'>): Promise<DbTool> {
    const client = await pool.connect()
    try {
      const { rows: [newTool] } = await client.query<DbTool>(`
        INSERT INTO tools (
          title, url, image_url, summary, tags, language_support,
          content_markdown, status, price_type, submit_user_id,
          rating, slug
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        tool.title,
        tool.url,
        tool.image_url,
        tool.summary,
        tool.tags,
        tool.language_support,
        tool.content_markdown,
        tool.status || 'pending',
        tool.price_type || 'free',
        tool.submit_user_id,
        tool.rating || 0,
        tool.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      ])
      return newTool
    } catch (error) {
      console.error('❌ Error adding tool:', error)
      throw error
    } finally {
      client.release()
    }
  }

  static async getToolBySlug(slug: string): Promise<DbTool | null> {
    const client = await pool.connect()
    try {
      const { rows: [dbTool] } = await client.query<DbTool>(`
        SELECT * FROM tools 
        WHERE slug = $1
        LIMIT 1
      `, [slug])

      if (!dbTool) return null

      return dbTool
    } catch (error) {
      console.error('❌ Error fetching tool by slug:', error)
      return null
    } finally {
      client.release()
    }
  }

  static async getToolByUrl(url: string): Promise<DbTool | null> {
    const client = await pool.connect()
    try {
      const { rows: [dbTool] } = await client.query<DbTool>(`
        SELECT * FROM tools 
        WHERE url = $1
        LIMIT 1
      `, [url])

      if (!dbTool) return null

      return dbTool
    } catch (error) {
      console.error('❌ Error fetching tool by URL:', error)
      return null
    } finally {
      client.release()
    }
  }

  async getTools(options: GetToolsOptions = {}): Promise<GetToolsResult> {
    const client = await pool.connect()
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        status = 'active'
      } = options

      const offset = (page - 1) * limit

      // 获取总数
      const { rows: [countResult] } = await client.query(`
        SELECT COUNT(*) as count 
        FROM tools
        WHERE status = $1
      `, [status])

      // 获取工具列表
      const { rows: tools } = await client.query<DbTool>(`
        SELECT * FROM tools
        WHERE status = $1
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT $2 OFFSET $3
      `, [status, limit, offset])

      const total = parseInt(countResult.count)

      return {
        tools,
        total,
        hasMore: total > page * limit
      }

    } catch (error) {
      console.error('❌ Error fetching tools:', error)
      return {
        tools: [],
        total: 0,
        hasMore: false
      }
    } finally {
      client.release()
    }
  }

  async updateToolStatus({ 
    url, 
    status 
  }: { 
    url: string
    status: DbTool['status']
  }): Promise<DbTool | null> {
    const client = await pool.connect()
    try {
      const { rows: [updatedTool] } = await client.query<DbTool>(`
        UPDATE tools 
        SET status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE url = $2
        RETURNING *
      `, [status, url])

      return updatedTool || null
    } catch (error) {
      console.error('❌ Error updating tool status:', error)
      return null
    } finally {
      client.release()
    }
  }

  // ... 其他方法类似修改
}

// 导出获取实例的辅助函数
export const getToolsDB = () => ToolsDB.getInstance()

// Add this function to get tool by ID
export async function getTool(id: number): Promise<DbTool | null> {
  const client = await pool.connect()
  try {
    const { rows: [tool] } = await client.query<DbTool>(`
      SELECT * FROM tools 
      WHERE id = $1
      LIMIT 1
    `, [id])
    
    return tool || null
  } catch (error) {
    console.error('Error fetching tool:', error)
    return null
  } finally {
    client.release()
  }
}