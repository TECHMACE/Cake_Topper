import React from 'react'

export function Header({ onExport, onCheck, isConnected }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2L15 8H9L12 2Z" />
            <path d="M6 8H18V10H6V8Z" />
            <path d="M8 10V20H16V10" />
          </svg>
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          The High Ground
        </h1>
        <span className="text-xs text-gray-400 ml-1">Cake Topper Studio</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCheck}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
          {isConnected ? 'Connected' : 'Gaps Found'}
        </button>

        <button
          onClick={onExport}
          className="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-semibold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-md shadow-violet-200 flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download SVG
        </button>
      </div>
    </header>
  )
}
