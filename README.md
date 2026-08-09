# AI-Tracker — AI-Powered Habit Tracker 🚀

> Build consistency, visualize progress, and get personalized coaching from Google Gemini.

---

## 🏗️ Technical Stack

| Layer | Choice |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, TanStack Query, Zustand |
| **Styling** | Tailwind CSS v4, CSS Custom Properties, Framer Motion |
| **Backend** | Node.js + Express 4 |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT (access + refresh tokens), cookie-parser, bcrypt |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Charts** | Recharts, custom SVG heatmap & progress rings |

---

## 🎯 Rebranded Features & Layout
- **Vertical Sidebar**: Refactored desktop header into a left-side vertical sidebar (`Navbar.jsx`) with layout margins.
- **Gym & Professional Logo**: Merged purple Briefcase (work productivity) overlaying an amber Dumbbell (gym/fitness).
- **Daily motivate**: Cached morning inspiration quotes.
- **AI Coach Q&A**: Floating interactive chat widgets.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas cluster (or local MongoDB)
- Google Gemini API key (for AI features)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/madhusaicharan/ai-habit-tracker.git
cd ai-habit-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Create a `.env` file inside `/backend` (copied from `backend/.env.example`):
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `/frontend` (copied from `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run in Development

```bash
# Terminal 1: Start backend Express API server
cd backend
npm run dev

# Terminal 2: Start frontend React dev server
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend server on port `5000`.

---

## 📂 Project Structure

```
ai-habit-tracker/
├── frontend/                   # React (Vite) frontend (formerly client/)
│   ├── src/
│   │   ├── api/                # Axios instance + API functions
│   │   ├── components/
│   │   │   ├── ui/             # Button, GlassPanel, Modal, Toast
│   │   │   ├── layout/         # Navbar (Sidebar), BottomTabBar, AuroraBackground
│   │   │   ├── habits/         # Habit cards, forms
│   │   │   ├── heatmap/        # 90-day heatmap
│   │   │   ├── charts/         # Recharts components
│   │   │   └── ai/             # AI suggestions, reports, chat widgets
│   │   ├── pages/              # Dashboard, WeeklyGrid, Insights, Statistics, Settings
│   │   ├── hooks/              # Custom hooks (useAI, useHabits, useStats)
│   │   ├── store/              # Zustand stores
│   │   └── utils/              # Date helpers
│   └── .env.example
│
├── backend/                    # Express API backend (formerly server/)
│   ├── src/
│   │   ├── config/             # DB + Gemini config
│   │   ├── models/             # Mongoose schemas
│   │   ├── controllers/        # Route controllers
│   │   ├── routes/             # Express routes
│   │   ├── middleware/         # Auth, error handler, rate limiters
│   │   ├── services/ai/       # Gemini prompts
│   │   └── utils/             # apiResponse, ApiError
│   └── .env.example
│
└── README.md
```

---

## License
MIT
