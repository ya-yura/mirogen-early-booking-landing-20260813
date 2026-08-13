"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { hotelData, type RoomOption } from "./data";

type BookingState = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childAges: string[];
  roomId: string;
  mealId: string;
  name: string;
  contact: string;
  email: string;
  comment: string;
};

type FormErrors = Partial<Record<keyof BookingState | "form", string>>;

const initialBooking: BookingState = {
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  childAges: [],
  roomId: hotelData.rooms[0].id,
  mealId: hotelData.meals[0].id,
  name: "",
  contact: "",
  email: "",
  comment: "",
};

function formatDate(value: string, withYear = true) {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
  }).format(date);
}

function getNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T12:00:00`).getTime();
  const end = new Date(`${checkOut}T12:00:00`).getTime();
  return end > start ? Math.round((end - start) / 86_400_000) : 0;
}

function pluralize(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function getRoom(roomId: string): RoomOption {
  return hotelData.rooms.find((room) => room.id === roomId) ?? hotelData.rooms[0];
}

function getMessage(booking: BookingState, utm: Record<string, string>) {
  const room = getRoom(booking.roomId);
  const meal = hotelData.meals.find((item) => item.id === booking.mealId);
  const children = booking.children
    ? `${booking.children} (${booking.childAges.join(", ")} лет)`
    : "нет";
  const utmLine = Object.keys(utm).length
    ? Object.entries(utm)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")
    : "не переданы";

  return [
    "Здравствуйте! Хотим проверить раннее бронирование в отеле «Мироген».",
    `Заезд: ${formatDate(booking.checkIn)}`,
    `Выезд: ${formatDate(booking.checkOut)}`,
    `Ночей: ${getNights(booking.checkIn, booking.checkOut) || "уточнить"}`,
    `Гости: ${booking.adults} ${pluralize(booking.adults, "взрослый", "взрослых", "взрослых")}`,
    `Дети: ${children}`,
    `Категория номера: ${room.name}`,
    `Питание: ${meal?.name ?? "уточнить"}`,
    `Комментарий: ${booking.comment || "—"}`,
    `Имя: ${booking.name || "—"}`,
    `Контакт: ${booking.contact || "—"}`,
    `E-mail: ${booking.email || "—"}`,
    `UTM: ${utmLine}`,
    "Просим сообщить актуальную стоимость, доступность и условия предложения.",
  ].join("\n");
}

export default function Home() {
  const [booking, setBooking] = useState<BookingState>(initialBooking);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const utm = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].reduce<Record<string, string>>((result, key) => {
      const value = params.get(key);
      if (value) result[key] = value;
      return result;
    }, {});
  }, []);

  const nights = getNights(booking.checkIn, booking.checkOut);
  const selectedRoom = getRoom(booking.roomId);
  const selectedMeal = hotelData.meals.find((meal) => meal.id === booking.mealId);
  const message = useMemo(() => getMessage(booking, utm), [booking, utm]);
  const whatsappHref = `${hotelData.contacts.whatsapp}?text=${encodeURIComponent(message)}`;
  const mailHref = `${hotelData.contacts.emailHref}?subject=${encodeURIComponent("Проверка условий раннего бронирования")}&body=${encodeURIComponent(message)}`;

  function updateBooking<Key extends keyof BookingState>(key: Key, value: BookingState[Key]) {
    setBooking((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
    setSubmitted(false);
  }

  function updateChildren(value: number) {
    const childAges = Array.from({ length: value }, (_, index) => booking.childAges[index] ?? "");
    setBooking((current) => ({ ...current, children: value, childAges }));
    setErrors((current) => ({ ...current, children: undefined, childAges: undefined, form: undefined }));
  }

  function updateChildAge(index: number, value: string) {
    const childAges = [...booking.childAges];
    childAges[index] = value;
    setBooking((current) => ({ ...current, childAges }));
    setErrors((current) => ({ ...current, childAges: undefined, form: undefined }));
  }

  function validateSelection() {
    const nextErrors: FormErrors = {};
    if (!booking.checkIn) nextErrors.checkIn = "Укажите дату заезда";
    if (!booking.checkOut) nextErrors.checkOut = "Укажите дату выезда";
    if (booking.checkIn && booking.checkOut && nights < 1) {
      nextErrors.checkOut = "Дата выезда должна быть позже даты заезда";
    }
    if (booking.children > 0 && booking.childAges.some((age) => !age)) {
      nextErrors.childAges = "Укажите возраст каждого ребёнка";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleContinue() {
    if (!validateSelection()) return;
    setStep(2);
    window.setTimeout(() => document.getElementById("contact-step")?.focus(), 50);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!validateSelection()) return;
    if (!booking.name.trim()) nextErrors.name = "Укажите имя";
    if (!booking.contact.trim()) nextErrors.contact = "Оставьте телефон или WhatsApp";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      window.setTimeout(() => document.getElementById("request-result")?.focus(), 50);
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setErrors({ form: "Не удалось скопировать сообщение. Используйте WhatsApp или e-mail." });
    }
  }

  function scrollToBooking() {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="site-shell">
      <section className="hero" id="top">
        <img
          className="hero-image"
          src="/images/official/gallery-1.webp"
          alt="Фасад отеля «Мироген» и бассейн с видом на море"
          fetchPriority="high"
        />
        <div className="hero-shade" aria-hidden="true" />
        <header className="topbar page-width">
          <a className="wordmark" href="#top" aria-label="Мироген — в начало">
            <span>МИРОГЕН</span>
            <small>Лермонтово</small>
          </a>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#offer">Условия</a>
            <a href="#booking">Проверить даты</a>
            <a href="#rooms">Номера</a>
            <a href="#faq">Вопросы</a>
          </nav>
          <a className="topbar-phone" href={hotelData.contacts.phoneHref}>
            <span aria-hidden="true">◌</span> {hotelData.contacts.phone}
          </a>
        </header>

        <div className="hero-content page-width">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Отель у моря · Лермонтово</p>
            <h1>{hotelData.offer.title}</h1>
            <p className="hero-lede">{hotelData.offer.description}</p>
            <div className="offer-chip">
              <span className="offer-chip-mark">01</span>
              <span>
                <strong>{hotelData.offer.label}</strong>
                <small>Срок и расчёт проверим по вашим датам</small>
              </span>
            </div>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={scrollToBooking}>
                Проверить даты и условия <span aria-hidden="true">↘</span>
              </button>
              <a className="button button-ghost" href="#rooms">
                Посмотреть номера <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <aside className="hero-rail" aria-label="Сценарий заявки">
            <p className="rail-kicker">Ваш маршрут к отдыху</p>
            <div className="route-line" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className="route-list">
              <span><b>01</b> даты проживания</span>
              <span><b>02</b> состав семьи</span>
              <span><b>03</b> номер и питание</span>
              <span><b>04</b> заявка администратору</span>
            </div>
            <p className="hero-rail-note">Без расчёта «на глаз» — только актуальные условия под ваш заезд.</p>
          </aside>
        </div>
        <div className="hero-bottom page-width">
          <span>Краснодарский край · Туапсинский район</span>
          <a href="#experience">Смотреть, как проходит отдых <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="trust-strip" aria-label="Проверенные преимущества">
        <div className="page-width trust-grid">
          {hotelData.amenities.map((amenity) => (
            <article className="trust-item" key={amenity.mark}>
              <span className="trust-mark">{amenity.mark}</span>
              <div>
                <p>{amenity.eyebrow}</p>
                <h2>{amenity.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-offer" id="offer">
        <div className="page-width offer-grid">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-dot" /> Один оффер · ясный следующий шаг</p>
            <h2>Сначала узнаём вашу поездку. Потом считаем условия.</h2>
            <p>
              У «Мирогена» несколько категорий номеров и форматов питания. Поэтому итоговая выгода не прячется за общей цифрой: мы проверяем её по конкретным датам и составу семьи.
            </p>
          </div>
          <article className="offer-card">
            <div className="offer-card-top">
              <span className="card-index">01 / {hotelData.year}</span>
              <span className="status-dot">Актуально к проверке</span>
            </div>
            <h3>{hotelData.offer.label}</h3>
            <p className="offer-card-description">{hotelData.offer.audience}</p>
            <div className="offer-details">
              <div>
                <span>Даты проживания</span>
                <strong>{hotelData.offer.dates}</strong>
              </div>
              <div>
                <span>Что входит</span>
                <ul>
                  {hotelData.offer.includes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <span>Как рассчитывается</span>
                <strong>{hotelData.offer.calculation}</strong>
              </div>
            </div>
            <button className="text-link" type="button" onClick={scrollToBooking}>Перейти к проверке <span aria-hidden="true">↘</span></button>
          </article>
        </div>
      </section>

      <section className="section booking-section" id="booking">
        <div className="page-width">
          <div className="section-heading booking-heading">
            <p className="eyebrow"><span className="eyebrow-dot" /> Персональный расчёт</p>
            <h2>Соберите поездку в двух шагах</h2>
            <p>Выберите параметры отдыха, а мы подготовим структурированный запрос администратору.</p>
          </div>
          <div className="stepper" role="tablist" aria-label="Шаги заявки">
            <button className={step === 1 ? "step-tab is-active" : "step-tab"} type="button" role="tab" aria-selected={step === 1} onClick={() => setStep(1)}>
              <span>01</span><strong>Поездка</strong><small>даты · гости · номер</small>
            </button>
            <span className="step-divider" aria-hidden="true" />
            <button className={step === 2 ? "step-tab is-active" : "step-tab"} type="button" role="tab" aria-selected={step === 2} onClick={() => validateSelection() && setStep(2)}>
              <span>02</span><strong>Контакт</strong><small>кому отправить ответ</small>
            </button>
          </div>

          <div className="booking-layout">
            <form className="booking-form" onSubmit={handleSubmit} noValidate>
              {step === 1 ? (
                <div className="form-step" role="tabpanel" aria-label="Параметры поездки">
                  <div className="form-section-header"><span>01</span><div><h3>Параметры поездки</h3><p>Укажите ориентиры — точную стоимость подтвердит администратор.</p></div></div>
                  <div className="field-grid two-columns">
                    <label className={errors.checkIn ? "field has-error" : "field"}>
                      <span>Заезд</span>
                      <input type="date" min={hotelData.currentDate} value={booking.checkIn} onChange={(event) => updateBooking("checkIn", event.target.value)} aria-invalid={Boolean(errors.checkIn)} />
                      {errors.checkIn && <em>{errors.checkIn}</em>}
                    </label>
                    <label className={errors.checkOut ? "field has-error" : "field"}>
                      <span>Выезд</span>
                      <input type="date" min={booking.checkIn || hotelData.currentDate} value={booking.checkOut} onChange={(event) => updateBooking("checkOut", event.target.value)} aria-invalid={Boolean(errors.checkOut)} />
                      {errors.checkOut && <em>{errors.checkOut}</em>}
                    </label>
                  </div>
                  <div className="field-grid guest-grid">
                    <label className="field"><span>Взрослые</span><select value={booking.adults} onChange={(event) => updateBooking("adults", Number(event.target.value))}>{[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value} {pluralize(value, "взрослый", "взрослых", "взрослых")}</option>)}</select></label>
                    <label className="field"><span>Дети</span><select value={booking.children} onChange={(event) => updateChildren(Number(event.target.value))}>{[0, 1, 2, 3].map((value) => <option key={value} value={value}>{value === 0 ? "Нет детей" : `${value} ${pluralize(value, "ребёнок", "ребёнка", "детей")}`}</option>)}</select></label>
                  </div>
                  {booking.children > 0 && <div className="children-ages"><div className="sub-label">Возраст детей на дату заезда</div><div className="age-grid">{booking.childAges.map((age, index) => <label className="field" key={`child-${index}`}><span>Ребёнок {index + 1}</span><input type="number" min="0" max="17" value={age} placeholder="лет" onChange={(event) => updateChildAge(index, event.target.value)} /></label>)}</div>{errors.childAges && <p className="inline-error">{errors.childAges}</p>}</div>}
                  <div className="form-section-header compact"><span>02</span><div><h3>Категория номера</h3><p>Выберите вариант, который хотите проверить.</p></div></div>
                  <div className="mini-room-grid">{hotelData.rooms.map((room) => <article className={booking.roomId === room.id ? "mini-room is-selected" : "mini-room"} key={room.id}><img src={room.image} alt={room.imageAlt} loading="lazy" /><div className="mini-room-body"><span>{room.view}</span><h4>{room.name}</h4><button type="button" onClick={() => updateBooking("roomId", room.id)}>{booking.roomId === room.id ? "Выбрано" : "Выбрать"}<span aria-hidden="true">→</span></button></div></article>)}</div>
                  <div className="form-section-header compact"><span>03</span><div><h3>Питание</h3><p>Формат проверим вместе с номером и датами.</p></div></div>
                  <div className="meal-grid">{hotelData.meals.map((meal) => <button className={booking.mealId === meal.id ? "meal-option is-selected" : "meal-option"} type="button" key={meal.id} onClick={() => updateBooking("mealId", meal.id)}><span className="meal-check">{booking.mealId === meal.id ? "✓" : ""}</span><span><strong>{meal.name}</strong><small>{meal.description}</small><em>{meal.hours}</em></span></button>)}</div>
                  <div className="form-actions"><button className="button button-primary button-wide" type="button" onClick={handleContinue}>Дальше: контакт <span aria-hidden="true">→</span></button></div>
                </div>
              ) : (
                <div className="form-step" id="contact-step" role="tabpanel" aria-label="Контакт для ответа" tabIndex={-1}>
                  <div className="form-section-header"><span>02</span><div><h3>Куда отправить ответ</h3><p>Оставьте один удобный способ связи — телефон или WhatsApp достаточно.</p></div></div>
                  <div className="field-grid two-columns">
                    <label className={errors.name ? "field has-error" : "field"}><span>Имя</span><input type="text" autoComplete="name" value={booking.name} onChange={(event) => updateBooking("name", event.target.value)} placeholder="Как к вам обращаться" aria-invalid={Boolean(errors.name)} />{errors.name && <em>{errors.name}</em>}</label>
                    <label className={errors.contact ? "field has-error" : "field"}><span>Телефон или WhatsApp</span><input type="text" autoComplete="tel" value={booking.contact} onChange={(event) => updateBooking("contact", event.target.value)} placeholder="+7 (___) ___-__-__" aria-invalid={Boolean(errors.contact)} />{errors.contact && <em>{errors.contact}</em>}</label>
                  </div>
                  <label className="field"><span>E-mail <small>по желанию</small></span><input type="email" autoComplete="email" value={booking.email} onChange={(event) => updateBooking("email", event.target.value)} placeholder="name@example.ru" /></label>
                  <label className="field"><span>Комментарий</span><textarea rows={5} value={booking.comment} onChange={(event) => updateBooking("comment", event.target.value)} placeholder="Например, важен вид на море или нужен детский стул" /></label>
                  <div className="contact-note"><span className="note-mark">i</span><p>Заявка не подтверждает бронирование автоматически. Она подготовит понятный запрос для администратора «Мирогена».</p></div>
                  {errors.form && <p className="inline-error">{errors.form}</p>}
                  <div className="form-actions form-actions-between"><button className="button button-secondary" type="button" onClick={() => setStep(1)}>← Назад к выбору</button><button className="button button-primary" type="submit">Сформировать заявку <span aria-hidden="true">↘</span></button></div>
                </div>
              )}
              {submitted && <div className="request-result" id="request-result" tabIndex={-1} aria-live="polite"><div className="result-top"><span className="result-check">✓</span><div><p className="eyebrow">Сообщение готово</p><h3>Выберите удобный способ отправки</h3></div></div><p>Проверьте текст и отправьте запрос администратору. Доступность, стоимость и условия будут подтверждены отдельно.</p><div className="result-actions"><a className="button button-primary" href={whatsappHref} target="_blank" rel="noreferrer">Открыть WhatsApp <span aria-hidden="true">↗</span></a><a className="button button-secondary" href={mailHref}>Отправить e-mail <span aria-hidden="true">↗</span></a><button className="button button-quiet" type="button" onClick={copyMessage}>{copied ? "Скопировано" : "Скопировать заявку"}</button></div><details className="message-preview"><summary>Посмотреть текст заявки</summary><pre>{message}</pre></details></div>}
            </form>

            <aside className="booking-summary" aria-label="Итоговая заявка">
              <div className="summary-head"><p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Ваша поездка</p><span className="summary-step">01—02</span></div>
              <h3>Проверяем под ваш заезд</h3>
              <div className="summary-block"><span>Период</span><strong>{booking.checkIn && booking.checkOut ? `${formatDate(booking.checkIn, false)} — ${formatDate(booking.checkOut, false)}` : "Выберите даты"}</strong><small>{nights ? `${nights} ${pluralize(nights, "ночь", "ночи", "ночей")}` : "Количество ночей появится здесь"}</small></div>
              <div className="summary-block"><span>Гости</span><strong>{booking.adults} {pluralize(booking.adults, "взрослый", "взрослых", "взрослых")}{booking.children ? ` · ${booking.children} ${pluralize(booking.children, "ребёнок", "ребёнка", "детей")}` : ""}</strong><small>{booking.children ? `Возраст: ${booking.childAges.map((age) => age || "—").join(", ")} лет` : "Без детей"}</small></div>
              <div className="summary-block"><span>Номер</span><strong>{selectedRoom.name}</strong><small>{selectedRoom.capacity} · вид на {selectedRoom.view}</small></div>
              <div className="summary-block"><span>Питание</span><strong>{selectedMeal?.name}</strong><small>{selectedMeal?.hours}</small></div>
              <div className="summary-warning"><span aria-hidden="true">↗</span><p>Точную стоимость, доступность и условия предложения сообщит администратор после проверки.</p></div>
              <a className="summary-phone" href={hotelData.contacts.phoneHref}>Можно сразу позвонить <strong>{hotelData.contacts.phone}</strong></a>
            </aside>
          </div>
        </div>
      </section>

      <section className="section rooms-section" id="rooms">
        <div className="page-width">
          <div className="section-heading rooms-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Категории из официального фонда</p><h2>Номер начинается с вида</h2><p>Выберите категорию — она сохранится в вашей заявке вместе с датами и питанием.</p></div>
          <div className="room-grid">{hotelData.rooms.map((room) => <article className={booking.roomId === room.id ? "room-card is-selected" : "room-card"} key={room.id}><div className="room-image-wrap"><img src={room.image} alt={room.imageAlt} loading="lazy" /><span className="room-view-tag">вид на {room.view}</span></div><div className="room-card-body"><div className="room-card-meta"><span>{room.capacity}</span><span>балкон</span></div><h3>{room.name}</h3><ul>{room.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><button className="text-link" type="button" onClick={() => { updateBooking("roomId", room.id); scrollToBooking(); }}>{booking.roomId === room.id ? "Выбрано для проверки" : "Выбрать категорию"} <span aria-hidden="true">↘</span></button></div></article>)}</div>
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="page-width">
          <div className="experience-intro"><div className="section-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Пять состояний отдыха</p><h2>Утро → номер → бассейн → море → ужин</h2></div><p className="experience-note">Фотографии — из официальных материалов отеля. Сценарий помогает представить ритм отдыха и выбрать, что важно именно вашей семье.</p></div>
          <div className="moment-grid">{hotelData.moments.map((moment, index) => <article className={`moment-card moment-${index + 1}`} key={moment.label}><img src={moment.image} alt={moment.imageAlt} loading="lazy" /><div className="moment-overlay"><span>{moment.label}</span><h3>{moment.title}</h3><p>{moment.text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="page-width faq-layout">
          <div className="section-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Перед поездкой</p><h2>Ответы без лишнего шума</h2><p>Если вопрос зависит от дат или состава гостей, лучше сразу передать его администратору вместе с заявкой.</p><a className="text-link" href={hotelData.contacts.whatsapp} target="_blank" rel="noreferrer">Задать вопрос в WhatsApp <span aria-hidden="true">↗</span></a></div>
          <div className="faq-list">{hotelData.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="page-width final-cta-inner"><div><p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Прямое обращение в отель</p><h2>Проверим актуальные условия для вашего заезда</h2><p>Выберите даты и оставьте контакт — готовое сообщение можно отправить в WhatsApp, по e-mail или скопировать.</p></div><button className="button button-primary" type="button" onClick={scrollToBooking}>Проверить даты и условия <span aria-hidden="true">↘</span></button></div>
      </section>

      <footer className="footer"><div className="page-width footer-grid"><div><a className="wordmark wordmark-dark" href="#top"><span>МИРОГЕН</span><small>Лермонтово</small></a><p className="footer-address">{hotelData.address}</p></div><div className="footer-contact"><a href={hotelData.contacts.phoneHref}>{hotelData.contacts.phone}</a><a href={hotelData.contacts.emailHref}>{hotelData.contacts.email}</a><a href={hotelData.contacts.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></div><div className="footer-links"><a href="#offer">Условия</a><a href="#rooms">Номера</a><a href="#faq">Вопросы</a><a href="#top">Наверх ↑</a></div></div><div className="page-width footer-bottom"><span>Отель «Мироген» · Лермонтово</span><span>Прямое обращение к администратору</span></div></footer>
      <a className="mobile-cta" href="#booking">Проверить даты и условия <span aria-hidden="true">↘</span></a>
    </main>
  );
}
