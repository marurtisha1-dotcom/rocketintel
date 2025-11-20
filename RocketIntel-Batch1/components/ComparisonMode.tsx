import { useComparison } from "@/lib/stores/useComparison";
import { useRocketIntel, ROCKET_MODELS } from "@/lib/stores/useRocketIntel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitCompare, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export function ComparisonMode() {
  const { isComparisonMode, enableComparison, disableComparison, addRocket, removeRocket, rockets, updateRocketTelemetry } = useComparison();
  const { telemetry, missionPhase, selectedRocket, isSimulating } = useRocketIntel();
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    if (isSimulating && selectedRocket && isComparisonMode) {
      const matchingRocket = rockets.find(r => r.rocket.id === selectedRocket.id);
      if (matchingRocket) {
        updateRocketTelemetry(matchingRocket.id, telemetry, missionPhase);
      }
    }
  }, [isSimulating, telemetry, missionPhase, selectedRocket, isComparisonMode, rockets, updateRocketTelemetry]);

  const toggleComparison = () => {
    if (isComparisonMode) {
      disableComparison();
    } else {
      enableComparison();
      setShowAddMenu(true);
    }
  };

  const handleAddRocket = (rocket: typeof ROCKET_MODELS[0]) => {
    if (rockets.length < 3) {
      addRocket(rocket);
      setShowAddMenu(false);
    }
  };

  return (
    <div className="absolute top-1/2 left-5 -translate-y-1/2 pointer-events-auto hidden lg:block">
      <style>{`
        @keyframes holographicGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
        }
        .holographic { animation: holographicGlow 3s ease-in-out infinite; }
      `}</style>
      <Card className="holographic bg-purple-950/95 border-purple-500/50 backdrop-blur-md">
        <div className="p-4 md:p-5 w-72">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">
                Comparison Mode
              </h3>
            </div>
            <Button
              onClick={toggleComparison}
              size="sm"
              className={`text-xs ${
                isComparisonMode
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isComparisonMode ? "Disable" : "Enable"}
            </Button>
          </div>

          {isComparisonMode && (
            <>
              {showAddMenu && rockets.length < 3 && (
                <div className="mb-4 space-y-3">
                  <div className="text-xs text-gray-400 uppercase mb-3">Add Rocket to Compare</div>
                  {ROCKET_MODELS.map((rocket) => (
                    <button
                      key={rocket.id}
                      onClick={() => handleAddRocket(rocket)}
                      className="w-full text-left p-3 rounded border border-cyan-500/30 hover:border-cyan-400 bg-black/40 transition-all"
                    >
                      <div className="text-sm font-bold text-white">{rocket.name}</div>
                      <div className="text-xs text-gray-400">{rocket.type}</div>
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {rockets.map((rocketData) => (
                  <div key={rocketData.id} className="p-3 bg-black/40 border border-purple-500/30 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-bold text-white">{rocketData.rocket.name}</div>
                        <div className="text-xs text-gray-400">{rocketData.phase}</div>
                      </div>
                      <button
                        onClick={() => removeRocket(rocketData.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400">Alt:</span>{" "}
                        <span className="text-cyan-300">{rocketData.telemetry.altitude.toFixed(0)}m</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Speed:</span>{" "}
                        <span className="text-cyan-300">{rocketData.telemetry.speed.toFixed(0)}m/s</span>
                      </div>
                    </div>
                  </div>
                ))}

                {rockets.length < 3 && rockets.length > 0 && (
                  <Button
                    onClick={() => setShowAddMenu(true)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold uppercase text-xs"
                    size="sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Rocket
                  </Button>
                )}
              </div>

              {rockets.length === 0 && !showAddMenu && (
                <p className="text-xs text-gray-400 text-center py-4">
                  Click "Add Rocket" to start comparing missions
                </p>
              )}
            </>
          )}

          {!isComparisonMode && (
            <p className="text-xs text-gray-400">
              Compare multiple rocket launches side-by-side to analyze performance differences.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
