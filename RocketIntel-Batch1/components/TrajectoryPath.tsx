import { useMemo } from "react";
import * as THREE from "three";
import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { Line } from "@react-three/drei";

export function TrajectoryPath() {
  const { trajectoryPoints, isSimulating } = useRocketIntel();

  const points = useMemo(() => {
    if (trajectoryPoints.length < 2) return [];
    return trajectoryPoints.map(p => new THREE.Vector3(p.x, p.y, p.z));
  }, [trajectoryPoints]);

  if (!isSimulating || points.length < 2) return null;

  return (
    <Line
      points={points}
      color="#00ffff"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
}
