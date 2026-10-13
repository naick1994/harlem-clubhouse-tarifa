/* VIP replay: the same YouTube live as the home page, with its last
   12 hours (YouTube's DVR) behind our own controls. The code below is a
   soft gate for the crew, not real security: the live itself is public
   to anyone who has its id. */
(function () {
  "use strict";

  var CODE_HASH = "bb76ccc9c2bd2abae4acd6d17d7cc0a9e7cff28af9a5882939d8fba960fa6a38";
  var KEY = "vip-ok";
  var WINDOW = 12 * 3600; // seconds YouTube keeps behind the live edge

  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var w = (window.SITE || {}).webcam || {};

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    });
  }

  function remembered() {
    try { return localStorage.getItem(KEY) === CODE_HASH; } catch (e) { return false; }
  }

  function open() {
    $("gate").hidden = true;
    $("replay").hidden = false;
    startPlayer();
  }

  $("gate").addEventListener("submit", function (e) {
    e.preventDefault();
    sha256($("gate-code").value.trim()).then(function (h) {
      if (h !== CODE_HASH) { $("gate-error").hidden = false; return; }
      try { localStorage.setItem(KEY, h); } catch (err) {}
      open();
    });
  });

  if (remembered()) open();

  /* ----------------------------------------------------- the player */

  var player = null, startedAtLive = false, touched = false;

  function clock(date) {
    return date.toLocaleTimeString("en-GB", { timeZone: "Europe/Madrid", hour12: false });
  }

  function lagText(s) {
    if (s < 15) return "Live";
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    if (h) return h + "h " + m + "m behind live";
    if (m) return m + "m " + sec + "s behind live";
    return sec + "s behind live";
  }

  // where the replay can reach: from 12 hours ago (or the start) to the live edge
  function bounds() {
    var end = player.getDuration() || 0;
    return { start: Math.max(0, end - WINDOW), end: end };
  }

  function seek(t) {
    var b = bounds();
    // asked for the very last second YouTube lands somewhere else, so the
    // live edge is reached by aiming a few seconds short of it
    player.seekTo(Math.min(Math.max(t, b.start), b.end - 4), true);
    player.playVideo();
  }

  var dragging = false;

  function tick() {
    if (!player || !player.getCurrentTime) return;
    var b = bounds(), now = player.getCurrentTime() || 0, behind = Math.max(0, b.end - now);
    $("clock").textContent = clock(new Date(Date.now() - behind * 1000));
    $("lag").textContent = lagText(behind);
    $("lag-full").textContent = $("clock").textContent + "  ·  " + lagText(behind);
    all("[data-live]").forEach(function (b) { b.classList.toggle("is-live", behind < 15); });
    var from = clock(new Date(Date.now() - (b.end - b.start) * 1000)).slice(0, 5);
    all("[data-scrub-start]").forEach(function (el) { el.textContent = from; });
    if (!dragging && b.end > b.start) {
      var pos = Math.round(((now - b.start) / (b.end - b.start)) * 1000);
      all("[data-scrub]").forEach(function (el) { el.value = pos; });
    }
    var playing = player.getPlayerState && player.getPlayerState() === 1;
    all("[data-play]").forEach(function (b) {
      b.classList.toggle("is-paused", !playing);
      b.setAttribute("aria-label", playing ? "Pause" : "Play");
    });
    if (playing) $("wait").hidden = true;
  }

  function startPlayer() {
    if (player || !w.youtubeVideoId) return;
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("yt", {
        host: "https://www.youtube-nocookie.com",
        videoId: w.youtubeVideoId,
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, rel: 0,
                      iv_load_policy: 3, playsinline: 1, origin: location.origin },
        events: {
          onReady: function (e) { e.target.mute(); e.target.playVideo(); setInterval(tick, 500); },
          // YouTube resumes where a signed in viewer last stopped, hours back:
          // the first time it plays, start from the live edge instead
          onStateChange: function (e) {
            if (e.data !== 1 || startedAtLive) return;
            startedAtLive = true;
            // and again for the first seconds: the resume can land late
            [300, 2500, 5000, 8000].forEach(function (ms) {
              setTimeout(function () {
                if (!touched && bounds().end - player.getCurrentTime() > 30) seek(bounds().end);
              }, ms);
            });
          }
        }
      });
    };
  }

  // once the viewer moves the replay, the page stops pulling it to the live
  Array.prototype.forEach.call(document.querySelectorAll(".scrub, .pad, .jump, .screen__pad"), function (el) {
    el.addEventListener("pointerdown", function () { touched = true; });
    el.addEventListener("keydown", function () { touched = true; });
  });

  all("[data-scrub]").forEach(function (el) {
    el.addEventListener("input", function () { dragging = true; showPad(); });
    el.addEventListener("change", function () {
      dragging = false;
      var b = bounds();
      seek(b.start + (this.value / 1000) * (b.end - b.start));
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-jump]"), function (btn) {
    btn.addEventListener("click", function () {
      if (player) seek(player.getCurrentTime() + parseInt(btn.getAttribute("data-jump"), 10));
    });
  });

  all("[data-live]").forEach(function (b) {
    b.addEventListener("click", function () { if (player) seek(bounds().end); });
  });

  function togglePlay() {
    if (!player) return;
    if (player.getPlayerState() === 1) player.pauseVideo(); else player.playVideo();
  }
  all("[data-play]").forEach(function (b) { b.addEventListener("click", togglePlay); });

  /* ----------------------------------------------------- full screen
     The picture is pinned as an exact 16:9 box in the middle of a black
     screen, so the logos always sit on it. Where the browser allows it,
     real full screen hides its bars too. A phone turned sideways does it
     on its own. */
  var screen = $("screen"), padTimer = null;
  var isFull = function () { return screen.classList.contains("is-full"); };

  function showPad() {
    screen.classList.add("show-pad");
    clearTimeout(padTimer);
    padTimer = setTimeout(function () { screen.classList.remove("show-pad"); }, 3500);
  }

  function setFull(on) {
    screen.classList.toggle("is-full", on);
    document.documentElement.classList.toggle("is-locked", on);
    if (on) showPad();
  }

  var root = document.documentElement;
  var nativeIn = root.requestFullscreen || root.webkitRequestFullscreen;
  var nativeOut = document.exitFullscreen || document.webkitExitFullscreen;
  var nativeOn = function () { return document.fullscreenElement || document.webkitFullscreenElement; };

  $("zoom").addEventListener("click", function () {
    var on = !isFull();
    setFull(on);
    try {
      if (on && nativeIn && !nativeOn()) { var r = nativeIn.call(root); if (r && r.catch) r.catch(function () {}); }
      if (!on && nativeOn()) nativeOut.call(document);
    } catch (e) {}
  });
  ["fullscreenchange", "webkitfullscreenchange"].forEach(function (ev) {
    document.addEventListener(ev, function () { if (!nativeOn() && !sideways()) setFull(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isFull()) setFull(false); });

  var turn = window.matchMedia &&
    window.matchMedia("(orientation: landscape) and (max-height: 540px) and (pointer: coarse)");
  var sideways = function () { return !!(turn && turn.matches); };
  if (turn) {
    var onTurn = function () { if (!nativeOn()) setFull(sideways()); };
    onTurn();
    if (turn.addEventListener) turn.addEventListener("change", onTurn);
    else if (turn.addListener) turn.addListener(onTurn);
  }

  // a tap on the picture: in full screen it brings the controls back,
  // otherwise it plays or pauses
  $("shield").addEventListener("click", function () { if (isFull()) showPad(); else togglePlay(); });
  screen.addEventListener("pointermove", function () { if (isFull()) showPad(); });
  $("pad").addEventListener("pointerdown", showPad);

  // "go to 16:05": how far back that is from now, in Tarifa time
  $("jump").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!player || !$("jump-time").value) return;
    var parts = $("jump-time").value.split(":"), target = (+parts[0]) * 3600 + (+parts[1]) * 60;
    var nowParts = clock(new Date()).split(":");
    var nowSec = (+nowParts[0]) * 3600 + (+nowParts[1]) * 60 + (+nowParts[2]);
    var back = nowSec - target;
    if (back < 0) back += 86400; // a time later than now means yesterday
    seek(bounds().end - back);
  });
})();
