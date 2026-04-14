import React, { useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react'
import paper from 'paper'

const CANVAS_W = 800
const CANVAS_H = 600

const Canvas = forwardRef(function Canvas({ store }, ref) {
  const canvasRef = useRef(null)
  const scopeRef = useRef(null)
  const connectedRef = useRef(true)
  const storeRef = useRef(store)
  storeRef.current = store

  const dragRef = useRef({ active: false, assetId: null, startX: 0, startY: 0, origX: 0, origY: 0 })

  const { state } = store

  const renderKey = useMemo(() => JSON.stringify({
    t: state.text, ff: state.fontFamily, fw: state.fontWeight,
    fs: state.fontSize, ls: state.letterSpacing, lh: state.lineHeight,
    tx: state.textX, ty: state.textY, pa: state.placedAssets,
    be: state.baselineEnabled, bh: state.baselineHeight, bo: state.baselineOffset,
    sc: state.stickCount, s1: state.stick1X, s2: state.stick2X,
    sw: state.stickWidth, sl: state.stickLength, st: state.stickTip,
    sg: state.showGrid, sa: state.selectedAssetId,
  }), [state.text, state.fontFamily, state.fontWeight, state.fontSize, state.letterSpacing,
    state.lineHeight, state.textX, state.textY, state.placedAssets,
    state.baselineEnabled, state.baselineHeight, state.baselineOffset,
    state.stickCount, state.stick1X, state.stick2X, state.stickWidth, state.stickLength,
    state.stickTip, state.showGrid, state.selectedAssetId])

  // Initialize Paper.js with PaperScope
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Use PaperScope for isolation
    const scope = new paper.PaperScope()
    scope.setup(canvas)
    scope.view.viewSize = new scope.Size(CANVAS_W, CANVAS_H)
    scopeRef.current = scope

    return () => {
      scope.remove()
      scopeRef.current = null
    }
  }, [])

  // MAIN RENDER
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    try {
      scope.activate()
      scope.project.clear()

      const DARK = new scope.Color('#1e1b4b')
      const centerX = CANVAS_W / 2 + state.textX
      const centerY = CANVAS_H / 2 - 80 + state.textY

      // --- GRID ---
      if (state.showGrid) {
        const gridLayer = new scope.Layer()
        gridLayer.name = 'grid'
        for (let x = 0; x <= CANVAS_W; x += 20) {
          const line = new scope.Path.Line(new scope.Point(x, 0), new scope.Point(x, CANVAS_H))
          line.strokeColor = new scope.Color(x % 100 === 0 ? '#ddd' : '#eee')
          line.strokeWidth = x % 100 === 0 ? 0.5 : 0.3
        }
        for (let y = 0; y <= CANVAS_H; y += 20) {
          const line = new scope.Path.Line(new scope.Point(0, y), new scope.Point(CANVAS_W, y))
          line.strokeColor = new scope.Color(y % 100 === 0 ? '#ddd' : '#eee')
          line.strokeWidth = y % 100 === 0 ? 0.5 : 0.3
        }
      }

      // --- DESIGN LAYER ---
      const designLayer = new scope.Layer()
      designLayer.name = 'design'

      // --- TEXT ---
      const textItems = []
      const text = state.text.trim()
      if (text) {
        const lines = text.split('\n').filter((l) => l.length > 0)
        const lineHeightPx = state.fontSize * state.lineHeight
        const mc = document.createElement('canvas')
        const ctx = mc.getContext('2d')
        ctx.font = `${state.fontWeight} ${state.fontSize}px ${state.fontFamily}`

        lines.forEach((line, lineIdx) => {
          const yOff = lineIdx * lineHeightPx
          const chars = Array.from(line)

          let totalW = 0
          chars.forEach((ch, i) => {
            totalW += ctx.measureText(ch).width + (i < chars.length - 1 ? state.letterSpacing : 0)
          })

          let xPos = centerX - totalW / 2

          chars.forEach((ch, i) => {
            if (ch === ' ') {
              xPos += ctx.measureText(ch).width + state.letterSpacing
              return
            }
            const cw = ctx.measureText(ch).width
            const pt = new scope.PointText(new scope.Point(xPos, centerY + yOff + state.fontSize * 0.35))
            pt.content = ch
            pt.fontFamily = state.fontFamily
            pt.fontWeight = state.fontWeight
            pt.fontSize = state.fontSize
            pt.fillColor = DARK
            textItems.push(pt)
            xPos += cw + (i < chars.length - 1 ? state.letterSpacing : 0)
          })
        })
      }

      // Text bounds
      let textBounds = null
      textItems.forEach((p) => {
        if (!textBounds) textBounds = p.bounds.clone()
        else textBounds = textBounds.unite(p.bounds)
      })

      // --- BASELINE BAR ---
      let baselinePath = null
      if (state.baselineEnabled && textBounds) {
        baselinePath = new scope.Path.Rectangle(
          new scope.Rectangle(
            textBounds.left - 4,
            textBounds.bottom + state.baselineOffset - state.baselineHeight / 2,
            textBounds.width + 8,
            state.baselineHeight
          )
        )
        baselinePath.fillColor = DARK
      }

      // --- ASSETS ---
      const assetPaths = []
      state.placedAssets.forEach((asset) => {
        try {
          const p = new scope.CompoundPath(asset.path)
          p.fillRule = 'evenodd'
          const [, , vbW, vbH] = asset.viewBox.split(' ').map(Number)
          const baseScale = 80 / Math.max(vbW, vbH)
          p.scale(baseScale * asset.scale)
          p.position = new scope.Point(centerX + asset.x, centerY + asset.y)
          if (asset.rotation) p.rotate(asset.rotation)
          p.fillColor = DARK
          assetPaths.push(p)
        } catch { /* skip */ }
      })

      // --- STICKS ---
      const contentEls = [...(baselinePath ? [baselinePath] : []), ...assetPaths]
      let bottomY = textBounds ? textBounds.bottom : centerY + 30
      if (baselinePath) bottomY = Math.max(bottomY, baselinePath.bounds.bottom)
      contentEls.forEach((el) => { if (el.bounds) bottomY = Math.max(bottomY, el.bounds.bottom) })

      let leftX = textBounds ? textBounds.left : centerX - 100
      let rightX = textBounds ? textBounds.right : centerX + 100
      contentEls.forEach((el) => {
        if (el.bounds) { leftX = Math.min(leftX, el.bounds.left); rightX = Math.max(rightX, el.bounds.right) }
      })
      const spanW = rightX - leftX

      function makeStick(xPct) {
        const sx = leftX + (xPct / 100) * spanW
        const hw = state.stickWidth / 2

        if (state.stickTip === 'pointed') {
          const bH = state.stickLength * 0.75
          const body = new scope.Path.Rectangle(new scope.Rectangle(sx - hw, bottomY - 2, state.stickWidth, bH))
          body.fillColor = DARK
          const tri = new scope.Path({
            segments: [[sx - hw, bottomY - 2 + bH], [sx, bottomY - 2 + state.stickLength], [sx + hw, bottomY - 2 + bH]],
            closed: true,
          })
          tri.fillColor = DARK
          try { const u = body.unite(tri); body.remove(); tri.remove(); u.fillColor = DARK; return u }
          catch { tri.remove(); return body }
        } else if (state.stickTip === 'rounded') {
          const body = new scope.Path.Rectangle(new scope.Rectangle(sx - hw, bottomY - 2, state.stickWidth, state.stickLength - hw))
          body.fillColor = DARK
          const circ = new scope.Path.Circle(new scope.Point(sx, bottomY - 2 + state.stickLength - hw), hw)
          circ.fillColor = DARK
          try { const u = body.unite(circ); body.remove(); circ.remove(); u.fillColor = DARK; return u }
          catch { circ.remove(); return body }
        } else {
          const r = new scope.Path.Rectangle(new scope.Rectangle(sx - hw, bottomY - 2, state.stickWidth, state.stickLength))
          r.fillColor = DARK
          return r
        }
      }

      const stickPaths = [makeStick(state.stick1X)]
      if (state.stickCount === 2) stickPaths.push(makeStick(state.stick2X))

      // --- BOOLEAN UNION ---
      const vectorPaths = [...(baselinePath ? [baselinePath] : []), ...assetPaths, ...stickPaths]
      if (vectorPaths.length > 1) {
        let result = vectorPaths[0]
        for (let i = 1; i < vectorPaths.length; i++) {
          try {
            const u = result.unite(vectorPaths[i])
            result.remove(); vectorPaths[i].remove()
            result = u
          } catch { /* skip */ }
        }
        result.fillColor = DARK
        result.name = 'united-structure'
      } else if (vectorPaths.length === 1) {
        vectorPaths[0].name = 'united-structure'
      }

      // --- CONNECTION CHECK ---
      const connected = state.baselineEnabled && textBounds != null
      if (connectedRef.current !== connected) {
        connectedRef.current = connected
        setTimeout(() => storeRef.current.update({ isConnected: connected }), 0)
      }

      // --- SELECTION ---
      if (state.selectedAssetId) {
        const asset = state.placedAssets.find((a) => a.id === state.selectedAssetId)
        if (asset) {
          const r = new scope.Path.Rectangle(
            new scope.Rectangle(
              centerX + asset.x - 50 * asset.scale,
              centerY + asset.y - 50 * asset.scale,
              100 * asset.scale,
              100 * asset.scale
            )
          )
          r.strokeColor = new scope.Color('#7c3aed')
          r.strokeWidth = 1.5
          r.dashArray = [4, 4]
          r.name = 'selection'
        }
      }

      scope.view.draw()
    } catch (err) {
      console.error('Canvas render error:', err.message, err.stack)
    }
  }, [renderKey])

  // --- DRAG ASSETS ON CANVAS ---
  const getCanvasPoint = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleMouseDown = useCallback((e) => {
    const pt = getCanvasPoint(e)
    const s = storeRef.current.state
    const cx = CANVAS_W / 2 + s.textX
    const cy = CANVAS_H / 2 - 80 + s.textY
    for (let i = s.placedAssets.length - 1; i >= 0; i--) {
      const a = s.placedAssets[i]
      const rad = 50 * a.scale
      if (Math.abs(pt.x - (cx + a.x)) < rad && Math.abs(pt.y - (cy + a.y)) < rad) {
        dragRef.current = { active: true, assetId: a.id, startX: pt.x, startY: pt.y, origX: a.x, origY: a.y }
        storeRef.current.selectAsset(a.id)
        return
      }
    }
    storeRef.current.selectAsset(null)
  }, [getCanvasPoint])

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return
    const pt = getCanvasPoint(e)
    storeRef.current.updateAsset(dragRef.current.assetId, {
      x: Math.round(dragRef.current.origX + pt.x - dragRef.current.startX),
      y: Math.round(dragRef.current.origY + pt.y - dragRef.current.startY),
    })
  }, [getCanvasPoint])

  const handleMouseUp = useCallback(() => { dragRef.current.active = false }, [])

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      const rect = canvasRef.current.getBoundingClientRect()
      storeRef.current.addAsset(data, e.clientX - rect.left - CANVAS_W / 2, e.clientY - rect.top - CANVAS_H / 2 + 80)
    } catch { /* invalid drop */ }
  }, [])

  // --- EXPORT ---
  useImperativeHandle(ref, () => ({
    exportSVG: () => {
      const scope = scopeRef.current
      if (!scope) return
      scope.activate()
      const designLayer = scope.project.layers.find((l) => l.name === 'design')
      if (!designLayer) return

      const exportGroup = new scope.Group()
      designLayer.children.forEach((child) => {
        if (child.name !== 'selection') exportGroup.addChild(child.clone())
      })
      if (exportGroup.children.length === 0) { exportGroup.remove(); return }

      const bounds = exportGroup.bounds
      const pad = 10
      const svgStr = exportGroup.exportSVG({ asString: true })
      const w = bounds.width + pad * 2
      const h = bounds.height + pad * 2
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="${bounds.x - pad} ${bounds.y - pad} ${w} ${h}"
     width="${w}mm" height="${h}mm" fill="#000000" stroke="none">
  ${svgStr}
</svg>`
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cake-topper-${Date.now()}.svg`
      a.click()
      URL.revokeObjectURL(url)
      exportGroup.remove()
    },
    checkConnections: () => {
      storeRef.current.update({ isConnected: connectedRef.current })
    },
  }))

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#f8f9fc] overflow-hidden"
      onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="relative rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden">
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
          className="block cursor-crosshair"
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        />
        <div className="absolute bottom-3 left-3 text-[10px] text-gray-400 bg-white/80 px-2 py-0.5 rounded">
          {CANVAS_W} × {CANVAS_H} px — Drag assets to reposition
        </div>
      </div>
    </div>
  )
})

export { Canvas }
