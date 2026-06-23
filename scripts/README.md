# Icon Replacement — Tomorrow's Task

Goal: replace the ugly hand-coded animal icons in `src/assets.js` with
proper silhouettes sourced from svgrepo.com.

---

## Step 1 — Download SVGs

Go to https://svgrepo.com and download one SVG for each of these.
Pick **solid black silhouettes** (not outline/stroke icons).
Save them into `icon-sources/` with these exact filenames:

| Save as | Search term |
|---|---|
| `paw-print.svg` | paw print silhouette |
| `dog.svg` | sitting dog silhouette |
| `cat.svg` | sitting cat silhouette |
| `fish.svg` | fish silhouette |
| `rabbit.svg` | rabbit silhouette |
| `bird.svg` | bird silhouette |
| `horse.svg` | horse silhouette |
| `butterfly.svg` | butterfly silhouette |

Tips:
- Filter by "Free" license
- The ones that look like the examples in `Icon Examples/` are the right style
- Single-path or simple multi-path SVGs work best

---

## Step 2 — Run the extraction script

```bash
mkdir -p icon-sources
node scripts/extract-icons.js icon-sources/
```

This prints ready-to-paste `assets.js` snippets like:

```js
      {
        id: 'dog',
        name: 'Dog',
        path: 'M10,20 C...',
        viewBox: '0 0 100 100',
      },
```

---

## Step 3 — Paste into src/assets.js

Open `src/assets.js`. In the `pets` category, replace each matching entry
(find by `id:`) with the new snippet from the script output.

Keep the existing entries for icons you're NOT replacing (star, heart, crown,
graduation cap, number 1, diamond, wedding ring, banner, balloon, champagne).

---

## Step 4 — Verify in browser

```bash
npm run dev   # http://localhost:5173
```

1. Asset Library → Pets & Animals
2. Each icon should look like its reference image in `Icon Examples/`
3. Drop each one on canvas — should appear and boolean-union cleanly

---

## If the script says "no path elements found"

Some SVGs use `<polygon>` or `<circle>` instead of `<path>`. Either:
- Pick a different SVG from svgrepo for that animal
- Or tell Claude to convert the shape to a path manually
