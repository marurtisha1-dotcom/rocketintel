import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// ============= TYPES =============

export interface TelemetryAnalysis {
  overallRisk: "low" | "medium" | "high" | "critical";
  predictions: Array<{
    system: string;
    risk: "low" | "medium" | "high" | "critical";
    prediction: string;
    confidence: number;
  }>;
  recommendations: string[];
}

export type MissionPhase = 
  | "pre-launch" 
  | "ignition" 
  | "liftoff" 
  | "max-q" 
  | "stage-separation" 
  | "orbit-insertion" 
  | "completed";

export interface TelemetryData {
  speed: number;
  altitude: number;
  fuel: number;
  temperature: number;
  pressure: number;
  acceleration: number;
  timestamp: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
}

export interface AnomalyStatus {
  overall: "nominal" | "warning" | "critical";
  engine: "nominal" | "warning" | "critical";
  fuel: "nominal" | "warning" | "critical";
  guidance: "nominal" | "warning" | "critical";
  temperature: "nominal" | "warning" | "critical";
}

export interface RocketModel {
  id: string;
  name: string;
  type: string;
  height: number;
  diameter: number;
  mass: number;
  payload: number;
  thrustRating: number;
  specificImpulse: number;
  fuelCapacity: number;
  color: { r: number; g: number; b: number };
  geometry: string;
  description: string;
}

interface RocketIntelState {
  // Rocket Selection
  selectedRocket: RocketModel | null;
  setSelectedRocket: (rocket: RocketModel) => void;

  // Simulation Control
  isSimulating: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;

  // Time Management
  simulationTime: number;
  updateSimulationTime: (time: number) => void;

  // Mission Phase
  missionPhase: MissionPhase;
  setMissionPhase: (phase: MissionPhase) => void;

  // Telemetry
  telemetry: TelemetryData;
  telemetryHistory: TelemetryData[];
  updateTelemetry: (data: Partial<TelemetryData>) => void;
  addTelemetryToHistory: (data: TelemetryData) => void;

  // Trajectory
  trajectoryPoints: TrajectoryPoint[];
  addTrajectoryPoint: (point: TrajectoryPoint) => void;
  clearTrajectory: () => void;

  // Anomalies
  anomalyStatus: AnomalyStatus;
  updateAnomalyStatus: (status: Partial<AnomalyStatus>) => void;

  // AI Analysis
  aiAnalysis: TelemetryAnalysis | null;
  setAIAnalysis: (analysis: TelemetryAnalysis) => void;
}

// ============= DEFAULT VALUES =============

const DEFAULT_TELEMETRY: TelemetryData = {
  speed: 0,
  altitude: 0,
  fuel: 100,
  temperature: 20,
  pressure: 101.3,
  acceleration: 0,
  timestamp: 0,
};

const DEFAULT_ANOMALY_STATUS: AnomalyStatus = {
  overall: "nominal",
  engine: "nominal",
  fuel: "nominal",
  guidance: "nominal",
  temperature: "nominal",
};

const DEFAULT_AI_ANALYSIS: TelemetryAnalysis = {
  overallRisk: "low",
  predictions: [],
  recommendations: []
};

// ============= ROCKET MODELS =============

