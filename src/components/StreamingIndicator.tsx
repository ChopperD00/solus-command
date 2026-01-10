'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store';
import { MODELS } from '@/lib/models';
import { ModelId } from '@/types';

export function StreamingIndicator() {
  const { streamState } = useChatStore();
  const model = streamState.currentModel ? MODELS[streamState.currentModel] : MODELS.claude;

  return (
    <div className="px-4 py-6" style={{ backgroundColor: 'rgba(15, 15, 20, 0.3)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Model indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: `${model.color}15`,
              color: model.color,
              borderColor: `${model.color}30`,
              borderWidth: '1px',
            }}
         >
            <span 
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: model.color }}
            />
            <span>{model.name}</span>
          </span>
          <span className="text-xs text-gray-500">is typing...</span>
        </div>

        {/* Partial content */}
        {streamState.partialContent && (
          <p className="text-gray-200 whitespace-pre-wrap">
            {streamState.partialContent}
            <motion.span
              className="inline-block w-2 h-4 ml-0.5 bg-current"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </p>
        )}

        {/* Loading dots if no content yet */}
        {!streamState.partialContent && (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: model.color }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
