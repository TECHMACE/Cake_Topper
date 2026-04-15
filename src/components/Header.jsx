import React from 'react'

export function Header({ onExport, onCheck, isConnected }) {
  return (
    <header className="h-13 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-none">The High Ground</h1>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">Cake Topper Studio</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {/* Connection status */}
        <button
          onClick={onCheck}
          className={`h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200'
              : 'bg-red-50 text-red-700 hover:bg-red-100 ring-1 ring-red-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
          {isConnected ? 'One Piece' : 'Gaps Found'}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Export */}
        <button
          onClick={onExport}
          className="h-8 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-xs font-semibold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-md shadow-violet-200/60 flex items-center gap-1.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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
