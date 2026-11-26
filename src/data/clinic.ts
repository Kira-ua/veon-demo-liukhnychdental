// Facts for the homepage. Source of every value: veon/client.json (fact ids in comments). Nothing here is invented.
const nb = " "; // non-breaking space: «20 800 грн», «1000 грн»

export const clinic = {
  name: "LIUKHNYCH dental clinic",
  phoneDisplay: "+38 099 378 83 99", // company.contacts.phones
  phoneHref: "tel:+380993788399",
  phoneE164: "+380993788399",
  street: "вул. Юліана Целевича, 4", // company.geography, U-R010: до рішення клієнта
  city: "Івано-Франківськ",
  mapUrl: "https://maps.app.goo.gl/cNqzqqamptk66g5g8", // W-F006
  // W-F005
  hours: [
    { days: "Пн–Пт", time: "9:00–19:00" },
    { days: "Сб", time: "9:00–15:00" },
    { days: "Нд", time: "за записом" },
  ],
  rating: { value: "5.0", reviews: "180" }, // B-F005 (без aggregateRating у schema)
  socials: [
    { name: "Instagram", href: "https://www.instagram.com/liukhnych_dental_clinic/" },
    { name: "Facebook", href: "https://www.facebook.com/profile.php?id=100076038339776" },
    { name: "TikTok", href: "https://www.tiktok.com/@liukhnych.dental" },
  ],
} as const;

export const price = (n: string) => `${n.replace(" ", nb)}${nb}грн`;

export interface Doctor {
  id: string;
  name: string;
  role: string;
  years: number;
  yearsWord: string;
  services: string[]; // slat ids
  photo: "roman" | "liubomyr" | "yurii" | "sofiia" | "iryna";
}

// B-F006, sorted by years of practice
export const doctors: Doctor[] = [
  { id: "doctor-roman", name: "Роман Люхнич", role: "Терапевт, ендодонтист", years: 22, yearsWord: "роки практики", services: ["service-pain"], photo: "roman" },
  { id: "doctor-liubomyr", name: "Любомир Люхнич", role: "Ендодонтист, хірург-ортопед", years: 18, yearsWord: "років практики", services: ["service-pain", "service-implant"], photo: "liubomyr" },
  { id: "doctor-yurii", name: "Юрій Паневник", role: "Хірург-імплантолог", years: 17, yearsWord: "років практики", services: ["service-implant"], photo: "yurii" },
  { id: "doctor-sofiia", name: "Софія Скрипкіна", role: "Дитячий стоматолог, терапевт", years: 10, yearsWord: "років практики", services: ["service-kids"], photo: "sofiia" },
  { id: "doctor-iryna", name: "Ірина Горганюк", role: "Ортодонт, пародонтолог", years: 10, yearsWord: "років практики", services: ["service-ortho", "service-gums"], photo: "iryna" },
];

export interface Service {
  id: string;
  situation: string;
  direction: string;
  fact: string;
  first: { label: string; amount: string };
  more: { label: string; amount: string }[];
  doctors: string[]; // doctor ids
}

// Prices only without discrepancies between client pages (B-I002, ux/demo-home.md §5)
export const services: Service[] = [
  {
    id: "service-pain",
    situation: "Болить зуб",
    direction: "Лікування та збереження зубів",
    fact: "Канали лікуємо під стоматологічним мікроскопом.", // B-F009, B-F024
    first: { label: "зняття гострого болю", amount: "1000" },
    more: [{ label: "лікування каналу", amount: "2200" }],
    doctors: ["doctor-roman", "doctor-liubomyr"],
  },
  {
    id: "service-implant",
    situation: "Втратили зуб",
    direction: "Імплантація та протезування",
    fact: "Навігаційні хірургічні шаблони. Остеоінтеграція зазвичай 3–6 місяців.", // B-F024, B-F007
    first: { label: "імплантат Osstem", amount: "20 800" },
    more: [
      { label: "імплантат Strauman", amount: "41 600" },
      { label: "металокерамічна коронка", amount: "5500" },
    ],
    doctors: ["doctor-yurii", "doctor-liubomyr"],
  },
  {
    id: "service-ortho",
    situation: "Хочу рівні зуби",
    direction: "Брекети та елайнери",
    fact: "Лікування триває в середньому 12–24 місяці.", // B-F011
    first: { label: "консультація ортодонта", amount: "700" },
    more: [],
    doctors: ["doctor-iryna"],
  },
  {
    id: "service-white",
    situation: "Хочу білішу усмішку",
    direction: "Відбілювання та реставрація",
    fact: "Система BEYOND (США): на 4–8 тонів за 30–45 хвилин.", // B-F012, B-F024
    first: { label: "відбілювання BEYOND", amount: "5500" },
    more: [{ label: "художня реставрація", amount: "3000" }],
    doctors: [],
  },
  {
    id: "service-kids",
    situation: "Для дитини",
    direction: "Дитяча стоматологія",
    fact: "Седація закисом азоту. Перший огляд рекомендуємо у віці 1 року.", // B-F013, B-F024
    first: { label: "лікування молочного зуба", amount: "1500" },
    more: [{ label: "седація закисом азоту, 1 год", amount: "1600" }],
    doctors: ["doctor-sofiia"],
  },
  {
    id: "service-gums",
    situation: "Ясна, гігієна, видалення",
    direction: "Пародонтологія, гігієна, хірургія",
    fact: "Професійну гігієну рекомендуємо двічі на рік.", // B-F015
    first: { label: "професійна гігієна", amount: "2000" },
    more: [{ label: "просте видалення зуба", amount: "1500" }],
    doctors: ["doctor-iryna"],
  },
];

// Footer: the client's 10 directions (future pages, FutureLink)
export const directions = [
  "Імплантація зубів",
  "Протезування зубів",
  "Лікування кореневих каналів",
  "Художня реставрація",
  "Вирівнювання зубів",
  "Відбілювання зубів",
  "Дитяча стоматологія",
  "Лікування ясен",
  "Терапія та гігієна",
  "Хірургія",
];

export const nav = [
  { href: "#services", label: "Напрями та ціни" },
  { href: "#doctors", label: "Лікарі" },
  { href: "#first-visit", label: "Перший візит" },
  { href: "#clinic", label: "Клініка" },
  { href: "#contacts", label: "Контакти" },
];

export const NOTE = "Розділ у розробці";
