/* ==========================================================================
   portrait.js — interactive portrait: cursor tilt + parallax, scroll moods,
   hero -> docked circular avatar. Vanilla JS, no dependencies.
   Markup: #pt-slot (hero placeholder), #pt-stage (see README), #pt-bubble, #pt-close
   Section ids that trigger moods: hero, about, skills, experience, projects, contact
   ========================================================================== */
(function () {
  'use strict';
  const stage = document.getElementById('pt-stage');
  if (!stage) return;
  const slot = document.getElementById('pt-slot');
  const bubble = document.getElementById('pt-bubble');
  const closeBtn = document.getElementById('pt-close');
  const card = stage.querySelector('.pt-card');
  const imgHero = stage.querySelector('.pt-img-hero');
  const glare = stage.querySelector('.pt-glare');
  const imgAv = stage.querySelector('.pt-img-av');
  const chips = Array.from(stage.querySelectorAll('.pt-chip'));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- if a picture can't load, show an "SN" badge instead of alt text ---------- */
  [imgHero, imgAv].forEach((img) => {
    if (!img) return;
    const fail = () => {
      stage.classList.add('pt-noimg');
      console.warn('[portrait] image failed to load: ' + (img.currentSrc || img.src) + ' - check the path in your HTML (e.g. assets/sravani-900.jpg)');
    };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- scroll "moods": small lean + a one-line caption per section ---------- */
  const MOODS = {
    hero:       { rz: 0,    s: 1,    line: "Hi, I'm Sravani \u{1F44B}" },
    about:      { rz: -1.5, s: 1,    line: '3.6 years building data pipelines' },
    skills:     { rz: 1.5,  s: 1.01, line: 'GCP \u00B7 AWS \u00B7 Python \u00B7 SQL' },
    experience: { rz: -2,   s: 1,    line: 'Fission Labs \u2192 Infosys' },
    projects:   { rz: 2,    s: 1.03, line: "Here's what I've built" },
    contact:    { rz: 0,    s: 1.04, line: "Let's talk!" },
  };
  const FUN = [
    'I turn raw data into something useful.',
    'Idempotent pipelines let me sleep at night.',
    'Partition early, query cheaply.',
    'Data quality checks: the unsung heroes.',
    'It works on my cluster!',
  ];

  const S = { tx: 0, ty: 0, x: 0, y: 0, dx: 0, dy: 0, rz: 0, s: 1, trz: 0, ts: 1, p: 1, hidden: false, mood: null, lastShow: 0 };

  /* ---------- docking: hero slot -> small circular avatar bottom-right ---------- */
  function dockBox() {
    const w = (isTouch || innerWidth < 700) ? 92 : 132;
    return { w, x: innerWidth - w - 18, y: innerHeight - w - 18 };
  }
  function layout() {
    if (S.hidden) return;
    const d = dockBox();
    let p = 1, x = d.x, y = d.y, w = d.w, h = d.w;
    if (slot && !reduce) {
      const heroH = (slot.closest('section') || document.body).offsetHeight || innerHeight;
      p = clamp(scrollY / (heroH * 0.55), 0, 1);
      const e = p * p * (3 - 2 * p);
      const r = slot.getBoundingClientRect();
      x = lerp(r.left, d.x, e); y = lerp(r.top, d.y, e);
      w = lerp(r.width, d.w, e); h = lerp(r.height, d.w, e);
      p = e;
    }
    S.p = p;
    stage.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    stage.style.width = w + 'px';
    stage.style.height = h + 'px';
    stage.style.setProperty('--w', w + 'px');
    stage.style.setProperty('--r', lerp(28, Math.min(w, h) / 2, p) + 'px');
    stage.style.setProperty('--avOp', clamp((p - 0.35) / 0.4, 0, 1));
    stage.style.setProperty('--chipOp', clamp(1 - p * 2.2, 0, 1));
    if (closeBtn) {
      closeBtn.style.left = (x + w - 22) + 'px';
      closeBtn.style.top = (y - 4) + 'px';
      const on = p > 0.95;
      closeBtn.style.opacity = on ? 1 : 0;
      closeBtn.style.pointerEvents = on ? 'auto' : 'none';
    }
  }

  /* ---------- cursor tilt + parallax (desktop) ---------- */
  if (!isTouch && !reduce) {
    addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      S.tx = clamp((e.clientX - cx) / (innerWidth / 2), -1, 1);
      S.ty = clamp((e.clientY - cy) / (innerHeight / 2), -1, 1);
    }, { passive: true });
  }

  function frame() {
    // ease toward targets
    S.x = lerp(S.x, S.tx, 0.08); S.y = lerp(S.y, S.ty, 0.08);
    S.rz = lerp(S.rz, S.trz, 0.06); S.s = lerp(S.s, S.ts, 0.06);
    const k = 1 - S.p * 0.6;                       // calmer tilt when docked
    card.style.transform =
      'rotateY(' + (S.x * 10 * k).toFixed(2) + 'deg) rotateX(' + (-S.y * 7 * k).toFixed(2) + 'deg) ' +
      'rotateZ(' + S.rz.toFixed(2) + 'deg) scale(' + S.s.toFixed(3) + ')';
    // photo slides the opposite way = depth illusion
    stage.style.setProperty('--px', (-S.x * 14 * k).toFixed(1) + 'px');
    stage.style.setProperty('--py', (-S.y * 10 * k).toFixed(1) + 'px');
    stage.style.setProperty('--dx', S.x.toFixed(3));
    stage.style.setProperty('--dy', S.y.toFixed(3));
    if (glare) {
      glare.style.setProperty('--gx', (50 + S.x * 35).toFixed(1) + '%');
      glare.style.setProperty('--gy', (25 + S.y * 30).toFixed(1) + '%');
    }
    if (bubble.classList.contains('show')) placeBubble();
    raf = requestAnimationFrame(frame);
  }
  let raf = 0;

  /* ---------- speech bubble ---------- */
  let hideT = 0;
  function placeBubble() {
    const r = stage.getBoundingClientRect();
    const bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    const left = clamp(r.left + r.width / 2 - bw / 2, 8, innerWidth - bw - 8);
    const top = r.top - bh - 12 > 72 ? r.top - bh - 12 : (innerWidth < 700 ? 72 : r.bottom + 12);
    bubble.style.left = left + 'px'; bubble.style.top = top + 'px';
  }
  function say(text, hold) {
    if (S.hidden) return;
    clearTimeout(hideT);
    bubble.textContent = text;
    bubble.classList.add('show'); placeBubble();
    hideT = setTimeout(() => bubble.classList.remove('show'), hold || 2600);
  }
  function pop() {
    card.classList.remove('pt-pop'); void card.offsetWidth; card.classList.add('pt-pop');
  }

  /* ---------- scroll moods via IntersectionObserver (section crossing mid-screen) ---------- */
  function setMood(id) {
    const m = MOODS[id]; if (!m || S.mood === id) return;
    S.mood = id; S.trz = reduce ? 0 : m.rz; S.ts = reduce ? 1 : m.s;
    if (reduce) return;
    pop();
    const now = Date.now();
    if (now - S.lastShow > 1500) { S.lastShow = now; say(m.line); }
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setMood(en.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    Object.keys(MOODS).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- events ---------- */
  stage.addEventListener('click', () => { pop(); say(FUN[Math.floor(Math.random() * FUN.length)]); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); S.hidden = true; stage.classList.add('is-hidden');
    closeBtn.style.display = 'none'; bubble.classList.remove('show');
  });
  addEventListener('scroll', () => requestAnimationFrame(layout), { passive: true });
  addEventListener('resize', layout);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) raf = requestAnimationFrame(frame);
  });

  layout();
  if (!reduce) { raf = requestAnimationFrame(frame); setTimeout(() => say(MOODS.hero.line), 900); }
  window.Portrait = { say, setMood };
})();
