# TypeRush 🚀

A sleek, responsive, full-stack typing speed test application built with **React**, **TypeScript**, **Node.js**, and **MongoDB**. TypeRush is designed to offer a dynamic, beautifully crafted typing experience complete with lifetime stats tracking, interactive achievements, global leaderboards, and a customizable space-themed UI.

---

## ✨ Features

### 🎮 Advanced Typing Engine
- **Multiple Modes**: Choose between **Time** (30s, 60s, 120s), **Words** (25, 50, 100), or **Zen** mode.
- **Customizable Options**: Toggle punctuation and numbers on or off.
- **Live Feedback**: Real-time WPM and accuracy tracking as you type, driven by a highly interactive custom typing box.

### 👤 User Profiles & Progression
- **Lifetime Stats**: The system tracks your total typing time, games played, characters typed, and average WPM across every game mode.
- **Leveling System**: Earn XP for your typing speed and accuracy. Level up as you improve!
- **Personal Bests**: View a detailed grid of your all-time high scores for every mode and category.

### 🏆 Custom Achievements
- **18 Dynamic Trophies**: Earn specific badges by hitting milestones (e.g., *Novelist* for typing 100k characters, *In The Zone* for 1hr of typing time, or the elusive *Overachiever* for unlocking all other achievements).
- **Progress Tracking**: Unlocked achievements glow with custom `lucide-react` icons, while locked ones display visual progress bars bridging the gap to your next milestone.

### � Global Leaderboard
- **Ranked Competition**: See how your scores stack up against every other player in a live global leaderboard.
- **Filterable**: Filter the leaderboard by game mode (Time / Words), duration/word count, and whether punctuation or numbers were enabled.
- **Player Profiles**: Each leaderboard entry shows the player's avatar, username, Net WPM, accuracy, and date achieved.
- **Podium Highlights**: The top 3 players receive special gold, silver, and bronze styling.

### �🎨 Visuals & Customization
- **Immersive Background**: A custom responsive Space Background constellation renderer powers the entire application aesthetics.
- **Visual Themes**: Change the visual feel of the game directly from Settings (Dark Space, Midnight, Amber Glow).
- **Typography & UI Options**: Fully adjustable font sizes, and choice of standard or block caret styles.

### ⚙️ Database Management Tool 
- Secure Admin Text Panel ( `/admin-text` ) gated behind an admin password.
- Manage the text bank seamlessly by injecting custom word packages directly into the MongoDB Database.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Routing:** React Router DOM
- **Styling:** TailwindCSS
- **State/Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose Schema Modeling)
- **Authentication:** JWT (Access & Refresh Tokens) with Bcrypt hashing
- **Language:** TypeScript

---

## 🛠️ Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas cluster)

## 📦 Installation & Setup

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Start the backend server in development mode:
```bash
npm run dev
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend-project
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running locally at `http://localhost:5173`!

---

## 📂 Project Structure

- **`backend/`**: Express.js REST API server handling user authentication, score recording, lifetime stats manipulation, and DB text storage.
- **`frontend-project/`**: React Single Page Application (SPA).
  - **`components/`**: Reusable UI parts (`Navbar`, `TypingBox`, `SpaceBackground`, etc.)
  - **`pages/`**: Primary route views (`Home`, `Profile`, `Achievements`, `Settings`, `AdminText`, etc.)
  - **`context/`**: React Context providers for global Authorization and Settings states.
