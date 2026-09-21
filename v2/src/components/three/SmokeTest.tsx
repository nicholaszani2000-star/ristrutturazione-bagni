"use client";

/**
 * Prova di funzionamento della catena three + R3F + drei + postprocessing.
 * Serve a verificare che compili e che il 3D finisca in un chunk separato.
 * Va cancellato quando arriva il configuratore vero.
 *
 * L'illuminazione e' costruita con Lightformer dentro Environment: la mappa
 * viene generata dal motore, senza scaricare nulla. I preset di drei
 * (preset="city") prendono l'HDRI da raw.githack.com, che e' una dipendenza
 * di terze parti sul percorso critico di una pagina che vende.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import type { Mesh } from "three";

function Box() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.35;
  });
  return (
    <mesh ref={ref} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1B84DD" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

export default function SmokeTest() {
  return (
    <Canvas
      shadows
      camera={{ position: [2.6, 1.7, 2.4], fov: 38 }}
      gl={{ antialias: true }}
    >
      {/* Set luci generato in-engine: nessun download */}
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 3, 2]} scale={[6, 3, 1]} />
        <Lightformer intensity={2} color="#56B4EE" position={[-3, 1, 1]} scale={[3, 3, 1]} />
        <Lightformer intensity={1.5} color="#143A5C" position={[3, 1, -2]} scale={[3, 3, 1]} />
      </Environment>

      <Box />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} blur={2.4} far={4} />

      <EffectComposer>
        <Bloom intensity={0.35} luminanceThreshold={0.85} mipmapBlur />
        <Vignette offset={0.3} darkness={0.35} />
      </EffectComposer>

      <OrbitControls enablePan={false} minPolarAngle={0.2} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}
