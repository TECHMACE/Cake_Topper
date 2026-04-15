import React, { useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useMemo, useState } from 'react'
import paper from 'paper'
import { loadFont, textToSvgPath, textToGlyphPaths, getTextMetrics } from '../fontLoader'

const CANVAS_W = 900   // wider to give margins for baseline bar overhang
const CANVAS_H = 580   // taller to show long sticks comfortably

const Canvas = forwardRef(function Canvas({ store }, ref) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const scopeRef = useRef(null)
  const connectedRef = useRef(true)
  const storeRef = useRef(store)
  storeRef.current = store

  const dragRef = useRef({ active: false, assetId: null, startX: 0, startY: 0, origX: 0, origY: 0 })
  const stickDragRef = useRef({ active: false, id: null, startX: 0, origPct: 0 })
  const stickLayoutRef = useRef({ leftX: 0, spanW: 1, bottomY: 0 })
  const [loadedFont, setLoadedFont] = useState(null)
  const [fontLoading, setFontLoading] = useState(false)
  const [cutWarnings, setCutWarnings] = useState([])
  const [stickHandlePos, setStickHandlePos] = useState([])

  const { state } = store

  // Helper to get canvas coordinate from mouse event, accounting for CSS scaling
  const getCanvasPoint = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = CANVAS_W / rect.width
    const scaleY = CANVAS_H / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [])

  // Load the opentype.js font whenever font selection changes
  useEffect(() => {
    setFontLoading(true)
    setLoadedFont(null)
    loadFont(state.fontName, state.fontWeight || '400')
      .then((font) => { setLoadedFont(font); setFontLoading(false) })
      .catch(() => { setLoadedFont(null); setFontLoading(false) })
  }, [state.fontName, state.fontWeight])

  // Stable render key
  const renderKey = useMemo(() => JSON.stringify({
    t: state.text, fn: state.fontName, fw: state.fontWeight,
    fs: state.fontSize, ls: state.letterSpacing, lh: state.lineHeight,
    tx: state.textX, ty: state.textY, arc: state.arcAmount, pa: state.placedAssets,
    ct: state.connectionType, bh: state.baselineHeight, bo: state.baselineOffset,
    bsp: state.baseShapePadding, le: state.letterExpansion,
    sc: state.stickCount, s1: state.stick1X, s1y: state.stick1Y,
    s2: state.stick2X, s2y: state.stick2Y,
    sw: state.stickWidth, sl: state.stickLength, st: state.stickTip,
    sg: state.showGrid, sa: state.selectedAssetId,
    ow: state.outputWidthInches, pc: state.previewColor,
    fl: loadedFont ? 'yes' : 'no',
  }), [state.text, state.fontName, state.fontWeight, state.fontSize, state.letterSpacing,
    state.lineHeight, state.textX, state.textY, state.arcAmount, state.placedAssets,
    state.connectionType, state.baselineHeight, state.baselineOffset,
    state.baseShapePadding, state.letterExpansion,
    state.stickCount, state.stick1X, state.stick1Y, state.stick2X, state.stick2Y,
    state.stickWidth, state.stickLength,
    state.stickTip, state.showGrid, state.selectedAssetId, state.outputWidthInches,
    state.previewColor, loadedFont])

  // Init Paper.js
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Paper.js setup() reads the canvas's *CSS* size to determine its
    // coordinate space, then scales the backing buffer by DPR.
    // We must pin the CSS size BEFORE calling setup so Paper.js gets the
    // right 800×560 coordinate space regardless of the containing layout.
    canvas.style.cssText = `width:${CANVAS_W}px;height:${CANVAS_H}px;display:block;cursor:crosshair;`
    const scope = new paper.PaperScope()
    scope.setup(canvas)
    // Paper.js has now locked the coordinate space to CANVAS_W x CANVAS_H.
    // Do NOT change canvas style or call viewSize after this.
    scopeRef.current = scope
    window.__paperScope = scope
    return () => { scope.remove(); scopeRef.current = null; window.__paperScope = null }
  }, [])

  // ---- MAIN RENDER ----
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    try {
      scope.activate()
      scope.project.clear()

      const FILL = new scope.Color(state.previewColor || '#1e1b4b')
      const WARN = new scope.Color('#ef4444')
      const centerX = CANVAS_W / 2 + state.textX
      // Position text in upper-centre so sticks can extend well below
      const centerY = CANVAS_H * 0.32 + state.textY

      // --- DECORATIVE CAKE HINT ---
      // Draw a soft cake silhouette at the very bottom of the canvas so users
      // can visualise the topper sitting on a real cake tier.
      const bgLayer = new scope.Layer()
      bgLayer.name = 'bg'
      {
        const cakeTop = CANVAS_H - 48
        const cake = new scope.Path.Rectangle(
          new scope.Rectangle(40, cakeTop, CANVAS_W - 80, 48),
          new scope.Size(10, 10) // corner radius
        )
        cake.fillColor = new scope.Color('#fdf2e9')
        cake.strokeColor = new scope.Color('#f0cba8')
        cake.strokeWidth = 1.5
        // Frosting top squiggle (simple scallop line)
        const scallop = new scope.Path()
        scallop.moveTo(new scope.Point(40, cakeTop + 6))
        for (let sx = 40; sx <= CANVAS_W - 80; sx += 20) {
          scallop.cubicCurveTo(
            new scope.Point(sx + 5, cakeTop - 2),
            new scope.Point(sx + 15, cakeTop - 2),
            new scope.Point(sx + 20, cakeTop + 6)
          )
        }
        scallop.strokeColor = new scope.Color('#f0cba8')
        scallop.strokeWidth = 2
        scallop.fillColor = new scope.Color('#fff7ed')
      }

      // --- GRID ---
      if (state.showGrid) {
        const gridLayer = new scope.Layer()
        gridLayer.name = 'grid'
        for (let x = 0; x <= CANVAS_W; x += 20) {
          const l = new scope.Path.Line(new scope.Point(x, 0), new scope.Point(x, CANVAS_H))
          l.strokeColor = new scope.Color(x % 100 === 0 ? '#e2e8f0' : '#f1f5f9')
          l.strokeWidth = x % 100 === 0 ? 0.6 : 0.3
        }
        for (let y = 0; y <= CANVAS_H; y += 20) {
          const l = new scope.Path.Line(new scope.Point(0, y), new scope.Point(CANVAS_W, y))
          l.strokeColor = new scope.Color(y % 100 === 0 ? '#e2e8f0' : '#f1f5f9')
          l.strokeWidth = y % 100 === 0 ? 0.6 : 0.3
        }
        // Center cross
        const hLine = new scope.Path.Line(new scope.Point(CANVAS_W / 2 - 12, CANVAS_H * 0.32), new scope.Point(CANVAS_W / 2 + 12, CANVAS_H * 0.32))
        hLine.strokeColor = new scope.Color('#c4b5fd')
        hLine.strokeWidth = 1
        const vLine = new scope.Path.Line(new scope.Point(CANVAS_W / 2, CANVAS_H * 0.32 - 12), new scope.Point(CANVAS_W / 2, CANVAS_H * 0.32 + 12))
        vLine.strokeColor = new scope.Color('#c4b5fd')
        vLine.strokeWidth = 1
      }

      // --- DESIGN LAYER ---
      const designLayer = new scope.Layer()
      designLayer.name = 'design'

      // --- TEXT as real vector outlines via opentype.js ---
      let textPath = null
      let textBounds = null

      const text = state.text.trim()
      if (text && loadedFont) {
        const lines = text.split('\n').filter(l => l.length > 0)
        const lineHeightPx = state.fontSize * state.lineHeight
        const allLinePaths = []
        const arc = state.arcAmount || 0

        lines.forEach((line, lineIdx) => {
          const metrics = getTextMetrics(loadedFont, line, state.fontSize, state.letterSpacing)
          const startX = centerX - metrics.width / 2
          const baselineY = centerY + lineIdx * lineHeightPx

          if (arc === 0) {
            const { pathData } = textToSvgPath(
              loadedFont, line, state.fontSize,
              startX, baselineY, state.letterSpacing
            )
            if (pathData) {
              try {
                const linePath = new scope.CompoundPath(pathData)
                linePath.fillColor = FILL
                linePath.fillRule = 'evenodd'
                allLinePaths.push(linePath)
              } catch (e) { console.warn('Flat text path failed:', line, e) }
            }
          } else {
            const { glyphs, totalWidth } = textToGlyphPaths(
              loadedFont, line, state.fontSize, state.letterSpacing
            )
            if (totalWidth > 0) {
              const archesUp = arc > 0
              const arcHeight = (Math.abs(arc) / 100) * totalWidth * 0.35
              const R = (totalWidth * totalWidth + 4 * arcHeight * arcHeight) / (8 * arcHeight)
              const halfAngle = Math.asin(totalWidth / (2 * R))
              const cx = centerX
              const cy = archesUp ? (baselineY + (R - arcHeight)) : (baselineY - (R - arcHeight))

              glyphs.forEach((g) => {
                if (!g.pathData) return
                const glyphCenterX = g.x + g.advance / 2
                const t = (glyphCenterX - totalWidth / 2) / (totalWidth / 2)
                const angle = t * halfAngle
                const arcX = cx + R * Math.sin(angle)
                const arcY = archesUp ? (cy - R * Math.cos(angle)) : (cy + R * Math.cos(angle))
                const rotDeg = (archesUp ? angle : -angle) * 180 / Math.PI
                try {
                  const glyphPath = new scope.CompoundPath(g.pathData)
                  glyphPath.fillRule = 'evenodd'
                  glyphPath.fillColor = FILL
                  glyphPath.translate(new scope.Point(-g.advance / 2, 0))
                  glyphPath.rotate(rotDeg, new scope.Point(0, 0))
                  glyphPath.translate(new scope.Point(arcX, arcY))
                  allLinePaths.push(glyphPath)
                } catch (e) { console.warn('Arc glyph path failed:', g.char, e) }
              })
            }
          }
        })

        if (allLinePaths.length > 0) {
          textPath = allLinePaths[0]
          for (let i = 1; i < allLinePaths.length; i++) {
            try {
              const u = textPath.unite(allLinePaths[i])
              textPath.remove()
              allLinePaths[i].remove()
              textPath = u
            } catch { /* keep going */ }
          }
          textPath.fillColor = FILL

          // --- LETTER THICKNESS EXPANSION ---
          // Inflate outer contours outward & shrink inner holes inward
          // giving the effect of thicker / bolder letter strokes.
          const expansion = state.letterExpansion || 0
          if (expansion > 0 && textPath.className === 'CompoundPath' && textPath.children) {
            textPath.children.forEach((child) => {
              if (child.className !== 'Path') return
              const isOuter = child.clockwise
              const center = child.bounds.center
              const avg = (child.bounds.width + child.bounds.height) / 2
              if (avg < 2) return
              const factor = isOuter
                ? (avg + expansion * 2) / avg
                : Math.max(0.05, (avg - expansion * 2) / avg)
              child.scale(factor, center)
            })
          } else if (expansion > 0 && textPath.className === 'Path') {
            const avg = (textPath.bounds.width + textPath.bounds.height) / 2
            if (avg >= 2) textPath.scale((avg + expansion * 2) / avg, textPath.bounds.center)
          }

          textBounds = textPath.bounds.clone()
        }
      } else if (text && !loadedFont) {
        // Fallback: show PointText while font loads
        const mc = document.createElement('canvas')
        const ctx = mc.getContext('2d')
        ctx.font = `${state.fontWeight} ${state.fontSize}px ${state.fontFamily}`
        const measured = ctx.measureText(text)
        const tw = measured.width

        const pt = new scope.PointText(new scope.Point(centerX - tw / 2, centerY))
        pt.content = text
        pt.fontFamily = state.fontFamily
        pt.fontWeight = state.fontWeight
        pt.fontSize = state.fontSize
        pt.fillColor = new scope.Color('#cbd5e1')

        const loadingText = new scope.PointText(new scope.Point(centerX, centerY + state.fontSize + 12))
        loadingText.content = 'Loading font outlines…'
        loadingText.fontSize = 11
        loadingText.justification = 'center'
        loadingText.fillColor = new scope.Color('#94a3b8')
      }

      // --- CONNECTION: BASELINE BAR / BACKING SHAPE ---
      let baselinePath = null
      const isArced = (state.arcAmount || 0) !== 0
      const connType = state.connectionType || 'baseline'

      // ── Backing shape (circle / rectangle / diamond) ──────────────────────
      // These act as FOOTER CONNECTORS — positioned at the bottom of the text,
      // overlapping just enough to weld onto the letters. Sticks attach below.
      if (connType !== 'baseline' && connType !== 'none' && textBounds) {
        const pad = state.baseShapePadding || 20
        const cx = textBounds.center.x
        const overlapY = textBounds.height * 0.28       // how deep into text the shape overlaps
        const shapeTop = textBounds.bottom - overlapY + (state.baselineOffset || -8)
        // Width spans full text width + side padding
        const shapeHW = textBounds.width / 2 + pad      // half-width
        // Height = padding-driven: small pad → thin bar-like, large pad → taller shape
        const shapeHH = Math.max(20, pad * 1.2)         // half-height
        let shapePath = null

        if (connType === 'circle') {
          // Oval/ellipse footer
          shapePath = new scope.Path.Ellipse(
            new scope.Rectangle(cx - shapeHW, shapeTop, shapeHW * 2, shapeHH * 2)
          )
        } else if (connType === 'rectangle') {
          shapePath = new scope.Path.Rectangle(
            new scope.Rectangle(cx - shapeHW, shapeTop, shapeHW * 2, shapeHH * 2),
            new scope.Size(8, 8)
          )
        } else if (connType === 'diamond') {
          const shapeCY = shapeTop + shapeHH
          shapePath = new scope.Path({
            segments: [
              [cx,           shapeTop],
              [cx + shapeHW, shapeCY],
              [cx,           shapeTop + shapeHH * 2],
              [cx - shapeHW, shapeCY],
            ],
            closed: true,
          })
        }

        if (shapePath) {
          shapePath.fillColor = FILL
          if (textPath) {
            try {
              const u = textPath.unite(shapePath)
              textPath.remove(); shapePath.remove()
              textPath = u
              textPath.fillColor = FILL
              textBounds = textPath.bounds.clone()
            } catch { shapePath.remove() }
          } else {
            textPath = shapePath
            textBounds = shapePath.bounds.clone()
          }
        }
      }

      // ── Baseline bar ──────────────────────────────────────────────────────
      if (connType === 'baseline' && textBounds) {
        const barHeight = state.baselineHeight
        const overlapAmount = textBounds.height * 0.30

        if (isArced) {
          const arc = state.arcAmount
          const archesUp = arc > 0
          const metrics = getTextMetrics(loadedFont, state.text.trim().split('\n')[0], state.fontSize, state.letterSpacing)
          const totalWidth = metrics.width
          const arcHeight = (Math.abs(arc) / 100) * totalWidth * 0.35
          const R = (totalWidth * totalWidth + 4 * arcHeight * arcHeight) / (8 * arcHeight)
          const halfAngle = Math.asin(totalWidth / (2 * R))
          const cx = centerX
          const cy = archesUp ? (centerY + (R - arcHeight)) : (centerY - (R - arcHeight))
          const rOuter = R - overlapAmount + state.baselineOffset
          const rInner = rOuter + Math.max(barHeight, 12) // arc bar at least 12px thick
          const angPad = halfAngle * 0.05
          const a0 = -halfAngle - angPad
          const a1 = halfAngle + angPad
          const steps = 48
          const outerPts = []
          const innerPts = []
          for (let i = 0; i <= steps; i++) {
            const a = a0 + (a1 - a0) * (i / steps)
            const rA = archesUp ? rOuter : rInner
            const rB = archesUp ? rInner : rOuter
            const sinA = Math.sin(a)
            const cosA = Math.cos(a)
            outerPts.push([cx + rA * sinA, archesUp ? cy - rA * cosA : cy + rA * cosA])
            innerPts.push([cx + rB * sinA, archesUp ? cy - rB * cosA : cy + rB * cosA])
          }
          baselinePath = new scope.Path({
            segments: [...outerPts, ...innerPts.reverse()],
            closed: true,
          })
          baselinePath.fillColor = FILL
        } else {
          const barY = textBounds.bottom - overlapAmount + state.baselineOffset
          // Tight overhang: just enough to extend past the text edge for a clean look
          const overhang = Math.max(6, barHeight * 0.6)
          // Pill-shaped ends (fully rounded) — elegant, not blocky
          const radius = barHeight / 2
          baselinePath = new scope.Path.Rectangle(
            new scope.Rectangle(
              textBounds.left - overhang,
              barY,
              textBounds.width + overhang * 2,
              barHeight
            ),
            new scope.Size(radius, radius)
          )
          baselinePath.fillColor = FILL
        }

        if (textPath) {
          try {
            const united = textPath.unite(baselinePath)
            textPath.remove()
            baselinePath.remove()
            textPath = united
            textPath.fillColor = FILL
            textBounds = textPath.bounds.clone()
            baselinePath = null
          } catch {
            // Keep them separate if union fails
          }
        }
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
          p.fillColor = FILL
          assetPaths.push({ path: p, id: asset.id })
        } catch { /* skip bad paths */ }
      })

      // --- WELD ASSETS TO TEXT ---
      if (textPath) {
        for (const ap of assetPaths) {
          if (textPath.bounds.intersects(ap.path.bounds) ||
              textPath.bounds.expand(10).intersects(ap.path.bounds)) {
            try {
              if (!textPath.bounds.intersects(ap.path.bounds)) {
                const bridgeX = (textPath.bounds.center.x + ap.path.bounds.center.x) / 2
                const bridgeY = Math.min(textPath.bounds.bottom, ap.path.bounds.bottom)
                const bridge = new scope.Path.Rectangle(
                  new scope.Rectangle(bridgeX - 2, bridgeY - 4, 4, 8)
                )
                bridge.fillColor = FILL
                const temp = textPath.unite(bridge)
                textPath.remove()
                bridge.remove()
                textPath = temp
              }
              const united = textPath.unite(ap.path)
              textPath.remove()
              ap.path.remove()
              textPath = united
              textPath.fillColor = FILL
            } catch {
              // Keep separate if union fails
            }
          }
        }
        textBounds = textPath.bounds.clone()
      }

      // --- SUPPORT STICKS ---
      let bottomY = textBounds ? textBounds.bottom : centerY + 30
      let leftX = textBounds ? textBounds.left : centerX - 100
      let rightX = textBounds ? textBounds.right : centerX + 100
      const spanW = rightX - leftX

      function makeStick(xPct, yOff = 0) {
        const sx = leftX + (xPct / 100) * spanW
        const hw = state.stickWidth / 2
        const overlapDepth = connType === 'none' ? 0 : Math.max(8, state.baselineHeight * 2)
        const stickTop = bottomY - overlapDepth + yOff

        if (state.stickTip === 'pointed') {
          const bH = state.stickLength * 0.75
          const body = new scope.Path.Rectangle(new scope.Rectangle(sx - hw, stickTop, state.stickWidth, bH))
          body.fillColor = FILL
          const tri = new scope.Path({
            segments: [[sx - hw, stickTop + bH], [sx, stickTop + state.stickLength], [sx + hw, stickTop + bH]],
            closed: true,
          })
          tri.fillColor = FILL
          try { const u = body.unite(tri); body.remove(); tri.remove(); u.fillColor = FILL; return u }
          catch { tri.remove(); return body }
        } else if (state.stickTip === 'rounded') {
          const body = new scope.Path.Rectangle(new scope.Rectangle(sx - hw, stickTop, state.stickWidth, state.stickLength - hw))
          body.fillColor = FILL
          const circ = new scope.Path.Circle(new scope.Point(sx, stickTop + state.stickLength - hw), hw)
          circ.fillColor = FILL
          try { const u = body.unite(circ); body.remove(); circ.remove(); u.fillColor = FILL; return u }
          catch { circ.remove(); return body }
        } else {
          const r = new scope.Path.Rectangle(new scope.Rectangle(sx - hw, stickTop, state.stickWidth, state.stickLength))
          r.fillColor = FILL
          return r
        }
      }

      const stickPaths = []
      if (state.stickCount >= 1) stickPaths.push(makeStick(state.stick1X, state.stick1Y || 0))
      if (state.stickCount === 2) stickPaths.push(makeStick(state.stick2X, state.stick2Y || 0))

      // Persist layout so stick-drag handles can map x% ↔ canvas px
      stickLayoutRef.current = { leftX, spanW, bottomY }
      const newHandlePos = []
      if (state.stickCount >= 1) {
        newHandlePos.push({ id: 's1', x: leftX + (state.stick1X / 100) * spanW, y: bottomY })
      }
      if (state.stickCount === 2) {
        newHandlePos.push({ id: 's2', x: leftX + (state.stick2X / 100) * spanW, y: bottomY })
      }
      setTimeout(() => setStickHandlePos(newHandlePos), 0)

      // --- FINAL BOOLEAN UNION ---
      let finalPath = textPath
      const toUnion = [...stickPaths]
      assetPaths.forEach((ap) => { if (!ap.path.removed) toUnion.push(ap.path) })
      if (baselinePath && !baselinePath.removed) toUnion.push(baselinePath)

      for (const p of toUnion) {
        if (finalPath) {
          try {
            const u = finalPath.unite(p)
            finalPath.remove()
            p.remove()
            finalPath = u
          } catch {
            // Keep trying
          }
        } else {
          finalPath = p
        }
      }

      if (finalPath) {
        finalPath.fillColor = FILL
        // nonzero prevents evenodd "white holes" where paths overlap
        // (e.g. icon placed on letter, or letter expansion touching adjacent letter)
        finalPath.fillRule = 'nonzero'

        // --- AUTO-BRIDGE DISCONNECTED PARTS ---
        // Bridges need to be ≥ 6px (~1.9mm at 10") to survive cutting.
        // Track max bridge distance: small gaps (< 15px) are just letter-curve
        // micro-gaps and fine; large gaps (≥ 15px) produce dangerously thin bridges.
        let autoBridgesAdded = 0
        let maxBridgeDist = 0

        if (finalPath.className === 'CompoundPath' && finalPath.children) {
          let needsBridging = true
          let bridgeAttempts = 0
          const MAX_BRIDGE_ATTEMPTS = 30
          // Minimum bridge width: 4px ≈ 1.3mm at 10" output — hairline but survivable
          const MIN_BRIDGE_PX = 4

          while (needsBridging && bridgeAttempts < MAX_BRIDGE_ATTEMPTS) {
            bridgeAttempts++
            needsBridging = false

            if (finalPath.className !== 'CompoundPath' || !finalPath.children) break

            const outerContours = finalPath.children.filter(c => c.clockwise)
            if (outerContours.length <= 1) break

            const mainBody = outerContours.reduce((a, b) => a.bounds.area > b.bounds.area ? a : b)

            for (const contour of outerContours) {
              if (contour === mainBody) continue

              const detachedCenter = contour.bounds.center
              const mainNearest = mainBody.getNearestPoint(detachedCenter)
              const contourNearest = contour.getNearestPoint(mainNearest)

              const dx = mainNearest.x - contourNearest.x
              const dy = mainNearest.y - contourNearest.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              // Keep bridges thin — max 6px so micro-bridges don't create visible blocks
              const bridgeWidth = Math.max(MIN_BRIDGE_PX, Math.min(6, contour.bounds.width * 0.2))

              let bridge
              if (dist < 1) {
                // Nearly-touching: just a tiny 4×4 dot to nudge the union
                const bx = (contourNearest.x + mainNearest.x) / 2
                const by = (contourNearest.y + mainNearest.y) / 2
                bridge = new scope.Path.Rectangle(
                  new scope.Rectangle(bx - 2, by - 2, 4, 4)
                )
              } else {
                const nx = -dy / dist * bridgeWidth / 2
                const ny = dx / dist * bridgeWidth / 2
                bridge = new scope.Path({
                  segments: [
                    [contourNearest.x - nx, contourNearest.y - ny],
                    [contourNearest.x + nx, contourNearest.y + ny],
                    [mainNearest.x + nx, mainNearest.y + ny],
                    [mainNearest.x - nx, mainNearest.y - ny],
                  ],
                  closed: true,
                })
              }
              bridge.fillColor = FILL

              try {
                const united = finalPath.unite(bridge)
                finalPath.remove()
                bridge.remove()
                finalPath = united
                finalPath.fillColor = FILL
                finalPath.fillRule = 'nonzero'
                autoBridgesAdded++
                if (dist > maxBridgeDist) maxBridgeDist = dist
                needsBridging = true
                break
              } catch {
                bridge.remove()
              }
            }
          }
        }

        finalPath.name = 'final-design'

        // Check connectivity
        let connected = true
        if (finalPath.className === 'CompoundPath' && finalPath.children) {
          const outerContours = finalPath.children.filter(c => c.clockwise)
          if (outerContours.length > 1) connected = false
        }

        if (!connected) {
          finalPath.strokeColor = WARN
          finalPath.strokeWidth = 2
          finalPath.dashArray = [8, 4]
        }

        // --- CUT SAFETY WARNINGS ---
        // Physical scale: at 10" output, CANVAS_W px spans 254mm
        const mmPerPx = (state.outputWidthInches * 25.4) / CANVAS_W
        const MIN_SAFE_MM = 1.5  // 1.5mm minimum for acrylic/wood cutting
        const newWarnings = []

        if (connType === 'baseline' && state.baselineHeight * mmPerPx < MIN_SAFE_MM) {
          newWarnings.push(`Baseline bar is ${(state.baselineHeight * mmPerPx).toFixed(1)}mm — minimum safe width is ${MIN_SAFE_MM}mm`)
        }
        if (state.stickCount > 0 && state.stickWidth * mmPerPx < MIN_SAFE_MM) {
          newWarnings.push(`Sticks are ${(state.stickWidth * mmPerPx).toFixed(1)}mm wide — may snap during cutting`)
        }
        if (autoBridgesAdded > 0 && maxBridgeDist >= 15) {
          const isMultiLine = text.split('\n').filter(l => l.length > 0).length > 1
          const bridgeHint = isMultiLine && connType === 'baseline'
            ? 'Lines not touching — reduce Line Height (Text tab) or switch to a Shape connector'
            : `${autoBridgesAdded} thin auto-bridge${autoBridgesAdded > 1 ? 's' : ''} added — enable a Bar or Shape connector for stronger joints`
          newWarnings.push(bridgeHint)
        }

        if (connectedRef.current !== connected) {
          connectedRef.current = connected
          setTimeout(() => storeRef.current.update({ isConnected: connected }), 0)
        }
        setTimeout(() => setCutWarnings(newWarnings), 0)
      }

      // --- SELECTION INDICATOR ---
      if (state.selectedAssetId) {
        const asset = state.placedAssets.find((a) => a.id === state.selectedAssetId)
        if (asset) {
          const r = new scope.Path.Rectangle(
            new scope.Rectangle(
              centerX + asset.x - 50 * asset.scale,
              centerY + asset.y - 50 * asset.scale,
              100 * asset.scale, 100 * asset.scale
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

  // --- DRAG ASSETS ---

  const handleMouseDown = useCallback((e) => {
    const pt = getCanvasPoint(e)
    const s = storeRef.current.state
    const cx = CANVAS_W / 2 + s.textX
    const cy = CANVAS_H * 0.32 + s.textY
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

  const handleStickMouseDown = useCallback((e, handleId) => {
    e.preventDefault()
    e.stopPropagation()
    const pt = getCanvasPoint(e)
    const s = storeRef.current.state
    const origPct = handleId === 's1' ? s.stick1X : s.stick2X
    stickDragRef.current = { active: true, id: handleId, startX: pt.x, origPct }
  }, [getCanvasPoint])

  const handleMouseMove = useCallback((e) => {
    // Stick handle drag
    if (stickDragRef.current.active) {
      const pt = getCanvasPoint(e)
      const { id, startX, origPct } = stickDragRef.current
      const { spanW } = stickLayoutRef.current
      if (spanW > 0) {
        const deltaPct = ((pt.x - startX) / spanW) * 100
        const newPct = Math.round(Math.max(5, Math.min(95, origPct + deltaPct)))
        storeRef.current.update(id === 's1' ? { stick1X: newPct } : { stick2X: newPct })
      }
      return
    }
    // Asset drag
    if (!dragRef.current.active) return
    const pt = getCanvasPoint(e)
    storeRef.current.updateAsset(dragRef.current.assetId, {
      x: Math.round(dragRef.current.origX + pt.x - dragRef.current.startX),
      y: Math.round(dragRef.current.origY + pt.y - dragRef.current.startY),
    })
  }, [getCanvasPoint])

  const handleMouseUp = useCallback(() => {
    dragRef.current.active = false
    stickDragRef.current.active = false
  }, [])

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      const pt = getCanvasPoint(e)
      storeRef.current.addAsset(data, pt.x - CANVAS_W / 2, pt.y - CANVAS_H * 0.32)
    } catch { /* invalid */ }
  }, [getCanvasPoint])

  // --- EXPORT: Single-path SVG ---
  useImperativeHandle(ref, () => ({
    exportSVG: () => {
      const scope = scopeRef.current
      if (!scope) return
      scope.activate()
      const designLayer = scope.project.layers.find(l => l.name === 'design')
      if (!designLayer) return

      const finalDesign = designLayer.children.find(c => c.name === 'final-design')
      if (!finalDesign) return

      // ── Pre-export connectivity check ─────────────────────────────────────
      if (!connectedRef.current) {
        const proceed = window.confirm(
          '⚠️  Disconnected pieces detected!\n\n' +
          'Some parts of your design are not connected and will fall out when cut.\n\n' +
          'Tip: enable a Baseline Bar or Backing Shape (Structure tab) to join everything into one piece.\n\n' +
          'Export anyway?'
        )
        if (!proceed) return
      }

      const exportPath = finalDesign.clone()
      const bounds = exportPath.bounds
      const pad = 10
      const svgStr = exportPath.exportSVG({ asString: true })

      const w = bounds.width + pad * 2
      const h = bounds.height + pad * 2
      const targetWidthIn = storeRef.current.state.outputWidthInches || 10
      const mmPerPx = (targetWidthIn * 25.4) / bounds.width
      const widthMm = w * mmPerPx
      const heightMm = h * mmPerPx
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="${bounds.x - pad} ${bounds.y - pad} ${w} ${h}"
     width="${widthMm.toFixed(2)}mm" height="${heightMm.toFixed(2)}mm"
     fill="#000000" stroke="none">
  ${svgStr}
</svg>`

      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cake-topper-${Date.now()}.svg`
      a.click()
      URL.revokeObjectURL(url)
      exportPath.remove()
    },
    checkConnections: () => {
      storeRef.current.update({ isConnected: connectedRef.current })
    },

    autoFit: () => {
      const s = storeRef.current.state
      const font = loadedFont
      if (!font || !s.text.trim()) return

      const lines = s.text.trim().split('\n').filter(l => l.length > 0)
      const isMultiLine = lines.length > 1

      // ── 1. Ideal font size ─────────────────────────────────────────────────
      // For multi-line, each line targets 65% of canvas width — leaves breathing
      // room and keeps the design from feeling cramped once lines are touching.
      // Single-line can fill 74%.
      const TARGET_W = CANVAS_W * (isMultiLine ? 0.65 : 0.74)
      const REF_SIZE = 100
      const letterSpacing = Math.max(-2, Math.min(8, s.letterSpacing))
      const widths = lines.map(l => getTextMetrics(font, l, REF_SIZE, letterSpacing).width)
      const maxW = Math.max(...widths.filter(Boolean))
      let fontSize = s.fontSize
      if (maxW > 0) {
        fontSize = Math.round((TARGET_W / maxW) * REF_SIZE)
        fontSize = Math.max(40, Math.min(200, fontSize))
      }

      // ── 2. Line height from actual font metrics ────────────────────────────
      // Geometry: baseline of line N = centerY + N × (fontSize × lineHeight)
      //   visual bottom of line 0 = centerY + descVisRatio × fontSize
      //   visual top    of line 1 = centerY + lineHeight × fontSize - capRatio × fontSize
      //
      // For OVERLAP pixels of overlap:
      //   descVisRatio × fontSize ≥ lineHeight × fontSize - capRatio × fontSize + OVERLAP
      //   → lineHeight ≤ capRatio + descVisRatio - OVERLAP / fontSize   ← MINUS, not plus
      //
      // Safety cap at 0.75: even if font metrics suggest wider spacing,
      // multi-line cake toppers always look better with tight touching lines.
      let lineHeight = 1.05
      if (isMultiLine) {
        const upm = font.unitsPerEm || 1000
        const ascRatio     = (font.ascender  || upm * 0.8)        / upm
        const dscRatio     = Math.abs(font.descender || upm * 0.2) / upm
        const capRatio     = ascRatio * 0.70   // cap height ≈ 70% of ascender
        const descVisRatio = dscRatio * 0.65   // visible descenders ≈ 65% of metric
        const OVERLAP_PX   = 14               // guaranteed px of visual overlap
        const computed     = capRatio + descVisRatio - OVERLAP_PX / fontSize
        lineHeight = Math.max(0.52, Math.min(0.75, computed))
      }

      // ── 3. Bar proportions ─────────────────────────────────────────────────
      const barHeight = Math.max(10, Math.round(fontSize * 0.10))
      const barOffset = -Math.round(barHeight * 0.55)   // bite just over half-bar

      // ── 4. Shape padding (circle / rect / diamond connectors) ─────────────
      const shapePadding = Math.max(12, Math.round(fontSize * 0.18))

      // ── 5. Sticks — symmetric, scale with font size ────────────────────────
      const stick1X    = s.stickCount === 1 ? 50 : 22
      const stick2X    = 78
      const stickWidth = Math.max(10, Math.round(fontSize * 0.13))
      const stickLength = Math.max(220, Math.min(360, Math.round(fontSize * 2.4)))

      storeRef.current.update({
        fontSize,
        lineHeight,
        letterSpacing,
        textX: 0,
        textY: 0,
        baselineHeight: barHeight,
        baselineOffset: barOffset,
        baseShapePadding: shapePadding,
        stick1X,
        stick2X,
        stick1Y: 0,
        stick2Y: 0,
        stickWidth,
        stickLength,
      })
    },
  }))

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 flex items-center justify-center bg-[#f0f2f7] overflow-auto p-5"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Canvas wrapper — fixed coordinate space, scrollable on small viewports */}
      <div
        className="relative rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden flex-shrink-0"
        style={{ width: CANVAS_W, height: CANVAS_H }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="cursor-crosshair"
          onMouseDown={handleMouseDown}
        />

        {fontLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-violet-100 text-violet-700 text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
            Loading font outlines…
          </div>
        )}

        {/* Disconnection hint — contextual based on connection mode */}
        {!store.state.isConnected && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-[11px] text-red-700 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {store.state.connectionType === 'none'
              ? 'Pieces floating — try ↑ Letter Spacing or enable a connector in Structure'
              : 'Parts disconnected — widen the connector or adjust spacing'}
          </div>
        )}

        {/* Cut-safety warnings */}
        {cutWarnings.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 max-w-[260px]">
            {cutWarnings.map((w, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 text-[10px] text-amber-700 flex items-start gap-1.5 shadow-sm leading-tight">
                <svg className="flex-shrink-0 mt-px" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                {w}
              </div>
            ))}
          </div>
        )}

        {/* Stick drag handles — draggable circles that reposition each stick */}
        {stickHandlePos.map((h) => (
          <div
            key={h.id}
            className="absolute z-10 cursor-ew-resize select-none"
            style={{ left: h.x - 10, top: h.y - 10, width: 20, height: 20 }}
            onMouseDown={(e) => handleStickMouseDown(e, h.id)}
          >
            {/* Outer ring */}
            <div className="w-5 h-5 rounded-full bg-amber-400/70 border-2 border-white shadow-lg flex items-center justify-center">
              {/* Inner dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        ))}

        <CanvasDimensions store={store} />

        <div className="absolute top-3 right-3 text-[10px] text-gray-400 bg-white/90 px-2 py-0.5 rounded-full border border-gray-100">
          Drag assets · drag ● to move sticks
        </div>
      </div>
    </div>
  )
})

function CanvasDimensions({ store }) {
  const { state } = store
  const [dims, setDims] = useState(null)

  useEffect(() => {
    let raf
    const tick = () => {
      const scope = window.__paperScope
      if (scope && scope.project) {
        const designLayer = scope.project.layers.find((l) => l.name === 'design')
        const final = designLayer && designLayer.children.find((c) => c.name === 'final-design')
        if (final) {
          const px = final.bounds
          const inPerPx = state.outputWidthInches / px.width
          const widthIn = state.outputWidthInches
          const heightIn = px.height * inPerPx
          setDims({ widthIn, heightIn, widthMm: widthIn * 25.4, heightMm: heightIn * 25.4 })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state.outputWidthInches])

  return (
    <div className="absolute bottom-3 left-3 flex items-center gap-2">
      <div className="text-[10px] text-gray-600 bg-white/95 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium tabular-nums shadow-sm">
        {dims ? (
          <>
            <span className="text-violet-600 font-semibold">Cut size:</span>{' '}
            {dims.widthIn.toFixed(2)}″ × {dims.heightIn.toFixed(2)}″{' '}
            <span className="text-gray-400">({Math.round(dims.widthMm)}×{Math.round(dims.heightMm)}mm)</span>
          </>
        ) : (
          <span className="text-gray-400">Measuring…</span>
        )}
      </div>
      <label className="text-[10px] bg-white/95 border border-gray-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1 shadow-sm">
        <span className="text-gray-500">Width:</span>
        <input
          type="number"
          min={2}
          max={36}
          step={0.5}
          value={state.outputWidthInches}
          onChange={(e) => store.update({ outputWidthInches: parseFloat(e.target.value) || 10 })}
          className="w-10 text-xs text-gray-800 outline-none bg-transparent"
        />
        <span className="text-gray-400">in</span>
      </label>
    </div>
  )
}

export { Canvas }
