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
        pathData: 'M50,95 C35,85 15,72 15,55 C15,44 23,36 33,36 C39,36 44,39 50,45 C56,39 61,36 67,36 C77,36 85,44 85,55 C85,72 65,85 50,95 Z M22,28 C16,28 11,22 11,15 C11,8 16,3 22,3 C28,3 33,8 33,15 C33,22 28,28 22,28 Z M42,18 C37,18 33,14 33,9 C33,4 37,0 42,0 C47,0 51,4 51,9 C51,14 47,18 42,18 Z M58,18 C53,18 49,14 49,9 C49,4 53,0 58,0 C63,0 67,4 67,9 C67,14 63,18 58,18 Z M78,28 C72,28 67,22 67,15 C67,8 72,3 78,3 C84,3 89,8 89,15 C89,22 84,28 78,28 Z',
        viewBox: '0 0 100 98',
      },
      {
        // Classic dog bone: two rounded knob ends + rectangular shaft
        id: 'bone',
        name: 'Dog Bone',
        pathData: 'M25,50 C25,61 16,70 5,70 C-6,70 -6,50 5,50 C5,40 -6,30 5,30 C16,30 25,39 25,50 Z M75,50 C75,61 84,70 95,70 C106,70 106,50 95,50 C95,40 106,30 95,30 C84,30 75,39 75,50 Z M25,42 L75,42 L75,58 L25,58 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Clean fish silhouette facing right — oval body, fan tail, eye dot
        id: 'fish',
        name: 'Fish',
        pathData: 'M60,10 C85,10 100,25 100,40 C100,55 85,70 60,70 C40,70 22,62 15,50 L0,62 L0,18 L15,30 C22,18 40,10 60,10 Z M60,35 C63,35 65,37 65,40 C65,43 63,45 60,45 C57,45 55,43 55,40 C55,37 57,35 60,35 Z',
        viewBox: '0 0 102 80',
      },
      {
        // Cat sitting silhouette: triangular ears, round head, compact body with paws
        id: 'cat-silhouette',
        name: 'Cat',
        pathData: 'M35,30 L28,8 L48,22 C44,18 50,15 56,18 L72,8 L65,30 C70,34 74,40 74,48 C74,64 63,76 50,76 C37,76 26,64 26,48 C26,40 30,34 35,30 Z M50,76 C38,76 30,80 26,86 L26,96 L74,96 L74,86 C70,80 62,76 50,76 Z M50,76 L44,96 M50,76 L56,96',
        viewBox: '0 0 100 100',
      },
      {
        // Dog sitting silhouette: round head, floppy ear, oval body, stubby legs
        id: 'dog-silhouette',
        name: 'Dog',
        pathData: 'M62,8 C74,8 84,18 84,30 C84,38 80,44 74,48 C80,52 84,60 84,68 C84,80 76,88 62,90 L62,100 L55,100 L55,90 C52,90 48,90 45,90 L45,100 L38,100 L38,90 C24,88 16,80 16,68 C16,60 20,52 26,48 C20,44 16,38 16,30 C16,18 26,8 38,8 C34,4 42,0 50,2 C58,0 66,4 62,8 Z M36,22 C32,22 28,26 32,30 C38,32 44,28 44,24 C44,20 40,20 36,22 Z',
        viewBox: '0 0 100 104',
      },
      {
        // Bird on branch: round body, wing, tail, head with beak
        id: 'bird',
        name: 'Bird',
        pathData: 'M55,15 C68,15 80,24 80,38 C80,46 76,53 70,57 L82,65 L60,62 C58,63 56,63 54,63 C40,63 28,52 28,38 C28,24 40,15 55,15 Z M28,38 C20,34 8,36 2,42 C10,44 20,42 26,46 Z M55,10 C58,4 64,2 68,6 C64,8 60,12 58,16 Z',
        viewBox: '0 0 88 68',
      },
      {
        // Butterfly: top wings + bottom wings + body — classic symmetrical clipart
        id: 'butterfly',
        name: 'Butterfly',
        pathData: 'M50,38 C44,26 26,10 10,12 C2,18 4,34 14,42 C24,50 40,46 50,38 Z M50,38 C56,26 74,10 90,12 C98,18 96,34 86,42 C76,50 60,46 50,38 Z M50,38 C44,50 42,66 44,76 C46,82 54,82 56,76 C58,66 56,50 50,38 Z M50,38 C38,44 28,56 30,66 C32,72 38,72 46,66 Z M50,38 C62,44 72,56 70,66 C68,72 62,72 54,66 Z M47,20 C47,14 53,14 53,20 L53,38 L47,38 Z',
        viewBox: '0 0 100 86',
      },
    ],
  },
}

export const ALL_ASSETS = [
  ...ASSET_CATEGORIES.celebration.assets,
  ...ASSET_CATEGORIES.pets.assets,
]
