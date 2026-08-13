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

export type PreferredChannel = "whatsapp" | "phone" | "email";

const buildDate = new Date();
const buildYear = buildDate.getFullYear();
const buildDateIso = buildDate.toISOString().slice(0, 10);
const roomSourceUrl = "https://xn----ftbecnqilbfvs6k.xn--p1ai/rooms/";
const roomDetails = ["балкон", "кондиционер", "телевизор", "холодильник"];

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
    consentUrl: "https://xn----ftbecnqilbfvs6k.xn--p1ai/politic/compliance.php",
  },
  offer: {
    id: "early-booking",
    label: `Раннее бронирование ${buildYear}`,
    title: "Проверьте условия раннего бронирования на свои даты",
    description:
      "Выберите даты, состав семьи, номер и питание — отель подтвердит актуальные условия и стоимость по вашему запросу.",
    audience:
      "Для тех, кто планирует поездку заранее и хочет получить расчёт под конкретные даты, состав семьи, номер и питание.",
    deadline: null as string | null,
    deadlineText: "Актуальный срок предложения подтвердит администратор",
    benefit: null as string | null,
    status: "needs_confirmation" as const,
    includes: [
      "доступность выбранной категории номера",
      "условия по вашим датам",
      "состав гостей и возраст детей",
      "выбранный формат питания",
      "актуальная стоимость проживания",
      "порядок подтверждения от администратора",
    ],
    process:
      "Сначала вы оставляете параметры поездки. Затем администратор проверяет наличие и возвращает точные условия. Отправка формы сама по себе не означает подтверждение бронирования.",
  },
  amenities: [
    {
      eyebrow: "Локация",
      title: "Лермонтово, Туапсинский район",
      text: "Отель находится в Лермонтово по адресу из официальных контактов.",
      mark: "01",
    },
    {
      eyebrow: "На территории",
      title: "Бассейн с подогревом",
      text: "В официальном описании указаны подогрев, гидромассаж и водопад.",
      mark: "02",
    },
    {
      eyebrow: "У воды",
      title: "Собственная пляжная зона",
      text: "На территории отеля заявлена собственная пляжная зона с шезлонгами.",
      mark: "03",
    },
    {
      eyebrow: "Для семьи",
      title: "Детская инфраструктура",
      text: "Для гостей доступны детская комната и детская игровая площадка.",
      mark: "04",
    },
    {
      eyebrow: "Питание",
      title: "Питание на территории",
      text: "Есть столовая и кафе-бар у бассейна; формат питания выбирается отдельно.",
      mark: "05",
    },
    {
      eyebrow: "Комфорт",
      title: "Парковка и Wi-Fi",
      text: "Официальный сайт указывает парковку на территории и бесплатный Wi-Fi.",
      mark: "06",
    },
  ],
  rooms: [
    {
      id: "sea",
      name: "Двухместный с видом на море",
      image: "images/official/room-sea.webp",
      imageAlt: "Двухместный номер отеля «Мироген» с видом на море",
      capacity: "категория для двухместного размещения",
      view: "море",
      details: roomDetails,
      sourceUrl: roomSourceUrl,
    },
    {
      id: "pool",
      name: "Двухместный с видом на бассейн",
      image: "images/official/room-pool.webp",
      imageAlt: "Двухместный номер отеля «Мироген» с видом на бассейн",
      capacity: "категория для двухместного размещения",
      view: "бассейн",
      details: roomDetails,
      sourceUrl: roomSourceUrl,
    },
    {
      id: "mountain",
      name: "Двухместный с видом на горы",
      image: "images/official/room-mountain.webp",
      imageAlt: "Интерьер двухместного номера отеля «Мироген»",
      capacity: "категория для двухместного размещения",
      view: "горы",
      details: roomDetails,
      sourceUrl: roomSourceUrl,
    },
    {
      id: "improved",
      name: "Двухместный улучшенный с видом на море",
      image: "images/official/room-improved.webp",
      imageAlt: "Интерьер улучшенного двухместного номера отеля «Мироген»",
      capacity: "улучшенная категория",
      view: "море",
      details: roomDetails,
      sourceUrl: roomSourceUrl,
    },
    {
      id: "direct-sea",
      name: "Полулюкс с видом прямо на море",
      image: "images/official/room-direct-sea.webp",
      imageAlt: "Полулюкс отеля «Мироген» с видом прямо на море",
      capacity: "категория полулюкс",
      view: "море прямо",
      details: roomDetails,
      sourceUrl: roomSourceUrl,
    },
    {
      id: "side-sea",
      name: "Полулюкс с видом на море сбоку",
      image: "images/official/room-side-sea.webp",
      imageAlt: "Полулюкс отеля «Мироген» с боковым видом на море",
      capacity: "категория полулюкс",
      view: "море сбоку",
      details: roomDetails,
      sourceUrl: roomSourceUrl,
    },
    {
      id: "suite-sea",
      name: "Люкс с видом на море",
      image: "images/official/room-suite.webp",
      imageAlt: "Люкс отеля «Мироген» с видом на море",
      capacity: "двухкомнатная категория",
      view: "море",
      details: ["2 комнаты", "2 балкона", "кондиционер", "телевизор", "холодильник"],
      sourceUrl: roomSourceUrl,
    },
    {
      id: "suite-pool",
      name: "Люкс с видом на бассейн",
      image: "images/official/room-pool-suite.webp",
      imageAlt: "Люкс отеля «Мироген» с видом на бассейн",
      capacity: "двухкомнатная категория",
      view: "бассейн",
      details: ["2 комнаты", "2 балкона", "кондиционер", "телевизор", "холодильник"],
      sourceUrl: roomSourceUrl,
    },
  ] satisfies RoomOption[],
  featuredRoomIds: ["sea", "pool", "mountain", "improved"],
  meals: [
    {
      id: "breakfast",
      name: "Завтрак",
      description: "Утренний приём пищи по системе «меню-заказ».",
      hours: "08:00–10:00",
    },
    {
      id: "half-board",
      name: "Полупансион",
      description: "Два приёма пищи по системе «меню-заказ».",
      hours: "Обед 13:00–15:00 или ужин 18:30–20:00",
    },
    {
      id: "full-board",
      name: "Полный пансион",
      description: "Завтрак, обед и ужин по системе «меню-заказ».",
      hours: "08:00–10:00 · 13:00–15:00 · 18:30–20:00",
    },
  ] satisfies MealOption[],
  gallery: [
    {
      label: "Фасад",
      title: "Отель у моря в Лермонтово",
      text: "Фотография из официальной галереи отеля.",
      image: "images/official/gallery-1.webp",
      imageAlt: "Фасад отеля «Мироген» и бассейн",
    },
    {
      label: "Бассейн",
      title: "Подогреваемый бассейн",
      text: "На территории есть гидромассаж и водопад.",
      image: "images/official/pool.webp",
      imageAlt: "Подогреваемый бассейн отеля «Мироген»",
    },
    {
      label: "Номер",
      title: "Номера с балконами",
      text: "Официальный сайт указывает балконы во всех номерах.",
      image: "images/official/room-sea.webp",
      imageAlt: "Номер отеля «Мироген» с балконом",
    },
    {
      label: "Питание",
      title: "Столовая и кафе-бар",
      text: "Питание по системе «меню-заказ» и кафе-бар у бассейна.",
      image: "images/official/food.webp",
      imageAlt: "Питание на территории отеля «Мироген»",
    },
  ],
  faqs: [
    {
      question: "Какой срок у предложения?",
      answer:
        "Актуальный срок предложения подтвердит администратор. Мы не показываем на странице дату, пока она не подтверждена владельцем.",
    },
    {
      question: "Какие категории номеров можно проверить?",
      answer:
        "Двухместные с видом на море, бассейн и горы, двухместный улучшенный, полулюксы с прямым и боковым видом на море, а также люксы с видом на море и бассейн.",
    },
    {
      question: "Какие варианты питания есть?",
      answer:
        "Завтрак, полупансион и полный пансион по системе «меню-заказ». На официальной странице указаны часы завтрака 08:00–10:00, обеда 13:00–15:00 и ужина 18:30–20:00.",
    },
    {
      question: "Можно приехать с детьми?",
      answer:
        "Официальный сайт указывает размещение гостей с детьми любого возраста. Для семей доступны детская комната и игровая площадка.",
    },
    {
      question: "Когда заезд и выезд?",
      answer:
        "На официальном сайте указаны заезд с 14:00 и выезд до 12:00.",
    },
    {
      question: "Что произойдёт после отправки запроса?",
      answer:
        "Администратор проверит наличие, стоимость и условия по выбранным датам, номеру и питанию. Запрос сам по себе не означает подтверждение бронирования.",
    },
  ],
  sourceUrls: [
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/",
    roomSourceUrl,
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/food/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/services/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/contact/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/galerey/",
    "https://xn----ftbecnqilbfvs6k.xn--p1ai/politic/compliance.php",
  ],
} as const;

export type HotelData = typeof hotelData;
