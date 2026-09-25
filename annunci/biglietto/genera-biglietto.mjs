// Biglietto da visita EasyBagno 85x55 mm (+3 mm di abbondanza).
// Uso: dalla cartella con qrcode installato (npm i qrcode) e dopo "npm run build:netlify"
// in v2/ (servono i font della build): node genera-biglietto.mjs <cartella-di-uscita>
// Il testo si impagina a scala 10 e si riduce in uscita: a scala reale il browser
// arrotonda le posizioni delle lettere e le parole piccole escono con spazi storti.
import QRCode from 'qrcode';
import fs from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const OUT = process.argv[2];
const dir = '/home/user/ristrutturazione-bagni/v2/out/_next/static/chunks/';
const css = fs.readdirSync(dir).filter(f => f.endsWith('.css')).map(f => dir + f).find(f => fs.readFileSync(f, 'utf8').includes('@font-face'));

// QR: correzione H (regge il logo al centro), niente margine: il margine lo
// fa il riquadro bianco + lo sfondo chiaro del biglietto.
const qr = await QRCode.toString('https://easybagno.it', { type: 'svg', errorCorrectionLevel: 'H', margin: 0, color: { dark: '#143a5cff', light: '#ffffffff' } });

const goccia = (id) => `<svg viewBox="0 0 64 64"><defs>
  <linearGradient id="${id}a" x1="14" y1="8" x2="50" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#56B4EE"/><stop offset=".5" stop-color="#1B84DD"/><stop offset="1" stop-color="#1663B0"/></linearGradient>
  <linearGradient id="${id}b" x1="20" y1="14" x2="44" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8ACFF7"/><stop offset="1" stop-color="#2B95E8"/></linearGradient>
  <clipPath id="${id}c"><path d="M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z"/></clipPath></defs>
  <path fill-rule="evenodd" fill="url(#${id}a)" d="M32 5C32 5 51 28 51 39.5A19 19 0 1 1 13 39.5C13 28 32 5 32 5Z M32 18.5C32 18.5 42 31 42 39.7A10 10 0 1 1 22 39.7C22 31 32 18.5 32 18.5Z"/>
  <g clip-path="url(#${id}c)"><path d="M6 44 L40 2 L52 10 L18 54 Z" fill="url(#${id}b)" opacity=".55"/></g></svg>`;

// icone: le stesse del sito (Icon.tsx)
const ico = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  whatsapp: '<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.25-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.890 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.450-4.44 9.890-9.89 9.890m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  pin: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
};
const icona = n => `<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ico[n]}</svg></span>`;

