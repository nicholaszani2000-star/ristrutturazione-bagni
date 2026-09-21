"use client";

/**
 * Prova di funzionamento della catena three + R3F + drei.
 * Serve solo a verificare che il build passi e che il 3D finisca in un chunk
 * separato. Va cancellato quando arriva il configuratore vero.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Box() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1B84DD" roughness={0.35} />
    </mesh>
  );
}

export default function SmokeTest() {
  return (
    <Canvas camera={{ position: [2.5, 1.8, 2.5], fov: 38 }}>
      <Environment preset="city" />
      <Box />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
