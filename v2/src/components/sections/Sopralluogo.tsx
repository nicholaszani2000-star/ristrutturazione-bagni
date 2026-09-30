"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/config/site";
import { links } from "@/lib/links";
import { traccia } from "@/lib/ga4";
import { tracciaMeta, riconosci, utenteCifrato, type UtenteCifrato } from "@/lib/meta";
import { inviaRichiesta, provenienza, type Buono } from "@/lib/supabase";
import { BuonoSconto } from "@/components/BuonoSconto";
import { Icon } from "@/components/Icon";
import { stileBottone } from "@/components/Button";
import { IntestazioneSezione } from "@/components/IntestazioneSezione";
import { Reveal } from "@/components/Reveal";

/**
 * Richiesta di sopralluogo: la destinazione di ogni invito all'azione.
 *
 * Prima la pagina chiedeva solo un'email per lo sconto. Per un lavoro da
 * migliaia di euro un'email da sola non basta a richiamare nessuno, e Meta
 * imparava a cercare chi lascia volentieri l'email invece di chi vuole rifare
 * il bagno. Qui si chiede quello che serve per telefonare e presentarsi
 * preparati, e nient'altro.
 *
 * Due passi. Il primo sono due tocchi (che lavoro, quando): e' facile
 * cominciare, e chi ha cominciato finisce. Il secondo chiede i recapiti. Tutti
 * e due i passi stanno nell'HTML statico, anche quello nascosto: Netlify
 * riconosce i campi del modulo al momento della pubblicazione, e un campo che
 * non c'e' in quell'HTML non viene salvato.
 *
 * Due destinazioni, come per lo sconto: Supabase (l'archivio con lo stato di
 * ogni richiesta) e Netlify Forms (la notifica per email). Partono insieme e
 * basta che ne arrivi una.
 */

const NOME_MODULO = "sopralluogo";
const TIPI = SITE.form.interventionTypes;
const QUANDO = SITE.form.whenOptions;
const EMAIL_VALIDA = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Stato = "fermo" | "invio" | "ok" | "errore";
type Campo = "lavoro" | "nome" | "telefono" | "comune" | "email" | "privacy";
type Errori = Partial<Record<Campo, string>>;

/** Solo cifre e i segni che si usano scrivendo un numero; 6-11 cifre senza prefisso. */
function telefonoValido(v: string) {
  const t = v.trim();
  if (!/^[0-9 +().\/-]+$/.test(t)) return false;
  const cifre = t.replace(/\D/g, "").replace(/^(00)?39(?=\d{8,})/, "");
  return cifre.length >= 6 && cifre.length <= 11;
}

