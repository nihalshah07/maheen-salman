/**
 * script.js — Interactive animations, media playback, countdown, and data binding
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
      const subEl = document.getElementById("couple-subtitle");
      if (subEl && W.couple.subtitle) {
        subEl.innerHTML = W.couple.subtitle;
      }
    }

    if (W.wedding) {
      const evEl = document.getElementById("event-title");
      if (evEl && W.wedding.eventTitle) evEl.textContent = W.wedding.eventTitle;

      const dateEl = document.getElementById("wedding-date");
      if (dateEl && W.wedding.dateLabel) dateEl.textContent = W.wedding.dateLabel;

      const invEl = document.getElementById("invitation-note");
      if (invEl && W.wedding.invitationNote) invEl.innerHTML = W.wedding.invitationNote;
    }

    if (Array.isArray(W.schedule) && W.schedule.length > 0) {
      if (W.schedule[0]) {
        const s0Title = document.getElementById("sched-title-0");
        const s0Time = document.getElementById("sched-time-0");
        if (s0Title) s0Title.textContent = W.schedule[0].title;
        if (s0Time) s0Time.textContent = W.schedule[0].time;
      }
      if (W.schedule[1]) {
        const s1Title = document.getElementById("sched-title-1");
        const s1Time = document.getElementById("sched-time-1");
        if (s1Title) s1Title.textContent = W.schedule[1].title;
        if (s1Time) s1Time.textContent = W.schedule[1].time;
      }
    }

    if (W.venue) {
      const vName = document.getElementById("venue-name-display");
      const vAddr = document.getElementById("venue-address-display");
      const mapsBtn = document.getElementById("venue-maps-link");
      if (vName && W.venue.name) vName.textContent = W.venue.name;
      if (vAddr && W.venue.address) vAddr.textContent = W.venue.address;
      if (mapsBtn && W.venue.mapsUrl) mapsBtn.href = W.venue.mapsUrl;
    }

    // Google Calendar Link
    const calBtn = document.getElementById("venue-cal-link");
    if (calBtn && W.couple && W.wedding && W.venue) {
      try {
        const start = new Date(W.wedding.dateISO);
        if (!isNaN(start.getTime())) {
          const end = new Date(start.getTime() + 5 * 3600 * 1000);
          const fmt = (dt) => dt.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
          const title = `${W.couple.groom || "Saaid Bashir"} & ${W.couple.bride || "Ayesha Choudhary"} Walima`;
          const details = W.wedding.invitationNote
            ? W.wedding.invitationNote.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
            : "Walima Celebration";
          const location = `${W.venue.name || ""}, ${W.venue.address || ""}`;
          calBtn.href =
            `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(title)}` +
            `&dates=${fmt(start)}/${fmt(end)}` +
            `&details=${encodeURIComponent(details)}` +
            `&location=${encodeURIComponent(location)}`;
        }
      } catch (_) {}
    }

    // RSVP Contact Card
    if (W.rsvp) {
      const hostName = W.rsvp.name || "Dr. Bashir ahmad Sanaie";
      const rawPhone = W.rsvp.phone || W.rsvp.whatsapp || "9419063190";
      const cleanPhone = String(rawPhone).replace(/\D/g, "");
      const displayPhone = String(rawPhone).startsWith("+")
        ? rawPhone
        : cleanPhone.length === 10
        ? `+91 ${cleanPhone}`
        : rawPhone;
      const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const coupleText = `${W.couple?.groom || "Saaid Bashir"} & ${W.couple?.bride || "Ayesha Choudhary"}`;
      const waMessage = encodeURIComponent(
        `Hello ${hostName}, RSVP for the Walima Celebration of ${coupleText}.`
      );

      const kickerEl = document.getElementById("rsvp-kicker");
      const nameEl = document.getElementById("reply-title");
      const phoneTextEl = document.getElementById("rsvp-phone-text");
      const phoneLinkEl = document.getElementById("rsvp-phone-link");
      const waBtnEl = document.getElementById("rsvp-whatsapp-link");
      const callBtnEl = document.getElementById("rsvp-call-link");

      if (kickerEl && W.rsvp.title) kickerEl.textContent = W.rsvp.title;
      if (nameEl) nameEl.textContent = hostName;
      if (phoneTextEl) phoneTextEl.textContent = displayPhone;
      if (phoneLinkEl) {
        phoneLinkEl.href = `tel:+${waNumber}`;
        phoneLinkEl.setAttribute("aria-label", `Call ${hostName}`);
      }
      if (callBtnEl) {
        callBtnEl.href = `tel:+${waNumber}`;
        callBtnEl.setAttribute("aria-label", `Call ${hostName}`);
      }
      if (waBtnEl) {
        waBtnEl.href = `https://wa.me/${waNumber}?text=${waMessage}`;
        waBtnEl.setAttribute("aria-label", `WhatsApp ${hostName}`);
      }
    }

    // Media Sources
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
     2. Envelope Overlay, Wax-Seal Opening Video & Music Toggle
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
        : new Date(2026, 9, 24, 14, 0, 0);

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
      }, 520);
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
        { threshold: 0.4 }
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
     4. Scroll-Reveal Animations & Scroll-Driven Schedule Rose
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

    // Scroll-driven pink peony gliding down the Schedule vertical line
    const rose = document.getElementById("schedule-rose");
    const scheduleSection = document.getElementById("schedule-section");
    if (!rose || !scheduleSection) return;

    // Exact 4-step scroll curve from reference ([scrollPx, translateY])
    const stops = [
      [0, 0],
      [100, 80],
      [200, 169],
      [300, 247],
      [400, 311],
    ];

    function updateRosePosition() {
      const secRect = scheduleSection.getBoundingClientRect();
      // Rose base offset inside schedule section is top: 140px, trigger at 0.5 viewport height
      const roseInitialTopInViewport = secRect.top + 140;
      const triggerPoint = window.innerHeight * 0.5;
      const scrolled = triggerPoint - roseInitialTopInViewport;

      let y = 0;
      if (scrolled <= 0) {
        y = 0;
      } else if (scrolled >= stops[stops.length - 1][0]) {
        y = stops[stops.length - 1][1];
      } else {
        for (let i = 0; i < stops.length - 1; i++) {
          const [d0, y0] = stops[i];
          const [d1, y1] = stops[i + 1];
          if (scrolled >= d0 && scrolled <= d1) {
            const t = (scrolled - d0) / (d1 - d0);
            y = y0 + t * (y1 - y0);
            break;
          }
        }
      }
      rose.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateRosePosition();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateRosePosition();
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
