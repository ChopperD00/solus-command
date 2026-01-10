'use client';

import { ModelId } from '@/types';
import { MODELS } from '@/lib/models';

interface ModelIndicatorProps {
  modelId: ModelId;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function ModelIndicator({ modelId, size = 'md', showName = true }: ModelIndicatorProps) {
  const model = MODELS[modelId];
  if (!model) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
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
      {showName && <span>{model.name}</span>}
    </span>

  );
}

// Status indicator for streaming
export function ModelStatus({ modelId, isActive }: { modelId: ModelId; isActive: boolean }) {
  const model = MODELS[modelId];
  if (!model) return null;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: model.color }}
      />
      <span className="text-xs text-gray-400">{model.name}</span>
    </div>
  );
}
