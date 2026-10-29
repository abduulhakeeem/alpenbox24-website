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

/* Day cycle: scroll-scrubbed 24 h story */
const day = document.querySelector<HTMLElement>('[data-day]');
if (day) {
  day.classList.add('is-live');
  const moments = $$('[data-moment]', day);
  const label = day.querySelector('[data-day-time]');
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = day.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.min(Math.max(-r.top / total, 0), 1);
    day.style.setProperty('--p', p.toFixed(4));
    const idx = Math.min(moments.length - 1, Math.floor(p * moments.length * 0.999));
    moments.forEach((m, i) => m.classList.toggle('is-active', i === idx));
    const active = moments[idx];
    if (label && active) label.textContent = active.dataset.moment || '';
    day.dataset.phase = active?.dataset.phase || 'night';
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
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
