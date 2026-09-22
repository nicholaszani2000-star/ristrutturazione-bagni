import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Preventivo } from "@/components/sections/Preventivo";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/StickyCta";

export default function Home() {
  return (
    <>
      <Header />
      {/* pb: riserva lo spazio della barra fissa mobile */}
      <main id="contenuto" className="pb-[4.75rem] lg:pb-0">
        <Hero />
        <Offer />
        <BeforeAfter />
        {/* Sezione 3D sospesa su richiesta del committente.
            I componenti restano in src/components/three e sections/Progetto3D:
            basta rimettere l'import e la riga qui per riattivarla. Non essendo
            piu' importata, three.js e R3F escono dal pacchetto del browser. */}
        <Preventivo />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
