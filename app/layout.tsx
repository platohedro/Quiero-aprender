export const metadata = { title: "Yo Quiero Aprender", description: "Prototipo interactivo para niñas y niños" };
import "./../styles/globals.css";
import React from "react";
import { Oswald, Roboto_Condensed } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-condensed",
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${robotoCondensed.variable} ${oswald.variable} font-sans`}>{children}</body>
    </html>
  );
}
