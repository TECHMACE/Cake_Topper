import React from 'react'
import { ASSET_CATEGORIES } from '../assets'

function AssetThumb({ asset, onAdd }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <button
      draggable
      onDragStart={handleDragStart}
      onClick={() => onAdd(asset)}
      className="group relative aspect-square bg-gray-50 hover:bg-violet-50 rounded-lg border border-gray-100 hover:border-violet-200 transition-all flex items-center justify-center p-2"
      title={asset.name}
    >
      <svg
        viewBox={asset.viewBox}
        className="w-full h-full text-gray-600 group-hover:text-violet-600 transition-colors"
        fill="currentColor"
        stroke="none"
      >
        <path d={asset.pathData || asset.path} />
      </svg>
      <span className="absolute bottom-0.5 left-0 right-0 text-center text-[9px] text-gray-400 group-hover:text-violet-500 truncate px-1">
        {asset.name}
      </span>
    </button>
  )
}

function PlacedAssetItem({ asset, isSelected, store }) {
  return (
    <div
      className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
        isSelected
          ? 'border-violet-300 bg-violet-50'
          : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={() => store.selectAsset(asset.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-700">{asset.name}</span>
        <button
          onClick={(e) => { e.stopPropagation(); store.removeAsset(asset.id) }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {isSelected && (
        <div className="space-y-2 mt-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Scale</span>
              <span className="text-gray-600">{asset.scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.05}
              value={asset.scale}
              onChange={(e) => store.updateAsset(asset.id, { scale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Rotation</span>
              <span className="text-gray-600">{asset.rotation}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={5}
              value={asset.rotation}
              onChange={(e) => store.updateAsset(asset.id, { rotation: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">X</span>
                <span className="text-gray-600">{asset.x}</span>
              </div>
              <input
                type="range"
                min={-300}
                max={300}
                value={asset.x}
                onChange={(e) => store.updateAsset(asset.id, { x: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">Y</span>
                <span className="text-gray-600">{asset.y}</span>
              </div>
              <input
                type="range"
                min={-300}
                max={300}
                value={asset.y}
                onChange={(e) => store.updateAsset(asset.id, { y: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function AssetLibrary({ store }) {
  const { state } = store

  const handleAdd = (assetDef) => {
    store.addAsset(assetDef, 0, -20)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-fuchsia-100 rounded flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c026d3" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-800">Asset Library</h2>
      </div>

      <p className="text-[10px] text-gray-400">Click or drag to add to canvas</p>

      {/* Asset Categories */}
      {Object.entries(ASSET_CATEGORIES).map(([key, category]) => (
        <div key={key}>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {category.assets.map((asset) => (
              <AssetThumb key={asset.id} asset={asset} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      ))}

      {/* Placed Assets */}
      {state.placedAssets.length > 0 && (
        <>
          <div className="h-px bg-gray-100 mt-4" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
              On Canvas ({state.placedAssets.length})
            </div>
            <div className="space-y-1.5">
              {state.placedAssets.map((asset) => (
                <PlacedAssetItem
                  key={asset.id}
                  asset={asset}
                  isSelected={state.selectedAssetId === asset.id}
                  store={store}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
