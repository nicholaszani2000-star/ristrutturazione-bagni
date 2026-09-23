import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Caveat } from "next/font/google";
import { SITE } from "@/config/site";
import { migliaia } from "@/lib/links";
import { Analytics } from "@/components/Analytics";
import { BannerCookie } from "@/components/BannerCookie";
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

/**
 * Una sola firma manoscritta, sulla fotografia dell'hero. Un peso solo e il
 * sottoinsieme latino: sono una ventina di KB per un dettaglio che compare una
 * volta, e serve a rompere la geometria di tutto il resto — senza, la pagina
 * e' corretta ma non ha nessun momento umano.
 */
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-mano",
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
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE.brand.name} — bagno chiavi in mano a ${SITE.zone.short}, ${migliaia(SITE.offer.price)} € tutto compreso`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og.jpg"],
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
    <html lang="it" className={`${poppins.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
        {/* Dati strutturati dell'impresa. Sono gli stessi che stanno nella
            sezione "Chi siamo" e nel footer: dichiarare qui qualcosa che la
            pagina non mostra e' contro le linee guida, oltre che inutile. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HomeAndConstructionBusiness",
              name: SITE.brand.name,
              legalName: SITE.legal.company,
              vatID: SITE.legal.vat,
              url: SITE.brand.url,
              image: `${SITE.brand.url}/images/og.jpg`,
              telephone: SITE.contact.phoneRaw,
              email: SITE.contact.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.legal.address,
                postalCode: SITE.legal.zip,
                addressLocality: SITE.legal.city,
                addressRegion: SITE.legal.province,
                addressCountry: SITE.legal.country,
              },
              areaServed: SITE.zone.long,
              priceRange: "€€",
              makesOffer: {
                "@type": "Offer",
                name: SITE.offer.title,
                price: SITE.offer.price,
                priceCurrency: "EUR",
                description: SITE.offer.subtitle,
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-0 focus:z-[200] focus:rounded-b-lg focus:bg-navy focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Vai al contenuto
        </a>
        {children}
        <Analytics />
        <BannerCookie />
      </body>
    </html>
  );
}
