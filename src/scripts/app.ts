/**
 * AlpenBox24 — progressive enhancement only. Every feature below has a no-JS fallback:
 * reveals (content visible), clock (static "24/7 geöffnet"), day cycle (stacked list),
 * form (native validation + POST).
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

/* Day cycle: four real photos crossfade while the clock runs through the day. Reduced motion → static list. */
const day = document.querySelector<HTMLElement>('[data-day]');
if (day && !reduce) {
  day.classList.add('is-live');
  const moments = $$('[data-moment]', day);
  const shots = $$('[data-shot]', day);
  const clock = day.querySelector('[data-day-time]');
  const mins: number[] = JSON.parse(day.dataset.mins || '[]');
  const n = moments.length;
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t: number) => t * t * (3 - 2 * t);
  const fmt = (m: number) => { const d = ((Math.round(m) % 1440) + 1440) % 1440; return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`; };
  let lastClock = '', lastIdx = -1, visible = false, ticking = false;

  const render = () => {
    ticking = false;
    const r = day.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));
    const seg = Math.min(n - 1, Math.floor(p * n));
    const local = clamp(p * n - seg);
    // Hold each moment briefly, then the clock runs and the next photo fades in
    const t = seg < n - 1 ? ease(clamp((local - 0.25) / 0.75)) : 0;
    const m = seg < n - 1 ? mins[seg] + (mins[seg + 1] - mins[seg]) * t : mins[n - 1];
    day.style.setProperty('--p', p.toFixed(4));
    shots.forEach((el, i) => { el.style.opacity = i === seg ? '1' : i === seg + 1 ? t.toFixed(3) : '0'; });
    const label = fmt(m);
    if (clock && label !== lastClock) { clock.textContent = label; lastClock = label; }
    const idx = t > 0.5 ? seg + 1 : seg;
    if (idx !== lastIdx) {
      moments.forEach((el, i) => { el.classList.toggle('is-active', i === idx); el.classList.toggle('is-past', i < idx); });
      lastIdx = idx;
    }
  };
  const request = () => { if (visible && !ticking) { ticking = true; requestAnimationFrame(render); } };
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) request(); }, { rootMargin: '100px 0px' }).observe(day);
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { visible = true; request(); });
  render();
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
