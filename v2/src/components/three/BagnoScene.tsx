"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerspectiveCamera,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import gsap from "gsap";

/**
 * Concept 3D di un bagno premium.
 *
 * NON e' il bagno di un cliente e non e' il 3x2 m dell'offerta: e' una
 * visualizzazione di materiali, luce e atmosfera. La distinzione non e'
 * formale — la pagina porta una P.IVA reale, e mostrare un render lasciando
 * intendere che sia un cantiere eseguito sarebbe pubblicita' ingannevole. I
 * lavori veri stanno nella sezione Prima/Dopo, che resta separata.
 *
 * Tutto e' geometria e materiali calcolati a runtime: qui ogni CDN di asset e'
 * irraggiungibile, e in produzione un modello scaricato da fuori sarebbe un
 * servizio di terzi sul percorso critico. Quando arrivera' un bagno.glb bastera'
 * sostituire <Arredo />: il resto della scena non lo sa e non cambia.
 */

// Le luci ad area in three.js non illuminano finche' non si caricano le loro
// tabelle: senza questa riga la finestra e' solo un rettangolo bianco che non
// fa luce, e la stanza resta al buio senza che nulla segnali l'errore.
RectAreaLightUniformsLib.init();

// Stanza del concept. Proporzioni da bagno lungo e stretto, come la reference.
const L = 3.2, P = 2.2, H = 2.7;
const x0 = -L / 2, x1 = L / 2;
const z0 = -P / 2, z1 = P / 2;

const C = {
  bluProfondo: "#1d4a57",
  bluPetrolio: "#276a7c",
  fuga: "#14343d",
  mobileScuro: "#1b2226",
  ceramica: "#f4f6f6",
  metalloScuro: "#2a2f33",
  vetro: "#bfe0e6",
  ledCaldo: "#ffcf9b",
  luceFinestra: "#e8f4ff",
};

/**
 * Generatore pseudo-casuale con seme (mulberry32).
 *
 * Le venature devono essere le stesse a ogni disegno. Con Math.random la
 * texture cambierebbe a ogni ricalcolo della memoizzazione: la stanza
 * cambierebbe aspetto sotto gli occhi di chi la sta guardando, e due visite
 * darebbero due bagni diversi.
 */
function casualeConSeme(seme: number) {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Grandi piastrelle effetto pietra, disegnate su una canvas.
 *
 * Una parete a tinta unita legge come cartongesso. Serve la fuga e serve la
 * venatura: senza la seconda, la pietra sembra plastica. Il rumore e' a grana
 * grossa di proposito — a grana fine, ridotto in prospettiva, sparisce.
 */
function usePietra(base: string, fuga: string, ripetizioni: [number, number], lucida: boolean) {
  return useMemo(() => {
    const dim = 512;
    const c = document.createElement("canvas");
    c.width = c.height = dim;
    const g = c.getContext("2d");
    if (!g) return null;

    g.fillStyle = fuga;
    g.fillRect(0, 0, dim, dim);

    // Formato grande: due lastre per lato, non un mosaico.
    const n = 2, lato = dim / n, fugaPx = lucida ? 3 : 5;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        g.fillStyle = base;
        g.fillRect(x * lato + fugaPx / 2, y * lato + fugaPx / 2, lato - fugaPx, lato - fugaPx);
      }
    }

    // Venature: macchie chiare e scure a bassa opacita', sempre le stesse.
    const rnd = casualeConSeme(lucida ? 20260101 : 20260202);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = rnd() > 0.5 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.055)";
      const r = 6 + rnd() * 26;
      g.beginPath();
      g.ellipse(rnd() * dim, rnd() * dim, r, r * (0.3 + rnd()), rnd() * Math.PI, 0, Math.PI * 2);
      g.fill();
    }

    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(ripetizioni[0], ripetizioni[1]);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [base, fuga, ripetizioni, lucida]);
}

function Pavimento({ qualitaAlta }: { qualitaAlta: boolean }) {
  const pietra = usePietra(C.bluProfondo, C.fuga, [3, 2], true);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[L, P]} />
      {qualitaAlta ? (
        // Il pavimento lucido che riflette e' meta' dell'effetto: senza,
        // l'ambiente resta piatto. Costa, quindi su mobile si scende di
        // risoluzione invece di rinunciarci.
        <MeshReflectorMaterial
          map={pietra ?? undefined}
          color={C.bluProfondo}
          resolution={512}
          mixBlur={1.1}
          mixStrength={22}
          roughness={0.32}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          metalness={0.35}
          mirror={0.45}
        />
      ) : (
        <meshStandardMaterial map={pietra ?? undefined} color={C.bluProfondo} roughness={0.35} metalness={0.3} />
      )}
    </mesh>
  );
}

