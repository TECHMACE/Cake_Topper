// SVG path data for the asset library.
// All paths are laser-cut safe: every sub-path is closed with Z, circles use
// the two-half-arc form so Paper.js always closes them, and outline icons
// rely on the evenodd fill rule (inner sub-paths become holes).
// Canvas.jsx reads `asset.path`. Keep only { id, name, path, viewBox }.

export const ASSET_CATEGORIES = {
  celebration: {
    label: 'Celebration',
    icon: '\u{1F389}',
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
        // Outline balloon: oval outer + oval inner (hollow) + solid knot + curly string
        id: 'balloon',
        name: 'Balloon',
        path: 'M50,4 C26,4 8,22 8,46 C8,68 26,82 46,84 L46,90 L54,90 L54,84 C74,82 92,68 92,46 C92,22 74,4 50,4 Z M50,16 C32,16 20,30 20,46 C20,62 32,74 50,74 C68,74 80,62 80,46 C80,30 68,16 50,16 Z M44,90 L56,90 L58,98 L42,98 Z M50,98 C46,104 56,108 52,114 C48,120 58,124 54,130 L48,130 C52,124 42,120 46,114 C50,108 40,104 44,98 Z',
        viewBox: '0 0 100 132',
      },
      {
        id: 'crown',
        name: 'Crown',
        path: 'M8,72 L14,28 L32,50 L50,18 L68,50 L86,28 L92,72 Z M4,72 L96,72 L96,86 L4,86 Z',
        viewBox: '0 0 100 90',
      },
      {
        // Champagne flute silhouette: tulip bowl + thin stem + flat rectangular base
        id: 'champagne',
        name: 'Champagne Flute',
        path: 'M30,4 L70,4 L68,28 C68,48 62,62 54,66 L54,100 C54,102 58,103 62,104 L62,112 L38,112 L38,104 C42,103 46,102 46,100 L46,66 C38,62 32,48 32,28 Z M22,112 L78,112 L78,122 L22,122 Z',
        viewBox: '0 0 100 126',
      },
      {
        // Faceted diamond gem: hexagonal outer with triangular facet cutouts.
        // Outer rim = flat top (20,20)-(80,20), angled sides to point at (50,98).
        // Inner: top band is divided into 4 triangle cutouts, lower section has
        // 3 triangular cutouts forming the classic brilliant-cut look.
        id: 'diamond-gem',
        name: 'Diamond',
        path: 'M20,20 L80,20 L96,44 L50,98 L4,44 Z M24,26 L35,40 L14,40 Z M37,26 L49,26 L43,40 Z M51,26 L63,26 L57,40 Z M65,26 L76,26 L66,40 Z M14,46 L38,46 L48,92 Z M40,46 L60,46 L50,90 Z M62,46 L86,46 L52,92 Z',
        viewBox: '0 0 100 102',
      },
      {
        // Wedding ring: outer silhouette combining a circular band with a
        // faceted diamond gem perched on top. They share one edge (y=44) so
        // evenodd never double-counts. Inner sub-path = ring hole.
        id: 'wedding-ring',
        name: 'Wedding Ring',
        path: 'M30,44 L22,14 L50,8 L78,14 L70,44 C86,50 96,62 96,78 C96,96 74,108 50,108 C26,108 4,96 4,78 C4,62 14,50 30,44 Z M50,60 C36,60 24,68 24,78 C24,88 36,96 50,96 C64,96 76,88 76,78 C76,68 64,60 50,60 Z',
        viewBox: '0 0 100 116',
      },
      {
        id: 'grad-cap',
        name: 'Graduation Cap',
        path: 'M50,10 L5,30 L50,50 L95,30 Z M20,38 L20,60 Q35,75 50,75 Q65,75 80,60 L80,38 L50,52 Z M85,32 L85,56 L88,60 L82,60 L85,56 L85,54 L88,54 L88,32 Z',
        viewBox: '0 0 100 80',
      },
      {
        // Ribbon banner: center rectangle + V-notch pennant ends
        id: 'banner',
        name: 'Banner',
        path: 'M12,14 L88,14 L88,52 L12,52 Z M12,14 L2,8 L2,46 L12,40 Z M88,14 L98,8 L98,46 L88,40 Z M2,46 L12,40 L12,58 Z M98,46 L88,40 L88,58 Z',
        viewBox: '0 0 100 62',
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
    icon: '\u{1F43E}',
    assets: [
      {
        // Paw print: main pad (big oval) + 4 toe beans (vertical ovals).
        // Drawn as 5 solid filled shapes that look like a paw but are
        // physically separate cut pieces. Each uses two half-arcs for closure.
        // Toes sized/spaced so none overlap (evenodd would carve holes).
        id: 'paw-print',
        name: 'Paw Print',
        path: 'M10,70 A24,18 0 1,0 82,70 A24,18 0 1,0 10,70 Z M4,38 A9,13 0 1,0 22,38 A9,13 0 1,0 4,38 Z M70,38 A9,13 0 1,0 88,38 A9,13 0 1,0 70,38 Z M25,22 A9,13 0 1,0 43,22 A9,13 0 1,0 25,22 Z M49,22 A9,13 0 1,0 67,22 A9,13 0 1,0 49,22 Z',
        viewBox: '0 0 96 92',
      },
      {
        // Solid dog bone: horizontal shaft with rounded bumps at each end.
        // One continuous closed silhouette traced clockwise.
        id: 'dog-bone',
        name: 'Dog Bone',
        path: 'M22,10 C12,10 4,18 4,28 C4,38 10,44 18,46 C10,48 4,54 4,64 C4,74 12,82 22,82 C32,82 38,76 38,68 L62,68 C62,76 68,82 78,82 C88,82 96,74 96,64 C96,54 90,48 82,46 C90,44 96,38 96,28 C96,18 88,10 78,10 C68,10 62,16 62,24 L38,24 C38,16 32,10 22,10 Z',
        viewBox: '0 0 100 92',
      },
      {
        // Sitting dog silhouette: head + floppy ear, long neck/chest, front leg,
        // haunch, curled tail. Single closed path.
        id: 'dog',
        name: 'Dog',
        path: 'M18,30 C18,22 22,14 30,14 C36,14 40,18 42,22 C46,20 52,18 58,20 C64,22 66,26 66,30 C66,34 64,40 58,42 C56,46 54,50 54,54 C56,56 58,60 58,66 L58,86 C62,84 68,82 72,84 C76,86 80,90 82,92 C84,94 80,96 76,96 L44,96 L42,94 C40,92 38,90 38,86 L38,70 C36,72 34,76 34,82 L34,94 L32,96 L20,96 L18,94 L18,80 C18,70 22,60 28,54 L28,46 C24,44 20,40 18,34 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Sitting cat silhouette: two triangle ears, round head, sinuous body
        // curving down to haunch with long curled tail at right.
        id: 'cat',
        name: 'Cat',
        path: 'M22,20 L30,4 L36,20 C38,18 42,16 46,16 L46,8 L52,22 C58,24 62,30 62,38 C62,42 60,46 58,48 C60,52 60,56 58,60 L56,72 C58,76 60,82 62,88 C66,86 72,84 76,84 C82,84 88,86 90,88 L92,90 L90,92 C88,92 84,92 82,94 L80,96 L42,96 L40,94 C38,90 38,84 40,80 C38,76 36,72 36,68 L36,56 C34,50 30,44 28,38 C24,36 20,30 20,24 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Cat head: wide rounded face + two triangular pointy ears on top.
        id: 'cat-head',
        name: 'Cat Head',
        path: 'M14,30 L26,6 L38,24 C42,22 48,20 54,20 C60,20 66,22 70,24 L82,6 L94,30 C96,36 96,44 94,52 C90,68 72,82 54,82 C36,82 18,68 14,52 C12,44 12,36 14,30 Z',
        viewBox: '0 0 100 88',
      },
      {
        // Sitting rabbit silhouette: tall ears, round head, small front paw,
        // round haunch, puff tail. Single closed shape.
        id: 'rabbit',
        name: 'Rabbit',
        path: 'M26,8 C24,4 28,2 32,4 C36,6 40,18 40,32 L40,44 C42,42 44,40 46,38 C46,28 50,16 54,8 C58,2 62,4 62,10 C62,18 58,28 54,38 C56,40 58,44 58,48 L58,56 C60,54 64,52 68,52 C74,52 80,56 84,62 C88,68 90,76 90,84 C90,90 88,94 84,94 L72,94 C70,92 68,88 68,86 C66,90 62,94 58,94 L30,94 C26,94 24,92 24,88 C24,82 28,76 32,72 L32,60 C28,58 24,54 22,48 C20,42 20,36 22,30 L22,24 C22,18 24,12 26,8 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Fish silhouette facing right: oval body + forked tail on left,
        // top and bottom fins, small pointed snout.
        id: 'fish',
        name: 'Fish',
        path: 'M96,50 C96,36 82,24 62,24 C50,24 40,28 32,34 C30,28 34,22 30,20 C26,18 22,22 22,28 C22,32 24,36 26,40 L14,26 L22,46 L6,46 L22,54 L14,74 L26,60 C24,64 22,68 22,72 C22,78 26,82 30,80 C34,78 30,72 32,66 C40,72 50,76 62,76 C82,76 96,64 96,50 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Bird on branch: round body, raised head, small beak, pointed tail,
        // joined to a horizontal branch across the bottom.
        id: 'bird',
        name: 'Bird',
        path: 'M52,8 C56,6 60,10 60,16 L66,14 L60,22 C64,26 66,32 66,38 C70,42 72,48 72,56 C72,66 68,74 60,80 L60,88 L92,88 L92,94 L8,94 L8,88 L28,88 L28,80 C22,78 16,74 12,68 L4,72 L10,64 C8,60 8,56 10,52 L4,48 L12,46 C16,42 22,40 30,42 C32,34 40,28 50,28 C50,22 50,14 50,10 C50,9 51,8 52,8 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Butterfly: solid body stripe + two upper wings + two lower wings,
        // antennae on top. Kept as a robust solid silhouette (no thin holes).
        id: 'butterfly',
        name: 'Butterfly',
        path: 'M48,6 C44,2 38,4 38,10 C38,12 42,14 46,16 L46,22 C40,18 32,14 24,14 C14,14 6,22 6,32 C6,42 12,50 22,52 C30,54 40,52 46,48 L46,58 C38,62 28,62 20,66 C10,72 6,80 10,88 C14,96 24,94 32,90 C40,86 44,82 46,78 L46,82 C44,86 44,90 48,92 L52,92 C56,90 56,86 54,82 L54,78 C56,82 60,86 68,90 C76,94 86,96 90,88 C94,80 90,72 80,66 C72,62 62,62 54,58 L54,48 C60,52 70,54 78,52 C88,50 94,42 94,32 C94,22 86,14 76,14 C68,14 60,18 54,22 L54,16 C58,14 62,12 62,10 C62,4 56,2 52,6 L52,10 L48,10 Z',
        viewBox: '0 0 100 100',
      },
      {
        // Rearing horse silhouette: raised front legs, arched neck with mane,
        // planted hind legs, flowing tail. Single closed path.
        id: 'horse',
        name: 'Horse',
        path: 'M38,14 L42,6 L46,14 L52,8 L52,18 L58,14 L56,22 C62,26 66,32 68,40 C70,36 74,32 78,32 L76,40 L82,38 L78,46 C80,52 78,58 76,62 L82,66 L78,70 L84,74 L80,78 L86,84 L84,92 L78,92 L74,86 C72,82 70,76 70,72 C64,70 60,66 58,62 L56,72 L60,82 L64,92 L58,92 L56,84 L54,92 L50,92 L50,82 L46,92 L42,92 L42,82 C42,76 44,70 46,64 L40,60 C34,58 30,52 30,46 C26,50 22,58 22,68 L22,80 C20,84 16,86 12,84 L14,78 L10,76 L14,72 L10,68 L16,64 L14,58 C14,48 20,38 28,34 L24,24 L22,28 L22,18 L28,22 L26,12 L34,18 L34,8 Z',
        viewBox: '0 0 100 100',
      },
    ],
  },
}

export const ALL_ASSETS = [
  ...ASSET_CATEGORIES.celebration.assets,
  ...ASSET_CATEGORIES.pets.assets,
]
