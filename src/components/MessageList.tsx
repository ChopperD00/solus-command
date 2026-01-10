'use client';

import { Message as MessageType } from '@/types';
import { Message } from './Message';
import { useChatStore } from '@/lib/store';
import { StreamingIndicator } from './StreamingIndicator';

interface MessageListProps {
  messages: MessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  const { streamState, settings } = useChatStore();

  return (
    <div className="divide-y divide-white/[0.02]">
      {messages.map((message, index) => (
        <Message 
          key={message.id} 
          message={message}
          showIntentDebug={settings.showDebugPanel}
          isLast={index === messages.length - 1}
        />
      ))}
      
      {/* Show streaming indicator */}
      {streamState.isStreaming && (
        <StreamingIndicator />
      )}
    </div>
  );
}