const B = 3; // abbondanza, mm
const Z = 10; // si impagina 10 volte piu' grande e si riduce in uscita
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${css}"><style>
@page { margin: 0 }
html{zoom:${Z}}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${85 + 2 * B}mm;height:${55 + 2 * B}mm;overflow:hidden;text-rendering:geometricPrecision;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.foglio{position:relative;width:100%;height:100%;background:radial-gradient(120% 90% at 20% 10%,#ffffff 0%,#f4f8fc 60%,#eef4fb 100%);font-family:Inter,sans-serif;color:#143a5c}
/* tutto il contenuto e' posizionato rispetto al TAGLIO (85x55), non al foglio */
.t{position:absolute;left:${B}mm;top:${B}mm;width:85mm;height:55mm}
.onda{position:absolute;left:0;right:0;bottom:0;height:${14 + B}mm}
.onda svg{width:100%;height:100%;display:block}
.logo{position:absolute;left:5mm;top:5.2mm;display:flex;align-items:center;gap:1.6mm}
.logo .m{width:8.6mm;height:8.6mm}.logo .m svg{width:100%;height:100%}
.logo b{display:block;font-family:Poppins;font-weight:700;font-size:13.5pt;letter-spacing:-.02em;line-height:1}
.logo b span{color:#1b84dd}
.logo small{display:block;margin-top:.9mm;font-size:4.6pt;letter-spacing:.28em;color:#55707f;font-weight:500}
.slogan{position:absolute;left:5mm;top:19.5mm;font-family:Poppins;font-weight:600;font-size:9.2pt;line-height:1.15;letter-spacing:-.01em}
.slogan span{color:#1b84dd}
.filo{position:absolute;left:5mm;top:29.3mm;width:6mm;height:.35mm;background:#1b84dd;border-radius:1mm}
.payoff{position:absolute;left:5mm;top:31mm;font-size:4.6pt;letter-spacing:.22em;color:#55707f;font-weight:500;line-height:1.5}
.contatti{position:absolute;left:5mm;top:35.2mm;width:50mm;display:grid;grid-template-columns:auto auto;column-gap:3.2mm;row-gap:1.35mm;font-size:6.4pt;font-weight:500}
.contatti .r{display:flex;align-items:center;gap:1.3mm;white-space:nowrap}
.contatti .largo{grid-column:1 / -1}
.ico{flex:none;width:3.6mm;height:3.6mm;border-radius:50%;background:linear-gradient(145deg,#56b4ee,#1663b0);color:#fff;display:grid;place-items:center}
.ico svg{width:2mm;height:2mm}
.qrbox{position:absolute;right:4.6mm;top:4.6mm;width:24.4mm;height:24.4mm;background:#fff;border-radius:2.2mm;padding:1.6mm;box-shadow:0 0 0 .18mm #cfe3f5}
.qrbox>svg{width:100%;height:100%;display:block}
.qrlogo{position:absolute;left:50%;top:50%;width:5.6mm;height:5.6mm;margin:-2.8mm 0 0 -2.8mm;background:#fff;border-radius:1.1mm;display:grid;place-items:center}
.qrlogo svg{width:4.3mm;height:4.3mm}
.qrtesto{position:absolute;right:4.6mm;top:30.2mm;width:24.4mm;text-align:center}
.qrtesto b{display:block;font-family:Poppins;font-weight:700;font-size:7.4pt;letter-spacing:-.01em}.qrtesto b span{color:#1b84dd}
.qrtesto small{display:block;margin-top:.5mm;font-size:4.7pt;color:#55707f}
</style></head><body><div class="foglio">
<div class="onda"><svg viewBox="0 0 910 170" preserveAspectRatio="none">
 <defs><linearGradient id="w1" x1="0" x2="1"><stop offset="0" stop-color="#d6ecfb"/><stop offset=".55" stop-color="#8ecdf5"/><stop offset="1" stop-color="#1b84dd"/></linearGradient>
 <linearGradient id="w2" x1="0" x2="1"><stop offset="0" stop-color="#eaf5fd"/><stop offset="1" stop-color="#56b4ee"/></linearGradient></defs>
 <path d="M0 95 C 160 60, 300 120, 470 96 S 760 30, 910 18 L910 170 L0 170 Z" fill="url(#w2)" opacity=".8"/>
 <path d="M0 122 C 190 92, 330 150, 520 120 S 790 58, 910 50 L910 170 L0 170 Z" fill="url(#w1)"/>
 <path d="M0 110 C 190 80, 330 138, 520 108 S 790 46, 910 38" fill="none" stroke="#fff" stroke-width="3" opacity=".85"/>
</svg></div>
<div class="t">
 <div class="logo"><span class="m">${goccia('l')}</span><span><b>Easy<span>Bagno.it</span></b><small>RISTRUTTURAZIONE BAGNO</small></span></div>
 <p class="slogan">Il tuo nuovo bagno,<br><span>senza stress.</span></p>
 <div class="filo"></div>
 <p class="payoff">IL TUO BAGNO, IN BUONE MANI.</p>
 <div class="contatti">
  <span class="r">${icona('phone')}349 239 1107</span>
  <span class="r">${icona('whatsapp')}349 971 1646</span>
  <span class="r largo">${icona('mail')}biodomus2025@libero.it</span>
  <span class="r">${icona('globe')}easybagno.it</span>
  <span class="r">${icona('pin')}Gallarate (VA)</span>
 </div>
 <div class="qrbox">${qr}<span class="qrlogo">${goccia('q')}</span></div>
 <div class="qrtesto"><b>easy<span>bagno</span>.it</b><small>Inquadra e scopri l'offerta</small></div>
</div></div></body></html>`;
fs.writeFileSync(`${OUT}/.biglietto.html`, html);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 3500, height: 2400 } });
await p.goto('file://' + `${OUT}/.biglietto.html`, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
const font = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).filter((v, i, a) => a.indexOf(v) === i).join(', '));
// testo che esce dall'area di sicurezza (3 mm dal taglio)
const fuori = await p.evaluate((Z) => { const mm = 96 / 25.4 * Z, t = document.querySelector('.t').getBoundingClientRect(); return [...document.querySelectorAll('.t b,.t small,.t p,.t .r')].filter(e => { const r = e.getBoundingClientRect(); return r.left < t.left + 3 * mm || r.right > t.right - 3 * mm || r.top < t.top + 3 * mm; }).map(e => e.textContent.trim().slice(0, 25)); }, Z);
// PDF per la tipografia: vettoriale, con 3 mm di abbondanza
await p.pdf({ path: `${OUT}/biglietto-easybagno-stampa.pdf`, width: `${85 + 2 * B}mm`, height: `${55 + 2 * B}mm`, printBackground: true, scale: 1 / Z });
// PNG di anteprima al formato finito, 600 dpi
const mmpx = 96 / 25.4, dpi = 600, scala = dpi / 96;
await p.setViewportSize({ width: Math.ceil((85 + 2 * B) * mmpx), height: Math.ceil((55 + 2 * B) * mmpx) });
const p2 = await b.newPage({ viewport: { width: Math.ceil((85 + 2 * B) * mmpx * Z), height: Math.ceil((55 + 2 * B) * mmpx * Z) }, deviceScaleFactor: scala / Z });
await p2.goto('file://' + `${OUT}/.biglietto.html`, { waitUntil: 'load' }); await p2.evaluate(() => document.fonts.ready);
await p2.screenshot({ path: `${OUT}/biglietto-easybagno.png`, clip: { x: B * mmpx * Z, y: B * mmpx * Z, width: 85 * mmpx * Z, height: 55 * mmpx * Z } });
await b.close();
fs.unlinkSync(`${OUT}/.biglietto.html`);
console.log('font:', font); console.log('fuori area di sicurezza:', fuori.length ? fuori : 'niente');
