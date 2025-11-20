# RocketIntel - Next-Generation Rocket Intelligence & Simulation Platform

## Overview

RocketIntel is a real-time rocket launch simulation and intelligence platform that combines 3D visualization with AI-powered telemetry analysis. The application provides interactive rocket simulations with live telemetry monitoring, AI-driven risk assessment, and comparison capabilities across different rocket models. Users can launch virtual rockets, monitor flight phases, analyze system health, and receive intelligent predictions about mission outcomes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

### Framework & Build System

- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Single-page application (SPA) structure with client-side rendering
- ESM (ES Modules) throughout the codebase for modern JavaScript support

### 3D Rendering & Visualization

- React Three Fiber for declarative 3D scene management using Three.js
- @react-three/drei for helper components and utilities (OrbitControls, PerspectiveCamera, Line)
- @react-three/postprocessing for visual effects
- GLSL shader support via vite-plugin-glsl for custom graphics programming
- Real-time physics simulation with custom advanced physics calculations

### State Management

- Zustand stores for global state management (useRocketIntel, useComparison)
- Local component state for UI-specific interactions
- WebSocket integration for real-time bi-directional communication with the server

### UI Component System

- Radix UI primitives for accessible, unstyled component foundations
- Tailwind CSS for utility-first styling with custom design tokens
- shadcn/ui component patterns for consistent UI/UX

### Data Flow

- TanStack Query (React Query) for server state management and caching
- Custom WebSocket client (RocketWebSocket) for real-time telemetry streaming
- Simulation loop using React Three Fiber's useFrame hook for physics updates
- Shared schema definitions between client and server for type consistency

### Backend Architecture

### Server Framework

- Express.js for HTTP server and API routing
- Development: Vite middleware mode for seamless HMR integration
- Production: Static file serving of pre-built client assets

- RESTful endpoints for mission report exports (/api/export-mission-report)
- WebSocket protocol for real-time telemetry analysis
- Error handling middleware with standardized error responses

- In-memory storage implementation (MemStorage class) for development/testing
- Database abstraction layer (IStorage interface) allows swapping storage backends
- Schema definitions in shared directory for type safety across client/server boundary

### AI Integration

- OpenAI GPT-5 integration for intelligent telemetry analysis
- Real-time risk assessment based on rocket telemetry data
- System-specific predictions (engine, fuel, guidance, temperature, structural)
- Actionable recommendations generation for mission control

### External Dependencies

### Database

- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management
- Connection string via DATABASE_URL environment variable
- Migration support through drizzle-kit

### AI Services

- OpenAI API (GPT-5 model) for telemetry analysis and predictions
- API key via OPENAI_API_KEY environment variable
- Structured JSON responses for risk levels and recommendations

### Third-Party Libraries

- Three.js ecosystem for 3D graphics
- Radix UI for accessible component primitives
- Tailwind CSS for styling
- date-fns for date manipulation
- zod for runtime validation
- nanoid for unique ID generation

### Development Tools

- TypeScript for static typing
- Replit-specific Vite plugin for runtime error overlay
- PostCSS with Tailwind and Autoprefixer
- tsx for TypeScript execution in development

###Output
<img width="1871" height="873" alt="Screenshot 2025-11-19 162215" src="https://github.com/user-attachments/assets/1d32e199-ea13-4082-b769-1b718eda4ffe" />
<img width="1877" height="864" alt="Screenshot 2025-11-19 185026" src="https://github.com/user-attachments/assets/0cd44d13-48e6-4fa6-b531-e413b0c36afb" />


