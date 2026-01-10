'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store';
import { ModelId, IntentClassification, Message } from '@/types';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    currentConversationId,
    createConversation,
    addMessage,
    updateMessage,
    setStreaming,
    appendStreamContent,
    clearStreamContent,
    streamState,
  } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || streamState.isStreaming) return;

    const messageContent = input.trim();
    setInput('');

    // Ensure conversation exists
    let convId = currentConversationId;
    if (!convId) {
      convId = createConversation();
    }

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };
    addMessage(convId, userMessage);

    // Create assistant message placeholder
    const assistantMessageId = `msg_${Date.now() + 1}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      model: 'claude',
    };
    addMessage(convId, assistantMessage);

    // Start streaming
    setStreaming(true, 'claude');
    clearStreamContent();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          conversationId: convId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let fullContent = '';
      let intent: IntentClassification | undefined;
      let citations: string[] = [];
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (currentEvent === 'intent') {
                intent = data;
                setStreaming(true, data.suggestedModel as ModelId);
              } else if (currentEvent === 'content') {
                fullContent += data;
                appendStreamContent(data);
              } else if (currentEvent === 'citations') {
                citations = data;
              } else if (currentEvent === 'done') {
                // Update final message
                updateMessage(convId, assistantMessageId, {
                  content: fullContent,
                  model: intent?.suggestedModel as ModelId || 'claude',
                  citations: citations.length > 0 ? citations : undefined,
                  metadata: intent ? { intent } : undefined,
                });
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      updateMessage(convId, assistantMessageId, {
        content: 'Sorry, an error occurred. Please try again.',
      });
    } finally {
      setStreaming(false);
      clearStreamContent();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t p-4" style={{ borderColor: '#22222c', backgroundColor: '#0f0f14' }}>
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 rounded-xl border transition-colors" style={{ backgroundColor: '#14141a', borderColor: '#22222c' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Solus Command..."
            rows={1}
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none max-h-32"
            disabled={streamState.isStreaming}
          />
          
          <motion.button
            onClick={handleSubmit}
            disabled={!input.trim() || streamState.isStreaming}
            className={`m-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${!input.trim() || streamState.isStreaming ? 'cursor-not-allowed' : ''}`}
            style={{ backgroundColor: !input.trim() || streamState.isStreaming ? '#22222c' : '#d97706' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {streamState.isStreaming ? '...' : 'Send'}
          </motion.button>
        </div>
        
        <p className="text-xs text-gray-600 mt-2 text-center">
          Auto-routing enabled • Claude orchestrates your requests
        </p>
      </div>
    </div>
  );
}
