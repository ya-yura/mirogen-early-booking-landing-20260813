import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Отель «Мироген» — раннее бронирование в Лермонтово",
  description:
    "Проверьте актуальные условия раннего бронирования в отеле «Мироген»: даты, состав семьи, номер и питание.",
  metadataBase: new URL("https://ya-yura.github.io/mirogen-early-booking-landing-20260813/"),
  alternates: {
    canonical: "https://ya-yura.github.io/mirogen-early-booking-landing-20260813/",
  },
  openGraph: {
    title: "Раннее бронирование в отеле «Мироген»",
    description: "Даты, номер, питание и заявка администратору — в одном понятном сценарии.",
    type: "website",
    locale: "ru_RU",
    url: "https://ya-yura.github.io/mirogen-early-booking-landing-20260813/",
    images: [
      {
        url: "https://ya-yura.github.io/mirogen-early-booking-landing-20260813/images/official/gallery-1.webp",
        width: 999,
        height: 667,
        alt: "Отель «Мироген» в Лермонтово",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Раннее бронирование в отеле «Мироген»",
    description: "Проверьте даты, номер и питание — администратор подтвердит условия по вашему запросу.",
    images: ["https://ya-yura.github.io/mirogen-early-booking-landing-20260813/images/official/gallery-1.webp"],
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
