// Sport in Context — interactive pitch diagrams, no libraries.
//
// <figure class="pitch" data-config="psg-shapes"> … </figure>
// <script type="application/json" id="psg-shapes">{ "states": [ … ] }</script>
//
// Each state: { "id", "label", "note",
//   "players": [{ "slot", "x", "y", "t" (2-letter tag), "name", "pos" }],
//   "arrows":  [{ "from": [x,y], "to": [x,y], "kind": "press" | "run" }],
//   "zones":   [{ "x", "y", "w", "h", "label" }] }
// Players are matched across states by "slot", so switching states animates them.
// Pitch is 600 × 390, attacking left → right.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  document.querySelectorAll(".pitch[data-config]").forEach((fig) => {
    const cfg = JSON.parse(document.getElementById(fig.dataset.config).textContent);
    const panel = fig.querySelector(".panel");
    const controls = fig.querySelector(".pitch-controls");
    const note = fig.querySelector(".pitch-note");

    const svg = el("svg", { viewBox: "0 0 600 390", role: "img", "aria-label": fig.dataset.title || "Tactical diagram" });
    panel.prepend(svg);

    // Markings
    const lines = el("g", { class: "pitch-lines" }, svg);
    el("rect", { x: 10, y: 10, width: 580, height: 370, rx: 4 }, lines);
    el("line", { x1: 300, y1: 10, x2: 300, y2: 380 }, lines);
    el("circle", { cx: 300, cy: 195, r: 48 }, lines);
    el("circle", { cx: 300, cy: 195, r: 2.5, class: "spot" }, lines);
    el("rect", { x: 10, y: 100, width: 82, height: 190 }, lines);
    el("rect", { x: 508, y: 100, width: 82, height: 190 }, lines);
    el("rect", { x: 10, y: 152, width: 28, height: 86 }, lines);
    el("rect", { x: 562, y: 152, width: 28, height: 86 }, lines);

    // Arrowhead marker
    const defs = el("defs", {}, svg);
    ["press", "run"].forEach((k) => {
      const mk = el("marker", { id: `${fig.dataset.config}-${k}`, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
      el("path", { d: "M0,0 L10,5 L0,10 z", class: "head-" + k }, mk);
    });

    const zoneLayer = el("g", { class: "zones" }, svg);
    const arrowLayer = el("g", { class: "arrows" }, svg);
    const playerLayer = el("g", { class: "players" }, svg);

    // Tooltip
    const tip = document.createElement("div");
    tip.className = "tooltip";
    panel.appendChild(tip);

    // One node per slot, reused across states
    const nodes = {};
    cfg.states[0].players.forEach((p) => {
      const g = el("g", { class: "player", tabindex: 0 }, playerLayer);
      el("circle", { class: "halo", r: 20 }, g);
      el("circle", { class: "body", r: 14 }, g);
      const t = el("text", { class: "tag" }, g);
      nodes[p.slot] = { g, t, data: p };
      const show = () => {
        const d = nodes[p.slot].data;
        tip.replaceChildren();
        const h = document.createElement("div"); h.className = "tip-head"; h.textContent = d.pos;
        const b = document.createElement("div"); b.className = "tip-row"; const s = document.createElement("b"); s.textContent = d.name; b.appendChild(s);
        tip.append(h, b);
        g.setAttribute("aria-label", d.name + ", " + d.pos);
        const sr = svg.getBoundingClientRect(), pr = panel.getBoundingClientRect(), k = sr.width / 600;
        tip.style.left = Math.min(Math.max(sr.left - pr.left + d.x * k, 80), pr.width - 80) + "px";
        tip.style.top = sr.top - pr.top + (d.y - 22) * k + "px";
        tip.classList.add("show");
        svg.classList.add("has-hover");
        g.classList.add("is-hover");
      };
      const hide = () => { tip.classList.remove("show"); svg.classList.remove("has-hover"); g.classList.remove("is-hover"); };
      g.addEventListener("pointerenter", show);
      g.addEventListener("pointerleave", hide);
      g.addEventListener("focus", show);
      g.addEventListener("blur", hide);
    });

    function setState(i) {
      const st = cfg.states[i];
      st.players.forEach((p) => {
        const n = nodes[p.slot];
        n.data = p;
        n.g.style.transform = `translate(${p.x}px, ${p.y}px)`;
        n.t.textContent = p.t;
        n.g.setAttribute("aria-label", p.name + ", " + p.pos);
      });
      zoneLayer.replaceChildren();
      (st.zones || []).forEach((z) => {
        el("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: 4, class: "zone" }, zoneLayer);
        const lbl = el("text", { x: z.x + z.w / 2, y: z.y + z.h / 2 + 4, class: "zone-label" }, zoneLayer);
        lbl.textContent = z.label;
      });
      arrowLayer.replaceChildren();
      (st.arrows || []).forEach((a) => {
        el("line", { x1: a.from[0], y1: a.from[1], x2: a.to[0], y2: a.to[1], class: "arrow " + a.kind,
          "marker-end": `url(#${fig.dataset.config}-${a.kind})` }, arrowLayer);
      });
      if (note) note.textContent = st.note || "";
      if (controls) controls.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
    }

    if (controls) {
      cfg.states.forEach((st, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "chip"; b.textContent = st.label;
        b.addEventListener("click", () => setState(i));
        controls.appendChild(b);
      });
    }
    // Bigger players and labels on small screens, so initials stay readable
    function size() {
      const small = svg.getBoundingClientRect().width < 480;
      Object.values(nodes).forEach(({ g }) => {
        g.querySelector(".body").setAttribute("r", small ? 19 : 14);
        g.querySelector(".halo").setAttribute("r", small ? 25 : 20);
        g.querySelector(".tag").style.fontSize = small ? "14px" : "10.5px";
      });
    }
    size();
    if ("ResizeObserver" in window) new ResizeObserver(size).observe(svg);
    setState(cfg.start || 0);
  });
})();
