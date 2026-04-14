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
      {/* Baseline Connector */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
            <line x1="3" y1="18" x2="21" y2="18" />
            <line x1="6" y1="12" x2="6" y2="18" />
            <line x1="12" y1="8" x2="12" y2="18" />
            <line x1="18" y1="12" x2="18" y2="18" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-800">Baseline Connector</h2>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 text-[11px] text-blue-700 leading-relaxed">
        The baseline bar connects all letters into one solid piece so nothing falls apart when cut.
      </div>

      <div className="flex items-center gap-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={state.baselineEnabled}
            onChange={(e) => update({ baselineEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
        </label>
        <span className="text-xs text-gray-600">Enable baseline bar</span>
      </div>

      {state.baselineEnabled && (
        <>
          <Slider
            label="Bar Thickness"
            value={state.baselineHeight}
            min={1}
            max={10}
            step={0.5}
            onChange={(v) => update({ baselineHeight: v })}
            unit="px"
          />
          <Slider
            label="Vertical Offset"
            value={state.baselineOffset}
            min={-20}
            max={20}
            onChange={(v) => update({ baselineOffset: v })}
            unit="px"
          />
        </>
      )}

      <div className="h-px bg-gray-100" />

      {/* Support Sticks Header */}
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

      {/* Stick Tip Shape */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Tip Shape</label>
        <div className="flex gap-1.5">
          {['flat', 'rounded', 'pointed'].map((tipId) => (
            <button
              key={tipId}
              onClick={() => update({ stickTip: tipId })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                state.stickTip === tipId
                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg width="20" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                {tipId === 'flat' && <rect x="6" y="14" width="12" height="6" />}
                {tipId === 'rounded' && (
                  <>
                    <rect x="6" y="10" width="12" height="6" />
                    <ellipse cx="12" cy="16" rx="6" ry="4" />
                  </>
                )}
                {tipId === 'pointed' && (
                  <>
                    <rect x="6" y="8" width="12" height="6" />
                    <polygon points="6,14 18,14 12,22" />
                  </>
                )}
              </svg>
              {tipId.charAt(0).toUpperCase() + tipId.slice(1)}
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

      {/* Stick 2 Position */}
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
    </div>
  )
}
