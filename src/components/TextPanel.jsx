import React from 'react'
import { FONT_CATEGORIES } from '../fonts'

const PRESETS = [
  { label: '🎂 Happy Birthday', text: 'Happy\nBirthday' },
  { label: '🎊 Congrats', text: 'Congratulations' },
  { label: '💍 Just Married', text: 'Just\nMarried' },
  { label: '🎓 Class of \'25', text: "Class of '25" },
  { label: '👶 Baby Shower', text: 'Baby\nShower' },
  { label: '🎉 Cheers', text: 'Cheers!' },
  { label: '🥂 Happy Anniversary', text: 'Happy\nAnniversary' },
  { label: '💼 Retirement', text: 'Happy\nRetirement' },
]

const PREVIEW_COLORS = [
  { name: 'Deep Purple', hex: '#1e1b4b' },
  { name: 'Crimson',     hex: '#7f1d1d' },
  { name: 'Forest',      hex: '#14532d' },
  { name: 'Navy',        hex: '#1e3a5f' },
  { name: 'Charcoal',    hex: '#1c1917' },
  { name: 'Rose',        hex: '#881337' },
  { name: 'Teal',        hex: '#134e4a' },
  { name: 'Gold',        hex: '#78350f' },
  { name: 'Slate',       hex: '#1e293b' },
  { name: 'Plum',        hex: '#4a044e' },
]

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
        className="w-full accent-violet-500"
      />
    </div>
  )
}

export function TextPanel({ store }) {
  const { state, update, setFont } = store

  return (
    <div className="p-4 space-y-5">

      {/* Quick Presets */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Quick Start</label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => update({ text: p.text })}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${
                state.text === p.text
                  ? 'bg-violet-100 text-violet-800 border-violet-300'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Your Message</label>
        <textarea
          value={state.text}
          onChange={(e) => update({ text: e.target.value })}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 resize-none transition-all bg-gray-50 focus:bg-white"
          placeholder="Happy Birthday"
        />
        <p className="text-[10px] text-gray-400 mt-1">Use ↵ Enter for multiple lines</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Preview Color */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Preview Color</label>
        <div className="flex flex-wrap gap-1.5">
          {PREVIEW_COLORS.map((c) => (
            <button
              key={c.hex}
              title={c.name}
              onClick={() => update({ previewColor: c.hex })}
              className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
                state.previewColor === c.hex
                  ? 'ring-2 ring-violet-400 ring-offset-2 scale-110'
                  : 'ring-1 ring-black/10'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {/* Custom color picker */}
          <label
            title="Custom color"
            className={`w-7 h-7 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-all ring-1 ring-black/10 relative flex items-center justify-center ${
              !PREVIEW_COLORS.find(c => c.hex === state.previewColor) ? 'ring-2 ring-violet-400 ring-offset-2' : ''
            }`}
            style={{
              background: !PREVIEW_COLORS.find(c => c.hex === state.previewColor)
                ? state.previewColor
                : 'conic-gradient(red,yellow,lime,aqua,blue,magenta,red)',
            }}
          >
            <input
              type="color"
              value={state.previewColor}
              onChange={(e) => update({ previewColor: e.target.value })}
              className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Font Selection */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Font</label>
        <div className="space-y-4">
          {Object.entries(FONT_CATEGORIES).map(([key, category]) => (
            <div key={key}>
              <div className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <span className="flex-1 h-px bg-gray-100" />
                {category.label}
                <span className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {category.fonts.map((font) => {
                  const isActive = state.fontName === font.name
                  return (
                    <button
                      key={font.name}
                      onClick={() => setFont(font)}
                      className={`px-2.5 py-2 rounded-lg text-left transition-all flex flex-col gap-0.5 ${
                        isActive
                          ? 'bg-violet-50 ring-1 ring-violet-400'
                          : 'bg-gray-50 hover:bg-gray-100 ring-1 ring-transparent hover:ring-gray-200'
                      }`}
                    >
                      <span
                        className={`text-lg leading-tight block truncate ${isActive ? 'text-violet-900' : 'text-gray-800'}`}
                        style={{ fontFamily: font.family, fontWeight: font.weight || '400' }}
                      >
                        Aa
                      </span>
                      <span className={`text-[9px] truncate font-medium ${isActive ? 'text-violet-600' : 'text-gray-400'}`}>
                        {font.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Size */}
      <Slider
        label="Size"
        value={state.fontSize}
        min={40}
        max={220}
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

      {/* Arc / Curve */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs items-center">
          <span className="text-gray-500">Arc Curve</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium tabular-nums">
              {state.arcAmount > 0 ? '+' : ''}{state.arcAmount}
            </span>
            {state.arcAmount !== 0 && (
              <button
                onClick={() => update({ arcAmount: 0 })}
                className="text-[10px] text-violet-500 hover:text-violet-700 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <input
          type="range"
          min={-100}
          max={100}
          value={state.arcAmount}
          onChange={(e) => update({ arcAmount: parseInt(e.target.value, 10) })}
          className="w-full accent-violet-500"
        />
        <div className="flex justify-between text-[9px] text-gray-400 font-medium px-0.5">
          <span>Valley</span>
          <span>Flat</span>
          <span>Arch</span>
        </div>
      </div>

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
