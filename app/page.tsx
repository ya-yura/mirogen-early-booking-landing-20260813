"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import { hotelData, type PreferredChannel, type RoomOption } from "./data";

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
  preferredChannel: PreferredChannel | "";
  comment: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof BookingState | "form", string>>;

const initialBooking: BookingState = {
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  childAges: [],
  roomId: "",
  mealId: "",
  name: "",
  contact: "",
  email: "",
  preferredChannel: "",
  comment: "",
  consent: false,
};

const channelLabels: Record<PreferredChannel, string> = {
  whatsapp: "WhatsApp",
  phone: "Телефон",
  email: "E-mail",
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

function getRoom(roomId: string): RoomOption | undefined {
  return hotelData.rooms.find((room) => room.id === roomId);
}

function getMeal(mealId: string) {
  return hotelData.meals.find((meal) => meal.id === mealId);
}

function getMessage(booking: BookingState, utm: Record<string, string>) {
  const room = getRoom(booking.roomId);
  const meal = getMeal(booking.mealId);
  const guestLine = `${booking.adults} ${pluralize(booking.adults, "взрослый", "взрослых", "взрослых")}${booking.children ? `, ${booking.children} ${pluralize(booking.children, "ребёнок", "ребёнка", "детей")}` : ""}`;
  const ageLine = booking.children ? booking.childAges.map((age) => `${age || "—"} лет`).join(", ") : "нет детей";
  const contactLine = [booking.contact.trim(), booking.email.trim()].filter(Boolean).join("; ") || "не указан";
  const utmLine = Object.entries(utm)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  return [
    "Здравствуйте! Подскажите, пожалуйста, актуальные условия проживания в отеле «Мироген».",
    "",
    `Заезд: ${formatDate(booking.checkIn)}`,
    `Выезд: ${formatDate(booking.checkOut)}`,
    `Ночей: ${getNights(booking.checkIn, booking.checkOut) || "уточнить"}`,
    `Гости: ${guestLine}`,
    `Возраст детей: ${ageLine}`,
    `Категория номера: ${room?.name ?? "не выбрана"}`,
    `Питание: ${meal?.name ?? "не выбрано"}`,
    "",
    `Имя: ${booking.name.trim() || "не указано"}`,
    `Контакт для ответа: ${contactLine}`,
    `Предпочтительный канал: ${booking.preferredChannel ? channelLabels[booking.preferredChannel] : "уточнить"}`,
    `Комментарий: ${booking.comment.trim() || "нет"}`,
    utmLine ? `Источник: ${utmLine}` : "",
  ].filter((line, index, lines) => line || (index > 0 && lines[index - 1])).join("\n");
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && /^[78]/.test(digits));
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Home() {
  const [booking, setBooking] = useState<BookingState>(initialBooking);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const utm = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].reduce<Record<string, string>>((result, key) => {
      const value = params.get(key);
      if (value) result[key] = value;
      return result;
    }, {});
  }, []);

  const nights = getNights(booking.checkIn, booking.checkOut);
  const selectedRoom = getRoom(booking.roomId);
  const selectedMeal = getMeal(booking.mealId);
  const message = useMemo(() => getMessage(booking, utm), [booking, utm]);
  const whatsappHref = `${hotelData.contacts.whatsapp}?text=${encodeURIComponent(message)}`;
  const mailHref = `${hotelData.contacts.emailHref}?subject=${encodeURIComponent("Проверка условий проживания в отеле «Мироген»")}&body=${encodeURIComponent(message)}`;
  const featuredRooms = hotelData.rooms.filter((room) => hotelData.featuredRoomIds.includes(room.id));
  const catalogRooms = showAllRooms ? hotelData.rooms : featuredRooms;

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

  function selectionErrors() {
    const nextErrors: FormErrors = {};
    if (!booking.checkIn) nextErrors.checkIn = "Укажите дату заезда";
    if (!booking.checkOut) nextErrors.checkOut = "Укажите дату выезда";
    if (booking.checkIn && booking.checkOut && nights < 1) nextErrors.checkOut = "Дата выезда должна быть позже даты заезда";
    if (booking.children > 0 && booking.childAges.some((age) => !age || Number(age) < 0 || Number(age) > 17)) nextErrors.childAges = "Укажите возраст каждого ребёнка от 0 до 17 лет";
    if (!booking.roomId) nextErrors.roomId = "Выберите категорию номера";
    if (!booking.mealId) nextErrors.mealId = "Выберите формат питания";
    return nextErrors;
  }

  function contactErrors() {
    const nextErrors: FormErrors = {};
    if (!booking.name.trim()) nextErrors.name = "Укажите имя";
    if (!booking.contact.trim() && !booking.email.trim()) nextErrors.contact = "Укажите хотя бы один способ связи";
    if (booking.contact.trim() && !isValidPhone(booking.contact)) nextErrors.contact = "Проверьте формат телефона";
    if (booking.email.trim() && !isValidEmail(booking.email)) nextErrors.email = "Проверьте формат e-mail";
    if (!booking.preferredChannel) nextErrors.preferredChannel = "Выберите канал ответа";
    if (booking.preferredChannel === "email" && !booking.email.trim()) nextErrors.email = "Укажите e-mail для выбранного канала";
    if (booking.preferredChannel !== "email" && !booking.contact.trim()) nextErrors.contact = "Укажите телефон или WhatsApp для выбранного канала";
    if (!booking.consent) nextErrors.consent = "Подтвердите согласие на обработку персональных данных";
    return nextErrors;
  }

  function handleContinue() {
    const nextErrors = selectionErrors();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setStep(2);
      window.setTimeout(() => document.getElementById("contact-step")?.focus(), 50);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = { ...selectionErrors(), ...contactErrors() };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      window.setTimeout(() => document.getElementById("request-result")?.focus(), 50);
    }
  }

  function handleStepKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    if (event.key === "ArrowLeft") {
      setStep(1);
      document.getElementById("step-1-tab")?.focus();
      return;
    }
    const nextErrors = selectionErrors();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setStep(2);
      document.getElementById("step-2-tab")?.focus();
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setErrors({ form: "Не удалось скопировать запрос. Используйте WhatsApp или e-mail." });
    }
  }

  function scrollToBooking() {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

  function selectRoom(roomId: string) {
    updateBooking("roomId", roomId);
    scrollToBooking();
  }

  return (
    <main className="site-shell">
      <section className="hero" id="top">
        <img className="hero-image" src="images/official/gallery-1.webp" width={999} height={667} alt="Фасад отеля «Мироген» и бассейн" fetchPriority="high" />
        <div className="hero-shade" aria-hidden="true" />
        <header className="topbar page-width">
          <a className="wordmark" href="#top" aria-label="Мироген — в начало"><span>МИРОГЕН</span><small>Лермонтово</small></a>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#how">Как работает</a><a href="#rooms">Номера</a><a href="#booking">Проверить даты</a><a href="#faq">Вопросы</a>
          </nav>
          <a className="topbar-phone" href={hotelData.contacts.phoneHref}><span aria-hidden="true">◌</span> {hotelData.contacts.phone}</a>
        </header>

        <div className="hero-content page-width">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Отель «Мироген» · Лермонтово</p>
            <h1>{hotelData.offer.title}</h1>
            <p className="hero-lede">{hotelData.offer.description}</p>
            <div className="offer-chip">
              <span className="offer-chip-mark">01</span>
              <span><strong>{hotelData.offer.label}</strong><small>{hotelData.offer.deadlineText}</small></span>
            </div>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={scrollToBooking}>Проверить даты и стоимость <span aria-hidden="true">↘</span></button>
              <a className="button button-ghost" href="#rooms">Посмотреть номера <span aria-hidden="true">→</span></a>
            </div>
            <p className="cta-note">Это запрос на проверку, а не автоматическое подтверждение бронирования.</p>
          </div>
          <aside className="hero-rail" aria-label="Как работает проверка условий">
            <p className="rail-kicker">Как работает проверка</p>
            <div className="route-line" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className="route-list"><span><b>01</b> вы выбираете даты</span><span><b>02</b> добавляете гостей</span><span><b>03</b> указываете номер и питание</span><span><b>04</b> отправляете запрос</span></div>
            <p className="hero-rail-note">Администратор возвращает актуальную стоимость, доступность и условия.</p>
          </aside>
        </div>
        <div className="hero-bottom page-width"><span>{hotelData.address}</span><a href="#how">Что проверим <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="trust-strip" aria-label="Проверенные преимущества">
        <div className="page-width trust-grid">{hotelData.amenities.map((amenity) => <article className="trust-item" key={amenity.mark}><span className="trust-mark">{amenity.mark}</span><div><p>{amenity.eyebrow}</p><h2>{amenity.title}</h2></div></article>)}</div>
      </section>

      <section className="section section-offer" id="how">
        <div className="page-width offer-grid">
          <div className="section-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Один понятный следующий шаг</p><h2>Что проверим по вашему запросу</h2><p>{hotelData.offer.process}</p></div>
          <article className="offer-card"><div className="offer-card-top"><span className="card-index">01 / {hotelData.year}</span><span className="status-dot">{hotelData.offer.deadlineText}</span></div><h3>{hotelData.offer.label}</h3><p className="offer-card-description">{hotelData.offer.audience}</p><div className="offer-details"><div><span>Проверим</span><ul>{hotelData.offer.includes.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span>Срок</span><strong>{hotelData.offer.deadlineText}</strong></div><div><span>Важно</span><strong>Отправка формы сама по себе не означает подтверждение бронирования.</strong></div></div><button className="text-link" type="button" onClick={scrollToBooking}>Проверить свои даты <span aria-hidden="true">↘</span></button></article>
        </div>
      </section>

      <section className="section rooms-section" id="rooms">
        <div className="page-width"><div className="rooms-heading"><div className="section-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Категории из официального фонда</p><h2>Выберите номер по виду и формату</h2></div><p>В форме можно выбрать одну категорию для проверки. Ниже — сначала самые понятные варианты, остальные открываются по запросу.</p></div><div className="room-grid">{catalogRooms.map((room) => <article className={selectedRoom?.id === room.id ? "room-card is-selected" : "room-card"} key={room.id}><div className="room-image-wrap"><img src={room.image} width={999} height={667} alt={room.imageAlt} loading="lazy" /><span className="room-view-tag">вид на {room.view}</span></div><div className="room-card-body"><div className="room-card-meta"><span>{room.capacity}</span></div><h3>{room.name}</h3><ul>{room.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><button className="text-link" type="button" onClick={() => selectRoom(room.id)}>{selectedRoom?.id === room.id ? "Выбрано для проверки" : "Выбрать категорию"} <span aria-hidden="true">↘</span></button></div></article>)}</div><button className="room-toggle" type="button" onClick={() => setShowAllRooms((value) => !value)} aria-expanded={showAllRooms}>{showAllRooms ? "Скрыть дополнительные категории" : "Показать все категории"}<span aria-hidden="true">{showAllRooms ? "↑" : "↓"}</span></button></div>
      </section>

      <section className="section food-section" id="food">
        <div className="page-width food-layout"><div className="section-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Питание на территории</p><h2>Выберите формат питания для проверки</h2><p>Официальная страница отеля указывает систему «меню-заказ» и три режима питания. Цена не показывается без подтверждения по вашим датам.</p></div><div className="food-cards">{hotelData.meals.map((meal) => <article className="food-card" key={meal.id}><span className="food-card-index">0{hotelData.meals.indexOf(meal) + 1}</span><h3>{meal.name}</h3><p>{meal.description}</p><strong>{meal.hours}</strong></article>)}</div></div>
      </section>

      <section className="section gallery-section" id="gallery">
        <div className="page-width"><div className="gallery-heading"><div className="section-heading"><p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Реальные фотографии отеля</p><h2>Посмотрите пространство до выбора</h2></div><p>Фотографии взяты из официальных материалов «Мирогена» и сохранены локально для стабильной загрузки страницы.</p></div><div className="gallery-grid">{hotelData.gallery.map((item, index) => <article className={`gallery-card gallery-card-${index + 1}`} key={item.label}><img src={item.image} width={999} height={667} alt={item.imageAlt} loading="lazy" /><div className="gallery-overlay"><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div>
      </section>

      <section className="section booking-section" id="booking">
        <div className="page-width"><div className="section-heading booking-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Запрос администратору</p><h2>Соберите поездку в двух шагах</h2><p>Сначала параметры проживания, затем контакт для ответа. Заполненные значения сохраняются при переходе между шагами.</p></div><div className="stepper" role="tablist" aria-label="Шаги запроса"><button id="step-1-tab" className={step === 1 ? "step-tab is-active" : "step-tab"} type="button" role="tab" aria-selected={step === 1} aria-controls="trip-panel" tabIndex={step === 1 ? 0 : -1} onClick={() => setStep(1)} onKeyDown={handleStepKeyDown}><span>01</span><strong>Поездка</strong><small>даты · гости · номер</small></button><span className="step-divider" aria-hidden="true" /><button id="step-2-tab" className={step === 2 ? "step-tab is-active" : "step-tab"} type="button" role="tab" aria-selected={step === 2} aria-controls="contact-panel" tabIndex={step === 2 ? 0 : -1} onClick={handleContinue} onKeyDown={handleStepKeyDown}><span>02</span><strong>Контакт</strong><small>кому отправить ответ</small></button></div>
          <div className="booking-layout"><form className="booking-form" onSubmit={handleSubmit} noValidate>{step === 1 ? <div className="form-step" id="trip-panel" role="tabpanel" aria-labelledby="step-1-tab"><div className="form-section-header"><span>01</span><div><h3>Параметры поездки</h3><p>Проверьте значения перед переходом к контакту.</p></div></div><div className="field-grid two-columns"><label className={errors.checkIn ? "field has-error" : "field"}><span>Заезд</span><input type="date" min={hotelData.currentDate} value={booking.checkIn} onChange={(event) => updateBooking("checkIn", event.target.value)} aria-invalid={Boolean(errors.checkIn)} />{errors.checkIn && <em>{errors.checkIn}</em>}</label><label className={errors.checkOut ? "field has-error" : "field"}><span>Выезд</span><input type="date" min={booking.checkIn || hotelData.currentDate} value={booking.checkOut} onChange={(event) => updateBooking("checkOut", event.target.value)} aria-invalid={Boolean(errors.checkOut)} />{errors.checkOut && <em>{errors.checkOut}</em>}</label></div><div className="field-grid guest-grid"><label className="field"><span>Взрослые <small>сейчас указано: 2</small></span><select value={booking.adults} onChange={(event) => updateBooking("adults", Number(event.target.value))}>{[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value} {pluralize(value, "взрослый", "взрослых", "взрослых")}</option>)}</select></label><label className="field"><span>Дети</span><select value={booking.children} onChange={(event) => updateChildren(Number(event.target.value))}>{[0, 1, 2, 3].map((value) => <option key={value} value={value}>{value === 0 ? "Нет детей" : `${value} ${pluralize(value, "ребёнок", "ребёнка", "детей")}`}</option>)}</select></label></div>{booking.children > 0 && <div className="children-ages"><div className="sub-label">Возраст детей на дату заезда</div><div className="age-grid">{booking.childAges.map((age, index) => <label className="field" key={`child-${index}`}><span>Ребёнок {index + 1}</span><input type="number" min="0" max="17" value={age} placeholder="лет" onChange={(event) => updateChildAge(index, event.target.value)} /></label>)}</div>{errors.childAges && <p className="inline-error">{errors.childAges}</p>}</div>}<div className="form-section-header compact"><span>02</span><div><h3>Категория номера</h3><p>Выберите вариант, который хотите проверить.</p></div></div><label className={errors.roomId ? "field has-error" : "field"}><span>Номер</span><select value={booking.roomId} onChange={(event) => updateBooking("roomId", event.target.value)} aria-invalid={Boolean(errors.roomId)}><option value="">Выберите категорию номера</option>{hotelData.rooms.map((room) => <option value={room.id} key={room.id}>{room.name}</option>)}</select>{errors.roomId && <em>{errors.roomId}</em>}</label>{selectedRoom && <div className="room-picker"><img src={selectedRoom.image} width={999} height={667} alt={selectedRoom.imageAlt} loading="lazy" /><div><span>Вы выбрали</span><strong>{selectedRoom.name}</strong><small>{selectedRoom.details.join(" · ")}</small></div></div>}<div className="form-section-header compact"><span>03</span><div><h3>Питание</h3><p>Цена питания не показывается без актуального расчёта.</p></div></div><div className="meal-grid">{hotelData.meals.map((meal) => <button className={booking.mealId === meal.id ? "meal-option is-selected" : "meal-option"} type="button" key={meal.id} onClick={() => updateBooking("mealId", meal.id)} aria-pressed={booking.mealId === meal.id}><span className="meal-check">{booking.mealId === meal.id ? "✓" : ""}</span><span><strong>{meal.name}</strong><small>{meal.description}</small><em>{meal.hours}</em></span></button>)}</div>{errors.mealId && <p className="inline-error">{errors.mealId}</p>}<div className="form-actions"><button className="button button-primary button-wide" type="button" onClick={handleContinue}>Дальше: контакт <span aria-hidden="true">→</span></button></div></div> : <div className="form-step" id="contact-panel" role="tabpanel" aria-labelledby="step-2-tab" tabIndex={-1}><div className="form-section-header"><span>02</span><div><h3 id="contact-step">Куда отправить ответ</h3><p>Оставьте имя и хотя бы один рабочий канал связи.</p></div></div><div className="field-grid two-columns"><label className={errors.name ? "field has-error" : "field"}><span>Имя</span><input type="text" autoComplete="name" value={booking.name} onChange={(event) => updateBooking("name", event.target.value)} placeholder="Как к вам обращаться" aria-invalid={Boolean(errors.name)} />{errors.name && <em>{errors.name}</em>}</label><label className={errors.contact ? "field has-error" : "field"}><span>Телефон или WhatsApp</span><input type="tel" autoComplete="tel" value={booking.contact} onChange={(event) => updateBooking("contact", event.target.value)} placeholder="+7 (___) ___-__-__" aria-invalid={Boolean(errors.contact)} />{errors.contact && <em>{errors.contact}</em>}</label></div><label className={errors.email ? "field has-error" : "field"}><span>E-mail <small>если удобнее отвечать письменно</small></span><input type="email" autoComplete="email" value={booking.email} onChange={(event) => updateBooking("email", event.target.value)} placeholder="name@example.ru" aria-invalid={Boolean(errors.email)} />{errors.email && <em>{errors.email}</em>}</label><label className={errors.preferredChannel ? "field has-error" : "field"}><span>Предпочтительный канал ответа</span><select value={booking.preferredChannel} onChange={(event) => updateBooking("preferredChannel", event.target.value as PreferredChannel | "")} aria-invalid={Boolean(errors.preferredChannel)}><option value="">Выберите канал</option><option value="whatsapp">WhatsApp</option><option value="phone">Телефон</option><option value="email">E-mail</option></select>{errors.preferredChannel && <em>{errors.preferredChannel}</em>}</label><label className="field"><span>Комментарий <small>по желанию</small></span><textarea rows={4} value={booking.comment} onChange={(event) => updateBooking("comment", event.target.value)} placeholder="Например, важен вид на море или нужен детский стул" /></label><label className={errors.consent ? "consent-field has-error" : "consent-field"}><input type="checkbox" checked={booking.consent} onChange={(event) => updateBooking("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} /><span>Я согласен на обработку персональных данных согласно <a href={hotelData.contacts.consentUrl} target="_blank" rel="noreferrer">официальному документу</a>.</span></label>{errors.consent && <p className="inline-error">{errors.consent}</p>}{errors.form && <p className="inline-error">{errors.form}</p>}<div className="contact-note"><span className="note-mark">i</span><p>Запрос подготовлен для выбранного вами канала. Бронирование считается подтверждённым только после подтверждения отеля.</p></div><div className="form-actions form-actions-between"><button className="button button-secondary" type="button" onClick={() => setStep(1)}>← Назад к параметрам</button><button className="button button-primary" type="submit">Подготовить запрос <span aria-hidden="true">↘</span></button></div></div>}{submitted && <div className="request-result" id="request-result" tabIndex={-1} aria-live="polite"><div className="result-top"><span className="result-check">✓</span><div><p className="eyebrow">Запрос подготовлен</p><h3>Выберите способ отправки</h3></div></div><p>Дождитесь ответа администратора. Бронирование считается подтверждённым только после подтверждения отеля.</p><div className="result-actions"><a className="button button-primary" href={whatsappHref} target="_blank" rel="noreferrer">Открыть WhatsApp <span aria-hidden="true">↗</span></a><a className="button button-secondary" href={mailHref}>Открыть e-mail <span aria-hidden="true">↗</span></a><button className="button button-quiet" type="button" onClick={copyMessage}>{copied ? "Скопировано" : "Скопировать запрос"}</button><a className="button button-secondary" href={hotelData.contacts.phoneHref}>Позвонить в отель</a></div><details className="message-preview"><summary>Посмотреть текст запроса</summary><pre>{message}</pre></details></div>}</form><aside className="booking-summary" aria-label="Итог поездки"><div className="summary-head"><p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Ваша поездка</p><span className="summary-step">01—02</span></div><h3>Проверяем по вашим параметрам</h3><div className="summary-block"><span>Период</span><strong>{booking.checkIn && booking.checkOut ? `${formatDate(booking.checkIn, false)} — ${formatDate(booking.checkOut, false)}` : "Выберите даты"}</strong><small>{nights ? `${nights} ${pluralize(nights, "ночь", "ночи", "ночей")}` : "Количество ночей появится здесь"}</small></div><div className="summary-block"><span>Гости</span><strong>{booking.adults} {pluralize(booking.adults, "взрослый", "взрослых", "взрослых")}{booking.children ? ` · ${booking.children} ${pluralize(booking.children, "ребёнок", "ребёнка", "детей")}` : ""}</strong><small>{booking.children ? `Возраст: ${booking.childAges.map((age) => age || "—").join(", ")} лет` : "Без детей"}</small></div><div className="summary-block"><span>Номер</span><strong>{selectedRoom?.name ?? "Категория не выбрана"}</strong><small>{selectedRoom ? `${selectedRoom.view} · ${selectedRoom.capacity}` : "Выберите категорию в форме"}</small></div><div className="summary-block"><span>Питание</span><strong>{selectedMeal?.name ?? "Формат не выбран"}</strong><small>{selectedMeal?.hours ?? "Выберите вариант в форме"}</small></div><div className="summary-warning"><span aria-hidden="true">↗</span><p>Точную стоимость, доступность и срок предложения сообщит администратор после проверки.</p></div><a className="summary-phone" href={hotelData.contacts.phoneHref}>Можно сразу позвонить <strong>{hotelData.contacts.phone}</strong></a></aside></div></div>
      </section>

      <section className="section faq-section" id="faq"><div className="page-width faq-layout"><div className="section-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Перед поездкой</p><h2>Ответы на основные вопросы</h2><p>Если вопрос зависит от дат или состава гостей, передайте его администратору вместе с запросом.</p><a className="text-link" href={hotelData.contacts.whatsapp} target="_blank" rel="noreferrer">Задать вопрос в WhatsApp <span aria-hidden="true">↗</span></a></div><div className="faq-list">{hotelData.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>
      <section className="final-cta" id="contact"><div className="page-width final-cta-inner"><div><p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Запрос администратору</p><h2>Проверьте стоимость поездки по своим датам</h2><p>Оставьте параметры проживания и выберите удобный канал ответа.</p></div><button className="button button-primary" type="button" onClick={scrollToBooking}>Проверить даты и стоимость <span aria-hidden="true">↘</span></button></div></section>
      <footer className="footer"><div className="page-width footer-grid"><div><a className="wordmark wordmark-dark" href="#top"><span>МИРОГЕН</span><small>Лермонтово</small></a><p className="footer-address">{hotelData.address}</p></div><div className="footer-contact"><a href={hotelData.contacts.phoneHref}>{hotelData.contacts.phone}</a><a href={hotelData.contacts.emailHref}>{hotelData.contacts.email}</a><a href={hotelData.contacts.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></div><div className="footer-links"><a href="#how">Как работает</a><a href="#rooms">Номера</a><a href="#booking">Проверить даты</a><a href={hotelData.contacts.consentUrl} target="_blank" rel="noreferrer">Согласие на обработку данных</a></div></div><div className="page-width footer-bottom"><span>Отель «Мироген» · Лермонтово</span><span>Стоимость и наличие подтверждает администратор</span></div></footer>
      <a className="mobile-cta" href="#booking">Проверить даты <span aria-hidden="true">↘</span></a>
    </main>
  );
}
