import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { rocketWebSocket } from "@/lib/websocket";

export function AIAnalysisPanel() {
  const { aiAnalysis, telemetry, selectedRocket, missionPhase, isSimulating, setAIAnalysis } = useRocketIntel();

  useEffect(() => {
    rocketWebSocket.on("ai_analysis", (data) => {
      if (data.analysis) {
        setAIAnalysis(data.analysis);
      }
    });
  }, [setAIAnalysis]);

  useEffect(() => {
    if (isSimulating && telemetry.timestamp > 0) {
      const shouldSend = Math.floor(telemetry.timestamp) % 5 === 0 && 
                        telemetry.timestamp - Math.floor(telemetry.timestamp) < 0.5;
      
      if (shouldSend) {
        rocketWebSocket.send("telemetry", {
          telemetry: {
            ...telemetry,
            missionPhase,
            rocketModel: selectedRocket?.name || "Unknown"
          }
        });
      }
    }
  }, [isSimulating, telemetry.timestamp, missionPhase, selectedRocket]);

  if (!isSimulating || !aiAnalysis) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-orange-400";
      case "critical": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-900/30 border-green-500/50";
      case "medium": return "bg-yellow-900/30 border-yellow-500/50";
      case "high": return "bg-orange-900/30 border-orange-500/50";
      case "critical": return "bg-red-900/30 border-red-500/50";
      default: return "bg-gray-900/30 border-gray-500/50";
    }
  };

  return (
    <div className="absolute top-1/2 right-5 -translate-y-1/2 w-96 pointer-events-auto hidden lg:block">
      <style>{`
        @keyframes holographicGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1); }
        }
        .holographic { animation: holographicGlow 3s ease-in-out infinite; }
      `}</style>
      <Card className="holographic bg-purple-950/95 border-purple-500/50 backdrop-blur-md">
        <div className="p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h2 className="text-lg font-bold text-cyan-300 uppercase tracking-wider">
                AI Analysis
              </h2>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${getRiskBg(aiAnalysis.overallRisk)}`}>
              <span className={getRiskColor(aiAnalysis.overallRisk)}>
                {aiAnalysis.overallRisk} RISK
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Predictions
            </div>
            
            {aiAnalysis.predictions?.map((pred: any, idx: number) => (
              <div key={idx} className={`p-3 rounded border ${getRiskBg(pred.risk)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase">{pred.system}</span>
                  <span className="text-xs text-gray-400">
                    {(pred.confidence * 100).toFixed(0)}% conf
                  </span>
                </div>
                <p className="text-xs text-gray-300">{pred.prediction}</p>
              </div>
            ))}
          </div>

          {aiAnalysis.recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Recommendations
              </div>
              
              {aiAnalysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-cyan-900/20 border border-cyan-500/40 rounded">
                  <p className="text-xs text-cyan-100">{rec}</p>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-purple-500/30">
            <p className="text-xs text-gray-400 italic">
              Powered by OpenAI GPT-5 • Real-time analysis
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
