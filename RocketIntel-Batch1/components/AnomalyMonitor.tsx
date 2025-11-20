import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export function AnomalyMonitor() {
  const { anomalyStatus, isSimulating } = useRocketIntel();

  const getStatusIcon = (status: "nominal" | "warning" | "critical") => {
    if (status === "nominal") return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === "warning") return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = (status: "nominal" | "warning" | "critical") => {
    if (status === "nominal") return "text-green-400";
    if (status === "warning") return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBg = (status: "nominal" | "warning" | "critical") => {
    if (status === "nominal") return "bg-green-900/30 border-green-500/50";
    if (status === "warning") return "bg-yellow-900/30 border-yellow-500/50";
    return "bg-red-900/30 border-red-500/50";
  };

  if (!isSimulating) return null;

  return (
    <div className="lg:absolute lg:bottom-4 lg:right-4 lg:w-80 pointer-events-auto w-full">
      <Card className="bg-purple-950/95 border-purple-500/50 backdrop-blur-md shadow-2xl shadow-purple-500/20">
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-lg font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-green-400 rounded-full hidden md:block"></span>
              System Health
            </h2>
            <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase shadow-lg ${getStatusBg(anomalyStatus.overall)}`}>
              <span className={getStatusColor(anomalyStatus.overall)}>
                {anomalyStatus.overall}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gradient-to-br from-black/60 to-gray-900/30 p-2 rounded-lg border border-cyan-500/20 shadow-lg hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-2">
                {getStatusIcon(anomalyStatus.engine)}
                <span className="text-xs md:text-sm text-gray-300">Engine Systems</span>
              </div>
              <span className={`text-[10px] md:text-xs font-bold uppercase ${getStatusColor(anomalyStatus.engine)}`}>
                {anomalyStatus.engine}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-br from-black/60 to-gray-900/30 p-2 rounded-lg border border-cyan-500/20 shadow-lg hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-2">
                {getStatusIcon(anomalyStatus.fuel)}
                <span className="text-xs md:text-sm text-gray-300">Fuel Systems</span>
              </div>
              <span className={`text-[10px] md:text-xs font-bold uppercase ${getStatusColor(anomalyStatus.fuel)}`}>
                {anomalyStatus.fuel}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-br from-black/60 to-gray-900/30 p-2 rounded-lg border border-cyan-500/20 shadow-lg hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-2">
                {getStatusIcon(anomalyStatus.guidance)}
                <span className="text-xs md:text-sm text-gray-300">Guidance</span>
              </div>
              <span className={`text-[10px] md:text-xs font-bold uppercase ${getStatusColor(anomalyStatus.guidance)}`}>
                {anomalyStatus.guidance}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-br from-black/60 to-gray-900/30 p-2 rounded-lg border border-cyan-500/20 shadow-lg hover:border-cyan-400/40 transition-all">
              <div className="flex items-center gap-2">
                {getStatusIcon(anomalyStatus.temperature)}
                <span className="text-xs md:text-sm text-gray-300">Temperature</span>
              </div>
              <span className={`text-[10px] md:text-xs font-bold uppercase ${getStatusColor(anomalyStatus.temperature)}`}>
                {anomalyStatus.temperature}
              </span>
            </div>
          </div>

          <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gradient-to-br from-cyan-900/30 to-cyan-900/10 border border-cyan-500/40 rounded-lg shadow-lg shadow-cyan-500/10">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
              <span className="text-[10px] md:text-xs font-bold text-cyan-300 uppercase tracking-wide">AI Prediction Active</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">
              Real-time anomaly detection monitoring all systems for optimal mission success.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
