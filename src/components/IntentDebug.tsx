'use client';

import { useChatStore } from '@/lib/store';
import { MODELS } from '@/lib/models';
import { ModelId } from '@/types';

export function IntentDebug() {
  const { streamState, getMessages } = useChatStore();
  const messages = getMessages();
  
  // Get last assistant message with intent
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  const intent = lastAssistant?.metadata?.intent;

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Debug Panel</h3>

      {/* Current Stream State */}
      <div className="mb-6">
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Stream State</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Streaming:</span>
            <span className={streamState.isStreaming ? 'text-green-400' : 'text-gray-400'}>
              {streamState.isStreaming ? 'Active' : 'Idle'}
            </span>
          </div>
          {streamState.currentModel && (
            <div className="flex justify-between">
              <span className="text-gray-500">Model:</span>
              <span style={{ color: MODELS[streamState.currentModel]?.color }}>
                {MODELS[streamState.currentModel]?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Last Intent */}
      {intent && (
        <div className="mb-6">
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Last Intent</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Primary:</span>
              <span className="text-gray-300">{intent.primaryIntent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Confidence:</span>
              <span className="text-gray-300">{(intent.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Model:</span>
              <span style={{ color: MODELS[intent.suggestedModel as ModelId]?.color }}>
                {MODELS[intent.suggestedModel as ModelId]?.name}
              </span>
            </div>
            {intent.reasoning && (
              <div className="mt-2">
                <span className="text-gray-500 block mb-1">Reasoning:</span>
                <p className="text-xs text-gray-400">{intent.reasoning}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Legend */}
      <div>
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Available Models</h4>
        <div className="space-y-1">
          {Object.entries(MODELS).map(([id, model]) => (
            <div key={id} className="flex items-center gap-2 text-xs">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: model.color }}
              />
              <span style={{ color: model.color }}>{model.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
