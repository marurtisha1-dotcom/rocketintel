# RocketIntel - Getting Started Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

**Option A: With OpenAI API (Live AI Analysis)**
1. Get your API key from [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Open `.env` file in the root directory
3. Add your API key:
   ```
   OPENAI_API_KEY=sk-proj-your-api-key-here
   ```

**Option B: Without API Key (Demo Mode)**
The application will run in demo mode with simulated AI predictions if no API key is provided.

### 3. Start the Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173` (client) and the server on `http://localhost:5000`.

---

## Features

### 🚀 Rocket Launch Simulation
- Launch 18 different rocket models with unique 3D designs
- Real-time physics simulation with accurate acceleration, velocity, and altitude
- Anomaly detection system that triggers dramatic visual effects

### 📊 Dashboard System (Fully Responsive)

**Desktop Layout (4-column grid - All dashboards visible):**
```
[Mission Control]    [Telemetry]      [AI Analysis...............]
[Thrust Chart......]                 [Anomaly Monitor...........]
[Mission Timeline....]               [Comparison Mode...........]
```

**Tablet Layout (2-column grid with scrolling):**
- All components visible through scrolling
- Optimized touch interactions

**Mobile Layout (Single column scrollable):**
- Full-screen responsive design
- Swipe-friendly interface

### 🧠 AI Analysis Panel
- **With API Key**: Live AI-powered telemetry analysis using OpenAI GPT-5
- **Without API Key**: Smart fallback with simulated predictions based on telemetry data
- Real-time risk assessment and recommendations
- System-specific predictions (Engine, Fuel, Thermal, Structural)

### 🚨 Anomaly Detection
- Anomaly light effects during critical events
- Dynamic camera tracking following rocket altitude
- Particle effects visualization
- Real-time alerts with AI diagnosis

### 📈 Real-Time Telemetry
- Live altitude, speed, and acceleration monitoring
- Fuel consumption tracking
- Temperature and pressure monitoring
- Mission phase indicators

### 💾 Mission Report Export
- Export mission data in JSON or CSV format
- Includes complete telemetry history
- One-click download

---

## Environment Variables

### Required
- `OPENAI_API_KEY` - OpenAI API key for live AI analysis (optional, demo mode if empty)

### Optional
- `SERVER_PORT` - Server port (default: 5000)
- `SERVER_HOST` - Server host (default: 127.0.0.1)

---

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities and stores
│   │   ├── App.tsx           # Main layout
│   │   └── main.tsx          # Entry point
│   ├── index.html            # HTML template
│   └── vite.config.ts        # Vite configuration
├── server/                    # Express backend
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   ├── openai.ts             # OpenAI integration
│   └── storage.ts            # Data storage
├── shared/                    # Shared types
│   └── schema.ts             # Type definitions
├── .env                      # Environment variables (create from .env.example)
└── package.json              # Dependencies
```

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Three.js** - 3D visualization
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Vite** - Build tool

### Backend
- **Express.js** - API server
- **WebSocket** - Real-time communication
- **OpenAI API** - AI analysis
- **TypeScript** - Type safety

---

## API Endpoints

### WebSocket: `/ws`
- **Message Type**: `telemetry`
- Sends real-time telemetry data
- Receives AI analysis and recommendations

### REST: `POST /api/analyze-telemetry`
- Analyzes telemetry data
- Returns risk assessment and predictions

### REST: `POST /api/export-mission-report`
- Export mission data
- Formats: JSON, CSV
- Downloads mission report file

---

## Troubleshooting

### "Incorrect API key provided" Error
**Solution**: 
1. Verify your API key is correct in `.env`
2. The app will automatically fallback to demo mode
3. Demo mode shows simulated predictions

### Dashboard panels not visible
**Solution**:
1. Check responsive layout: desktop (lg), tablet (md), mobile (sm)
2. Zoom out if on desktop to see all panels
3. Use responsive mode in browser dev tools (F12 > responsive design)

### WebSocket connection errors
**Solution**:
1. Ensure server is running on port 5000
2. Check browser console for detailed errors
3. Verify firewall allows localhost:5000

### No AI predictions showing
**Solution**:
1. If API key is set: Check API key validity
2. If API key is empty: This is normal - demo mode is active
3. Look for blue "demo mode" indicator in AI Analysis panel

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

---

## Features Overview

### 18 Unique Rocket Models
- Falcon-9 class rockets
- Heavy-lift launch vehicles
- Commercial spacecrafts
- Each with unique 3D design and physics characteristics

### Real-Time Physics
- 10Hz simulation loop
- Realistic acceleration/velocity calculations
- Altitude-based camera tracking
- Anomaly-triggered thrust decay effects

### Professional UI/UX
- Dark aerospace theme
- Holographic glowing panels
- Breathing animations for critical values
- Smooth transitions and animations
- Fully accessible components

### Mission Control Features
- Launch/abort controls
- Phase progression
- Real-time status updates
- Emergency response options

---

## Getting Help

For issues or questions:
1. Check console for error messages
2. Review `.env` configuration
3. Verify all dependencies are installed
4. Check that server (port 5000) and client (port 5173) are running

---

## Next Steps

1. **Launch a Rocket**: Click "Launch" on the Mission Control panel
2. **Monitor Systems**: Watch telemetry update in real-time on Telemetry Dashboard
3. **View AI Analysis**: Check predictions in AI Analysis panel
4. **Export Results**: Click "Export" to download mission report
5. **Compare Models**: Use Comparison Mode to analyze multiple rocket performance

---

**Happy Launching! 🚀**
