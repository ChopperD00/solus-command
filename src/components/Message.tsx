'use client';

import { Message as MessageType, ModelId } from '@/types';
import { MODELS } from '@/lib/models';
import { ModelIndicator } from './ModelIndicator';

interface MessageProps {
  message: MessageType;
  showIntentDebug?: boolean;
  isLast?: boolean;
}

export function Message({ message, showIntentDebug, isLast }: MessageProps) {
  const isUser = message.role === 'user';
  const model = message.model ? MODELS[message.model] : null;
  const intent = message.metadata?.intent;

  return (
    <div className="px-4 py-6" style={{ backgroundColor: isUser ? '#0a0a0f' : 'rgba(15, 15, 20, 0.3)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          {isUser ? (
            <span className="text-sm font-medium text-gray-400">You</span>
          ) : (
            <ModelIndicator modelId={message.model || 'claude'} size="sm" />
          )}
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#22222c' }}>
            <p className="text-xs text-gray-500 mb-2">Sources:</p>
            <div className="space-y-1">
              {message.citations.map((citation, i) => (
                <a
                  key={i}
                  href={citation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs hover:underline truncate"
                  style={{ color: '#d97706' }}
                >
                  {citation}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Media */}
        {message.metadata?.mediaUrl && (
          <div className="mt-4">
            {message.metadata.mediaType === 'image' && (
              <img 
                src={message.metadata.mediaUrl} 
                alt="Generated content"
                className="max-w-full rounded-lg"
              />
            )}
            {message.metadata.mediaType === 'video' && (
              <video 
                src={message.metadata.mediaUrl} 
                controls 
                className="max-w-full rounded-lg"
              />
            )}
            {message.metadata.mediaType === 'audio' && (
              <audio 
                src={message.metadata.mediaUrl} 
                controls 
                className="w-full"
              />
            )}
          </div>
        )}

        {/* Intent Debug */}
        {showIntentDebug && intent && (
          <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: '#1a1a22' }}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Intent:</span>{' '}
                <span className="text-gray-300">{intent.primaryIntent}</span>
              </div>
              <div>
                <span className="text-gray-500">Confidence:</span>{' '}
                <span className="text-gray-300">{(intent.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
