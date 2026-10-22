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
- `index.html` — homepage
- `about.html` — About page (placeholder text; lens chips list the seven lenses)
- `articles/<slug>.html` — one file per article (copy `sample-article.html` as a template)
- `assets/style.css` — all styles and colour tokens
- `assets/chart.js` — bar charts from a `data-series` JSON attribute, with hover + table view
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

## Sustainability
Static pages, system fonts, SVG over images, compress any photo (WebP), long cache headers,
no trackers. Keep each page well under 200 KB.

## Status
Prototype with lorem ipsum placeholders only; no real articles yet. Site tagline: "Sport, examined from every angle." First article not decided.
