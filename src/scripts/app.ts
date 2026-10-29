/**
 * AlpenBox24 — progressive enhancement only. Every feature below has a no-JS fallback:
 * reveals (content visible), clock (static "24/7 geöffnet"), day cycle (stacked list),
 * vending machine (slot links), lightbox (direct image links), form (native validation + POST).
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)] as T[];

/* Header + mobile bar state */
const header = document.querySelector<HTMLElement>('.site-header');
const bar = document.querySelector<HTMLElement>('.mobile-bar');
const onScroll = () => {
  const y = scrollY;
  header?.classList.toggle('is-solid', y > 40);
  bar?.classList.toggle('is-visible', y > innerHeight * 0.45 || !document.querySelector('.hero'));
  document.documentElement.style.setProperty('--scroll', String(Math.min(y / innerHeight, 1.5)));
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Close menu when following an in-page link */
$$('.menu__panel a').forEach((a) => a.addEventListener('click', () => a.closest('details')?.removeAttribute('open')));

/* Reveals, ridge draws, map animation */
// A clip-path reveal hides the element's own box, so its parent is observed instead.
const watched = new Map<Element, Element[]>();
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    (watched.get(e.target) ?? [e.target]).forEach((el) => el.classList.add('is-in'));
    io.unobserve(e.target);
  }),
  { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
);
const revealables = $$('[data-reveal], .ridge--draw, .map, [data-count]');
revealables.forEach((el) => {
  const target = el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el;
  if (target !== el) watched.set(target, [...(watched.get(target) ?? []), el]);
  io.observe(target);
});
// Fallback: never leave content hidden if the observer is throttled (background tabs, old engines).
let pending = revealables;
const sweep = () => {
  pending = pending.filter((el) => {
    const box = (el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el).getBoundingClientRect();
    if (box.top < innerHeight * 0.95 && box.bottom > 0) { el.classList.add('is-in'); return false; }
    return !el.classList.contains('is-in');
  });
  if (!pending.length) removeEventListener('scroll', onSweep);
};
let sweepQueued = false;
const onSweep = () => { if (!sweepQueued) { sweepQueued = true; setTimeout(() => { sweepQueued = false; sweep(); }, 250); } };
addEventListener('scroll', onSweep, { passive: true });
setTimeout(sweep, 1200);

/* Count-up numbers */
const countIo = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  countIo.unobserve(e.target);
  const el = e.target as HTMLElement, to = Number(el.dataset.count), suffix = el.dataset.suffix ?? '';
  if (reduce || !to) return;
  const t0 = performance.now(), dur = 1400;
  const tick = (t: number) => {
    const p = Math.min((t - t0) / dur, 1), v = Math.round(to * (1 - Math.pow(1 - p, 4)));
    el.textContent = v.toLocaleString('de-DE') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}), { threshold: 0.6 });
$$('[data-count]').forEach((el) => countIo.observe(el));

/* Live clock in Europe/Berlin */
const fmt = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', weekday: 'long' });
const isOpen = (hours: unknown): boolean => {
  if (hours === '24/7') return true;
  if (!Array.isArray(hours)) return true;
  const day = dayFmt.format(new Date()), now = fmt.format(new Date());
  return hours.some((h: { days: string[]; opens: string; closes: string }) => h.days.includes(day) && now >= h.opens && now <= h.closes);
};
const clocks = $$('[data-clock]');
const tickClock = () => clocks.forEach((c) => {
  const t = fmt.format(new Date()), en = c.dataset.lang === 'en', open = isOpen(JSON.parse(c.dataset.hours || '"24/7"'));
  const txt = c.querySelector('[data-clock-text]');
  if (txt) txt.textContent = open ? (en ? `Open now · ${t}` : `Jetzt geöffnet · ${t}`) : (en ? `Closed right now · ${t}` : `Gerade geschlossen · ${t}`);
  c.toggleAttribute('data-closed', !open);
});
$$('[data-time-now]').forEach((el) => (el.textContent = fmt.format(new Date())));
if (clocks.length) { tickClock(); setInterval(tickClock, 15000); }

/* Day cycle: scroll-scrubbed 24 h scene. The clock ticks through the day, the sky blends
   continuously, sun and moon follow real arcs, the machine glows at night. Reduced motion → static list. */
