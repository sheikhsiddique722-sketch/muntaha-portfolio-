/* =========================================================
   TYPING EFFECT
   ========================================================= */
const phrases = [
  'frontend developer student',
  'AI enthusiast',
  'building with HTML · CSS · JS',
  'designing with intention',
  'always learning, always shipping'
];
const typedEl = document.getElementById('typed');
let pIdx = 0, cIdx = 0, deleting = false;

function tick() {
  const word = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(tick, 1600); return; }
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(tick, deleting ? 35 : 70);
}
tick();

/* =========================================================
   NAV SCROLLED STATE
   ========================================================= */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

/* =========================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      const fill = e.target.querySelector?.('.skill-card__bar-fill');
      if (fill) {
        requestAnimationFrame(() => {
          fill.style.width = fill.dataset.fill + '%';
        });
      }
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* =========================================================
   LOCAL TIME (Karachi)
   ========================================================= */
function updateTime() {
  const now = new Date();
  const opts = { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: true };
  const t = new Intl.DateTimeFormat('en-US', opts).format(now);
  document.getElementById('local-time').textContent = `Karachi · ${t} local`;
}
updateTime();
setInterval(updateTime, 30000);

/* =========================================================
   CONTACT FORM — Formspree
   ========================================================= */
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const status = document.getElementById('form-status');

  btn.style.opacity = '0.6';
  btn.disabled = true;
  status.textContent = 'Sending…';
  status.style.color = '';

  const data = new FormData(form);

  fetch('https://formspree.io/f/mnjrlrjg', {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
      btn.style.opacity = '1';
      btn.disabled = false;
      status.textContent = "✓ Message sent! I'll be in touch soon.";
      status.style.color = '#7c6fcd';
      form.reset();
      setTimeout(() => {
        status.textContent = 'I read every message personally.';
        status.style.color = '';
      }, 5000);
    } else {
      throw new Error('Failed');
    }
  })
  .catch(() => {
    btn.style.opacity = '1';
    btn.disabled = false;
    status.textContent = '✗ Something went wrong. Please email me directly.';
    status.style.color = '#e57373';
  });
}

/* =========================================================
   PRELOADER
   ========================================================= */
(function () {
  const loader = document.getElementById('preloader');
  const fill   = loader.querySelector('.preloader__fill');

  requestAnimationFrame(() => { fill.style.width = '100%'; });

  const hide = () => {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 1000);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 2400);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 2400));
  }
})();

/* =========================================================
   SCROLL PILL COUNTER
   ========================================================= */
(function () {
  const pill      = document.getElementById('scroll-pill');
  const pillLabel = document.getElementById('pill-label');
  const pillFill  = document.getElementById('pill-fill');

  const SECTIONS = [
    { el: document.querySelector('.hero'),            label: '00 — Intro' },
    { el: document.getElementById('about'),           label: '01 — About' },
    { el: document.getElementById('skills'),          label: '02 — Capabilities' },
    { el: document.getElementById('work'),            label: '03 — Selected Work' },
    { el: document.getElementById('journey'),         label: '04 — Journey' },
    { el: document.getElementById('contact'),         label: '05 — Get in touch' },
  ];

  let currentLabel = '';

  function update() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = Math.min((scrolled / total) * 100, 100);
    pillFill.style.width = pct + '%';

    const mid = scrolled + window.innerHeight * 0.45;
    let active = SECTIONS[0];
    for (const s of SECTIONS) {
      if (s.el && s.el.offsetTop <= mid) active = s;
    }

    if (active.label !== currentLabel) {
      currentLabel = active.label;
      pillLabel.style.opacity = '0';
      setTimeout(() => {
        pillLabel.textContent  = active.label;
        pillLabel.style.opacity = '1';
      }, 180);
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* =========================================================
   MAGNETIC BUTTONS
   ========================================================= */
if (window.innerWidth > 1024) {
  document.querySelectorAll('.btn, .nav__cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* =========================================================
   CURSOR PARTICLE TRAIL
   ========================================================= */
(function () {
  if (window.innerWidth <= 1024) return;
  const N = 10;
  const dots = Array.from({ length: N }, (_, i) => {
    const d = document.createElement('div');
    d.className = 'cursor-trail';
    const s = (6 - i * 0.45);
    d.style.cssText = `width:${s}px;height:${s}px;`;
    document.body.appendChild(d);
    return d;
  });

  const coords = Array.from({ length: N }, () => ({ x: 0, y: 0 }));
  let mouse = { x: 0, y: 0 };

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  }, { passive: true });

  (function animTrail() {
    coords[0].x += (mouse.x - coords[0].x) * 0.38;
    coords[0].y += (mouse.y - coords[0].y) * 0.38;
    for (let i = 1; i < N; i++) {
      coords[i].x += (coords[i-1].x - coords[i].x) * 0.38;
      coords[i].y += (coords[i-1].y - coords[i].y) * 0.38;
    }
    dots.forEach((d, i) => {
      d.style.left    = coords[i].x + 'px';
      d.style.top     = coords[i].y + 'px';
      d.style.opacity = ((N - i) / N) * 0.5;
    });
    requestAnimationFrame(animTrail);
  })();
})();

/* =========================================================
   HAMBURGER MENU
   ========================================================= */
const burger = document.getElementById('nav-burger');
const mobileMenu = document.getElementById('nav-mobile');

burger.addEventListener('click', (e) => {
  e.stopPropagation();
  burger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
  });
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
  }
});

