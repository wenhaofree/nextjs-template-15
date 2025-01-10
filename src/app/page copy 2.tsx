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

export default function MobileDashboard() {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedSize, setSelectedSize] = useState('iphone14')

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

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      {/* 导出按钮和尺寸选择 */}
      <div className="fixed top-6 right-6 z-10 flex gap-2">
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
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg whitespace-nowrap
                     flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? '导出中...' : '导出PNG'}
        </button>
      </div>

      {/* Goals Section */}
      <div id="goals-container" className="absolute bottom-0 left-0 right-0 min-h-screen flex flex-col justify-end pb-32 px-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-medium mb-6">Bear's Goal 2025</h2>
          
          <div className="flex gap-6">
            {/* 左列 */}
            <div className="flex-1 space-y-4">
              {/* Health Section */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500"/>
                  <h3 className="text-lg">Health</h3>
                </div>
                <p className="text-gray-400 text-sm leading-tight">(Fit & Happy)</p>
                <ul className="space-y-0.5">
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>30k pushups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>30k squats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>100 workouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>Logging diet daily</span>
                  </li>
                </ul>
              </div>

              {/* Personal Section */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500"/>
                  <h3 className="text-lg">Personal</h3>
                </div>
                <p className="text-gray-400 text-sm leading-tight">(Confident & Connected)</p>
                <ul className="space-y-0.5">
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>Connect 50 people</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>Learn 1 new sport</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>Karate green belt</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 右列 */}
            <div className="flex-1 space-y-4">
              {/* Wealth Section */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500"/>
                  <h3 className="text-lg">Wealth</h3>
                </div>
                <p className="text-gray-400 text-sm leading-tight">(Financial freedom)</p>
                <ul className="space-y-0.5">
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>Cap income</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>investing fund</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>15% total income up</span>
                  </li>
                </ul>
              </div>

              {/* Work Section */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500" />
                  <h3 className="text-lg">Work</h3>
                </div>
                <p className="text-gray-400 text-sm leading-tight">(Business-confidend Designer)</p>
                <ul className="space-y-0.5">
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>Ship 1 problem-solving product</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>10k email list</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>□</span>
                    <span>50 Y2B videos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

