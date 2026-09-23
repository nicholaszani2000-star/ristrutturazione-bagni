import type { Config, Context } from "@netlify/functions";
import { SITE } from "../../src/config/site";

/**
 * Conversions API di Meta: lo stesso evento del Pixel, mandato dal server.
 *
 * Il Pixel nel browser si perde una parte degli eventi: iPhone con la
 * protezione del tracciamento, blocchi della pubblicita', pagine chiuse prima
 * che la richiesta parta. Questa funzione riceve dal sito una copia di ogni
 * evento e la consegna a Meta da server a server. Meta tiene uno solo dei
 * due: li riconosce dallo stesso nome e dallo stesso event_id.
 *
 * Il consenso lo decide il sito, non questa funzione: il browser la chiama
 * solo se il visitatore ha premuto "Accetta", perche' solo allora il Pixel
 * esiste. Chi rifiuta non arriva mai qui.
 *
 * Il token sta nelle variabili d'ambiente di Netlify (META_CAPI_TOKEN) e non
 * nel codice. Finche' manca, la funzione risponde e non fa nulla: il sito
 * funziona identico, con il solo Pixel.
 */

/** Versione dell'API Graph. Meta tiene attive le versioni per circa due anni. */
const VERSIONE_GRAPH = "v23.0";

/** Solo questi: la funzione e' pubblica, e non deve diventare un modo per
 *  mandare al nostro Pixel eventi inventati. */
const EVENTI_AMMESSI = ["PageView", "ViewContent", "Contact", "Lead"];
const PARAMETRI_AMMESSI = ["currency", "value", "content_name", "content_category", "canale", "posizione"];
const HOST_AMMESSI = ["easybagno.it", "www.easybagno.it"];

function leggiCookie(intestazione: string | null, nome: string) {
  if (!intestazione) return undefined;
  for (const pezzo of intestazione.split(";")) {
    const [k, ...v] = pezzo.trim().split("=");
    if (k === nome) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

function hostDi(indirizzo: string | null) {
  if (!indirizzo) return "";
  try {
    return new URL(indirizzo).hostname;
  } catch {
    return "";
  }
}

const metaEvento = async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });

  const token = Netlify.env.get("META_CAPI_TOKEN");
  if (!token) return new Response(null, { status: 204 });

  // Il browser manda sempre l'intestazione Origin su una POST: se non e' il
  // nostro dominio, la richiesta non viene dal sito.
  if (!HOST_AMMESSI.includes(hostDi(req.headers.get("origin")))) {
    return new Response(null, { status: 403 });
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const evento = String(corpo.evento ?? "");
  const id = String(corpo.id ?? "");
  const url = String(corpo.url ?? "");
  const em = typeof corpo.em === "string" ? corpo.em : undefined;

  if (!EVENTI_AMMESSI.includes(evento)) return new Response(null, { status: 400 });
  if (!id || id.length > 100) return new Response(null, { status: 400 });
  if (!HOST_AMMESSI.includes(hostDi(url))) return new Response(null, { status: 400 });
  // L'email arriva gia' cifrata dal browser. Qualunque altra cosa si scarta:
  // un indirizzo in chiaro non deve partire nemmeno per sbaglio.
  if (em !== undefined && !/^[a-f0-9]{64}$/.test(em)) return new Response(null, { status: 400 });

  const custom_data: Record<string, unknown> = {};
  const parametri = corpo.parametri;
  if (parametri && typeof parametri === "object") {
    for (const [k, v] of Object.entries(parametri)) {
      if (PARAMETRI_AMMESSI.includes(k) && (typeof v === "string" || typeof v === "number")) {
        custom_data[k] = v;
      }
    }
  }

  const cookie = req.headers.get("cookie");
  const fbp = leggiCookie(cookie, "_fbp");
  // _fbc lo scrive il Pixel quando si arriva da un annuncio. Se manca ma
  // l'indirizzo ha ancora il fbclid, lo si ricostruisce nel formato di Meta.
  let fbc = leggiCookie(cookie, "_fbc");
  if (!fbc) {
    const fbclid = new URL(url).searchParams.get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  const user_data: Record<string, unknown> = {
    client_ip_address: context.ip,
    client_user_agent: req.headers.get("user-agent") ?? undefined,
  };
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;
  if (em) user_data.em = [em];

  const codiceTest = Netlify.env.get("META_TEST_EVENT_CODE");

  const risposta = await fetch(
    `https://graph.facebook.com/${VERSIONE_GRAPH}/${SITE.integrations.metaPixelId}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Il token nel corpo e non nell'indirizzo: gli indirizzi finiscono nei
      // log, i corpi delle richieste no.
      body: JSON.stringify({
        data: [
          {
            event_name: evento,
            event_time: Math.floor(Date.now() / 1000),
            event_id: id,
            event_source_url: url,
            action_source: "website",
            user_data,
            ...(Object.keys(custom_data).length ? { custom_data } : {}),
          },
        ],
        ...(codiceTest ? { test_event_code: codiceTest } : {}),
        access_token: token,
      }),
    },
  );

  if (!risposta.ok) {
    // Nei log di Netlify, per capire cosa non va. Mai il token: non e' qui.
    console.error("Conversions API", risposta.status, (await risposta.text()).slice(0, 500));
    return new Response(null, { status: 502 });
  }
  return new Response(null, { status: 204 });
};

export default metaEvento;

export const config: Config = {
  path: "/api/meta-evento",
};
