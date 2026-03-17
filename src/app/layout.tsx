import type { Metadata } from "next";
import { Oswald, Lato, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navigation from "./components/nav";
import Footer from "./components/footer";
import { Analytics } from "@vercel/analytics/next";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "300", "700", "900"],
});

const noto_sans_jp = Noto_Sans_JP({
  variable: "--font-noto_sans_jp",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Rugpull News - Scam Prevention",
  description:
    "Get yourself educated on Web3 scams, let's make this wild west safer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${lato.variable} ${noto_sans_jp.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#d6973e] focus:text-white focus:rounded"
        >
          Skip to main content
        </a>
        <Navigation />
        <Analytics />
        <main
          id="main-content"
          className="w-full mx-auto justify-center pt-[var(--nav-height-mobile)] md:pt-[var(--nav-height-tablet)] lg:pt-0"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