/** Formattata a mano, come i prezzi: vedi migliaia() in lib/links. */
function dataFra(giorni: number) {
  const d = new Date(Date.now() + giorni * 86_400_000);
  const due = (n: number) => String(n).padStart(2, "0");
  return `${due(d.getDate())}/${due(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/**
 * Riporta in vista la cima della scheda, ma solo se e' finita sopra lo
 * schermo: su telefono, dopo "Avanti", il secondo passo deve partire dal suo
 * titolo e non a meta'.
 */
function portaInVista(el: HTMLElement | null) {
  if (!el || el.getBoundingClientRect().top >= 0) return;
  const ridotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "start", behavior: ridotto ? "auto" : "smooth" });
}

const VANTAGGI = [
  { icona: "survey", testo: "Sopralluogo gratuito e senza impegno: misuriamo e guardiamo scarichi e impianti" },
  { icona: "receipt", testo: `Sconto del ${SITE.promo.percentuale}% ${SITE.promo.suCosa}, valido ${SITE.promo.giorni} giorni` },
  { icona: "clock", testo: `Ti chiamiamo noi per fissare il giorno · ${SITE.contact.hours}` },
  { icona: "lock", testo: "Il numero serve solo per il sopralluogo: niente call center, niente pubblicità" },
] as const;

export function Sopralluogo() {
  const [passo, setPasso] = useState<1 | 2>(1);
  const [lavoro, setLavoro] = useState("");
  const [quando, setQuando] = useState("");
  const [errori, setErrori] = useState<Errori>({});
  const [stato, setStato] = useState<Stato>("fermo");
  const [inviata, setInviata] = useState<{ nome: string; telefono: string; comune: string } | null>(null);
  const [buono, setBuono] = useState<Buono | null>(null);

  const scheda = useRef<HTMLDivElement>(null);
  const nome = useRef<HTMLInputElement>(null);
  const titoloPasso1 = useRef<HTMLHeadingElement>(null);
  const grazie = useRef<HTMLHeadingElement>(null);
  // Il fuoco si sposta solo dopo un gesto: al caricamento della pagina non
  // deve saltare nessuna tastiera.
  const toccato = useRef(false);
  const iniziata = useRef(false);

  useEffect(() => {
    if (!toccato.current) return;
    portaInVista(scheda.current);
    if (passo === 2) nome.current?.focus({ preventScroll: true });
    else titoloPasso1.current?.focus({ preventScroll: true });
  }, [passo]);

  useEffect(() => {
    if (stato !== "ok") return;
    portaInVista(scheda.current);
    grazie.current?.focus({ preventScroll: true });
  }, [stato]);

  function avanti() {
    toccato.current = true;
    if (!lavoro) {
      setErrori({ lavoro: "Scegli il lavoro che ti serve: basta un tocco." });
      document.getElementById("lavoro-0")?.focus();
      return;
    }
    setErrori({});
    if (!iniziata.current) {
      iniziata.current = true;
      traccia("inizio_richiesta", { lavoro, quando: quando || "non indicato" });
    }
    setPasso(2);
  }

  function indietro() {
    toccato.current = true;
    setPasso(1);
  }

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toccato.current = true;
    if (passo === 1) return avanti();
    if (stato === "invio") return;

    const form = e.currentTarget;
    const dati = new FormData(form);
    const v = (k: string) => String(dati.get(k) ?? "").trim();
    const r = {
      nome: v("nome"),
      telefono: v("telefono"),
      comune: v("comune"),
      email: v("email"),
      note: v("note"),
    };

    const e2: Errori = {};
    if (r.nome.length < 2 || !/\p{L}/u.test(r.nome)) e2.nome = "Scrivi nome e cognome.";
    if (!telefonoValido(r.telefono)) e2.telefono = "Controlla il numero: solo cifre, almeno 6.";
    if (r.comune.length < 2) e2.comune = "Scrivi il comune dove si trova il bagno.";
    if (r.email && !EMAIL_VALIDA.test(r.email)) e2.email = "L'email non sembra giusta. Puoi anche lasciarla vuota.";
    if (!dati.get("privacy")) e2.privacy = "Serve la spunta per poterti richiamare.";
    setErrori(e2);

    const primo = (["nome", "telefono", "comune", "email", "privacy"] as const).find((k) => e2[k]);
    if (primo) {
      document.getElementById(`sopralluogo-${primo}`)?.focus();
      return;
    }

    // Un robot compila anche il campo esca: finta conferma, niente invio.
    if (v("lascia-vuoto")) {
      setInviata({ nome: r.nome, telefono: r.telefono, comune: r.comune });
      setStato("ok");
      return;
    }

    setStato("invio");

    // Da dove arriva: nell'email di Netlify e in Supabase, per sapere quale
    // annuncio ha portato la richiesta.
    const p = provenienza();
    const corpo = new URLSearchParams(dati as unknown as Record<string, string>);
    corpo.set("fonte", p.fonte ?? "");
    corpo.set("campagna", p.campagna ?? "");
    corpo.set("annuncio", p.annuncio ?? "");
    corpo.set("pagina", p.pagina ?? "");

    // Prima il database, che restituisce il codice del buono; poi Netlify con
    // il codice dentro, cosi' compare anche nell'email di notifica. Basta che
    // ne arrivi uno: se il database non risponde la richiesta arriva lo
    // stesso via Netlify, manca solo il buono da mostrare.
    let codiceDb: Buono | null = null;
    let dbOk = false;
    try {
      codiceDb = await inviaRichiesta({
        nome: r.nome,
        telefono: r.telefono,
        comune: r.comune,
        tipo_intervento: lavoro,
        quando: quando || undefined,
        email: r.email || undefined,
        messaggio: r.note || undefined,
      });
      dbOk = codiceDb !== null;
    } catch {
      dbOk = false;
    }

    corpo.set("codice", codiceDb?.codice ?? "");
    let netlifyOk = false;
    try {
      const x = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: corpo.toString(),
      });
      netlifyOk = x.ok;
    } catch {
      netlifyOk = false;
    }

    if (!dbOk && !netlifyOk) {
      setStato("errore");
      return;
    }

    setBuono(codiceDb);
    setInviata({ nome: r.nome, telefono: r.telefono, comune: r.comune });
    setStato("ok");

    // generate_lead e' l'evento da segnare come conversione in GA4: e' qui
    // che la pagina acquisisce un contatto da richiamare.
    traccia("generate_lead", {
      lead_source: "modulo-sopralluogo",
      lavoro,
      quando: quando || "non indicato",
      valore_offerta: SITE.offer.price,
    });

    // Meta. "Lead" e' l'evento su cui ottimizza la campagna. I dati per
    // l'abbinamento partono cifrati in SHA-256 e solo se il Pixel e' attivo,
    // cioe' solo con il consenso ai cookie di misurazione. Se la cifratura
    // non riesce si perde l'abbinamento, non la conversione.
    if (!window.fbq) return;
    let utente: UtenteCifrato = {};
    try {
      utente = await utenteCifrato({ email: r.email, telefono: r.telefono, nome: r.nome, comune: r.comune });
      if (Object.keys(utente).length) riconosci(SITE.integrations.metaPixelId, utente);
    } catch {
      /* si prosegue senza abbinamento */
    }
    tracciaMeta("Lead", { content_name: "Richiesta sopralluogo", content_category: lavoro }, utente);
  }

  const campo =
    "w-full rounded-xl border bg-white px-4 py-3 text-base text-ink transition-colors " +
    "placeholder:text-muted/70 focus:border-blue focus:ring-2 focus:ring-blue/25 " +
    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue " +
    "aria-[invalid=true]:border-[#c0392b]";
  const bordo = (k: Campo) => (errori[k] ? "border-[#c0392b]" : "border-line");
  const etichetta = "mb-1.5 block text-sm font-semibold text-navy";
  const errore = (k: Campo) =>
    errori[k] ? (
      <p id={`errore-${k}`} className="mt-1.5 text-sm font-medium text-[#a8321f]">
        {errori[k]}
      </p>
    ) : null;
  const scelta =
    "flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white text-ink " +
    "transition-colors hover:border-sky has-[:checked]:border-blue-700 has-[:checked]:bg-sky-soft " +
    "has-[:checked]:text-navy has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 " +
    "has-[:focus-visible]:outline-blue";

  const primoNome = inviata?.nome.split(/\s+/)[0] ?? "";
  const messaggioFoto = inviata
    ? `Ciao, sono ${inviata.nome} da ${inviata.comune}. Ho appena chiesto il sopralluogo sul sito ` +
      `per questo lavoro: ${lavoro}. Vi mando qualche foto del bagno.`
    : "";

  return (
    <section
      id="sopralluogo"
      className="relative isolate overflow-hidden bg-surface py-[length:var(--spacing-section)]"
    >
      <div aria-hidden className="velo-acqua -z-10" />

      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10">
        {/* --------------------------- introduzione --------------------------- */}
        <Reveal className="lg:col-start-1 lg:row-start-1">
          <IntestazioneSezione
            occhiello="Sopralluogo gratuito"
            titolo="Dicci che bagno hai."
            accento="Ti richiamiamo noi."
            testo="Due passaggi, meno di un minuto. Ti chiamiamo per fissare il giorno: veniamo a misurare e ti lasciamo un preventivo scritto, con il prezzo definitivo."
          />
        </Reveal>

        {/* ------------------------------ modulo ------------------------------ */}
        <div
          ref={scheda}
          className="scroll-mt-24 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          {stato === "ok" && inviata ? (
            <div aria-live="polite">
              <span className="grid size-14 place-items-center rounded-full bg-success-bg text-success">
                <Icon name="check" className="size-7" />
              </span>
              <h3
                ref={grazie}
                tabIndex={-1}
                className="mt-5 font-display text-[1.45rem] font-bold leading-tight text-navy outline-none"
              >
                Richiesta ricevuta{primoNome ? `, ${primoNome}` : ""}.
              </h3>
              <p className="mt-3 leading-relaxed text-muted">
                Ti chiamiamo al{" "}
                <strong className="tabular font-semibold text-navy">{inviata.telefono}</strong> per
                fissare il sopralluogo ({SITE.contact.hours}).
              </p>

              {buono ? (
                <div className="mt-5">
                  <BuonoSconto buono={buono} />
                </div>
              ) : (
                <p className="mt-5 flex items-start gap-3 rounded-xl bg-sky-soft p-4 text-sm leading-relaxed text-navy">
                  <Icon name="receipt" className="mt-0.5 size-5 shrink-0 text-blue-700" />
                  <span>
                    Il tuo sconto del {SITE.promo.percentuale}% è registrato: vale fino al{" "}
                    <strong className="font-semibold">{dataFra(SITE.promo.giorni)}</strong>, sul
                    preventivo firmato dopo il sopralluogo.
                  </span>
                </p>
              )}

              <div className="mt-6 border-t border-line pt-6">
                <p className="font-display font-semibold text-navy">Vuoi accorciare i tempi?</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Mandaci due o tre foto del bagno com&apos;è oggi: al sopralluogo arriviamo già
                  preparati.
                </p>
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(messaggioFoto)}`}
                  target="_blank"
                  rel="noopener"
                  className={stileBottone("whatsapp", "md", "mt-4 w-full sm:w-auto")}
                >
                  <Icon name="whatsapp" className="size-5" />
                  Invia le foto su WhatsApp
                </a>
              </div>

              <p className="mt-6 text-sm text-muted">
                Hai sbagliato un dato? Chiamaci al{" "}
                <a href={links.tel} className="tabular font-semibold text-blue-700 underline underline-offset-2">
                  {SITE.contact.phoneDisplay}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              name={NOME_MODULO}
              method="POST"
              data-netlify="true"
              netlify-honeypot="lascia-vuoto"
              noValidate
              onSubmit={invia}
              aria-busy={stato === "invio"}
            >
              <input type="hidden" name="form-name" value={NOME_MODULO} />
              {/* Riempiti al momento dell'invio. Devono esserci gia' qui:
                  Netlify salva solo i campi che trova in questo HTML. */}
              <input type="hidden" name="fonte" />
              <input type="hidden" name="campagna" />
              <input type="hidden" name="annuncio" />
              <input type="hidden" name="pagina" />
              <input type="hidden" name="codice" />
              <p className="hidden" aria-hidden>
                <label>
                  Non compilare: <input name="lascia-vuoto" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              {/* Avanzamento: due tratti, il primo sempre pieno. */}
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1.5" aria-hidden>
                  <span className="h-1.5 flex-1 rounded-full bg-blue-700" />
                  <span
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      passo === 2 ? "bg-blue-700" : "bg-line"
                    }`}
                  />
                </div>
                <p className="shrink-0 font-display text-[0.8rem] font-semibold text-muted">
                  Passo {passo} di 2
                </p>
              </div>

              {/* ------------------------- passo 1 ------------------------- */}
              <div hidden={passo !== 1}>
                <h3
                  ref={titoloPasso1}
                  tabIndex={-1}
                  className="mt-6 font-display text-[1.3rem] font-bold leading-tight text-navy outline-none"
                >
                  Che lavoro devi fare?
                </h3>

                <fieldset className="mt-4" aria-describedby={errori.lavoro ? "errore-lavoro" : undefined}>
                  <legend className="sr-only">Che lavoro devi fare?</legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {TIPI.map((t, i) => (
                      <label key={t} className={`${scelta} min-h-12 px-4 py-3 text-[0.95rem] font-medium leading-snug`}>
                        <input
                          id={`lavoro-${i}`}
                          type="radio"
                          name="lavoro"
                          value={t}
                          checked={lavoro === t}
                          onChange={() => {
                            setLavoro(t);
                            setErrori((x) => ({ ...x, lavoro: undefined }));
                          }}
                          className="size-5 shrink-0 accent-[#1663b0]"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                  {errore("lavoro")}
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="font-display font-semibold text-navy">
                    Quando vorresti iniziare?{" "}
                    <span className="font-sans text-sm font-normal text-muted">(facoltativo)</span>
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {QUANDO.map((q) => (
                      <label key={q} className={`${scelta} min-h-11 rounded-full px-4 py-2 text-sm font-medium`}>
                        <input
                          type="radio"
                          name="quando"
                          value={q}
                          checked={quando === q}
                          onChange={() => setQuando(q)}
                          className="size-4 shrink-0 accent-[#1663b0]"
                        />
                        {q}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <button type="button" onClick={avanti} className={stileBottone("primary", "lg", "mt-7 w-full")}>
                  Avanti
                  <Icon name="chevron" className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
                <p className="mt-3 text-center text-sm text-muted">
                  Gratis e senza impegno · sconto {SITE.promo.percentuale}% incluso
                </p>
              </div>

              {/* ------------------------- passo 2 ------------------------- */}
              <div hidden={passo !== 2}>
                <div className="mt-6 flex items-start justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-sm">
                  <p className="leading-snug text-navy">
                    <span className="text-muted">Lavoro:</span>{" "}
                    <strong className="font-semibold">{lavoro || "—"}</strong>
                    {quando ? <span className="text-muted"> · {quando}</span> : null}
                  </p>
                  <button
                    type="button"
                    onClick={indietro}
                    className="-my-1 min-h-8 shrink-0 font-semibold text-blue-700 underline underline-offset-2"
                  >
                    Cambia
                  </button>
                </div>

                <h3 className="mt-6 font-display text-[1.3rem] font-bold leading-tight text-navy">
                  Dove ti richiamiamo?
                </h3>

                <div className="mt-4 grid gap-4">
                  <div>
                    <label className={etichetta} htmlFor="sopralluogo-nome">
                      Nome e cognome
                    </label>
                    <input
                      ref={nome}
                      id="sopralluogo-nome"
                      name="nome"
                      autoComplete="name"
                      autoCapitalize="words"
                      maxLength={120}
                      placeholder="Mario Rossi"
                      aria-invalid={errori.nome ? true : undefined}
                      aria-describedby={errori.nome ? "errore-nome" : undefined}
                      className={`${campo} ${bordo("nome")}`}
                    />
                    {errore("nome")}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={etichetta} htmlFor="sopralluogo-telefono">
                        Telefono
                      </label>
                      <input
                        id="sopralluogo-telefono"
                        name="telefono"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={40}
                        placeholder="333 123 4567"
                        aria-invalid={errori.telefono ? true : undefined}
                        aria-describedby={errori.telefono ? "errore-telefono" : undefined}
                        className={`${campo} ${bordo("telefono")} tabular`}
                      />
                      {errore("telefono")}
                    </div>
                    <div>
                      <label className={etichetta} htmlFor="sopralluogo-comune">
                        Comune del bagno
                      </label>
                      <input
                        id="sopralluogo-comune"
                        name="comune"
                        autoComplete="address-level2"
                        autoCapitalize="words"
                        maxLength={120}
                        placeholder="Gallarate"
                        aria-invalid={errori.comune ? true : undefined}
                        aria-describedby={errori.comune ? "errore-comune" : undefined}
                        className={`${campo} ${bordo("comune")}`}
                      />
                      {errore("comune")}
                    </div>
                  </div>

                  <div>
                    <label className={etichetta} htmlFor="sopralluogo-email">
                      Email <span className="font-normal text-muted">(facoltativa, per il preventivo scritto)</span>
                    </label>
                    <input
                      id="sopralluogo-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      maxLength={160}
                      placeholder="mario@esempio.it"
                      aria-invalid={errori.email ? true : undefined}
                      aria-describedby={errori.email ? "errore-email" : undefined}
                      className={`${campo} ${bordo("email")}`}
                    />
                    {errore("email")}
                  </div>

                  <div>
                    <label className={etichetta} htmlFor="sopralluogo-note">
                      Qualcosa da sapere? <span className="font-normal text-muted">(facoltativo)</span>
                    </label>
                    <textarea
                      id="sopralluogo-note"
                      name="note"
                      rows={3}
                      maxLength={1000}
                      placeholder="Misure, piano e ascensore, orari in cui richiamarti…"
                      className={`${campo} border-line resize-y`}
                    />
                  </div>

                  <div>
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                      <input
                        id="sopralluogo-privacy"
                        type="checkbox"
                        name="privacy"
                        aria-invalid={errori.privacy ? true : undefined}
                        aria-describedby={errori.privacy ? "errore-privacy" : undefined}
                        className="mt-0.5 size-6 shrink-0 accent-[#1663b0]"
                      />
                      <span>
                        Voglio essere richiamato per il sopralluogo e ho letto l&apos;
                        <a href="/privacy/" className="font-semibold text-blue-700 underline underline-offset-2">
                          informativa privacy
                        </a>
                        .
                      </span>
                    </label>
                    {errore("privacy")}
                  </div>
                </div>

                {stato === "errore" ? (
                  <div role="alert" className="mt-5 rounded-xl bg-[#fdeeea] px-4 py-3 text-sm leading-relaxed text-[#8a2a1a]">
                    L&apos;invio non è andato a buon fine. Riprova tra un attimo, oppure chiamaci al{" "}
                    <a href={links.tel} className="tabular font-semibold underline underline-offset-2">
                      {SITE.contact.phoneDisplay}
                    </a>{" "}
                    o scrivici su{" "}
                    <a href={links.whatsapp} target="_blank" rel="noopener" className="font-semibold underline underline-offset-2">
                      WhatsApp
                    </a>
                    : lo sconto vale lo stesso.
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={stato === "invio"}
                  className={stileBottone("primary", "lg", "mt-6 w-full")}
                >
                  {stato === "invio" ? "Invio in corso…" : "Richiedi il sopralluogo"}
                </button>
                <p className="mt-3 text-center text-sm text-muted">
                  Nessun costo, nessun impegno. Ti chiamiamo solo per fissare il giorno.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* ---------------------- vantaggi e contatto diretto ---------------------- */}
        <div className="lg:col-start-1 lg:row-start-2">
          <Reveal as="ul" className="grid gap-4">
            {VANTAGGI.map((v) => (
              <li key={v.testo} className="flex items-start gap-3 text-[0.95rem] leading-snug text-ink">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-blue-700 shadow-[var(--shadow-card)]">
                  <Icon name={v.icona} className="size-[18px]" />
                </span>
                <span className="pt-1.5">{v.testo}</span>
              </li>
            ))}
          </Reveal>

          <div className="mt-8 rounded-2xl border border-line bg-white p-5">
            <p className="mb-3 text-sm font-semibold text-navy">Preferisci chiamare tu?</p>
            <div className="flex flex-wrap gap-2.5">
              <a href={links.tel} className={stileBottone("secondary", "md", "text-sm")}>
                <Icon name="phone" className="size-4" />
                <span className="tabular">{SITE.contact.phoneDisplay}</span>
              </a>
              <a href={links.whatsapp} target="_blank" rel="noopener" className={stileBottone("whatsapp", "md", "text-sm")}>
                <Icon name="whatsapp" className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
