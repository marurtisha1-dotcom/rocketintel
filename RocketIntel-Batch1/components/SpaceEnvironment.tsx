import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SpaceEnvironment() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 200 + Math.random() * 200;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <>
      <color attach="background" args={["#000510"]} />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4488ff" />
      
      <points ref={starsRef}>
        <primitive object={starGeometry} />
        <pointsMaterial size={0.5} color="#ffffff" sizeAttenuation={true} transparent opacity={0.8} />
      </points>

      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#050515" roughness={0.8} metalness={0.2} />
      </mesh>

      <gridHelper args={[200, 40, "#663399", "#331166"]} position={[0, -4.9, 0]} />

      <mesh position={[50, 30, -100]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial color="#4488ff" emissive="#2244aa" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}
