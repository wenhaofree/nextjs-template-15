'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import type { ChatCompletionOptions } from '@/lib/ai'

export default function TestPage() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim() || loading) return

    setLoading(true)
    try {
      const options: ChatCompletionOptions = {
        messages: [
          { role: 'user', content: input }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      if (!res.ok) {
        throw new Error('API request failed')
      }

      const data = await res.json()
      setResponse(data.choices[0].message.content)
    } catch (error) {
      console.error('AI Chat error:', error)
      setResponse('Error: Failed to get AI response')
    } finally {
      setLoading(false)
    }
  }

  const handleStreamTest = async () => {
    if (!input.trim() || loading) return

    setLoading(true)
    setResponse('')
    
    try {
      const options: ChatCompletionOptions = {
        messages: [
          { role: 'user', content: input }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...options, stream: true }),
      })

      if (!res.ok) {
        throw new Error('API request failed')
      }

      const reader = res.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        try {
          const lines = chunk
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.replace(/^data: /, ''))

          for (const line of lines) {
            if (line === '[DONE]') continue
            try {
              const json = JSON.parse(line)
              const content = json.choices[0]?.delta?.content || ''
              setResponse(prev => prev + content)
            } catch (e) {
              console.warn('Failed to parse JSON:', line)
            }
          }
        } catch (e) {
          console.error('Error processing chunk:', e)
        }
      }
    } catch (error) {
      console.error('AI Stream error:', error)
      setResponse('Error: Failed to get streaming response')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">AI Chat Test</h1>
      
      <Card className="p-4 mb-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message here..."
          className="mb-4"
          rows={4}
        />
        
        <div className="flex gap-4">
          <Button 
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Sending...' : 'Send (Regular)'}
          </Button>

          <Button 
            onClick={handleStreamTest}
            disabled={loading || !input.trim()}
            variant="outline"
          >
            {loading ? 'Streaming...' : 'Send (Streaming)'}
          </Button>
        </div>
      </Card>

      {response && (
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Response:</h2>
          <div className="whitespace-pre-wrap">{response}</div>
        </Card>
      )}
    </div>
  )
}
