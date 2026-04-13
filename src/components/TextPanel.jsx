import React from 'react'
import { FONT_CATEGORIES } from '../fonts'

function Slider({ label, value, min, max, step, onChange, unit }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-700 font-medium tabular-nums">{value}{unit || ''}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

export function TextPanel({ store }) {
  const { state, update, setFont } = store

  return (
    <div className="p-4 space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-violet-100 rounded flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-800">Typography</h2>
      </div>

      {/* Text Input */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Your Message</label>
        <textarea
          value={state.text}
          onChange={(e) => update({ text: e.target.value })}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 resize-none transition-all"
          placeholder="Happy Birthday"
        />
      </div>

      {/* Font Selection */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Font</label>
        <div className="space-y-3">
          {Object.entries(FONT_CATEGORIES).map(([key, category]) => (
            <div key={key}>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{category.label}</div>
              <div className="grid grid-cols-2 gap-1">
                {category.fonts.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => setFont(font)}
                    className={`px-2 py-1.5 rounded text-xs text-left truncate transition-all ${
                      state.fontName === font.name
                        ? 'bg-violet-100 text-violet-800 ring-1 ring-violet-300'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ fontFamily: font.family, fontWeight: font.weight || '400' }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Scale */}
      <Slider
        label="Size"
        value={state.fontSize}
        min={24}
        max={200}
        onChange={(v) => update({ fontSize: v })}
        unit="px"
      />

      {/* Letter Spacing */}
      <Slider
        label="Letter Spacing"
        value={state.letterSpacing}
        min={-20}
        max={40}
        onChange={(v) => update({ letterSpacing: v })}
        unit="px"
      />

      {/* Line Height */}
      <Slider
        label="Line Height"
        value={state.lineHeight}
        min={0.6}
        max={2.5}
        step={0.05}
        onChange={(v) => update({ lineHeight: v })}
      />

      {/* Position */}
      <div className="h-px bg-gray-100" />
      <div className="grid grid-cols-2 gap-3">
        <Slider
          label="Position X"
          value={state.textX}
          min={-200}
          max={200}
          onChange={(v) => update({ textX: v })}
        />
        <Slider
          label="Position Y"
          value={state.textY}
          min={-200}
          max={200}
          onChange={(v) => update({ textY: v })}
        />
      </div>
    </div>
  )
}
