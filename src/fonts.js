// Curated font list for cake toppers - all loaded via Google Fonts
// Categorized by structural suitability for laser cutting

export const FONT_CATEGORIES = {
  bold: {
    label: 'Bold & Chunky',
    fonts: [
      { name: 'Fredoka One', family: '"Fredoka One", cursive' },
      { name: 'Lilita One', family: '"Lilita One", cursive' },
      { name: 'Bungee', family: '"Bungee", cursive' },
      { name: 'Luckiest Guy', family: '"Luckiest Guy", cursive' },
      { name: 'Bangers', family: '"Bangers", cursive' },
      { name: 'Chewy', family: '"Chewy", cursive' },
      { name: 'Concert One', family: '"Concert One", cursive' },
      { name: 'Fugaz One', family: '"Fugaz One", cursive' },
      { name: 'Carter One', family: '"Carter One", cursive' },
      { name: 'Titan One', family: '"Titan One", cursive' },
      { name: 'Righteous', family: '"Righteous", cursive' },
    ],
  },
  display: {
    label: 'Display & Elegant',
    fonts: [
      { name: 'Playfair Display', family: '"Playfair Display", serif', weight: '700' },
      { name: 'Passion One', family: '"Passion One", cursive', weight: '700' },
      { name: 'Lobster', family: '"Lobster", cursive' },
    ],
  },
  script: {
    label: 'Script & Cursive',
    fonts: [
      { name: 'Pacifico', family: '"Pacifico", cursive' },
      { name: 'Great Vibes', family: '"Great Vibes", cursive' },
      { name: 'Dancing Script', family: '"Dancing Script", cursive', weight: '700' },
      { name: 'Sacramento', family: '"Sacramento", cursive' },
    ],
  },
}

export const ALL_FONTS = [
  ...FONT_CATEGORIES.bold.fonts,
  ...FONT_CATEGORIES.display.fonts,
  ...FONT_CATEGORIES.script.fonts,
]

export const DEFAULT_FONT = FONT_CATEGORIES.bold.fonts[0]
