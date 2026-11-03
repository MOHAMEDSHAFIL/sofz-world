"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import SceneManager from "./SceneManager";
import CameraManager from "./CameraManager";

type WorldCanvasProps = {
  transitionActive: boolean;
  onTransitionComplete: () => void;
};

export default function WorldCanvas({
  transitionActive,
  onTransitionComplete,
}: WorldCanvasProps) {
  const [animating, setAnimating] = useState(false);
  const switched = useRef(false);

  useEffect(() => {
    if (!transitionActive) return;

    setAnimating(true);
    switched.current = false;

    const switchTimer = setTimeout(() => {
      if (!switched.current) {
        switched.current = true;
        onTransitionComplete();
      }
    }, 520);

    const finishTimer = setTimeout(() => {
      setAnimating(false);
    }, 1100);

    return () => {
      clearTimeout(switchTimer);
      clearTimeout(finishTimer);
    };
  }, [transitionActive, onTransitionComplete]);

  return (
    <div
      className={`world-canvas ${
        animating ? "world-canvas-transition" : ""
      }`}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            position={[0, 2, 8]}
            fov={45}
          />

          <CameraManager />

          <SceneManager
            transitionActive={false}
            onTransitionComplete={() => {}}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}