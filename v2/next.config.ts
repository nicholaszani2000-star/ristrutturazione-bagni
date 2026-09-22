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

const nextConfig: NextConfig = {
  ...(isPreviewExport && {
    output: "export",
    images: { unoptimized: true },
    // Percorsi relativi: cosi' la cartella esportata si apre con un doppio clic
    // su index.html, senza dover far girare un server. Con i percorsi assoluti
    // di default il browser cercherebbe /_next/ nella radice del disco.
    assetPrefix: ".",
  }),
};

export default nextConfig;
