(function () {
  "use strict";
  var cfg = window.IMARA_CONFIG || {};
  var track = window.imaraTrack || function () {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header: solid after hero, mobile menu ---------- */
  var header = document.querySelector("[data-header]");
  var hero = document.querySelector(".hero");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function onScroll() {
    var limit = hero ? hero.offsetHeight - 90 : 10;
    header.classList.toggle("is-solid", window.scrollY > limit);
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
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) spy.observe(t); });
  }

  /* ---------- hero video: respect reduced motion ---------- */
  var heroVideo = document.querySelector(".hero-media");
  if (heroVideo && reduceMotion) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }

  /* ---------- reveal on scroll + counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var fmt = function (v) { return v.toFixed(decimals).replace(".", ","); };
    if (reduceMotion) { el.textContent = fmt(target); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll("main .reveal:not(.hero .reveal), .compare");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        en.target.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
      var idx = Array.prototype.indexOf.call(siblings, el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx * 70, 420) + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- masterplan tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      track("masterplan_tab", { tab: tab.textContent.trim() });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        select(tabs[(i + n + tabs.length) % tabs.length], true);
      });
    });
  });

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
