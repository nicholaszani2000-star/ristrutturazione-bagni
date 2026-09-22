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
            <strong>Dati che ci invii tu</strong> con il modulo di richiesta preventivo:
            nome e cognome, telefono, e — se li compili — email, comune, tipo di
            intervento e il messaggio che scrivi.
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
          Non usiamo i tuoi dati per inviarti pubblicità e non li cediamo né li
          vendiamo a terzi per finalità di marketing.
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
        <h2>Conferimento dei dati</h2>
        <p>
          Nome e telefono sono necessari per ricontattarti: senza, non possiamo
          darti una risposta. Gli altri campi sono facoltativi e servono solo a
          prepararci meglio al sopralluogo.
        </p>
      </div>
    </PaginaLegale>
  );
}
