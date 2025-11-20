import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function TelemetryDashboard() {
  const { telemetry, selectedRocket, missionPhase } = useRocketIntel();

  const formatNumber = (num: number, decimals: number = 0) => {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="lg:absolute lg:top-4 lg:right-4 lg:w-80 space-y-2 pointer-events-auto w-full">
      <Card className="bg-purple-950/95 border-purple-500/50 backdrop-blur-md shadow-2xl shadow-cyan-500/20">
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h2 className="text-sm md:text-lg font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full hidden md:block"></span>
              Live Telemetry
            </h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-[10px] text-green-400 font-bold hidden sm:inline">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="bg-gradient-to-br from-black/60 to-cyan-900/20 p-2 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:border-cyan-400/50 transition-all">
              <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Altitude</div>
              <div className="text-lg md:text-xl font-mono text-cyan-300 font-bold">
                {formatNumber(telemetry.altitude, 0)}
                <span className="text-xs md:text-sm ml-1">m</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-black/60 to-cyan-900/20 p-2 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:border-cyan-400/50 transition-all">
              <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Speed</div>
              <div className="text-lg md:text-xl font-mono text-cyan-300 font-bold">
                {formatNumber(telemetry.speed, 0)}
                <span className="text-xs md:text-sm ml-1">m/s</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-black/60 to-purple-900/20 p-2 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/10 hover:border-purple-400/50 transition-all">
              <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Accel</div>
              <div className="text-lg md:text-xl font-mono text-purple-300 font-bold">
                {telemetry.acceleration.toFixed(1)}
                <span className="text-xs md:text-sm ml-1">g</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-black/60 to-orange-900/20 p-2 rounded-lg border border-orange-500/30 shadow-lg shadow-orange-500/10 hover:border-orange-400/50 transition-all">
              <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Temp</div>
              <div className="text-lg md:text-xl font-mono text-orange-300 font-bold">
                {formatNumber(telemetry.temperature, 0)}
                <span className="text-xs md:text-sm ml-1">°C</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-3 md:mt-4">
            <div className="bg-gradient-to-br from-black/60 to-blue-900/20 p-2 md:p-3 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <div className="flex justify-between text-[10px] md:text-xs mb-2">
                <span className="text-gray-400 uppercase tracking-wide">Fuel Level</span>
                <span className="text-blue-300 font-mono font-bold">{telemetry.fuel.toFixed(1)}%</span>
              </div>
              <Progress 
                value={telemetry.fuel} 
                className="h-2 bg-gray-900/50 shadow-inner"
              />
            </div>

            <div className="bg-gradient-to-br from-black/60 to-purple-900/20 p-2 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <div className="text-[10px] md:text-xs text-gray-400 uppercase mb-1 tracking-wide">Mission Phase</div>
              <div className="text-xs md:text-sm font-bold text-purple-300 uppercase tracking-wide">
                {missionPhase.replace(/-/g, ' ')}
              </div>
            </div>

            {selectedRocket && (
              <div className="bg-gradient-to-br from-black/60 to-purple-900/20 p-2 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <div className="text-[10px] md:text-xs text-gray-400 uppercase mb-1 tracking-wide">Vehicle</div>
                <div className="text-xs md:text-sm font-bold text-purple-300">
                  {selectedRocket.name}
                </div>
                <div className="text-[10px] md:text-xs text-gray-400 mt-1">
                  {selectedRocket.type}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
