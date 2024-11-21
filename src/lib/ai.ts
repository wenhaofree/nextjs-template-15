import { z } from 'zod'

// Types for request/response
export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionOptions {
  model?: string
  messages: Message[]
  stream?: boolean
  max_tokens?: number
  temperature?: number
  top_p?: number
  top_k?: number
  frequency_penalty?: number
  stop?: string | string[]
  tools?: Array<{
    type: 'function'
    function: {
      name: string
      description?: string
      parameters: Record<string, unknown>
      strict?: boolean
    }
  }>
  response_format?: {
    type: 'text' | 'json_object'
  }
}

export interface ChatCompletionResponse {
  id: string
  model: string
  created: number
  choices: Array<{
    index: number
    message: Message
    finish_reason: string
  }>
}

export interface StreamResponse extends ReadableStream<Uint8Array> {}

// Validation schema
const configSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  apiUrl: z.string().url('Invalid API URL'),
  defaultModel: z.string().optional(),
})

export type AIConfig = z.infer<typeof configSchema>

// Custom error class
export class AIError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'AIError'
  }
}

export class AI {
  private config: AIConfig

  constructor(config: AIConfig) {
    // Validate config
    const result = configSchema.safeParse(config)
    if (!result.success) {
      throw new AIError('Invalid AI configuration: ' + result.error.message)
    }
    this.config = config
  }

  async chat(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const {
      model = this.config.defaultModel || 'deepseek-ai/DeepSeek-V2.5',
      stream = false,
      ...rest
    } = options

    if (stream) {
      throw new AIError('For streaming responses, please use streamChat() method')
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          stream,
          ...rest,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new AIError(
          error.message || 'AI request failed',
          error.code,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof AIError) {
        throw error
      }
      throw new AIError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  async streamChat(options: ChatCompletionOptions): Promise<StreamResponse> {
    const {
      model = this.config.defaultModel || 'deepseek-ai/DeepSeek-V2.5',
      ...rest
    } = options

    try {
      const response = await fetch(`${this.config.apiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          stream: true,
          ...rest,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new AIError(
          error.message || 'AI stream request failed',
          error.code,
          response.status
        )
      }

      if (!response.body) {
        throw new AIError('No response body received')
      }

      return response.body
    } catch (error) {
      if (error instanceof AIError) {
        throw error
      }
      throw new AIError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  // Helper to create a new instance with updated config
  withConfig(config: Partial<AIConfig>): AI {
    return new AI({
      ...this.config,
      ...config,
    })
  }
}

// Create singleton instance
let aiInstance: AI | null = null

export function getAI(): AI {
  if (!aiInstance) {
    aiInstance = new AI({
      apiKey: process.env.SILICON_FLOW_API_KEY!,
      apiUrl: process.env.SILICON_FLOW_API_URL || 'https://api.siliconflow.cn',
      defaultModel: process.env.SILICON_FLOW_DEFAULT_MODEL,
    })
  }
  return aiInstance
}

// Add new interface for the AI analysis response
export interface AIAnalysisResponse {
  summary: string;
  tags: string[];
  target_audience: string;
  value_proposition: string;
  status: 'success' | 'error';
  message?: string;
}

// Add new function to analyze URL
export async function analyzeUrl(url: string, baseUrl?: string): Promise<AIAnalysisResponse> {
  const inputContext = `请分析以下网址的内容：${url}
    要求输出以下内容（JSON格式）：
    {
      "summary": "<150字内描述网站主要功能和核心特点>",
      "tags": ["3-5个关键标签，突出主题和核心领域"],
      "target_audience": "<简要描述目标用户群体>",
      "value_proposition": "<核心价值说明>",
      "status": "<success/error>",
      "message": "<当status为error时的错误提示>"
    }

    注意事项：
    1. summary字段严格控制在150字以内
    2. tags数组包含3-5个关键词标签
    3. 所有文本使用中文输出
    4. status字段仅可选"success"或"error"
    5. 当无法访问网址时，返回适当的错误信息
    6. 不要有其他要求以外的内容
    7. 必须返回合法的JSON格式`;

  try {
    const apiBaseUrl = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = new URL('/api/ai', apiBaseUrl).toString();

    console.log('🔗 Making AI API request to:', apiUrl);

    const options: ChatCompletionOptions = {
      messages: [
        { role: 'user', content: inputContext }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' } // 强制返回JSON格式
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      throw new Error(`AI API request failed with status ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    
    // Log raw content for debugging
    console.log('📝 Raw AI response content:', content);

    try {
      // Try to clean the content if needed
      const cleanContent = content.trim();
      const parsedContent = JSON.parse(cleanContent);
      
      console.log('✅ Parsed AI response:', parsedContent);
      
      return parsedContent as AIAnalysisResponse;
    } catch (parseError) {
      console.error('❌ JSON parsing error:', {
        error: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
        rawContent: content
      });
      
      // Return fallback response
      return {
        summary: 'AI工具描述',
        tags: ['AI工具', 'AI助手'],
        target_audience: '通用用户',
        value_proposition: '提供AI相关功能',
        status: 'error',
        message: '内容解析失败'
      };
    }

  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
} 