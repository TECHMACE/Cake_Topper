import React from 'react'

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

export function SupportPanel({ store }) {
  const { state, update } = store

  return (
    <div className="p-4 space-y-4 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
            <line x1="8" y1="6" x2="8" y2="20" />
            <line x1="16" y1="6" x2="16" y2="20" />
            <line x1="4" y1="6" x2="20" y2="6" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-800">Support Sticks</h2>
      </div>

      {/* Stick Count */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Number of Sticks</label>
        <div className="flex gap-2">
          {[1, 2].map((n) => (
            <button
              key={n}
              onClick={() => update({ stickCount: n })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                state.stickCount === n
                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {n} Stick{n > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Stick 1 Position */}
      <Slider
        label="Stick 1 Position"
        value={state.stick1X}
        min={5}
        max={95}
        onChange={(v) => update({ stick1X: v })}
        unit="%"
      />

      {/* Stick 2 Position (only if 2 sticks) */}
      {state.stickCount === 2 && (
        <Slider
          label="Stick 2 Position"
          value={state.stick2X}
          min={5}
          max={95}
          onChange={(v) => update({ stick2X: v })}
          unit="%"
        />
      )}

      {/* Stick Dimensions */}
      <div className="h-px bg-gray-100" />

      <Slider
        label="Stick Width"
        value={state.stickWidth}
        min={3}
        max={15}
        onChange={(v) => update({ stickWidth: v })}
        unit="mm"
      />

      <Slider
        label="Stick Length"
        value={state.stickLength}
        min={20}
        max={120}
        onChange={(v) => update({ stickLength: v })}
        unit="mm"
      />

      {/* Info */}
      <div className="bg-amber-50 rounded-lg p-3 text-[11px] text-amber-700 leading-relaxed">
        <strong>Tip:</strong> Sticks are automatically welded to the bottom of your design. Position them where the topper needs the most support.
      </div>
    </div>
  )
}
