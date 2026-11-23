/**
 * script.js — Ribbon unfolding intro, music toggle, countdown, and scroll animations
 */

(function () {
  "use strict";

  const W = window.WEDDING_DATA || {};

  /* ------------------------------------------------------------------------
     1. Apply Editable Wedding Data (js/wedding-data.js)
     ------------------------------------------------------------------------ */
  function applyWeddingData() {
    if (W.couple) {
      const coupleEl = document.getElementById("couple-names");
      if (coupleEl && W.couple.groom && W.couple.bride) {
        coupleEl.innerHTML = `${W.couple.groom} <br /><br />${W.couple.bride}`;
      }
      const taglineEl = document.getElementById("married-tagline");
      if (taglineEl && W.couple.tagline) {
        taglineEl.textContent = W.couple.tagline;
      }
    }

    if (W.wedding) {
      const evEl = document.getElementById("event-title");
      if (evEl && W.wedding.eventTitle) {
        evEl.textContent = W.wedding.eventTitle;
      }

      const quoteEl = document.getElementById("closing-quote");
      if (quoteEl && W.wedding.quote) {
        quoteEl.innerHTML = W.wedding.quote;
      }

      const dateEl = document.getElementById("closing-date");
      if (dateEl && W.wedding.dateLabel) {
        dateEl.textContent = W.wedding.dateLabel;
      }
    }

    if (W.media) {
      const overlayImg = document.getElementById("weiImg");
      if (overlayImg && W.media.overlayImage) overlayImg.src = W.media.overlayImage;

      const sealVideo = document.getElementById("weiVideo");
      if (sealVideo && W.media.sealVideo) sealVideo.src = W.media.sealVideo;

      const heroSource = document.getElementById("hero-video-source");
      const heroVideo = document.getElementById("hero-video");
      if (heroSource && heroVideo && W.media.heroVideo) {
        heroSource.src = W.media.heroVideo;
        heroVideo.load();
      }

      const audioEl = document.getElementById("weiAudio");
      if (audioEl && W.media.audio) {
        audioEl.src = W.media.audio;
      }
    }
  }

  /* ------------------------------------------------------------------------
     2. Ribbon Overlay, Unfolding Video Intro & Music Toggle
     ------------------------------------------------------------------------ */
  function initEnvelopeIntro() {
    const overlay = document.getElementById("weiOverlay");
    const videoWrap = document.getElementById("weiVideoWrap");
    const video = document.getElementById("weiVideo");
    const audio = document.getElementById("weiAudio");
    const audioBtn = document.getElementById("weiAudioBtn");
    const iconPause = document.getElementById("weiIconPause");
    const iconPlay = document.getElementById("weiIconPlay");
    if (!overlay || !videoWrap || !video || !audio || !audioBtn) return;

    let opened = false;

    function syncAudioIcon() {
      if (audio.paused) {
        iconPlay.style.display = "block";
        iconPause.style.display = "none";
      } else {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
      }
    }

    audio.addEventListener("play", syncAudioIcon);
    audio.addEventListener("pause", syncAudioIcon);
    audio.addEventListener("playing", syncAudioIcon);

    function endSequence() {
      if (video.dataset.endedSeq) return;
      video.dataset.endedSeq = "1";

      videoWrap.classList.remove("wei-video-in");
      videoWrap.classList.add("wei-video-out");
      setTimeout(() => {
        videoWrap.style.display = "none";
      }, 1200);

      audioBtn.style.visibility = "visible";
      audioBtn.style.opacity = "1";
      syncAudioIcon();
    }

    function startVideo(e) {
      if (e && e.type === "touchend") e.preventDefault();
      if (opened) return;
      opened = true;

      const tapWrap = document.getElementById("weiTapWrap");
      if (tapWrap) tapWrap.style.opacity = "0";

      videoWrap.classList.remove("wei-video-out");
      videoWrap.classList.add("wei-video-in");
      overlay.style.pointerEvents = "none";

      const hideCover = () => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.style.display = "none";
        }, 240);
      };

      const vp = video.play();
      if (vp && vp.then) {
        vp.then(hideCover).catch(() => {
          hideCover();
          endSequence();
        });
      } else {
        hideCover();
      }

      if (!audio.src) {
        audio.src = (W.media && W.media.audio) || "./assets/media/wedding-music.mp3";
      }
      audio.volume = 1;
      const ap = audio.play();
      if (ap && ap.catch) {
        ap.catch(() => {
          syncAudioIcon();
        });
      }
    }

    overlay.addEventListener("click", startVideo);
    overlay.addEventListener("touchend", startVideo);

    video.addEventListener("timeupdate", () => {
      if (video.duration && video.currentTime >= video.duration - 1.05 && !video.dataset.fading) {
        video.dataset.fading = "1";
        endSequence();
      }
    });

    video.addEventListener("ended", endSequence);

    audioBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) {
        audio.play().then(syncAudioIcon).catch(syncAudioIcon);
      } else {
        audio.pause();
        syncAudioIcon();
      }
    });

    video.load();
  }

  /* ------------------------------------------------------------------------
     3. Live Flip Countdown Timer
     ------------------------------------------------------------------------ */
  function initCountdown() {
    const container = document.getElementById("countdownContainer");
    if (!container) return;

    const eventDate =
      W.wedding && W.wedding.dateISO
        ? new Date(W.wedding.dateISO)
        : new Date(2027, 6, 30, 0, 0, 0);

    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMins = document.getElementById("minutes");
    const elSecs = document.getElementById("seconds");
    const prev = { days: null, hours: null, minutes: null, seconds: null };
    let revealed = false;
    let timerId = null;

    function flip(el, newVal) {
      if (!el || el.textContent === newVal) return;
      el.classList.add("flip-out");
      setTimeout(() => {
        el.classList.remove("flip-out");
        el.classList.add("flip-in");
        el.textContent = newVal;
        void el.offsetHeight;
        el.classList.remove("flip-in");
      }, 280);
    }

    function tick() {
      const now = new Date();
      const dist = eventDate - now;
      if (dist < 0) {
        container.innerHTML = "See you there!";
        if (timerId) clearInterval(timerId);
        return;
      }
      const d = String(Math.floor(dist / 86400000));
      const h = String(Math.floor((dist % 86400000) / 3600000)).padStart(2, "0");
      const m = String(Math.floor((dist % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((dist % 60000) / 1000)).padStart(2, "0");

      if (prev.days === null) {
        if (elDays) elDays.textContent = d;
        if (elHours) elHours.textContent = h;
        if (elMins) elMins.textContent = m;
        if (elSecs) elSecs.textContent = s;
      } else {
        if (d !== prev.days) flip(elDays, d);
        if (h !== prev.hours) flip(elHours, h);
        if (m !== prev.minutes) flip(elMins, m);
        if (s !== prev.seconds) flip(elSecs, s);
      }
      prev.days = d;
      prev.hours = h;
      prev.minutes = m;
      prev.seconds = s;
    }

    tick();
    if (eventDate - new Date() >= 0) {
      timerId = setInterval(tick, 1000);
    }

    function doReveal() {
      if (revealed) return;
      revealed = true;
      container.querySelectorAll(".number, .label, .separator").forEach((el) => {
        el.classList.add("revealed");
      });
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            doReveal();
            observer.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      observer.observe(container);
    } else {
      doReveal();
    }

    setTimeout(() => {
      const r = container.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) doReveal();
    }, 200);
  }

  /* ------------------------------------------------------------------------
     4. Scroll-Reveal Animations
     ------------------------------------------------------------------------ */
  function initScrollAnimations() {
    const revealNodes = document.querySelectorAll("[data-reveal]");

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealNodes.forEach((node) => revealObserver.observe(node));
    } else {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    }
  }

  /* ------------------------------------------------------------------------
     Initialize on DOMContentLoaded
     ------------------------------------------------------------------------ */
  function init() {
    applyWeddingData();
    initEnvelopeIntro();
    initCountdown();
    initScrollAnimations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
