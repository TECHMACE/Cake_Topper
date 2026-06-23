#!/usr/bin/env node
// Run: node scripts/extract-icons.js icon-sources/
// Reads every .svg in the given folder and prints assets.js-ready snippets.

import fs from 'fs'
import path from 'path'

const dir = process.argv[2]
if (!dir) {
  console.error('Usage: node scripts/extract-icons.js <folder>')
  process.exit(1)
}

const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.svg'))
if (!files.length) {
  console.error('No .svg files found in', dir)
  process.exit(1)
}

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), 'utf8')
  const baseName = path.basename(file, '.svg')

  const viewBoxMatch = raw.match(/viewBox=["']([^"']+)["']/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100'

  // Collect all d= attributes from <path> elements
  const pathRegex = /<path[^>]+d=["']([^"']+)["'][^>]*>/gi
  const paths = []
  let m
  while ((m = pathRegex.exec(raw)) !== null) {
    paths.push(m[1].trim())
  }

  // Some SVGs put d= after other attrs — try alternate attr order
  if (!paths.length) {
    const altRegex = /\bd="([^"]+)"/gi
    while ((m = altRegex.exec(raw)) !== null) {
      paths.push(m[1].trim())
    }
  }

  if (!paths.length) {
    console.log(`// ⚠️  ${file}: no <path> elements found — may use <polygon> or <circle>, edit manually\n`)
    continue
  }

  const combined = paths.join(' ')

  // Derive a kebab-case id from filename
  const id = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const name = baseName.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  console.log(`      {
        id: '${id}',
        name: '${name}',
        path: '${combined}',
        viewBox: '${viewBox}',
      },`)
  console.log()
}
