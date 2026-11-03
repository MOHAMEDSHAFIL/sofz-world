"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Tulip({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: number;
  scale: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.rotation.z =
      Math.sin(t * 0.8 + position[0]) * 0.035;

    group.current.rotation.y =
      rotation + Math.sin(t * 0.25 + position[2]) * 0.025;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
    >
      {/* Stem */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 1.3, 10]} />
        <meshStandardMaterial
          color="#3f713f"
          roughness={0.8}
        />
      </mesh>

      {/* Left leaf */}
      <mesh
        position={[-0.09, 0.48, 0]}
        rotation={[0, 0, -0.5]}
      >
        <planeGeometry args={[0.2, 0.55]} />
        <meshStandardMaterial
          color="#4d8247"
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>

      {/* Right leaf */}
      <mesh
        position={[0.09, 0.62, 0]}
        rotation={[0, 0, 0.45]}
      >
        <planeGeometry args={[0.18, 0.45]} />
        <meshStandardMaterial
          color="#568b4c"
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>

      {/* Flower */}
      <group position={[0, 1.38, 0]}>
        <mesh>
          <sphereGeometry args={[0.2, 20, 14]} />
          <meshStandardMaterial
            color="#d96b91"
            roughness={0.45}
            metalness={0.02}
          />
        </mesh>

        <mesh
          position={[0, 0.05, 0]}
          scale={[0.75, 0.9, 0.75]}
        >
          <sphereGeometry args={[0.18, 20, 14]} />
          <meshStandardMaterial
            color="#ef9bb7"
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}

function Meadow() {
  const flowers = useMemo(() => {
    const result = [];

    for (let i = 0; i < 110; i++) {
      const x = (Math.random() - 0.5) * 24;
      const z = (Math.random() - 0.5) * 18;

      const distanceFromCenter =
        Math.sqrt(x * x + z * z);

      const y =
        -1.25 +
        Math.sin(x * 0.45) * 0.04 +
        Math.cos(z * 0.35) * 0.04;

      result.push({
        position: [x, y, z] as [number, number, number],
        rotation: Math.random() * Math.PI * 2,
        scale: 0.55 + Math.random() * 0.55,
        distanceFromCenter,
      });
    }

    return result;
  }, []);

  return (
    <group>
      {/* Meadow ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.35, 0]}
      >
        <planeGeometry args={[35, 28, 32, 32]} />
        <meshStandardMaterial
          color="#718d59"
          roughness={1}
        />
      </mesh>

      {flowers.map((flower, index) => (
        <Tulip
          key={index}
          position={flower.position}
          rotation={flower.rotation}
          scale={flower.scale}
        />
      ))}
    </group>
  );
}

function Petals() {
  const petals = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 22,
        Math.random() * 8 - 0.5,
        (Math.random() - 0.5) * 16,
      ] as [number, number, number],

      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],

      scale: 0.5 + Math.random() * 1.2,
    }));
  }, []);

  return (
    <group>
      {petals.map((petal, index) => (
        <Float
          key={index}
          speed={0.35 + Math.random() * 0.45}
          rotationIntensity={1.5}
          floatIntensity={0.7}
        >
          <mesh
            position={petal.position}
            rotation={petal.rotation}
            scale={petal.scale}
          >
            <planeGeometry args={[0.08, 0.16]} />

            <meshStandardMaterial
              color="#f5b5c9"
              transparent
              opacity={0.72}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function FloatingGlow() {
  return (
    <>
      <Float
        speed={0.5}
        rotationIntensity={0.15}
        floatIntensity={0.4}
      >
        <mesh position={[-4, 3, -3]}>
          <sphereGeometry args={[0.7, 24, 24]} />

          <meshBasicMaterial
            color="#ffd9e6"
            transparent
            opacity={0.08}
          />
        </mesh>
      </Float>

      <Float
        speed={0.35}
        rotationIntensity={0.1}
        floatIntensity={0.3}
      >
        <mesh position={[4, 4, -4]}>
          <sphereGeometry args={[0.9, 24, 24]} />

          <meshBasicMaterial
            color="#fff0c9"
            transparent
            opacity={0.07}
          />
        </mesh>
      </Float>
    </>
  );
}

function CinematicLight() {
  return (
    <>
      <ambientLight intensity={0.65} />

      <directionalLight
        position={[-5, 9, 4]}
        intensity={3}
        castShadow
      />

      <directionalLight
        position={[6, 4, -5]}
        intensity={1.4}
      />

      <pointLight
        position={[0, 5, 2]}
        intensity={5}
        distance={20}
      />
    </>
  );
}

type SceneManagerProps = {
  transitionActive: boolean;
  onTransitionComplete: () => void;
};

export default function SceneManager({
  transitionActive,
  onTransitionComplete,
}: SceneManagerProps) {
  return (
    <group>
      <CinematicLight />

      <fog
        attach="fog"
        args={["#d9e7dc", 10, 32]}
      />

      <Meadow />

      <Petals />

      <FloatingGlow />
    </group>
  );
}