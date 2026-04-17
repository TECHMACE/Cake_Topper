# The High Ground — Cake Topper Studio · CLAUDE.md

## Quick Start
```bash
cd /Users/andrewmace/Cake_Topper
npm run dev          # starts Vite dev server at http://localhost:5173
```
All active work is on `main`. The `claude/clever-sammet` branch has been merged in.

---

## What This Is
A React web app that generates cut-ready SVG designs for laser-cut / Cricut cake toppers.
Users type text, choose a font, add decorative icons, position support sticks, and download a
single-path SVG. Every element is boolean-unioned into one continuous cut shape.

---

## Tech Stack
| Layer | Library |
|---|---|
| UI | React 18 + Vite |
| Canvas / boolean ops | Paper.js (PaperScope per instance) |
| Font rendering | opentype.js (via `src/fontLoader.js`) |
| Styling | Tailwind CSS |
| State | Custom hook `useTopperStore` (plain `useState`, no external lib) |
| Backend | None |

---

## File Map

```
src/
  App.jsx                  # Root layout — tabs, header wiring, canvasRef
  useTopperStore.js        # All state + callbacks (update, setFont, addAsset, etc.)
  fontLoader.js            # loadFont(), textToGlyphPaths(), getTextMetrics() via opentype.js
  fonts.js                 # Available font list (name, family, weight, url)
  assets.js                # SVG path data for icon library (celebration + pets categories)
  index.css                # Tailwind directives + tiny global overrides

  components/
    Canvas.jsx             # MAIN RENDER — Paper.js, boolean union, drag, export
    Header.jsx             # Top bar: branding, Auto Fit, connection badge, Download SVG
    TextPanel.jsx          # Left panel tab 1 — font, size, spacing, arc, color, grid
    SupportPanel.jsx       # Left panel tab 2 — connection type, bar/frame, sticks
    AssetLibrary.jsx       # Left panel tab 3 — icon grid + placed-asset controls

public/
  fonts/                   # Woff2 font files served by Vite
```

---

## State Shape (`useTopperStore` DEFAULT_STATE)

```js
{
  // Text
  text: 'Happy\nBirthday',
  fontName, fontFamily, fontWeight,
  fontSize: 100,          // px at canvas scale
  letterSpacing: 2,
  lineHeight: 0.9,        // multiplier; 0.62 forces multi-line letters to physically touch
  textX: 0, textY: 0,     // px offset from canvas center
  arcAmount: 0,           // -100 to 100; negative=valley, positive=arch
  letterExpansion: 0,     // 0–15px stroke thickening

  // Output
  outputWidthInches: 10,  // scales all exported mm dimensions

  // Assets
  placedAssets: [],       // [{ id, assetId, name, path, viewBox, x, y, scale, rotation }]
  selectedAssetId: null,
  draggingAssetId: null,

  // Connection
  connectionType: 'baseline', // 'none' | 'baseline' | 'circle' | 'rectangle' | 'diamond'
  baselineHeight: 12,
  baselineOffset: -6,         // negative bites into letter bottoms for a weld
  baseShapePadding: 20,       // px around text bounds for frame shapes

  // Sticks
  stickCount: 2,              // 0 | 1 | 2
  stick1X: 28, stick1Y: 0,    // stick1X is % of text span (0–100)
  stick2X: 72, stick2Y: 0,
  stickWidth: 16,
  stickLength: 260,
  stickTip: 'pointed',        // 'flat' | 'rounded' | 'pointed'

  // Per-letter drag offsets
  letterOffsets: {},          // { "line0_char2": { x: 0, y: 0 }, ... }

  // Preview
  previewColor: '#1e1b4b',
  showGrid: true,

  // Computed by Canvas after each render
  isConnected: true,
}
```

---

## Canvas.jsx — How It Works

### Canvas constants
```js
const CANVAS_W = 900
const CANVAS_H = 580
```
Text is centered at `(CANVAS_W/2 + textX, CANVAS_H*0.32 + textY)`.

### Render pipeline (inside the big `useEffect` keyed on `renderKey`)
1. **Grid** — faint lines if `showGrid`
2. **Text paths** — `textToGlyphPaths()` per glyph (flat or arced), translated with `letterOffsets`
3. **Letter thickness expansion** — scale each child path outward by `letterExpansion` px
4. **Frame connectors** (circle / rectangle / diamond) — outer shape minus inner cutout = ring, united with text
5. **Baseline bar** — pill-shaped rect at `textBounds.bottom + baselineOffset`, united with text
6. **Assets** — placed icons scaled and positioned, united with text if overlapping
7. **Support sticks** — `makeStick(xPct, yOff)` builds pointed/rounded/flat sticks below bar
8. **Auto-bridge loop** — up to 30 (baseline) or 80 (rectangle) iterations: find disconnected outer contours, weld with a thin perpendicular rect
9. **Connectivity check** — counts outer clockwise contours; >1 = disconnected → red dashed stroke + store update
10. **Cut safety warnings** — bar too thin, sticks too thin, still disconnected after bridging
11. **Stick handle positions** — emitted via `setStickHandlePos` for the DOM overlay handles