function Pareti() {
  const pietra = usePietra(C.bluPetrolio, C.fuga, [3, 3], false);
  return (
    <group>
      <mesh position={[0, H / 2, z0]} receiveShadow>
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial map={pietra ?? undefined} color={C.bluPetrolio} roughness={0.55} metalness={0.08} />
      </mesh>
      <mesh position={[x0, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[P, H]} />
        <meshStandardMaterial map={pietra ?? undefined} color={C.bluPetrolio} roughness={0.55} metalness={0.08} />
      </mesh>
      {/* Soffitto: chiude la scena e da' un piano su cui rimbalza la luce */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L, P]} />
        <meshStandardMaterial color="#b9c4c7" roughness={1} />
      </mesh>
    </group>
  );
}

/** Finestra sulla parete di sinistra: e' la sorgente di luce naturale. */
function Finestra() {
  return (
    <group>
      <mesh position={[x0 + 0.012, 1.55, 0.35]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.95, 1.1]} />
        <meshBasicMaterial color={C.luceFinestra} toneMapped={false} />
      </mesh>
      <mesh position={[x0 + 0.02, 1.55, 0.35]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.52, 0.56, 4]} />
        <meshStandardMaterial color={C.metalloScuro} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* La luce vera che entra: fredda, in contrasto con i LED caldi */}
      <rectAreaLight
        position={[x0 + 0.05, 1.55, 0.35]} rotation={[0, Math.PI / 2, 0]}
        width={0.95} height={1.1} intensity={7} color={C.luceFinestra}
      />
    </group>
  );
}

function Doccia() {
  const cx = x1 - 0.62, cz = z0 + 0.55;
  return (
    <group>
      {/* Piatto a filo pavimento */}
      <mesh position={[cx, 0.012, cz]} receiveShadow>
        <boxGeometry args={[1.2, 0.024, 1.1]} />
        <meshStandardMaterial color="#1d2b30" roughness={0.45} metalness={0.2} />
      </mesh>

      {/* Lastra walk-in in vetro */}
      <mesh position={[cx - 0.6, 1.05, cz]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.1, 2.1]} />
        <meshPhysicalMaterial
          color={C.vetro} transparent opacity={0.16} roughness={0.03}
          metalness={0} transmission={0.95} thickness={0.012}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[cx - 0.6, 1.05, cz - 0.55]}>
        <boxGeometry args={[0.028, 2.1, 0.028]} />
        <meshStandardMaterial color={C.metalloScuro} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Rain shower a soffitto */}
      <mesh position={[cx, H - 0.06, cz]}>
        <boxGeometry args={[0.32, 0.03, 0.32]} />
        <meshStandardMaterial color={C.metalloScuro} roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[cx, H - 0.09, cz]}>
        <boxGeometry args={[0.3, 0.012, 0.3]} />
        <meshBasicMaterial color="#8fb6bf" toneMapped={false} transparent opacity={0.35} />
      </mesh>

      {/* Nicchia illuminata nella parete della doccia */}
      <mesh position={[cx + 0.2, 1.25, z0 + 0.03]}>
        <boxGeometry args={[0.7, 0.3, 0.06]} />
        <meshStandardMaterial color="#0e2a32" roughness={0.6} />
      </mesh>
      <mesh position={[cx + 0.2, 1.25, z0 + 0.065]}>
        <planeGeometry args={[0.68, 0.28]} />
        <meshBasicMaterial color={C.ledCaldo} toneMapped={false} />
      </mesh>
      <pointLight position={[cx + 0.2, 1.25, z0 + 0.3]} intensity={2.4} distance={1.8} color={C.ledCaldo} />
    </group>
  );
}

