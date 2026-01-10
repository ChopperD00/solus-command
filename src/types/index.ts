// Model Types
export type ModelId = 
  | 'claude'
  | 'gemini'
  | 'perplexity'
  | 'krea'
  | 'runway'
  | 'elevenlabs'
  | 'heygen';

export type ModelCategory = 'text' | 'image' | 'video' | 'audio' | 'avatar';

export interface ModelConfig {
  id: ModelId;
  name: string;
  provider: string;
  category: ModelCategory;
  color: string;
  description: string;
  capabilities: string[];
  isAvailable: boolean;
}

// Intent Classification
export type IntentType = 
  | 'conversation'
  | 'research'
  | 'coding'
  | 'image_generation'
  | 'video_generation'
  | 'voice_generation'
  | 'avatar_generation'
  | 'analysis'
  | 'creative_writing';

export interface IntentClassification {
  primaryIntent: IntentType;
  confidence: number;
  suggestedModel: ModelId;
  reasoning: string;
  keywords: string[];
}

// Message Types
export interface MessageMetadata {
  intent?: IntentClassification;
  processingTime?: number;
  tokenCount?: number;
}

export interface MediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  duration?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: ModelId;
  timestamp: Date;
  metadata?: MessageMetadata;
  media?: MediaContent[];
  citations?: string[];
  isStreaming?: boolean;
}

// Conversation Types
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model?: ModelId;
}

// Stream State
export interface StreamState {
  isStreaming: boolean;
  currentModel: ModelId | null;
  partialContent: string;
}

// App Settings
export interface AppSettings {
  autoRoute: boolean;
  showDebug: boolean;
  defaultModel: ModelId;
  showDebugPanel: boolean;
  streamingEnabled: boolean;
  theme: 'dark' | 'light';
}

// API Types
export interface ChatRequest {
  message: string;
  conversationId?: string;
  model?: ModelId;
  autoRoute?: boolean;
}

export interface StreamEvent {
  type: 'intent' | 'content' | 'citations' | 'done' | 'error';
  data: string | IntentClassification | string[];
}

// Store Types
export interface ChatStore {
  // State
  conversations: Conversation[];
  currentConversationId: string | null;
  streamState: StreamState;
  settings: AppSettings;
  
  // Conversation Actions
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  updateConversationTitle: (id: string, title: string) => void;
  
  // Message Actions
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  
  // Streaming Actions
  setStreaming: (isStreaming: boolean, model?: ModelId | null) => void;
  appendStreamContent: (content: string) => void;
  clearStreamContent: () => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Helpers
  getCurrentConversation: () => Conversation | null;
  getMessages: () => Message[];
}
