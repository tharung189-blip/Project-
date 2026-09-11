# AI Interview Assistant 🤖

An interactive, real-time AI-powered technical and behavioral mock interview platform built with React, Vite, and Gemini API integration.

![AI Interview Assistant](./src/assets/hero.png)

---

## 🌟 Key Features

- **Customizable Candidate Profile**: Choose role, difficulty level, experience target, interview type (System Design, Coding, Behavioral, Technical), and interview persona (Friendly, Strict, Technical Drillmaster).
- **Interactive Speech-to-Text & Voice Synthesis**: Practice speaking responses with browser speech recognition and real-time voice synthesis.
- **Code & Whiteboard Editor**: Embedded code editor with syntax support, language switching, and live code execution hints.
- **AI Persona & Adaptive Follow-ups**: Realistic interview flow with contextual feedback, dynamic follow-up questions, and hint generation.
- **Detailed Evaluation Scorecard**: Comprehensive performance breakdown covering Technical Accuracy, Communication, Problem Solving, Code Quality, and Detailed Recommendations.
- **Downloadable PDF Report**: Export full interview performance reports formatted cleanly using `jsPDF`.
- **Prompt Inspector Mode**: Peek behind the scenes to view system prompt templates and engine configuration.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **UI Components & Icons**: Lucide React, Custom Glassmorphism CSS Design System
- **Services**: Google Gemini AI Integration (`@google/genai` API protocol), Web Speech API, `jsPDF`, `canvas-confetti`
- **Linting & Tooling**: Oxlint

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tharung189-blip/Project-.git
   cd Project-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Key** (Optional for live Gemini API calls):
   Set your Google Gemini API key in the environment or directly within the settings dialog in the app.

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License

MIT License. Feel free to use and customize for your own interview preparation!
