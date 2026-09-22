"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  PerspectiveCamera,
  useGLTF,
  Html,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import gsap from "gsap";

/**
 * Concept 3D del bagno "dopo".
 *
 * NON e' il bagno di un cliente e non e' il 3x2 m dell'offerta: e' una
 * visualizzazione di materiali, luce e atmosfera. La distinzione non e'
 * formale — la pagina porta una P.IVA reale, e mostrare un render lasciando
 * intendere che sia un cantiere eseguito sarebbe pubblicita' ingannevole. I
 * lavori veri stanno nella sezione Prima/Dopo, che resta separata.
 */

// Percorso relativo, non assoluto: cosi' il modello si trova sia sul sito
// pubblicato sia nel pacchetto che si apre con doppio clic, dove una barra
// iniziale punterebbe alla radice del disco.
const MODELLO = "models/bagno-dopo-concept.glb";

/**
 * Il modello e' Z-up, non Y-up.
 *
 * E' stato generato con trimesh, che mette l'alto su Z, mentre three.js usa Y.
 * Nel file il pavimento sta a Z=0 e copre X 0..3,00 e Y 0..2,00: il 3x2 m
 * dell'offerta, con il soffitto a 2,64 m. Senza la rotazione la stanza entra
 * in scena coricata su un fianco, e ogni correzione di camera o di luci
 * inseguirebbe un errore che sta a monte.
 *
 * Ruotando di -90 gradi attorno a X, (x, y, z) diventa (x, z, -y). L'origine
 * resta in uno spigolo, quindi serve anche la traslazione: cosi' il centro del
 * pavimento finisce a (0, 0, 0).
 *
 * Stanza risultante:  X -1,5..1,5  ·  Y 0..2,64  ·  Z -1,0..1,0
 */
const ROTAZIONE: [number, number, number] = [-Math.PI / 2, 0, 0];
const CENTRO: [number, number, number] = [-1.5, 0, 1.0];
const ALTEZZA_SGUARDO = 1.05;

/**
 * Posizione di riposo della camera: fuori dalla stanza, che ora si vede
 * comunque dentro perche' il guscio murario e' disegnato solo sulle facce
 * interne. Dentro non c'era spazio per orbitare: a meno di un metro dal centro
 * la camera finisce dentro i mobili, che occupano quasi tutta la pianta.
 */
const POSA = new THREE.Vector3(3.1, 2.6, 3.2);
const RAGGIO_MIN = 2.9;
const RAGGIO_MAX = 8;

/**
 * Punti d'interesse.
 *
 * Le posizioni non sono scelte a occhio: vengono dagli ingombri dichiarati nel
 * GLB, riportati nel sistema di three con la stessa trasformazione applicata al
 * modello (x-1,5 · y=z · z=1-y). Lo specchio, per esempio, nel file occupa
 * X 0,33..1,17 e Z 1,21..2,05, che qui diventa X -1,17..-0,33 e altezza
 * 1,21..2,05.
 *
 * Ogni punto porta anche la posa da cui si guarda. Le distanze stanno dentro i
 * limiti dell'orbita (2,9..8): una posa piu' vicina verrebbe respinta dai
 * controlli e l'inquadratura finirebbe altrove.
 */
const PUNTI = [
  {
    nome: "Mobile e lavabo",
    dettaglio: "Sospeso, con lavabo da appoggio e miscelatore nero",
    punto: [-0.75, 0.95, 0.1] as const,
    camera: [-2.0, 1.8, 3.2] as const,
  },
  {
    nome: "Specchio circolare",
    dettaglio: "Retroilluminato, sopra il piano del lavabo",
    punto: [-0.75, 1.6, 0.08] as const,
    camera: [-1.8, 2.3, 3.0] as const,
  },
  {
    nome: "Doccia walk-in",
    dettaglio: "Lastra in vetro, piatto a filo pavimento",
    punto: [0.95, 1.2, -0.02] as const,
    camera: [3.6, 2.1, 2.6] as const,
  },
] as const;

