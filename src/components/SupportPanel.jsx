import React, { useState } from 'react'

// px → mm conversion constant (at 10" output, 900px canvas)
const CANVAS_W = 900

function pxToMm(px, outputWidthInches) {
  return ((outputWidthInches || 10) * 25.4 / CANVAS_W) * px
}

function mmToPx(mm, outputWidthInches) {
  return mm / ((outputWidthInches || 10) * 25.4 / CANVAS_W)
}

// Slider that shows both px (internal) and mm (display) with inch toggle
function MmSlider({ label, valuePx, min, max, step, onChange, outputWidthInches, showInch }) {
  const mmPerPx = (outputWidthInches || 10) * 25.4 / CANVAS_W
  const valueMm = valuePx * mmPerPx
  const valueIn = valueMm / 25.4
  const displayVal = showInch
    ? `${valueIn.toFixed(2)}"`
    : `${valueMm.toFixed(1)}mm`

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-700 font-medium tabular-nums">{displayVal}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={valuePx}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  )
}

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
    desc: 'Rectangle backing plate',
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
  {
    id: 'freeform',
    label: 'Blob',
    desc: 'Organic outline following letter shapes',
    svg: (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
        <path d="M4,10 C3,6 6,2 10,2 C13,2 14,4 14,4 C14,4 15,2 18,2 C22,2 25,6 24,10 C23,14 20,18 14,18 C8,18 5,14 4,10 Z"/>
        <rect x="6" y="5" width="5" height="8" rx="1" fill="white" opacity="0.7"/>
        <rect x="13" y="5" width="3" height="8" rx="1" fill="white" opacity="0.7"/>
        <rect x="18" y="5" width="4" height="8" rx="1" fill="white" opacity="0.7"/>
      </svg>
    ),
  },
]

export function SupportPanel({ store }) {
  const { state, update } = store
  const connType = state.connectionType || 'baseline'
  const [showInch, setShowInch] = useState(false)
  const owi = state.outputWidthInches || 10

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

        <div className="grid grid-cols-3 gap-1">
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

        {/* mm / inch toggle */}
        <div className="flex items-center justify-end mt-2 gap-1.5">
          <span className="text-[10px] text-gray-400">Units:</span>
          <button
            onClick={() => setShowInch(false)}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${!showInch ? 'bg-violet-100 text-violet-700' : 'text-gray-400 hover:text-gray-600'}`}
          >mm</button>
          <button
            onClick={() => setShowInch(true)}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${showInch ? 'bg-violet-100 text-violet-700' : 'text-gray-400 hover:text-gray-600'}`}
          >in</button>
        </div>

        {/* Options for baseline bar */}
        {connType === 'baseline' && (
          <div className="mt-3 space-y-3 pl-1">
            <MmSlider
              label="Bar Thickness"
              valuePx={state.baselineHeight}
              min={6}
              max={40}
              step={1}
              onChange={(v) => update({ baselineHeight: v })}
              outputWidthInches={owi}
              showInch={showInch}
            />
            <MmSlider
              label="Bite into Letters"
              valuePx={Math.abs(state.baselineOffset)}
              min={0}
              max={40}
              onChange={(v) => update({ baselineOffset: -v })}
              outputWidthInches={owi}
              showInch={showInch}
            />
          </div>
        )}

        {/* Options for backing shapes */}
        {(connType === 'circle' || connType === 'rectangle' || connType === 'diamond' || connType === 'freeform') && (
          <div className="mt-3 pl-1 space-y-3">
            <MmSlider
              label="Shape Padding"
              valuePx={state.baseShapePadding}
              min={4}
              max={80}
              step={2}
              onChange={(v) => update({ baseShapePadding: v })}
              outputWidthInches={owi}
              showInch={showInch}
            />
            {connType !== 'freeform' && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500">Internal bar</span>
                  <p className="text-[10px] text-gray-400">Connects letters to frame</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.showInternalBar !== false}
                    onChange={(e) => update({ showInternalBar: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-violet-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>
            )}
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
                onClick={() => update(n === 1 ? { stickCount: 1, stick1X: 50 } : { stickCount: n })}
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
          <MmSlider
            label="Stick Width"
            valuePx={state.stickWidth}
            min={6}
            max={30}
            onChange={(v) => update({ stickWidth: v })}
            outputWidthInches={owi}
            showInch={showInch}
          />
          <MmSlider
            label="Stick Length"
            valuePx={state.stickLength}
            min={80}
            max={400}
            step={10}
            onChange={(v) => update({ stickLength: v })}
            outputWidthInches={owi}
            showInch={showInch}
          />
        </div>

        <div className="h-px bg-gray-100 my-3" />

        {/* Stick positions */}
        <div className="space-y-3">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            {state.stickCount === 2 ? 'Positions' : 'Position'}
          </p>
          <Slider
            label="Stick 1 — Left/Right"
            value={state.stick1X}
            min={5}
            max={95}
            onChange={(v) => update({ stick1X: v })}
            unit="%"
          />
          {state.stickCount === 2 && (
            <Slider
              label="Stick 2 — Left/Right"
              value={state.stick2X}
              min={5}
              max={95}
              onChange={(v) => update({ stick2X: v })}
              unit="%"
            />
          )}
          {[
            { label: state.stickCount === 2 ? 'Stick 1 Height' : 'Stick Height', key: 'stick1Y', val: state.stick1Y || 0 },
            ...(state.stickCount === 2 ? [{ label: 'Stick 2 Height', key: 'stick2Y', val: state.stick2Y || 0 }] : []),
          ].map(({ label, key, val }) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs items-center">
                <span className="text-gray-500">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium tabular-nums">{val > 0 ? '+' : ''}{val}px</span>
                  {val !== 0 && (
                    <button onClick={() => update({ [key]: 0 })} className="text-[10px] text-blue-500 hover:text-blue-700 font-medium">Reset</button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={-120}
                max={120}
                value={val}
                onChange={(e) => update({ [key]: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[9px] text-gray-400 px-0.5">
                <span>↑ Higher</span>
                <span>Default</span>
                <span>Lower ↓</span>
              </div>
            </div>
          ))}
          <p className="text-[9px] text-gray-400">Drag ● handles on canvas to move each stick independently.</p>
        </div>
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
