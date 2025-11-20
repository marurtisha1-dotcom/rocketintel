import { useRocketIntel } from "@/lib/stores/useRocketIntel";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function MissionReportExport() {
  const { telemetryHistory, selectedRocket, missionPhase, trajectoryPoints, aiAnalysis, isSimulating } = useRocketIntel();

  const exportReport = async (format: "json" | "csv") => {
    const missionData = {
      rocket: selectedRocket,
      missionPhase,
      telemetryHistory,
      trajectoryPoints,
      aiAnalysis,
      exportedAt: new Date().toISOString()
    };

    try {
      const response = await fetch("/api/export-mission-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          missionData,
          format
        })
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mission-report-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (telemetryHistory.length === 0) return null;

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => exportReport("json")}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase text-xs"
        size="sm"
      >
        <Download className="w-3 h-3 mr-1" />
        JSON
      </Button>
      <Button
        onClick={() => exportReport("csv")}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold uppercase text-xs"
        size="sm"
      >
        <Download className="w-3 h-3 mr-1" />
        CSV
      </Button>
    </div>
  );
}
