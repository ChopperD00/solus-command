'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useChatStore } from '@/lib/store';
import { getModel } from '@/lib/models';

export function Header() {
  const { streamState, settings, updateSettings } = useChatStore();

  return (
    <header className="h-14 border-b border-void-300 bg-void-50/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
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
        
        <div className="h-4 w-px bg-void-400 mx-2" />
        
        <span className="text-xs text-gray-500 font-mono">
          amalgamo.us
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Streaming Status */}
        {streamState.isStreaming && streamState.activeModel && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-void-200 border border-void-300">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: getModel(streamState.activeModel).color }}
            />
            <span className="text-xs text-gray-400">
              {getModel(streamState.activeModel).name}
            </span>
          </div>
        )}

        {/* Auto-Route Toggle */}
        <button
          onClick={() => updateSettings({ autoRoute: !settings.autoRoute })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            settings.autoRoute
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-void-200 text-gray-400 border border-void-300'
          }`}
        >
          Auto-Route {settings.autoRoute ? 'ON' : 'OFF'}
        </button>

        {/* Debug Toggle */}
        <button
          onClick={() => updateSettings({ showDebug: !settings.showDebug })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            settings.showDebug
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'bg-void-200 text-gray-400 border border-void-300'
          }`}
        >
          Debug
        </button>
      </div>
    </header>
  );
}
