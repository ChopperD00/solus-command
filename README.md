# Solus Command

**Multi-Model AI Command Center** - An intelligent chat interface that auto-routes requests to the optimal AI model.

![Solus Command](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## Features

- **🧠 Auto-Routing**: Claude analyzes intent and routes to the best model
- **⚡ Real-time Streaming**: SSE-based responses with live updates
- **🎨 7 Integrated Models**: Claude, Gemini, Perplexity, Krea, Runway, ElevenLabs, HeyGen
- **🌑 Void Dark Theme**: Command center aesthetic with model-specific accents
- **🔍 Intent Debug Panel**: Visualize routing decisions in real-time

## Models

| Model | Provider | Category | Status |
|-------|----------|----------|--------|
| Claude | Anthropic | Text | ✅ Active |
| Gemini | Google | Text | ✅ Active |
| Perplexity | Perplexity AI | Search | ✅ Active |
| Krea | Krea AI | Image | 🔜 Coming |
| Runway | Runway ML | Video | 🔜 Coming |
| ElevenLabs | ElevenLabs | Voice | 🔜 Coming |
| HeyGen | HeyGen | Avatar | 🔜 Coming |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/solus-command.git
cd solus-command

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting.

## Environment Variables

Create a `.env.local` file with:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
PERPLEXITY_API_KEY=pplx-...

# Optional (for media generation)
KREA_API_KEY=
RUNWAY_API_KEY=
ELEVENLABS_API_KEY=
HEYGEN_API_KEY=
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **State**: Zustand 5
- **Animation**: Framer Motion 11
- **Markdown**: React Markdown

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts         # Multi-model chat + streaming
│   │   └── generate/             # Media generation endpoints
│   ├── globals.css               # Theme + custom styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── Header.tsx                # Navigation + controls
│   ├── Sidebar.tsx               # Conversation list
│   ├── ChatArea.tsx              # Chat container
│   ├── ChatInput.tsx             # Input + streaming handler
│   ├── MessageList.tsx           # Message display
│   ├── Message.tsx               # Individual message
│   ├── ModelIndicator.tsx        # Model badges
│   ├── StreamingIndicator.tsx    # Typing animation
│   └── IntentDebug.tsx           # Routing debug panel
├── lib/
│   ├── models.ts                 # Model configs + routing
│   └── store.ts                  # Zustand state
└── types/
    └── index.ts                  # TypeScript definitions
```

## Intent Classification

Solus Command uses Claude to classify user intent:

- `conversation` → Claude
- `research` → Perplexity (web search + citations)
- `coding` → Claude
- `image_generation` → Krea
- `video_generation` → Runway
- `voice_generation` → ElevenLabs
- `avatar_generation` → HeyGen
- `analysis` → Claude
- `creative_writing` → Claude

## License

MIT

---

Built with ☕ by [Amalgamo.us](https://amalgamo.us)
