// Homepage behaviour: mobile menu, service rows on phones, bottom call bar, opening slats over the reception photo.
// Everything works as progressive enhancement: without JS the content is visible and links work.

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Mobile menu: Esc closes, focus stays inside, closes on a link ---------- */
const menu = document.getElementById("site-menu");
const openBtn = document.querySelector<HTMLButtonElement>("[data-menu-open]");
const closeBtn = document.querySelector<HTMLButtonElement>("[data-menu-close]");
if (menu && openBtn && closeBtn) {
  const focusables = () =>
    Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter((el) => el.offsetParent !== null);
  const close = (restore = true) => {
    menu.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.style.removeProperty("overflow");
    if (restore) openBtn.focus();
  };
  const open = () => {
    menu.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
    closeBtn.focus();
  };
  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", () => close());
  menu.querySelectorAll("[data-menu-link]").forEach((a) => a.addEventListener("click", () => close(false)));
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    const items = focusables();
    const first = items[0], last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia("(min-width: 1200px)").addEventListener("change", (m) => { if (m.matches && !menu.hidden) close(false); });
}

/* ---------- Services: on phones each slat becomes a row with a disclosure button ---------- */
const phone = window.matchMedia("(max-width: 767px)");
const slats = Array.from(document.querySelectorAll<HTMLElement>(".slat"));
const setupRows = (on: boolean) => {
  slats.forEach((slat, i) => {
    const title = slat.querySelector<HTMLElement>("[data-slat-title]");
    const more = Array.from(slat.querySelectorAll<HTMLElement>("[data-slat-more]"));
    if (!title) return;
    const existing = title.querySelector<HTMLButtonElement>(".slat__toggle");
    if (on && !existing) {
      more.forEach((el, j) => { el.id ||= `slat-${i}-more-${j}`; el.hidden = true; });
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slat__toggle";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", more.map((el) => el.id).join(" "));
      const label = document.createElement("span");
      label.textContent = title.textContent ?? "";
      const chev = document.createElement("span");
      chev.className = "slat__chev";
      chev.setAttribute("aria-hidden", "true");
      btn.append(label, chev);
      title.textContent = "";
      title.append(btn);
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        more.forEach((el) => (el.hidden = expanded));
      });
    } else if (!on && existing) {
      title.textContent = existing.querySelector("span")?.textContent ?? "";
      more.forEach((el) => (el.hidden = false));
    }
  });
};
setupRows(phone.matches);
phone.addEventListener("change", (m) => setupRows(m.matches));
// An anchor to a slat (from a doctor record) opens that row on phones.
const openTarget = () => {
  const el = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  const btn = el?.classList.contains("slat") ? el.querySelector<HTMLButtonElement>(".slat__toggle[aria-expanded='false']") : null;
  btn?.click();
};
window.addEventListener("hashchange", openTarget);
openTarget();

/* ---------- Bottom call bar (phones): after #hero, hidden near #contacts ---------- */
const bar = document.querySelector<HTMLElement>("[data-callbar]");
const hero = document.getElementById("hero");
const contacts = document.getElementById("contacts");
if (bar && hero && contacts && "IntersectionObserver" in window) {
  let heroVisible = true, contactsVisible = false;
  const update = () => bar.classList.toggle("is-shown", !heroVisible && !contactsVisible);
  new IntersectionObserver(([e]) => { heroVisible = !!e?.isIntersecting; update(); }, { rootMargin: "0px 0px -35% 0px" }).observe(hero);
  new IntersectionObserver(([e]) => { contactsVisible = !!e?.isIntersecting; update(); }).observe(contacts);
} else if (bar) {
  bar.classList.add("is-shown");
}

/* ---------- Effect 1: slats open over the reception photo once it is in view ---------- */
const photo = document.querySelector<HTMLElement>("[data-slats]");
if (photo) {
  if (reduce || !("IntersectionObserver" in window)) {
    photo.classList.add("is-open");
  } else {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        const img = photo.querySelector("img");
        const go = () => requestAnimationFrame(() => photo.classList.add("is-open"));
        if (!img || img.complete) go();
        else {
          img.addEventListener("load", go, { once: true });
          img.addEventListener("error", go, { once: true });
          window.setTimeout(go, 1500); // never keep the photo covered on a slow network
        }
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(photo);
  }
}
