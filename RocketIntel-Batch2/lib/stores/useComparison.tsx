import { create } from "zustand";
import { type RocketModel, type TelemetryData, type MissionPhase } from "./useRocketIntel";

interface ComparisonRocket {
  id: string;
  rocket: RocketModel;
  telemetry: TelemetryData;
  phase: MissionPhase;
  simulationTime: number;
}

interface ComparisonState {
  isComparisonMode: boolean;
  rockets: ComparisonRocket[];
  
  enableComparison: () => void;
  disableComparison: () => void;
  addRocket: (rocket: RocketModel) => void;
  removeRocket: (id: string) => void;
  updateRocketData: (id: string, data: Partial<ComparisonRocket>) => void;
  updateRocketTelemetry: (id: string, telemetry: TelemetryData, phase: MissionPhase) => void;
  clearAll: () => void;
}

export const useComparison = create<ComparisonState>((set) => ({
  isComparisonMode: false,
  rockets: [],
  
  enableComparison: () => set({ isComparisonMode: true }),
  disableComparison: () => set({ isComparisonMode: false, rockets: [] }),
  
  addRocket: (rocket) => set((state) => ({
    rockets: [...state.rockets, {
      id: `${rocket.id}-${Date.now()}`,
      rocket,
      telemetry: {
        speed: 0,
        altitude: 0,
        fuel: 100,
        temperature: 20,
        pressure: 101.3,
        acceleration: 0,
        timestamp: 0
      },
      phase: "pre-launch",
      simulationTime: 0
    }]
  })),
  
  removeRocket: (id) => set((state) => ({
    rockets: state.rockets.filter(r => r.id !== id)
  })),
  
  updateRocketData: (id, data) => set((state) => ({
    rockets: state.rockets.map(r => 
      r.id === id ? { ...r, ...data } : r
    )
  })),
  
  updateRocketTelemetry: (id, telemetry, phase) => set((state) => ({
    rockets: state.rockets.map(r => 
      r.id === id ? { ...r, telemetry, phase } : r
    )
  })),
  
  clearAll: () => set({ rockets: [] })
}));
