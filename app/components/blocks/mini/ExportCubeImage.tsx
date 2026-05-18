"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

type RendererState = {
  gl: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
};

function CubeStructure() {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!groupRef.current) return;

    groupRef.current.rotation.x = -0.22 + Math.sin(t * 0.17) * 0.08;
    groupRef.current.rotation.y = t * 0.08 + Math.sin(t * 0.11) * 0.1;
    groupRef.current.rotation.z = Math.sin(t * 0.09) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>

      <mesh scale={1.42}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      <mesh rotation={[0.45, 0.2, 0.1]} scale={0.58}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}

function RendererCapture({
  onReady,
}: {
  onReady: (state: RendererState) => void;
}) {
  const { gl, scene, camera } = useThree();

  useFrame(() => {
    onReady({ gl, scene, camera });
  });

  return null;
}

export default function ExportCubeImage() {
  const rendererRef = useRef<RendererState | null>(null);
  const [isReady, setIsReady] = useState(false);

  function handleReady(state: RendererState) {
    rendererRef.current = state;

    if (!isReady) {
      setIsReady(true);
    }
  }

  function exportImage() {
    const renderer = rendererRef.current;

    if (!renderer) return;

    const { gl, scene, camera } = renderer;

    gl.render(scene, camera);

    const image = gl.domElement.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "bauma-cube.png";
    link.click();
  }

  return (
    <section className="border-t border-white/10 bg-[#080808] px-6 py-12 text-white">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
          Temporary export utility
        </p>

        <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-none tracking-[-0.04em] text-white">
          Cube PNG export
        </h2>

        <p className="mt-4 max-w-[48ch] text-sm leading-6 text-white/50">
          This block is only for exporting the cube as a static PNG. Remove it
          from the page after export.
        </p>

        <div className="mt-8 h-[420px] w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#080808]">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 42 }}
            dpr={[1, 2]}
            gl={{
              alpha: true,
              antialias: true,
              preserveDrawingBuffer: true,
            }}
          >
            <CubeStructure />
            <RendererCapture onReady={handleReady} />
          </Canvas>
        </div>

        <button
          type="button"
          onClick={exportImage}
          disabled={!isReady}
          className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Export cube PNG
        </button>
      </div>
    </section>
  );
}