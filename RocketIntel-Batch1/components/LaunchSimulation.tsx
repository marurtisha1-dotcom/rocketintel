import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { calculateAdvancedPhysics, integrateMotion } from "@/lib/advancedPhysics";

export function LaunchSimulation() {
  const { 
    isSimulating, 
    simulationTime, 
    updateSimulationTime, 
    updateTelemetry, 
    setMissionPhase,
    updateAnomalyStatus,
    addTrajectoryPoint,
    addTelemetryToHistory,
    selectedRocket,
    aiAnalysis,
    anomalyStatus
  } = useRocketIntel();
  
  const lastUpdateRef = useRef(0);
  const physicsStateRef = useRef({ altitude: 0, speed: 0, thrust: 1 });
  const anomalyTriggerTimeRef = useRef<number | null>(null);
  const thrustMultiplierRef = useRef(1); // Tracks cumulative thrust decay

  useFrame((state, delta) => {
    if (!isSimulating) return;

    const newTime = simulationTime + delta;
    updateSimulationTime(newTime);

    if (newTime - lastUpdateRef.current >= 0.1) {
      lastUpdateRef.current = newTime;
      
      if (newTime < 0.1) {
        physicsStateRef.current = { altitude: 0, speed: 0, thrust: 1 };
      }
      
      let altitude = physicsStateRef.current.altitude;
      let speed = physicsStateRef.current.speed;
      let acceleration = 0;
      let fuel = 100;
      let temperature = 20;
      let pressure = 101.3;
      let phase = "pre-launch";
      let thrustValue = 1;

      if (newTime < 3) {
        phase = "ignition";
        fuel = 100 - (newTime / 3) * 2;
        temperature = 20 + newTime * 100;
      } else if (newTime < 10) {
        phase = "liftoff";
        const t = newTime - 3;
        // Detect and trigger anomaly
        const thrustAnomaly = Math.random() > 0.92 && newTime > 5;
        if (thrustAnomaly && !anomalyTriggerTimeRef.current) {
          anomalyTriggerTimeRef.current = newTime;
        }
        // Apply thrust decay after anomaly
        if (anomalyTriggerTimeRef.current && newTime - anomalyTriggerTimeRef.current > 0.5) {
          thrustMultiplierRef.current = Math.max(0.3, thrustMultiplierRef.current - 0.05);
        }
        thrustValue = thrustMultiplierRef.current;
        altitude = t * t * 50 * thrustValue;
        speed = Math.max(0, t * 100 * thrustValue);
        acceleration = 3.5 * thrustValue;
        fuel = 98 - t * 3;
        temperature = 320 + t * 20 + (thrustAnomaly ? 80 : 0);
        pressure = 101.3 - t * 5;
        
        addTrajectoryPoint({ x: 0, y: altitude / 10, z: 0 });
      } else if (newTime < 25) {
        phase = "max-q";
        const t = newTime - 10;
        thrustValue = thrustMultiplierRef.current;
        altitude = 3500 + t * t * 100 * thrustValue;
        speed = Math.max(0, 700 + t * 200 * thrustValue);
        acceleration = 4.2 * thrustValue;
        fuel = 77 - t * 2.5;
        temperature = 460 + t * 5 + (thrustMultiplierRef.current < 0.8 ? 50 : 0);
        pressure = 51.3 - t * 2;
        
        addTrajectoryPoint({ x: t * 0.5, y: altitude / 10, z: t * 0.2 });
      } else if (newTime < 40) {
        phase = "stage-separation";
        const t = newTime - 25;
        thrustValue = thrustMultiplierRef.current;
        altitude = 25000 + t * t * 200 * thrustValue;
        speed = Math.max(0, 3700 + t * 300 * thrustValue);
        acceleration = 2.8 * thrustValue;
        fuel = 40 - t * 1.5;
        temperature = 535 - t * 10 + (thrustMultiplierRef.current < 0.8 ? 60 : 0);
        pressure = 21.3 - t * 1;
        
        addTrajectoryPoint({ x: 7.5 + t * 0.8, y: altitude / 10, z: 3 + t * 0.3 });
      } else if (newTime < 60) {
        phase = "orbit-insertion";
        const t = newTime - 40;
        thrustValue = thrustMultiplierRef.current;
        altitude = 70000 + t * t * 100 * thrustValue;
        speed = Math.max(0, 8200 + t * 150 * thrustValue);
        acceleration = 1.2 * thrustValue;
        fuel = Math.max(0, 17.5 - t * 0.8);
        temperature = 385 - t * 5 + (thrustMultiplierRef.current < 0.8 ? 40 : 0);
        pressure = Math.max(0, 6.3 - t * 0.3);
        
        addTrajectoryPoint({ x: 19.5 + t * 1.2, y: altitude / 10, z: 7.5 + t * 0.5 });
      } else {
        phase = "completed";
        altitude = 110000;
        speed = 11200;
        acceleration = 0;
        fuel = 0;
        temperature = 285;
        pressure = 0;
      }

      setMissionPhase(phase as any);
      
      const telemetryData = {
        altitude,
        speed,
        acceleration,
        fuel,
        temperature,
        pressure,
        timestamp: newTime
      };
      
      updateTelemetry(telemetryData);
      addTelemetryToHistory(telemetryData);

      let overallStatus: "nominal" | "warning" | "critical" = "nominal";
      let engineStatus: "nominal" | "warning" | "critical" = "nominal";
      let fuelStatus: "nominal" | "warning" | "critical" = "nominal";
      let guidanceStatus: "nominal" | "warning" | "critical" = "nominal";
      let tempStatus: "nominal" | "warning" | "critical" = "nominal";

      if (temperature > 500) {
        tempStatus = "warning";
        overallStatus = "warning";
      }
      if (temperature > 600) {
        tempStatus = "critical";
        overallStatus = "critical";
      }

      if (fuel < 30 && newTime < 30) {
        fuelStatus = "warning";
        if (overallStatus === "nominal") overallStatus = "warning";
      }
      if (fuel < 10 && newTime < 20) {
        fuelStatus = "critical";
        overallStatus = "critical";
      }

      if (Math.random() > 0.98 && newTime > 15 && newTime < 45) {
        guidanceStatus = "warning";
        if (overallStatus === "nominal") overallStatus = "warning";
      }

      updateAnomalyStatus({
        overall: overallStatus,
        engine: engineStatus,
        fuel: fuelStatus,
        guidance: guidanceStatus,
        temperature: tempStatus
      });
    }
  });

  return null;
}