/* =========================================================
   SUBTLE PARALLAX ON HERO PORTRAIT
   ========================================================= */
const portrait = document.querySelector('.hero__portrait');
window.addEventListener('mousemove', (e) => {
  if (!portrait || window.innerWidth < 1024) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 8;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;
  portrait.style.transform = `rotate(${2 - x * 0.2}deg) translate(${x * 0.5}px, ${y * 0.5}px)`;
});

/* =========================================================
   THREE.JS — PARTICLE NETWORK + CODE SYMBOLS
   ========================================================= */
(function () {
  if (typeof THREE === 'undefined' || window.innerWidth < 1024) return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const hero = canvas.parentElement;
  let W = hero.offsetWidth, H = hero.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
  camera.position.z = 22;

  // ── Particle dots ──────────────────────────────────────
  const N = 85;
  const pPos = new Float32Array(N * 3);
  const pVel = [];
  for (let i = 0; i < N; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 46;
    pPos[i*3+1] = (Math.random() - 0.5) * 28;
    pPos[i*3+2] = (Math.random() - 0.5) * 10;
    pVel.push({
      x: (Math.random() - 0.5) * 0.018,
      y: (Math.random() - 0.5) * 0.013,
      z: (Math.random() - 0.5) * 0.006
    });
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x6B5DA0, size: 0.2, transparent: true, opacity: 0.85
  })));

  // ── Connection lines ───────────────────────────────────
  const lPos = new Float32Array(N * N * 6);
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lGeo.setDrawRange(0, 0);
  const lLines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
    color: 0x6B5DA0, transparent: true, opacity: 0.2
  }));
  scene.add(lLines);

  // ── Code symbol sprites ────────────────────────────────
  const SYMS = ['{ }', '</>', '  =>', 'const', ' // ', ' && ', 'npm i', ' git', 'class', 'return'];

  function makeTex(txt) {
    const c = Object.assign(document.createElement('canvas'), { width: 200, height: 72 });
    const ctx = c.getContext('2d');
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.fillStyle = 'rgba(107,93,160,0.92)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, 100, 36);
    return new THREE.CanvasTexture(c);
  }

  const symIdx = [2, 9, 16, 23, 30, 37, 44, 51, 58, 65];
  const sprites = symIdx.map((pidx, si) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeTex(SYMS[si % SYMS.length]), transparent: true, opacity: 0.65
    }));
    sp.scale.set(4.5, 1.7, 1);
    sp.position.set(pPos[pidx*3], pPos[pidx*3+1], pPos[pidx*3+2] + 0.4);
    scene.add(sp);
    return { sp, pidx };
  });

  // ── Mouse ──────────────────────────────────────────────
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / W - 0.5) * 46;
    my = -(e.clientY / H - 0.5) * 28;
  }, { passive: true });

  const THRESH_SQ = 10 * 10;

  (function tick() {
    requestAnimationFrame(tick);

    for (let i = 0; i < N; i++) {
      pPos[i*3]   += pVel[i].x;
      pPos[i*3+1] += pVel[i].y;
      pPos[i*3+2] += pVel[i].z;
      if (Math.abs(pPos[i*3])   > 23) pVel[i].x *= -1;
      if (Math.abs(pPos[i*3+1]) > 14) pVel[i].y *= -1;
      if (Math.abs(pPos[i*3+2]) > 5)  pVel[i].z *= -1;

      // Mouse repel
      const dx = pPos[i*3] - mx * 0.4;
      const dy = pPos[i*3+1] - my * 0.4;
      const d2 = dx*dx + dy*dy;
      if (d2 < 30 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        pVel[i].x += (dx/d) * 0.006;
        pVel[i].y += (dy/d) * 0.006;
        const spd = Math.hypot(pVel[i].x, pVel[i].y);
        if (spd > 0.09) { pVel[i].x *= 0.09/spd; pVel[i].y *= 0.09/spd; }
      }
    }
    pGeo.attributes.position.needsUpdate = true;

    // Sync sprites with their particles
    sprites.forEach(({ sp, pidx }) => {
      sp.position.set(pPos[pidx*3], pPos[pidx*3+1], pPos[pidx*3+2] + 0.4);
    });

    // Draw connections
    let li = 0;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pPos[i*3] - pPos[j*3];
        const dy = pPos[i*3+1] - pPos[j*3+1];
        const dz = pPos[i*3+2] - pPos[j*3+2];
        if (dx*dx + dy*dy + dz*dz < THRESH_SQ) {
          lPos[li++] = pPos[i*3];   lPos[li++] = pPos[i*3+1]; lPos[li++] = pPos[i*3+2];
          lPos[li++] = pPos[j*3];   lPos[li++] = pPos[j*3+1]; lPos[li++] = pPos[j*3+2];
        }
      }
    }
    lGeo.attributes.position.needsUpdate = true;
    lGeo.setDrawRange(0, li / 3);

    camera.position.x += (mx * 0.009 - camera.position.x) * 0.035;
    camera.position.y += (my * 0.009 - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    W = hero.offsetWidth; H = hero.offsetHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });
})();

