import { getAI } from '@/lib/ai'
import { ChatCompletionOptions } from '@/lib/ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { stream = false, ...options } = body as ChatCompletionOptions

    const ai = getAI()

    if (stream) {
      const streamResponse = await ai.streamChat(options)
      return new NextResponse(streamResponse)
    }

    const response = await ai.chat(options)
    return NextResponse.json(response)
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
} 