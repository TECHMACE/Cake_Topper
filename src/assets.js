// SVG path data for the asset library
// All paths are designed for clean cutting - solid shapes, no thin lines

export const ASSET_CATEGORIES = {
  celebration: {
    label: 'Celebration',
    icon: '🎉',
    assets: [
      {
        id: 'star-5',
        name: 'Star',
        path: 'M50,5 L61,35 L95,35 L68,55 L79,90 L50,70 L21,90 L32,55 L5,35 L39,35 Z',
        viewBox: '0 0 100 95',
      },
      {
        id: 'heart',
        name: 'Heart',
        path: 'M50,90 C25,70 0,50 0,30 C0,10 15,0 30,0 C40,0 48,5 50,15 C52,5 60,0 70,0 C85,0 100,10 100,30 C100,50 75,70 50,90 Z',
        viewBox: '0 0 100 92',
      },
      {
        id: 'rings',
        name: 'Wedding Rings',
        path: 'M35,50 C35,28 15,10 35,10 C48,10 58,20 58,35 M65,50 C65,28 85,10 65,10 C52,10 42,20 42,35 M35,10 A25,25 0 1,1 35,60 A25,25 0 1,1 35,10 M65,10 A25,25 0 1,1 65,60 A25,25 0 1,1 65,10',
        // Simplified rings as two overlapping circles with thick stroke
        svgMarkup: `<g><circle cx="33" cy="35" r="22" fill="none" stroke="black" stroke-width="8"/><circle cx="67" cy="35" r="22" fill="none" stroke="black" stroke-width="8"/></g>`,
        pathData: 'M33,13 A22,22 0 1,0 33,57 A22,22 0 1,0 33,13 Z M33,5 A30,30 0 1,1 33,65 A30,30 0 1,1 33,5 Z M67,13 A22,22 0 1,0 67,57 A22,22 0 1,0 67,13 Z M67,5 A30,30 0 1,1 67,65 A30,30 0 1,1 67,5 Z',
        viewBox: '0 0 100 70',
      },
      {
        id: 'champagne',
        name: 'Champagne Flute',
        path: 'M40,0 L60,0 L55,35 Q50,42 50,50 L50,80 L40,80 L40,50 Q40,42 35,35 Z M30,80 L60,80 L60,88 L30,88 Z',
        viewBox: '0 0 90 90',
      },
      {
        id: 'grad-cap',
        name: 'Graduation Cap',
        path: 'M50,10 L5,30 L50,50 L95,30 Z M20,35 L20,60 Q35,75 50,75 Q65,75 80,60 L80,35 L50,50 Z M85,30 L85,55 L88,55 L88,30 Z',
        viewBox: '0 0 100 80',
      },
      {
        id: 'banner',
        name: 'Banner',
        path: 'M10,15 L90,15 L90,55 L50,70 L10,55 Z M0,10 L15,10 L15,50 L0,40 Z M85,10 L100,10 L100,40 L85,50 Z',
        viewBox: '0 0 100 75',
      },
      {
        id: 'balloon',
        name: 'Balloon',
        path: 'M50,5 C20,5 5,25 5,45 C5,65 25,80 50,80 C75,80 95,65 95,45 C95,25 80,5 50,5 Z M48,80 L52,80 L55,90 L45,90 Z',
        viewBox: '0 0 100 95',
      },
      {
        id: 'crown',
        name: 'Crown',
        path: 'M10,70 L10,30 L30,50 L50,20 L70,50 L90,30 L90,70 Z M5,70 L95,70 L95,80 L5,80 Z',
        viewBox: '0 0 100 85',
      },
      {
        id: 'diamond',
        name: 'Diamond',
        path: 'M50,5 L90,35 L50,95 L10,35 Z M10,35 L90,35',
        viewBox: '0 0 100 100',
      },
      {
        id: 'number-1',
        name: 'Number 1',
        path: 'M30,15 L55,5 L55,80 L70,80 L70,90 L25,90 L25,80 L40,80 L40,22 L30,27 Z',
        viewBox: '0 0 100 95',
      },
    ],
  },
  pets: {
    label: 'Pets & Animals',
    icon: '🐾',
    assets: [
      {
        // Standard 4-pad paw print clipart: heart-shaped main pad + 4 toe ovals
        id: 'paw-print',
        name: 'Paw Print',
        pathData: 'M50,90 A20,20 0 1 1 50,50 A20,20 0 1 1 50,90 Z M25,45 A12,12 0 1 1 25,21 A12,12 0 1 1 25,45 Z M42,30 A12,12 0 1 1 42,6 A12,12 0 1 1 42,30 Z M58,30 A12,12 0 1 1 58,6 A12,12 0 1 1 58,30 Z M75,45 A12,12 0 1 1 75,21 A12,12 0 1 1 75,45 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Classic dog bone: two rounded knob ends + rectangular shaft
        id: 'bone',
        name: 'Dog Bone',
        pathData: 'M30,40 L70,40 L70,60 L30,60 Z M30,35 A15,15 0 1 0 30,65 A15,15 0 1 0 30,35 Z M70,35 A15,15 0 1 0 70,65 A15,15 0 1 0 70,35 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Clean fish silhouette facing right — oval body, fan tail, eye dot
        id: 'fish',
        name: 'Fish',
        pathData: 'M20,50 Q50,20 80,50 Q50,80 20,50 Z M80,50 L100,30 L100,70 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Cat sitting silhouette: triangular ears, round head, compact body with paws
        id: 'cat-silhouette',
        name: 'Cat',
        pathData: 'M40,50 A20,20 0 1 0 60,50 A20,20 0 1 0 40,50 Z M45,35 L30,10 L55,25 Z M55,35 L70,10 L45,25 Z M40,65 Q20,65 20,90 L80,90 Q80,65 60,65 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Dog sitting silhouette: round head, floppy ear, oval body, stubby legs
        id: 'dog-silhouette',
        name: 'Dog',
        pathData: 'M40,40 A20,20 0 1 0 60,40 A20,20 0 1 0 40,40 Z M30,30 Q10,50 30,70 Z M70,30 Q90,50 70,70 Z M35,55 Q20,80 35,90 L65,90 Q80,80 65,55 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Bird on branch: round body, wing, tail, head with beak
        id: 'bird',
        name: 'Bird',
        pathData: 'M40,50 A20,20 0 1 0 60,50 A20,20 0 1 0 40,50 Z M60,45 L80,50 L60,55 Z M40,55 Q20,80 40,70 Z M20,50 Q10,60 20,70 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Butterfly: top wings + bottom wings + body — classic symmetrical clipart
        id: 'butterfly',
        name: 'Butterfly',
        pathData: 'M50,40 Q20,10 20,40 Q20,70 50,60 Z M50,40 Q80,10 80,40 Q80,70 50,60 Z',
        viewBox: '0 0 100 100',
      },
    ],
  },
}

export const ALL_ASSETS = [
  ...ASSET_CATEGORIES.celebration.assets,
  ...ASSET_CATEGORIES.pets.assets,
]
