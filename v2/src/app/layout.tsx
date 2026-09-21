import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import { SITE } from "@/config/site";
import { migliaia } from "@/lib/links";
import "./globals.css";

/**
 * next/font scarica i font a build-time e li auto-ospita: a runtime non parte
 * nessuna richiesta verso Google. Un round-trip in meno e un problema di
 * privacy in meno.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.brand.url),
  title: `Ristrutturazione bagni chiavi in mano a ${SITE.zone.short} | ${SITE.brand.name}`,
  description: `Bagno completo 3×2 m a ${migliaia(SITE.offer.price)} € tutto compreso: demolizione, impianti certificati, piastrelle e sanitari. Prezzo bloccato in contratto. Sopralluogo gratuito a ${SITE.zone.long}.`,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: SITE.brand.name,
    title: `Bagno chiavi in mano a ${migliaia(SITE.offer.price)} € — ${SITE.brand.name}`,
    description: `Bagno completo 3×2 m tutto compreso, prezzo bloccato in contratto. Sopralluogo gratuito a ${SITE.zone.long}.`,
    url: "/",
  },
  // Il numero di telefono non va trasformato in link automatico da iOS:
  // i link tel: li gestiamo noi, con il tracciamento attaccato.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1B84DD",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-0 focus:z-[200] focus:rounded-b-lg focus:bg-navy focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Vai al contenuto
        </a>
        {children}
      </body>
    </html>
  );
}
