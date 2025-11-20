import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { AlertTriangle } from "lucide-react";

export function AnomalyAlertBox() {
  const { anomalyStatus, aiAnalysis } = useRocketIntel();

  const isCritical = anomalyStatus.overall === "critical" || aiAnalysis?.overallRisk === "critical";
  
  // Get diagnosis message from anomaly state
  const getDiagnosis = () => {
    if (anomalyStatus.engine === "critical") return "Engine Thrust Decay Detected";
    if (anomalyStatus.temperature === "critical") return "Excessive Temperature Rise";
    if (anomalyStatus.fuel === "critical") return "Fuel System Failure";
    if (anomalyStatus.guidance === "critical") return "Guidance System Malfunction";
    return "System Anomaly Detected";
  };

  if (!isCritical) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          10% { opacity: 0.3; }
          20% { opacity: 1; }
          30% { opacity: 0.2; }
          40% { opacity: 1; }
          50% { opacity: 0.4; }
          60% { opacity: 1; }
          70% { opacity: 0.3; }
          80% { opacity: 1; }
          90% { opacity: 0.2; }
        }
        .flicker-alert { animation: flicker 0.2s infinite; }
      `}</style>

      <div className="flicker-alert bg-red-950/95 border-4 border-red-500 rounded-lg px-8 py-6 shadow-2xl shadow-red-600/80 text-center max-w-md">
        <div className="flex items-center justify-center gap-4 mb-4">
          <AlertTriangle className="w-12 h-12 text-red-400 animate-pulse" />
          <div>
            <div className="text-4xl font-black text-red-300 tracking-wider uppercase animate-pulse">
              !!! ALERT !!!
            </div>
          </div>
          <AlertTriangle className="w-12 h-12 text-red-400 animate-pulse" />
        </div>

        <div className="text-2xl font-black text-red-200 uppercase tracking-widest mb-3 animate-pulse">
          {getDiagnosis()}
        </div>

        <div className="space-y-2 text-red-100 text-lg font-bold mb-4">
          <div>System Status: <span className="text-red-300">COMPROMISED</span></div>
          <div>Mission Risk: <span className="text-red-300">CRITICAL</span></div>
          <div>Recommendation: <span className="text-red-300">IMMEDIATE ABORT</span></div>
        </div>

        {aiAnalysis && aiAnalysis.predictions && aiAnalysis.predictions.length > 0 && (
          <div className="mb-4 text-sm text-red-200 border-t border-red-500/50 pt-3">
            <p className="font-bold mb-2">AI PREDICTION:</p>
            <p className="italic">{aiAnalysis.predictions[0]?.prediction}</p>
          </div>
        )}

        <div className="text-sm text-red-200 italic">
          Execute immediate mission abort protocol • Automated systems engaged
        </div>
      </div>

      {/* Background red tint */}
      <div className="fixed inset-0 bg-red-900/20 pointer-events-none -z-10 flicker-alert" />
    </div>
  );
}
