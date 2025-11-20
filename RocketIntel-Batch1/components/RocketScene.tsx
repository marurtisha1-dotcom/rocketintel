import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Rocket3D } from "./Rocket3D";
import { SpaceEnvironment } from "./SpaceEnvironment";
import { TrajectoryPath } from "./TrajectoryPath";
import { LaunchSimulation } from "./LaunchSimulation";
import { CameraController } from "./CameraController";

export function RocketScene() {
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <CameraController />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={100}
        />
        
        <SpaceEnvironment />
        <Rocket3D />
        <TrajectoryPath />
        <LaunchSimulation />
      </Suspense>
    </Canvas>
  );
}
