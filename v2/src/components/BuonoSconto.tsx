"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/config/site";
import type { Buono } from "@/lib/supabase";
import { Icon } from "@/components/Icon";
import { stileBottone } from "@/components/Button";

/**
 * Il buono sconto da mostrare al sopralluogo.
 *
 * Un codice unico (lo genera il database) e un QR che porta alla pagina di
 * verifica: chi lo inquadra vede subito se il buono e' valido, scaduto o gia'
 * usato. Il cliente fa uno screenshot, oppure lo salva come immagine con il
 * pulsante.
 *
 * La libreria del QR si scarica solo qui, a iscrizione avvenuta: chi non si
 * iscrive non la paga.
 */

export const indirizzoVerifica = (codice: string) =>
  `${SITE.brand.url}/sconto/?c=${encodeURIComponent(codice)}`;

/** "2026-11-29" -> "29/11/2026", a mano come i prezzi (vedi lib/links). */
export const dataItaliana = (iso: string) => {
  const [a, m, g] = iso.slice(0, 10).split("-");
  return `${g}/${m}/${a}`;
};

const COLORI = { dark: "#143a5cff", light: "#ffffffff" };

export function BuonoSconto({ buono }: { buono: Buono }) {
  const [svg, setSvg] = useState("");
  const scadenza = dataItaliana(buono.validoFino);

  useEffect(() => {
    let vivo = true;
    import("qrcode")
      .then(({ default: QR }) =>
        QR.toString(indirizzoVerifica(buono.codice), {
          type: "svg",
          errorCorrectionLevel: "M",
          margin: 1,
          color: COLORI,
        }),
      )
      .then((s) => {
        if (vivo) setSvg(s);
      })
      .catch(() => {
        /* senza QR resta il codice scritto, che basta */
      });
    return () => {
      vivo = false;
    };
  }, [buono.codice]);

  /**
   * Un'immagine pulita del buono, 1080x1350, da tenere nel rullino.
   * Disegnata su canvas con gli stessi font della pagina.
   */
  async function salva() {
    const { default: QR } = await import("qrcode");
    const L = 1080;
    const H = 1350;
    const c = document.createElement("canvas");
    c.width = L;
    c.height = H;
    const g = c.getContext("2d");
    if (!g) return;

    const stile = getComputedStyle(document.documentElement);
    const titolo = stile.getPropertyValue("--font-poppins").trim() || "sans-serif";
    const testo = stile.getPropertyValue("--font-inter").trim() || "sans-serif";

    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, L, H);
    const fascia = g.createLinearGradient(0, 0, L, 300);
    fascia.addColorStop(0, "#143a5c");
    fascia.addColorStop(1, "#1663b0");
    g.fillStyle = fascia;
    g.fillRect(0, 0, L, 300);

    g.fillStyle = "#ffffff";
    g.textAlign = "center";
    g.font = `700 52px ${titolo}`;
    g.fillText(SITE.brand.name, L / 2, 110);
    g.font = `600 84px ${titolo}`;
    g.fillText(`Buono sconto ${SITE.promo.percentuale}%`, L / 2, 225);

    const qr = new Image();
    qr.src = await QR.toDataURL(indirizzoVerifica(buono.codice), {
      width: 560,
      margin: 1,
      errorCorrectionLevel: "M",
      color: COLORI,
    });
    await qr.decode();
    g.drawImage(qr, (L - 560) / 2, 360, 560, 560);

    g.fillStyle = "#143a5c";
    g.font = `700 76px ${titolo}`;
    g.fillText(buono.codice, L / 2, 1030);
    g.fillStyle = "#12283a";
    g.font = `400 40px ${testo}`;
    g.fillText(`Valido fino al ${scadenza}`, L / 2, 1100);
    g.fillStyle = "#55707f";
    g.font = `400 32px ${testo}`;
    g.fillText("Mostralo al sopralluogo: lo applichiamo al preventivo", L / 2, 1180);
    g.fillText("del bagno completo firmato dopo il sopralluogo.", L / 2, 1225);
    g.fillStyle = "#1663b0";
    g.font = `600 34px ${titolo}`;
    g.fillText(SITE.brand.domain, L / 2, 1300);

    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `buono-easybagno-${buono.codice}.png`;
    a.click();
  }

  return (
    <div className="@container rounded-2xl border-2 border-dashed border-blue-700/35 bg-white p-5 text-left text-navy shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-blue-700">
          Il tuo buono sconto
        </p>
        <p className="font-display text-2xl font-bold leading-none text-blue-700">
          −{SITE.promo.percentuale}%
        </p>
      </div>

      {/* Sul telefono il QR sta sopra e grande, il codice sotto su una riga:
          lo screenshot deve poterlo leggere anche un'altra fotocamera. */}
      <div className="mt-4 flex flex-col items-center gap-4 text-center @sm:flex-row @sm:gap-5 @sm:text-left">
        <div
          role="img"
          aria-label={`Codice QR del buono ${buono.codice}`}
          className="grid size-44 shrink-0 place-items-center rounded-xl border border-line bg-white p-1 @sm:size-36 [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Codice</p>
          <p className="tabular whitespace-nowrap font-display text-2xl font-bold leading-tight tracking-wide">
            {buono.codice}
          </p>
          <p className="mt-2 text-sm leading-snug text-ink">
            Valido fino al <strong className="font-semibold">{scadenza}</strong>
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        <strong className="font-semibold text-navy">Fai uno screenshot</strong> e mostralo al
        sopralluogo: lo applichiamo al preventivo del bagno completo firmato dopo il sopralluogo.
      </p>

      <button type="button" onClick={salva} className={stileBottone("secondary", "md", "mt-4 w-full text-sm sm:w-auto")}>
        <Icon name="receipt" className="size-4" />
        Salva il buono come immagine
      </button>
    </div>
  );
}
