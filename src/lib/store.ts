import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatStore, Conversation, Message, ModelId, StreamState, AppSettings } from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialStreamState: StreamState = {
  isStreaming: false,
  currentModel: null,
  partialContent: '',
};

const initialSettings: AppSettings = {
  autoRoute: true,
  defaultModel: 'claude',
  showDebug: false,
  showDebugPanel: false,
  streamingEnabled: true,
  theme: 'dark',
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial State
      conversations: [],
      currentConversationId: null,
      streamState: initialStreamState,
      settings: initialSettings,

      // Conversation Actions
      createConversation: () => {
        const id = generateId();
        const newConversation: Conversation = {
          id,
          title: 'New Conversation',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        
        return id;
      },

      deleteConversation: (id: string) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId: 
            state.currentConversationId === id 
              ? state.conversations[0]?.id || null 
              : state.currentConversationId,
        }));
      },

      setCurrentConversation: (id: string | null) => {
        set({ currentConversationId: id });
      },

      updateConversationTitle: (id: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: new Date() } : c
          ),
        }));
      },

      // Message Actions
      addMessage: (conversationId: string, message: Message) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: new Date(),
                  // Auto-update title from first user message
                  title: c.messages.length === 0 && message.role === 'user'
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : c.title,
                }
              : c
          ),
        }));
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                  updatedAt: new Date(),
                }
              : c
          ),
        }));
      },

      // Streaming Actions
      setStreaming: (isStreaming: boolean, model: ModelId | null = null) => {
        set((state) => ({
          streamState: {
            ...state.streamState,
            isStreaming,
            currentModel: model,
            partialContent: isStreaming ? state.streamState.partialContent : '',
          },
        }));
      },

      appendStreamContent: (content: string) => {
        set((state) => ({
          streamState: {
            ...state.streamState,
            partialContent: state.streamState.partialContent + content,
          },
        }));
      },

      clearStreamContent: () => {
        set((state) => ({
          streamState: {
            ...state.streamState,
            partialContent: '',
          },
        }));
      },

      // Settings Actions
      updateSettings: (newSettings: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // Helpers
      getCurrentConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.currentConversationId) || null;
      },

      getMessages: () => {
        const conversation = get().getCurrentConversation();
        return conversation?.messages || [];
      },
    }),
    {
      name: 'solus-command-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        settings: state.settings,
      }),
    }
  )
);