const day = document.querySelector<HTMLElement>('[data-day]');
if (day && !reduce) {
  day.classList.add('is-live');
  const moments = $$('[data-moment]', day);
  const jumps = $$<HTMLButtonElement>('[data-jump]', day);
  const clock = day.querySelector('[data-day-time]');
  const mins: number[] = JSON.parse(day.dataset.mins || '[]');
  const n = moments.length;
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t: number) => t * t * (3 - 2 * t);
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a: string, b: string, t: number) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(' ')})`;
  // Sky by minute of day: [minute, top, horizon]
  const SKY: [number, string, string][] = [
    [0, '#04060d', '#0e1428'], [270, '#05081a', '#141a3a'], [330, '#121a3d', '#4a2f55'], [375, '#2b3a6e', '#f08a3c'],
    [450, '#4b7fb5', '#f4c58e'], [600, '#3f86c8', '#a9d2ef'], [960, '#3a7fc0', '#b8dcf2'], [1110, '#4a6fa8', '#f3c07a'],
    [1185, '#3a3470', '#ff7a2b'], [1240, '#1a1d45', '#7a3550'], [1320, '#090d22', '#1a1c3a'], [1440, '#04060d', '#0e1428'],
  ];
  const sky = (m: number) => {
    let i = SKY.findIndex(([t]) => t > m); if (i < 1) i = SKY.length - 1;
    const [t0, a0, b0] = SKY[i - 1], [t1, a1, b1] = SKY[i];
    const t = ease(clamp((m - t0) / (t1 - t0)));
    return [mix(a0, a1, t), mix(b0, b1, t)];
  };
  const RISE = 375, SET = 1195; // 06:15 – 19:55
  const fmt = (m: number) => { const d = ((Math.round(m) % 1440) + 1440) % 1440; return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`; };
  let lastClock = '', lastIdx = -1, visible = false, ticking = false;

  const render = () => {
    ticking = false;
    const r = day.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));
    const seg = Math.min(n - 1, Math.floor(p * n));
    const local = clamp(p * n - seg);
    // Time: hold each moment briefly, then run to the next one
    const m = seg < n - 1 ? mins[seg] + (mins[seg + 1] - mins[seg]) * ease(clamp((local - 0.15) / 0.85)) : mins[n - 1];
    const md = ((m % 1440) + 1440) % 1440;
    const [top, bot] = sky(md);
    const night = 1 - clamp(Math.min((md - 270) / 150, (1290 - md) / 120)); // dark 21:30–04:30, dusk from 19:30
    const sf = clamp((md - RISE) / (SET - RISE));
    const sunUp = md > RISE - 20 && md < SET + 20;
    const mf = clamp(((md < 720 ? md + 1440 : md) - 1200) / 600); // moon 20:00 – 06:00
    const s = day.style;
    s.setProperty('--p', p.toFixed(4));
    s.setProperty('--top', top); s.setProperty('--bot', bot);
    s.setProperty('--night', night.toFixed(3));
    s.setProperty('--sun-x', `${8 + sf * 84}%`); s.setProperty('--sun-y', `${80 - Math.sin(Math.PI * sf) * 48}%`);
    s.setProperty('--sun-o', sunUp ? clamp(Math.min(sf, 1 - sf) * 14 + 0.15).toFixed(3) : '0');
    s.setProperty('--glow', `rgb(246 138 43 / ${(0.12 + (1 - Math.sin(Math.PI * sf)) * 0.55).toFixed(3)})`);
    s.setProperty('--moon-x', `${12 + mf * 76}%`); s.setProperty('--moon-y', `${72 - Math.sin(Math.PI * mf) * 38}%`);
    s.setProperty('--moon-o', (night * clamp(Math.min(mf, 1 - mf) * 10)).toFixed(3));
    const label = seg === n - 1 && local > 0.05 ? 'Sonntag' : fmt(m);
    if (clock && label !== lastClock) { clock.textContent = label; lastClock = label; }
    if (seg !== lastIdx) {
      moments.forEach((el, i) => { el.classList.toggle('is-active', i === seg); el.classList.toggle('is-past', i < seg); });
      jumps.forEach((b, i) => (i === seg ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
      lastIdx = seg;
    }
  };
  const request = () => { if (visible && !ticking) { ticking = true; requestAnimationFrame(render); } };
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) request(); }, { rootMargin: '100px 0px' }).observe(day);
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { visible = true; request(); });
  jumps.forEach((b, i) => b.addEventListener('click', () => {
    const total = day.offsetHeight - innerHeight;
    scrollTo({ top: day.getBoundingClientRect().top + scrollY + ((i + 0.08) / n) * total, behavior: 'smooth' });
  }));
  render();
}

