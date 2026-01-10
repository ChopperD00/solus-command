'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store';
import { getModel } from '@/lib/models';

export function Header() {
  const { streamState, settings, updateSettings } = useChatStore();

  return (
    <header className="h-14 border-b backdrop-blur-sm flex items-center justify-between px-4 shrink-0" style={{ borderColor: '#22222c', backgroundColor: 'rgba(15, 15, 20, 0.8)' }}>
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-sm">S</span>
          </motion.div>
          <span className="font-display font-semibold text-lg gradient-text">
            Solus Command
          </span>
        </Link>
        
        <div className="h-4 w-px mx-2" style={{ backgroundColor: '#2c2c38' }} />
        
        <span className="text-xs text-gray-500 font-mono">
          amalgamo.us
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Streaming Status */}
        {streamState.isStreaming && streamState.currentModel && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: '#1a1a22', borderColor: '#22222c', borderWidth: '1px' }}>
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: getModel(streamState.currentModel).color }}
            />
            <span className="text-xs text-gray-400">
              {getModel(streamState.currentModel).name}
            </span>
          </div>
        )}

        {/* Auto-Route Toggle */}
        <button
          onClick={() => updateSettings({ autoRoute: !settings.autoRoute })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            settings.autoRoute
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'text-gray-400 border'
          }`}
          style={!settings.autoRoute ? { backgroundColor: '#1a1a22', borderColor: '#22222c' } : undefined}
        >
          Auto-Route {settings.autoRoute ? 'ON' : 'OFF'}
        </button>

        {/* Debug Toggle */}
        <button
          onClick={() => updateSettings({ showDebugPanel: !settings.showDebugPanel })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            settings.showDebugPanel
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'text-gray-400 border'
          }`}
          style={!settings.showDebugPanel ? { backgroundColor: '#1a1a22', borderColor: '#22222c' } : undefined}
        >
          Debug
        </button>
      </div>
    </header>
  );
}
