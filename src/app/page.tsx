'use client'

import html2canvas from 'html2canvas'
import { useState } from 'react'

type DeviceKey = 'iphone14' | 'iphoneXR' | 'ipadPro' | 'galaxyS8Plus' | 'iphoneSE'

const deviceSizes: Record<DeviceKey, { width: number; height: number; label: string }> = {
  iphone14: { width: 430, height: 932, label: 'iPhone 14 Pro Max' },
  iphoneXR: { width: 414, height: 896, label: 'iPhone XR' },
  ipadPro: { width: 1024, height: 1366, label: 'iPad Pro' },
  galaxyS8Plus: { width: 360, height: 740, label: 'Samsung Galaxy S8+' },
  iphoneSE: { width: 375, height: 667, label: 'iPhone SE' },
}

// 定义目标数据结构
type Goal = {
  text: string;
}

type Section = {
  title: string;
  subtitle: string;
  goals: Goal[];
}

type GoalsData = {
  health: Section;
  personal: Section;
  wealth: Section;
  work: Section;
}

// 初始数据
const initialGoalsData: GoalsData = {
  health: {
    title: '健康',
    subtitle: '健康与快乐',
    goals: [{ text: '' }, { text: '' }, { text: '' }]
  },
  personal: {
    title: '个人',
    subtitle: '自信与人际关系',
    goals: [{ text: '' }, { text: '' }, { text: '' }]
  },
  wealth: {
    title: '财富',
    subtitle: '财务自由',
    goals: [{ text: '' }, { text: '' }, { text: '' }]
  },
  work: {
    title: '工作',
    subtitle: '商业自信的设计师',
    goals: [{ text: '' }, { text: '' }, { text: '' }]
  }
}

export default function MobileDashboard() {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedSize, setSelectedSize] = useState<DeviceKey>('iphone14')
  const [isEditing, setIsEditing] = useState(true)
  const [goalsData, setGoalsData] = useState<GoalsData>(initialGoalsData)
  const [title, setTitle] = useState('小熊的2025目标')

  const exportAsPNG = async () => {
    try {
      setIsExporting(true)
      const element = document.getElementById('goals-container')
      if (!element) return
      
      const { width, height } = deviceSizes[selectedSize]
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        width: width,
        height: height,
        scale: 3,
        windowWidth: width,
        windowHeight: height,
      })
      
      // 创建一个新的画布来调整尺寸
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = width
      finalCanvas.height = height
      const ctx = finalCanvas.getContext('2d')
      
      if (ctx) {
        // 填充黑色背景
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, width, height)
        
        // 将内容绘制到新画布上，保持居中和底部对齐
        const contentHeight = Math.min(canvas.height, height)
        ctx.drawImage(
          canvas,
          0, // 源x
          0, // 源y
          canvas.width, // 源宽度
          canvas.height, // 源高度
          0, // 目标x
          height - contentHeight, // 目标y（底部对齐）
          width, // 目标宽度
          contentHeight // 目标高度
        )
      }
      
      // 创建下载链接
      const link = document.createElement('a')
      link.download = `bears-goals-${new Date().toISOString().split('T')[0]}.png`
      link.href = finalCanvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('导出失败:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleGoalChange = (
    section: keyof GoalsData,
    goalIndex: number,
    value: string
  ) => {
    setGoalsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        goals: prev[section].goals.map((goal, idx) =>
          idx === goalIndex ? { ...goal, text: value } : goal
        )
      }
    }))
  }

  const handleSubtitleChange = (section: keyof GoalsData, value: string) => {
    setGoalsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        subtitle: value
      }
    }))
  }

  const getPlaceholder = (section: keyof GoalsData, index: number) => {
    const placeholders = {
      health: ['每周运动3次', '保持8小时睡眠', '学会冥想'],
      personal: ['提升一项技能', '培养一个爱好', '多陪伴家人'],
      wealth: ['制定理财计划', '增加被动收入', '控制消费预算'],
      work: ['完成重点项目', '提升专业技能', '扩展人脉圈']
    }
    return placeholders[section][index]
  }

  const renderSection = (sectionKey: keyof GoalsData, bgColor: string) => {
    const section = goalsData[sectionKey]
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${bgColor}`}/>
          <h3 className="text-lg">{section.title}</h3>
        </div>
        {isEditing ? (
          <input
            type="text"
            value={section.subtitle}
            onChange={(e) => handleSubtitleChange(sectionKey, e.target.value)}
            className="text-gray-400 text-sm leading-tight bg-transparent w-full"
            placeholder={`输入${section.title}副标题`}
          />
        ) : (
          <p className="text-gray-400 text-sm leading-tight">({section.subtitle})</p>
        )}
        {isEditing ? (
          <div className="space-y-2">
            {section.goals.map((goal, idx) => (
              <input
                key={`${sectionKey}-target-${idx + 1}`}
                type="text"
                value={goal.text}
                onChange={(e) => handleGoalChange(sectionKey, idx, e.target.value)}
                className="w-full bg-zinc-800 text-white px-3 py-1 rounded"
                placeholder={getPlaceholder(sectionKey, idx)}
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {section.goals.map((goal, idx) => (
              <li key={`${sectionKey}-target-${idx + 1}`} className="flex items-center gap-2">
                {goal.text && <span>□</span>}
                <span>{goal.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      {/* 控制按钮 */}
      <div className="fixed top-6 right-6 z-10 flex gap-2">
        {isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            生成预览
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              返回编辑
            </button>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as DeviceKey)}
              className="bg-zinc-800 text-white px-4 py-2 rounded-lg"
              disabled={isExporting}
            >
              {Object.entries(deviceSizes).map(([key, {label, width, height}]) => (
                <option key={key} value={key}>
                  {`尺寸: ${label} (${width} × ${height})`}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={exportAsPNG}
              disabled={isExporting}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isExporting ? '导出中...' : '导出PNG'}
            </button>
          </>
        )}
      </div>

      {/* 主要内容区域 */}
      <div id="goals-container" className="absolute bottom-0 left-0 right-0 min-h-screen flex flex-col justify-end pb-32 px-6">
        <div className="space-y-4">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-medium mb-6 bg-transparent border-b border-zinc-700 w-full"
              placeholder="输入标题"
            />
          ) : (
            <h2 className="text-2xl font-medium mb-6">{title}</h2>
          )}
          
          <div className="flex gap-6">
            {/* 左列 */}
            <div className="flex-1 space-y-4">
              {renderSection('health', 'bg-green-500')}
              {renderSection('personal', 'bg-yellow-500')}
            </div>
            
            {/* 右列 */}
            <div className="flex-1 space-y-4">
              {renderSection('wealth', 'bg-blue-500')}
              {renderSection('work', 'bg-red-500')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

