import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Отель «Мироген» — раннее бронирование в Лермонтово",
  description:
    "Проверьте актуальные условия раннего бронирования в отеле «Мироген»: даты, состав семьи, номер и питание.",
  metadataBase: new URL("https://mirogen-early-booking-landing.pages.dev"),
  openGraph: {
    title: "Раннее бронирование в отеле «Мироген»",
    description: "Даты, номер, питание и заявка администратору — в одном понятном сценарии.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
