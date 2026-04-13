import React, { useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react'
import paper from 'paper'

const CANVAS_W = 800
const CANVAS_H = 600

// Convert text to Paper.js paths using font rendering on a temp canvas
function textToCompoundPath(scope, text, fontFamily, fontWeight, fontSize, letterSpacing, lineHeight) {
  if (!text.trim()) return null

  const lines = text.split('\n').filter((l) => l.length > 0)
  if (lines.length === 0) return null

  // Use a temporary canvas to measure and get text paths
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 2000
  tempCanvas.height = 1000
  const ctx = tempCanvas.getContext('2d')

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.textBaseline = 'alphabetic'

  const allPaths = []
  const lineHeightPx = fontSize * lineHeight

  lines.forEach((line, lineIdx) => {
    const yOffset = lineIdx * lineHeightPx

    // Render each character with custom spacing
    let xPos = 0
    const chars = Array.from(line)

    // Measure total width first for centering
    let totalWidth = 0
    chars.forEach((ch, i) => {
      const m = ctx.measureText(ch)
      totalWidth += m.width + (i < chars.length - 1 ? letterSpacing : 0)
    })

    // Start from centered position
    xPos = -totalWidth / 2

    chars.forEach((ch, i) => {
      if (ch === ' ') {
        const m = ctx.measureText(ch)
        xPos += m.width + letterSpacing
        return
      }

      // Create a text path for this character
      const charPath = new scope.PointText({
        point: [xPos, yOffset],
        content: ch,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        fontSize: fontSize,
        fillColor: 'black',
      })

      // Measure width for next position
      const m = ctx.measureText(ch)
      xPos += m.width + (i < chars.length - 1 ? letterSpacing : 0)

      allPaths.push(charPath)
    })
  })

  return allPaths
}

// Create a thick rectangle path for support stick
function createStickPath(scope, x, topY, width, length) {
  return new scope.Path.Rectangle({
    point: [x - width / 2, topY],
    size: [width, length],
    fillColor: 'black',
  })
}

// Create asset path from SVG path data
function createAssetPath(scope, pathData, viewBox, x, y, scale, rotation) {
  try {
    const path = new scope.CompoundPath(pathData)
    path.fillColor = 'black'
    path.fillRule = 'evenodd'

    // Parse viewBox to get original dimensions
    const [, , vbW, vbH] = viewBox.split(' ').map(Number)

    // Scale to reasonable size then apply user scale
    const baseScale = 80 / Math.max(vbW, vbH)
    path.scale(baseScale * scale)

    // Center the path at origin then move
    path.position = new scope.Point(x, y)

    if (rotation) {
      path.rotate(rotation)
    }

    return path
  } catch {
    return null
  }
}

// Perform boolean union on all paths
function uniteAllPaths(scope, paths) {
  if (paths.length === 0) return null
  if (paths.length === 1) return paths[0]

  let result = paths[0]
  for (let i = 1; i < paths.length; i++) {
    try {
      const united = result.unite(paths[i])
      result.remove()
      paths[i].remove()
      result = united
    } catch {
      // If union fails, keep going
    }
  }
  return result
}

const Canvas = forwardRef(function Canvas({ store }, ref) {
  const canvasRef = useRef(null)
  const scopeRef = useRef(null)
  const connectedRef = useRef(true)
  const storeRef = useRef(store)
  storeRef.current = store

  const { state } = store

  // Create a stable render key that excludes isConnected to avoid loops
  const renderKey = useMemo(() => JSON.stringify({
    text: state.text, fontFamily: state.fontFamily, fontWeight: state.fontWeight,
    fontSize: state.fontSize, letterSpacing: state.letterSpacing, lineHeight: state.lineHeight,
    textX: state.textX, textY: state.textY, placedAssets: state.placedAssets,
    stickCount: state.stickCount, stick1X: state.stick1X, stick2X: state.stick2X,
    stickWidth: state.stickWidth, stickLength: state.stickLength,
    showGrid: state.showGrid, selectedAssetId: state.selectedAssetId,
  }), [state.text, state.fontFamily, state.fontWeight, state.fontSize, state.letterSpacing, state.lineHeight, state.textX, state.textY, state.placedAssets, state.stickCount, state.stick1X, state.stick2X, state.stickWidth, state.stickLength, state.showGrid, state.selectedAssetId])

  // Initialize Paper.js
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scope = new paper.PaperScope()
    scope.setup(canvas)
    scopeRef.current = scope

    // Set up view
    scope.view.viewSize = new scope.Size(CANVAS_W, CANVAS_H)

    return () => {
      scope.remove()
    }
  }, [])

  // Redraw everything when design state changes (excludes isConnected)
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    // Clear everything
    scope.project.clear()

    const centerX = CANVAS_W / 2 + state.textX
    const centerY = CANVAS_H / 2 - 60 + state.textY

    // Draw grid background
    if (state.showGrid) {
      const gridLayer = new scope.Layer()
      gridLayer.name = 'grid'

      // Grid lines
      for (let x = 0; x <= CANVAS_W; x += 20) {
        const line = new scope.Path.Line(
          new scope.Point(x, 0),
          new scope.Point(x, CANVAS_H)
        )
        line.strokeColor = x % 100 === 0 ? '#ddd' : '#eee'
        line.strokeWidth = x % 100 === 0 ? 0.5 : 0.3
      }
      for (let y = 0; y <= CANVAS_H; y += 20) {
        const line = new scope.Path.Line(
          new scope.Point(0, y),
          new scope.Point(CANVAS_W, y)
        )
        line.strokeColor = y % 100 === 0 ? '#ddd' : '#eee'
        line.strokeWidth = y % 100 === 0 ? 0.5 : 0.3
      }
    }

    // Main design layer
    const designLayer = new scope.Layer()
    designLayer.name = 'design'

    // --- CREATE TEXT PATHS ---
    const textPaths = textToCompoundPath(
      scope,
      state.text,
      state.fontFamily,
      state.fontWeight,
      state.fontSize,
      state.letterSpacing,
      state.lineHeight
    )

    // Position text paths at center
    if (textPaths) {
      textPaths.forEach((p) => {
        p.position = new scope.Point(
          p.position.x + centerX,
          p.position.y + centerY
        )
      })
    }

    // --- CREATE ASSET PATHS ---
    const assetPaths = []
    state.placedAssets.forEach((asset) => {
      const p = createAssetPath(
        scope,
        asset.path,
        asset.viewBox,
        centerX + asset.x,
        centerY + asset.y,
        asset.scale,
        asset.rotation
      )
      if (p) assetPaths.push(p)
    })

    // --- CREATE SUPPORT STICKS ---
    // Find bottom of all content
    const allElements = [...(textPaths || []), ...assetPaths]
    let bottomY = centerY + state.fontSize / 2

    allElements.forEach((el) => {
      if (el.bounds) {
        bottomY = Math.max(bottomY, el.bounds.bottom)
      }
    })

    // Find the horizontal span for stick placement
    let leftX = centerX - 150
    let rightX = centerX + 150
    allElements.forEach((el) => {
      if (el.bounds) {
        leftX = Math.min(leftX, el.bounds.left)
        rightX = Math.max(rightX, el.bounds.right)
      }
    })

    const spanWidth = rightX - leftX
    const stickPaths = []

    // Stick 1
    const s1x = leftX + (state.stick1X / 100) * spanWidth
    stickPaths.push(createStickPath(scope, s1x, bottomY - 5, state.stickWidth, state.stickLength))

    // Stick 2
    if (state.stickCount === 2) {
      const s2x = leftX + (state.stick2X / 100) * spanWidth
      stickPaths.push(createStickPath(scope, s2x, bottomY - 5, state.stickWidth, state.stickLength))
    }

    // --- BOOLEAN UNION ---
    const allPaths = [...(textPaths || []), ...assetPaths, ...stickPaths]

    if (allPaths.length > 0) {
      // Try to unite all paths
      let finalPath = null
      const pathsCopy = [...allPaths]

      try {
        finalPath = uniteAllPaths(scope, pathsCopy)
      } catch {
        // Fallback: just style them individually
        finalPath = null
      }

      if (finalPath) {
        finalPath.fillColor = '#1e1b4b'
        finalPath.strokeColor = null
        finalPath.name = 'united-design'

        // Check connectivity - if the result is a CompoundPath with
        // separate sub-paths that don't overlap, highlight gaps
        let connected = true
        if (finalPath.className === 'CompoundPath' && finalPath.children) {
          // More than just the outer boundary = might have holes (OK) or disconnected parts (BAD)
          // For a simple check, we consider it connected if all children overlap with at least one other
          const childBounds = finalPath.children.map((c) => c.bounds)

          // Simple heuristic: if any child bounds don't intersect with any other, it's disconnected
          for (let i = 0; i < childBounds.length; i++) {
            let intersectsAny = false
            for (let j = 0; j < childBounds.length; j++) {
              if (i !== j && childBounds[i].intersects(childBounds[j])) {
                intersectsAny = true
                break
              }
            }
            // Small children are likely holes, not disconnected parts
            if (!intersectsAny && childBounds[i].area > 100) {
              connected = false
              break
            }
          }
        }

        if (connectedRef.current !== connected) {
          connectedRef.current = connected
          setTimeout(() => storeRef.current.update({ isConnected: connected }), 0)
        }

        // Show disconnection warning
        if (!connected) {
          finalPath.strokeColor = '#ef4444'
          finalPath.strokeWidth = 1.5
          finalPath.dashArray = [6, 4]
        }
      } else {
        // Couldn't unite - show all paths individually
        allPaths.forEach((p) => {
          if (!p.removed) {
            p.fillColor = '#1e1b4b'
          }
        })
        if (connectedRef.current !== false) {
          connectedRef.current = false
          setTimeout(() => storeRef.current.update({ isConnected: false }), 0)
        }
      }
    }

    // Draw selection indicator for selected asset
    if (state.selectedAssetId) {
      const asset = state.placedAssets.find((a) => a.id === state.selectedAssetId)
      if (asset) {
        const selRect = new scope.Path.Rectangle({
          point: [centerX + asset.x - 45, centerY + asset.y - 45],
          size: [90, 90],
          strokeColor: '#7c3aed',
          strokeWidth: 1,
          dashArray: [4, 4],
          fillColor: null,
        })
        selRect.name = 'selection'
      }
    }

    scope.view.draw()
  }, [renderKey])

  // Handle drag and drop of assets
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - CANVAS_W / 2
      const y = e.clientY - rect.top - CANVAS_H / 2 + 60
      store.addAsset(data, x, y)
    } catch {
      // Invalid drop data
    }
  }, [store])

  // Canvas mouse interaction for dragging assets
  const handleMouseDown = useCallback((e) => {
    const scope = scopeRef.current
    if (!scope) return

    const rect = canvasRef.current.getBoundingClientRect()
    const point = new scope.Point(
      e.clientX - rect.left,
      e.clientY - rect.top
    )

    // Hit test on the design
    const hit = scope.project.hitTest(point, {
      fill: true,
      tolerance: 5,
    })

    if (!hit) {
      store.selectAsset(null)
    }
  }, [store])

  // Export SVG
  useImperativeHandle(ref, () => ({
    exportSVG: () => {
      const scope = scopeRef.current
      if (!scope) return

      // Find the united design path
      const designLayer = scope.project.layers.find((l) => l.name === 'design')
      if (!designLayer) return

      const unitedPath = designLayer.children.find((c) => c.name === 'united-design')

      // Create export scope
      const exportScope = new paper.PaperScope()
      const tempCanvas = document.createElement('canvas')
      exportScope.setup(tempCanvas)

      let exportItem
      if (unitedPath) {
        exportItem = unitedPath.clone()
      } else {
        // Export all design elements
        const group = new exportScope.Group()
        designLayer.children.forEach((child) => {
          if (child.name !== 'selection') {
            group.addChild(child.clone())
          }
        })
        exportItem = group
      }

      // Get bounds for viewBox
      const bounds = exportItem.bounds
      const padding = 10

      // Generate SVG string
      const svgStr = exportItem.exportSVG({ asString: true })

      // Wrap in proper SVG document
      const width = bounds.width + padding * 2
      const height = bounds.height + padding * 2
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="${bounds.x - padding} ${bounds.y - padding} ${width} ${height}"
     width="${width}mm" height="${height}mm"
     fill="#000000" stroke="none">
  ${svgStr}
</svg>`

      // Download
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cake-topper-${Date.now()}.svg`
      a.click()
      URL.revokeObjectURL(url)

      exportScope.remove()
    },

    checkConnections: () => {
      // The connection check is already done in the render loop
      // This just re-triggers it
      store.update({ isConnected: store.state.isConnected })
    },
  }))

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-[#f8f9fc] overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="relative rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block cursor-crosshair"
          onMouseDown={handleMouseDown}
        />

        {/* Canvas overlay label */}
        <div className="absolute bottom-3 left-3 text-[10px] text-gray-400 bg-white/80 px-2 py-0.5 rounded">
          {CANVAS_W} × {CANVAS_H} px
        </div>
      </div>
    </div>
  )
})

export { Canvas }
