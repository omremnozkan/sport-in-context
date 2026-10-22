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
})();
