import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Progetto3D } from "@/components/sections/Progetto3D";
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
        <Progetto3D />
        <Preventivo />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