function Stanza() {
  const { scene } = useGLTF(MODELLO);

  // Una copia per istanza: useGLTF mette in cache la scena, e modificarla
  // direttamente significherebbe alterare l'originale condiviso.
  const modello = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;

      // Il guscio murario si vede solo da dentro.
      //
      // Il modello e' una stanza chiusa su quattro lati: da fuori si vedevano
      // solo i muri esterni, e da dentro non c'e' spazio per orbitare — a
      // meno di un metro dal centro la camera finisce dentro i mobili, che
      // occupano quasi tutta la pianta di 3x2.
      //
      // Disegnando solo le facce interne, le pareti fra osservatore e stanza
      // spariscono da sole mentre si gira: si guarda dentro da ogni lato senza
      // dover indovinare quale muro nascondere.
      //
      // I materiali vanno duplicati: clone() li condivide con la scena in
      // cache, e cambiarli qui li cambierebbe per tutti.
      const mat = m.material as THREE.Material | THREE.Material[];
      const guscio = (x: THREE.Material) => x.name === "Dark Stone";
      if (Array.isArray(mat)) {
        m.material = mat.map((x) => {
          if (!guscio(x)) return x;
          const y = x.clone();
          y.side = THREE.BackSide;
          return y;
        });
      } else if (guscio(mat)) {
        const y = mat.clone();
        y.side = THREE.BackSide;
        m.material = y;
        // Una parete che non si vede non puo' proiettare ombra sulla stanza.
        m.castShadow = false;
      }
    });
    return c;
  }, [scene]);

  return <primitive object={modello} rotation={ROTAZIONE} position={CENTRO} />;
}

useGLTF.preload(MODELLO);

/**
 * Regia della camera: ingresso cinematografico, parallasse, ripristino vista.
 *
 * L'ingresso e i controlli manuali si contendono la stessa camera, quindi
 * OrbitControls resta spento finche' il volo non e' finito: lasciarli attivi
 * insieme fa scattare l'inquadratura al primo tocco.
 */
