# Solus Command

**Amalgamo.us ChatPlayground** - Multi-model AI interface with Claude (Solus) as field general orchestrator.

## Features

- 🎯 **Auto-routing**: Claude intelligently routes requests to the optimal model
- 🤖 **7 Integrated Models**: Claude, Gemini, Perplexity, Krea, Runway, ElevenLabs, HeyGen
- 🌑 **Command Center UI**: Void dark palette with model-specific color accents
- ⚡ **Real-time Streaming**: SSE-based responses with intent classification
- 🔍 **Intent Debug Panel**: Visualize routing decisions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animations**: Framer Motion

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use Solus Command.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Multi-model chat + SSE streaming
│   │   └── generate/          # Media generation endpoints
│   ├── globals.css            # Custom fonts & effects
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── ChatArea.tsx           # Chat container
│   ├── ChatInput.tsx          # Input with streaming
│   ├── Message.tsx            # Message component
│   ├── ModelIndicator.tsx     # Model badges
│   └── ...
├── lib/
│   ├── models.ts              # Model configs & routing
│   └── store.ts               # Zustand state
└── types/
    └── index.ts               # TypeScript definitions
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `GOOGLE_AI_API_KEY` | Yes | Gemini API key |
| `PERPLEXITY_API_KEY` | Yes | Perplexity API key |
| `KREA_API_KEY` | No | Krea image generation |
| `RUNWAY_API_KEY` | No | Runway video generation |
| `ELEVENLABS_API_KEY` | No | ElevenLabs voice generation |
| `HEYGEN_API_KEY` | No | HeyGen avatar generation |

## License

MIT
