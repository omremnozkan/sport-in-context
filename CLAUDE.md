# Sport in Context — project brief

Read this first in every session. Update it whenever a decision changes.

## What the site is
Long-form sports analysis: the game through data, money, law, politics and history.
Football first; basketball and US sports as "Beyond Football" and for comparisons
(e.g. closed leagues with salary caps vs open pyramids with financial rules).
No news section.

## Reader
A football fan who is also interested in data, statistics, finance, economics, law and politics.

## Tone and style
Calm, clear, analytical (Vox explainers + The Athletic depth). Opinions labelled as opinions.

## Legal rule for sensitive topics
State only what is documented or officially found. Name the source. For open cases,
say "the commission found…" and note any appeal. Never assert wrongdoing beyond the record.

## Planned topics
Man City finances and the Premier League case (first article), Brighton's model,
PSG transfer policy, football ultras, Fabrizio Romano, Barcelona and Catalan nationalism,
Tito and Yugoslav football, Mourinho, Total Football (dot diagrams), biology and the
evolution of the sport, US league economics (salary caps, Moneyball).

## Tech
- Plain HTML + one CSS file + tiny vanilla JS. No frameworks, no external fonts or scripts.
- Hosted on Cloudflare Pages from this GitHub repo (no build step; output dir = root).
- Railway only if a backend feature is ever needed (none planned yet).

## Structure
- `index.html` — homepage
- `articles/<slug>.html` — one file per article (copy `man-city-billion.html` as a template)
- `assets/style.css` — all styles and colour tokens
- `assets/chart.js` — bar charts from a `data-series` JSON attribute, with hover + table view
- `_headers` — Cloudflare caching rules

## Design
- Dark theme only. Tokens live in `:root` in `style.css`.
- Serif headings, system sans body, mono kickers.
- Charts: one series = `--series-1`, thin bars with 4px rounded tops, 2px gaps,
  label only the key value, always a data-table toggle. Never dual axes.
- Dot diagrams: inline SVG; team A `--dot-a` (blue), team B `--dot-b` (orange), passes dashed.

## Sustainability
Static pages, system fonts, SVG over images, compress any photo (WebP), long cache headers,
no trackers. Keep each page well under 200 KB.

## Status
Prototype with lorem ipsum placeholders. Site tagline not decided yet.
