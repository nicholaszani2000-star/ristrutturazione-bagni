"use client";

import { useSyncExternalStore } from "react";
import { iscrivi, stato, statoSulServer, azzera } from "@/lib/consenso";
import { stileBottone } from "@/components/Button";

/**
 * Permette di tornare sui propri passi.
 *
 * Un consenso che non si puo' ritirare non e' un consenso: la normativa chiede
 * che revocarlo sia facile quanto darlo. Qui si azzera la scelta e ricompare la
 * fascia, cosi' si puo' rispondere di nuovo.
 *
 * La pagina viene ricaricata perche' Google Analytics, una volta partito, non
 * si puo' smontare da JavaScript: l'unico modo onesto di fermarlo e' ripartire
 * da una pagina in cui non e' mai stato caricato.
 */
export function RevocaConsenso() {
  const consenso = useSyncExternalStore(iscrivi, stato, statoSulServer);
  if (consenso === "sul-server") return null;

  const scelto =
    consenso === "accettato" ? "hai accettato" : consenso === "rifiutato" ? "hai rifiutato" : "non hai ancora scelto";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="mb-3 text-sm text-ink">
        Al momento <strong>{scelto}</strong> i cookie di misurazione.
      </p>
      <button
        type="button"
        onClick={() => {
          azzera();
          window.location.reload();
        }}
        className={stileBottone("secondary", "md", "text-sm")}
      >
        Cambia la mia scelta
      </button>
    </div>
  );
}