function RegiaCamera({
  ingresso, animato, progresso, ripristina, fuoco, onPronta,
}: {
  ingresso: boolean;
  animato: boolean;
  progresso: MutableRefObject<number>;
  ripristina: number;
  fuoco: number | null;
  onPronta: () => void;
}) {
  const { camera, controls, invalidate } = useThree();

  useEffect(() => {
    camera.lookAt(0, ALTEZZA_SGUARDO, 0);
    if (!ingresso) {
      camera.position.copy(POSA);
      onPronta();
      return;
    }
    const t = gsap.fromTo(
      camera.position,
      { x: 5.6, y: 1.6, z: 5.8 },
      {
        x: POSA.x, y: POSA.y, z: POSA.z,
        duration: 2.1, ease: "power3.out",
        onUpdate: () => camera.lookAt(0, ALTEZZA_SGUARDO, 0),
        onComplete: onPronta,
      },
    );
    return () => { t.kill(); };
  }, [camera, ingresso, onPronta]);

  // Ripristino vista. Parte da 0 e viene ignorato al primo render, altrimenti
  // si sovrapporrebbe al volo d'ingresso appena montato.
  useEffect(() => {
    if (ripristina === 0) return;
    const c = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    const t = gsap.to(camera.position, {
      x: POSA.x, y: POSA.y, z: POSA.z,
      duration: 0.9, ease: "power2.out",
      onUpdate: () => {
        c?.target.set(0, ALTEZZA_SGUARDO, 0);
        c?.update();
        invalidate();
      },
    });
    return () => { t.kill(); };
  }, [ripristina, camera, controls, invalidate]);

  // Avvicinamento a un punto d'interesse.
  //
  // Si muovono insieme la camera e il bersaglio dell'orbita: spostare solo la
  // prima lascerebbe l'inquadratura puntata al centro della stanza, e il
  // dettaglio finirebbe di sbieco ai margini. Il bersaglio viene interpolato
  // attraverso un oggetto di appoggio perche' e' un Vector3 dei controlli, non
  // una proprieta' che GSAP possa animare direttamente.
  useEffect(() => {
    if (fuoco === null) return;
    const p = PUNTI[fuoco];
    const c = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (!c) return;

    const da = c.target.clone();
    const stato = { t: 0 };
    const verso = new THREE.Vector3(...p.punto);

    const t = gsap.timeline();
    t.to(camera.position, {
      x: p.camera[0], y: p.camera[1], z: p.camera[2],
      duration: 1.25, ease: "power3.inOut",
    }, 0);
    t.to(stato, {
      t: 1, duration: 1.25, ease: "power3.inOut",
      onUpdate: () => {
        c.target.lerpVectors(da, verso, stato.t);
        c.update();
        invalidate();
      },
    }, 0);

    return () => { t.kill(); };
  }, [fuoco, camera, controls, invalidate]);

  /* eslint-disable react-hooks/immutability */
  // In react-three-fiber la camera e' un oggetto three.js vivo, posseduto dal
  // ciclo di rendering e non da React. Spostarla per fotogramma e' il modo
  // previsto di muoverla; passare da uno stato React vorrebbe dire un
  // re-render 60 volte al secondo, cioe' il costo che la regola evita.
  useFrame(() => {
    // Con un dettaglio a fuoco la parallasse tace: altrimenti correggerebbe
    // l'altezza a ogni fotogramma e combatterebbe contro l'avvicinamento.
    if (!animato || fuoco !== null) return;
    camera.position.y = POSA.y + (progresso.current - 0.5) * 0.5;
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/**
 * Rotazione con le frecce della tastiera.
 *
 * OrbitControls da solo risponde a mouse e tocco: senza questo, chi naviga da
 * tastiera non puo' girare la scena.
 *
 * Il fuoco lo riceve il contenitore della sezione, reso focalizzabile in modo
 * dichiarativo: qui ci limitiamo a leggere chi ce l'ha. I tasti agiscono solo
 * quando l'utente e' davvero dentro la scena, altrimenti le frecce
 * smetterebbero di scorrere la pagina.
 */
function ComandiTastiera({ minPolare, maxPolare }: { minPolare: number; maxPolare: number }) {
  const { controls, gl, invalidate } = useThree();

  useEffect(() => {
    const tela = gl.domElement;
    const c = controls as unknown as {
      getAzimuthalAngle: () => number; setAzimuthalAngle: (v: number) => void;
      getPolarAngle: () => number; setPolarAngle: (v: number) => void;
      update: () => void;
    } | null;
    if (!c) return;

    const passo = 0.14;
    const dentroLaScena = () => {
      const sezione = tela.closest("[data-scena-3d]");
      return !!sezione && sezione.contains(document.activeElement);
    };
    const premuto = (e: KeyboardEvent) => {
      if (!dentroLaScena()) return;
      if (e.key === "ArrowLeft") c.setAzimuthalAngle(c.getAzimuthalAngle() - passo);
      else if (e.key === "ArrowRight") c.setAzimuthalAngle(c.getAzimuthalAngle() + passo);
      else if (e.key === "ArrowUp") c.setPolarAngle(Math.max(minPolare, c.getPolarAngle() - passo));
      else if (e.key === "ArrowDown") c.setPolarAngle(Math.min(maxPolare, c.getPolarAngle() + passo));
      else return;
      e.preventDefault();
      c.update();
      invalidate();
    };
    window.addEventListener("keydown", premuto);
    return () => window.removeEventListener("keydown", premuto);
  }, [controls, gl, invalidate, minPolare, maxPolare]);

  return null;
}

/**
 * Marcatori dei punti d'interesse.
 *
 * Restano un punto finche' non li si avvicina: aperti tutti e tre in
 * permanenza coprirebbero il modello che dovrebbero far guardare. L'etichetta
 * compare al passaggio del mouse, al fuoco da tastiera e quando il punto e'
 * quello inquadrato.
 *
 * Sono elementi HTML veri dentro la scena, non testo disegnato in 3D: cosi'
 * ereditano i caratteri e i colori del sito, sono leggibili a qualunque
 * distanza e restano raggiungibili da tastiera.
 */
function Marcatori({
  fuoco, onScegli,
}: {
  fuoco: number | null;
  onScegli: (i: number) => void;
}) {
  return (
    <>
      {PUNTI.map((p, i) => (
        // Niente distanceFactor: i marcatori mantengono la stessa misura a
        // schermo qualunque sia la distanza della camera. Scalando con la
        // profondita' diventavano bersagli sempre piu' piccoli proprio quando
        // ci si allontana per guardare l'insieme — e partivano gia' sotto i
        // 44 px consigliati per il dito.
        <Html key={p.nome} position={[...p.punto]} center zIndexRange={[20, 0]}>
          <button
            type="button"
            onClick={() => onScegli(i)}
            aria-label={`Inquadra: ${p.nome}. ${p.dettaglio}`}
            className={`group/p flex items-center gap-2 rounded-full border py-2.5 pl-2.5 pr-2.5 text-left transition-all duration-300 hover:pr-4 focus-visible:pr-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky ${
              fuoco === i
                ? "border-sky/60 bg-navy/90 pr-4"
                : "border-white/30 bg-navy/70 hover:bg-navy/90"
            }`}
          >
            <span className="relative grid size-6 shrink-0 place-items-center">
              <span className="absolute size-2.5 rounded-full bg-sky" />
              <span className="absolute size-6 rounded-full border border-sky/60" />
            </span>
            <span
              className={`overflow-hidden whitespace-nowrap font-display text-[11px] font-semibold text-white transition-all duration-300 group-hover/p:max-w-[14rem] group-focus-visible/p:max-w-[14rem] ${
                fuoco === i ? "max-w-[14rem]" : "max-w-0"
              }`}
            >
              {p.nome}
            </span>
          </button>
        </Html>
      ))}
    </>
  );
}

const MIN_POLARE = 0.55;
const MAX_POLARE = Math.PI / 2.08;

export default function BagnoScene({
  animato, qualitaAlta, progresso, ripristina,
}: {
  animato: boolean;
  qualitaAlta: boolean;
  progresso: MutableRefObject<number>;
  ripristina: number;
}) {
  const [pronta, setPronta] = useState(false);

  // Il punto a fuoco porta con se' la generazione di "ripristina" in cui e'
  // stato scelto. Quando l'utente ripristina la vista, quella generazione
  // avanza e il punto decade da solo: nessuno stato da azzerare dentro un
  // effetto, quindi nessun render a catena.
  const [scelta, setScelta] = useState<{ i: number; gen: number } | null>(null);
  const fuoco = scelta && scelta.gen === ripristina ? scelta.i : null;

  // La rotazione automatica costa un fotogramma continuo finche' la sezione e'
  // a schermo. Su desktop e' accettabile; su mobile — da dove arriva l'80% del
  // traffico — significa batteria bruciata e fotogrammi tolti alle altre
  // animazioni della pagina. Sul piccolo il volo d'ingresso si vede lo stesso,
  // poi la scena si ferma e torna a disegnare solo quando la si tocca.
  const ruotaDaSola = animato && qualitaAlta;
  const disegnaSempre = animato && (ruotaDaSola || !pronta);

  return (
    <Canvas
      shadows
      dpr={qualitaAlta ? [1, 1.75] : [1, 1.35]}
      // Esposizione appena sotto 1: con la scena chiusa i bianchi dei
      // sanitari arrivavano a saturazione e perdevano il volume.
      gl={{ antialias: true, powerPreference: "high-performance", toneMappingExposure: 0.95 }}
      // "demand" disegna solo su richiesta: OrbitControls la invia a ogni
      // trascinamento, quindi l'interazione resta fluida senza ciclo continuo.
      frameloop={disegnaSempre ? "always" : "demand"}
    >
      {/* Campo visivo ampio: dentro una stanza di tre metri un obiettivo
          stretto inquadrerebbe poco piu' di una piastrella. */}
      <PerspectiveCamera makeDefault position={[5.6, 1.6, 5.8]} fov={42} />
      <color attach="background" args={["#14100e"]} />

      <Suspense fallback={null}>
        <Stanza />

        {/* Illuminazione disegnata a mano invece di una mappa HDRI scaricata:
            i CDN di HDRI qui sono irraggiungibili e resterebbero comunque una
            dipendenza esterna sul percorso critico. I riflessi servono: senza
            ambiente, lo specchio e i metalli del modello escono neri. */}
        {/* Ambiente tenuto basso di proposito.
            Serve ai riflessi — senza, lo specchio e i metalli del modello
            escono neri — ma non deve illuminare: in una stanza chiusa di tre
            metri anche una sorgente moderata lava via il colore, e la pietra
            scura del modello (#464440) veniva fuori bianca. */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={1.0} position={[0, 3, 1]} scale={[6, 3, 1]} color="#fff1dd" />
          <Lightformer intensity={0.7} position={[-3, 1.6, 2]} scale={[3, 3, 1]} color="#dceaf6" />
          <Lightformer intensity={0.5} position={[3, 1.2, -2]} scale={[3, 2, 1]} color="#ffc98f" />
        </Environment>

        {/* Appena sopra il nero: da qui in su e' luce vera, non luce di riempimento. */}
        <ambientLight intensity={0.22} />

        {/* Faretti a soffitto, appena sotto i 2,04 m del modello. Sono loro a
            illuminare: in un ambiente chiuso una luce direzionale esterna non
            entra. decay 2 e' la caduta fisica corretta — con valori piu' bassi
            la luce non si attenua allontanandosi e la stanza si appiattisce. */}
        <pointLight
          position={[-0.75, 2.42, -0.3]} intensity={4.4} distance={8} decay={2}
          color="#ffeccf" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.001}
        />
        <pointLight position={[0.95, 2.42, 0.1]} intensity={3.4} distance={8} decay={2} color="#ffe3bd" />
        {/* Luce dello specchio: piu' bassa e piu' vicina, da' il taglio caldo
            che si vede nella fotografia di riferimento. */}
        {/* Specchio: sta sulla parete lunga a Z = -0,92, fra X -1,17 e -0,33.
            La luce gli va davanti, non dentro il muro. */}
        <pointLight position={[-0.75, 1.75, -0.6]} intensity={1.8} distance={3.5} decay={2} color="#ffd6a3" />

        <RegiaCamera
          ingresso={animato} animato={animato} progresso={progresso}
          ripristina={ripristina} fuoco={fuoco} onPronta={() => setPronta(true)}
        />
        {pronta && (
          <Marcatori fuoco={fuoco} onScegli={(i) => setScelta({ i, gen: ripristina })} />
        )}
        <ComandiTastiera minPolare={MIN_POLARE} maxPolare={MAX_POLARE} />

        {/* Atmosfera cinematografica solo dove c'e' margine: su mobile il
            composer costa piu' di quanto renda. */}
        {qualitaAlta && (
          <EffectComposer>
            <Bloom intensity={0.22} luminanceThreshold={0.9} luminanceSmoothing={0.25} mipmapBlur />
            <Vignette offset={0.42} darkness={0.3} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls
        makeDefault
        enabled={pronta}
        target={[0, ALTEZZA_SGUARDO, 0]}
        enablePan={false}
        autoRotate={pronta && ruotaDaSola && fuoco === null}
        autoRotateSpeed={0.4}
        // Limiti: sotto il pavimento e troppo vicino la stanza si rompe a vista.
        minPolarAngle={MIN_POLARE}
        maxPolarAngle={MAX_POLARE}
        minDistance={RAGGIO_MIN}
        maxDistance={RAGGIO_MAX}
      />
    </Canvas>
  );
}
