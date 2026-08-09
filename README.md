# Momentum — AI-Powered Habit Tracker

> Build consistency, visualize progress, and get personalized coaching from Google Gemini.

## Tech Stack

| Layer     | Choice                                                         |
|-----------|----------------------------------------------------------------|
| Frontend  | React 18 (Vite), React Router v6, TanStack Query, Zustand     |
| Styling   | Tailwind CSS v4, CSS Custom Properties, Framer Motion          |
| Backend   | Node.js + Express 4                                            |
| Database  | MongoDB Atlas + Mongoose                                       |
| Auth      | JWT (access + refresh tokens), bcrypt                          |
| AI        | Google Gemini API (`@google/generative-ai`)                    |
| Charts    | Recharts, custom SVG heatmap & progress rings                  |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas cluster (or local MongoDB)
- Google Gemini API key (for AI features)

### 1. Clone & Install

```bash
git clone <repo-url>
cd momentum

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI, JWT secrets, and Gemini API key

# Client
cp client/.env.example client/.env
# Usually no changes needed for development
```

### 3. Run in Development

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to the server on port 5000.

## Project Structure

```
momentum/
├── client/                     # React (Vite) frontend
│   ├── src/
│   │   ├── api/                # Axios instance + API functions
│   │   ├── components/
│   │   │   ├── ui/             # Button, GlassPanel, Modal, Toast
│   │   │   ├── layout/         # Navbar, BottomTabBar, AuroraBackground, ThemeToggle
│   │   │   ├── habits/         # Habit cards, forms (Phase 3+)
│   │   │   ├── heatmap/        # 90-day heatmap (Phase 5)
│   │   │   ├── charts/         # Recharts components (Phase 6)
│   │   │   └── ai/             # AI feature components (Phase 8)
│   │   ├── pages/              # Dashboard, Weekly, Insights, Statistics, Settings
│   │   ├── hooks/              # Custom hooks
│   │   ├── store/              # Zustand stores (auth, theme)
│   │   └── utils/              # Date helpers, streak calc
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── config/             # DB + Gemini client config
│   │   ├── models/             # Mongoose schemas
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # Express routers
│   │   ├── middleware/         # Auth, error handler, rate limiter
│   │   ├── services/ai/       # Gemini prompt templates
│   │   └── utils/             # asyncHandler, ApiError, ApiResponse
│   └── .env.example
│
└── README.md
```

## Build Phases

- [x] **Phase 1** — Foundations (scaffold, theme, aurora, glass components)
- [ ] **Phase 2** — Authentication
- [ ] **Phase 3** — Habit CRUD
- [ ] **Phase 4** — Daily Tracking & Streaks
- [ ] **Phase 5** — Heatmap & Weekly Grid
- [ ] **Phase 6** — Stats & Insights
- [ ] **Phase 7** — Gemini AI Integration
- [ ] **Phase 8** — AI-Powered UI
- [ ] **Phase 9** — Polish & Accessibility
- [ ] **Phase 10** — Deployment

## License

MIT
