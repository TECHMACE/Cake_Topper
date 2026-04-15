import { useState, useCallback } from 'react'
import { DEFAULT_FONT } from './fonts'

let nextAssetId = 1

const DEFAULT_STATE = {
  // Text settings
  text: 'Happy Birthday',
  fontName: DEFAULT_FONT.name,
  fontFamily: DEFAULT_FONT.family,
  fontWeight: DEFAULT_FONT.weight || '400',
  fontSize: 100,         // ~1.25" at 10" output — chunky and readable
  letterSpacing: 2,
  lineHeight: 1.15,
  textX: 0,
  textY: 0,
  arcAmount: 0, // -100 to 100: negative = valley, positive = arch over

  // Output sizing (for laser/Cricut export)
  outputWidthInches: 10, // target cut width in inches

  // Placed assets on canvas
  placedAssets: [],

  // Baseline connector bar (connects all letters)
  // Real toppers have a bar ~4–6mm thick — at 10" output, 1px ≈ 0.32mm
  baselineEnabled: true,
  baselineHeight: 18,    // ~5.7mm — solid, visible bar
  baselineOffset: -8,    // bite 8px up into letter bottoms for a strong weld

  // Support sticks
  // Standard bamboo skewer is ~3mm dia; cake picks are 4–6mm wide
  stickCount: 2,
  stick1X: 28,
  stick2X: 72,
  stickWidth: 16,        // ~5mm — properly grippable
  stickLength: 260,      // ~82mm — deep enough to anchor in a tall cake
  stickTip: 'pointed',   // 'flat', 'rounded', 'pointed'

  // Preview color (changes the visual preview; export is always single fill)
  previewColor: '#1e1b4b',

  // Canvas
  showGrid: true,
  selectedAssetId: null,
  draggingAssetId: null,

  // Connection status
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

  return {
    state,
    update,
    setFont,
    addAsset,
    updateAsset,
    removeAsset,
    selectAsset,
  }
}
