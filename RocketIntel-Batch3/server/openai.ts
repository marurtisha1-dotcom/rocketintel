import OpenAI from "openai";

// Create OpenAI client with API key from environment variables
function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is not set. " +
      "Please set it before starting the server."
    );
  }
  
  return new OpenAI({ apiKey });
}

export interface TelemetryAnalysis {
  overallRisk: "low" | "medium" | "high" | "critical";
  predictions: Array<{
    system: string;
    risk: "low" | "medium" | "high" | "critical";
    prediction: string;
    confidence: number;
  }>;
  recommendations: string[];
}

export async function analyzeTelemetry(telemetryData: {
  altitude: number;
  speed: number;
  acceleration: number;
  fuel: number;
  temperature: number;
  pressure: number;
  missionPhase: string;
  timestamp: number;
  rocketModel: string;
}): Promise<TelemetryAnalysis> {
  const client = createOpenAIClient();

  try {
    const prompt = `You are an expert aerospace engineer analyzing rocket telemetry data in real-time. 

Current telemetry data:
- Rocket Model: ${telemetryData.rocketModel}
- Mission Phase: ${telemetryData.missionPhase}
- Altitude: ${telemetryData.altitude.toFixed(0)} meters
- Speed: ${telemetryData.speed.toFixed(0)} m/s
- Acceleration: ${telemetryData.acceleration.toFixed(2)} g
- Fuel Remaining: ${telemetryData.fuel.toFixed(1)}%
- Temperature: ${telemetryData.temperature.toFixed(0)}°C
- Pressure: ${telemetryData.pressure.toFixed(1)} kPa
- Mission Time: T+${Math.floor(telemetryData.timestamp / 60)}:${Math.floor(telemetryData.timestamp % 60).toString().padStart(2, '0')}

Analyze this telemetry data and provide:
1. Overall mission risk level (low, medium, high, or critical)
2. Specific predictions for each major system (engine, fuel, guidance, temperature, structural)
3. Actionable recommendations for mission control

Return your analysis in JSON format with this structure:
{
  "overallRisk": "low|medium|high|critical",
  "predictions": [
    {
      "system": "system name",
      "risk": "low|medium|high|critical",
      "prediction": "brief prediction",
      "confidence": 0.0-1.0
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert aerospace engineer with deep knowledge of rocket propulsion, orbital mechanics, and mission safety protocols. Provide accurate, concise analysis based on telemetry data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overallRisk: analysis.overallRisk || "low",
      predictions: analysis.predictions || [],
      recommendations: analysis.recommendations || []
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw error;
  }
}
