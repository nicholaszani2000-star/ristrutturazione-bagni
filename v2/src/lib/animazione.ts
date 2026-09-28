/**
 * GSAP caricato a richiesta, non nel pacchetto iniziale.
 *
 * GSAP e ScrollTrigger sono ~110 KB di JavaScript da eseguire. Importati in
 * cima ai componenti finivano nel codice che il telefono deve leggere prima
 * che la pagina diventi usabile, per animazioni che riguardano quasi tutte
 * cio' che sta sotto la piega. Caricati cosi' arrivano in un file a parte,
 * subito dopo l'avvio: le animazioni sono le stesse, la pagina risponde prima.
 *
 * Una sola promessa per tutta la pagina: il primo componente che chiede GSAP
 * lo scarica, gli altri aspettano lo stesso download.
 */
type Animazioni = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let promessa: Promise<Animazioni> | null = null;

export function caricaAnimazioni(): Promise<Animazioni> {
  promessa ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    },
  );
  return promessa;
}

/**
 * Esegue "avvia" quando GSAP e' pronto, se il componente e' ancora montato.
 * Restituisce la funzione di pulizia per useEffect: smonta quello che "avvia"
 * ha creato, anche se il componente se ne va prima che GSAP arrivi.
 */
export function conAnimazioni(avvia: (a: Animazioni) => (() => void) | void) {
  let vivo = true;
  let smonta: (() => void) | void;
  caricaAnimazioni().then((a) => {
    if (vivo) smonta = avvia(a);
  });
  return () => {
    vivo = false;
    smonta?.();
  };
}
