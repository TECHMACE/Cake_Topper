import React, { useRef, useCallback } from 'react'
import { useTopperStore } from './useTopperStore'
import { TextPanel } from './components/TextPanel'
import { AssetLibrary } from './components/AssetLibrary'
import { SupportPanel } from './components/SupportPanel'
import { Canvas } from './components/Canvas'
import { Header } from './components/Header'

export default function App() {
  const store = useTopperStore()
  const canvasRef = useRef(null)

  const handleExport = useCallback(() => {
    if (canvasRef.current?.exportSVG) {
      canvasRef.current.exportSVG()
    }
  }, [])

  const handleCheckConnections = useCallback(() => {
    if (canvasRef.current?.checkConnections) {
      canvasRef.current.checkConnections()
    }
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#f8f9fc]">
      <Header onExport={handleExport} onCheck={handleCheckConnections} isConnected={store.state.isConnected} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <TextPanel store={store} />
          <SupportPanel store={store} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 relative">
          <Canvas ref={canvasRef} store={store} />
        </div>

        {/* Right Panel - Asset Library */}
        <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
          <AssetLibrary store={store} />
        </div>
      </div>
    </div>
  )
}
