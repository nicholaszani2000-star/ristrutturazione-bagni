import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Caveat } from "next/font/google";
import { SITE } from "@/config/site";
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
  // Niente precaricamento: sono 51 KB, il file piu' pesante fra i font, per
  // una frase decorativa che su telefono sta sotto la piega. Senza preload
  // arriva quando serve e non ruba banda alla prima schermata.
  preload: false,
});

/**
 * Solo cio' che vale per tutte le pagine. Titolo, descrizione, canonical e
 * Open Graph li dichiara ogni pagina con metadatiPagina() (lib/seo.ts): messi
 * qui, venivano ereditati da privacy, cookie e 404 con i valori della home.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.brand.url),
  title: { default: SITE.brand.short, template: `%s | ${SITE.brand.short}` },
  applicationName: SITE.brand.short,
  // Search Console legge questo tag per confermare che il sito e' nostro:
  // se lo si toglie, la proprieta' torna "non verificata".
  verification: { google: SITE.integrations.googleSiteVerification },
  // Il numero di telefono non va trasformato in link automatico da iOS:
  // i link tel: li gestiamo noi, con il tracciamento attaccato.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1B84DD",
  width: "device-width",
  initialScale: 1,
  // Senza "cover" iOS non comunica i margini di sicurezza: env(safe-area-*)
  // vale sempre 0 e la barra fissa in basso finisce sotto la linea del gesto
  // Home. Con "cover" i margini arrivano, e i contenitori li rispettano.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${poppins.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
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
