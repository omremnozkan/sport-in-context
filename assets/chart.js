// Sport in Context — small chart engine, no libraries.
//
// <div class="chart" data-type="bar|diverging|line" data-series='[...]'
//      data-prefix="€" data-suffix="m" data-xlabel="Season" data-title="…"></div>
//
//  bar:        [{"label":"09","value":95}, …]
//  line:       [{"label":"11-12","value":-97}, …]            (negatives allowed)
//  diverging:  [{"label":"11-12","up":8,"down":105}, …]      up above zero, down below
//              names from data-up-name / data-down-name
//
// Every chart gets: hover + keyboard tooltips, one direct label per key value,
// a recessive grid with a stronger zero line, and a "Show data table" toggle.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const niceStep = (raw) => {
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= raw);
  };
  // Rounded data-end, square at the baseline. y0 = baseline, y1 = data end.
  const barPath = (x, w, y0, y1) => {
    const r = Math.min(3, w / 2, Math.abs(y1 - y0));
    if (y1 <= y0) return `M${x},${y0}V${y1 + r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 + r}V${y0}Z`;
    return `M${x},${y0}V${y1 - r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 - r}V${y0}Z`;
  };

  function render(box) {
    box.querySelectorAll("svg, .tooltip, .chart-legend").forEach((n) => n.remove());
    const type = box.dataset.type || "bar";
    const data = JSON.parse(box.dataset.series);
    const pre = box.dataset.prefix || "", suf = box.dataset.suffix || box.dataset.unit || "";
    const fmt = (v, sign) => (v < 0 ? "−" : sign && v > 0 ? "+" : "") + pre + Math.abs(v) + suf;
    const upName = box.dataset.upName || "Up", downName = box.dataset.downName || "Down";

    const W = Math.max(300, Math.min(720, box.clientWidth || 640));
    const H = W < 480 ? 250 : 320;
    const m = { t: 22, r: 10, b: 34, l: 52 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;

    // Value range always includes zero
    let vals = [];
    data.forEach((d) => (type === "diverging" ? vals.push(d.up, -d.down) : vals.push(d.value)));
    let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
    // Headroom so direct labels never collide with the axis
    const pad = (hi - lo) * 0.1;
    if (lo < 0) lo -= pad;
    if (hi > 0) hi += pad;
    const step = niceStep((hi - lo) / 4 || 1);
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    const y = (v) => m.t + ((hi - v) / (hi - lo)) * ih;
    const colW = iw / data.length;
    const bw = Math.max(4, Math.min(44, colW - 6));

    // Legend for two-series charts (mirrors the mark: square keys)
    if (type === "diverging") {
      const lg = document.createElement("div");
      lg.className = "chart-legend";
      [[upName, "up"], [downName, "down"]].forEach(([name, k]) => {
        const s = document.createElement("span");
        const i = document.createElement("i");
        i.className = "key-" + k;
        s.append(i, document.createTextNode(name));
        lg.appendChild(s);
      });
      box.appendChild(lg);
    }

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": box.dataset.title || "Chart" }, box);

    // Grid + y labels
    const grid = el("g", { class: "grid axis" }, svg);
    for (let v = lo; v <= hi + 1e-9; v += step) {
      const yy = y(v);
      el("line", { x1: m.l, x2: W - m.r, y1: yy, y2: yy, class: v === 0 ? "zero" : "" }, grid);
      el("text", { x: m.l - 8, y: yy + 4, "text-anchor": "end" }, grid).textContent = v === 0 ? "0" : fmt(v);
    }

    // X labels (thin out when crowded)
    const every = colW < 34 ? 2 : 1;
    const axis = el("g", { class: "axis" }, svg);
    data.forEach((d, i) => {
      if (i % every) return;
      el("text", { x: m.l + i * colW + colW / 2, y: H - 10, "text-anchor": "middle" }, axis).textContent = d.label;
    });

    const marks = [];   // per column: elements to highlight
    const labels = el("g", { class: "labels" }, svg);
    const zeroY = y(0);

    if (type === "bar" || type === "diverging") {
      const peakUp = data.reduce((a, b) => ((type === "bar" ? b.value : b.up) > (type === "bar" ? a.value : a.up) ? b : a));
      const peakDown = type === "diverging" ? data.reduce((a, b) => (b.down > a.down ? b : a)) : null;
      data.forEach((d, i) => {
        const x = m.l + i * colW + (colW - bw) / 2;
        const g = el("g", { class: "col" }, svg);
        if (type === "bar") {
          el("path", { class: "bar", d: barPath(x, bw, zeroY, y(d.value)) }, g);
          if (d === peakUp) label(x + bw / 2, y(d.value) - 7, fmt(d.value));
        } else {
          if (d.up) el("path", { class: "bar up", d: barPath(x, bw, zeroY - 1, y(d.up)) }, g);
          el("path", { class: "bar down", d: barPath(x, bw, zeroY + 1, y(-d.down)) }, g);
          if (d === peakUp) label(x + bw / 2, y(d.up) - 7, fmt(d.up, true));
          if (d === peakDown) label(x + bw / 2, y(-d.down) + 15, fmt(-d.down));
        }
        marks.push(g);
      });
    } else {
      // Line
      const px = (i) => m.l + i * colW + colW / 2;
      const pts = data.map((d, i) => [px(i), y(d.value)]);
      el("path", { class: "line", d: "M" + pts.map((p) => p.join(",")).join("L") }, svg);
      const cross = el("line", { class: "crosshair", x1: 0, x2: 0, y1: m.t, y2: m.t + ih }, svg);
      cross.style.opacity = 0;
      const vmax = data.reduce((a, b) => (b.value > a.value ? b : a));
      const vmin = data.reduce((a, b) => (b.value < a.value ? b : a));
      data.forEach((d, i) => {
        const g = el("g", { class: "col" }, svg);
        el("circle", { class: "point" + (d.value >= 0 ? " pos" : ""), cx: pts[i][0], cy: pts[i][1], r: 4.5 }, g);
        marks.push(g);
        if (d === vmax) label(pts[i][0], pts[i][1] - 11, fmt(d.value, true));
        if (d === vmin) label(pts[i][0], pts[i][1] + 19, fmt(d.value));
      });
      marks.cross = cross; marks.px = px;
    }

    function label(x, yy, text) {
      el("text", { class: "label", x, y: yy, "text-anchor": "middle" }, labels).textContent = text;
    }

    // Tooltip (built with textContent only)
    const tip = document.createElement("div");
    tip.className = "tooltip";
    box.appendChild(tip);
    const row = (value, name, key) => {
      const r = document.createElement("div");
      r.className = "tip-row";
      if (key) { const k = document.createElement("i"); k.className = "key-" + key; r.appendChild(k); }
      const b = document.createElement("b"); b.textContent = value;
      const s = document.createElement("span"); s.textContent = name;
      r.append(b, s);
      return r;
    };

    // Hit areas: whole column, focusable
    data.forEach((d, i) => {
      const hit = el("rect", { class: "hit", x: m.l + i * colW, y: m.t, width: colW, height: ih, tabindex: 0 }, svg);
      let anchorY;
      const show = () => {
        tip.replaceChildren();
        const h = document.createElement("div"); h.className = "tip-head"; h.textContent = d.label; tip.appendChild(h);
        if (type === "diverging") {
          tip.append(row(fmt(d.up, true), upName, "up"), row(fmt(-d.down), downName, "down"), row(fmt(d.up - d.down, true), "Net"));
          anchorY = y(d.up);
        } else {
          tip.appendChild(row(fmt(d.value, type === "line"), box.dataset.name || "Value"));
          anchorY = y(Math.max(0, d.value));
        }
        hit.setAttribute("aria-label", tip.textContent);
        svg.classList.add("has-hover");
        marks.forEach((g, j) => g.classList.toggle("is-hover", j === i));
        if (marks.cross) {
          marks.cross.setAttribute("x1", marks.px(i)); marks.cross.setAttribute("x2", marks.px(i));
          marks.cross.style.opacity = 1;
          anchorY = y(d.value);
        }
        const sr = svg.getBoundingClientRect(), br = box.getBoundingClientRect(), k = sr.width / W;
        let left = sr.left - br.left + (m.l + i * colW + colW / 2) * k;
        left = Math.min(Math.max(left, 70), br.width - 70);
        tip.style.left = left + "px";
        tip.style.top = sr.top - br.top + Math.max(anchorY, m.t) * k - 10 + "px";
        tip.classList.add("show");
      };
      const hide = () => {
        svg.classList.remove("has-hover");
        marks.forEach((g) => g.classList.remove("is-hover"));
        if (marks.cross) marks.cross.style.opacity = 0;
        tip.classList.remove("show");
      };
      hit.addEventListener("pointerenter", show);
      hit.addEventListener("pointerleave", hide);
      hit.addEventListener("focus", show);
      hit.addEventListener("blur", hide);
    });

    // Table view (once)
    if (!box.nextElementSibling || !box.nextElementSibling.classList.contains("view-toggle")) {
      const btn = document.createElement("button");
      btn.className = "view-toggle"; btn.type = "button"; btn.textContent = "Show data table";
      const table = document.createElement("table");
      table.className = "data-table"; table.hidden = true;
      const head = type === "diverging" ? [box.dataset.xlabel || "Period", upName, downName, "Net"] : [box.dataset.xlabel || "Period", box.dataset.name || "Value"];
      const tr = table.createTHead().insertRow();
      head.forEach((h) => { const th = document.createElement("th"); th.textContent = h; tr.appendChild(th); });
      const tb = table.createTBody();
      data.forEach((d) => {
        const r = tb.insertRow();
        const cells = type === "diverging" ? [d.label, fmt(d.up), fmt(-d.down), fmt(d.up - d.down, true)] : [d.label, fmt(d.value)];
        cells.forEach((c) => (r.insertCell().textContent = c));
      });
      btn.addEventListener("click", () => {
        table.hidden = !table.hidden;
        btn.textContent = table.hidden ? "Show data table" : "Hide data table";
      });
      box.after(btn, table);
    }
    box.dataset.w = W;
  }

  const boxes = document.querySelectorAll(".chart");
  boxes.forEach(render);
  // Redraw when the width changes meaningfully (rotation, resize)
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((e) => {
      const b = e.target;
      if (Math.abs((b.clientWidth || 0) - Math.min(720, +b.dataset.w || 0)) > 40) render(b);
    }));
    boxes.forEach((b) => ro.observe(b));
  }
})();
