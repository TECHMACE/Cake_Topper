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
        id: 'bone',
        name: 'Dog Bone',
        path: 'M20,25 C15,15 5,15 5,25 C5,35 15,35 20,30 L80,30 C85,35 95,35 95,25 C95,15 85,15 80,25 Z M20,45 C15,55 5,55 5,45 C5,35 15,35 20,40 L80,40 C85,35 95,35 95,45 C95,55 85,55 80,45 Z M20,30 L20,40 M80,30 L80,40',
        // Cleaner bone path
        pathData: 'M18,20 Q5,10 5,25 Q5,38 18,35 L82,35 Q95,38 95,25 Q95,10 82,20 Z M18,50 Q5,60 5,45 Q5,32 18,35 L82,35 Q95,32 95,45 Q95,60 82,50 Z',
        viewBox: '0 0 100 70',
      },
      {
        id: 'paw-print',
        name: 'Paw Print',
        path: 'M50,55 Q35,40 30,50 Q25,60 35,65 Q45,70 50,60 Z M50,55 Q65,40 70,50 Q75,60 65,65 Q55,70 50,60 Z M50,60 Q45,75 50,85 Q55,75 50,60 Z M30,30 Q25,20 20,25 Q15,30 22,38 Q28,42 32,35 Z M70,30 Q75,20 80,25 Q85,30 78,38 Q72,42 68,35 Z M42,22 Q40,12 35,15 Q30,18 35,28 Q38,32 42,27 Z M58,22 Q60,12 65,15 Q70,18 65,28 Q62,32 58,27 Z',
        viewBox: '0 0 100 90',
      },
      {
        id: 'fish-bone',
        name: 'Fish Bone',
        path: 'M10,40 L75,40 M20,25 L30,40 L20,55 M35,25 L45,40 L35,55 M50,25 L60,40 L50,55 M65,30 L70,40 L65,50 M75,40 L90,25 L90,55 Z M5,35 A5,5 0 1,1 5,45 A5,5 0 1,1 5,35 Z',
        viewBox: '0 0 95 65',
      },
      {
        id: 'cat-silhouette',
        name: 'Cat Sitting',
        path: 'M40,15 L35,5 L30,15 Q25,18 25,25 L25,55 Q25,70 35,75 L35,85 L45,85 L45,75 L55,75 L55,85 L65,85 L65,75 Q75,70 75,55 L75,25 Q75,18 70,15 L65,5 L60,15 Q55,12 50,12 Q45,12 40,15 Z M38,28 A4,4 0 1,1 38,36 A4,4 0 1,1 38,28 Z M58,28 A4,4 0 1,1 58,36 A4,4 0 1,1 58,28 Z M50,38 L47,42 L53,42 Z M75,40 Q85,35 90,40 Q85,45 75,42',
        viewBox: '0 0 95 90',
      },
      {
        id: 'mouse-toy',
        name: 'Mouse Toy',
        path: 'M70,40 Q90,30 95,40 Q90,50 70,42 M70,40 Q50,20 25,30 Q5,40 25,55 Q50,65 70,42 Z M25,30 Q15,20 20,15 M25,30 Q30,15 35,20 M80,38 A2,2 0 1,1 80,42 A2,2 0 1,1 80,38',
        viewBox: '0 0 100 70',
      },
      {
        id: 'dog-silhouette',
        name: 'Dog',
        path: 'M25,25 Q20,15 15,15 Q10,15 10,22 L10,35 Q10,40 15,40 L20,40 L20,70 L30,70 L30,50 L55,50 L55,70 L65,70 L65,45 Q75,40 80,30 Q82,25 78,20 Q72,15 65,20 L60,25 Q50,20 40,20 Q30,20 25,25 Z M16,24 A2,2 0 1,1 16,28 A2,2 0 1,1 16,24 M10,35 Q5,33 5,37 Q5,40 10,38',
        viewBox: '0 0 90 75',
      },
      {
        id: 'bird',
        name: 'Bird',
        path: 'M50,30 Q30,10 20,20 Q10,30 20,40 Q10,45 15,50 L30,45 Q40,55 55,50 Q70,45 75,35 Q80,25 70,20 Q60,15 50,30 Z M30,28 A2,2 0 1,1 30,32 A2,2 0 1,1 30,28 M70,35 L85,32 L85,38 Z',
        viewBox: '0 0 90 60',
      },
      {
        id: 'butterfly',
        name: 'Butterfly',
        path: 'M50,15 Q30,5 15,15 Q5,25 15,40 Q25,50 50,45 Q75,50 85,40 Q95,25 85,15 Q70,5 50,15 Z M50,45 L50,80 M40,60 Q30,65 25,60 M60,60 Q70,65 75,60 M48,15 L48,10 Q45,5 42,3 M52,15 L52,10 Q55,5 58,3',
        viewBox: '0 0 100 85',
      },
    ],
  },
}

export const ALL_ASSETS = [
  ...ASSET_CATEGORIES.celebration.assets,
  ...ASSET_CATEGORIES.pets.assets,
]