function ZonaLavabo() {
  const cx = -0.75;
  return (
    <group>
      {/* Mobile sospeso scuro */}
      <mesh position={[cx, 0.66, z0 + 0.26]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.44, 0.5]} />
        <meshStandardMaterial color={C.mobileScuro} roughness={0.42} metalness={0.15} />
      </mesh>
      <mesh position={[cx, 0.895, z0 + 0.26]} castShadow>
        <boxGeometry args={[1.29, 0.04, 0.54]} />
        <meshStandardMaterial color="#20292d" roughness={0.3} metalness={0.25} />
      </mesh>
      {/* LED sotto il mobile: e' cio' che lo fa "galleggiare" */}
      <mesh position={[cx, 0.437, z0 + 0.26]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 0.45]} />
        <meshBasicMaterial color={C.ledCaldo} toneMapped={false} transparent opacity={0.75} />
      </mesh>
      <pointLight position={[cx, 0.32, z0 + 0.3]} intensity={1.8} distance={1.6} color={C.ledCaldo} />

      {/* Lavabo da appoggio */}
      <mesh position={[cx, 0.985, z0 + 0.26]} castShadow>
        <cylinderGeometry args={[0.21, 0.185, 0.14, 40]} />
        <meshStandardMaterial color={C.ceramica} roughness={0.15} />
      </mesh>
      <mesh position={[cx, 1.11, z0 + 0.06]}>
        <boxGeometry args={[0.028, 0.3, 0.028]} />
        <meshStandardMaterial color={C.metalloScuro} roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Specchio circolare retroilluminato */}
      <mesh position={[cx, 1.78, z0 + 0.03]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.44, 48]} />
        <meshBasicMaterial color={C.ledCaldo} toneMapped={false} />
      </mesh>
      {/* Il disco nasce sdraiato: la rotazione va sulla mesh, non sulla
          geometria, che non ha un orientamento proprio. */}
      <mesh position={[cx, 1.78, z0 + 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.37, 0.37, 0.03, 48]} />
        <meshStandardMaterial color="#cfdde2" metalness={0.45} roughness={0.1} envMapIntensity={1.8} />
      </mesh>
      <pointLight position={[cx, 1.78, z0 + 0.4]} intensity={2.6} distance={2.2} color={C.ledCaldo} />
    </group>
  );
}

function Sanitari() {
  return (
    <group>
      <mesh position={[x0 + 0.3, 0.45, z1 - 0.42]} castShadow>
        <boxGeometry args={[0.58, 0.34, 0.38]} />
        <meshStandardMaterial color={C.ceramica} roughness={0.14} />
      </mesh>
      <mesh position={[x0 + 0.3, 0.45, z1 - 0.88]} castShadow>
        <boxGeometry args={[0.58, 0.34, 0.38]} />
        <meshStandardMaterial color={C.ceramica} roughness={0.14} />
      </mesh>
    </group>
  );
}

/**
 * Tutto l'arredo in un solo gruppo.
 *
 * E' il punto di sostituzione: con un bagno.glb a disposizione, questo diventa
 * <primitive object={gltf.scene} /> e nient'altro nella scena va toccato.
 */
function Arredo() {
  return (
    <group>
      <Doccia />
      <ZonaLavabo />
      <Sanitari />
    </group>
  );
}

/**
 * Regia della camera: ingresso cinematografico e parallasse allo scorrimento.
 *
 * L'ingresso e i controlli manuali si contendono la stessa camera, quindi
 * OrbitControls resta spento finche' il volo non e' finito: lasciarli attivi
 * insieme fa scattare l'inquadratura al primo tocco.
 */
