import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Informativa privacy — ${SITE.brand.name}`,
  description: "Come tratta i dati personali BIODOMUS SRLS attraverso il sito EasyBagno.it.",
  robots: { index: true, follow: true },
};

export default function Privacy() {
  const L = SITE.legal;
  return (
    <PaginaLegale titolo="Informativa privacy" aggiornamento="settembre 2026">
      <p>
        Questa informativa spiega come {L.company} tratta i dati personali di chi
        usa questo sito, ai sensi del Regolamento UE 2016/679 (GDPR).
      </p>

      <div>
        <h2>Chi tratta i dati</h2>
        <p>
          Titolare del trattamento è {L.company}, {L.address}, {L.zip} {L.city} ({L.province}),
          P.IVA {L.vat}. Puoi scrivere a <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>{" "}
          oppure alla PEC {L.pec}.
        </p>
      </div>

      <div>
        <h2>Quali dati raccogliamo</h2>
        <ul>
          <li>
            <strong>Dati che ci invii tu</strong> quando ci scrivi un&apos;email, ci
            chiami o ci mandi un messaggio su WhatsApp: il tuo indirizzo o il tuo
            numero, e quello che decidi di raccontarci del lavoro. Sul sito non
            c&apos;è un modulo che ti chiede i dati: sei tu a scegliere cosa
            scrivere.
          </li>
          <li>
            <strong>Il solo indirizzo email</strong>, se lo lasci nel riquadro
            dedicato allo sconto del {SITE.promo.percentuale}%.
          </li>
          <li>
            <strong>Dati tecnici</strong> raccolti dal nostro fornitore di hosting per
            far funzionare il sito e difenderlo dagli abusi (indirizzo IP, tipo di
            browser, data e ora della visita).
          </li>
        </ul>
        <p>
          Non chiediamo e non vogliamo dati particolari (salute, convinzioni,
          appartenenze). Ti preghiamo di non scriverne nel campo messaggio.
        </p>
      </div>

      <div>
        <h2>Perché li trattiamo</h2>
        <ul>
          <li>
            <strong>Per risponderti.</strong> Ricontattarti, fissare il sopralluogo e
            prepararti il preventivo. Base giuridica: l&apos;esecuzione di misure
            precontrattuali che richiedi tu (art. 6.1.b GDPR).
          </li>
          <li>
            <strong>Per obblighi di legge</strong>, se il rapporto prosegue: fatturazione
            e conservazione contabile (art. 6.1.c GDPR).
          </li>
          <li>
            <strong>Per la sicurezza del sito</strong>, sulla base del nostro legittimo
            interesse a tenerlo funzionante (art. 6.1.f GDPR).
          </li>
        </ul>
        <p>
          I dati che ci lasci con il modulo di preventivo non li usiamo per
          inviarti pubblicità: per quella serve il consenso separato che trovi nel
          riquadro dello sconto, spiegato più avanti. In nessun caso vendiamo i
          tuoi dati.
        </p>
      </div>

      <div>
        <h2>Chi li riceve</h2>
        <p>
          I dati sono accessibili a chi lavora con noi per darti una risposta, e ai
          fornitori che ci erogano servizi tecnici — l&apos;hosting del sito e la
          raccolta degli invii del modulo — nominati responsabili del trattamento.
          Qualora un fornitore tratti dati fuori dallo Spazio Economico Europeo, il
          trasferimento avviene sulla base delle clausole contrattuali tipo
          approvate dalla Commissione europea.
        </p>
        <p>
          I fornitori sono: <strong>Netlify</strong> (hosting del sito e raccolta
          degli invii del modulo) e <strong>Supabase</strong> (la base di dati in
          cui finiscono le richieste di preventivo e gli indirizzi iscritti allo
          sconto, su server nell&apos;Unione europea).
        </p>
      </div>

      <div>
        <h2>Per quanto tempo</h2>
        <p>
          Le richieste che non diventano un lavoro sono conservate fino a 24 mesi,
          per poter ricostruire i contatti avuti. Se il rapporto prosegue, i dati
          seguono i termini di legge previsti per la documentazione contrattuale e
          fiscale (10 anni).
        </p>
      </div>

      <div>
        <h2>I tuoi diritti</h2>
        <p>
          Puoi chiedere in ogni momento di accedere ai tuoi dati, correggerli,
          cancellarli, limitarne il trattamento, opporti, o riceverli in formato
          leggibile da una macchina (artt. 15-22 GDPR). Scrivi a{" "}
          <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>: ti
          rispondiamo entro un mese. Se ritieni che il trattamento violi la
          normativa puoi rivolgerti al Garante per la protezione dei dati personali
          (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>).
        </p>
      </div>

      <div>
        <h2>Iscrizione alla lista per lo sconto</h2>
        <p>
          Se lasci il tuo indirizzo email nel riquadro dedicato allo sconto del{" "}
          {SITE.promo.percentuale}%, lo trattiamo per una finalità distinta da quella della
          richiesta di preventivo: inviarti l&apos;offerta e nostre comunicazioni commerciali. La
          base giuridica è il tuo consenso (art. 6.1.a GDPR), che raccogliamo con una spunta
          separata e non precompilata, e che puoi revocare in qualsiasi momento senza dover
          spiegare il motivo — scrivendo a{" "}
          <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a> o usando il link di
          disiscrizione presente in ogni messaggio. Conserviamo l&apos;indirizzo finché non
          revochi il consenso. La revoca non toglie validità a quanto inviato prima, e non fa
          decadere uno sconto già applicato a un preventivo.
        </p>
        <p>
          Quell&apos;indirizzo viene conservato nella nostra base di dati e, se hai
          accettato i cookie di misurazione, trasmesso a{" "}
          <strong>Meta Platforms Ireland Limited</strong> in forma cifrata con
          SHA-256 — mai in chiaro — perché possa riconoscerti tra il pubblico delle
          nostre campagne su Facebook e Instagram e mostrarti le promozioni che ti
          riguardano. Per quel trattamento siamo contitolari con Meta. Se rifiuti i
          cookie di misurazione, l&apos;indirizzo resta solo da noi. I dettagli sono
          nella <a href="/cookie/">cookie policy</a>.
        </p>
        <p>
          Sempre e solo con il consenso ai cookie di misurazione, Meta riceve
          anche dal nostro server, tramite la Conversions API, gli eventi della
          tua visita — pagina vista, offerta vista, clic su un contatto,
          iscrizione — con indirizzo IP e tipo di browser. La funzione che li
          invia gira su Netlify; i dati non vengono conservati da noi.
        </p>
      </div>

      <div>
        <h2>Conferimento dei dati</h2>
        <p>
          Non c&apos;è nessun dato obbligatorio per visitare il sito. Per riceverne
          una risposta ci serve un recapito — quello da cui ci scrivi è
          sufficiente. Per l&apos;iscrizione allo sconto serve l&apos;indirizzo email
          e la spunta del consenso: senza, non possiamo mandarti l&apos;offerta.
        </p>
      </div>
    </PaginaLegale>
  );
}
