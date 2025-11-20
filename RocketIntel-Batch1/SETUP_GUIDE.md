# RocketIntel Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- OpenAI API key (optional - will use fallback predictions if not set)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables

1. Open `.env` file in the project root
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-proj-your-api-key-here
   ```

**Where to get your API key:**
- Go to https://platform.openai.com/account/api-keys
- Create a new API key
- Copy and paste it into `.env`

> **Security Note:** The `.env` file is in `.gitignore` and will never be committed. Keep your API key safe!

### Step 3: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and API at `http://localhost:5000`

---

## ⚙️ Environment Configuration

### `.env` File (Development)
```dotenv
OPENAI_API_KEY=sk-proj-your-api-key-here
```

### Optional: Additional Configuration
If you need to customize the server:
```dotenv
SERVER_PORT=5000
SERVER_HOST=127.0.0.1
```

---

## 🎯 Features

### Dashboard Layout (Responsive)

**Desktop (1920px+):**
- All 7 dashboards visible simultaneously
- 4-column grid layout
- Real-time updates during rocket launches

**Tablet (768px - 1920px):**
- 2-column grid layout
- Scrollable dashboard panels
- Touch-friendly interface

**Mobile (<768px):**
- Single column scrollable layout
- Optimized for smaller screens
- Full functionality preserved

### Available Dashboards
1. **Mission Control** - Launch controls and mission overview
2. **Telemetry Dashboard** - Real-time flight data (altitude, speed, etc.)
3. **AI Analysis Panel** - OpenAI-powered risk assessment
4. **Thrust Chart** - Real-time engine performance visualization
5. **Anomaly Monitor** - System anomaly detection and alerts
6. **Mission Timeline** - Flight phase progression
7. **Comparison Mode** - Compare multiple rocket models
8. **3D Rocket Visualization** - Interactive 3D rocket model

---

## 🔧 API Integration

### How AI Analysis Works

**With OpenAI API Key Set:**
- Real-time telemetry analysis via GPT-5
- System-specific risk predictions (Engine, Fuel, Thermal, Structural)
- Actionable recommendations for mission control
- Confidence scores for each prediction

**Without API Key (Fallback Mode):**
- Simulated predictions based on actual telemetry data
- Real-time risk assessment using predefined logic
- All UI features remain fully functional
- Graceful error handling and clear user feedback

### API Key Validation
The system automatically:
- Checks for `OPENAI_API_KEY` in `.env`
- Falls back to simulated analysis if key is missing or invalid
- Displays helpful error messages in the UI
- Logs errors to server console for debugging

---

## 📊 Dashboard Configuration

### Screen Breakpoints
- **sm**: < 640px
- **md**: 640px - 1024px (Tablet)
- **lg**: 1024px - 1280px
- **xl**: 1280px - 1536px
- **2xl**: > 1536px (Desktop)

### Responsive Behavior
- Dashboards automatically reflow based on screen size
- All panels remain interactive and functional
- Smooth transitions between layouts
- No data loss when resizing

---

## 🛠️ Troubleshooting

### "401 Incorrect API key" Error
**Solution:** 
1. Verify your OpenAI API key is correct
2. Check `.env` file has `OPENAI_API_KEY=sk-proj-...`
3. Restart the development server
4. System will automatically use fallback predictions if key is invalid

### Dashboard Not Showing All Panels
**Solution:**
1. Check screen resolution is at least 1024px wide
2. Verify no browser zoom is applied (should be 100%)
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check browser console for JavaScript errors

### WebSocket Connection Failed
**Solution:**
1. Ensure backend server is running on port 5000
2. Check firewall isn't blocking localhost:5000
3. Verify WebSocket URL in browser DevTools
4. Restart the dev server

### Slow Performance During Launches
**Solution:**
1. Close unnecessary browser tabs
2. Disable browser extensions (ad blockers, etc.)
3. Check system memory and CPU usage
4. Try on a different browser

---

## 📈 Performance Optimization

### Recommended Settings
- **Monitor Count:** 7-8 dashboards simultaneously
- **Update Rate:** 10 Hz telemetry updates
- **Physics Simulation:** Real-time with 60 FPS target
- **AI Analysis:** Every 5 seconds during flight

### Browser Requirements
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- WebGL 2.0 support required for 3D visualization

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Rotate API keys regularly** - Update every 3 months
3. **Use environment-specific keys** - Dev, staging, production
4. **Monitor API usage** - Check OpenAI dashboard for unusual activity
5. **Clear .env from history** - If accidentally committed

---

## 📝 Logging

### Server Logs
- WebSocket connections: `WebSocket client connected/disconnected`
- AI analysis: `AI analysis error:` (if applicable)
- API errors: `Telemetry analysis error:`

### Browser Console
- Component warnings: Monitor for React errors
- Network requests: Check API calls in Network tab
- WebSocket messages: Inspect in DevTools

---

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment for Production
Create a `.env` file with production values:
```dotenv
OPENAI_API_KEY=sk-proj-production-key-here
SERVER_PORT=5000
SERVER_HOST=0.0.0.0
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server console logs for errors
3. Check browser DevTools for JavaScript errors
4. Verify `.env` file is correctly formatted

---

**Last Updated:** November 19, 2025
**Status:** ✅ All systems operational
