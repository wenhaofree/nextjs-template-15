'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
export default function TestContent() {
  const [url, setUrl] = useState('')
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    if (!url) {
      setError('Please enter a URL')
      return
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL')
      return
    }

    try {
      // 1. 内容生成
      const response = await fetch('/api/tools/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, url })
      })

      if (!response.ok) {
        throw new Error('Failed to update tool')
      }

      
      //2. 状态修改
      const updateToolStatusRes = await fetch('/api/tools/updateToolStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, status:'active' })
      })
      if (!updateToolStatusRes.ok) {
        throw new Error('Failed to updateToolStatusRes')
      }

      setSubmittedUrl(url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update tool')
    }
  }

  const handleReset = () => {
    setUrl('')
    setSubmittedUrl(null)
    setError(null)
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-8">URL Echo Test</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex gap-4">
          <Input
            type="text" 
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
            maxLength={100}
            aria-label="Tool Title"
          />
        </div>
        <div className="flex gap-4">
          <Input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            maxLength={2048}
            aria-label="Tool URL"
          />
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Clear
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500" role="alert">{error}</p>
        )}
      </form>

      {submittedUrl && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Submitted URL:</h2>
          <p className="break-all">{submittedUrl}</p>
        </div>
      )}
    </div>
  )
}
