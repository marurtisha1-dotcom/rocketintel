export interface PhysicsParams {
  altitude: number;
  speed: number;
  fuel: number;
  rocketMass: number;
  thrust: number;
  time: number;
}

export interface PhysicsResult {
  altitude: number;
  speed: number;
  acceleration: number;
  temperature: number;
  pressure: number;
  drag: number;
  gravity: number;
}

const EARTH_RADIUS = 6371000;
const SEA_LEVEL_PRESSURE = 101325;
const SEA_LEVEL_DENSITY = 1.225;
const SCALE_HEIGHT = 8500;
const GRAVITATIONAL_CONSTANT = 6.674e-11;
const EARTH_MASS = 5.972e24;
const DRAG_COEFFICIENT = 0.75;
const REFERENCE_AREA = 10;

export function calculateAdvancedPhysics(params: PhysicsParams): PhysicsResult {
  const { altitude, speed, fuel, rocketMass, thrust, time } = params;

  const distance = EARTH_RADIUS + altitude;
  const gravity = (GRAVITATIONAL_CONSTANT * EARTH_MASS) / (distance * distance);
  
  const pressure = SEA_LEVEL_PRESSURE * Math.exp(-altitude / SCALE_HEIGHT);
  const density = SEA_LEVEL_DENSITY * Math.exp(-altitude / SCALE_HEIGHT);
  
  const drag = 0.5 * density * speed * speed * DRAG_COEFFICIENT * REFERENCE_AREA;
  
  const effectiveMass = rocketMass * (0.5 + fuel / 200);
  
  let netForce = 0;
  if (fuel > 0) {
    netForce = thrust - drag - (effectiveMass * gravity);
  } else {
    netForce = -drag - (effectiveMass * gravity);
  }
  
  const acceleration = netForce / effectiveMass / 9.81;
  
  let temperature = 20;
  if (altitude < 11000) {
    temperature = 15 - 0.0065 * altitude;
  } else if (altitude < 20000) {
    temperature = -56.5;
  } else if (altitude < 32000) {
    temperature = -56.5 + 0.001 * (altitude - 20000);
  } else {
    temperature = -44.5 + 0.0028 * (altitude - 32000);
  }
  
  const machNumber = speed / Math.sqrt(1.4 * 287 * (temperature + 273.15));
  const dynamicHeating = 0.5 * density * Math.pow(speed, 3) / 1000000;
  
  temperature += dynamicHeating * 10;
  
  if (machNumber > 0.8 && machNumber < 1.2) {
    temperature += 100 * (1 - Math.abs(machNumber - 1));
  }

  return {
    altitude,
    speed,
    acceleration,
    temperature,
    pressure: pressure / 1000,
    drag: drag / 1000,
    gravity
  };
}

export function integrateMotion(
  currentAltitude: number,
  currentSpeed: number,
  acceleration: number,
  deltaTime: number
): { altitude: number; speed: number } {
  const newSpeed = currentSpeed + acceleration * deltaTime * 9.81;
  const avgSpeed = (currentSpeed + newSpeed) / 2;
  const newAltitude = Math.max(0, currentAltitude + avgSpeed * deltaTime);

  return {
    altitude: newAltitude,
    speed: Math.max(0, newSpeed)
  };
}
