import { Tool } from '@/types/tools'

// 模拟工具数据
const mockTools: Tool[] = [
  {
    id: 1,
    name: "AI Assistant",
    description: "An intelligent AI assistant that helps with various tasks",
    imageUrl: "/images/ai-assistant.png",
    rating: 4.8,
    categories: ["AI", "Productivity"]
  },
  {
    id: 2,
    name: "Code Generator",
    description: "Generate code snippets and boilerplate automatically",
    imageUrl: "/images/code-gen.png",
    rating: 4.5,
    categories: ["Development", "AI"]
  }
]

export async function getTools(): Promise<Tool[]> {
  try {
    // TODO: Replace with actual API call when ready
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockTools
  } catch (error) {
    console.error('Error fetching tools:', error)
    return []
  }
}
