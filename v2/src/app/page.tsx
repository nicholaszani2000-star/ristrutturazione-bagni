import dynamic from "next/dynamic";

/**
 * Il 3D viene caricato solo lato client e in un chunk a parte: non deve mai
 * entrare nel bundle iniziale, altrimenti ritarda la comparsa delle CTA.
 */
const SmokeTest = dynamic(() => import("@/components/three/SmokeTest"));

export default function Home() {
  return (
    <main className="min-h-dvh bg-white p-8">
      <h1 className="font-semibold text-3xl text-[#143A5C]">
        Easy-Bagno v2 — verifica stack
      </h1>
      <p className="mt-2 text-[#5A7183]">
        Next 16 · React 19 · Tailwind 4 · three + R3F + drei · GSAP
      </p>
      <div className="mt-8 h-[420px] rounded-2xl border border-[#E2ECF3] bg-[#F5F9FC]">
        <SmokeTest />
      </div>
    </main>
  );
}
