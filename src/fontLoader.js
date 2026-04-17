import opentype from 'opentype.js'

const fontCache = new Map()
const loadingPromises = new Map()

// Some Google Font names differ from their fontsource package names
const FONTSOURCE_NAME_MAP = {
  'fredoka one': 'fredoka-one',
  'lilita one': 'lilita-one',
  'luckiest guy': 'luckiest-guy',
  'concert one': 'concert-one',
  'fugaz one': 'fugaz-one',
  'carter one': 'carter-one',
  'titan one': 'titan-one',
  'passion one': 'passion-one',
  'playfair display': 'playfair-display',
  'great vibes': 'great-vibes',
  'dancing script': 'dancing-script',
}

function normalizeFontName(fontName) {
  const lower = fontName.toLowerCase()
  return FONTSOURCE_NAME_MAP[lower] || lower.replace(/ /g, '-')
}

/**
 * Load a Google Font as an opentype.js Font object via fontsource CDN (TTF format).
 */
export async function loadFont(fontName, weight = '400') {
  const cacheKey = `${fontName}-${weight}`

  // Return cached font immediately
  if (fontCache.has(cacheKey)) return fontCache.get(cacheKey)

  // Return in-flight promise if one exists
  if (loadingPromises.has(cacheKey)) return loadingPromises.get(cacheKey)

  const promise = (async () => {
    const normalizedName = normalizeFontName(fontName)
    const url = `https://cdn.jsdelivr.net/fontsource/fonts/${normalizedName}@latest/latin-${weight}-normal.ttf`

    try {
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`)
      const buf = await resp.arrayBuffer()
      const font = opentype.parse(buf)
      fontCache.set(cacheKey, font)
      return font
    } catch (err) {
      console.error(`Failed to load font "${fontName}" (${url}):`, err.message)
      return null
    } finally {
      loadingPromises.delete(cacheKey)
    }
  })()

  loadingPromises.set(cacheKey, promise)
  return promise
}

/**
 * Build per-glyph SVG path data + positioning info so callers can transform
 * individual glyphs (e.g. for arched text layout).
 * Returns { glyphs: [{ pathData, advance, x }], totalWidth }
 */
export function textToGlyphPaths(font, text, fontSize, letterSpacing) {
  if (!font || !text) return { glyphs: [], totalWidth: 0 }

  const scale = fontSize / font.unitsPerEm
  let x = 0
  const glyphs = []

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === ' ') {
      const spaceGlyph = font.charToGlyph(' ')
      const adv = (spaceGlyph.advanceWidth || font.unitsPerEm * 0.25) * scale
      glyphs.push({ pathData: '', advance: adv, x, char: ch })
      x += adv + letterSpacing
      continue
    }

    const glyph = font.charToGlyph(ch)
    if (!glyph || glyph.index === 0) {
      const adv = font.unitsPerEm * 0.5 * scale
      glyphs.push({ pathData: '', advance: adv, x, char: ch })
      x += adv + letterSpacing
      continue
    }

    // Draw glyph at local origin (0,0) so caller can transform it
    const path = glyph.getPath(0, 0, fontSize)
    const svgEl = path.toSVG()
    const dMatch = svgEl.match(/d="([^"]*)"/)
    const pathData = dMatch ? dMatch[1] : ''
    const advance = glyph.advanceWidth * scale

    glyphs.push({ pathData, advance, x, char: ch })
    x += advance + (i < text.length - 1 ? letterSpacing : 0)
  }

  return { glyphs, totalWidth: x }
}

/**
 * Convert text to SVG path data using opentype.js glyph outlines.
 * Returns real vector path data suitable for laser cutting.
 */
export function textToSvgPath(font, text, fontSize, x, y, letterSpacing) {
  if (!font || !text) return { pathData: '', width: 0 }

  const scale = fontSize / font.unitsPerEm
  let currentX = x
  let pathData = ''

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === ' ') {
      const spaceGlyph = font.charToGlyph(' ')
      currentX += (spaceGlyph.advanceWidth || font.unitsPerEm * 0.25) * scale + letterSpacing
      continue
    }

    const glyph = font.charToGlyph(ch)
    if (!glyph || glyph.index === 0) {
      currentX += font.unitsPerEm * 0.5 * scale + letterSpacing
      continue
    }

    const path = glyph.getPath(currentX, y, fontSize)
    const svgEl = path.toSVG()
    const dMatch = svgEl.match(/d="([^"]*)"/)
    if (dMatch) {
      pathData += dMatch[1] + ' '
    }

    currentX += glyph.advanceWidth * scale + (i < text.length - 1 ? letterSpacing : 0)
  }

  return { pathData: pathData.trim(), width: currentX - x }
}

/**
 * Get text metrics for centering and layout.
 */
export function getTextMetrics(font, text, fontSize, letterSpacing) {
  if (!font || !text) return { width: 0, ascent: 0, descent: 0, height: 0 }

  const scale = fontSize / font.unitsPerEm
  let width = 0

  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i])
    if (glyph) {
      width += glyph.advanceWidth * scale + (i < text.length - 1 ? letterSpacing : 0)
    }
  }

  return {
    width,
    ascent: font.ascender * scale,
    descent: Math.abs(font.descender * scale),
    height: (font.ascender - font.descender) * scale,
  }
}
