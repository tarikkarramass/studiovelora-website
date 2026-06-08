// =============================================================================
//  Studio Velora — main.js  (v6 — WARM PASTEL · STRAK)
//  Lichte 3D-scene (warme pastels) + zachte woord-voor-woord fade-in
// =============================================================================

import * as THREE from 'three';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/addons/postprocessing/OutputPass.js';
import Lenis               from 'lenis';

// =============================================================================
//  CONFIG
// =============================================================================
const PASTELS = [0xef6a5a, 0xf3c14f, 0xffb486, 0xf59072, 0xe0a92f, 0xffd27a];
const C = {
  bg:        0xfdf8ef,
  bloom:     { strength: 0.26, radius: 0.5, threshold: 0.85 },
  camera:    { fov: 58, startZ: 7, endZ: -42, endY: 4 },
  scroll:    { lerp: 0.06, velTilt: 0.04, velDamp: 0.9 },
  objects:   { count: 30, spreadX: 18, spreadY: 12, spreadZ: 52 },
  particles: { count: 2200, spread: 52, size: 0.07 },
};

// =============================================================================
//  LENIS
// =============================================================================
export const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

// =============================================================================
//  RENDERER
// =============================================================================
const canvas   = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping         = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// =============================================================================
//  SCENE
// =============================================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(C.bg);
scene.fog        = new THREE.FogExp2(C.bg, 0.016);

const camera = new THREE.PerspectiveCamera(C.camera.fov, window.innerWidth / window.innerHeight, 0.1, 150);
camera.position.set(0, 0, C.camera.startZ);

// =============================================================================
//  POSTPROCESSING (subtiele bloom)
// =============================================================================
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  C.bloom.strength, C.bloom.radius, C.bloom.threshold
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// =============================================================================
//  LICHTEN
// =============================================================================
scene.add(new THREE.HemisphereLight(0xffffff, 0xfff0dc, 1.05));
scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const dir1 = new THREE.DirectionalLight(0xffffff, 1.1); dir1.position.set(5, 8, 6);  scene.add(dir1);
const dl2  = new THREE.PointLight(0xffb486, 60, 40);    dl2.position.set(-7, 3, -10); scene.add(dl2);
const dl3  = new THREE.PointLight(0xf3c14f, 50, 35);    dl3.position.set(8, -2, -26); scene.add(dl3);
const dl4  = new THREE.PointLight(0xef6a5a, 55, 38);    dl4.position.set(-4, 5, -40); scene.add(dl4);

// =============================================================================
//  ZWEVENDE PASTEL-VORMEN
// =============================================================================
const objects = [];
const geoPool = [
  () => new THREE.IcosahedronGeometry(0.5 + Math.random() * 0.35, 0),
  () => new THREE.OctahedronGeometry(0.5 + Math.random() * 0.3, 0),
  () => new THREE.TetrahedronGeometry(0.55, 0),
  () => new THREE.TorusGeometry(0.4, 0.16, 12, 24),
  () => new THREE.SphereGeometry(0.45, 20, 20),
  () => new THREE.CapsuleGeometry(0.28, 0.4, 6, 14),
  () => new THREE.BoxGeometry(0.65, 0.65, 0.65),
];

