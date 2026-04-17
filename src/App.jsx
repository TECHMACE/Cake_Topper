import React, { useRef, useCallback, useState } from 'react'
import { useTopperStore } from './useTopperStore'
import { TextPanel } from './components/TextPanel'
import { AssetLibrary } from './components/AssetLibrary'
import { SupportPanel } from './components/SupportPanel'
import { Canvas } from './components/Canvas'
import { Header } from './components/Header'

const TABS = [
  {
    id: 'text',
    label: 'Text',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: 'structure',
    label: 'Structure',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="18" x2="21" y2="18" />
        <line x1="6" y1="12" x2="6" y2="18" />
        <line x1="12" y1="8" x2="12" y2="18" />
        <line x1="18" y1="12" x2="18" y2="18" />
      </svg>
    ),
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
]

export default function App() {
  const store = useTopperStore()
  const canvasRef = useRef(null)
  const [activeTab, setActiveTab] = useState('text')

  const handleExport = useCallback(() => {
    if (canvasRef.current?.exportSVG) canvasRef.current.exportSVG()
  }, [])

  const handleCheckConnections = useCallback(() => {
    if (canvasRef.current?.checkConnections) canvasRef.current.checkConnections()
  }, [])

  const handleAutoFit = useCallback(() => {
    if (canvasRef.current?.autoFit) canvasRef.current.autoFit()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#f0f2f7] overflow-hidden">
      <Header onExport={handleExport} onCheck={handleCheckConnections} onAutoFit={handleAutoFit} isConnected={store.state.isConnected} />

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Panel — tab navigation + content */}
        <div className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 shadow-sm">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-violet-700 border-b-2 border-violet-500 bg-white'
                    : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-violet-600' : 'text-gray-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'text' && <TextPanel store={store} />}
            {activeTab === 'structure' && <SupportPanel store={store} />}
            {activeTab === 'assets' && <AssetLibrary store={store} />}
          </div>
        </div>

        {/* Canvas area — relative so Canvas can use absolute inset-0 */}
        <div className="flex-1 relative overflow-hidden">
          <Canvas ref={canvasRef} store={store} />
        </div>
      </div>
    </div>
  )
}
