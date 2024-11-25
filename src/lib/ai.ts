import { z } from 'zod'
import { DbTool } from './neon'
import { getLocale } from 'next-intl/server';
import { OpenAI } from 'openai'

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
export async function analyzeUrl(locale:string,url: string, baseUrl?: string): Promise<AIAnalysisResponse> {
  const inputContext = locale === 'en' 
  ? `Please analyze the following URL: ${url}

    Generate a response in JSON format with the following content:
    {
      "summary": "<Describe main features and core characteristics within 150 words>",
      "tags": ["3-5 key tags highlighting themes and core areas"],
      "target_audience": "<Brief description of target users>", 
      "value_proposition": "<Core value statement>",
      "status": "<success/error>",
      "message": "<Error message when status is error>"
    }

    Requirements:
    1. Summary field must be within 150 words
    2. Tags array should contain 3-5 keyword tags
    3. All text must be in English
    4. Status field can only be "success" or "error" 
    5. Return appropriate error message if URL is inaccessible
    6. Do not include content beyond requirements
    7. Must return valid JSON format` // English prompt
  : `请分析以下网址的内容：${url}
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
    7. 必须返回合法的JSON格式`; // Chinese prompt

  
  try {
    const apiBaseUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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

export async function generateToolContent(tool: DbTool): Promise<string> {
  // const inputContext = locale === 'en'?'':'' 
  const inputContext = `请分析并生成以下URL的详细内容报告：${tool.url}

请生成一份详细的Markdown格式分析报告，包含以下部分：
# [网站名称]

## 网站概述
- 网站定位与目标
- 主要功能概述

## 核心功能
1. [功能1]
   - 功能说明
   - 特点优势
   
2. [功能2]
   - 功能说明
   - 特点优势
   
[继续列举主要功能，3-5个]

## 技术特点
- 技术架构
- 创新特性
- 性能表现

## 应用场景
1. 场景一：[场景名称]
   - 问题描述
   - 解决方案
   - 应用效果

2. 场景二：[场景名称]
   - 问题描述
   - 解决方案
   - 应用效果

[至少提供3个具体场景]

## 使用指南
1. 快速入门
   - 注册流程
   - 基础设置
   - 开始使用

2. 核心功能使用
   - 功能A使用说明
   - 功能B使用说明
   
3. 使用建议
   - 最佳实践
   - 注意事项

## 目标用户
- 主要用户群体
- 使用场景分析
- 价值定位

## 常见问题
Q1: [常见问题1]
A1: [详细解答]

Q2: [常见问题2]
A2: [详细解答]

[提供5个最具代表性的问题和解答]

注意事项：
1. 如果URL无法访问，返回错误信息
2. 内容应基于URL实际信息进行分析
3. 保持专业性和可读性
4. 突出重点特征和核心价值
5. 使用清晰的层级结构
6. 适当使用Markdown格式元素（列表、强调、引用等） `

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const apiUrl = new URL('/api/ai', apiBaseUrl).toString();

    console.log('🤖 Generating content for:', tool.title);

    const options: ChatCompletionOptions = {
      messages: [
        { role: 'user', content: inputContext }
      ],
      temperature: 0.7,
      max_tokens: 2000, // 增加token限制以获取更详细的内容
      response_format: { type: 'text' } // 使用text格式因为我们需要markdown
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
    
    // 验证返回的内容是否符合markdown格式
    if (!content.includes('# ' + tool.title)) {
      console.warn('⚠️ Generated content may not be properly formatted');
    }

    console.log('✅ Content generated successfully for:', tool.title);
    
    return content.trim();

  } catch (error) {
    console.error('❌ Error generating content:', error);
    
    // 返回一个基础的错误提示内容
    return `# ${tool.title}

      ## 详细介绍
      抱歉，暂时无法获取该工具的详细信息。

      ## 基本信息
      ${tool.summary}

      ## 访问地址
      ${tool.url}

      请稍后再试或联系管理员。`;
  }
} 