### Ref API (via `useImperativeHandle`)
```js
canvasRef.current.exportSVG()        // downloads cut-ready SVG file
canvasRef.current.checkConnections() // re-syncs isConnected to store
canvasRef.current.autoFit()          // one-click: optimal font size, bar, sticks, lineHeight
```

### Interaction model
| Gesture | Effect |
|---|---|
| Click/drag glyph on canvas | Moves that letter independently (stored in `letterOffsets`) |
| Drag placed asset | Repositions icon on canvas |
| Drag amber ● handle | Slides stick left/right (constrained to 5–95% of text span) |
| Drag from AssetLibrary | Drops icon at cursor position |

Letter drag only works in `baseline` / `none` connection modes — frame modes weld letters in place.

---

## Auto Fit Logic
Located in the `autoFit` method inside `useImperativeHandle` in Canvas.jsx:
1. Target width = 65% of canvas (multi-line) or 74% (single-line)
2. Scale font so longest line hits target width (clamped 40–200px)
3. For multi-line + baseline: `lineHeight = 0.62` (forces descender/ascender overlap)
4. Bar height = `fontSize * 0.10`, bar offset = `-barH * 0.55`
5. For frame connectors: `baseShapePadding = max(22, fontSize * 0.26)`
6. Sticks: width = `fontSize * 0.13`, length = `fontSize * 2.4`, positions at 22%/78%
7. `connectionType` is preserved — Auto Fit never changes what connector the user picked

---

## Connection Types

| Type | How it works |
|---|---|
| `none` | No connector — letters must touch naturally (overlapping fonts only) |
| `baseline` | Pill-shaped bar at letter bottoms; sticks overlap bar by `barH * 0.6` |
| `circle` | Ellipse ring (outer − inner) united with text |
| `rectangle` | Rounded-rect ring (outer − inner) united with text |
| `diamond` | Diamond ring (outer − inner) united with text |

For frame types, sticks overlap the outer frame by `frameThickness + 4` px.
Frame thickness = `max(8, round(padding * 0.38))`.

---

## fontLoader.js — Key Functions

```js
loadFont(fontName, fontWeight)
  // Returns opentype.js Font object (cached after first load)

textToGlyphPaths(font, text, fontSize, letterSpacing)
  // Returns { glyphs: [{ char, pathData, advance, x }], totalWidth }
  // pathData is SVG path string positioned at origin (0,0)
  // Caller translates each glyph to its correct canvas position

getTextMetrics(font, text, fontSize, letterSpacing)
  // Returns { width, ascent, descent, capHeight }
```

---

## assets.js — Adding Icons

Each asset entry:
```js
{
  id: 'unique-kebab-id',
  name: 'Display Name',
  pathData: 'M... Z M... Z',   // SVG d= string (use pathData, not path)
  viewBox: '0 0 W H',
}
```

**Rules for cut-safe paths:**
- All sub-paths must be **closed** (end with `Z`)
- For circles/ellipses use two-arc form to guarantee closure:
  `M{cx-rx},{cy} A{rx},{ry} 0 0,1 {cx+rx},{cy} A{rx},{ry} 0 0,1 {cx-rx},{cy} Z`
- Sub-paths must NOT overlap the main shape — Paper.js uses `evenodd` fill rule,
  so overlapping same-direction paths create holes
- Fill only — no strokes in cut files
- Minimum feature width ≈ 2 mm at 10" output ≈ 7 px at canvas scale

---

## Known Remaining Issues

1. **Frame connectors (circle/rect/diamond) show "Gaps Found"** — middle letters of a word
   don't touch the frame ring, so they're isolated. Auto Fit generates large padding but
   can't fix words where no letter is tall/wide enough to reach the frame.
   **Fix needed:** for frame modes, also add an internal thin baseline bar so letters
   connect to each other (and the bar ends reach the inner frame edge).

2. **Stick drag interferes with asset dragging near stick handles** — the amber ● DOM
   overlays are 20×20 px at z-index 10. Clicking an asset whose bounding area overlaps
   a stick handle accidentally starts a stick drag.
   **Fix needed:** add circular hit-test in `handleStickMouseDown` so off-center clicks
   fall through to the canvas `handleMouseDown`.

3. **Pet icons could be more recognizable** — current SVG paths are valid but look
   abstract at the small thumbnail size. Consider retracing with simpler geometric shapes.

---

## Bugs Fixed (historical)

- White holes where letters overlap → `fillRule = 'nonzero'` on all united paths
- Bar cutting into multi-line text → `overlapAmount = 0`
- Sticks too far up into letters → `overlapDepth = barH * 0.6`
- False "Gaps Found" on micro-bridges → only warn when still `!connected` after all bridges
- Auto Fit lineHeight sign error → was pushing lines apart instead of together
- Rectangle frame creating solid filled block → use `outer.subtract(inner)`
- Auto Fit changing user's connector type → now preserved with `connectionType` unchanged
- "Width" label confusion → renamed to "Cut width"

---

## Git Branches
- `main` — active development branch, all features merged here
- `claude/clever-sammet` — feature branch (merged into main, kept for reference)

## Running Locally
```bash
npm install
npm run dev    # http://localhost:5173
```