for (let i = 0; i < C.objects.count; i++) {
  const geo   = geoPool[Math.floor(Math.random() * geoPool.length)]();
  const color = PASTELS[i % PASTELS.length];
  const mat   = new THREE.MeshStandardMaterial({
    color, roughness: 0.4, metalness: 0.05,
    flatShading: Math.random() > 0.5,
    emissive: new THREE.Color(color), emissiveIntensity: 0.06,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(
    (Math.random() - 0.5) * C.objects.spreadX,
    (Math.random() - 0.5) * C.objects.spreadY,
    -Math.random() * C.objects.spreadZ
  );
  mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
  mesh.scale.setScalar(0.5 + Math.random() * 1.0);
  mesh.userData.rot = new THREE.Vector3(
    (Math.random() - 0.5) * 0.006, (Math.random() - 0.5) * 0.006, (Math.random() - 0.5) * 0.003
  );
  mesh.userData.floatOffset = Math.random() * Math.PI * 2;
  scene.add(mesh);
  objects.push(mesh);
}

// =============================================================================
//  PARTICLES
// =============================================================================
const pPos = new Float32Array(C.particles.count * 3);
const pCol = new Float32Array(C.particles.count * 3);
const tmp  = new THREE.Color();
for (let i = 0; i < C.particles.count; i++) {
  pPos[i*3]   = (Math.random() - 0.5) * C.particles.spread;
  pPos[i*3+1] = (Math.random() - 0.5) * C.particles.spread * 0.5;
  pPos[i*3+2] = -Math.random() * C.particles.spread;
  tmp.setHex(PASTELS[Math.floor(Math.random() * PASTELS.length)]);
  pCol[i*3] = tmp.r; pCol[i*3+1] = tmp.g; pCol[i*3+2] = tmp.b;
}
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
const pMat = new THREE.PointsMaterial({ size: C.particles.size, vertexColors: true, transparent: true, opacity: 0.5, sizeAttenuation: true, depthWrite: false });
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

// =============================================================================
//  GRID-VLOER
// =============================================================================
const grid = new THREE.GridHelper(120, 60, 0xe7c9a0, 0xf0e2cf);
grid.position.y = -6;
grid.material.opacity = 0.22; grid.material.transparent = true;
scene.add(grid);

// =============================================================================
//  MOUSE PARALLAX
// =============================================================================
const mouse = new THREE.Vector2(0, 0);
document.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// =============================================================================
//  SCROLL STATE
// =============================================================================
let scrollY = 0, lastY = 0, vel = 0;
let cZ = C.camera.startZ, cY = 0;
lenis.on('scroll', ({ scroll }) => { scrollY = scroll; });

// =============================================================================
//  CUSTOM CURSOR
// =============================================================================
const $cur = document.getElementById('cursor');
if ($cur) {
  let mx = -100, my = -100, cx = -100, cy = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.querySelectorAll('a, button, .feat-card, .dienst-card, .wie-item, .road-card, .rev-card').forEach(el => {
    el.addEventListener('mouseenter', () => $cur.classList.add('hover'));
    el.addEventListener('mouseleave', () => $cur.classList.remove('hover'));
  });
  (function tick() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    $cur.style.left = cx + 'px'; $cur.style.top = cy + 'px';
    requestAnimationFrame(tick);
  })();
}

// =============================================================================
//  RESIZE
// =============================================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// =============================================================================
//  RENDER LOOP
// =============================================================================
const clock = new THREE.Clock();
function animate(time) {
  requestAnimationFrame(animate);
  lenis.raf(time);
  const t = clock.getElapsedTime();

  const rawVel = scrollY - lastY;
  vel += (rawVel - vel) * (1 - C.scroll.velDamp);
  lastY = scrollY;

  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  const progress  = Math.min(scrollY / maxScroll, 1);
  const tZ = C.camera.startZ + (C.camera.endZ - C.camera.startZ) * progress;
  const tY = C.camera.endY * progress;
  cZ += (tZ - cZ) * C.scroll.lerp;
  cY += (tY - cY) * C.scroll.lerp;
  camera.position.z = cZ;
  camera.position.y = cY;

  camera.rotation.z += (-vel * C.scroll.velTilt * 0.001 - camera.rotation.z) * 0.07;
  camera.rotation.x  = cY * 0.025 + mouse.y * 0.02;
  camera.rotation.y += (mouse.x * 0.025 - camera.rotation.y) * 0.04;

  objects.forEach(obj => {
    obj.rotation.x += obj.userData.rot.x;
    obj.rotation.y += obj.userData.rot.y;
    obj.rotation.z += obj.userData.rot.z;
    obj.position.y += Math.sin(t * 0.4 + obj.userData.floatOffset) * 0.002;
  });
  particles.rotation.y = t * 0.01;
  particles.rotation.x = t * 0.005;
  scene.fog.density = 0.016 + Math.abs(vel) * 0.0004;
  bloom.strength    = C.bloom.strength + Math.abs(vel) * 0.01;
  dl2.intensity = 60 + Math.sin(t * 0.9) * 14;
  dl3.intensity = 50 + Math.sin(t * 1.2 + 1) * 12;

  composer.render();
}
animate(0);

// =============================================================================
//  HERO — zachte woord-voor-woord fade
// =============================================================================
export function initHero() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let delay = 0.15;

  document.querySelectorAll('.word-fade').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      span.style.transitionDelay = delay.toFixed(2) + 's';
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      delay += 0.06;
    });
    delay += 0.12;
  });
  requestAnimationFrame(() => {
    document.querySelectorAll('.word-fade .word').forEach(w => w.classList.add('in'));
  });

  const items = [
    ['#nav', 0.1], ['#hero-btns', delay], ['#hero-trust', delay + 0.12], ['#pay-strip', delay + 0.24],
  ];
  items.forEach(([sel, d]) => {
    document.querySelectorAll(sel).forEach(el => {
      setTimeout(() => el.classList.add('in'), reduce ? 0 : d * 1000);
    });
  });
}

