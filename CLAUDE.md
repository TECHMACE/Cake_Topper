# The High Ground — Cake Topper Studio · CLAUDE.md

## Quick Start
```bash
cd /Users/andrewmace/Andyland/projects/cake-topper
npm run dev          # starts Vite dev server at http://localhost:5173
```
All active work is on `main`.

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
  connectionType: 'baseline', // 'none' | 'baseline' | 'offset' | 'circle' | 'rectangle' | 'diamond' | 'freeform'
  baselineHeight: 12,
  baselineOffset: -6,         // negative bites into letter bottoms for a weld
  baseShapePadding: 20,       // px around text bounds for frame shapes
  offsetMargin: 24,           // px the offset backing plate extends beyond letters (type=offset)

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
2. **Text paths** — `textToGlyphPaths()` per glyph (flat or arced), translated with `letterOffsets`. In `none` mode (no bar/frame) a **contact-snap pass** slides each glyph left until its ink overlaps the previous glyph, collapsing letter gaps AND the inter-word space into one continuous welded word (no thin bridge spokes). `letterLayout: 'varying'` adds a small deterministic vertical bounce per glyph (overlap is widened so it stays welded). Skipped when the user has dragged letters (`letterOffsets`).
3. **Letter thickness expansion** — scale each child path outward by `letterExpansion` px
4. **Frame connectors** (circle / rectangle / diamond / freeform — `FRAME_TYPES`) — outer shape minus inner cutout = ring, united with text. `offset` is NOT a frame type and is excluded here.
5. **Baseline bar** — pill-shaped rect at `textBounds.bottom + baselineOffset`, united with text
6. **Assets** — placed icons scaled and positioned, united with text if overlapping
6b. **Offset backing plate** (`offset` mode) — runs after assets. Keeps a clone of the letters (`offsetLetterPath`, the piece glued on top), then builds the plate by **disk-stamp dilation** of the letter silhouette (12 stamps around a circle of radius `offsetMargin`, all united) → an outward sticker-style offset that merges naturally-spaced letters into one plate. Holes (letter counters) are dropped **in place** (`children.filter(!clockwise).remove()`, fillRule nonzero) to solidify — do NOT clone+remove the parent, that orphans the result. `textPath` becomes the plate, so sticks attach to the plate bottom (never a mid-word gap). At render end the plate is drawn muted (alpha 0.32) and the letters are drawn on top in full color (named `offset-letters`).
7. **Support sticks** — `makeStick(xPct, yOff)` builds pointed/rounded/flat sticks below bar. In `none`/`offset` modes `snapStickX()` snaps each stick's X to the nearest **bottom-line** glyph center (`bottomHits` = glyphs near the largest `cy`) so it rises into solid letter ink (none) / sits under a real letter on the plate (offset). **Bottom-line filtering is critical:** snapping against all glyphs let a shorter, centered upper line (e.g. "Happy" over "Birthday") pull both sticks inward to mid-word. Drag handles use the same snap. In `offset` mode sticks still anchor to the plate bottom with `overlapDepth = max(16, offsetMargin)`.
8. **Auto-bridge loop** — up to 30 (baseline/none) or 80 (frame) iterations. Each pass finds the loose outer contour, welds it to the NEAREST other outer contour (adjacent letter / bar / ring inner edge) with a thin rect whose ends **overshoot into both shapes** (Paper.js won't merge contours that only touch at an edge). Runs for every connection mode.
9. **Connectivity check** — honest count of outer clockwise contours on the final united path; >1 = disconnected → red dashed stroke + store update. Same rule for every mode (no lenient frame exception).
10. **Cut safety warnings** — bar too thin, sticks too thin, still disconnected after bridging
11. **Stick handle positions** — emitted via `setStickHandlePos` for the DOM overlay handles

### Ref API (via `useImperativeHandle`)
```js
canvasRef.current.exportSVG()        // downloads cut-ready SVG (see export note below)
canvasRef.current.checkConnections() // re-syncs isConnected to store
canvasRef.current.autoFit()          // one-click: optimal font size, bar, sticks, lineHeight
```

**Export:** non-offset modes download ONE SVG of `final-design` (black fill, scaled so design width = `outputWidthInches`). `offset` mode downloads TWO files at a **shared `mmPerPx`** (anchored to the plate width so the letters file matches the plate's scale): `*-base-plate.svg` = plate + sticks (black cut) with the letter outlines as **blue score lines** (`stroke="#0000ff"`, ~0.15mm) so you know where to glue; `*-letters.svg` = the letters to cut from a second material. `buildSVG(items, bounds, mmPerPx)` is the shared builder; each item is `{ path, mode: 'cut' | 'score' }`.

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
5. For frame connectors (`isFrameMode` = circle/rectangle/diamond/freeform only): `baseShapePadding` ~ `fontSize * 0.30` (with bar) or 10 (no bar)
5b. For `offset`: `offsetMargin = max(14, fontSize * 0.22)` — wide enough that spaced letters + the word gap merge into one continuous plate
6. Sticks: width = `fontSize * 0.13`, length = `fontSize * 2.4`, positions at 22%/78%
7. `connectionType` is preserved — Auto Fit never changes what connector the user picked

---

## Connection Types

| Type | How it works |
|---|---|
| `none` | No bar/frame — letters are contact-snapped so they touch into one welded word. `letterLayout` toggle: `bunched` (tight, even baseline) or `varying` (slight organic height bounce). Sticks snap under solid letters. The *tight* option. |
| `offset` | **Backing plate.** Two-piece physical build: letters keep natural spacing on top of a sticker-style offset plate (disk-stamp dilation by `offsetMargin`, solidified). Plate + sticks = one cut piece; letters = a second cut piece. Export gives 2 files (plate with blue score lines + letters). The *spaced* option — sticks attach to the plate, never mid-word. |
| `baseline` | Pill-shaped bar at letter bottoms; sticks overlap bar by `barH * 0.6` |
| `circle` | Ellipse ring (outer − inner) united with text |
| `rectangle` | Rounded-rect ring (outer − inner) united with text |
| `diamond` | Diamond ring (outer − inner) united with text |

Frame ring is **always boolean-united (nonzero)** with the text. `showInternalBar`
toggles an explicit spanning bar; with it off, the auto-bridge welds letters to the
ring (or each other) with thin spokes. Either way the result is one cuttable piece.

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

None currently tracked.

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
- No-bar frame mode exported disconnected pieces while reporting "One Piece" → was assembled as an `evenodd` CompoundPath without union (overlapping letters XOR'd into holes and each subpath cut separately). Now always boolean-united (nonzero) + auto-bridged.
- Auto-bridge wasting all 80 attempts without merging → bridge ends landed exactly ON contour boundaries (touching only); Paper.js won't merge contours that just touch. Fixed by overshooting bridge ends into both shapes and targeting the nearest contour instead of the largest.
- Lenient frame connectivity check reported floating letters as connected → removed; the check now honestly counts outer contours for all modes.
- `none` mode + Auto Fit produced a "stringed blob": sticks slammed into mid-word gaps and letters were held by long thin diagonal spokes (the inter-word space + stick gaps). Fixed with contact-snap (letters welded by ink overlap) + `snapStickX` (sticks rise into letters). Added `letterLayout` bunched/varying toggle.
- Auto Fit sticks clustered in the **middle of the word** on multi-line text → `snapStickX` snapped to the nearest glyph across ALL lines, so a shorter centered upper line ("Happy" over "Birthday") pulled both sticks inward. Fixed by snapping only to `bottomHits` (the bottom line's glyphs, where sticks actually attach). Applies to `none` + `offset`.
- `offset` plate rendered nothing (`final-design` had `parent === null`) → solidify cloned the CompoundPath's children (clones insert *into* that same CompoundPath), then `plate.remove()` deleted the parent AND the freshly-made clones, orphaning the result. Fixed by dropping holes **in place** (`children.filter(c => !c.clockwise).forEach(c => c.remove())` + `fillRule = 'nonzero'`) instead of clone-then-remove-parent.

---

## Running Locally
```bash
npm install
npm run dev    # http://localhost:5173
```
