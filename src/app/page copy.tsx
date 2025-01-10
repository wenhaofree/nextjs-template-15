'use client'

import { Camera, Download, FlashlightIcon as FlashLight } from 'lucide-react'
import { Card } from "@/components/ui/card"

export default function MobileDashboard() {
  const currentDate = new Date()
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <span>One NZ</span>
          <span>🔔</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="block w-1 h-3 bg-white"></span>
            <span className="block w-1 h-3 bg-white"></span>
            <span className="block w-1 h-3 bg-white"></span>
          </span>
          <div className="bg-zinc-800 rounded-full px-3 py-1 text-sm flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>55</span>
          </div>
        </div>
      </div>

      {/* Time and Date */}
      <div className="mb-12">
        <h2 className="text-lg mb-1">{formattedDate}</h2>
        <h1 className="text-8xl font-light tracking-tight">{formattedTime}</h1>
      </div>

      {/* Todo Items */}
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-white/50"></div>
          <span className="text-lg">The Will to plan</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-white/50"></div>
          <span className="text-lg">Discuss invest...</span>
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-medium">Bear's Goal 2025</h2>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {/* Health Section */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-green-500"></div>
              <h3 className="text-lg">Health</h3>
            </div>
            <p className="text-gray-400 text-sm mb-3">(Fit & Happy)</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>30k pushups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>30k squats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>100 workouts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>Logging diet daily</span>
              </li>
            </ul>
          </div>

          {/* Wealth Section */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-blue-500"></div>
              <h3 className="text-lg">Wealth</h3>
            </div>
            <p className="text-gray-400 text-sm mb-3">(Financial freedom)</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>Cap income</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>investing fund</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>15% total income up</span>
              </li>
            </ul>
          </div>

          {/* Personal Section */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-yellow-500"></div>
              <h3 className="text-lg">Personal</h3>
            </div>
            <p className="text-gray-400 text-sm mb-3">(Confident & Connected)</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>Connect 50 people</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>Learn 1 new sport</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>Karate green belt</span>
              </li>
            </ul>
          </div>

          {/* Work Section */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-red-500"></div>
              <h3 className="text-lg">Work</h3>
            </div>
            <p className="text-gray-400 text-sm mb-3">(Business-confidend Designer)</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>Ship 1 problem-solving product</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>10k email list</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">□</span>
                <span>50 Y2B videos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Icons */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-around px-4">
        <div className="w-14 h-14 bg-zinc-800/80 rounded-full flex items-center justify-center">
          <FlashLight className="w-7 h-7" />
        </div>
        <div className="w-14 h-14 bg-zinc-800/80 rounded-full flex items-center justify-center">
          <Camera className="w-7 h-7" />
        </div>
      </div>
    </div>
  )
}

