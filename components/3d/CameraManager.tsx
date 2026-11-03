"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function CameraManager() {
  const target = useRef(new THREE.Vector3(0, 1.2, 7));

  useFrame(({ camera }) => {
    camera.position.lerp(target.current, 0.035);

    camera.lookAt(0, 0, 0);
  });

  return null;
}