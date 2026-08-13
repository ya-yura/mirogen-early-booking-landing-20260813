export type RoomOption = {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  capacity: string;
  view: string;
  details: string[];
  sourceUrl: string;
};

export type MealOption = {
  id: string;
  name: string;
  description: string;
  hours: string;
};

const buildDate = new Date();
const buildYear = buildDate.getFullYear();
const buildDateIso = buildDate.toISOString().slice(0, 10);

export const hotelData = {
  brand: "Мироген",
  location: "Лермонтово",
  year: buildYear,
  currentDate: buildDateIso,
  address: "352815, Краснодарский край, Туапсинский район, А-147, 16-й километр",
  contacts: {
    phone: "+7 (918) 187-28-88",
    phoneHref: "tel:+79181872888",
    email: "hotelmirogen@yandex.ru",
    emailHref: "mailto:hotelmirogen@yandex.ru",
    whatsapp: "https://wa.me/79181872888",
  },
  offer: {
    id: "early-booking",
    label: "Актуальные условия раннего бронирования",
    title: `Раннее бронирование ${buildYear} в «Мирогене»`,
    description:
      "Выберите даты, состав семьи и формат проживания — мы проверим актуальные условия для вашего заезда.",
    audience:
      "Подходит тем, кто планирует отдых заранее и хочет сначала увидеть расчёт именно под свою поездку.",
    dates:
      "Период проживания проверяется индивидуально: условия зависят от дат, категории номера и состава гостей.",
    includes: [
      "проверка доступности выбранной категории",
      "расчёт актуальной стоимости проживания",
      "сверка выбранного формата питания",
      "ответ администратора по условиям заезда",
    ],
    calculation:
      "Итоговые условия рассчитываются по выбранным датам, категории номера и составу гостей.",
    deadline: null as string | null,
  },
  amenities: [
    {
      eyebrow: "Локация",
      title: "Море рядом",
      text: "Отель находится на первой линии в Лермонтово, с собственной пляжной зоной.",
      mark: "01",
    },
    {
      eyebrow: "Вода",
      title: "Подогреваемый бассейн",
      text: "Бассейн с гидромассажем и водопадом — можно чередовать море и спокойный отдых на территории.",
      mark: "02",
    },
    {
      eyebrow: "Семья",
      title: "Детская инфраструктура",
      text: "Детская комната и площадка помогают устроить день всей семье.",
      mark: "03",
    },
    {
      eyebrow: "На месте",
      title: "Кафе-бар и столовая",
      text: "Завтрак, обед и ужин по меню-заказу, а также кафе-бар у бассейна.",
      mark: "04",
    },
    {
      eyebrow: "Комфорт",
      title: "Парковка и Wi-Fi",
      text: "На территории есть бесплатная охраняемая парковка и Wi-Fi.",
      mark: "05",
    },
  ],
  rooms: [
    {
      id: "sea",
      name: "Двухместный с видом на море",
      image: "/images/official/room-sea.webp",
      imageAlt: "Двухместный номер отеля «Мироген» с видом на море",
      capacity: "2 гостя",
      view: "море",
      details: ["балкон", "кондиционер", "телевизор"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
    {
      id: "pool",
      name: "Двухместный с видом на бассейн",
      image: "/images/official/room-pool.webp",
      imageAlt: "Двухместный номер отеля «Мироген» с видом на бассейн",
      capacity: "2 гостя",
      view: "бассейн",
      details: ["балкон", "кондиционер", "телевизор"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
    {
      id: "mountain",
      name: "Двухместный с видом на горы",
      image: "/images/official/room-mountain.webp",
      imageAlt: "Интерьер двухместного номера отеля «Мироген»",
      capacity: "2 гостя",
      view: "горы",
      details: ["балкон", "кондиционер", "телевизор"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
    {
      id: "improved",
      name: "ДВМ улучшеный с видом на море",
      image: "/images/official/room-improved.webp",
      imageAlt: "Интерьер улучшенного двухместного номера отеля «Мироген»",
      capacity: "2 гостя",
      view: "море",
      details: ["балкон", "кондиционер", "телевизор"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
    {
      id: "direct-sea",
      name: "Полулюкс с видом на море прямо",
      image: "/images/official/room-direct-sea.webp",
      imageAlt: "Полулюкс отеля «Мироген» с видом прямо на море",
      capacity: "2 гостя",
      view: "море прямо",
      details: ["балкон", "кондиционер", "телевизор"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
    {
      id: "side-sea",
      name: "Полулюкс с видом на море сбоку",
      image: "/images/official/room-side-sea.webp",
      imageAlt: "Полулюкс отеля «Мироген» с боковым видом на море",
      capacity: "2 гостя",
      view: "море сбоку",
      details: ["балкон", "кондиционер", "телевизор"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
    {
      id: "suite-sea",
      name: "Люкс 2-х комн. с видом на море",
      image: "/images/official/room-suite.webp",
      imageAlt: "Люкс отеля «Мироген» с видом на море",
      capacity: "2 гостя",
      view: "море",
      details: ["2 комнаты", "2 балкона", "кондиционер"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
    {
      id: "suite-pool",
      name: "Люкс 2-х комн. с видом на бассейн",
      image: "/images/official/room-pool-suite.webp",
      imageAlt: "Люкс отеля «Мироген» с видом на бассейн",
      capacity: "2 гостя",
      view: "бассейн",
      details: ["2 комнаты", "2 балкона", "кондиционер"],
      sourceUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    },
  ] satisfies RoomOption[],
  meals: [
    {
      id: "breakfast",
      name: "Завтрак",
      description: "Утренний приём пищи по меню-заказу.",
      hours: "08:00–10:00",
    },
    {
      id: "half-board",
      name: "Полупансион",
      description: "Формат питания уточняется по выбранным датам.",
      hours: "Обед 13:00–15:00 или ужин 18:30–20:00",
    },
    {
      id: "full-board",
      name: "Полный пансион",
      description: "Завтрак, обед и ужин по меню-заказу.",
      hours: "08:00–10:00 · 13:00–15:00 · 18:30–20:00",
    },
  ] satisfies MealOption[],
  moments: [
    {
      label: "Утро",
      title: "Начать день у воды",
      text: "Завтрак по меню-заказу и свежий воздух рядом с морем.",
      image: "/images/official/gallery-2122.webp",
      imageAlt: "Вид на море с территории отеля «Мироген»",
    },
    {
      label: "Номер",
      title: "Вернуться в тишину",
      text: "Все номера отеля — с балконами, кондиционером, телевизором и холодильником.",
      image: "/images/official/room-sea.webp",
      imageAlt: "Номер отеля «Мироген» с балконом",
    },
    {
      label: "Бассейн",
      title: "Плавать без спешки",
      text: "Подогреваемый бассейн с гидромассажем и водопадом — на территории отеля.",
      image: "/images/official/pool.webp",
      imageAlt: "Подогреваемый бассейн отеля «Мироген»",
    },
    {
      label: "Море",
      title: "Оставить день снаружи",
      text: "Собственная пляжная зона и вид на побережье из пространства отеля.",
      image: "/images/official/gallery-2244.webp",
      imageAlt: "Побережье рядом с отелем «Мироген»",
    },
    {
      label: "Ужин",
      title: "Собраться за столом",
      text: "Столовая с домашней кухней и кафе-бар у бассейна.",
      image: "/images/official/food.webp",
      imageAlt: "Кафе на территории отеля «Мироген»",
    },
  ],
  faqs: [
    {
      question: "Какие даты участвуют в предложении?",
      answer:
        "Срок предложения сохранён в данных сайта, но на официальных страницах сейчас указаны разные значения. Поэтому актуальные даты проживания и условия проверяются индивидуально.",
    },
    {
      question: "Какие категории номеров доступны?",
      answer:
        "На странице выбора собраны категории из официального раздела номеров: двухместные с видом на море, бассейн и горы, улучшенный двухместный, полулюксы и двухкомнатные люксы.",
    },
    {
      question: "Какие варианты питания есть?",
      answer:
        "Завтрак, полупансион и полный пансион по системе меню-заказ. На официальной странице указаны часы: завтрак 08:00–10:00, обед 13:00–15:00, ужин 18:30–20:00.",
    },
    {
      question: "Принимают ли гостей с детьми?",
      answer:
        "Да, отель принимает гостей с детьми любого возраста. Для семей доступны детская комната и детская площадка.",
    },
    {
      question: "Что входит в стоимость?",
      answer:
        "Состав и стоимость зависят от дат, категории номера и выбранного формата питания. Администратор сообщит актуальный расчёт после проверки заявки.",
    },
    {
      question: "Как проходит подтверждение?",
      answer:
        "После выбора параметров сформируйте сообщение и отправьте его в WhatsApp или на e-mail отеля. Бронь подтверждает администратор после проверки доступности и условий.",
    },
    {
      question: "Какие документы нужны для заезда?",
      answer:
        "Для взрослого официальный сайт указывает паспорт и документы по путёвке. Для ребёнка до 14 лет — свидетельство о рождении; если ребёнка сопровождает другое лицо, нужно нотариальное разрешение. Полный перечень лучше уточнить перед поездкой.",
    },
  ],
  sourceUrls: [
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/food/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/services/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/contact/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/price/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/galerey/",
  ],
} as const;

export type HotelData = typeof hotelData;
