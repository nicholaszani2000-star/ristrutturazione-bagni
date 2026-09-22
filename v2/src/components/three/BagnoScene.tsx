"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
  Html,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

/**
 * Il bagno 3x2 m dell'offerta, in scala reale.
 *
 * Non e' un oggetto decorativo: e' il prodotto. Le misure sono quelle vendute
 * (3,00 x 2,00 m) e gli arredi sono le voci della lista "cosa comprende", cosi'
 * chi guarda capisce cosa riceve per 9.490 euro invece di leggerlo e basta.
 *
 * Niente texture ne' modelli esterni: tutto e' geometria e materiali calcolati
 * a runtime. Serve a tenere leggero il pacchetto, ma soprattutto perche' in
 * questo ambiente ogni CDN di asset e' irraggiungibile: un modello scaricato da
 * fuori sarebbe un punto di rottura in produzione.
 */

// Stanza: 3 m in larghezza, 2 m in profondita', 2,6 m di altezza.
const L = 3, P = 2, H = 2.6;
const x0 = -L / 2, x1 = L / 2;
const z0 = -P / 2, z1 = P / 2;

// Palette campionata dalla foto reale del cantiere (bagno-dopo.webp), non
// scelta a occhio: cosi' la stanza somiglia ai lavori che fate davvero.
//
// I valori sono schiariti rispetto ai pixel della foto. Una fotografia porta
// dentro la propria illuminazione: riusare quei colori come colore del
// materiale farebbe contare la luce due volte e la stanza uscirebbe cupa. La
// tinta e la saturazione restano quelle campionate, cambia solo la luminosita'.
const C = {
  pavimento: "#b8a698", // dalla fascia bassa della foto, tinta 26deg
  parete: "#d9d7d3",    // dalle pareti laterali, tinta 34deg
  mobile: "#886d58",    // legno del mobile sospeso
  ceramica: "#fbfbf9",
  nero: "#23262b",
  vetro: "#cfe3ea",
  led: "#ffd9a8",
};

/**
 * Piastrelle disegnate su una canvas al volo.
 *
 * Una parete a tinta unita legge come cartongesso, non come un bagno finito.
 * Serviva una fuga visibile, ma qualsiasi texture scaricata sarebbe un file in
 * piu' e una dipendenza esterna: questa la disegniamo in memoria, pesa zero e
 * non puo' non arrivare.
 */
function usaPiastrelle(piastrella: string, fuga: string, ripetizioni: [number, number]) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    if (!g) return null;
    g.fillStyle = fuga;
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = piastrella;
    const n = 4, lato = 256 / n, fugaPx = 5;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        g.fillRect(x * lato + fugaPx / 2, y * lato + fugaPx / 2, lato - fugaPx, lato - fugaPx);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(ripetizioni[0], ripetizioni[1]);
    t.anisotropy = 4;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [piastrella, fuga, ripetizioni]);
}

function Materiale({ colore, ruvidita = 0.75, metallo = 0 }: {
  colore: string; ruvidita?: number; metallo?: number;
}) {
  return <meshStandardMaterial color={colore} roughness={ruvidita} metalness={metallo} />;
}

/** Scatola posizionata per centro, con dimensioni in metri. */
function Box({ pos, dim, colore, ruvidita, metallo }: {
  pos: [number, number, number]; dim: [number, number, number];
  colore: string; ruvidita?: number; metallo?: number;
}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={dim} />
      <Materiale colore={colore} ruvidita={ruvidita} metallo={metallo} />
    </mesh>
  );
}

