(function () {
  "use strict";
  var cfg = window.IMARA_CONFIG || {};
  var track = window.imaraTrack || function () {};

  /* ---------- header: solid once the page scrolls, mobile menu ---------- */
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function onScroll() {
    header.classList.toggle("is-solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  toggle.addEventListener("click", function () {
    var open = !header.classList.contains("menu-open");
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* active nav link */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) spy.observe(t); });
  }

  /* ---------- scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealEls.length && !reduceMotion && "IntersectionObserver" in window) {
    revealEls.forEach(function (el) {
      // small stagger between siblings that reveal together
      var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
      var i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 90, 360) + "ms");
    });
    document.documentElement.classList.add("has-reveal");
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        rio.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { rio.observe(el); });
  }

  /* ---------- location map (Leaflet, loaded when the section gets close) ---------- */
  var MAP = {
    // Club Campestre de Ibagué, geocoded with Nominatim (OSM way 30927829)
    club: [4.3999, -75.16258],
    // Imara: a single point east of the golf course, between Avenida Mirolindo,
    // Calle 145 and the Variante. No boundary is drawn until Imara confirms one.
    imara: [4.3962, -75.1552],
    labels: [
      { at: [4.4040, -75.1560], text: "Avenida Mirolindo" },
      { at: [4.3962, -75.1458], text: "Calle 145" },
      { at: [4.3912, -75.1640], text: "Variante Ibagué–Armenia" }
    ],
    leafletJs: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js",
    leafletJsSri: "sha512-BwHfrr4c9kmRkLw6iXFdzcdWV/PGkVgiIyIWLLlTSXzWQzxuSg4DiQUCpauz/EWjgk5TYQqX/kvn9pG1NpYfqg==",
    leafletCss: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
    leafletCssSri: "sha512-Zcn6bjR/8RZbLEpLIeOwNtzREBAJnUKESxces60Mpoj+2okopSAcSUIUOseddDm0cxnGQzxIR7vJgsLZbdLE3w=="
  };

  var mapEl = document.querySelector("[data-map]");
  var mapStarted = false;

  function mapFailed() {
    var fb = document.querySelector("[data-map-fallback]");
    if (fb) fb.hidden = false;
  }

  function loadLeaflet(done) {
    if (window.L) return done();
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = MAP.leafletCss; css.integrity = MAP.leafletCssSri; css.crossOrigin = "";
    document.head.appendChild(css);
    var js = document.createElement("script");
    js.src = MAP.leafletJs; js.integrity = MAP.leafletJsSri; js.crossOrigin = ""; js.async = true;
    js.onload = function () { window.L ? done() : mapFailed(); };
    js.onerror = mapFailed;
    document.head.appendChild(js);
  }

  function buildMap() {
    var L = window.L;
    var touch = window.matchMedia("(pointer: coarse)").matches;
    var map = L.map(mapEl, {
      scrollWheelZoom: false,
      dragging: !touch,          // one finger keeps scrolling the page on phones; two fingers move the map
      tap: false,
      zoomSnap: 0.25,
      attributionControl: true
    });
    map.attributionControl.setPrefix(false);

    var layers = {
      satelite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Imágenes © Esri, Maxar, Earthstar Geographics"
      }),
      mapa: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Mapa © Esri, HERE, Garmin, colaboradores de <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
      })
    };
    var current = layers.mapa.addTo(map);   // street map by default

    L.marker(MAP.imara, {
      title: "Imara Ciudad Campestre", alt: "Imara Ciudad Campestre",
      icon: L.divIcon({ className: "map-pin is-imara", iconSize: [22, 22], iconAnchor: [11, 11] })
    }).addTo(map);
    L.marker(MAP.imara, { interactive: false, keyboard: false, icon: L.divIcon({ className: "map-label is-name", html: "Imara", iconSize: null, iconAnchor: [-16, 14] }) }).addTo(map);

    L.marker(MAP.club, {
      title: "Club Campestre de Ibagué", alt: "Club Campestre de Ibagué",
      icon: L.divIcon({ className: "map-pin", iconSize: [16, 16], iconAnchor: [8, 8] })
    }).addTo(map);
    L.marker(MAP.club, { interactive: false, keyboard: false, icon: L.divIcon({ className: "map-label is-club", html: "Club Campestre<br>de Ibagué", iconSize: null, iconAnchor: [-10, 14] }) }).addTo(map);

    MAP.labels.forEach(function (l) {
      L.marker(l.at, { interactive: false, keyboard: false, icon: L.divIcon({ className: "map-label", html: l.text, iconSize: null, iconAnchor: [0, 8] }) }).addTo(map);
    });

    var bounds = L.latLngBounds([MAP.imara, MAP.club]);
    MAP.labels.forEach(function (l) { bounds.extend(l.at); });
    function fit() { map.fitBounds(bounds, { paddingTopLeft: [16, 52], paddingBottomRight: [72, 16] }); }
    fit();
    window.addEventListener("resize", function () { map.invalidateSize(); });

    var sw = document.querySelector("[data-map-switch]");
    if (sw) {
      sw.hidden = false;
      sw.addEventListener("click", function (e) {
        var b = e.target.closest("[data-layer]");
        if (!b) return;
        var key = b.getAttribute("data-layer");
        if (layers[key] === current) return;
        map.removeLayer(current);
        current = layers[key].addTo(map);
        var street = key === "mapa";
        mapEl.classList.toggle("is-street", street);
        sw.querySelectorAll("[data-layer]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        track("map_layer", { layer: key });
      });
    }
    map.once("zoomstart dragstart", function () { track("map_interact", {}); });
  }

  function startMap() {
    if (mapStarted || !mapEl) return;
    mapStarted = true;
    loadLeaflet(function () {
      try { buildMap(); } catch (err) { console.error(err); mapFailed(); }
    });
  }

  if (mapEl) {
    if ("IntersectionObserver" in window) {
      var mio = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) { mio.disconnect(); startMap(); }
      }, { rootMargin: "600px 0px" });
      mio.observe(mapEl);
    } else {
      startMap();
    }
  }

  /* ---------- video tracking ---------- */
  document.querySelectorAll("[data-track-video]").forEach(function (v) {
    var name = v.getAttribute("data-track-video"), sent = {};
    v.addEventListener("play", function () {
      v.parentElement.classList.add("is-playing");
      if (!sent.start) { sent.start = 1; track("video_start", { video_title: name }); }
    });
    v.addEventListener("timeupdate", function () {
      if (!v.duration) return;
      [50, 90].forEach(function (pct) {
        if (!sent[pct] && v.currentTime / v.duration * 100 >= pct) { sent[pct] = 1; track("video_progress", { video_title: name, video_percent: pct }); }
      });
    });
  });

  /* ---------- CTA tracking + interest preselect ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-cta]");
    if (!a) return;
    track("cta_click", { cta: a.getAttribute("data-cta") });
    var interest = a.getAttribute("data-interest");
    if (interest) {
      var sel = document.getElementById("f-interes");
      if (sel) sel.value = interest;
    }
  });

  /* ---------- lead form ---------- */
  var form = document.querySelector("[data-lead-form]");
  if (form) {
    var status = form.querySelector("[data-status]");
    var submit = form.querySelector("[data-submit]");
    var label = form.querySelector("[data-submit-label]");
    var started = false;

    form.addEventListener("input", function (e) {
      if (!started) { started = true; track("form_start", { form_name: "registro" }); }
      var f = e.target.closest(".field");
      if (f && f.classList.contains("is-invalid") && e.target.checkValidity()) f.classList.remove("is-invalid");
    });
    form.addEventListener("change", function (e) {
      var f = e.target.closest(".field");
      if (f && e.target.checkValidity()) f.classList.remove("is-invalid");
    });

    function validate() {
      var firstBad = null;
      ["nombre", "correo", "telefono", "interes", "habeas_data"].forEach(function (name) {
        var input = form.elements[name];
        var bad = !input.checkValidity() || (input.type !== "checkbox" && !input.value.trim());
        input.closest(".field").classList.toggle("is-invalid", bad);
        input.setAttribute("aria-invalid", String(bad));
        if (bad && !firstBad) firstBad = input;
      });
      if (firstBad) firstBad.focus();
      return !firstBad;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";
      if (!validate()) return;
      if (form.elements.empresa.value) return; // bot

      var data = new URLSearchParams();
      ["nombre", "correo", "telefono", "interes", "habeas_data"].forEach(function (n) { data.append(n, form.elements[n].value.trim()); });
      data.append("pagina", location.href);
      data.append("referrer", document.referrer || "");
      var qs = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) { data.append(k, qs.get(k) || ""); });

      submit.disabled = true;
      label.textContent = "Enviando…";

      var send = cfg.FORM_ENDPOINT
        ? fetch(cfg.FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: data })
        : new Promise(function (r) { console.warn("[form] FORM_ENDPOINT vacío en config.js: modo demo, no se envió nada."); setTimeout(r, 600); });

      send.then(function () {
        track("generate_lead", { form_name: "registro", interes: form.elements.interes.value });
        form.classList.add("is-sent");
        status.classList.add("is-ok");
        status.textContent = "¡Gracias, " + form.elements.nombre.value.trim().split(" ")[0] + "! El equipo de Imara te contactará pronto.";
      }).catch(function () {
        status.classList.add("is-error");
        status.textContent = "No pudimos enviar tus datos. Revisa tu conexión e inténtalo de nuevo.";
        submit.disabled = false;
        label.textContent = "Quiero información";
      });
    });
  }

  /* ---------- footer year ---------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