/* =========================================================
   BACKGROUND — Starfield + Geometric Grid
   ========================================================= */
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-2;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  // ── Stars ──────────────────────────────────────────────
  const STARS = Array.from({ length: 220 }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    0.4 + Math.random() * 1.6,
    drift: 0.15 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
    spd:  0.018 + Math.random() * 0.035,
    col:  Math.random() > 0.6 ? '107,93,160' : '181,171,212'
  }));

  // ── Grid config ────────────────────────────────────────
  const GRID = 72;
  let gridOffset = 0;

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Scrolling geometric grid
    gridOffset = (gridOffset + 0.18) % GRID;
    ctx.strokeStyle = 'rgba(181,171,212,0.07)';
    ctx.lineWidth = 0.6;
    for (let x = -GRID + (gridOffset % GRID); x <= W + GRID; x += GRID) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -GRID + (gridOffset % GRID); y <= H + GRID; y += GRID) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Diagonal accent lines (subtle)
    ctx.strokeStyle = 'rgba(207,199,232,0.04)';
    ctx.lineWidth = 0.4;
    for (let x = -H + (gridOffset * 1.5) % (GRID * 2); x <= W + H; x += GRID * 2) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - H, H); ctx.stroke();
    }

    // Twinkling stars
    STARS.forEach(s => {
      const op = ((Math.sin(t * s.spd + s.phase) + 1) / 2) * 0.65 + 0.05;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.col},${op.toFixed(2)})`;
      ctx.fill();

      // Slow upward drift
      s.y -= s.drift;
      if (s.y + s.r < 0) { s.y = H + s.r; s.x = Math.random() * W; }
    });

    t++;
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });
})();

/* =========================================================
   CODE RAIN — subtle overlay on top of starfield
   ========================================================= */
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const FS = 13;
  const COLS = Math.floor(W / (FS * 1.6));
  const drops = Array.from({ length: COLS }, () => Math.random() * -(H / FS));
  const chars = 'abcdefghijklmnopqrstuvwxyz01{}[]();=></>const let var'.split('');

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function draw() {
    ctx.fillStyle = isDark() ? 'rgba(12,11,18,0.15)' : 'rgba(247,245,242,0.12)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = `${FS}px "Courier New", monospace`;

    drops.forEach((y, i) => {
      const head = Math.random() > 0.92;
      ctx.fillStyle = head
        ? (isDark() ? 'rgba(167,155,210,0.7)' : 'rgba(107,93,160,0.45)')
        : (isDark() ? 'rgba(124,111,205,0.3)' : 'rgba(181,171,212,0.18)');
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * FS * 1.6, y * FS);
      if (y * FS > H && Math.random() > 0.97) drops[i] = 0;
      drops[i] += 0.5;
    });
  }

  /* when theme switches, flush the canvas so old color doesn't linger */
  window.addEventListener('themechange', () => {
    ctx.clearRect(0, 0, W, H);
  });

  setInterval(draw, 55);

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });
})();

/* =========================================================
   VANILLA TILT — SKILL CARDS & ABOUT QUICK
   ========================================================= */
if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 1024) {
  VanillaTilt.init(document.querySelectorAll('.skill-card'), {
    max: 12, speed: 700, glare: true, 'max-glare': 0.08, perspective: 900, scale: 1.03
  });
  VanillaTilt.init(document.querySelectorAll('.about__quick'), {
    max: 5, speed: 900, glare: false, perspective: 1400
  });
  VanillaTilt.init(document.querySelectorAll('.tl-card'), {
    max: 6, speed: 800, glare: false, perspective: 1200, axis: 'x'
  });
}

/* =========================================================
   3D TILT — PROJECT CARDS (custom mouse tracking)
   ========================================================= */
if (window.innerWidth > 1024) {
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      card.style.transform = `translateY(-10px) rotateX(${-y * 4}deg) rotateY(${x * 7}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
      setTimeout(() => { card.style.transform = ''; }, 550);
    });
  });
}

