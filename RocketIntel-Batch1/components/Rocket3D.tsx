import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRocketIntel } from "@/lib/stores/useRocketIntel";

export function Rocket3D() {
  const rocketRef = useRef<THREE.Group>(null);
  const anomalyLightRef = useRef<THREE.PointLight>(null);
  const { selectedRocket, isSimulating, simulationTime, missionPhase, aiAnalysis, anomalyStatus } = useRocketIntel();
  const [particles, setParticles] = useState<Array<{ id: number; position: THREE.Vector3; velocity: THREE.Vector3; life: number }>>([]);
  
  const rocketColor = useMemo(() => {
    return selectedRocket?.color || "#ffffff";
  }, [selectedRocket]);

  const scale = useMemo(() => {
    if (!selectedRocket) return 1;
    return selectedRocket.height / 70;
  }, [selectedRocket]);

  // Design variations based on rocket type
  const getRocketDesign = () => {
    if (!selectedRocket) return "standard";
    
    const id = selectedRocket.id;
    if (id === "starship") return "starship";
    if (id === "falcon-heavy") return "falcon-heavy";
    if (id === "falcon-9") return "falcon9";
    if (id === "electron") return "electron";
    if (id === "vega-c") return "vega";
    if (id === "proton-m") return "proton";
    if (id === "ariane-5") return "ariane";
    if (id === "antares") return "antares";
    if (id === "minotaur-c") return "minotaur";
    if (id === "axiom-station") return "module";
    if (id === "h3") return "h3";
    if (id === "soyuz-fg") return "soyuz";
    if (id === "long-march-5") return "longmarch";
    if (id === "atlas-v") return "atlas";
    if (id === "delta-iv-heavy") return "delta";
    if (id === "new-glenn") return "newglenn";
    if (id === "vulcan-centaur") return "vulcan";
    if (id === "neutron") return "neutron";
    return "standard";
  };

  const design = getRocketDesign();

  useFrame((state) => {
    if (!rocketRef.current) return;
    
    // Enhanced particle generation for anomalies - more dramatic
    if (isSimulating && (anomalyStatus.overall === "critical" || aiAnalysis?.overallRisk === "critical")) {
      if (Math.random() > 0.75) { // More frequent particle generation
        setParticles((prev) => {
          const newParticles = [...prev];
          // Generate 5-8 particles per frame during critical anomaly
          for (let i = 0; i < (5 + Math.random() * 3); i++) {
            newParticles.push({
              id: Math.random(),
              position: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                -3.5 + Math.random() * 1.5,
                (Math.random() - 0.5) * 2
              ),
              velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.8,
                -Math.random() * 0.5,
                (Math.random() - 0.5) * 0.8
              ),
              life: 1,
            });
          }
          return newParticles.slice(-80); // Keep more particles visible
        });
      }
      // Add turbulent rocket shaking during critical anomaly
      if (anomalyStatus.engine === "critical") {
        rocketRef.current.rotation.x += (Math.random() - 0.5) * 0.02;
        rocketRef.current.rotation.z += (Math.random() - 0.5) * 0.02;
      }
    }

    // Enhanced anomaly light pulsation
    if (anomalyLightRef.current) {
      if (anomalyStatus.overall === "critical" || aiAnalysis?.overallRisk === "critical") {
        // Intense pulsing for critical
        anomalyLightRef.current.intensity = 12 + Math.sin(state.clock.elapsedTime * 8) * 5;
        anomalyLightRef.current.distance = 20;
        anomalyLightRef.current.visible = true;
      } else if (anomalyStatus.overall === "warning" || aiAnalysis?.overallRisk === "high") {
        // Moderate pulsing for warning
        anomalyLightRef.current.intensity = 6 + Math.sin(state.clock.elapsedTime * 4) * 2.5;
        anomalyLightRef.current.distance = 15;
        anomalyLightRef.current.visible = true;
      } else {
        anomalyLightRef.current.visible = false;
      }
    }
    
    if (isSimulating) {
      const time = simulationTime;
      
      if (missionPhase === "pre-launch" || missionPhase === "ignition") {
        rocketRef.current.position.y = 0;
        rocketRef.current.rotation.z = 0;
      } else if (missionPhase === "liftoff" || missionPhase === "max-q") {
        const height = Math.min(time * 2, 50);
        rocketRef.current.position.y = height;
        rocketRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
      } else if (missionPhase === "stage-separation") {
        const height = 50 + (time - 25) * 3;
        rocketRef.current.position.y = Math.min(height, 100);
        rocketRef.current.rotation.z = Math.sin(time * 0.3) * 0.03;
      } else if (missionPhase === "orbit-insertion") {
        const height = 100 + (time - 40) * 2;
        rocketRef.current.position.y = Math.min(height, 150);
        rocketRef.current.rotation.z = (time - 40) * 0.02;
      }
    } else {
      rocketRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const renderRocketDesign = () => {
    switch (design) {
      case "starship":
        return (
          <>
            {/* Starship - Massive stainless steel body */}
            <mesh castShadow position={[0, 2.5, 0]}>
              <coneGeometry args={[0.8, 2.8, 16]} />
              <meshStandardMaterial color={rocketColor} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow position={[0, -1, 0]}>
              <cylinderGeometry args={[0.8, 0.75, 9, 24]} />
              <meshStandardMaterial color={rocketColor} metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Vertical fins (flaps) */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`starship-flap-${angle}`} castShadow position={[Math.cos(angle) * 1.1, -1.5, Math.sin(angle) * 1.1]} rotation={[0, angle, Math.PI / 5]}>
                <boxGeometry args={[0.15, 3, 0.6]} />
                <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {/* Multiple Raptor engines */}
            {[{ x: -0.3, z: -0.3 }, { x: 0.3, z: -0.3 }, { x: -0.3, z: 0.3 }, { x: 0.3, z: 0.3 }].map((pos, i) => (
              <mesh key={`raptor-${i}`} castShadow position={[pos.x, -3.8, pos.z]}>
                <cylinderGeometry args={[0.25, 0.3, 0.8, 8]} />
                <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
          </>
        );

      case "falcon-heavy":
        return (
          <>
            {/* Main core */}
            <mesh castShadow position={[0, 1.5, 0]}>
              <coneGeometry args={[0.65, 2.5, 14]} />
              <meshStandardMaterial color={rocketColor} metalness={0.85} roughness={0.15} />
            </mesh>
            <mesh castShadow position={[0, -1, 0]}>
              <cylinderGeometry args={[0.65, 0.6, 8, 20]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Three MERLIN engines visible */}
            <mesh castShadow position={[0, -3.5, 0]}>
              <cylinderGeometry args={[0.4, 0.45, 0.8, 12]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Two side boosters */}
            {[-1.8, 1.8].map((x) => (
              <mesh key={`fh-booster-${x}`} castShadow position={[x, -0.5, 0]}>
                <cylinderGeometry args={[0.4, 0.38, 7, 16]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {/* Grid fins */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`fh-gridfin-${angle}`} castShadow position={[Math.cos(angle) * 1.05, -2.5, Math.sin(angle) * 1.05]} rotation={[0, angle, Math.PI / 7]}>
                <boxGeometry args={[0.2, 1.8, 0.05]} />
                <meshStandardMaterial color="#ff6600" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </>
        );

      case "falcon9":
        return (
          <>
            {/* Sleek nose cone */}
            <mesh castShadow position={[0, 3, 0]}>
              <coneGeometry args={[0.5, 2, 12]} />
              <meshStandardMaterial color={rocketColor} metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Main body with landing legs pockets */}
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.48, 6, 16]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Recessed sections for grid fins */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`f9-recess-${angle}`} castShadow position={[Math.cos(angle) * 0.65, -1.5, Math.sin(angle) * 0.65]}>
                <boxGeometry args={[0.12, 1.2, 0.08]} />
                <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.05} />
              </mesh>
            ))}
            {/* MERLIN vacuum engine */}
            <mesh castShadow position={[0, -3.2, 0]}>
              <coneGeometry args={[0.35, 1, 10]} />
              <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Landing legs outline */}
            {[45, 135, 225, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <mesh key={`f9-leg-${angle}`} castShadow position={[Math.cos(rad) * 0.8, -2.8, Math.sin(rad) * 0.8]}>
                  <boxGeometry args={[0.08, 1.5, 0.08]} />
                  <meshStandardMaterial color="#ff6600" metalness={0.7} roughness={0.3} />
                </mesh>
              );
            })}
          </>
        );

      case "electron":
        return (
          <>
            {/* Sharp pointed nose */}
            <mesh castShadow position={[0, 3.8, 0]}>
              <coneGeometry args={[0.25, 2.2, 10]} />
              <meshStandardMaterial color={rocketColor} metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Thin precision body */}
            <mesh castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.28, 0.27, 5, 14]} />
              <meshStandardMaterial color={rocketColor} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Rutherford engine (compact) */}
            <mesh castShadow position={[0, -2.8, 0]}>
              <cylinderGeometry args={[0.15, 0.18, 0.6, 8]} />
              <meshStandardMaterial color="#ff9900" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* 3 small fins */}
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle) => (
              <mesh key={`electron-fin-${angle}`} castShadow position={[Math.cos(angle) * 0.5, -2, Math.sin(angle) * 0.5]} rotation={[0, angle, Math.PI / 10]}>
                <coneGeometry args={[0.15, 1, 3]} />
                <meshStandardMaterial color="#ffcc00" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </>
        );

      case "vega":
        return (
          <>
            {/* European sleek design */}
            <mesh castShadow position={[0, 2.2, 0]}>
              <coneGeometry args={[0.42, 2, 12]} />
              <meshStandardMaterial color={rocketColor} metalness={0.88} roughness={0.12} />
            </mesh>
            {/* Solid rocket booster segments visible */}
            {[0, 1.2, 2.4].map((y) => (
              <mesh key={`vega-segment-${y}`} castShadow position={[0, -y, 0]}>
                <cylinderGeometry args={[0.42, 0.42, 0.9, 12]} />
                <meshStandardMaterial color={rocketColor} metalness={0.82} roughness={0.18} />
              </mesh>
            ))}
            {/* Segmented joints */}
            {[1.2, 2.4].map((y) => (
              <mesh key={`vega-joint-${y}`} castShadow position={[0, -y, 0]}>
                <cylinderGeometry args={[0.46, 0.46, 0.15, 12]} />
                <meshStandardMaterial color="#222222" metalness={0.95} roughness={0.05} />
              </mesh>
            ))}
            {/* Engine cluster (4 nozzles) */}
            {[{ x: -0.25, z: -0.25 }, { x: 0.25, z: -0.25 }, { x: -0.25, z: 0.25 }, { x: 0.25, z: 0.25 }].map((pos, i) => (
              <mesh key={`vega-nozzle-${i}`} castShadow position={[pos.x, -3.5, pos.z]}>
                <coneGeometry args={[0.15, 0.7, 8]} />
                <meshStandardMaterial color="#cc4400" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </>
        );

      case "proton":
        return (
          <>
            {/* Soviet robust design - large diameter */}
            <mesh castShadow position={[0, 1.2, 0]}>
              <coneGeometry args={[0.75, 2, 14]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow position={[0, -1.5, 0]}>
              <cylinderGeometry args={[0.75, 0.72, 8, 22]} />
              <meshStandardMaterial color={rocketColor} metalness={0.75} roughness={0.25} />
            </mesh>
            {/* 6 RD-0210 engines in hexagonal pattern */}
            {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle) => (
              <mesh key={`proton-engine-${angle}`} castShadow position={[Math.cos(angle) * 0.65, -3.2, Math.sin(angle) * 0.65]}>
                <cylinderGeometry args={[0.22, 0.26, 0.9, 10]} />
                <meshStandardMaterial color="#330000" metalness={0.85} roughness={0.15} />
              </mesh>
            ))}
            {/* Hexagonal fin layout */}
            {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle) => (
              <mesh key={`proton-fin-${angle}`} castShadow position={[Math.cos(angle) * 1.1, -1.2, Math.sin(angle) * 1.1]} rotation={[0, angle, Math.PI / 5]}>
                <coneGeometry args={[0.35, 1.8, 3]} />
                <meshStandardMaterial color="#ff7777" metalness={0.5} roughness={0.5} />
              </mesh>
            ))}
          </>
        );

      case "ariane":
        return (
          <>
            {/* European heavy lift */}
            <mesh castShadow position={[0, 1.8, 0]}>
              <coneGeometry args={[0.68, 2.2, 14]} />
              <meshStandardMaterial color={rocketColor} metalness={0.85} roughness={0.15} />
            </mesh>
            <mesh castShadow position={[0, -1, 0]}>
              <cylinderGeometry args={[0.68, 0.65, 7.5, 18]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Two massive solid rocket boosters */}
            {[-1.2, 1.2].map((x) => (
              <mesh key={`ariane-srb-${x}`} castShadow position={[x, 0, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 8, 16]} />
                <meshStandardMaterial color="#990000" metalness={0.75} roughness={0.25} />
              </mesh>
            ))}
            {/* SRB nozzles */}
            {[-1.2, 1.2].map((x) => (
              <mesh key={`ariane-srb-noz-${x}`} castShadow position={[x, -3.5, 0]}>
                <coneGeometry args={[0.32, 1.2, 10]} />
                <meshStandardMaterial color="#dd3333" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
            {/* Main engine nozzle (large) */}
            <mesh castShadow position={[0, -3.2, 0]}>
              <coneGeometry args={[0.35, 1, 12]} />
              <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* 4 fins */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`ariane-fin-${angle}`} castShadow position={[Math.cos(angle) * 1, -1.5, Math.sin(angle) * 1]} rotation={[0, angle, Math.PI / 6]}>
                <coneGeometry args={[0.32, 1.6, 3]} />
                <meshStandardMaterial color="#ffaa44" metalness={0.5} roughness={0.5} />
              </mesh>
            ))}
          </>
        );

      case "antares":
        return (
          <>
            {/* Cargo/resupply design */}
            <mesh castShadow position={[0, 2, 0]}>
              <coneGeometry args={[0.55, 1.8, 12]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.55, 0.52, 6, 16]} />
              <meshStandardMaterial color={rocketColor} metalness={0.75} roughness={0.25} />
            </mesh>
            {/* Twin AJ26 Engines */}
            {[-0.35, 0.35].map((x) => (
              <mesh key={`antares-engine-${x}`} castShadow position={[x, -3, 0]}>
                <cylinderGeometry args={[0.28, 0.32, 1.2, 10]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.15} />
              </mesh>
            ))}
            {/* Distinctive twin fins */}
            {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((angle) => (
              <mesh key={`antares-fin-${angle}`} castShadow position={[Math.cos(angle) * 0.85, -1.2, Math.sin(angle) * 0.85]} rotation={[0, angle, Math.PI / 7]}>
                <coneGeometry args={[0.28, 1.4, 3]} />
                <meshStandardMaterial color="#ff8844" metalness={0.5} roughness={0.5} />
              </mesh>
            ))}
          </>
        );

      case "minotaur":
        return (
          <>
            {/* Solid rocket missile-derived */}
            <mesh castShadow position={[0, 2.5, 0]}>
              <coneGeometry args={[0.45, 1.8, 10]} />
              <meshStandardMaterial color={rocketColor} metalness={0.75} roughness={0.25} />
            </mesh>
            {/* 4 solid rocket motor segments */}
            {[1.5, 0.2, -1.1, -2.4].map((y, i) => (
              <mesh key={`minotaur-srm-${i}`} castShadow position={[0, y, 0]}>
                <cylinderGeometry args={[0.45 - i * 0.03, 0.45 - i * 0.03, 1.3, 12]} />
                <meshStandardMaterial color={rocketColor} metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
            {/* Segment separations */}
            {[1.15, -0.15, -1.45].map((y) => (
              <mesh key={`minotaur-sep-${y}`} castShadow position={[0, y, 0]}>
                <cylinderGeometry args={[0.48, 0.48, 0.25, 12]} />
                <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
            {/* 4-nozzle cluster */}
            {[{ x: -0.25, z: -0.25 }, { x: 0.25, z: -0.25 }, { x: -0.25, z: 0.25 }, { x: 0.25, z: 0.25 }].map((pos, i) => (
              <mesh key={`minotaur-noz-${i}`} castShadow position={[pos.x, -3, pos.z]}>
                <coneGeometry args={[0.18, 0.8, 8]} />
                <meshStandardMaterial color="#ff5555" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </>
        );

      case "h3":
        return (
          <>
            {/* Japanese modern design */}
            <mesh castShadow position={[0, 2, 0]}>
              <coneGeometry args={[0.58, 1.9, 14]} />
              <meshStandardMaterial color={rocketColor} metalness={0.88} roughness={0.12} />
            </mesh>
            <mesh castShadow position={[0, -0.8, 0]}>
              <cylinderGeometry args={[0.58, 0.55, 7, 18]} />
              <meshStandardMaterial color={rocketColor} metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Twin SRB configuration */}
            {[-0.95, 0.95].map((x) => (
              <mesh key={`h3-srb-${x}`} castShadow position={[x, -0.5, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 6.5, 14]} />
                <meshStandardMaterial color="#770000" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {/* LE-7A main engine */}
            <mesh castShadow position={[0, -3, 0]}>
              <coneGeometry args={[0.32, 0.9, 12]} />
              <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.15} />
            </mesh>
          </>
        );

      case "soyuz":
        return (
          <>
            {/* Russian heritage design */}
            <mesh castShadow position={[0, 2.3, 0]}>
              <coneGeometry args={[0.48, 1.8, 12]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.48, 0.46, 6.5, 16]} />
              <meshStandardMaterial color={rocketColor} metalness={0.75} roughness={0.25} />
            </mesh>
            {/* 4 strap-on boosters */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`soyuz-strap-${angle}`} castShadow position={[Math.cos(angle) * 0.9, -0.5, Math.sin(angle) * 0.9]}>
                <cylinderGeometry args={[0.28, 0.28, 5, 12]} />
                <meshStandardMaterial color="#cc0000" metalness={0.75} roughness={0.25} />
              </mesh>
            ))}
            {/* 4 engines + 1 center */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`soyuz-eng-${angle}`} castShadow position={[Math.cos(angle) * 0.65, -2.8, Math.sin(angle) * 0.65]}>
                <cylinderGeometry args={[0.18, 0.22, 0.8, 8]} />
                <meshStandardMaterial color="#330000" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            <mesh castShadow position={[0, -2.8, 0]}>
              <coneGeometry args={[0.2, 0.7, 10]} />
              <meshStandardMaterial color="#330000" metalness={0.8} roughness={0.2} />
            </mesh>
          </>
        );

      case "longmarch":
        return (
          <>
            {/* Chinese heavy lift */}
            <mesh castShadow position={[0, 1.5, 0]}>
              <coneGeometry args={[0.7, 2.2, 14]} />
              <meshStandardMaterial color={rocketColor} metalness={0.82} roughness={0.18} />
            </mesh>
            <mesh castShadow position={[0, -1.2, 0]}>
              <cylinderGeometry args={[0.7, 0.67, 8, 20]} />
              <meshStandardMaterial color={rocketColor} metalness={0.78} roughness={0.22} />
            </mesh>
            {/* 4 liquid strap-ons */}
            {[45, 135, 225, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <mesh key={`lm-strapon-${angle}`} castShadow position={[Math.cos(rad) * 1.1, -0.8, Math.sin(rad) * 1.1]}>
                  <cylinderGeometry args={[0.32, 0.32, 6, 14]} />
                  <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
                </mesh>
              );
            })}
            {/* Clustered nozzles */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`lm-nozzle-${angle}`} castShadow position={[Math.cos(angle) * 0.6, -3, Math.sin(angle) * 0.6]}>
                <coneGeometry args={[0.22, 0.8, 10]} />
                <meshStandardMaterial color="#ff4444" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </>
        );

      case "atlas":
        return (
          <>
            {/* ULA Atlas V design */}
            <mesh castShadow position={[0, 2, 0]}>
              <coneGeometry args={[0.52, 1.9, 12]} />
              <meshStandardMaterial color={rocketColor} metalness={0.86} roughness={0.14} />
            </mesh>
            <mesh castShadow position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.52, 0.5, 6.8, 16]} />
              <meshStandardMaterial color={rocketColor} metalness={0.82} roughness={0.18} />
            </mesh>
            {/* Optional SRBs (4) */}
            {[45, 135, 225, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <mesh key={`atlas-srb-${angle}`} castShadow position={[Math.cos(rad) * 0.88, 0, Math.sin(rad) * 0.88]}>
                  <cylinderGeometry args={[0.25, 0.25, 5, 12]} />
                  <meshStandardMaterial color="#555555" metalness={0.75} roughness={0.25} />
                </mesh>
              );
            })}
            {/* Single RD-180 engine */}
            <mesh castShadow position={[0, -3, 0]}>
              <cylinderGeometry args={[0.35, 0.4, 1, 12]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
          </>
        );

      case "delta":
        return (
          <>
            {/* Delta IV Heavy - triple core */}
            <mesh castShadow position={[0, 1.8, 0]}>
              <coneGeometry args={[0.65, 2.1, 14]} />
              <meshStandardMaterial color={rocketColor} metalness={0.84} roughness={0.16} />
            </mesh>
            <mesh castShadow position={[0, -1, 0]}>
              <cylinderGeometry args={[0.65, 0.62, 7.5, 18]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Three cores arranged */}
            {[{ x: -0.8, z: 0 }, { x: 0.4, z: 0.7 }, { x: 0.4, z: -0.7 }].map((pos, i) => (
              <mesh key={`delta-core-${i}`} castShadow position={[pos.x, -2, pos.z]}>
                <cylinderGeometry args={[0.35, 0.35, 4, 12]} />
                <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </>
        );

      case "newglenn":
        return (
          <>
            {/* Blue Origin - massive design */}
            <mesh castShadow position={[0, 2.3, 0]}>
              <coneGeometry args={[0.85, 3, 16]} />
              <meshStandardMaterial color={rocketColor} metalness={0.88} roughness={0.12} />
            </mesh>
            <mesh castShadow position={[0, -1.5, 0]}>
              <cylinderGeometry args={[0.85, 0.8, 10, 24]} />
              <meshStandardMaterial color={rocketColor} metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Grid fin system */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`newglenn-gridfin-${angle}`} castShadow position={[Math.cos(angle) * 1.25, -2, Math.sin(angle) * 1.25]} rotation={[0, angle, Math.PI / 7]}>
                <boxGeometry args={[0.25, 2.2, 0.08]} />
                <meshStandardMaterial color="#1166ff" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
            {/* BE-4 engines cluster */}
            {[{ x: -0.35, z: -0.35 }, { x: 0.35, z: -0.35 }, { x: -0.35, z: 0.35 }, { x: 0.35, z: 0.35 }].map((pos, i) => (
              <mesh key={`newglenn-be4-${i}`} castShadow position={[pos.x, -4, pos.z]}>
                <cylinderGeometry args={[0.3, 0.35, 1, 12]} />
                <meshStandardMaterial color="#0044aa" metalness={0.85} roughness={0.15} />
              </mesh>
            ))}
          </>
        );

      case "vulcan":
        return (
          <>
            {/* ULA Vulcan Centaur */}
            <mesh castShadow position={[0, 2, 0]}>
              <coneGeometry args={[0.62, 2, 13]} />
              <meshStandardMaterial color={rocketColor} metalness={0.86} roughness={0.14} />
            </mesh>
            <mesh castShadow position={[0, -1, 0]}>
              <cylinderGeometry args={[0.62, 0.59, 7.5, 18]} />
              <meshStandardMaterial color={rocketColor} metalness={0.82} roughness={0.18} />
            </mesh>
            {/* 2 GEM 63XL boosters */}
            {[-1, 1].map((x) => (
              <mesh key={`vulcan-gem-${x}`} castShadow position={[x, 0.2, 0]}>
                <cylinderGeometry args={[0.28, 0.28, 6.5, 12]} />
                <meshStandardMaterial color="#990000" metalness={0.75} roughness={0.25} />
              </mesh>
            ))}
            {/* RS-1 engines */}
            {[-0.25, 0.25].map((x) => (
              <mesh key={`vulcan-rs1-${x}`} castShadow position={[x, -3, 0]}>
                <coneGeometry args={[0.28, 0.9, 10]} />
                <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.15} />
              </mesh>
            ))}
          </>
        );

      case "neutron":
        return (
          <>
            {/* Rocket Lab Neutron - reusable */}
            <mesh castShadow position={[0, 2.2, 0]}>
              <coneGeometry args={[0.58, 2.1, 13]} />
              <meshStandardMaterial color={rocketColor} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow position={[0, -0.8, 0]}>
              <cylinderGeometry args={[0.58, 0.55, 7, 18]} />
              <meshStandardMaterial color={rocketColor} metalness={0.87} roughness={0.13} />
            </mesh>
            {/* Reusable legs attachment points */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`neutron-leg-${angle}`} castShadow position={[Math.cos(angle) * 0.85, -2.2, Math.sin(angle) * 0.85]}>
                <boxGeometry args={[0.1, 1, 0.1]} />
                <meshStandardMaterial color="#00aa44" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {/* Dual engines */}
            {[-0.3, 0.3].map((x) => (
              <mesh key={`neutron-engine-${x}`} castShadow position={[x, -3, 0]}>
                <cylinderGeometry args={[0.26, 0.32, 0.9, 10]} />
                <meshStandardMaterial color="#112244" metalness={0.85} roughness={0.15} />
              </mesh>
            ))}
          </>
        );

      case "module":
        return (
          <>
            {/* Axiom Station Module */}
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.65, 0.65, 5.5, 18]} />
              <meshStandardMaterial color={rocketColor} metalness={0.7} roughness={0.3} />
            </mesh>
            {/* 6 Docking ports */}
            {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle) => (
              <mesh key={`module-port-${angle}`} castShadow position={[Math.cos(angle) * 0.85, Math.sin(angle * 3) * 1.2, Math.sin(angle) * 0.85]}>
                <cylinderGeometry args={[0.18, 0.18, 0.4, 10]} />
                <meshStandardMaterial color="#ffaa00" metalness={0.95} roughness={0.05} />
              </mesh>
            ))}
            {/* 4 Solar panel arrays */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`module-panel-${angle}`} castShadow position={[Math.cos(angle) * 1.4, 0.2, Math.sin(angle) * 1.4]} rotation={[Math.PI / 8, angle, 0]}>
                <boxGeometry args={[0.4, 2.2, 0.06]} />
                <meshStandardMaterial color="#1166ff" metalness={0.65} roughness={0.35} />
              </mesh>
            ))}
            {/* Heat radiators */}
            {[-0.8, 0.8].map((x) => (
              <mesh key={`module-rad-${x}`} castShadow position={[x, 0, 0]}>
                <boxGeometry args={[0.12, 0.8, 1.2]} />
                <meshStandardMaterial color="#ff6600" metalness={0.85} roughness={0.15} />
              </mesh>
            ))}
          </>
        );

      default:
        return (
          <>
            {/* Standard design fallback */}
            <mesh castShadow position={[0, 3, 0]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial color={rocketColor} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 6, 16]} />
              <meshStandardMaterial color={rocketColor} metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.52, 0.52, 1, 16]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
              <mesh key={`std-fin-${angle}`} castShadow position={[Math.cos(angle) * 0.7, -2, Math.sin(angle) * 0.7]} rotation={[0, angle, Math.PI / 6]}>
                <coneGeometry args={[0.3, 1.5, 3]} />
                <meshStandardMaterial color="#ff4444" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </>
        );
    }
  };

  return (
    <group ref={rocketRef} position={[0, 0, 0]} scale={scale}>
      <group>
        {renderRocketDesign()}

        {/* Anomaly Detection Light - Red/Amber pulsing glow */}
        <pointLight
          ref={anomalyLightRef}
          position={[0, -1, 0]}
          color={anomalyStatus.overall === "critical" ? "#ff2244" : "#ff8844"}
          intensity={0}
          distance={15}
        />

        {isSimulating && (missionPhase === "liftoff" || missionPhase === "max-q" || missionPhase === "stage-separation") && (
          <group position={[0, -3.5, 0]}>
            <pointLight color="#ff6600" intensity={5} distance={10} />
            
            <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.6, 2, 8]} />
              <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
            </mesh>
            
            <mesh position={[0, -1, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.8, 2, 8]} />
              <meshBasicMaterial color="#ffaa00" transparent opacity={0.6} />
            </mesh>
            
            <mesh position={[0, -2, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[1, 2, 8]} />
              <meshBasicMaterial color="#ffdd00" transparent opacity={0.4} />
            </mesh>
          </group>
        )}

        {/* Anomaly smoke particles */}
        {particles.map((particle) => (
          <mesh key={particle.id} position={particle.position}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial
              color={anomalyStatus.overall === "critical" ? "#ff3333" : "#ffaa00"}
              transparent
              opacity={particle.life * (anomalyStatus.overall === "critical" ? 0.6 : 0.4)}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
