// Sport in Context — tiny bar chart, no libraries.
// Usage: <div class="chart" data-unit="€m" data-series='[{"label":"2009","value":120}, ...]'></div>
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const niceMax = (v) => {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= v);
  };

  document.querySelectorAll(".chart").forEach((box) => {
    const data = JSON.parse(box.dataset.series);
    const unit = box.dataset.unit || "";
    // Match the drawing width to the screen so text stays readable on phones
    const W = Math.max(300, Math.min(640, box.clientWidth || 640)), H = W < 480 ? 240 : 300, m = { t: 20, r: 8, b: 32, l: 44 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const max = niceMax(Math.max(...data.map((d) => d.value)));
    const y = (v) => m.t + ih - (v / max) * ih;
    const step = iw / data.length, bw = Math.max(4, step - 4); // 2px gap each side

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": box.dataset.title || "Bar chart" }, box);

    // Gridlines + y labels
    const grid = el("g", { class: "grid axis" }, svg);
    for (let i = 0; i <= 4; i++) {
      const v = (max / 4) * i, yy = y(v);
      el("line", { x1: m.l, x2: W - m.r, y1: yy, y2: yy }, grid);
      el("text", { x: m.l - 8, y: yy + 4, "text-anchor": "end" }, grid).textContent = v + (i === 4 ? unit : "");
    }

    // Tooltip
    const tip = document.createElement("div");
    tip.className = "tooltip";
    box.appendChild(tip);

    const peak = data.reduce((a, b) => (b.value > a.value ? b : a));
    const axis = el("g", { class: "axis" }, svg);

    data.forEach((d, i) => {
      const x = m.l + i * step + (step - bw) / 2, top = y(d.value), base = m.t + ih, r = Math.min(4, bw / 2);
      // Bar with 4px rounded data-end, square at the baseline
      const bar = el("path", {
        class: "bar",
        d: `M${x},${base}V${top + r}Q${x},${top} ${x + r},${top}H${x + bw - r}Q${x + bw},${top} ${x + bw},${top + r}V${base}Z`,
      }, svg);
      el("text", { x: x + bw / 2, y: H - 10, "text-anchor": "middle" }, axis).textContent = d.label;
      if (d === peak) el("text", { class: "label", x: x + bw / 2, y: top - 6, "text-anchor": "middle" }, svg).textContent = d.value + unit;

      // Hit area wider than the bar
      const hit = el("rect", { class: "hit", x: m.l + i * step, y: m.t, width: step, height: ih }, svg);
      const show = () => {
        bar.classList.add("is-hover");
        tip.innerHTML = `<b>${d.label}</b>${d.value}${unit}`;
        const sr = svg.getBoundingClientRect(), br = box.getBoundingClientRect(), k = sr.width / W;
        tip.style.left = sr.left - br.left + (x + bw / 2) * k + "px";
        tip.style.top = sr.top - br.top + top * k + "px";
        tip.classList.add("show");
      };
      const hide = () => { bar.classList.remove("is-hover"); tip.classList.remove("show"); };
      hit.addEventListener("mouseenter", show);
      hit.addEventListener("mouseleave", hide);
      hit.addEventListener("touchstart", show, { passive: true });
    });

    // Table view (accessibility + exact numbers)
    const btn = document.createElement("button");
    btn.className = "view-toggle";
    btn.type = "button";
    btn.textContent = "Show data table";
    const table = document.createElement("table");
    table.className = "data-table";
    table.hidden = true;
    table.innerHTML = `<thead><tr><th>${box.dataset.xlabel || "Period"}</th><th>Value (${unit})</th></tr></thead><tbody>${data
      .map((d) => `<tr><td>${d.label}</td><td>${d.value}</td></tr>`).join("")}</tbody>`;
    btn.addEventListener("click", () => {
      table.hidden = !table.hidden;
      btn.textContent = table.hidden ? "Show data table" : "Hide data table";
    });
    box.after(btn, table);
  });
})();
