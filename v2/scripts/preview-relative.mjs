/**
 * Rende la cartella esportata apribile con un doppio clic, senza server.
 *
 * Tre ostacoli, tutti dovuti al protocollo file:, e tutti risolti qui invece
 * che nel sorgente dell'app — che deve restare quello giusto per il deploy.
 *
 * 1. Percorsi assoluti. assetPrefix sistema JS e CSS, ma non le immagini:
 *    con images.unoptimized next/image scrive il src come glielo passi. Gli
 *    stessi percorsi compaiono anche dentro il payload React incorporato
 *    nell'HTML, dove le virgolette sono precedute da backslash.
 *
 * 2. Font bloccati. Su file: l'origine e' "null" e il browser rifiuta ogni
 *    richiesta di font per CORS: la pagina uscirebbe con i caratteri di
 *    sistema al posto di Poppins e Inter, cioe' senza l'identita' del marchio.
 *    Li incorporiamo nel CSS come data: URI. Pesa qualche centinaio di KB, ma
 *    e' peso che vive solo in questo pacchetto di anteprima.
 *
 * 3. Preload ormai inutili. Una volta incorporati i font, i <link rel=preload>
 *    che li puntano fallirebbero lo stesso, riempiendo la console di errori
 *    che non significano piu' niente.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname, resolve, dirname } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

const raccogli = async (dir, est) => {
  const voci = await readdir(dir, { withFileTypes: true });
  const file = [];
  for (const v of voci) {
    const p = join(dir, v.name);
    if (v.isDirectory()) file.push(...(await raccogli(p, est)));
    else if (extname(v.name) === est) file.push(p);
  }
  return file;
};

// --- 1+2. Font incorporati nel CSS ---------------------------------------
let fontIncorporati = 0;
let bytesFont = 0;
for (const css of await raccogli(OUT, ".css")) {
  const originale = await readFile(css, "utf8");
  const riferimenti = [...originale.matchAll(/url\((\.\.?\/[^)"']+\.woff2)\)/g)];
  if (riferimenti.length === 0) continue;

  let testo = originale;
  for (const [intero, rel] of riferimenti) {
    const percorso = resolve(dirname(css), rel);
    try {
      const dati = await readFile(percorso);
      bytesFont += dati.length;
      fontIncorporati++;
      testo = testo.replaceAll(
        intero,
        `url(data:font/woff2;base64,${dati.toString("base64")})`,
      );
    } catch {
      // Font non trovato: lascio il riferimento com'e' invece di rompere il CSS.
      console.warn(`  font non trovato, lasciato invariato: ${rel}`);
    }
  }
  if (testo !== originale) await writeFile(css, testo);
}

// --- 3. Percorsi assoluti e preload nei file HTML -------------------------
const html = await raccogli(OUT, ".html");
let htmlModificati = 0;

for (const f of html) {
  const prima = await readFile(f, "utf8");
  const dopo = prima
    // La virgoletta puo' essere normale o preceduta da backslash (payload React).
    .replace(/(\\?")\/images\//g, "$1./images/")
    .replace(/(\\?")\/favicon/g, "$1./favicon")
    .replace(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g, "");
  if (dopo !== prima) {
    await writeFile(f, dopo);
    htmlModificati++;
  }
}

console.log(
  `anteprima autosufficiente: ${fontIncorporati} font incorporati ` +
    `(${Math.round(bytesFont / 1024)} KB), ${htmlModificati}/${html.length} HTML sistemati`,
);
