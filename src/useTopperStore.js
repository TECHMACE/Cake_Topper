import { useState, useCallback } from 'react'
import { DEFAULT_FONT } from './fonts'

let nextAssetId = 1

const DEFAULT_STATE = {
  // Text settings
  text: 'Happy Birthday',
  fontName: DEFAULT_FONT.name,
  fontFamily: DEFAULT_FONT.family,
  fontWeight: DEFAULT_FONT.weight || '400',
  fontSize: 72,
  letterSpacing: 0,
  lineHeight: 1.2,
  textX: 0,
  textY: 0,

  // Placed assets on canvas
  placedAssets: [],

  // Support sticks
  stickCount: 2,
  stick1X: 30,
  stick2X: 70,
  stickWidth: 6,
  stickLength: 60,

  // Canvas
  showGrid: true,
  selectedAssetId: null,

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
