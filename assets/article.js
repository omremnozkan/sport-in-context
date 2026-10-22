// Sport in Context — article helpers, no libraries.
// 1) Reading time from the word count of the article body.
// 2) "Contents" list built from the <h2 id="..."> headings in .prose (skip with data-no-toc).
(function () {
  const article = document.querySelector("article");
  if (!article) return;

  const rt = document.querySelector("[data-reading-time]");
  if (rt) {
    const words = (article.innerText || "").trim().split(/\s+/).length;
    rt.textContent = Math.max(1, Math.round(words / 230)) + " min read";
  }

  const toc = document.querySelector(".toc ol");
  if (toc) {
    article.querySelectorAll(".prose h2[id]:not([data-no-toc])").forEach((h) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      toc.appendChild(li);
    });
    if (!toc.children.length) toc.closest(".toc").hidden = true;
  }

  // 3) Step sequences: hover, focus or tap a step to read its detail.
  document.querySelectorAll(".steps").forEach((list) => {
    const out = document.getElementById(list.dataset.detail);
    const buttons = [...list.querySelectorAll("button")];
    const pick = (b) => {
      buttons.forEach((x) => x.removeAttribute("aria-current"));
      b.setAttribute("aria-current", "step");
      out.replaceChildren();
      const t = document.createElement("b");
      t.textContent = b.dataset.title + ": ";
      out.append(t, document.createTextNode(b.dataset.text));
    };
    buttons.forEach((b) => {
      b.addEventListener("pointerenter", () => pick(b));
      b.addEventListener("focus", () => pick(b));
      b.addEventListener("click", () => pick(b));
    });
    if (buttons.length) pick(buttons[0]);
  });
})();
