import QRCode from 'qrcode';
import fs from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const OUT = process.argv[2];
const URL_SITO = 'https://easybagno.it';
const NAVY = '#143a5c';

// Correzione H: il codice resta leggibile anche con fino al 30% coperto.
const qr = QRCode.create(URL_SITO, { errorCorrectionLevel: 'H' });
const n = qr.modules.size, Q = 4, S = n + 2 * Q;            // moduli + zona di rispetto
let d = '';
for (let y = 0; y < n; y++) {                               // un rettangolo per ogni tratto orizzontale pieno
  let x = 0;
  while (x < n) {
    if (qr.modules.get(y, x)) { let l = 1; while (x + l < n && qr.modules.get(y, x + l)) l++; d += `M${x + Q} ${y + Q}h${l}v1h-${l}z`; x += l; } else x++;
  }
}
// Riquadro bianco al centro: 7 moduli su 29 (circa il 6% dell'area, ben sotto il 30%).
const box = 7, bx = (S - box) / 2, g = box * 0.76, gx = (S - g) / 2;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S * 10}" height="${S * 10}" shape-rendering="crispEdges">
<title>QR code easybagno.it</title>
<defs>
  <linearGradient id="goccia" x1="14" y1="8" x2="50" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#56B4EE"/><stop offset=".5" stop-color="#1B84DD"/><stop offset="1" stop-color="#1663B0"/></linearGradient>
  <linearGradient id="nastro" x1="20" y1="14" x2="44" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8ACFF7"/><stop offset="1" stop-color="#2B95E8"/></linearGradient>
  <clipPath id="dentro"><path d="M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z"/></clipPath>
</defs>
<rect width="${S}" height="${S}" fill="#ffffff"/>
<path fill="${NAVY}" d="${d}"/>
<rect x="${bx}" y="${bx}" width="${box}" height="${box}" rx="1.4" fill="#ffffff" shape-rendering="geometricPrecision"/>
<g transform="translate(${gx} ${gx}) scale(${g / 64})" shape-rendering="geometricPrecision">
  <path fill-rule="evenodd" fill="url(#goccia)" d="M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z M32 18.5C32 18.5 42 31 42 39.7A10 10 0 1 1 22 39.7C22 31 32 18.5 32 18.5Z"/>
  <g clip-path="url(#dentro)"><path d="M6 44 L40 2 L52 10 L18 54 Z" fill="url(#nastro)" opacity=".55"/></g>
</g>
</svg>`;
fs.writeFileSync(`${OUT}/qr-easybagno-logo.svg`, svg);

// PDF vettoriale 50x50 mm, per chi in tipografia preferisce il PDF all'SVG
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(`<html><head><style>@page{margin:0}html,body{margin:0;width:50mm;height:50mm}svg{display:block;width:50mm;height:50mm}</style></head><body>${svg.replace(/ width="\d+" height="\d+"/, '')}</body></html>`);
await p.pdf({ path: `${OUT}/qr-easybagno-logo.pdf`, width: '50mm', height: '50mm', printBackground: true });
// prova di lettura: SVG rasterizzato a tre dimensioni
for (const lato of [1200, 400, 180]) {
  await p.setViewportSize({ width: lato, height: lato });
  await p.setContent(`<html><body style="margin:0">${svg.replace(/width="\d+" height="\d+"/, `width="${lato}" height="${lato}"`)}</body></html>`);
  await p.screenshot({ path: `${OUT}/../.qr-prova-${lato}.png` });
}
await b.close();
console.log(`moduli ${n}x${n} + zona di rispetto ${Q} → viewBox ${S}; riquadro logo ${box}x${box} moduli (${(box * box / (n * n) * 100).toFixed(1)}% del codice)`);