export const ROCKET_MODELS: RocketModel[] = [
  {
    id: "falcon-9",
    name: "Falcon 9",
    type: "Orbital Launch System",
    height: 70,
    diameter: 3.7,
    mass: 549000,
    payload: 22800,
    thrustRating: 7600,
    specificImpulse: 282,
    fuelCapacity: 550000,
    color: { r: 0.15, g: 0.15, b: 0.25 },
    geometry: "falcon9",
    description: "Two-stage orbital launch system with reusable first stage"
  },
  {
    id: "starship",
    name: "Starship",
    type: "Super Heavy-Lift",
    height: 122,
    diameter: 9,
    mass: 1200000,
    payload: 150000,
    thrustRating: 33400,
    specificImpulse: 380,
    fuelCapacity: 1200000,
    color: { r: 0.8, g: 0.85, b: 0.95 },
    geometry: "starship",
    description: "Fully reusable super heavy-lift launch system"
  },
  {
    id: "sls",
    name: "SLS Block 1",
    type: "Heavy-Lift",
    height: 111,
    diameter: 8.4,
    mass: 2970000,
    payload: 70000,
    thrustRating: 34200,
    specificImpulse: 450,
    fuelCapacity: 980000,
    color: { r: 0.9, g: 0.45, b: 0.05 },
    geometry: "sls",
    description: "NASA's Space Launch System for Artemis missions"
  },
  {
    id: "ariane-6",
    name: "Ariane 6",
    type: "Medium-Heavy Lift",
    height: 80,
    diameter: 5.4,
    mass: 865000,
    payload: 10350,
    thrustRating: 12000,
    specificImpulse: 450,
    fuelCapacity: 230000,
    color: { r: 0.05, g: 0.4, b: 0.75 },
    geometry: "ariane6",
    description: "European heavy-lift launch vehicle"
  },
  {
    id: "long-march-5",
    name: "Long March 5",
    type: "Heavy-Lift",
    height: 57,
    diameter: 5,
    mass: 868000,
    payload: 25000,
    thrustRating: 12600,
    specificImpulse: 430,
    fuelCapacity: 700000,
    color: { r: 0.8, g: 0.2, b: 0.1 },
    geometry: "longmarch5",
    description: "China's heavy-lift launch vehicle"
  },
  {
    id: "atlas-v",
    name: "Atlas V",
    type: "Heavy-Lift",
    height: 58.3,
    diameter: 3.81,
    mass: 334000,
    payload: 18850,
    thrustRating: 8160,
    specificImpulse: 450,
    fuelCapacity: 190000,
    color: { r: 0.1, g: 0.3, b: 0.7 },
    geometry: "atlasv",
    description: "United Launch Alliance heavy-lift vehicle"
  },
  {
    id: "delta-iv-heavy",
    name: "Delta IV Heavy",
    type: "Heavy-Lift",
    height: 71.6,
    diameter: 5,
    mass: 733000,
    payload: 28370,
    thrustRating: 27200,
    specificImpulse: 452,
    fuelCapacity: 410000,
    color: { r: 0.15, g: 0.55, b: 0.15 },
    geometry: "delta4",
    description: "ULA's triple-core heavy-lift launcher"
  },
  {
    id: "soyuz-2",
    name: "Soyuz 2",
    type: "Medium-Lift",
    height: 46.3,
    diameter: 2.66,
    mass: 307000,
    payload: 8400,
    thrustRating: 8370,
    specificImpulse: 318,
    fuelCapacity: 87500,
    color: { r: 0.8, g: 0.2, b: 0.2 },
    geometry: "soyuz",
    description: "Russian medium-lift vehicle for crew and cargo"
  },
  {
    id: "proton-m",
    name: "Proton M",
    type: "Heavy-Lift",
    height: 58.3,
    diameter: 7.4,
    mass: 712000,
    payload: 23000,
    thrustRating: 10076,
    specificImpulse: 315,
    fuelCapacity: 311000,
    color: { r: 0.3, g: 0.2, b: 0.8 },
    geometry: "protonm",
    description: "Russian heavy-lift launch vehicle"
  },
  {
    id: "h3",
    name: "H-3",
    type: "Heavy-Lift",
    height: 63,
    diameter: 4,
    mass: 445000,
    payload: 10000,
    thrustRating: 15100,
    specificImpulse: 440,
    fuelCapacity: 240000,
    color: { r: 0.05, g: 0.15, b: 0.55 },
    geometry: "h3",
    description: "Japan's next-generation heavy-lift launcher"
  },
  {
    id: "new-glenn",
    name: "New Glenn",
    type: "Heavy-Lift",
    height: 86.6,
    diameter: 7,
    mass: 1410000,
    payload: 45000,
    thrustRating: 17010,
    specificImpulse: 465,
    fuelCapacity: 300000,
    color: { r: 0.25, g: 0.25, b: 0.35 },
    geometry: "newglenn",
    description: "Blue Origin's heavy-lift launch vehicle"
  },
  {
    id: "vulcan",
    name: "Vulcan",
    type: "Heavy-Lift",
    height: 63,
    diameter: 3.8,
    mass: 534000,
    payload: 27200,
    thrustRating: 14280,
    specificImpulse: 465,
    fuelCapacity: 195000,
    color: { r: 0.2, g: 0.4, b: 0.8 },
    geometry: "vulcan",
    description: "ULA's next-generation heavy-lift vehicle"
  },
  {
    id: "minotaur-vi",
    name: "Minotaur VI",
    type: "Medium-Lift",
    height: 86,
    diameter: 1.04,
    mass: 68000,
    payload: 5000,
    thrustRating: 1700,
    specificImpulse: 290,
    fuelCapacity: 25000,
    color: { r: 0.4, g: 0.1, b: 0.4 },
    geometry: "minotaur",
    description: "Small-to-medium lift vehicle for small satellite launches"
  },
  {
    id: "electron",
    name: "Electron",
    type: "Small-Lift",
    height: 17,
    diameter: 1.2,
    mass: 13000,
    payload: 300,
    thrustRating: 520,
    specificImpulse: 303,
    fuelCapacity: 11000,
    color: { r: 0.1, g: 0.6, b: 0.1 },
    geometry: "electron",
    description: "Small-lift launch vehicle for cubesats and small satellites"
  },
  {
    id: "pegasus-xl",
    name: "Pegasus XL",
    type: "Air-Launch",
    height: 17.6,
    diameter: 1.27,
    mass: 23130,
    payload: 443,
    thrustRating: 1223,
    specificImpulse: 285,
    fuelCapacity: 12000,
    color: { r: 0.7, g: 0.7, b: 0.05 },
    geometry: "pegasus",
    description: "Air-launched orbital launch vehicle"
  },
  {
    id: "vega-c",
    name: "Vega C",
    type: "Small-to-Medium Lift",
    height: 34.4,
    diameter: 1.575,
    mass: 137000,
    payload: 2300,
    thrustRating: 2890,
    specificImpulse: 312,
    fuelCapacity: 42000,
    color: { r: 0.05, g: 0.4, b: 0.8 },
    geometry: "vegac",
    description: "European small-to-medium lift launch vehicle"
  },
  {
    id: "relativity-os2",
    name: "Relativity OS2",
    type: "Small-Lift",
    height: 30,
    diameter: 1.6,
    mass: 24000,
    payload: 1250,
    thrustRating: 850,
    specificImpulse: 310,
    fuelCapacity: 15000,
    color: { r: 0.6, g: 0.2, b: 0.8 },
    geometry: "relativity",
    description: "3D-printed small-lift launch vehicle"
  },
];

