'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Twitter, Facebook, Linkedin, Mail, Link as LinkIcon } from 'lucide-react'
import { FallbackImage } from '@/components/ui/fallback-image'
import { DbTool } from '@/lib/neon'
import { cn } from '@/lib/utils'

interface ToolDetailProps {
  tool: DbTool
}

export function ToolDetail({ tool }: ToolDetailProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const title = `Check out ${tool.title} - AI Tool`
    console.log('tool-tool:',tool);
    
    const shareLinks = [
      { name: 'X', icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, target: '_blank' },
      { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, target: '_blank' },
      { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`, target: '_blank' },
      { name: 'Email', icon: Mail, url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`, target: '_self' },
      { name: 'Copy Link', icon: LinkIcon, url: shareUrl, target: '_self' },
    ]
  
    const handleShareClick = (link: typeof shareLinks[0]) => {
      if (link.name === 'Copy Link') {
        navigator.clipboard.writeText(link.url)
        alert('链接已复制到剪贴板！')
      } else {
        window.open(link.url, link.target, link.target === '_blank' ? 'noopener noreferrer' : '')
      }
    }
  
    const renderMarkdownContent = (content: string) => {
      const sections = content.split('\n## ').filter(Boolean)
      const [, ...rest] = sections

      // Helper function to parse inline markdown
      const parseInlineMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g)
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
          }
          return part
        })
      }

      return (
        <section className="bg-[#12122A] rounded-lg p-6 border border-[#2A2A4A] transition-all duration-200 hover:border-[#7B68EE]/50">
          <div className="prose prose-invert max-w-none divide-y divide-[#2A2A4A]/50">
            {rest.map((section, index) => {
              const [sectionTitle, ...content] = section.split('\n')
              return (
                <div key={index} className="py-6 first:pt-0 last:pb-0">
                  <h2 className="text-xl font-semibold mb-4 text-[#7B68EE]">{sectionTitle}</h2>
                  {content.map((line, i) => {
                    if (line.trim().startsWith('-')) {
                      return (
                        <li key={i} className="text-[#B0B0DA] ml-4 py-2">
                          {parseInlineMarkdown(line.trim().slice(2))}
                        </li>
                      )
                    }
                    if (line.trim().match(/^\d+\./)) {
                      return (
                        <li key={i} className="text-[#B0B0DA] ml-4 py-2">
                          {parseInlineMarkdown(line.trim().replace(/^\d+\./, ''))}
                        </li>
                      )
                    }
                    return (
                      <p key={i} className="text-[#B0B0DA] py-2">
                        {parseInlineMarkdown(line)}
                      </p>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </section>
      )
    }
  
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-4 text-[#7B68EE]">{tool.title}</h1>
              <p className="text-[#B0B0DA] mb-4">{tool.summary}</p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-[#1E1E3A] text-[#7B68EE]">评分: {tool.rating}/5</Badge>
                {tool.updated_at && (
                  <Badge className="bg-[#1E1E3A] text-[#7B68EE]">
                    更新于: {new Date(tool.updated_at).toLocaleDateString()}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {tool.tags.split(',').map((category) => (
                  <Badge 
                    key={category}
                    className="bg-[#1E1E3A] text-[#7B68EE]"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <Button 
                className="bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]"
                onClick={() => window.open(tool.url, '_blank', 'noopener noreferrer')}
              >
                免费使用
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden border border-[#2A2A4A]">
              {/* Social Media Sharing Buttons */}
              <div className="bg-[#1E1E3A] p-4 flex justify-end space-x-2">
                {shareLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-[#B0B0DA] hover:text-[#7B68EE] hover:bg-[#2A2A4A]"
                    onClick={() => handleShareClick(link)}
                  >
                    <link.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
              <FallbackImage
                src={tool.image_url|| "/placeholder.svg"}
                // src={"/placeholder.svg"}
                alt={`${tool.title} Preview`}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
  
          {/* Content Sections */}
          <div className="space-y-12 max-w-4xl">
            {/* Markdown Content */}
            {tool.content_markdown && renderMarkdownContent(tool.content_markdown)}
          </div>
        </main>
      </div>
    )
  } 