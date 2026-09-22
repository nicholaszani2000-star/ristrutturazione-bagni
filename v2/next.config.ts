import type { NextConfig } from "next";

/**
 * Due modalità di build.
 *
 * Normale (Vercel): server rendering, next/image ottimizza le foto al volo.
 * PREVIEW_EXPORT=1: esporta HTML statico in out/ per pubblicare un'anteprima
 * dove non c'è un server. In quel caso l'ottimizzatore non può girare, quindi
 * le immagini vengono servite così come sono — sono già WebP sotto i 120 KB.
 *
 * Tenerle separate evita di rompere il deploy vero per fare un'anteprima.
 */
const isPreviewExport = process.env.PREVIEW_EXPORT === "1";

/**
 * I percorsi relativi servono solo al pacchetto che si apre con doppio clic.
 *
 * Con assetPrefix "." una pagina in sottocartella, come /privacy, cerchera' gli
 * asset in /privacy/_next/ e non li trovera'. Su un hosting vero i percorsi
 * assoluti sono quelli corretti, quindi la scorciatoia resta confinata alla
 * build offline, che ha una pagina sola.
 */
const isOffline = process.env.OFFLINE === "1";

const nextConfig: NextConfig = {
  ...(isPreviewExport && {
    output: "export",
    images: { unoptimized: true },
    // Genera privacy/index.html invece di privacy.html. Netlify saprebbe
    // mappare anche il secondo, ma la cartella con index.html la serve
    // qualunque hosting e qualunque server locale: una dipendenza in meno dal
    // comportamento di una piattaforma specifica.
    trailingSlash: true,
    ...(isOffline && { assetPrefix: "." }),
  }),
};

export default nextConfig;
