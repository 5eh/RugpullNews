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
  title: "Rugpull News",
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
        <Navigation />
        <Analytics />
        <div className="w-full mx-auto justify-center">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