/* =========================================================
   CUSTOM MAGNETIC CURSOR
   ========================================================= */
(function () {
  if (window.innerWidth <= 1024) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  (function trackRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
  })();

  const hoverEls = document.querySelectorAll('a, button, .project, .skill-card, .social, .tl-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width        = '54px';
      ring.style.height       = '54px';
      ring.style.opacity      = '0.65';
      ring.style.borderColor  = 'var(--lavender-deep)';
      dot.style.transform     = 'translate(-50%,-50%) scale(0.4)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width        = '36px';
      ring.style.height       = '36px';
      ring.style.opacity      = '0.35';
      ring.style.borderColor  = 'var(--ink)';
      dot.style.transform     = 'translate(-50%,-50%) scale(1)';
    });
  });
})();

/* =========================================================
   CONTACT CANVAS — GLOWING PARTICLE NETWORK
   ========================================================= */
(function () {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width  || canvas.parentElement.offsetWidth;
    H = canvas.height = rect.height || canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 42;
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * (W || 800),
    y: Math.random() * (H || 500),
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    r: Math.random() * 2.2 + 0.8,
    op: Math.random() * 0.5 + 0.35,
    phase: Math.random() * Math.PI * 2
  }));

  const LINK = 140;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > W) { p.x = W; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > H) { p.y = H; p.vy *= -1; }
      p.phase += 0.018;
    });

    /* connection lines */
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          const alpha = (1 - d / LINK) * 0.28;
          ctx.save();
          ctx.strokeStyle = `rgba(207,199,232,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    /* glowing dots */
    particles.forEach(p => {
      const pulse = Math.sin(p.phase) * 0.35 + 0.65;
      const rCore = p.r * pulse;
      const rGlow = rCore * 9;

      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rGlow);
      grd.addColorStop(0,   `rgba(207,199,232,${p.op * 0.45})`);
      grd.addColorStop(0.4, `rgba(167,155,210,${p.op * 0.15})`);
      grd.addColorStop(1,   'rgba(207,199,232,0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, rGlow, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, rCore, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228,222,248,${p.op})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* =========================================================
   SCROLL PROGRESS BAR
   ========================================================= */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();

/* =========================================================
   ANIMATED STAT COUNTERS
   ========================================================= */
(function () {
  const nums = document.querySelectorAll('.stat__num[data-target]');
  if (!nums.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value + (progress === 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => io.observe(el));
})();

/* =========================================================
   PROJECT DETAIL MODAL
   ========================================================= */
(function () {
  const overlay  = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!overlay) return;

  function openModal(card) {
    const titleEl  = card.querySelector('.project__title');
    const descEl   = card.querySelector('.project__desc');
    const metaEl   = card.querySelector('.project__top span:first-child');
    const badgeEl  = card.querySelector('.badge');
    const imgEl    = card.querySelector('.project__visual img');
    const visualEl = card.querySelector('.project__visual');
    const tagEls   = card.querySelectorAll('.project__tag');
    const url      = card.dataset.url || '';

    document.getElementById('modal-title').textContent = titleEl ? titleEl.textContent : '';
    document.getElementById('modal-desc').textContent  = descEl  ? descEl.textContent  : '';

    const meta = [];
    if (metaEl)  meta.push(metaEl.textContent.trim());
    if (badgeEl) meta.push(badgeEl.textContent.trim());
    document.getElementById('modal-meta').textContent = meta.join(' · ');

    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    tagEls.forEach(t => {
      const span = document.createElement('span');
      span.className = 'project__tag';
      span.textContent = t.textContent;
      tagsContainer.appendChild(span);
    });

    const vis = document.getElementById('modal-visual');
    if (imgEl && imgEl.src && !imgEl.style.display) {
      vis.innerHTML = `<img src="${imgEl.src}" alt="Project preview" onerror="this.parentElement.style.background='${
        visualEl.style.background || 'linear-gradient(135deg,#2a2a30,#1F1F23)'
      }';this.remove()"/>`;
    } else {
      const bgColor = visualEl.style.background || 'linear-gradient(135deg,#2a2a30,#1F1F23)';
      vis.innerHTML = `<div class="gradient-placeholder" style="background:${bgColor};width:100%;height:100%;"></div>`;
    }

    const actions = document.getElementById('modal-actions');
    actions.innerHTML = '';
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'modal-btn modal-btn--primary';
      link.innerHTML = 'Open Live Site <span>↗</span>';
      actions.appendChild(link);
    }
    const closeAction = document.createElement('button');
    closeAction.className = 'modal-btn modal-btn--ghost';
    closeAction.textContent = 'Close';
    closeAction.addEventListener('click', closeModal);
    actions.appendChild(closeAction);

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* =========================================================
   HERO MOUSE PARALLAX
   ========================================================= */
