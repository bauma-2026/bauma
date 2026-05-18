"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type SpatialShape = "cube" | "tetrahedron" | "icosahedron" | "sphere";

type WireStructureProps = {
  shape?: SpatialShape;
  interactive?: boolean;
};

type MiniSpatialObjectProps = {
  shape?: SpatialShape;
  interactive?: boolean;
  className?: string;
};

function ShapeGeometry({ shape }: { shape: SpatialShape }) {
  if (shape === "tetrahedron") {
    return <tetrahedronGeometry args={[1.65, 0]} />;
  }

  if (shape === "icosahedron") {
    return <icosahedronGeometry args={[1.55, 0]} />;
  }

  if (shape === "sphere") {
    return <sphereGeometry args={[1.55, 24, 16]} />;
  }

  return <boxGeometry args={[1.8, 1.8, 1.8]} />;
}

function WireStructure({
  shape = "cube",
  interactive = true,
}: WireStructureProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    function handlePointerMove(event: PointerEvent) {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [interactive]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!groupRef.current) return;

    const softMouseX = interactive ? mouseRef.current.x * 0.28 : 0;
    const softMouseY = interactive ? mouseRef.current.y * 0.2 : 0;

    const driftX = Math.sin(t * 0.17) * 0.08;
    const driftY = Math.sin(t * 0.11) * 0.1;
    const driftZ = Math.sin(t * 0.09) * 0.05;

    targetRotation.current.x = softMouseY + driftX;
    targetRotation.current.y = softMouseX + t * 0.08 + driftY;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.22 + targetRotation.current.x,
      0.045
    );

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.045
    );

    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      driftZ,
      0.025
    );
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <ShapeGeometry shape={shape} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>

      <mesh scale={1.42}>
        <ShapeGeometry shape={shape} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      <mesh rotation={[0.45, 0.2, 0.1]} scale={0.58}>
        <ShapeGeometry shape={shape} />
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

export default function MiniSpatialObject({
  shape = "cube",
  interactive = true,
  className = "pointer-events-none absolute right-[40px] top-[55%] hidden h-[400px] w-[400px] -translate-y-1/2 opacity-55 lg:block xl:right-[120px]",
}: MiniSpatialObjectProps) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="absolute inset-0 rounded-full bg-white/[0.035] blur-3xl" />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        className="relative z-10"
      >
        <WireStructure shape={shape} interactive={interactive} />
      </Canvas>
    </div>
  );
}