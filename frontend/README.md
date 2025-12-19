# JacPilot Frontend

Modern, gamified frontend for the JacPilot learning platform built with React, TypeScript, Vite, and Tailwind CSS.

## 🎨 Design

The frontend follows a modern, gamified design with:
- **Brand Colors**: Orange to Yellow gradient (#FF6B35 → #FFD23F)
- **Dark Theme**: Professional dark interface for the dashboard
- **Light Theme**: Clean, modern homepage design
- **Gamification**: Progress bars, achievements, interactive elements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/     # Dashboard components
│   │   └── homepage/      # Homepage components
│   ├── pages/             # Page components
│   ├── App.tsx            # Main app with routing
│   └── index.css          # Global styles with Tailwind
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## 🎯 Pages

- **Homepage** (`/`): Landing page with hero section and features
- **Dashboard** (`/dashboard`): Student dashboard with progress tracking

## 🎨 Design System

### Colors
- **Primary Gradient**: Orange (#FF6B35) to Yellow (#FFD23F)
- **Purple Accents**: #8B5CF6 for CTAs and highlights
- **Green Accents**: #10B981 for success and progress
- **Dark Theme**: #0F0F0F background, #1A1A1A cards

### Components
- Cards with rounded corners and shadows
- Gradient buttons with hover effects
- Progress bars with animations
- Interactive charts and visualizations

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations (ready to use)

## 🔌 Backend Communication

JacPilot uses **Jac Client** for all frontend-backend communication:

- **Location**: `src/services/jacClient.ts`
- **Primary Function**: `jacSpawn()` - Official Jac Client pattern
- **All walker calls** go through `jacSpawn()`:
  - Quiz generation
  - Answer evaluation
  - Progress tracking
  - Learning path recommendations
  - Skill map generation

See `docs/JAC_CLIENT_INTEGRATION.md` for complete implementation details.

## 📝 Next Steps

- [x] Connect to Jac Client for backend communication ✅
- [ ] Add Monaco Editor for code exercises
- [ ] Implement skill map visualization
- [ ] Add animations with Framer Motion
- [x] Connect to Supabase for data ✅
