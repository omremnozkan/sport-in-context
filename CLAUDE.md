# Sport in Context — project brief

Read this first in every session. Update it whenever a decision changes.

## What the site is
Long-form sports analysis through many lenses: data, finance, economics, history,
politics, law and psychology. No single-subject focus; lenses mix within articles
rather than living in strictly separate sections.
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
Man City finances and the Premier League case, Brighton's model,
PSG transfer policy, football ultras, Fabrizio Romano, Barcelona and Catalan nationalism,
Tito and Yugoslav football, Mourinho, Total Football (dot diagrams), biology and the
evolution of the sport, US league economics (salary caps, Moneyball).

## Tech
- Plain HTML + one CSS file + tiny vanilla JS. No frameworks, no external fonts or scripts.
- Hosted on Cloudflare (Workers static assets, sport-in-context.omremn-ozkan.workers.dev), auto-deployed from this repo. `.assetsignore` keeps CLAUDE.md and README.md off the live site.
- Railway only if a backend feature is ever needed (none planned yet).

## Structure
- Navigation: Articles (→ `articles/`, the full list) / About. No topic sections.
- Homepage: hero → one featured article → "Latest articles" (3 cards) → "All articles →" link.
- `articles/index.html` — Articles page: equal tiles (whole tile clickable), newest first, each with lens kicker,
  title, one-line dek, date and reading time. Add a tile here for every new article.
- Tags: eight tags = the seven lenses + media (data, finance, economics, history, politics, law, psychology, media).
  Each tile has `data-tags="finance law"` (lowercase, space-separated); the tile kicker shows the main lens.
  `assets/filter.js` powers the filter buttons above the tiles and reads `?tag=` from the URL.
  Each article lists its tags under author/date as `ul.tags` links to `./?tag=<tag>`; keep them in sync with its tile.
- `index.html` — homepage
- `about.html` — About page (placeholder text; lens chips list the seven lenses)
- `articles/<slug>.html` — one file per article (copy `sample-article.html` as a template)
- `assets/style.css` — all styles and colour tokens
- `assets/chart.js` — charts from a `data-series` JSON attribute: `data-type="bar" | "diverging" | "line"`
  (negatives OK), `data-prefix`/`data-suffix` for units, hover + keyboard tooltips, direct labels, data-table toggle.
  Money in/out colours: `--in` (green) / `--out` (orange), pair validated for colour-blind readers.
- `assets/pitch.js` — interactive pitch diagrams from a JSON config (`<script type="application/json">`):
  states (e.g. two eras) with players matched by slot, animated switching, hover/focus player tooltips,
  pressing arrows and "exposed" zones. Always caption as a simplified illustration, not tracking data.
- Step sequences (`ol.steps` + `.step-detail`, handled by `article.js`): hover/tap a step to read its detail.
- `tools/build/` — Python builders that generate article pages from a shared shell (`shell.py`).
  Run `python3 tools/build/<article>.py`. Excluded from the live site.
- `assets/article.js` — reading time (word count / 230) and the Contents list, built from `.prose h2[id]`
  (add `data-no-toc` to skip a heading, e.g. Sources)
- Article template parts: kicker, h1, dek, `.meta` (author · <time> · reading time), Contents,
  note box, prose with footnote markers `<sup class="fn"><a href="#fnN" id="refN">N</a></sup>`,
  `ol.footnotes` with ↩ back-links, Related articles cards.
- `404.html` — shown for any missing page (enabled by `wrangler.jsonc` → `not_found_handling: "404-page"`); uses absolute `/` paths
- `_redirects` — old URL → new URL (301). Add a line whenever an article is renamed or moved.
- `wrangler.jsonc` — Cloudflare Worker config (name must stay `sport-in-context`); excluded from the live site via `.assetsignore`
- `favicon.ico` at root (fallback for browsers without SVG favicon support)
- `_headers` — Cloudflare caching rules: CSS/JS `no-cache` (revalidate, so design changes show at once); images cached 7 days.
  Asset links carry `?v=N`: bump N when an image or icon changes.

## Articles (live)
- `psg-making-of-champions.html` — featured. Tags: Finance (main), Psychology, History, Data. Written Nov 2025.
  Charts use APPROXIMATE values read from the author's Google Sheets charts (Transfermarkt data); replace with exact figures when the sheet is shared.
- `fabrizio-romano.html` — Tags: Media (main), Psychology. First published in MANMADE Magazine, Aug 2025 (credited in the note box).
- `sample-article.html` — lorem ipsum placeholder carrying all eight tags.
- Author byline: Ömer Emin Özkan. Older pieces carry an "Originally written…" note instead of rewriting time references.
- Press photos are never used (rights); visuals are our own charts and diagrams.

## Contact
contact.sportincontext@gmail.com (shown on about.html#contact; footers link there).

## Design
- Logo (option 2B-2): wordmark "Sport in Context." in bold sans, "in" semibold green,
  green full stop, framed by four thin green viewfinder corners. Markup + CSS live in the
  header (`.wordmark`). Favicon `assets/favicon.svg` (corners + white dot), app icon
  `assets/icon-180.png`, share image `assets/og.png` (1200x630).
- `og:image` uses the absolute workers.dev URL: update it when the domain changes.
- Dark theme only. Tokens live in `:root` in `style.css`.
- One type family: system sans for headings and body (bold, tight headings to match the logo); mono only for kickers/labels. No serif.
- Accessibility: visible `:focus-visible` outline (accent), "Skip to content" link on every page.
- Charts: one series = `--series-1`, thin bars with 4px rounded tops, 2px gaps,
  label only the key value, always a data-table toggle. Never dual axes.
- Dot diagrams: inline SVG; team A `--dot-a` (blue), team B `--dot-b` (orange), passes dashed.
- Hover language: viewfinder corners appear around tiles and the featured visual (echoing the logo); non-hovered chart marks dim; whole tiles/cards are clickable.

## Sustainability
Static pages, system fonts, SVG over images, compress any photo (WebP), long cache headers,
no trackers. Keep each page well under 200 KB.

## Status
Two real articles live (PSG featured, Romano) plus one placeholder. Homepage hero and About text are still placeholders. Next planned article: Brighton (outline drafted). Site tagline: "Sport, examined from every angle."
