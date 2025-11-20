import { useRocketIntel, ROCKET_MODELS } from "@/lib/stores/useRocketIntel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useState } from "react";
import { MissionReportExport } from "./MissionReportExport";

export function MissionControl() {
  const { 
    selectedRocket, 
    setSelectedRocket, 
    isSimulating, 
    startSimulation, 
    stopSimulation, 
    resetSimulation,
    missionPhase 
  } = useRocketIntel();
  
  const [showRocketSelect, setShowRocketSelect] = useState(true);

  const handleStart = () => {
    startSimulation();
    setShowRocketSelect(false);
  };

  const handleStop = () => {
    stopSimulation();
  };

  const handleReset = () => {
    resetSimulation();
    setShowRocketSelect(true);
  };

  return (
    <div className="space-y-5 pointer-events-auto">
      <style>{`
        @keyframes holographicGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
        }
        .holographic { animation: holographicGlow 3s ease-in-out infinite; }
      `}</style>
      <Card className="holographic bg-gradient-to-br from-purple-950/98 via-purple-900/95 to-black/95 border border-purple-500/40 backdrop-blur-md">
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-5 md:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-gradient tracking-wider">
                ROCKETINTEL
              </h1>
              <p className="text-[11px] md:text-xs text-gray-400 uppercase tracking-widest mt-2">
                Next-Gen Rocket Intelligence Platform
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-cyan-500 animate-pulse" />
            </div>
          </div>

          {!isSimulating && showRocketSelect && (
            <div className="mb-5 md:mb-6 space-y-3 max-h-64 overflow-y-auto pr-2">
              <h3 className="text-xs md:text-sm font-bold text-cyan-300 uppercase tracking-widest mb-4 flex items-center gap-2 sticky top-0 bg-black/40 py-2 px-3 rounded">
                <span className="w-1.5 h-4 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"></span>
                Select Mission Vehicle
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {ROCKET_MODELS.map((rocket) => (
                  <button
                    key={rocket.id}
                    onClick={() => setSelectedRocket(rocket)}
                    className={`text-left p-4 rounded-lg border-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                      selectedRocket?.id === rocket.id
                        ? "bg-gradient-to-br from-purple-600/50 to-cyan-600/30 border-purple-400 shadow-lg shadow-purple-500/40"
                        : "bg-black/50 border-cyan-500/40 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/30"
                    }`}
                  >
                    <div className="text-sm md:text-base font-bold text-white">{rocket.name}</div>
                    <div className="text-[10px] md:text-xs text-gray-400 mt-2">{rocket.type}</div>
                    <div className="text-[10px] md:text-xs text-cyan-300 mt-2 flex justify-between">
                      <span>Height: {rocket.height}m</span>
                      <span>Payload: {(rocket.payload / 1000).toFixed(1)}t</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!isSimulating && (
              <Button
                onClick={handleStart}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold uppercase text-xs md:text-sm shadow-lg shadow-green-500/40 transform active:scale-95 transition-all rounded-lg h-11 md:h-12"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="hidden sm:inline">Launch</span>
                <span className="sm:hidden">Go</span>
              </Button>
            )}
            
            {isSimulating && (
              <Button
                onClick={handleStop}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white font-bold uppercase text-xs md:text-sm shadow-lg shadow-yellow-500/40 transform active:scale-95 transition-all rounded-lg h-11 md:h-12"
              >
                <Pause className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold uppercase text-xs md:text-sm shadow-lg shadow-red-500/40 transform active:scale-95 transition-all px-4 md:px-5 rounded-lg h-11 md:h-12"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>

          {missionPhase === "completed" && (
            <div className="mt-5 holographic p-4 md:p-5 bg-gradient-to-r from-green-900/40 to-emerald-900/30 border border-green-500/50 rounded-lg">
              <div className="text-sm md:text-base font-bold text-green-400 uppercase mb-2 tracking-wide">
                ✓ Mission Successful!
              </div>
              <p className="text-xs md:text-sm text-gray-300 mb-4">
                Orbit insertion achieved. All systems nominal.
              </p>
              <MissionReportExport />
            </div>
          )}
          
          {!isSimulating && missionPhase !== "pre-launch" && (
            <div className="mt-5">
              <MissionReportExport />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
