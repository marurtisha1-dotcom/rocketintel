import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import * as THREE from "three";

export function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { simulationTime, missionPhase, telemetry, isSimulating } = useRocketIntel();
  const targetPosRef = useRef(new THREE.Vector3(15, 10, 15));

  useFrame(() => {
    if (!cameraRef.current || !isSimulating) return;

    // Calculate target position based on rocket altitude
    const altitudeRatio = Math.min(telemetry.altitude / 100000, 1);
    
    // Pan up as rocket ascends
    const newY = 10 + altitudeRatio * 40;
    // Zoom out as rocket goes higher
    const zoomFactor = 1 + altitudeRatio * 2;
    const newX = 15 * zoomFactor;
    const newZ = 15 * zoomFactor;

    targetPosRef.current.set(newX, newY, newZ);
    
    // Smooth camera movement
    cameraRef.current.position.lerp(targetPosRef.current, 0.05);
    cameraRef.current.lookAt(0, telemetry.altitude / 50, 0);
  });

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[15, 10, 15]} 
      fov={50}
    />
  );
}
