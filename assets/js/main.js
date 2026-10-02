/* Harlem Clubhouse Tarifa - site logic.
   Everything editable lives in assets/js/config.js. */
(function () {
  "use strict";

  var S = window.SITE || {};
  var COPY = S.copy || {};
  var UTM = { source: "harlemclubhousetarifa", medium: "website", campaign: "clubhouse_site" };
  var NO_UTM = /(^mailto:|^tel:|wa\.me|whatsapp\.com|instagram\.com)/i;
  var HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";

  /* ----------------------------------------------------- helpers */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function value(path) {
    var parts = String(path).split("."), v = COPY, i;
    for (i = 0; i < parts.length; i++) {
      if (v == null) return null;
      v = v[parts[i]];
    }
    return v == null ? null : v;
  }

  function text(path) {
    var v = value(path);
    return typeof v === "string" ? v : "";
  }

  function list(path) {
    var v = value(path);
    return Array.isArray(v) ? v : [];
  }

  function isUrl(v) { return typeof v === "string" && /^https?:\/\//i.test(v); }

  function withUtm(url, content) {
    if (!isUrl(url) || NO_UTM.test(url)) return url;
    try {
      var u = new URL(url);
      u.searchParams.set("utm_source", UTM.source);
      u.searchParams.set("utm_medium", UTM.medium);
      u.searchParams.set("utm_campaign", UTM.campaign);
      if (content) u.searchParams.set("utm_content", content);
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  function outbound(url, content) {
    var a = node("a");
    a.href = withUtm(url, content);
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  /* Links that are still "TODO" stay visible but do nothing. */
  function setLink(a, url) {
    if (isUrl(url)) {
      a.href = url;
      a.removeAttribute("data-unset");
    } else {
      a.href = "#";
      a.setAttribute("data-unset", "true");
    }
    return a;
  }

  function whatsappLink(label, cls) {
    var a = node("a", cls, label);
    setLink(a, (S.links || {}).whatsapp);
    a.setAttribute("data-track-whatsapp", "");
    if (isUrl((S.links || {}).whatsapp)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  /* Current wall clock in a given timezone, as plain strings. */
  function clockIn(tz) {
    var d = new Date(), parts = {};
    try {
      new Intl.DateTimeFormat("en-GB", {
        timeZone: tz || "Europe/Madrid", hour12: false,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
      }).formatToParts(d).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) {
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      parts = {
        year: String(d.getFullYear()), month: pad(d.getMonth() + 1), day: pad(d.getDate()),
        hour: pad(d.getHours()), minute: pad(d.getMinutes())
      };
    }
    var hour = parts.hour === "24" ? "00" : parts.hour;
    return { date: parts.year + "-" + parts.month + "-" + parts.day, time: hour + ":" + parts.minute };
  }

  function inRange(deg, range) {
    if (!range || typeof range.from !== "number" || typeof range.to !== "number") return false;
    return range.from <= range.to
      ? (deg >= range.from && deg <= range.to)
      : (deg >= range.from || deg <= range.to);
  }

  /* ----------------------------------------------------- analytics */

  function initAnalytics() {
    var domain = (S.analytics || {}).plausibleDomain;
    if (!domain) return;
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    var s = document.createElement("script");
    s.defer = true;
    s.setAttribute("data-domain", domain);
    s.src = "https://plausible.io/js/script.outbound-links.js";
    document.head.appendChild(s);
  }

  function track(name, props) {
    if (typeof window.plausible === "function") {
      window.plausible(name, props ? { props: props } : undefined);
    }
  }

  /* ----------------------------------------------------- copy and links */

  function applyCopy() {
    if ((S.site || {}).title) document.title = S.site.title;
    var desc = $('meta[name="description"]');
    if (desc && (S.site || {}).description) desc.setAttribute("content", S.site.description);

    $$("[data-copy]").forEach(function (n) {
      var t = text(n.getAttribute("data-copy"));
      if (t) n.textContent = t;
    });
    $$("[data-copy-alt]").forEach(function (n) {
      var t = text(n.getAttribute("data-copy-alt"));
      if (t) n.setAttribute("alt", t);
    });
    $$("[data-copy-aria]").forEach(function (n) {
      var t = text(n.getAttribute("data-copy-aria"));
      if (t) n.setAttribute("aria-label", t);
    });
  }

  function applyLinks() {
    var links = S.links || {};
    $$('[data-link="whatsapp"]').forEach(function (a) { setLink(a, links.whatsapp); });
    $$('[data-link="instagram"]').forEach(function (a) { setLink(a, links.instagram); });
  }

  /* Header logo falls back to the brand name if the file is missing. */
  function logoFallback() {
    $$("[data-logo]").forEach(function (img) {
      img.addEventListener("error", function () {
        var span = node("span", "logo-text", text("header.logoFallback"));
        if (img.parentNode) img.parentNode.replaceChild(span, img);
      });
    });
  }

  /* ----------------------------------------------------- events */

  function nextEvent() {
    var tz = ((S.webcam || {}).liveHours || {}).timezone || "Europe/Madrid";
    var now = clockIn(tz);
    var nowKey = now.date + "T" + now.time;
    return (S.events || [])
      .filter(function (e) { return e && typeof e.date === "string" && e.date.length === 10; })
      .map(function (e) { return { event: e, key: e.date + "T" + (e.time || "23:59") }; })
      .filter(function (x) { return x.key >= nowKey; })
      .sort(function (a, b) { return a.key < b.key ? -1 : (a.key > b.key ? 1 : 0); })
      .map(function (x) { return x.event; })[0] || null;
  }

  function eventDateLabel(e) {
    var days = list("dates.days"), months = list("dates.months");
    var p = e.date.split("-");
    var d = new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
    if (isNaN(d.getTime()) || !days.length || !months.length) return e.date;
    return days[d.getUTCDay()] + " " + Number(p[2]) + " " + months[d.getUTCMonth()];
  }

  function renderEvent() {
    var host = $("#event");
    if (!host) return;
    clear(host);
    var e = nextEvent();

    if (!e) {
      var empty = node("div", "card card--empty");
      empty.appendChild(node("h3", "card__title", text("events.emptyTitle")));
      empty.appendChild(node("p", "card__text", text("events.emptyText")));
      empty.appendChild(whatsappLink(text("events.emptyButton"), "btn btn--primary"));
      host.appendChild(empty);
      return;
    }

    var card = node("article", "card event");
    if (e.image) {
      var img = node("img", "event__image");
      img.src = e.image;
      img.alt = e.title || "";
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);
    }
    var body = node("div", "event__body");
    var meta = node("p", "event__meta");
    meta.appendChild(node("span", "event__date", eventDateLabel(e)));
    if (e.time) meta.appendChild(node("span", "event__time", e.time));
    if (e.place) meta.appendChild(node("span", "event__place", e.place));
    body.appendChild(meta);
    body.appendChild(node("h3", "card__title", e.title || ""));
    if (e.description) body.appendChild(node("p", "card__text", e.description));
    if (isUrl(e.url)) {
      var link = outbound(e.url, "event_" + (e.date || ""));
      link.className = "link link--arrow";
      link.textContent = text("events.details");
      body.appendChild(link);
    }
    card.appendChild(body);
    host.appendChild(card);
  }

  /* ----------------------------------------------------- webcam */

  function camSource(w) {
    switch ((w.provider || "none").toLowerCase()) {
      case "youtube": return w.youtubeChannelId || w.youtubeVideoId || "";
      case "iframe": return w.iframeUrl || "";
      case "hls": return w.hlsUrl || "";
      default: return "";
    }
  }

  function camState() {
    var w = S.webcam || {};
    if (!camSource(w)) return "soon";
    var hours = w.liveHours || {};
    if (hours.start && hours.end) {
      var now = clockIn(hours.timezone).time;
      var open = hours.start <= hours.end
        ? (now >= hours.start && now <= hours.end)
        : (now >= hours.start || now <= hours.end);
      if (!open) return "offline";
    }
    return "live";
  }

  function camIframe(src) {
    var f = document.createElement("iframe");
    f.className = "cam__embed";
    f.src = src;
    f.title = text("webcam.frameTitle");
    f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    f.setAttribute("allowfullscreen", "");
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    return f;
  }

  function camVideo(url) {
    var v = document.createElement("video");
    v.className = "cam__embed";
    v.muted = true;
    v.autoplay = true;
    v.controls = true;
    v.setAttribute("muted", "");
    v.setAttribute("autoplay", "");
    v.setAttribute("playsinline", "");
    v.playsInline = true;
    v.setAttribute("aria-label", text("webcam.frameTitle"));

    var start = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };

    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = url;
      start();
    } else if (window.Hls) {
      attachHls(v, url, start);
    } else {
      var s = document.createElement("script");
      s.src = HLS_CDN;
      s.async = true;
      s.onload = function () { attachHls(v, url, start); };
      document.head.appendChild(s);
    }
    return v;
  }

  function attachHls(video, url, start) {
    if (!window.Hls || !window.Hls.isSupported()) return;
    var hls = new window.Hls({ lowLatencyMode: true });
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, start);
  }

  function camCard(title, body, withButton, event) {
    var card = node("div", "cam__card");
    card.appendChild(node("h2", "cam__title", title));
    card.appendChild(node("p", "cam__text", body));
    if (event) {
      var line = node("p", "cam__next");
      line.appendChild(node("span", "cam__next-date", eventDateLabel(event)));
      line.appendChild(node("span", "cam__next-title", event.title || ""));
      card.appendChild(line);
    }
    if (withButton) card.appendChild(whatsappLink(text("webcam.soonButton"), "btn btn--primary"));
    return card;
  }

  var currentCamState = null;

  function renderCam(force) {
    var frame = $("#cam-frame");
    var badge = $("#cam-badge");
    if (!frame) return;
    var state = camState();
    if (!force && state === currentCamState) return;
    currentCamState = state;
    clear(frame);
    if (badge) badge.hidden = state !== "live";
    frame.setAttribute("data-state", state);

    if (state === "soon") {
      frame.appendChild(camCard(text("webcam.soonTitle"), text("webcam.soonText"), true, null));
      return;
    }
    if (state === "offline") {
      frame.appendChild(camCard(text("webcam.offlineTitle"), text("webcam.offlineText"), false, nextEvent()));
      return;
    }

    var w = S.webcam || {};
    var params = "autoplay=1&mute=1&playsinline=1&rel=0";
    switch ((w.provider || "").toLowerCase()) {
      case "youtube":
        frame.appendChild(camIframe(w.youtubeChannelId
          ? "https://www.youtube.com/embed/live_stream?channel=" + encodeURIComponent(w.youtubeChannelId) + "&" + params
          : "https://www.youtube.com/embed/" + encodeURIComponent(w.youtubeVideoId) + "?" + params));
        break;
      case "iframe":
        frame.appendChild(camIframe(w.iframeUrl));
        break;
      case "hls":
        frame.appendChild(camVideo(w.hlsUrl));
        break;
    }
  }

  /* ----------------------------------------------------- wind */

  var CARDINALS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                   "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

  function cardinal(deg) {
    return CARDINALS[Math.round(((deg % 360) + 360) % 360 / 22.5) % 16];
  }

  function windName(deg) {
    var w = S.wind || {};
    if (inRange(deg, w.levante)) return text("wind.levante");
    if (inRange(deg, w.poniente)) return text("wind.poniente");
    return "";
  }

  function renderForecastLinks() {
    var host = $("#wind-forecast");
    if (!host) return;
    var f = S.forecast || {};
    var items = [
      { url: f.windguru, label: text("wind.windguru"), id: "windguru" },
      { url: f.windfinder, label: text("wind.windfinder"), id: "windfinder" }
    ].filter(function (x) { return isUrl(x.url); });

    if (!items.length) { host.hidden = true; return; }
    host.hidden = false;
    host.appendChild(document.createTextNode(text("wind.forecastLabel") + " "));
    items.forEach(function (item, i) {
      if (i) host.appendChild(document.createTextNode(" · "));
      var a = outbound(item.url, item.id);
      a.className = "link";
      a.textContent = item.label;
      host.appendChild(a);
    });
  }

  function fillWind(data) {
    var c = data && data.current;
    if (!c || typeof c.wind_speed_10m !== "number") throw new Error("no data");
    var deg = Number(c.wind_direction_10m) || 0;

    $("#wind-knots").textContent = String(Math.round(c.wind_speed_10m));
    $("#wind-gusts").textContent = String(Math.round(c.wind_gusts_10m || 0));
    $("#wind-cardinal").textContent = cardinal(deg);

    var arrow = $("#wind-arrow");
    arrow.style.transform = "rotate(" + (deg + 180) + "deg)";
    var dir = $("#wind-direction");
    dir.setAttribute("aria-label", text("wind.directionPrefix") + " " + cardinal(deg));

    var name = $("#wind-name");
    var label = windName(deg);
    name.textContent = label;
    name.hidden = !label;

    $("#wind-data").hidden = false;
  }

  function loadWind() {
    var box = $("#wind-data");
    if (!box) return;
    var loc = S.location || {};
    if (typeof loc.lat !== "number" || typeof loc.lon !== "number") { box.hidden = true; return; }

    var tz = ((S.webcam || {}).liveHours || {}).timezone || "Europe/Madrid";
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + loc.lat + "&longitude=" + loc.lon +
      "&current=wind_speed_10m,wind_gusts_10m,wind_direction_10m&wind_speed_unit=kn&timezone=" + encodeURIComponent(tz);

    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 8000) : null;

    fetch(url, controller ? { signal: controller.signal } : undefined)
      .then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        return r.json();
      })
      .then(fillWind)
      .catch(function () { box.hidden = true; })
      .then(function () { if (timer) clearTimeout(timer); });
  }

  function renderWind() {
    var embed = (S.wind || {}).embedHtml;
    if (embed) {
      var host = $("#wind-embed");
      var data = $("#wind-data");
      if (host) { host.innerHTML = embed; host.hidden = false; }
      if (data) data.remove();
      renderForecastLinks();
      return;
    }
    renderForecastLinks();
    loadWind();
    var minutes = Number((S.wind || {}).refreshMinutes) || 10;
    setInterval(loadWind, minutes * 60 * 1000);
  }

  /* ----------------------------------------------------- partners */

  function initials(name) {
    return String(name || "").split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  function renderPartners() {
    var host = $("#partners");
    if (!host) return;
    clear(host);

    (S.partners || []).forEach(function (p) {
      if (!p || !p.name) return;
      var card = outbound(p.url, p.slug || p.name);
      card.className = "partner";
      card.setAttribute("data-partner", p.slug || "");

      var mark = node("div", "partner__mark");
      if (p.logo) {
        var img = node("img", "partner__logo");
        img.src = p.logo;
        img.alt = p.name;
        img.loading = "lazy";
        img.decoding = "async";
        mark.appendChild(img);
      } else {
        mark.appendChild(node("span", "partner__initials", initials(p.name)));
      }
      card.appendChild(mark);

      if (p.category) card.appendChild(node("p", "partner__category", p.category));
      card.appendChild(node("h3", "partner__name", p.name));
      if (p.description) card.appendChild(node("p", "partner__text", p.description));
      if (p.perk) card.appendChild(node("p", "partner__perk", p.perk));

      host.appendChild(card);
    });
  }

  /* ----------------------------------------------------- footer */

  function renderFooterBrands() {
    var host = $("#footer-brands");
    if (!host) return;
    clear(host);
    ((S.footer || {}).brands || []).forEach(function (b) {
      if (!b || !b.name) return;
      if (isUrl(b.url)) {
        var a = outbound(b.url, b.id || b.name);
        a.className = "footer__brand";
        a.textContent = b.name;
        host.appendChild(a);
      } else {
        host.appendChild(node("span", "footer__brand footer__brand--plain", b.name));
      }
    });
  }

  function renderSponsor() {
    var host = $("#sponsor");
    if (!host) return;
    clear(host);
    var s = S.sponsor;

    if (s && s.name) {
      host.appendChild(node("p", "sponsor__label", text("footer.sponsorLabel")));
      var holder = isUrl(s.url) ? outbound(s.url, "sponsor_" + (s.slug || s.name)) : node("span");
      holder.className = "sponsor__link";
      if (s.logo) {
        var img = node("img", "sponsor__logo");
        img.src = s.logo;
        img.alt = s.name;
        img.loading = "lazy";
        img.decoding = "async";
        holder.appendChild(img);
      } else {
        holder.appendChild(node("span", "sponsor__name", s.name));
      }
      host.appendChild(holder);
      return;
    }

    var email = (S.links || {}).contactEmail;
    var line = node("p", "sponsor__ask");
    if (email && email.indexOf("@") > 0) {
      var a = node("a", "link", text("footer.sponsorEmpty"));
      a.href = "mailto:" + email;
      line.appendChild(a);
    } else {
      line.appendChild(node("span", "sponsor__ask-text", text("footer.sponsorEmpty")));
    }
    host.appendChild(line);
  }

  /* ----------------------------------------------------- click handling */

  function initClicks() {
    document.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a") : null;
      if (!a) return;
      if (a.getAttribute("data-unset") === "true") { ev.preventDefault(); return; }
      if (a.hasAttribute("data-track-whatsapp")) track("Join WhatsApp");
      var slug = a.getAttribute("data-partner");
      if (slug) track("Partner Click", { partner: slug });
    });
  }

  /* ----------------------------------------------------- boot */

  function init() {
    initAnalytics();
    applyCopy();
    applyLinks();
    logoFallback();
    renderCam(true);
    renderWind();
    renderEvent();
    renderPartners();
    renderFooterBrands();
    renderSponsor();
    initClicks();
    // the cam flips itself between live and offline without a reload
    setInterval(function () { renderCam(false); }, 60 * 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
