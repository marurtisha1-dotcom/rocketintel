import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { analyzeTelemetry } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === "telemetry") {
          const analysis = await analyzeTelemetry(data.telemetry);
          
          ws.send(JSON.stringify({
            type: "ai_analysis",
            analysis
          }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  app.post("/api/analyze-telemetry", async (req, res) => {
    try {
      const telemetryData = req.body;
      const analysis = await analyzeTelemetry(telemetryData);
      res.json(analysis);
    } catch (error) {
      console.error("Telemetry analysis error:", error);
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  app.post("/api/export-mission-report", async (req, res) => {
    try {
      const { missionData, format } = req.body;
      
      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="mission-report-${Date.now()}.json"`);
        res.json(missionData);
      } else if (format === "csv") {
        const csv = convertToCSV(missionData);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="mission-report-${Date.now()}.csv"`);
        res.send(csv);
      } else {
        res.status(400).json({ error: "Invalid format" });
      }
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: "Export failed" });
    }
  });

  return httpServer;
}

function convertToCSV(missionData: any): string {
  const telemetryHistory = missionData.telemetryHistory || [];
  
  if (telemetryHistory.length === 0) {
    return "timestamp,altitude,speed,acceleration,fuel,temperature,pressure\n";
  }
  
  const headers = Object.keys(telemetryHistory[0]).join(",");
  const rows = telemetryHistory.map((row: any) => 
    Object.values(row).join(",")
  ).join("\n");
  
  return `${headers}\n${rows}`;
}