(function () {
  if (window.innerWidth <= 768) return;
  const hero    = document.querySelector('.hero');
  const title   = document.querySelector('.hero__title');
  const badge   = document.querySelector('.hero__badge');
  const visual  = document.querySelector('.hero__visual');
  const eyebrow = document.querySelector('.hero__eyebrow');
  if (!hero || !title) return;

  let tx = 0, ty = 0;
  let cx = 0, cy = 0;
  let active = false;

  hero.addEventListener('mousemove', e => {
    active = true;
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width  - 0.5;
    ty = (e.clientY - r.top)  / r.height - 0.5;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

  /* delay start so reveal animations finish first */
  setTimeout(() => {
    (function lerp() {
      if (active) {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;

        if (title)   title.style.transform   = `translateX(${cx * 14}px) translateY(${cy * 10}px)`;
        if (eyebrow) eyebrow.style.transform = `translateX(${cx * 8}px) translateY(${cy * 6}px)`;
        if (badge)   badge.style.transform   = `translateX(${cx * -22}px) translateY(${cy * -16}px)`;
        if (visual)  visual.style.transform  = `translateX(${cx * -18}px) translateY(${cy * -12}px)`;
      }
      requestAnimationFrame(lerp);
    })();
  }, 2800);
})();

/* =========================================================
   DARK / LIGHT MODE TOGGLE
   ========================================================= */
(function () {
  const btn  = document.getElementById('theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('portfolio-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    window.dispatchEvent(new Event('themechange'));
  });
})();

/* =========================================================
   COPY EMAIL + TOAST
   ========================================================= */
(function () {
  const card  = document.getElementById('email-card');
  const btn   = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const email = document.getElementById('email-value');
  if (!card || !btn || !toast || !email) return;

  let toastTimer;

  function showToast(msg) {
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function copyEmail() {
    const text = email.textContent.trim();
    navigator.clipboard.writeText(text)
      .then(() => showToast('✓ Email copied to clipboard!'))
      .catch(() => showToast('✓ ' + text));
  }

  card.addEventListener('click', copyEmail);
  btn.addEventListener('click', e => { e.stopPropagation(); copyEmail(); });
})();

/* =========================================================
   BACK TO TOP BUTTON
   ========================================================= */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
