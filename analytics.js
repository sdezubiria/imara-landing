/* Loads GA4 and Microsoft Clarity when their IDs are set in config.js,
 * and exposes window.imaraTrack(eventName, params) for the rest of the page. */
(function () {
  var cfg = window.IMARA_CONFIG || {};

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  if (cfg.GA4_ID) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(cfg.GA4_ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", cfg.GA4_ID);
  }

  if (cfg.CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", cfg.CLARITY_ID);
  }

  window.imaraTrack = function (name, params) {
    params = params || {};
    if (cfg.GA4_ID) gtag("event", name, params);
    if (cfg.CLARITY_ID && window.clarity) window.clarity("event", name);
    if (!cfg.GA4_ID && !cfg.CLARITY_ID && window.console) console.info("[track]", name, params);
  };
})();
