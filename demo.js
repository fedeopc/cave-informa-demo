/* Cave Informa · DEMO — gira dentro l'app dimostrativa.
   Sostituisce le fonti reali (DPC, INGV, Open-Meteo, bacheca, DAE) con dati simulati
   decisi dalla regia. L'app vera non viene mai toccata. */
(function () {
  "use strict";
  const inFrame = window.self !== window.top;
  const KEY_STORE = "caveinforma-demo-key";

  /* ---------- 1. Memorie separate dall'app vera (stesso sito github.io) ---------- */
  const P = "demo:";
  const SP = Storage.prototype, g0 = SP.getItem, s0 = SP.setItem, r0 = SP.removeItem;
  const isLS = (st) => { try { return st === window.localStorage; } catch (e) { return false; } };
  SP.getItem = function (k) { return g0.call(this, isLS(this) && k !== KEY_STORE ? P + k : k); };
  SP.setItem = function (k, v) { return s0.call(this, isLS(this) && k !== KEY_STORE ? P + k : k, v); };
  SP.removeItem = function (k) { return r0.call(this, isLS(this) && k !== KEY_STORE ? P + k : k); };
  if (window.caches && caches.open) { const o = caches.open.bind(caches); caches.open = (n) => o("demo-" + n); }

  const ls = { get(k, f) { try { const v = localStorage.getItem(k); return v == null ? f : JSON.parse(v); } catch (e) { return f; } },
               set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  /* ---------- 2. Stato simulato ---------- */
  let S = ls.get("demo-stato", null) || DEMO.NORMALE();
  let ver = ls.get("demo-ver", 1);
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  const isoDay = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  function stem() {
    const d = new Date(); if (S.a.nodom) d.setDate(d.getDate() - 1); // "domani non ancora uscito": uso il bollettino di ieri
    const hh = 14 + Math.floor(ver / 60) % 3, mm = ver % 60;     // l'ora cambia a ogni modifica: l'app lo vede come bollettino nuovo
    return ymd(d) + "_" + pad(hh) + pad(mm);
  }

  /* ---------- 3. Generatori dei dati ---------- */
  const real = window.fetch.bind(window);
  const json = (o, st) => new Response(JSON.stringify(o), { status: st || 200, headers: { "Content-Type": "application/json" } });
  const text = (t, type) => new Response(t, { status: 200, headers: { "Content-Type": type || "text/plain; charset=utf-8" } });
  const tpl = {};
  const loadTpl = (n) => tpl[n] || (tpl[n] = real("demo-data/" + n + ".json").then((r) => r.json()));
  const LV = ["Assenza di fenomeni significativi prevedibili / NESSUNA ALLERTA", "Ordinaria criticità / ALLERTA GIALLA", "Moderata criticità / ALLERTA ARANCIONE", "Elevata criticità / ALLERTA ROSSA"];
  const hasCave = (list) => { try { const a = Array.isArray(list) ? list : JSON.parse(String(list).replace(/'/g, '"')); return a.some((c) => String(c).toLowerCase() === "cave"); } catch (e) { return /'Cave'/.test(String(list)); } };

  async function criticita(which) {
    const t = structuredClone(await loadTpl("criticita"));
    // "today"/"tomorrow" del bollettino: con "domani non ancora uscito" il file tomorrow di ieri è l'oggi
    const lv = S.a.nodom ? (which === "tomorrow" ? S.a.oggi : [0, 0, 0]) : (which === "today" ? S.a.oggi : S.a.dom);
    for (const g of Object.values(t.objects)[0].geometries) {
      const p = g.properties || {}, mine = hasCave(p.Comuni);
      const [i, d, tt] = mine ? lv : [0, 0, 0];
      p["Per rischio idrogeologico"] = LV[i]; p["Per rischio idraulico"] = LV[d]; p["Per rischio temporali"] = LV[tt];
      p["Rappresentata nella mappa"] = LV[Math.max(i, d, tt)];
    }
    return t;
  }
  const VIGRAW = "https://raw.githubusercontent.com/pcm-dpc/DPC-Bollettini-Vigilanza-Meteorologica/master/files/";
  function vigIndex() {
    const day = (k) => ({ topo_json: [VIGRAW + "topojson/DEMO" + ver + "_" + k + ".json", VIGRAW + "topojson/DEMO" + ver + "_fenomeni_" + k + ".json"], html_description: vigText(k) });
    return { date: ymd(new Date()), name: "Bollettino di Vigilanza Meteo (simulato)", today: day("oggi"), tomorrow: day("domani"), aftertomorrow: day("dopodomani") };
  }
  function vigText(k) {
    const cls = k === "oggi" ? S.m.p[0] : k === "domani" ? S.m.p[1] : 1, f = k === "oggi" ? S.m.f : k === "domani" ? S.m.fd : [];
    const out = [];
    const temp = f.some((x) => x >= 5 && x <= 7), sparse = f.includes(1) || f.includes(2);
    if (cls > 1 || temp || sparse) out.push(`<p><strong>Precipitazioni:</strong> ${f.includes(2) ? "diffuse" : "sparse"}${temp ? ", anche a carattere di rovescio o temporale," : ""} sul Lazio, con quantitativi cumulati ${PIOGGE_T[cls]}.</p>`);
    if (f.includes(3) || f.includes(4)) out.push(`<p><strong>Nevicate:</strong> ${f.includes(4) ? "abbondanti" : "deboli o moderate"} sui rilievi del Lazio.</p>`);
    const venti = f.filter((x) => x >= 10 && x <= 13);
    if (venti.length) out.push(`<p><strong>Venti:</strong> ${venti.includes(12) ? "di tempesta" : venti.includes(11) ? "di burrasca" : "forti"} sul Lazio${venti.includes(13) ? ", con frequenti raffiche" : ""}.</p>`);
    if (f.some((x) => x >= 60)) out.push(`<p><strong>Temperature:</strong> ${f.includes(61) ? "molto elevate" : f.includes(60) ? "elevate o in aumento" : f.includes(63) ? "molto basse" : "basse o in calo"} sul Lazio.</p>`);
    if (f.includes(20) || f.includes(21)) out.push(`<p><strong>Gelate:</strong> diffuse ${f.includes(21) ? "anche in pianura" : "in collina"} nel Lazio.</p>`);
    if (f.includes(30) || f.includes(31)) out.push(`<p><strong>Visibilità:</strong> nebbie ${f.includes(31) ? "persistenti anche nelle ore diurne" : "nelle ore notturne e del primo mattino"} nel Lazio.</p>`);
    return out.join("");
  }
  const PIOGGE_T = ["", "non rilevanti", "deboli", "moderati", "elevati", "molto elevati"];
  async function vigZones(k) {
    const t = structuredClone(await loadTpl("vigilanza"));
    const cls = k === "oggi" ? S.m.p[0] : k === "domani" ? S.m.p[1] : 1;
    for (const g of Object.values(t.objects)[0].geometries) {
      const p = g.properties || {}; const c = hasCave(p.comuni) ? cls : 1;
      p.id_classificazione = String(c); p.Quantitativi_previsti = DEMO.PIOGGE[c];
    }
    return t;
  }
  function vigFen(k) {
    const f = k === "oggi" ? S.m.f : k === "domani" ? S.m.fd : [];
    return { type: "Topology", objects: { fenomeni: { type: "GeometryCollection", geometries: f.map((id, i) => ({ type: "Point", coordinates: [0, 0], properties: { id_fenomeno: id, lat: DEMO.CAVE.lat + 0.02 * Math.sin(i), lon: DEMO.CAVE.lon + 0.02 * Math.cos(i) } })) } }, arcs: [] };
  }
  function fdsn() {
    const rows = ["#EventID|Time|Latitude|Longitude|Depth/Km|Author|Catalog|Contributor|ContributorID|MagType|Magnitude|MagAuthor|EventLocationName|EventType"];
    S.q.forEach((q, i) => rows.push([9000 + i, new Date(q.at).toISOString().slice(0, 23), q.la, q.lo, q.d, "DEMO", "", "", "", "ML", q.M, "--", q.n + " (simulata)", "earthquake"].join("|")));
    return rows.join("\n") + "\n";
  }
  function meteo() {
    const d = new Date(), time = [0, 1, 2].map((i) => { const x = new Date(d); x.setDate(d.getDate() + i); return isoDay(x); });
    const c = (j) => S.m.fc.map((r) => +r[j]);
    return { daily: { time, temperature_2m_max: c(0), temperature_2m_min: c(1), wind_gusts_10m_max: c(2), precipitation_sum: c(3) } };
  }
  function csv() {
    const q = (s) => '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"';
    const it = (s) => { const [y, m, dd] = String(s).split("-"); return dd + "/" + m + "/" + y; };
    return ["tipo,titolo,testo,data,ora,luogo,mostra fino al,link"].concat(S.b.map((b) => [b.k, b.ti, b.te, it(b.d), b.o || "", b.l || "", "", ""].map(q).join(","))).join("\n");
  }
  function dae() {
    return { fonte: "Demo", aggiornato: new Date().toISOString(), dae: DEMO.DAE.map((x, i) => ({ ...x, ...(S.dae.includes(i) ? { descrizione: "Non disponibile al momento" } : {}) })) };
  }

  /* bollettino vero dall'archivio DPC, mostrato come se fosse oggi */
  const REPO = "https://api.github.com/repos/pcm-dpc/DPC-Bollettini-Criticita-Idrogeologica-Idraulica";
  const RAW = "https://raw.githubusercontent.com/pcm-dpc/DPC-Bollettini-Criticita-Idrogeologica-Idraulica/master/files/topojson/";
  const archMem = {};
  async function archStem(day) {
    if (archMem[day]) return archMem[day];
    const r = await real(`${REPO}/commits?path=files/topojson&since=${day}T00:00:00Z&until=${day}T23:59:59Z&per_page=5`);
    const list = await r.json();
    for (const c of list) {
      const d = await (await real(`${REPO}/commits/${c.sha}`)).json();
      const f = (d.files || []).map((x) => x.filename).find((n) => /files\/topojson\/\d{8}_\d{4}_(today|tomorrow)\.json$/.test(n));
      if (f) return (archMem[day] = f.match(/(\d{8}_\d{4})/)[1]);
    }
    throw new Error("nessun bollettino in quella data");
  }

  /* ---------- 4. Le richieste dell'app vengono servite dalla demo ---------- */
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input && input.url || String(input);
    try {
      if (url.includes("api.github.com/repos/pcm-dpc/DPC-Bollettini-Criticita")) {
        if (url.includes("/commits?")) return json([{ sha: "demo-" + stem() }]);
        const m = url.match(/\/commits\/demo-(\d{8}_\d{4})/);
        if (m) return json({ files: [{ filename: `files/topojson/${m[1]}_today.json` }, { filename: `files/topojson/${m[1]}_tomorrow.json` }] });
      }
      if (url.includes("DPC-Bollettini-Criticita") && url.includes("/files/topojson/")) {
        const which = /_tomorrow\.json/.test(url) ? "tomorrow" : "today";
        if (S.a.arch) { const st = await archStem(S.a.arch); return real(RAW + st + "_" + which + ".json"); }
        return json(await criticita(which));
      }
      if (url.includes("DPC-Bollettini-Vigilanza-Meteorologica")) {
        let m;
        if ((m = url.match(/files\/(\d{8})\.json/))) return m[1] === ymd(new Date()) ? json(vigIndex()) : json({}, 404);
        if ((m = url.match(/DEMO\d+_fenomeni_(\w+)\.json/))) return json(vigFen(m[1]));
        if ((m = url.match(/DEMO\d+_(\w+)\.json/))) return json(await vigZones(m[1]));
      }
      if (url.includes("webservices.ingv.it/fdsnws") || url.includes("seismicportal.eu/fdsnws")) return S.q.length ? text(fdsn()) : new Response(null, { status: 204 });
      if (url.includes("api.open-meteo.com/v1/forecast")) return json(meteo());
      if (url.includes("api.open-meteo.com/data/")) { const d = new Date(); d.setUTCHours(0, 0, 0, 0); return json({ last_run_initialisation_time: d.getTime() / 1000 }); }
      if (url.includes("docs.google.com/spreadsheets")) return text(csv(), "text/csv; charset=utf-8");
      if (/(^|\/)dae\.json(\?|$)/.test(url)) return json(dae());
    } catch (e) { console.warn("[demo]", e); return new Response("", { status: 503 }); }
    return real(input, init);
  };

  /* ---------- 5. Applicare un nuovo stato ---------- */
  function placeKey() { const p = ls.get("allerta-luogo", { mode: "comune", name: "Cave" }); return p.mode === "geo" ? "g:" + (+p.lat).toFixed(2) + "," + (+p.lon).toFixed(2) : "c:" + String(p.name || "").toLowerCase(); }
  function setIeri() {
    // "alzata/abbassata rispetto a ieri": scrivo cosa prevedeva ieri il bollettino per oggi
    const h = ls.get("allerta-storico", {}), today = +ymd(new Date()), pk = placeKey();
    for (const k of Object.keys(h)) if (k.endsWith("|" + today)) delete h[k];
    if (S.a.ieri >= 0 && !S.a.arch) { const y = new Date(); y.setDate(y.getDate() - 1); h[pk + "|" + today] = { lvl: S.a.ieri, stem: ymd(y) + "_1400" }; }
    ls.set("allerta-storico", h);
  }
  let pending = null;
  function refresh() {
    const btn = document.getElementById("bcr-refresh");
    if (!btn) return;
    if (btn.disabled) { clearTimeout(pending); pending = setTimeout(refresh, 800); return; }
    // prima i ricaricamenti normali (DAE, bacheca…), poi quello forzato: così l'ultimo a partire è quello con i dati nuovi
    document.dispatchEvent(new Event("visibilitychange"));
    const t = window.toast; window.toast = () => {};           // niente messaggi "nuovo bollettino" durante la regia
    btn.click();
    setTimeout(() => { window.toast = t; }, 2500);
  }
  function apply(s, quiet) {
    S = Object.assign(DEMO.NORMALE(), s || {});
    ver = (ver % 179) + 1; ls.set("demo-ver", ver); ls.set("demo-stato", S);
    setIeri(); strip();
    ls.set("allerta-meta", { stem: stem(), checkedAt: Date.now() }); // anche i controlli automatici dell'app vedono subito il bollettino nuovo
    if (!quiet) refresh();
  }

  function demoToast(msg) {
    const t = document.getElementById("toast"); if (!t) return;
    t.textContent = msg; t.hidden = false; clearTimeout(demoToast.t); demoToast.t = setTimeout(() => (t.hidden = true), 2600);
  }

  /* ---------- 6. Notifica simulata ---------- */
  function notify(ti, te) {
    const n = document.createElement("div"); n.className = "demo-ntf";
    n.innerHTML = `<img src="icons/icon-192.png" alt=""><div><div class="h">Cave Informa<span>ora</span></div><p><b></b><br><span></span></p></div>`;
    n.querySelector("p b").textContent = ti || ""; n.querySelector("p span").textContent = te || "";
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add("in"));
    n.addEventListener("click", () => n.remove());
    setTimeout(() => { n.classList.remove("in"); setTimeout(() => n.remove(), 500); }, 7000);
  }

  /* ---------- 7. Collegamento con la regia (ntfy.sh) ---------- */
  const key = (location.hash.match(/k=([\w-]+)/) || [])[1] || localStorage.getItem(KEY_STORE);
  if (key) try { localStorage.setItem(KEY_STORE, key); } catch (e) {}
  let lastFromRegia = 0;
  const seen = new Set();
  function handle(msg, fresh) {
    if (!msg || typeof msg !== "object") return;
    if (msg.id && seen.has(msg.id)) return; if (msg.id) seen.add(msg.id);
    if (msg.type === "state" && msg.s) { if (fresh) { lastFromRegia = Date.now(); status(); } if ((msg.s.t || 0) <= (S.t || 0)) return; apply(msg.s); }
    else if (msg.type === "notify" && fresh) notify(msg.ti, msg.te);
    else if (msg.type === "ping" && fresh) { lastFromRegia = Date.now(); status(); hello(); }
  }
  function status() { try { window.parent.postMessage({ demoStatus: { online: !!esOpen, regia: Date.now() - lastFromRegia < 5 * 60e3, key } }, "*"); } catch (e) {} }
  let es = null, esOpen = false;
  function hello() { if (key) real(DEMO.NTFY + DEMO.topic(key), { method: "POST", body: JSON.stringify({ type: "hello", id: Math.random().toString(36).slice(2), t: Date.now() }) }).catch(() => {}); }
  function connect() {
    if (!key || !window.EventSource) return;
    const start = Date.now();
    es = new EventSource(DEMO.NTFY + DEMO.topic(key) + "/sse?since=12h");
    es.onopen = () => { esOpen = true; status(); hello(); };
    es.onerror = () => { esOpen = false; status(); };
    es.onmessage = (ev) => {
      try { const m = JSON.parse(ev.data); if (m.event !== "message") return;
        const inner = JSON.parse(m.message); const fresh = m.time * 1000 > start - 30e3;
        handle(inner, fresh);
      } catch (e) {}
    };
  }
  window.addEventListener("message", (ev) => { if (ev.data && ev.data.demoMsg) handle(ev.data.demoMsg, true); if (ev.data && ev.data.demoAsk) status(); });
  setInterval(() => { status(); if (esOpen) hello(); }, 60e3);

  /* ---------- 8. Aspetto della demo ---------- */
  const css = `
  .demo-strip{position:fixed;top:0;left:0;right:0;z-index:200;padding:calc(env(safe-area-inset-top,0px) + 3px) 10px 3px;text-align:center;font:800 .7rem/1.3 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#3B2F00;background:repeating-linear-gradient(135deg,#F2C21B 0 14px,#FFD84D 14px 28px);box-shadow:0 2px 8px rgba(0,0,0,.15)}
  body.demo-has-strip header.top{top:20px} body.demo-has-strip{padding-top:20px}
  .demo-fab{position:fixed;right:14px;bottom:calc(var(--nav-h,64px) + env(safe-area-inset-bottom,0px) + 34px);z-index:150;width:52px;height:52px;border-radius:50%;border:0;background:#1d2733;color:#fff;font-size:1.4rem;box-shadow:0 8px 22px rgba(0,0,0,.3);cursor:pointer}
  .demo-ntf{position:fixed;left:10px;right:10px;top:calc(env(safe-area-inset-top,0px) + 10px);z-index:300;display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:22px;background:rgba(245,245,247,.95);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:0 10px 30px rgba(0,0,0,.28);font-family:-apple-system,system-ui,sans-serif;color:#111;transform:translateY(-140%);transition:transform .45s cubic-bezier(.2,.9,.3,1.2);cursor:pointer}
  .demo-ntf.in{transform:none}
  .demo-ntf img{width:38px;height:38px;border-radius:9px;flex:none}.demo-ntf>div{flex:1;min-width:0}
  .demo-ntf .h{display:flex;justify-content:space-between;font-size:13px;font-weight:700}.demo-ntf .h span{color:#777;font-weight:500}
  .demo-ntf p{margin:2px 0 0;font-size:14px;line-height:1.3}
  .demo-panel{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center}
  .demo-panel iframe{width:100%;max-width:520px;height:86vh;border:0;border-radius:22px 22px 0 0;background:#0F1720}
  .demo-panel button{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;border:0;background:#fff;font-size:1.2rem}`;
  function strip() {
    const el = document.querySelector(".demo-strip"); if (!el) return;
    el.textContent = "Modalità dimostrazione · dati simulati" + (S.a.arch ? " · bollettino reale del " + S.a.arch.split("-").reverse().join("/") : "");
    try { window.parent.postMessage({ demoArch: S.a.arch || null }, "*"); } catch (e) {}
  }
  function openLocal() {
    const p = document.createElement("div"); p.className = "demo-panel";
    p.innerHTML = `<iframe src="regia.html#k=${encodeURIComponent(key || "")}&local=1" title="Regia"></iframe><button aria-label="Chiudi">✕</button>`;
    p.querySelector("button").onclick = () => p.remove();
    p.addEventListener("click", (e) => { if (e.target === p) p.remove(); });
    document.body.appendChild(p);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    if (inFrame) { const h = document.createElement("style"); h.textContent = "html{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}"; document.head.appendChild(h); }
    if (!inFrame) {
      const s = document.createElement("div"); s.className = "demo-strip"; document.body.appendChild(s); document.body.classList.add("demo-has-strip");
      const f = document.createElement("button"); f.className = "demo-fab"; f.textContent = "⚙️"; f.setAttribute("aria-label", "Regia della demo"); f.onclick = openLocal; document.body.appendChild(f);
    }
    strip(); setIeri();
    // nella demo il 112 e gli altri numeri non chiamano davvero
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest('a[href^="tel:"]');
      if (!a) return; e.preventDefault(); e.stopPropagation();
      const n = a.getAttribute("href").slice(4);
      demoToast("Demo: qui partirebbe la chiamata al " + n);
    }, true);
    connect(); status();
  });
  window.DEMO_APPLY = (s) => handle({ type: "state", s, id: "local" + Date.now() }, true);
})();
