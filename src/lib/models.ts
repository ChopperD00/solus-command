import { ModelConfig, ModelId, IntentType } from '@/types';

export const models: Record<ModelId, ModelConfig> = {
  claude: {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    category: 'text',
    color: '#d97706',
    description: 'Primary orchestrator and reasoning engine',
    capabilities: ['conversation', 'coding', 'analysis', 'creative_writing', 'research'],
    isAvailable: true,
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    category: 'text',
    color: '#3b82f6',
    description: 'Multimodal reasoning and long context',
    capabilities: ['conversation', 'analysis', 'research', 'coding'],
    isAvailable: true,
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    provider: 'Perplexity AI',
    category: 'text',
    color: '#8b5cf6',
    description: 'Real-time web search and citations',
    capabilities: ['research', 'conversation'],
    isAvailable: true,
  },
  krea: {
    id: 'krea',
    name: 'Krea',
    provider: 'Krea AI',
    category: 'image',
    color: '#ec4899',
    description: 'Image generation and enhancement',
    capabilities: ['image_generation'],
    isAvailable: true,
  },
  runway: {
    id: 'runway',
    name: 'Runway',
    provider: 'Runway ML',
    category: 'video',
    color: '#10b981',
    description: 'Video generation and editing',
    capabilities: ['video_generation'],
    isAvailable: false,
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    category: 'audio',
    color: '#06b6d4',
    description: 'Voice synthesis and cloning',
    capabilities: ['voice_generation'],
    isAvailable: false,
  },
  heygen: {
    id: 'heygen',
    name: 'HeyGen',
    provider: 'HeyGen',
    category: 'avatar',
    color: '#f43f5e',
    description: 'AI avatar video generation',
    capabilities: ['avatar_generation'],
    isAvailable: false,
  },
};

// Intent to Model mapping
export const intentModelMap: Record<IntentType, ModelId> = {
  conversation: 'claude',
  research: 'perplexity',
  coding: 'claude',
  image_generation: 'krea',
  video_generation: 'runway',
  voice_generation: 'elevenlabs',
  avatar_generation: 'heygen',
  analysis: 'claude',
  creative_writing: 'claude',
};

// Get model by ID
export function getModel(id: ModelId): ModelConfig {
  return models[id];
}

// Get all available models
export function getAvailableModels(): ModelConfig[] {
  return Object.values(models).filter(m => m.isAvailable);
}

// Get model color
export function getModelColor(id: ModelId): string {
  return models[id]?.color || '#d97706';
}

// Route intent to model
export function routeToModel(intent: IntentType): ModelId {
  const targetModel = intentModelMap[intent];
  const model = models[targetModel];
  
  // Fall back to Claude if target model is unavailable
  if (!model.isAvailable) {
    return 'claude';
  }
  
  return targetModel;
}

// Intent classification prompt for Claude
export const INTENT_CLASSIFICATION_PROMPT = `You are an intent classifier for a multi-model AI system. Analyze the user's message and classify their intent.

Available intents:
- conversation: General chat, questions, discussions
- research: Queries requiring web search, current events, citations
- coding: Programming, debugging, code review, technical implementation
- image_generation: Requests to create, generate, or edit images
- video_generation: Requests to create or edit videos
- voice_generation: Text-to-speech, voice cloning requests
- avatar_generation: AI avatar or talking head video requests
- analysis: Data analysis, document analysis, complex reasoning
- creative_writing: Stories, poetry, scripts, creative content

Respond with JSON only:
{
  "primaryIntent": "<intent_type>",
  "confidence": <0.0-1.0>,
  "suggestedModel": "<model_id>",
  "reasoning": "<brief explanation>",
  "keywords": ["<relevant>", "<keywords>"]
}`;
