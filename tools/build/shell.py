"""Shared page shell for Sport in Context article pages (head, header, footer)."""

SITE = "https://sport-in-context.omremn-ozkan.workers.dev"
V = "4"


def head(title, desc, slug):
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · Sport in Context</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#121417">
  <link rel="icon" href="../favicon.ico" sizes="32x32">
  <link rel="icon" href="../assets/favicon.svg?v=3" type="image/svg+xml">
  <link rel="apple-touch-icon" href="../assets/icon-180.png">
  <meta property="og:site_name" content="Sport in Context">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{SITE}/articles/{slug}.html">
  <meta property="og:image" content="{SITE}/assets/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="../assets/style.css?v={V}">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap">
      <a class="wordmark" aria-label="Sport in Context, home" href="../index.html">Sport <span class="in">in</span> Context<span class="dot">.</span><i class="c tl" aria-hidden="true"></i><i class="c tr" aria-hidden="true"></i><i class="c bl" aria-hidden="true"></i><i class="c br" aria-hidden="true"></i></a>
      <nav class="site-nav" aria-label="Main">
        <a href="./">Articles</a>
        <a href="../about.html">About</a>
      </nav>
    </div>
  </header>

  <main class="wrap" id="main">
"""


def tags(names):
    items = "".join(f'<li><a href="./?tag={n.lower()}">{n}</a></li>' for n in names)
    return f'<ul class="tags" aria-label="Tags">{items}</ul>'


def related(cards):
    out = "".join(
        f'        <article class="card"><p class="kicker">{k}</p><h3><a href="{href}">{t}</a></h3><p>{d}</p></article>\n'
        for k, t, d, href in cards
    )
    return f"""
    <section class="related" aria-labelledby="related-title">
      <h2 class="section-title" id="related-title">Related articles</h2>
      <div class="cards">
{out}      </div>
    </section>
"""


def foot(scripts):
    s = "".join(f'  <script src="../assets/{n}?v={V}" defer></script>\n' for n in scripts)
    return f"""  </main>

  <footer class="site-footer">
    <div class="wrap"><span>© 2026 Sport in Context · <a href="../about.html#contact">Contact</a></span><span>Sport, examined from every angle</span></div>
  </footer>
{s}</body>
</html>
"""


CARDS = {
    "psg": ("Finance", "The Making of Champions: the rise of PSG and Luis Enrique’s genius",
            "How a club built on superstar spending finally won Europe without them.", "psg-making-of-champions.html"),
    "romano": ("Media", "Fabrizio Romano: the art of football journalism",
               "How “Here we go!” became the most trusted phrase in transfer news.", "fabrizio-romano.html"),
    "sample": ("Lorem", "Lorem ipsum dolor sit amet, consectetur adipiscing",
               "Placeholder article carrying every tag.", "sample-article.html"),
}
