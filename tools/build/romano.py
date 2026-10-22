import sys
sys.path.insert(0, __file__.rsplit("/", 1)[0])
import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
from shell import head, tags, related, foot, CARDS

SLUG = "fabrizio-romano"
TITLE = "Fabrizio Romano: the art of football journalism"
DESC = "How Fabrizio Romano went from Naples to “Here we go!”, and the slow, step-by-step method behind his reliability."

steps = [
    ("Interest", 20, "A club starts monitoring a player. Early, cautious reporting: nothing is close yet."),
    ("Talks", 40, "Contacts open between clubs, agents and the player. Each new detail is shared as it is confirmed."),
    ("Agreement", 65, "Terms are agreed in principle: fee, contract length, structure. Still not final."),
    ("Final steps", 85, "Documents, signatures, medical tests. The last details are checked one by one."),
    ("Here we go!", 100, "Only now does the famous phrase appear: the deal is done."),
]
step_html = "\n".join(
    f'          <li><button type="button" data-title="{t}" data-text="{d}">{t}<span class="meter" aria-hidden="true"><i style="--w:{w}%"></i></span></button></li>'
    for t, w, d in steps
)

body = f"""    <article>
      <div class="article-head">
        <p class="callout">Originally published in August 2025</p>
        <p class="kicker">Media</p>
        <h1>{TITLE}</h1>
        <p class="dek">How a journalist from Naples made “Here we go!” the most trusted phrase in transfer news.</p>
        <p class="meta"><span><time datetime="2026-10">October 2026</time></span><span data-reading-time>— min read</span></p>
        {tags(["Media", "Psychology"])}
      </div>

      <details class="toc" open><summary>Contents</summary><ol></ol></details>


      <div class="prose">
        <p>Football fans around the world know they can trust the phrase “Here we go!” when searching for transfer news. The figure behind this vast network of information is Fabrizio Romano, an Italian who came from humble beginnings and became one of the most respected football journalists in the world. With over 80 million followers across social media and numerous prestigious awards, this article recounts the story of his remarkable career and briefly examines his methods.</p>

        <h2 id="from-naples">From Naples to the transfer beat</h2>
        <p>Born and raised in Naples, Romano discovered his passion for sports journalism in high school and began working for TuttoMercatoWeb, writing football articles. His career changed direction when a golden opportunity arrived. An Italian agent in Barcelona contacted him and asked him to write about two prospects from La Masia, Barcelona’s renowned academy: Gerard Deulofeu and Mauro Icardi. The latter would completely change Romano’s future.<sup class="fn"><a href="#fn1" id="ref1" aria-label="Source 1">1</a></sup></p>
        <p>The same agent later gave him information on Icardi’s transfers, first to Sampdoria and then to Inter Milan. These stories fuelled Romano’s rise and introduced him to the charm of transfer reporting. He joined Sky Sport Italia and expanded his network, meeting club officials, agents and players. For years, he has reported the progress of transfers step by step, and he rarely gets it wrong. He is revered as a trustworthy source, was named “Best Football Journalist” at the 2022 Globe Soccer Awards, and works independently while partnering with outlets such as the <em>Guardian</em> and CBS Sports.</p>

        <h2 id="the-method">The method</h2>
        <p>Perhaps the most important part of Romano’s success is his way of working and his dedication. His deep connections across football give him crucial and, above all, accurate information before other reporters. He is known for sleeping only around five hours a night and spending around 17 hours a day on screen. On average, he takes 50 phone calls a day and sends thousands of messages. By talking to players, agents, directors, owners and fellow journalists, he gathers information and publishes statements that are very hard to refute. His charming, energetic personality earns the trust of fans and of the football world in general.</p>
        <p>The key to his reliability is a method called “slow journalism.” Instead of publishing uncertain news whenever new information arrives, he releases it gradually before the final “Here we go!” post. This lowers the risk of being wrong and keeps his audience engaged by sharing the journey in small steps. The process is like serialisation: each development is shared on its own rather than in one complete story.</p>
      </div>

      <figure>
        <p class="fig-title">Slow journalism, step by step</p>
        <p class="fig-sub">How a transfer story is released in stages · hover or tap a step</p>
        <div class="panel">
          <ol class="steps" data-detail="romano-step-detail">
{step_html}
          </ol>
          <p class="step-detail" id="romano-step-detail" aria-live="polite"></p>
        </div>
        <figcaption>Illustrative sequence; the bar shows growing certainty, not a measured value. Real stories vary deal by deal.</figcaption>
      </figure>

      <div class="prose">
        <h2 id="when-the-clubs-were-wrong">When the clubs were wrong</h2>
        <p>In some cases, his information has proved more reliable than the clubs’ own announcements. In 2015, he caught the football world’s attention with a bold claim: the Montenegrin striker Stevan Jovetić was about to leave Manchester City for Inter Milan. Manchester City denied it publicly and the <em>Guardian</em> doubted the report, but in the end the move went through. A more recent example came in 2022, when he predicted Marc Cucurella’s move to Chelsea. Brighton &amp; Hove Albion explicitly rejected the news, but by August the Spanish left-back had been sold.</p>

        <h2 id="still-rising">Still rising</h2>
        <p>Fabrizio Romano is at the height of his career; his audience keeps growing and so does his recognition. He has become a symbol of Italian football culture and an independent authority when it comes to confirming transfer news.</p>

        <h2 id="sources" data-no-toc>Sources</h2>
        <ol class="footnotes">
          <li id="fn1">Josh Lawless, “Fabrizio Romano’s first ever transfer story changed his life,” <em>SPORTbible</em>, 9 July 2023. <a href="https://www.sportbible.com/football/fabrizio-romano-transfer-news-barcelona622008-20230709">Link</a> <a class="back" href="#ref1" aria-label="Back to text">↩</a></li>
        </ol>
        <h3 class="src-head">Further reading</h3>
        <ul class="src-list">
          <li>Shlomo Sprung, “Meet Fabrizio Romano, soccer’s answer to Woj and Shams,” <em>Boardroom</em>, 31 August 2021. <a href="https://boardroom.tv/fabrizio-romano-here-we-go/">Link</a></li>
          <li>HITC Stevens, “Sorry, we need to talk about Fabrizio Romano,” YouTube, 20 August 2024. <a href="https://www.youtube.com/watch?v=QNjSGjafngA">Link</a></li>
        </ul>
      </div>
    </article>
"""

html = head(TITLE, DESC, SLUG) + body + related([CARDS["psg"], CARDS["sample"]]) + foot(["article.js"])
open(f"{ROOT}/articles/{SLUG}.html", "w").write(html)
print("wrote", SLUG)
