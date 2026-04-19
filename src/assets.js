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
        // 5 separate ovals: large palm + 4 round toes. All within 0-100.
        id: 'paw-print',
        name: 'Paw Print',
        pathData: 'M28,75 A22,15 0 0,1 72,75 A22,15 0 0,1 28,75 Z M11,52 A9,9 0 0,1 29,52 A9,9 0 0,1 11,52 Z M28,42 A9,9 0 0,1 46,42 A9,9 0 0,1 28,42 Z M54,42 A9,9 0 0,1 72,42 A9,9 0 0,1 54,42 Z M71,52 A9,9 0 0,1 89,52 A9,9 0 0,1 71,52 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Classic dog bone: shaft + 2 round bumps on each end
        id: 'dog-bone',
        name: 'Dog Bone',
        pathData: 'M30,42 C22,32 6,34 6,50 C6,66 22,68 30,58 L70,58 C78,68 94,66 94,50 C94,34 78,32 70,42 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Dog face: round head with wide FLOPPY ears extending to the sides (not pointed up)
        id: 'dog-face',
        name: 'Dog',
        pathData: 'M50,10 C64,10 76,16 80,28 C86,22 96,26 96,40 C96,54 88,62 78,60 C80,70 80,82 72,88 C64,94 56,90 50,88 C44,90 36,94 28,88 C20,82 20,70 22,60 C12,62 4,54 4,40 C4,26 14,22 20,28 C24,16 36,10 50,10 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Cat face: round head with two POINTED triangular ears sticking straight up
        id: 'cat-face',
        name: 'Cat',
        pathData: 'M50,20 L76,4 L72,30 C84,32 94,42 94,56 C94,72 82,84 66,88 C60,92 56,92 50,92 C44,92 40,92 34,88 C18,84 6,72 6,56 C6,42 16,32 28,30 L24,4 Z',
        viewBox: '0 0 100 96',
      },
      {
        // Rabbit: connected silhouette with two very tall upright ears + round body
        id: 'rabbit',
        name: 'Rabbit',
        pathData: 'M38,8 C44,8 46,20 44,40 C47,38 53,38 56,40 C54,20 56,8 62,8 C68,8 70,18 70,28 C70,38 66,42 62,44 C72,52 78,64 78,76 C78,90 66,98 50,98 C34,98 22,90 22,76 C22,64 28,52 38,44 C34,42 30,38 30,28 C30,18 32,8 38,8 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Fish: oval body facing right, forked tail on the left
        id: 'fish',
        name: 'Fish',
        pathData: 'M62,18 C82,18 96,32 96,50 C96,68 82,82 62,82 C46,82 28,74 22,58 L4,70 L14,50 L4,30 L22,42 C28,26 46,18 62,18 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Bird: side-profile songbird facing right — round body, visible wing, beak tip at right
        id: 'bird-silhouette',
        name: 'Bird',
        pathData: 'M90,38 C86,26 76,18 64,22 C58,14 50,12 46,18 C50,24 52,30 50,34 C42,26 30,22 18,26 C8,30 4,42 6,54 C8,66 18,74 30,74 L14,88 L36,76 C48,82 62,80 72,70 C80,62 84,50 84,42 C88,42 92,40 90,38 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Butterfly: 4 curved wings meeting at center, symmetric
        id: 'butterfly',
        name: 'Butterfly',
        pathData: 'M50,44 C42,34 22,18 10,28 C2,36 8,52 22,56 C34,60 46,54 50,50 Z M50,44 C58,34 78,18 90,28 C98,36 92,52 78,56 C66,60 54,54 50,50 Z M50,50 C44,58 30,64 24,74 C18,84 26,92 36,88 C44,84 50,72 50,64 Z M50,50 C56,58 70,64 76,74 C82,84 74,92 64,88 C56,84 50,72 50,64 Z',
        viewBox: '0 0 100 96',
      },
      {
        // Horse head: side profile — long nose, eye, mane at top
        id: 'horse-head',
        name: 'Horse',
        pathData: 'M50,6 C60,6 70,10 74,20 C80,18 88,22 90,34 C88,44 80,50 72,52 C78,60 82,72 80,82 C78,90 70,94 62,90 C56,86 52,78 54,70 C46,68 36,70 28,64 C20,58 18,48 22,40 C26,28 34,18 42,18 C38,10 44,6 50,6 Z',
        viewBox: '0 0 100 100',
      },
    ],
  },
}

export const ALL_ASSETS = [
  ...ASSET_CATEGORIES.celebration.assets,
  ...ASSET_CATEGORIES.pets.assets,
]
