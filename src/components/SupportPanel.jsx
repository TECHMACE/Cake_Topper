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
        className="w-full accent-blue-500"
      />
    </div>
  )
}

export function SupportPanel({ store }) {
  const { state, update } = store

  return (
    <div className="p-4 space-y-5">

      {/* ── Baseline Connector ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
                <line x1="3" y1="18" x2="21" y2="18" />
                <line x1="6" y1="12" x2="6" y2="18" />
                <line x1="12" y1="8" x2="12" y2="18" />
                <line x1="18" y1="12" x2="18" y2="18" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-800">Baseline Bar</h2>
          </div>

          {/* Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={state.baselineEnabled}
              onChange={(e) => update({ baselineEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
          </label>
        </div>

        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
          Connects all letters into one solid piece — essential for cutting.
        </p>

        {state.baselineEnabled && (
          <div className="space-y-3 pl-1">
            <Slider
              label="Bar Thickness"
              value={state.baselineHeight}
              min={6}
              max={40}
              step={1}
              onChange={(v) => update({ baselineHeight: v })}
              unit="px"
            />
            <Slider
              label="Bite into Letters"
              value={state.baselineOffset}
              min={-40}
              max={10}
              onChange={(v) => update({ baselineOffset: v })}
              unit="px"
            />
          </div>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      {/* ── Support Sticks ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
              <line x1="8" y1="6" x2="8" y2="20" />
              <line x1="16" y1="6" x2="16" y2="20" />
              <line x1="4" y1="6" x2="20" y2="6" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Support Sticks</h2>
        </div>

        {/* Stick Count */}
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1.5 block">Number of Sticks</label>
          <div className="flex gap-2">
            {[1, 2].map((n) => (
              <button
                key={n}
                onClick={() => update({ stickCount: n })}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  state.stickCount === n
                    ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-transparent'
                }`}
              >
                {n} Stick{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Tip Shape */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1.5 block">Tip Shape</label>
          <div className="flex gap-1.5">
            {[
              {
                id: 'flat',
                label: 'Flat',
                svg: <rect x="6" y="8" width="12" height="12" />,
              },
              {
                id: 'rounded',
                label: 'Round',
                svg: (
                  <>
                    <rect x="6" y="6" width="12" height="10" />
                    <path d="M6 16 Q6 22 12 22 Q18 22 18 16Z" />
                  </>
                ),
              },
              {
                id: 'pointed',
                label: 'Point',
                svg: (
                  <>
                    <rect x="6" y="4" width="12" height="10" />
                    <polygon points="6,14 18,14 12,22" />
                  </>
                ),
              },
            ].map((tip) => (
              <button
                key={tip.id}
                onClick={() => update({ stickTip: tip.id })}
                className={`flex-1 py-2 rounded-xl text-[10px] font-medium transition-all flex flex-col items-center gap-1 ${
                  state.stickTip === tip.id
                    ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-transparent'
                }`}
              >
                <svg width="18" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  {tip.svg}
                </svg>
                {tip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Slider
            label="Stick 1 Position"
            value={state.stick1X}
            min={5}
            max={95}
            onChange={(v) => update({ stick1X: v })}
            unit="%"
          />

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

          <Slider
            label="Stick Width"
            value={state.stickWidth}
            min={6}
            max={30}
            onChange={(v) => update({ stickWidth: v })}
            unit="px"
          />

          <Slider
            label="Stick Length"
            value={state.stickLength}
            min={80}
            max={400}
            step={10}
            onChange={(v) => update({ stickLength: v })}
            unit="px"
          />
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Grid toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Show Grid</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={state.showGrid}
            onChange={(e) => update({ showGrid: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-violet-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
        </label>
      </div>
    </div>
  )
}
