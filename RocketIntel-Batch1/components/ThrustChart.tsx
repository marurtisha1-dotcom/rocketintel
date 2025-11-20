import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { Card } from "@/components/ui/card";
import { useRef, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export function ThrustChart() {
  const { isSimulating, telemetry, selectedRocket, missionPhase, anomalyStatus } = useRocketIntel();
  const thrustHistoryRef = useRef<Array<{ time: number; thrust: number; anomaly: boolean }>>([]);

  // Calculate current thrust based on mission phase
  const calculateThrust = () => {
    if (!selectedRocket) return 0;
    if (missionPhase === "pre-launch" || missionPhase === "ignition") return 0;
    if (missionPhase === "liftoff" || missionPhase === "max-q") return selectedRocket.thrustRating * 0.8;
    if (missionPhase === "stage-separation") return selectedRocket.thrustRating * 0.5 * 0.6;
    if (missionPhase === "orbit-insertion") return selectedRocket.thrustRating * 0.5 * 0.3;
    return 0;
  };

  // Update history (keep last 60 points)
  const currentThrust = calculateThrust();
  if (isSimulating && thrustHistoryRef.current.length === 0 || thrustHistoryRef.current[thrustHistoryRef.current.length - 1]?.time !== telemetry.timestamp) {
    const hasAnomaly = anomalyStatus.overall === "critical" || anomalyStatus.engine === "critical";
    // Add anomaly dip effect
    const thrustValue = hasAnomaly && Math.random() > 0.6 ? currentThrust * (0.3 + Math.random() * 0.3) : currentThrust;
    
    thrustHistoryRef.current.push({
      time: Math.round(telemetry.timestamp * 10) / 10,
      thrust: thrustValue,
      anomaly: hasAnomaly,
    });
    
    if (thrustHistoryRef.current.length > 60) {
      thrustHistoryRef.current.shift();
    }
  }

  const data = useMemo(() => thrustHistoryRef.current, []);

  if (!isSimulating || data.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-96 pointer-events-auto hidden lg:block z-10">
      <style>{`
        @keyframes holographicGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
        }
        .holographic { animation: holographicGlow 3s ease-in-out infinite; }
        
        @keyframes dataFlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .data-motion { animation: dataFlow 2s ease-in-out infinite; }
      `}</style>
      <Card className="holographic bg-purple-950/95 border-purple-500/50 backdrop-blur-md p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest">
              Thrust Curve
            </h3>
            <div className={`text-xs font-bold uppercase px-2 py-1 rounded data-motion ${
              anomalyStatus.engine === "critical"
                ? "bg-red-900/40 text-red-300 border border-red-500/50"
                : "bg-green-900/40 text-green-300 border border-green-500/50"
            }`}>
              {currentThrust.toFixed(0)} kN
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                stroke="#888"
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                stroke="#888"
                style={{ fontSize: '10px' }}
              />
              <ReferenceLine y={0} stroke="#666" opacity={0.3} />
              
              {/* Normal thrust line with animation */}
              <Line
                type="monotone"
                dataKey="thrust"
                stroke="#00ff88"
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
                className="data-motion"
              />
              
              {/* Highlight anomaly points in red */}
              {data.filter(d => d.anomaly).map((point, idx) => (
                <ReferenceLine
                  key={idx}
                  x={point.time}
                  stroke="#ff3333"
                  opacity={0.6}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {anomalyStatus.engine === "critical" && (
            <div className="text-xs text-red-300 font-bold text-center animate-pulse data-motion">
              ⚠ ENGINE ANOMALY DETECTED - THRUST INSTABILITY
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
