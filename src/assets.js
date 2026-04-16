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
        // Classic 4-toe paw print — each sub-shape is a clean solid oval, no overlaps
        id: 'paw-print',
        name: 'Paw Print',
        pathData: 'M9,38 A11,13 0 1,1 31,38 A11,13 0 1,1 9,38 Z M27,26 A11,13 0 1,1 49,26 A11,13 0 1,1 27,26 Z M51,26 A11,13 0 1,1 73,26 A11,13 0 1,1 51,26 Z M69,38 A11,13 0 1,1 91,38 A11,13 0 1,1 69,38 Z M26,68 A24,18 0 1,1 74,68 A24,18 0 1,1 26,68 Z',
        viewBox: '0 0 100 90',
      },
      {
        // Dog bone — four knob circles + center bar, all solid
        id: 'bone',
        name: 'Dog Bone',
        pathData: 'M12,7 A11,11 0 1,1 12,29 A11,11 0 1,1 12,7 Z M12,41 A11,11 0 1,1 12,63 A11,11 0 1,1 12,41 Z M88,7 A11,11 0 1,1 88,29 A11,11 0 1,1 88,7 Z M88,41 A11,11 0 1,1 88,63 A11,11 0 1,1 88,41 Z M23,25 L77,25 L77,45 L23,45 Z',
        viewBox: '0 0 100 70',
      },
      {
        // Solid fish silhouette — body + crescent tail, one clean outline
        id: 'fish',
        name: 'Fish',
        pathData: 'M5,35 C5,15 25,5 50,5 C70,5 83,17 83,30 L100,15 L100,55 L83,40 C83,53 70,65 50,65 C25,65 5,55 5,35 Z',
        viewBox: '0 0 105 70',
      },
      {
        // Cat sitting — pointed ears, round head, body, front paws
        id: 'cat-silhouette',
        name: 'Cat',
        pathData: 'M30,22 L22,4 L42,16 Z M70,22 L78,4 L58,16 Z M50,16 A22,22 0 1,1 50,60 A22,22 0 1,1 50,16 Z M22,60 C14,60 8,68 8,78 C8,90 18,97 50,97 C82,97 92,90 92,78 C92,68 86,60 78,60 C72,55 62,52 50,52 C38,52 28,55 22,60 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Dog — classic side profile: floppy ear, body, tail, four legs
        id: 'dog-silhouette',
        name: 'Dog',
        pathData: 'M18,18 C12,10 4,12 4,22 C4,32 12,34 20,30 C24,36 24,44 22,52 L10,52 L10,64 L24,64 L24,54 C28,58 36,60 50,60 L50,64 L38,64 L38,76 L52,76 L52,64 L62,64 L62,76 L76,76 L76,60 C84,56 90,48 90,38 C92,30 88,22 80,20 C74,18 68,24 66,30 C60,26 52,24 40,24 C32,24 24,26 20,30 C20,26 20,20 18,18 Z',
        viewBox: '0 0 96 80',
      },
      {
        // Bird in flight — clean swept-wing silhouette
        id: 'bird',
        name: 'Bird',
        pathData: 'M50,28 C38,16 18,12 5,20 C18,24 28,32 32,40 C26,38 16,36 8,38 C18,44 30,44 36,42 C40,50 46,54 50,55 C54,54 60,50 64,42 C70,44 82,44 92,38 C84,36 74,38 68,40 C72,32 82,24 95,20 C82,12 62,16 50,28 Z',
        viewBox: '0 0 100 60',
      },
      {
        // Butterfly — symmetrical upper and lower wings, body
        id: 'butterfly',
        name: 'Butterfly',
        pathData: 'M50,20 C42,10 22,6 10,14 C2,22 8,38 20,42 C30,46 44,40 50,32 C56,40 70,46 80,42 C92,38 98,22 90,14 C78,6 58,10 50,20 Z M50,32 C46,44 44,60 46,74 C48,80 52,80 54,74 C56,60 54,44 50,32 Z M50,20 C46,28 44,36 46,42 M50,20 C54,28 56,36 54,42',
        viewBox: '0 0 100 82',
      },
    ],
  },
}

export const ALL_ASSETS = [
  ...ASSET_CATEGORIES.celebration.assets,
  ...ASSET_CATEGORIES.pets.assets,
]
