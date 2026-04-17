import { useState, useCallback } from 'react'
import { DEFAULT_FONT } from './fonts'

let nextAssetId = 1

const DEFAULT_STATE = {
  // Text settings
  text: 'Happy\nBirthday',
  fontName: DEFAULT_FONT.name,
  fontFamily: DEFAULT_FONT.family,
  fontWeight: DEFAULT_FONT.weight || '400',
  fontSize: 100,         // ~1.25" at 10" output — chunky and readable
  letterSpacing: 2,
  lineHeight: 0.9,   // 0.9 makes multi-line letters touch, keeping bar-connected designs clean
  textX: 0,
  textY: 0,
  arcAmount: 0, // -100 to 100: negative = valley, positive = arch over
  letterExpansion: 0,    // 0–15px: inflates letter strokes for thicker cuts

  // Output sizing (for laser/Cricut export)
  outputWidthInches: 10, // target cut width in inches

  // Placed assets on canvas
  placedAssets: [],

  // Connection type — how letters are physically joined into one cuttable piece
  // 'none'      = letters stand alone (fine for touching/overlapping fonts)
  // 'baseline'  = horizontal bar along letter bottoms
  // 'circle' | 'rectangle' | 'diamond' = solid backing plate behind text
  connectionType: 'baseline',
  baselineHeight: 12,    // ~3.8mm — slim elegant bar (used when type=baseline)
  baselineOffset: -6,    // bite 6px up into letter bottoms for a clean weld
  baseShapePadding: 20,  // px padding around text bounds for shape backing

  // Support sticks
  stickCount: 2,
  stick1X: 28,
  stick1Y: 0,            // vertical offset for stick 1 (-80 to 80px)
  stick2X: 72,
  stick2Y: 0,            // vertical offset for stick 2 (-80 to 80px)
  stickWidth: 16,        // ~5mm — properly grippable
  stickLength: 260,      // ~82mm — deep enough to anchor in a tall cake
  stickTip: 'pointed',   // 'flat', 'rounded', 'pointed'

  // Preview color (changes the visual preview; export is always single fill)
  previewColor: '#1e1b4b',

  // Per-letter drag offsets
  letterOffsets: {},  // { "line0_char2": { x: 0, y: 0 }, ... }

  // Canvas
  showGrid: true,
  selectedAssetId: null,
  draggingAssetId: null,

  // Connection status (computed by Canvas render)
  isConnected: true,
}

export function useTopperStore() {
  const [state, setState] = useState(DEFAULT_STATE)

  const update = useCallback((partial) => {
    setState((prev) => ({ ...prev, ...partial }))
  }, [])

  const setFont = useCallback((font) => {
    setState((prev) => ({
      ...prev,
      fontName: font.name,
      fontFamily: font.family,
      fontWeight: font.weight || '400',
    }))
  }, [])

  const addAsset = useCallback((assetDef, x, y) => {
    const id = `placed-${nextAssetId++}`
    setState((prev) => ({
      ...prev,
      placedAssets: [
        ...prev.placedAssets,
        {
          id,
          assetId: assetDef.id,
          name: assetDef.name,
          path: assetDef.pathData || assetDef.path,
          viewBox: assetDef.viewBox,
          x: x || 0,
          y: y || 0,
          scale: 0.6,
          rotation: 0,
        },
      ],
      selectedAssetId: id,
    }))
  }, [])

  const updateAsset = useCallback((id, changes) => {
    setState((prev) => ({
      ...prev,
      placedAssets: prev.placedAssets.map((a) =>
        a.id === id ? { ...a, ...changes } : a
      ),
    }))
  }, [])

  const removeAsset = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      placedAssets: prev.placedAssets.filter((a) => a.id !== id),
      selectedAssetId: prev.selectedAssetId === id ? null : prev.selectedAssetId,
    }))
  }, [])

  const selectAsset = useCallback((id) => {
    setState((prev) => ({ ...prev, selectedAssetId: id }))
  }, [])

  const setLetterOffset = useCallback((key, dx, dy) => {
    setState(prev => ({
      ...prev,
      letterOffsets: {
        ...prev.letterOffsets,
        [key]: { x: dx, y: dy }
      }
    }))
  }, [])

  return {
    state,
    update,
    setFont,
    addAsset,
    updateAsset,
    removeAsset,
    selectAsset,
    setLetterOffset,
    letterOffsets: state.letterOffsets,
  }
}
