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

// Connection type options — what physically joins the letters together
const CONNECTION_TYPES = [
  {
    id: 'none',
    label: 'None',
    desc: 'Letters stand alone',
    svg: (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
        <rect x="2" y="4" width="8" height="12" rx="1.5"/>
        <rect x="12" y="4" width="4" height="12" rx="1.5"/>
        <rect x="18" y="4" width="8" height="12" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'baseline',
    label: 'Bar',
    desc: 'Horizontal baseline bar',
    svg: (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
        <rect x="2" y="3" width="8" height="12" rx="1.5"/>
        <rect x="12" y="3" width="4" height="12" rx="1.5"/>
        <rect x="18" y="3" width="8" height="12" rx="1.5"/>
        <rect x="1" y="13" width="26" height="4" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'circle',
    label: 'Circle',
    desc: 'Round backing plate',
    svg: (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
        <ellipse cx="14" cy="10" rx="13" ry="9"/>
        <rect x="4" y="4" width="5" height="10" rx="1" fill="white" opacity="0.7"/>
        <rect x="11" y="4" width="3" height="10" rx="1" fill="white" opacity="0.7"/>
        <rect x="16" y="4" width="7" height="10" rx="1" fill="white" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'rectangle',
    label: 'Rect',
    desc: 'Square backing plate',
    svg: (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
        <rect x="1" y="1" width="26" height="18" rx="2"/>
        <rect x="4" y="4" width="5" height="10" rx="1" fill="white" opacity="0.7"/>
        <rect x="11" y="4" width="3" height="10" rx="1" fill="white" opacity="0.7"/>
        <rect x="16" y="4" width="7" height="10" rx="1" fill="white" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'diamond',
    label: 'Diamond',
    desc: 'Diamond backing plate',
    svg: (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
        <polygon points="14,1 27,10 14,19 1,10"/>
        <rect x="5" y="5" width="4" height="8" rx="1" fill="white" opacity="0.7"/>
        <rect x="11" y="5" width="3" height="8" rx="1" fill="white" opacity="0.7"/>
        <rect x="16" y="5" width="5" height="8" rx="1" fill="white" opacity="0.7"/>
      </svg>
    ),
  },
]

export function SupportPanel({ store }) {
  const { state, update } = store
  const connType = state.connectionType || 'baseline'

  return (
    <div className="p-4 space-y-5">

      {/* ── Connection Type ── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-violet-50 rounded-lg flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Connection</h2>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
          How letters are joined into one cuttable piece. <span className="text-amber-600 font-medium">None</span> works if letters naturally touch.
        </p>

        <div className="grid grid-cols-5 gap-1">
          {CONNECTION_TYPES.map((ct) => (
            <button
              key={ct.id}
              onClick={() => update({ connectionType: ct.id })}
              title={ct.desc}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[9px] font-medium transition-all ${
                connType === ct.id
                  ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-400'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 ring-1 ring-transparent'
              }`}
            >
              <span className={connType === ct.id ? 'text-violet-600' : 'text-gray-400'}>{ct.svg}</span>
              {ct.label}
            </button>
          ))}
        </div>

        {/* Options for baseline bar */}
        {connType === 'baseline' && (
          <div className="mt-3 space-y-3 pl-1">
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

        {/* Options for backing shapes */}
        {(connType === 'circle' || connType === 'rectangle' || connType === 'diamond') && (
          <div className="mt-3 pl-1">
            <Slider
              label="Shape Padding"
              value={state.baseShapePadding}
              min={4}
              max={80}
              step={2}
              onChange={(v) => update({ baseShapePadding: v })}
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
          <div className="flex gap-1.5">
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                onClick={() => update({ stickCount: n })}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  state.stickCount === n
                    ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-transparent'
                }`}
              >
                {n === 0 ? 'None' : n === 1 ? '1 Stick' : '2 Sticks'}
              </button>
            ))}
          </div>
        </div>

        {state.stickCount === 0 && (
          <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-2 leading-relaxed">
            No sticks — design must be self-supporting or use a different display method.
          </p>
        )}

        {/* Tip Shape + dimensions + positions — only visible when sticks exist */}
        {state.stickCount > 0 && (<><div className="mb-4">
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

        {/* Stick dimensions */}
        <div className="space-y-3">
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

        <div className="h-px bg-gray-100 my-3" />

        {/* Stick 1 position */}
        <div className="space-y-3">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Stick 1</p>
          <Slider
            label="Position X"
            value={state.stick1X}
            min={5}
            max={95}
            onChange={(v) => update({ stick1X: v })}
            unit="%"
          />
          <div className="space-y-1">
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Position Y</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium tabular-nums">{state.stick1Y > 0 ? '+' : ''}{state.stick1Y}px</span>
                {state.stick1Y !== 0 && (
                  <button onClick={() => update({ stick1Y: 0 })} className="text-[10px] text-blue-500 hover:text-blue-700 font-medium">Reset</button>
                )}
              </div>
            </div>
            <input
              type="range"
              min={-80}
              max={80}
              value={state.stick1Y}
              onChange={(e) => update({ stick1Y: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[9px] text-gray-400 px-0.5">
              <span>↑ Higher</span>
              <span>Default</span>
              <span>Lower ↓</span>
            </div>
          </div>
        </div>

        {state.stickCount === 2 && (
          <>
            <div className="h-px bg-gray-100 my-3" />
            <div className="space-y-3">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Stick 2</p>
              <Slider
                label="Position X"
                value={state.stick2X}
                min={5}
                max={95}
                onChange={(v) => update({ stick2X: v })}
                unit="%"
              />
              <div className="space-y-1">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Position Y</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium tabular-nums">{state.stick2Y > 0 ? '+' : ''}{state.stick2Y}px</span>
                    {state.stick2Y !== 0 && (
                      <button onClick={() => update({ stick2Y: 0 })} className="text-[10px] text-blue-500 hover:text-blue-700 font-medium">Reset</button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min={-80}
                  max={80}
                  value={state.stick2Y}
                  onChange={(e) => update({ stick2Y: parseInt(e.target.value, 10) })}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[9px] text-gray-400 px-0.5">
                  <span>↑ Higher</span>
                  <span>Default</span>
                  <span>Lower ↓</span>
                </div>
              </div>
            </div>
          </>
        )}
      </>)}
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
