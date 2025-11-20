import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { Card } from "@/components/ui/card";
import { Check, Circle, Clock } from "lucide-react";

export function MissionTimeline() {
  const { missionPhase, simulationTime, isSimulating } = useRocketIntel();

  if (!isSimulating) return null;

  const phases = [
    { id: "pre-launch", name: "Pre-Launch", time: "T-00:00" },
    { id: "ignition", name: "Ignition", time: "T+00:00" },
    { id: "liftoff", name: "Liftoff", time: "T+00:03" },
    { id: "max-q", name: "Max-Q", time: "T+00:10" },
    { id: "stage-separation", name: "Stage Sep", time: "T+00:25" },
    { id: "orbit-insertion", name: "Orbit Insert", time: "T+00:40" },
    { id: "completed", name: "Complete", time: "T+01:00" }
  ];

  const getCurrentPhaseIndex = () => {
    return phases.findIndex(p => p.id === missionPhase);
  };

  const currentIndex = getCurrentPhaseIndex();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="lg:absolute lg:bottom-4 lg:left-4 pointer-events-auto w-full lg:w-80">
      <Card className="bg-purple-950/95 border-purple-500/50 backdrop-blur-md shadow-2xl shadow-purple-500/20">
        <div className="p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-xs md:text-sm font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full hidden md:block"></span>
              Mission Timeline
            </h3>
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
              <span className="text-xs md:text-sm font-mono text-cyan-400 font-bold">
                T+{formatTime(simulationTime)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {phases.map((phase, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isPending = index > currentIndex;

              return (
                <div
                  key={phase.id}
                  className={`flex items-center gap-2 md:gap-3 p-2 rounded-lg transition-all shadow-lg ${
                    isCurrent
                      ? "bg-gradient-to-br from-purple-600/40 to-cyan-600/20 border border-purple-400 shadow-purple-500/30"
                      : isCompleted
                      ? "bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 shadow-green-500/10"
                      : "bg-gradient-to-br from-black/60 to-gray-900/30 border border-gray-700/30"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted && <Check className="w-4 h-4 md:w-5 md:h-5 text-green-400" />}
                    {isCurrent && <Circle className="w-4 h-4 md:w-5 md:h-5 text-purple-400 animate-pulse" />}
                    {isPending && <Circle className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`text-xs md:text-sm font-bold ${
                      isCurrent ? "text-purple-300" : isCompleted ? "text-green-300" : "text-gray-500"
                    }`}>
                      {phase.name}
                    </div>
                  </div>
                  
                  <div className={`text-[10px] md:text-xs font-mono ${
                    isCurrent ? "text-cyan-400" : isCompleted ? "text-green-400" : "text-gray-600"
                  }`}>
                    {phase.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