function RegiaCamera({
  ingresso, animato, progresso, onPronta,
}: {
  ingresso: boolean; animato: boolean;
  progresso: MutableRefObject<number>; onPronta: () => void;
}) {
  const { camera } = useThree();
  const base = useRef(new THREE.Vector3(2.55, 1.85, 2.55));

  useEffect(() => {
    camera.lookAt(0, 1.15, 0);
    if (!ingresso) {
      camera.position.copy(base.current);
      onPronta();
      return;
    }
    const t = gsap.fromTo(
      camera.position,
      { x: 4.6, y: 0.95, z: 4.6 },
      {
        x: base.current.x, y: base.current.y, z: base.current.z,
        duration: 2.1, ease: "power3.out",
        onUpdate: () => camera.lookAt(0, 1.15, 0),
        onComplete: onPronta,
      },
    );
    return () => { t.kill(); };
  }, [camera, ingresso, onPronta]);

  // Parallasse: il valore arriva da un ref aggiornato fuori da React, cosi'
  // scorrere la pagina non provoca un re-render per fotogramma.
  //
  // La regola sull'immutabilita' e' disattivata qui, e solo qui, per un motivo
  // preciso: in react-three-fiber la camera e' un oggetto three.js vivo,
  // posseduto dal ciclo di rendering e non da React. Spostarla a ogni
  // fotogramma e' il modo previsto di muoverla; farla passare per uno stato
  // React significherebbe un re-render a 60 volte al secondo, cioe' esattamente
  // il costo che la regola vorrebbe evitare.
  /* eslint-disable react-hooks/immutability */
  useFrame(() => {
    if (!animato) return;
    const p = progresso.current;
    camera.position.y = base.current.y + (p - 0.5) * 0.55;
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

export default function BagnoScene({
  animato, qualitaAlta, progresso,
}: {
  animato: boolean; qualitaAlta: boolean; progresso: MutableRefObject<number>;
}) {
  const [pronta, setPronta] = useState(false);

  // La rotazione automatica costa un fotogramma continuo finche' la sezione e'
  // a schermo. Su desktop e' un lusso accettabile; su mobile — da dove arriva
  // l'80% del traffico — significa batteria bruciata e fotogrammi tolti alle
  // altre animazioni della pagina, che rallentano visibilmente.
  //
  // Quindi sul piccolo: il volo d'ingresso si vede lo stesso, poi la scena si
  // ferma e torna a disegnare solo quando la si tocca. Resta girabile col dito,
  // non gira da sola.
  const ruotaDaSola = animato && qualitaAlta;
  const disegnaSempre = animato && (ruotaDaSola || !pronta);

  return (
    <Canvas
      shadows
      dpr={qualitaAlta ? [1, 1.75] : [1, 1.35]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      // "demand" disegna solo su richiesta: OrbitControls la invia a ogni
      // trascinamento, quindi l'interazione resta fluida.
      frameloop={disegnaSempre ? "always" : "demand"}
    >
      <PerspectiveCamera makeDefault position={[4.6, 0.95, 4.6]} fov={52} />
      <color attach="background" args={["#0d2228"]} />
      <fog attach="fog" args={["#0d2228", 11, 24]} />

      <Suspense fallback={null}>
        <Pavimento qualitaAlta={qualitaAlta} />
        <Pareti />
        <Finestra />
        <Arredo />

        {/* Illuminazione disegnata a mano invece di una mappa HDRI scaricata:
            i CDN di HDRI qui sono bloccati, e resterebbero comunque una
            dipendenza esterna in produzione. */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={3.4} position={[0, 4, 1]} scale={[6, 3, 1]} color="#dff0f5" />
          <Lightformer intensity={2.2} position={[-4, 2, 2]} scale={[3, 3, 1]} color={C.luceFinestra} />
          <Lightformer intensity={1.0} position={[3, 1, -2]} scale={[3, 2, 1]} color={C.ledCaldo} />
        </Environment>

        {/* La stanza si guarda da fuori, ma va illuminata da dentro: con la
            sola luce esterna l'interno resta in ombra e si vedono solo gli
            oggetti che emettono luce da soli. */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[-3, 4, 2]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} color="#eaf4ff" />
        <pointLight position={[-0.6, H - 0.55, 0]} intensity={7} distance={5} decay={1.7} color="#f2f7fa" />
        <pointLight position={[0.9, H - 0.55, 0.2]} intensity={5.5} distance={5} decay={1.7} color="#eef5f8" />
        <pointLight position={[0, 1.2, z1 + 1.2]} intensity={4} distance={6} decay={1.5} color="#dceaf2" />

        <RegiaCamera
          ingresso={animato} animato={animato} progresso={progresso}
          onPronta={() => setPronta(true)}
        />

        {/* Atmosfera cinematografica solo dove c'e' margine: su mobile il
            composer costa piu' di quanto renda. */}
        {qualitaAlta && (
          <EffectComposer>
            <Bloom intensity={0.42} luminanceThreshold={0.72} luminanceSmoothing={0.3} mipmapBlur />
            <Vignette offset={0.4} darkness={0.32} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls
        makeDefault
        enabled={pronta}
        target={[0, 1.15, 0]}
        enablePan={false}
        autoRotate={pronta && ruotaDaSola}
        autoRotateSpeed={0.42}
        minPolarAngle={0.5}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2.2}
        maxDistance={7.5}
      />
    </Canvas>
  );
}
