// Sport in Context — filter the Articles page by tag, no libraries.
// Tiles carry data-tags="finance law"; buttons carry data-filter="finance" (or "all").
// The choice is kept in the address (?tag=finance), so tag links from articles land pre-filtered.
(function () {
  const buttons = [...document.querySelectorAll(".filters .chip")];
  const tiles = [...document.querySelectorAll(".tile[data-tags]")];
  const status = document.querySelector(".filter-status");
  if (!buttons.length) return;

  function apply(tag, push) {
    if (!buttons.some((b) => b.dataset.filter === tag)) tag = "all";
    let shown = 0;
    tiles.forEach((t) => {
      const match = tag === "all" || t.dataset.tags.split(" ").includes(tag);
      t.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === tag)));
    const label = buttons.find((b) => b.dataset.filter === tag).textContent;
    status.textContent = tag === "all" ? "" : `${shown} article${shown === 1 ? "" : "s"} tagged ${label}` + (shown ? "" : ". Try another tag.");
    if (push) {
      const url = new URL(location.href);
      tag === "all" ? url.searchParams.delete("tag") : url.searchParams.set("tag", tag);
      history.replaceState(null, "", url);
    }
  }

  buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter, true)));
  apply(new URLSearchParams(location.search).get("tag") || "all", false);
})();