function Stanza() {
  const pavimento = usaPiastrelle("#b8a698", "#a3907f", [6, 4]);
  const parete = usaPiastrelle("#d9d7d3", "#c4c0b9", [6, 5]);

  return (
    <group>
      {/* Pavimento in microcemento */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[L, P]} />
        <meshStandardMaterial map={pavimento} color={C.pavimento} roughness={0.85} />
      </mesh>

      {/* Solo due pareti: le altre restano aperte, altrimenti la stanza non si
          puo' guardare da fuori. E' la vista "casa di bambola". */}
      <mesh position={[0, H / 2, z0]} receiveShadow>
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial map={parete} color={C.parete} roughness={0.8} />
      </mesh>
      <mesh position={[x0, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[P, H]} />
        <meshStandardMaterial map={parete} color={C.parete} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Doccia() {
  // Piatto doccia 90x90 nell'angolo, con profilo nero e lastra in vetro.
  const cx = x1 - 0.45, cz = z0 + 0.45;
  return (
    <group>
      <Box pos={[cx, 0.03, cz]} dim={[0.9, 0.06, 0.9]} colore={C.ceramica} ruvidita={0.4} />
      {/* Lastra fissa: trasparente, e' quello che rende leggibile una doccia */}
      <mesh position={[cx - 0.45, 1.0, cz]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 1.9]} />
        <meshPhysicalMaterial
          color={C.vetro} transparent opacity={0.22} roughness={0.05}
          metalness={0} transmission={0.9} thickness={0.01}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Box pos={[cx - 0.45, 1.95, cz]} dim={[0.03, 0.03, 0.9]} colore={C.nero} ruvidita={0.35} metallo={0.8} />
      {/* Soffione a parete */}
      <Box pos={[cx, 2.05, z0 + 0.06]} dim={[0.22, 0.02, 0.22]} colore={C.nero} ruvidita={0.3} metallo={0.9} />
    </group>
  );
}

function MobileESpecchio() {
  const cx = -0.55;
  return (
    <group>
      {/* Mobile sospeso: si vede il pavimento sotto, e' quello che lo fa
          sembrare piu' grande di quanto sia */}
      <Box pos={[cx, 0.72, z0 + 0.24]} dim={[1.0, 0.42, 0.46]} colore={C.mobile} ruvidita={0.6} />
      <Box pos={[cx, 0.95, z0 + 0.24]} dim={[1.04, 0.05, 0.5]} colore={C.ceramica} ruvidita={0.25} />
      {/* Lavabo da appoggio */}
      <mesh position={[cx, 1.04, z0 + 0.24]} castShadow>
        <cylinderGeometry args={[0.19, 0.16, 0.13, 32]} />
        <Materiale colore={C.ceramica} ruvidita={0.2} />
      </mesh>
      {/* Miscelatore */}
      <Box pos={[cx, 1.14, z0 + 0.06]} dim={[0.03, 0.26, 0.03]} colore={C.nero} ruvidita={0.3} metallo={0.9} />
      {/* Alone caldo dietro lo specchio: e' la retroilluminazione, e deve
          essere piu' grande dello specchio per vedersi come alone. */}
      <mesh position={[cx, 1.68, z0 + 0.004]}>
        <planeGeometry args={[1.12, 0.92]} />
        <meshBasicMaterial color={C.led} toneMapped={false} transparent opacity={0.85} />
      </mesh>

      {/* Specchio. Con metalness quasi 1 e ruvidita' quasi 0 riflette solo
          l'ambiente, che qui e' scuro: veniva fuori un rettangolo nero, uguale
          a uno schermo spento. Meno metallo e piu' colore di base: legge come
          vetro anche senza una stanza intera da riflettere. */}
      <mesh position={[cx, 1.68, z0 + 0.025]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.03]} />
        <meshStandardMaterial
          color="#dbe6ec" metalness={0.4} roughness={0.12} envMapIntensity={1.6}
        />
      </mesh>

      {/* Luce vera, non solo un colore: accende il piano sottostante. */}
      <pointLight position={[cx, 1.68, z0 + 0.35]} intensity={2.2} distance={2.4} color={C.led} />
    </group>
  );
}

function SanitariETermoarredo() {
  return (
    <group>
      {/* WC e bidet sospesi sulla parete di sinistra */}
      <Box pos={[x0 + 0.28, 0.42, 0.3]} dim={[0.54, 0.36, 0.36]} colore={C.ceramica} ruvidita={0.2} />
      <Box pos={[x0 + 0.28, 0.42, 0.78]} dim={[0.54, 0.36, 0.36]} colore={C.ceramica} ruvidita={0.2} />
      {/* Termoarredo: e' nella lista di cosa comprende, quindi si vede */}
      {Array.from({ length: 7 }, (_, i) => (
        <Box key={i} pos={[x0 + 0.05, 1.15 + i * 0.13, -0.45]}
             dim={[0.05, 0.04, 0.5]} colore={C.ceramica} ruvidita={0.4} />
      ))}
    </group>
  );
}

function Quote() {
  // Le misure sono l'argomento di vendita: il prezzo vale per questa metratura.
  const stile =
    "whitespace-nowrap rounded-full bg-navy/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg";
  return (
    <>
      {/* Alzate da terra: appoggiate sul pavimento finivano sopra il
          suggerimento "trascina per girare" e si leggevano male entrambe. */}
      <Html position={[-0.35, 0.55, z1 + 0.05]} center distanceFactor={6}>
        <span className={stile}>3,00 m ↔</span>
      </Html>
      <Html position={[x1 + 0.05, 0.55, 0.45]} center distanceFactor={6}>
        <span className={stile}>2,00 m ↔</span>
      </Html>
    </>
  );
}

export default function BagnoScene({ animato }: { animato: boolean }) {
  return (
    <Canvas
      shadows
      // Tetto a 1.75: oltre non si vede la differenza e su mobile si paga cara.
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      // Ferma il ciclo di rendering quando la sezione non e' a schermo: senza
      // questo il 3D continuerebbe a consumare batteria per tutta la pagina.
      frameloop={animato ? "always" : "demand"}
    >
      <PerspectiveCamera makeDefault position={[3.4, 2.6, 3.4]} fov={38} />
      <color attach="background" args={["#efe9e1"]} />

      <Suspense fallback={null}>
        <Stanza />
        <Doccia />
        <MobileESpecchio />
        <SanitariETermoarredo />
        <Quote />

        {/* Luci disegnate a mano invece di una mappa HDRI scaricata: i CDN di
            HDRI qui sono bloccati, e in produzione sarebbero comunque un
            servizio di terzi sul percorso critico. */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.6} position={[0, 4, 1]} scale={[6, 3, 1]} color="#fff6ea" />
          <Lightformer intensity={1.1} position={[-3, 2, 3]} scale={[3, 3, 1]} color="#dceaf6" />
          <Lightformer intensity={0.8} position={[3, 1, -2]} scale={[3, 2, 1]} color="#ffd9a8" />
        </Environment>

        <directionalLight
          position={[3.5, 5, 2.5]} intensity={1.5} castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <ambientLight intensity={0.5} />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={8} blur={2.4} far={3} />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 1.05, 0]}
        enablePan={false}
        autoRotate={animato}
        autoRotateSpeed={0.55}
        // Limiti: sotto il pavimento e troppo vicino la stanza si rompe a vista.
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={3.2}
        maxDistance={8}
      />
    </Canvas>
  );
}
