'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store';

export function Sidebar() {
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation, 
    createConversation 
  } = useChatStore();

  return (
    <aside className="w-64 border-r flex flex-col" style={{ backgroundColor: '#0f0f14', borderColor: '#22222c' }}>
      {/* New Chat Button */}
      <div className="p-3">
        <motion.button
          onClick={() => createConversation()}
          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', color: '#d97706', borderWidth: '1px', borderColor: 'rgba(217, 119, 6, 0.3)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + New Chat
        </motion.button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">
            No conversations yet
          </p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <motion.button
                key={conv.id}
                onClick={() => setCurrentConversation(conv.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={currentConversationId === conv.id
                  ? { backgroundColor: '#22222c', color: 'white' }
                  : { color: '#9ca3af' }
                }
                whileHover={{ x: 2 }}
              >
                <div className="truncate font-medium">
                  {conv.title || 'New Conversation'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t" style={{ borderColor: '#22222c' }}>
        <div className="text-xs text-gray-500 text-center">
          Powered by Multi-Model AI
        </div>
      </div>
    </aside>
  );
}