/* Vending machine: pick a slot by click or by typing its code on the keypad */
$$('[data-machine]').forEach((m) => {
  const slots = $$<HTMLAnchorElement>('[data-slot]', m);
  const screen = m.querySelector('[data-screen]');
  const tray = m.querySelector<HTMLElement>('[data-tray]');
  const info = m.querySelector<HTMLElement>('[data-info]');
  let code = '';
  const pick = (slot: HTMLAnchorElement) => {
    slots.forEach((s) => s.classList.toggle('is-picked', s === slot));
    if (screen) screen.textContent = `${slot.dataset.slot} · ${slot.dataset.name}`;
    slot.classList.remove('is-dropping'); void slot.offsetWidth; slot.classList.add('is-dropping');
    if (tray) { tray.classList.remove('is-full'); void tray.offsetWidth; tray.classList.add('is-full'); tray.dataset.item = slot.dataset.name || ''; }
    if (info) {
      const tpl = m.querySelector<HTMLElement>(`[data-for="${slot.dataset.slot}"]`);
      info.innerHTML = tpl ? tpl.innerHTML : '';
      info.classList.remove('is-in'); void info.offsetWidth; info.classList.add('is-in');
    }
  };
  slots.forEach((s) => s.addEventListener('click', (e) => { e.preventDefault(); pick(s); }));
  $$<HTMLButtonElement>('[data-key]', m).forEach((k) => k.addEventListener('click', () => {
    const v = k.dataset.key!;
    if (v === 'DEL') code = '';
    else if (v === 'OK') {
      const s = slots.find((x) => x.dataset.slot === code);
      if (s) pick(s); else if (screen) screen.textContent = code ? `${code}? Gibt's nicht.` : 'Fach wählen';
      code = ''; return;
    } else code = (code + v).slice(-2);
    if (screen) screen.textContent = code || 'Fach wählen';
  }));
  if (slots[0]) pick(slots[0]);
});

/* Gallery filter (chips), keeps hash in sync */
const filterBar = document.querySelector('[data-filter-bar]');
if (filterBar) {
  const items = $$('[data-cat]');
  const apply = (cat: string) => {
    $$('[data-filter]', filterBar).forEach((b) => (b.dataset.filter === cat ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    items.forEach((it) => (it.hidden = cat !== 'alle' && it.dataset.cat !== cat));
    $$('[data-cat-head]').forEach((h) => (h.hidden = cat !== 'alle' ? h.dataset.catHead !== cat : false));
  };
  $$('[data-filter]', filterBar).forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault(); apply(b.dataset.filter!); history.replaceState(null, '', b.dataset.filter === 'alle' ? location.pathname : '#' + b.dataset.filter);
  }));
  const h = location.hash.slice(1);
  if (h && filterBar.querySelector(`[data-filter="${h}"]`)) apply(h);
}

/* Lightbox */
const lb = document.querySelector<HTMLDialogElement>('[data-lightbox]');
const links = $$<HTMLAnchorElement>('a[data-lb]');
if (lb && links.length) {
  const img = lb.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const cap = lb.querySelector('[data-lb-cap]')!;
  const count = lb.querySelector('[data-lb-count]')!;
  let i = 0, opener: HTMLElement | null = null;
  const visible = () => links.filter((a) => !a.closest('[hidden]'));
  const show = (n: number) => {
    const list = visible(); i = (n + list.length) % list.length;
    const a = list[i];
    img.src = a.href; img.alt = a.dataset.alt || '';
    cap.innerHTML = `<strong>${a.dataset.caption || ''}</strong>${a.dataset.credit || ''}`;
    count.textContent = `Bild ${i + 1} von ${list.length}`;
    const next = list[(i + 1) % list.length]; if (next) { const pre = new Image(); pre.src = next.href; }
  };
  links.forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); opener = a; show(visible().indexOf(a)); lb.showModal();
  }));
  lb.querySelector('[data-lb-close]')?.addEventListener('click', () => lb.close());
  lb.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(i - 1));
  lb.querySelector('[data-lb-next]')?.addEventListener('click', () => show(i + 1));
  lb.addEventListener('close', () => opener?.focus());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
  let x0 = 0;
  lb.addEventListener('pointerdown', (e) => (x0 = e.clientX));
  lb.addEventListener('pointerup', (e) => { const dx = e.clientX - x0; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); });
}

/* Contact form: time trap, preselect from ?anliegen=, error notice */
const form = document.querySelector<HTMLFormElement>('[data-form]');
if (form) {
  const ts = form.querySelector<HTMLInputElement>('input[name="_ts"]');
  if (ts) ts.value = String(Date.now());
  const params = new URLSearchParams(location.search);
  const a = params.get('anliegen');
  const radio = a ? form.querySelector<HTMLInputElement>(`input[name="anliegen"][value="${CSS.escape(a)}"]`) : null;
  if (radio) radio.checked = true;
  if (params.get('fehler')) {
    const err = document.querySelector<HTMLElement>('[data-form-error]');
    err?.removeAttribute('hidden');
    err?.scrollIntoView({ block: 'center' });
  }
}

/* Magnetic signposts (fine pointers only) */
if (!reduce && matchMedia('(pointer: fine)').matches) {
  $$('.signpost-wrap').forEach((w) => {
    w.addEventListener('pointermove', (e) => {
      const r = w.getBoundingClientRect();
      w.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 10}px, ${((e.clientY - r.top) / r.height - 0.5) * 8}px)`;
    });
    w.addEventListener('pointerleave', () => (w.style.transform = ''));
  });
  /* Hero light follows the pointer */
  const hero = document.querySelector<HTMLElement>('.hero');
  hero?.addEventListener('pointermove', (e) => {
    hero.style.setProperty('--mx', `${(e.clientX / innerWidth) * 100}%`);
    hero.style.setProperty('--my', `${(e.clientY / innerHeight) * 100}%`);
  });
}
