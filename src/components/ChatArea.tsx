'use client';

import { useChatStore } from '@/lib/store';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { IntentDebug } from './IntentDebug';

export function ChatArea() {
  const { settings, getCurrentConversation } = useChatStore();
  const conversation = getCurrentConversation();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto">
          {conversation ? (
            <MessageList messages={conversation.messages} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold gradient-text mb-2">
                  Welcome to Solus Command
                </h2>
                <p className="text-gray-500 text-sm">
                  Start a conversation to begin
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Debug Panel */}
        {settings.showDebugPanel && (
          <div className="w-80 border-l overflow-y-auto" style={{ borderColor: '#22222c', backgroundColor: 'rgba(15, 15, 20, 0.5)' }}>
            <IntentDebug />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput />
    </div>
  );
}
