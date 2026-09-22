"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { iscrivi, stato, statoSulServer, imposta } from "@/lib/consenso";
import { stileBottone } from "@/components/Button";

/**
 * Richiesta di consenso ai cookie di misurazione.
 *
 * Compare solo finche' una scelta non e' stata fatta. "Rifiuta" ha lo stesso
 * peso visivo di "Accetta": un rifiuto nascosto o reso scomodo non e' un
 * consenso libero, ed e' esattamente il difetto che viene contestato.
 *
 * Su schermo piccolo si posiziona sopra la barra fissa dei contatti, che sta a
 * 4,75rem dal fondo: sovrapposte, coprirebbe proprio i pulsanti che devono
 * restare raggiungibili.
 */
export function BannerCookie() {
  const consenso = useSyncExternalStore(iscrivi, stato, statoSulServer);
  if (consenso !== "ignoto") return null;

  return (
    <div
      role="dialog"
      aria-label="Consenso ai cookie di misurazione"
      className="fixed inset-x-0 bottom-[4.75rem] z-[120] px-4 pb-4 lg:bottom-0 lg:px-6 lg:pb-6"
    >
      <div className="wrap flex max-w-3xl flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-lift)] sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm leading-relaxed text-muted">
          Usiamo cookie di misurazione per capire quali pagine funzionano. Senza il
          tuo consenso non ne installiamo nessuno, e il sito funziona lo stesso.{" "}
          <Link href="/cookie" className="font-semibold text-blue-700 underline underline-offset-2">
            Dettagli
          </Link>
        </p>
        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            onClick={() => imposta("rifiutato")}
            className={stileBottone("ghost", "md", "flex-1 text-sm sm:flex-none")}
          >
            Rifiuta
          </button>
          <button
            type="button"
            onClick={() => imposta("accettato")}
            className={stileBottone("primary", "md", "flex-1 text-sm sm:flex-none")}
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