// ============= ZUSTAND STORE =============

export const useRocketIntel = create<RocketIntelState>()(
  subscribeWithSelector((set) => ({
    // ===== INITIAL STATE =====
    selectedRocket: null,
    isSimulating: false,
    simulationTime: 0,
    missionPhase: "pre-launch",
    telemetry: DEFAULT_TELEMETRY,
    telemetryHistory: [],
    trajectoryPoints: [],
    anomalyStatus: DEFAULT_ANOMALY_STATUS,
    aiAnalysis: null,

    // ===== ROCKET SELECTION =====
    setSelectedRocket: (rocket) =>
      set({ selectedRocket: rocket }),

    // ===== SIMULATION CONTROL =====
    startSimulation: () =>
      set({
        isSimulating: true,
        simulationTime: 0,
        missionPhase: "pre-launch",
        telemetry: DEFAULT_TELEMETRY,
        telemetryHistory: [],
        trajectoryPoints: [],
        anomalyStatus: DEFAULT_ANOMALY_STATUS,
      }),

    stopSimulation: () =>
      set({ isSimulating: false }),

    resetSimulation: () =>
      set({
        isSimulating: false,
        simulationTime: 0,
        missionPhase: "pre-launch",
        telemetry: DEFAULT_TELEMETRY,
        telemetryHistory: [],
        trajectoryPoints: [],
        anomalyStatus: DEFAULT_ANOMALY_STATUS,
        aiAnalysis: null,
      }),

    // ===== TIME MANAGEMENT =====
    updateSimulationTime: (time) =>
      set({ simulationTime: time }),

    // ===== MISSION PHASE =====
    setMissionPhase: (phase) =>
      set({ missionPhase: phase }),

    // ===== TELEMETRY =====
    updateTelemetry: (data) =>
      set((state) => ({
        telemetry: {
          ...state.telemetry,
          ...data,
        },
      })),

    addTelemetryToHistory: (data) =>
      set((state) => ({
        telemetryHistory: [...state.telemetryHistory, data],
      })),

    // ===== TRAJECTORY =====
    addTrajectoryPoint: (point) =>
      set((state) => ({
        trajectoryPoints: [...state.trajectoryPoints, point],
      })),

    clearTrajectory: () =>
      set({ trajectoryPoints: [] }),

    // ===== ANOMALIES =====
    updateAnomalyStatus: (status) =>
      set((state) => ({
        anomalyStatus: {
          ...state.anomalyStatus,
          ...status,
        },
      })),

    // ===== AI ANALYSIS =====
    setAIAnalysis: (analysis) =>
      set({ aiAnalysis: analysis }),
  }))
);