// =============================================================================
//  SCROLL REVEAL
// =============================================================================
export function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      if (e.target.dataset.stagger) {
        [...e.target.children].forEach((child, i) => {
          setTimeout(() => child.classList.add('in'), i * parseInt(e.target.dataset.stagger));
        });
      } else {
        e.target.classList.add('in');
      }
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => obs.observe(el));
}

// =============================================================================
//  COUNTERS
// =============================================================================
export function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count);
      const step = 16, dur = 1800;
      let cur = 0; const inc = end / (dur / step);
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = Math.round(cur) + (el.dataset.suffix || '');
        if (cur >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

// =============================================================================
//  FAQ
// =============================================================================
export function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(x => {
        x.classList.remove('open'); x.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });
}

// =============================================================================
//  COOKIE POPUP
// =============================================================================
export function initCookies() {
  if (localStorage.getItem('sv-cookies')) return;
  const popup = document.getElementById('cookie-popup');
  if (!popup) return;
  setTimeout(() => popup.classList.add('show'), 2800);
  popup.querySelector('#cookie-accept').addEventListener('click', () => {
    localStorage.setItem('sv-cookies', 'all'); popup.classList.remove('show');
  });
  popup.querySelector('#cookie-minimal').addEventListener('click', () => {
    localStorage.setItem('sv-cookies', 'minimal'); popup.classList.remove('show');
  });
}

// =============================================================================
//  FEATURE MARQUEE
// =============================================================================
export function initMarquee() {
  const wrap = document.getElementById('feat-marquee');
  if (!wrap) return;
  const cards = [...wrap.children];
  wrap.innerHTML = '';
  const ROWS = 3;
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('div');
    row.className = 'mq-row' + (r % 2 === 1 ? ' right' : '');
    const track = document.createElement('div');
    track.className = 'mq-track';
    row.appendChild(track);
    wrap.appendChild(row);
    rows.push(track);
  }
  cards.forEach((card, i) => rows[i % ROWS].appendChild(card));
  rows.forEach(track => { [...track.children].forEach(c => track.appendChild(c.cloneNode(true))); });
}

// =============================================================================
//  REVIEWS LICHTKRANT
// =============================================================================
export function initReviewsMarquee() {
  const wrap = document.getElementById('rev-marquee');
  if (!wrap) return;
  wrap.querySelectorAll('.rev-track').forEach(track => {
    [...track.children].forEach(c => track.appendChild(c.cloneNode(true)));
  });
}

// =============================================================================
//  ROADMAP
// =============================================================================
export function initRoadmap() {
  const road = document.getElementById('roadmap');
  if (!road) return;
  const steps = [...road.querySelectorAll('.road-step')];

  steps.forEach((step, i) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        setTimeout(() => step.classList.add('in'), i * 120);
        obs.unobserve(step);
      });
    }, { threshold: 0.25 });
    obs.observe(step);
  });
}

// =============================================================================
//  BESCHIKBAARHEID
// =============================================================================
export function initAvailability() {
  const dot  = document.getElementById('avail-dot');
  const text = document.getElementById('avail-text');
  if (!dot || !text) return;
  const update = () => {
    const h = new Date().getHours();
    const open = h >= 9 && h < 20;
    dot.classList.toggle('on', open);
    dot.classList.toggle('off', !open);
    text.textContent = open ? 'Nu telefonisch bereikbaar' : 'Nu gesloten — open vanaf 09:00';
  };
  update();
  setInterval(update, 60 * 1000);
}

// =============================================================================
//  FEATURE CARD TILT
// =============================================================================
export function initTilt() {
  document.querySelectorAll('.feat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// =============================================================================
//  START
// =============================================================================
// =============================================================================
//  TOOLTIPS — vaktermen uitleg
// =============================================================================
export function initTooltips() {
  const popup = document.createElement('div');
  popup.className = 'tip-popup';
  document.body.appendChild(popup);

  let hideTimer;

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-tip]');
    if (el) {
      e.stopPropagation();
      clearTimeout(hideTimer);
      const [title, body] = (el.dataset.tip || '').split('|');
      popup.innerHTML = `<strong>${title}</strong>${body ? '<br>' + body : ''}`;
      const rect = el.getBoundingClientRect();
      popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 272)) + 'px';
      popup.style.top = (rect.bottom + 10) + 'px';
      popup.classList.add('show');
      hideTimer = setTimeout(() => popup.classList.remove('show'), 5000);
    } else {
      popup.classList.remove('show');
    }
  });
}

initHero();
initMarquee();
initReviewsMarquee();
initRoadmap();
initReveal();
initCounters();
initFaq();
initCookies();
initTilt();
initAvailability();
initTooltips();
