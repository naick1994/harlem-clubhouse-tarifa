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

  /* Every main button points at the same place, set by cta.target
     in config.js, so swapping Instagram for WhatsApp is one word. */
  function ctaTarget() {
    var t = String((S.cta || {}).target || "whatsapp").toLowerCase();
    return t === "instagram" ? "instagram" : "whatsapp";
  }

  function ctaLink(cls) {
    var target = ctaTarget();
    var url = (S.links || {})[target];
    var a = node("a", cls, text("buttons." + target));
    setLink(a, url);
    a.setAttribute("data-track-cta", target);
    if (isUrl(url)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function sectionOn(name) {
    return (S.sections || {})[name] !== false;
  }

  /* In Chrome the loading attribute has to be set before src, or a lazy
     image is never fetched at all. Always build lazy images here. */
  function lazyImage(cls, src, alt) {
    var img = node("img", cls);
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = alt || "";
    return img;
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
    var target = ctaTarget();
    $$('[data-link="whatsapp"]').forEach(function (a) { setLink(a, links.whatsapp); });
    $$('[data-link="instagram"]').forEach(function (a) { setLink(a, links.instagram); });

    $$("[data-cta]").forEach(function (a) {
      a.textContent = text("buttons." + target);
      setLink(a, links[target]);
      a.setAttribute("data-track-cta", target);
      if (isUrl(links[target])) { a.target = "_blank"; a.rel = "noopener"; }
    });

    // no point offering Instagram twice in the same block
    if (target === "instagram") {
      $$('.join [data-link="instagram"]').forEach(function (a) { a.hidden = true; });
    }
  }

  /* The venue logo next to ours in the header. */
  function renderVenue() {
    var v = S.venue || {};
    var host = $("#venue");
    var sep = $("#venue-sep");
    if (!host || !v.logo) return;
    var img = node("img", "masthead__venue-logo");
    img.src = v.logo;
    img.alt = v.name || "";
    img.width = 180;
    img.height = 174;
    host.appendChild(img);
    if (isUrl(v.url)) {
      host.href = withUtm(v.url, "venue_header");
      host.target = "_blank";
      host.rel = "noopener";
    }
    host.hidden = false;
    if (sep) sep.hidden = false;
  }

  function applySections() {
    [["wind", "#section-wind"], ["join", "#section-join"],
     ["events", "#section-next"], ["partners", "#section-partners"]]
      .forEach(function (pair) {
        var el = $(pair[1]);
        if (el && !sectionOn(pair[0])) el.hidden = true;
      });
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
      empty.appendChild(ctaLink("btn btn--primary"));
      host.appendChild(empty);
      return;
    }

    var card = node("article", "card event");
    if (e.image) {
      card.appendChild(lazyImage("event__image", e.image, e.title || ""));
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

  /* Logos laid over the live picture. They live in the page, not in the
     stream, so the relay never has to re-encode the video. */
  function camMarks(w, frame) {
    var logos = (w.overlayLogos || []).filter(Boolean);
    if (!logos.length) return;
    var box = node("div", "window__marks window__marks--" + (w.overlayPosition || "top-left"));
    box.setAttribute("aria-hidden", "true");
    logos.forEach(function (src, i) {
      if (i) box.appendChild(node("span", "window__marks-rule"));
      var img = node("img", "window__mark");
      img.src = src;
      img.alt = "";
      box.appendChild(img);
    });
    frame.appendChild(box);
  }

  /* Full screen takes the whole window with it, logos included. Where the
     browser cannot do that (iPhone), the window fills the screen instead. */
  function camZoom(frame, video) {
    var btn = node("button", "window__zoom");
    btn.type = "button";
    btn.setAttribute("aria-label", text("webcam.fullscreen"));
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
    frame.appendChild(btn);

    var native = frame.requestFullscreen || frame.webkitRequestFullscreen;
    var current = function () { return document.fullscreenElement || document.webkitFullscreenElement; };
    var toggle = function () {
      if (native) {
        if (current()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        else native.call(frame);
      } else {
        var on = !frame.classList.contains("is-filled");
        frame.classList.toggle("is-filled", on);
        document.documentElement.classList.toggle("u-locked", on);
      }
    };
    btn.addEventListener("click", toggle);
    video.addEventListener("dblclick", toggle);
    video.addEventListener("click", function () { if (video.paused) playVideo(video); });
  }

  function camVideo() {
    var v = document.createElement("video");
    v.className = "cam__embed";
    v.muted = true;
    v.autoplay = true;
    v.controls = false;
    v.setAttribute("muted", "");
    v.setAttribute("autoplay", "");
    v.setAttribute("playsinline", "");
    v.playsInline = true;
    v.setAttribute("aria-label", text("webcam.frameTitle"));
    var poster = (S.webcam || {}).poster;
    if (poster) v.poster = poster;
    return v;
  }

  function playVideo(v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* The live feed. WebRTC first (under a second behind the beach), HLS
     when WebRTC cannot connect. If the picture stops moving, the player
     tears itself down and tries again, waiting a little longer each time.
     A hidden tab lets go of the stream and picks it up at the live edge
     when it comes back. */
  var FEED = { connecting: "webcam.statusConnecting", playing: "webcam.statusLive", retrying: "webcam.statusRetrying" };

  function setFeed(state) {
    var band = $(".window");
    if (band) band.setAttribute("data-feed", state);
    var status = $("#cam-status-text");
    if (status) status.textContent = text(FEED[state]);
  }

  function camLive(w, frame) {
    var v = camVideo();
    frame.appendChild(v);
    camMarks(w, frame);
    camZoom(frame, v);

    var modes = [];
    if (w.webrtcUrl && window.RTCPeerConnection && window.fetch) modes.push("webrtc");
    if (w.hlsUrl) modes.push("hls");
    var mode = 0, tries = 0, run = 0, stop = null, retry = null, playing = false;
    var lastTime = -1, lastMove = Date.now();

    function teardown() {
      run++;
      if (stop) { stop(); stop = null; }
      clearTimeout(retry);
    }

    function attempt() {
      teardown();
      if (!modes.length) return;
      var id = run;
      playing = false;
      lastTime = -1;
      lastMove = Date.now();
      setFeed(tries ? "retrying" : "connecting");
      var fail = function () { if (id === run) failed(); };
      stop = modes[mode] === "webrtc" ? playWebRTC(v, w.webrtcUrl, fail) : playHls(v, w.hlsUrl, fail);
    }

    function failed() {
      teardown();
      tries++;
      if (!playing) mode = (mode + 1) % modes.length;
      setFeed("retrying");
      retry = setTimeout(attempt, Math.min(30000, 1000 * Math.pow(2, Math.min(tries, 5))));
    }

    function moving() {
      lastMove = Date.now();
      if (!playing) { playing = true; tries = 0; setFeed("playing"); }
    }

    v.addEventListener("timeupdate", function () {
      if (v.currentTime > 0 && v.currentTime !== lastTime) { lastTime = v.currentTime; moving(); }
    });

    var watchdog = setInterval(function () {
      if (document.hidden || !stop) return;
      if (Date.now() - lastMove > (playing ? 8000 : 15000)) failed();
    }, 2000);

    var onVisibility = function () {
      if (document.hidden) { teardown(); setFeed("connecting"); }
      else { tries = 0; attempt(); }
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (document.hidden) setFeed("connecting"); else attempt();

    return {
      destroy: function () {
        teardown();
        clearInterval(watchdog);
        document.removeEventListener("visibilitychange", onVisibility);
        var band = $(".window");
        if (band) band.removeAttribute("data-feed");
      }
    };
  }

  /* WHEP: one POST with our offer, the relay answers with its own. */
  function playWebRTC(video, url, fail) {
    var pc = new RTCPeerConnection();
    var closed = false;
    pc.addTransceiver("video", { direction: "recvonly" });
    pc.ontrack = function (e) {
      video.srcObject = e.streams[0] || new MediaStream([e.track]);
      playVideo(video);
    };
    pc.onconnectionstatechange = function () {
      if (pc.connectionState === "failed") fail();
    };
    pc.createOffer()
      .then(function (offer) { return pc.setLocalDescription(offer); })
      .then(function () { return iceGathered(pc, 1000); })
      .then(function () {
        return fetch(url, { method: "POST", headers: { "Content-Type": "application/sdp" }, body: pc.localDescription.sdp });
      })
      .then(function (res) {
        if (res.status !== 201) throw new Error("whep " + res.status);
        return res.text();
      })
      .then(function (sdp) {
        if (!closed) return pc.setRemoteDescription({ type: "answer", sdp: sdp });
      })
      .catch(function () { if (!closed) fail(); });

    return function () {
      closed = true;
      try { pc.close(); } catch (e) {}
      video.srcObject = null;
    };
  }

  function iceGathered(pc, maxWait) {
    return new Promise(function (resolve) {
      if (pc.iceGatheringState === "complete") return resolve();
      var t = setTimeout(resolve, maxWait);
      pc.addEventListener("icegatheringstatechange", function () {
        if (pc.iceGatheringState === "complete") { clearTimeout(t); resolve(); }
      });
    });
  }

  function playHls(video, url, fail) {
    var hls = null, dead = false;
    var native = function () { video.src = url; playVideo(video); };
    var onError = function () { if (!dead) fail(); };
    video.addEventListener("error", onError);

    withHlsJs(function () {
      if (dead) return;
      if (nativeHls(video)) return native();
      if (!window.Hls || !window.Hls.isSupported()) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) native(); else fail();
        return;
      }
      hls = new window.Hls({ liveSyncDurationCount: 2, maxLiveSyncPlaybackRate: 1.5, backBufferLength: 10 });
      hls.on(window.Hls.Events.ERROR, function (e, data) {
        if (!data.fatal) return;
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else fail();
      });
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () { playVideo(video); });
      hls.loadSource(url);
      hls.attachMedia(video);
    });

    return function () {
      dead = true;
      video.removeEventListener("error", onError);
      if (hls) hls.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }

  function withHlsJs(done) {
    if (window.Hls || nativeHls(document.createElement("video"))) return done();
    var s = document.createElement("script");
    s.src = HLS_CDN;
    s.async = true;
    s.onload = done;
    s.onerror = done;
    document.head.appendChild(s);
  }

  /* Safari plays .m3u8 on its own. Chrome answers "maybe" to the same
     question and then cannot play it, so the native path is only trusted
     on Safari, or where there is no Media Source Extensions at all. */
  function nativeHls(video) {
    if (!video.canPlayType("application/vnd.apple.mpegurl")) return false;
    var ua = navigator.userAgent;
    var isSafari = /safari/i.test(ua) && !/chrome|chromium|crios|android|fxios|edg/i.test(ua);
    return isSafari || !window.MediaSource;
  }

  /* The window shows a photograph of the spot while there is no video. */
  function camPoster() {
    var src = (S.webcam || {}).poster;
    if (!src) return null;
    var img = lazyImage("window__photo", src, "");
    img.loading = "eager";
    img.setAttribute("srcset", "assets/img/cam-poster-900.jpg 900w, " + src + " 1600w");
    img.setAttribute("sizes", "100vw");
    img.alt = "";
    return img;
  }

  /* The message under the window, left aligned like the rest of the page. */
  function renderNote(state) {
    var row = $("#cam-note");
    if (!row) return;
    clear(row);
    if (state === "live") { row.hidden = true; return; }

    var title = state === "offline" ? text("webcam.offlineTitle") : text("webcam.soonTitle");
    var body = state === "offline" ? text("webcam.offlineText") : text("webcam.soonText");
    row.appendChild(node("h2", "window__title", title));
    row.appendChild(node("p", "window__text", body));

    var event = state === "offline" ? nextEvent() : null;
    if (event) {
      var line = node("p", "window__next");
      line.appendChild(node("span", "window__next-date", eventDateLabel(event)));
      line.appendChild(node("span", "window__next-title", event.title || ""));
      row.appendChild(line);
    }
    row.appendChild(ctaLink("button"));
    row.hidden = false;
  }

  var currentCamState = null;
  var camFeed = null;

  var STATUS = { live: "webcam.statusLive", offline: "webcam.statusSleeping", soon: "webcam.statusSoon" };

  function renderCam(force) {
    var frame = $("#cam-frame");
    if (!frame) return;
    var state = camState();
    if (!force && state === currentCamState) return;
    currentCamState = state;
    if (camFeed) { camFeed.destroy(); camFeed = null; }
    clear(frame);
    frame.setAttribute("data-state", state);

    var band = $(".window");
    if (band) band.setAttribute("data-cam", state);
    var place = $("#cam-place");
    if (place) place.textContent = (S.location || {}).name || "";
    var status = $("#cam-status-text");
    if (status) status.textContent = text(STATUS[state]);
    if (state !== "live") showViewers(0);

    renderNote(state);

    if (state !== "live") {
      var poster = camPoster();
      if (poster) frame.appendChild(poster);
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
        camFeed = camLive(w, frame);
        if (w.viewersUrl) startViewers(w.viewersUrl);
        break;
    }
  }

  /* How many people have the page open right now. Each open tab says
     hello to the relay every 15 seconds and gets the head count back. */
  var viewersStarted = false;

  function startViewers(url) {
    if (viewersStarted || !window.fetch) return;
    viewersStarted = true;
    var id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    var ping = function () {
      if (document.hidden) return;
      fetch(url + (url.indexOf("?") < 0 ? "?" : "&") + "id=" + id, { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (d) { showViewers(d && d.online); })
        .catch(function () { showViewers(0); });
    };
    ping();
    setInterval(ping, 15000);
    document.addEventListener("visibilitychange", ping);
  }

  function showViewers(n) {
    var el = $("#cam-viewers");
    if (!el) return;
    n = currentCamState === "live" ? Math.max(0, parseInt(n, 10) || 0) : 0;
    el.textContent = n === 1 ? text("webcam.viewersOne") : text("webcam.viewersMany").replace("{n}", n);
    el.hidden = !n;
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
    items.forEach(function (item) {
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

    var needle = $("#wind-rose-needle");
    if (needle) needle.setAttribute("transform", "rotate(" + Math.round(deg) + " 20 20)");
    var degrees = $("#wind-degrees");
    if (degrees) degrees.textContent = Math.round(deg) + "\u00B0";
    var dir = $("#wind-direction");
    dir.setAttribute("aria-label", text("wind.directionPrefix") + " " + cardinal(deg) + ", " + Math.round(deg) + " degrees");

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

      var mark = node("div", "partner__mark" + (p.logo ? " partner__mark--logo" : ""));
      if (p.logo) {
        var img = lazyImage("partner__logo", p.logo, p.name);
        mark.appendChild(img);
        img.addEventListener("error", function () {
          mark.className = "partner__mark";
          mark.replaceChild(node("span", "partner__initials", initials(p.name)), img);
        });
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

  var MOSAIC_GAP = 4;

  /* A justified photo wall: every row is one height, the widths follow each
     photograph's own shape, and the last photograph of a row absorbs the
     rounding, so a row is always exactly as wide as the page. No holes,
     no two pictures the same size. */
  function layoutMosaic() {
    var strip = $("#photos");
    if (!strip || !strip.clientWidth) return;

    var width = strip.clientWidth;
    var target = width < 700 ? 104 : (width < 1100 ? 132 : 158);
    var items = $$(".mood__item", strip).map(function (el) {
      var w = Number(el.getAttribute("data-w")) || 3;
      var h = Number(el.getAttribute("data-h")) || 2;
      return { el: el, aspect: w / h };
    });
    if (!items.length) return;

    function place(row) {
      var available = width - MOSAIC_GAP * (row.length - 1);
      var sum = 0;
      row.forEach(function (x) { sum += x.aspect; });
      var h = Math.max(60, Math.round(available / sum));
      var used = 0;
      row.forEach(function (x, i) {
        var w = i === row.length - 1 ? available - used : Math.floor(h * x.aspect);
        used += w;
        x.el.style.width = w + "px";
        x.el.style.height = h + "px";
      });
    }

    var rows = [];
    var row = [];
    var sum = 0;
    items.forEach(function (item) {
      row.push(item);
      sum += item.aspect;
      if (sum * target >= width) { rows.push(row); row = []; sum = 0; }
    });
    if (row.length) {
      // a thin last row would stretch two photographs across the page,
      // so it goes back into the row above instead
      if (rows.length && sum * target < width * 0.62) {
        rows[rows.length - 1] = rows[rows.length - 1].concat(row);
      } else {
        rows.push(row);
      }
    }
    rows.forEach(place);
  }

  /* A quiet mosaic of real photographs of the place. */
  function renderPhotos() {
    var host = $("#photos");
    var section = $("#section-photos");
    if (!host || !section) return;
    var photos = (S.photos || []).filter(function (p) { return p && p.src; });
    if (!photos.length) return;
    clear(host);
    photos.forEach(function (p) {
      var figure = node("figure", "mood__item");
      var link = node("a", "mood__link");
      link.href = p.src;
      link.setAttribute("aria-label", text("photos.openHint") || "Open photo");
      var img = lazyImage("mood__photo", p.src, p.alt || "");
      if (p.w && p.h) {
        img.width = p.w;
        img.height = p.h;
        figure.setAttribute("data-w", p.w);
        figure.setAttribute("data-h", p.h);
      }
      link.appendChild(img);
      figure.appendChild(link);
      host.appendChild(figure);
    });
    section.hidden = false;
    layoutMosaic();
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutMosaic, 150);
    });
  }

  /* ----------------------------------------------------- footer */

  /* The motto is a logo when there is one, the words when there is not. */
  function renderTagline() {
    var src = (S.footer || {}).taglineLogo;
    var host = $(".footer__tagline");
    if (!host || !src) return;
    var img = lazyImage("footer__tagline-logo", src, text("footer.line2"));
    img.addEventListener("error", function () { host.classList.remove("footer__tagline--logo"); });
    host.textContent = "";
    host.classList.add("footer__tagline--logo");
    host.appendChild(img);
  }

  function renderPrivacy() {
    var link = $("#footer-privacy");
    if (!link) return;
    var url = (S.footer || {}).privacyUrl;
    if (!url) return;
    link.href = url;
    link.hidden = false;
  }

  function renderFooterBrands() {
    var host = $("#footer-brands");
    if (!host) return;
    clear(host);
    var brands = (S.footer || {}).brands || [];
    host.hidden = !brands.length;
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
        holder.appendChild(lazyImage("sponsor__logo", s.logo, s.name));
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

  /* One wide photograph, full bleed, just before the footer. */
  function renderClosing() {
    var host = $("#section-closing");
    var closing = S.closing || {};
    if (!host || !closing.src) return;
    clear(host);
    host.appendChild(lazyImage("closing__photo", closing.src, closing.alt || ""));
    host.hidden = false;
  }

  /* A photograph opens at full size. Without scripting the link still
     opens the file on its own. */
  var lightbox = null;
  var lastFocus = null;

  function closeLightbox() {
    if (!lightbox) return;
    document.body.style.overflow = "";
    lightbox.parentNode.removeChild(lightbox);
    lightbox = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openLightbox(src, alt) {
    closeLightbox();
    lastFocus = document.activeElement;
    lightbox = node("div", "lightbox");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");

    var img = node("img", "lightbox__photo");
    img.src = src;
    img.alt = alt || "";
    lightbox.appendChild(img);

    var close = node("button", "lightbox__close", text("photos.close") || "Close");
    close.type = "button";
    lightbox.appendChild(close);

    lightbox.addEventListener("click", function (ev) {
      if (ev.target !== img) closeLightbox();
    });
    document.body.appendChild(lightbox);
    document.body.style.overflow = "hidden";
    close.focus();
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeLightbox();
  });

  /* ----------------------------------------------------- click handling */

  function initClicks() {
    document.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a") : null;
      if (!a) return;
      if (a.getAttribute("data-unset") === "true") { ev.preventDefault(); return; }
      if (a.className === "mood__link") {
        ev.preventDefault();
        var photo = a.querySelector("img");
        openLightbox(a.getAttribute("href"), photo ? photo.alt : "");
        return;
      }
      var cta = a.getAttribute("data-track-cta");
      if (cta) track(cta === "instagram" ? "Follow Instagram" : "Join WhatsApp");
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
    renderVenue();
    applySections();
    renderCam(true);
    if (sectionOn("wind")) renderWind();
    if (sectionOn("events")) renderEvent();
    if (sectionOn("partners")) renderPartners();
    renderPhotos();
    renderClosing();
    renderTagline();
    renderPrivacy();
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
