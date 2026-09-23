import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Offer } from "@/components/sections/Offer";
import { Detrazione } from "@/components/sections/Detrazione";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Servizi } from "@/components/sections/Servizi";
import { Progetto } from "@/components/sections/Progetto";
import { Processo } from "@/components/sections/Processo";
import { Garanzie } from "@/components/sections/Garanzie";
import { Credenziali } from "@/components/sections/Credenziali";
import { Faq } from "@/components/sections/Faq";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { Preventivo } from "@/components/sections/Preventivo";
import { Contatta } from "@/components/sections/Contatta";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/StickyCta";

/**
 * L'ordine e' quello del pattern "Trust & Authority + Conversion":
 * hero con la promessa, prova subito dopo, soluzione, percorso verso l'azione.
 *
 * Due scelte che non sono scontate:
 *
 * - La detrazione sta subito dopo il prezzo. E' li' che 9.490 € smette di
 *   essere la cifra che il visitatore si porta via.
 * - I servizi stanno dopo il prima/dopo. Chi non ha un bagno 3×2 deve prima
 *   vedere come lavoriamo, poi scoprire che facciamo anche il suo caso: al
 *   contrario, l'elenco dei servizi sembra un catalogo e la prova si perde.
 *
 * I fondali si alternano bianco / azzurro chiarissimo, e nei punti di stacco
 * piu' forte il passaggio e' un'onda invece di una linea.
 */
export default function Home() {
  return (
    <>
      <Header />
      {/* pb: riserva lo spazio della barra fissa mobile */}
      <main id="contenuto" className="pb-[4.75rem] lg:pb-0">
        <Hero />
        <TrustBar />
        <Offer />
        <Detrazione />
        <BeforeAfter />
        <Servizi />
        <Progetto />
        <Processo />
        <Garanzie />
        <Credenziali />
        <Faq />
        <CtaFinale />
        <Preventivo />
        <Contatta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
