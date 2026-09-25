// QR code di easybagno.it senza sfondo, in vettoriale, con la goccia al centro.
// Uso: node genera-qr-trasparente.mjs <cartella di uscita>
import QRCode from 'qrcode';
import fs from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const OUT = process.argv[2];
const URL_SITO = 'https://easybagno.it';

// Correzione H: il codice resta leggibile anche con fino al 30% coperto.
const qr = QRCode.create(URL_SITO, { errorCorrectionLevel: 'H' });
const n = qr.modules.size;                                   // 29 moduli per lato

const inOcchio = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
// Foro per la goccia: 7x7 moduli senza i quattro angoli (27 moduli, il 3% del codice).
const c0 = Math.floor(n / 2) - 3, c1 = c0 + 6;
const nelForo = (r, c) => r >= c0 && r <= c1 && c >= c0 && c <= c1 && !((r === c0 || r === c1) && (c === c0 || c === c1));
const pieno = (r, c) => r >= 0 && c >= 0 && r < n && c < n && qr.modules.get(r, c) && !inOcchio(r, c) && !nelForo(r, c);

// Moduli uniti fra loro, con gli spigoli arrotondati solo verso l'esterno:
// niente fessure fra un quadratino e l'altro, che confondono i lettori.
const R = 0.42;
const modulo = (x, y, tl, tr, br, bl) =>
  `M${x + tl} ${y}H${x + 1 - tr}${tr ? `a${tr} ${tr} 0 0 1 ${tr} ${tr}` : ''}V${y + 1 - br}${br ? `a${br} ${br} 0 0 1 -${br} ${br}` : ''}` +
  `H${x + bl}${bl ? `a${bl} ${bl} 0 0 1 -${bl} -${bl}` : ''}V${y + tl}${tl ? `a${tl} ${tl} 0 0 1 ${tl} -${tl}` : ''}Z`;
let dati = '';
for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
  if (!pieno(r, c)) continue;
  const su = pieno(r - 1, c), giu = pieno(r + 1, c), sx = pieno(r, c - 1), dx = pieno(r, c + 1);
  dati += modulo(c, r, !su && !sx ? R : 0, !su && !dx ? R : 0, !giu && !dx ? R : 0, !giu && !sx ? R : 0);
}
const rr = (x, y, w, h, r) => `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
const angoli = [[0, 0], [n - 7, 0], [0, n - 7]];
const anelli = angoli.map(([x, y]) => rr(x, y, 7, 7, 1.5) + rr(x + 1, y + 1, 5, 5, 0.9)).join('');
const pupille = angoli.map(([x, y]) => rr(x + 2, y + 2, 3, 3, 0.65)).join('');

const GOCCIA = 'M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z M32 18.5C32 18.5 42 31 42 39.7A10 10 0 1 1 22 39.7C22 31 32 18.5 32 18.5Z';
const g = 6.6, gx = (n - g) / 2, gy = n / 2 - g * 0.496;           // goccia centrata nel foro
const posaGoccia = `translate(${gx} ${gy}) scale(${g / 64})`;

function crea({ moduli, occhi, pupilla, goccia }) {
  const colorata = goccia === 'colori';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" width="${n * 20}" height="${n * 20}">
<title>QR code easybagno.it</title>${colorata ? `
<defs>
  <linearGradient id="goccia" x1="14" y1="8" x2="50" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#56B4EE"/><stop offset=".5" stop-color="#1B84DD"/><stop offset="1" stop-color="#1663B0"/></linearGradient>
  <linearGradient id="nastro" x1="20" y1="14" x2="44" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8ACFF7"/><stop offset="1" stop-color="#2B95E8"/></linearGradient>
  <clipPath id="dentro"><path d="M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z"/></clipPath>
</defs>` : ''}
<path fill="${moduli}" d="${dati}"/>
<path fill="${occhi}" fill-rule="evenodd" d="${anelli}"/>
<path fill="${pupilla}" d="${pupille}"/>
<g transform="${posaGoccia}">${colorata
    ? `<path fill-rule="evenodd" fill="url(#goccia)" d="${GOCCIA}"/><g clip-path="url(#dentro)"><path d="M6 44 L40 2 L52 10 L18 54 Z" fill="url(#nastro)" opacity=".55"/></g>`
    : `<path fill-rule="evenodd" fill="${goccia}" d="${GOCCIA}"/>`}</g>
</svg>
`;
}

const varianti = {
  // sfondi chiari: blu scuro, occhi e goccia col blu del marchio
  'qr-easybagno-trasparente': { moduli: '#143a5c', occhi: '#143a5c', pupilla: '#1663b0', goccia: 'colori' },
  // sfondi scuri (blu, nero, furgone): tutto bianco
  'qr-easybagno-trasparente-bianco': { moduli: '#ffffff', occhi: '#ffffff', pupilla: '#ffffff', goccia: '#ffffff' },
  // un colore solo, per adesivi prespaziati, timbri, incisioni
  'qr-easybagno-trasparente-monocolore': { moduli: '#143a5c', occhi: '#143a5c', pupilla: '#143a5c', goccia: '#143a5c' },
};

const LATO_MM = 30;
const browser = await chromium.launch();
const pagina = await browser.newPage();
for (const [nome, colori] of Object.entries(varianti)) {
  const svg = crea(colori);
  fs.writeFileSync(`${OUT}/${nome}.svg`, svg);
  await pagina.setContent(`<!doctype html><style>@page{size:${LATO_MM}mm ${LATO_MM}mm;margin:0}html,body{margin:0;background:transparent}svg{display:block;width:${LATO_MM}mm;height:${LATO_MM}mm}</style>${svg}`);
  await pagina.pdf({ path: `${OUT}/${nome}.pdf`, width: `${LATO_MM}mm`, height: `${LATO_MM}mm`, printBackground: false });
}
// PNG trasparente grande, per chi usa Canva o simili
await pagina.setViewportSize({ width: 3000, height: 3000 });
await pagina.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:3000px;height:3000px}</style>${crea(varianti['qr-easybagno-trasparente'])}`);
await pagina.screenshot({ path: `${OUT}/qr-easybagno-trasparente.png`, omitBackground: true });
await browser.close();
console.log(`QR ${n}x${n} moduli, correzione H, foro per la goccia di 27 moduli`);
