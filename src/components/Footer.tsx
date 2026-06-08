import React from 'react';
import { TextMetrics, SaveStatus } from '../types';

interface FooterProps {
  metrics: TextMetrics;
  saveStatus: SaveStatus;
}

export default function Footer({ metrics, saveStatus }: FooterProps) {
  return (
    <footer className="h-10 bg-[#161B22] border-t border-[#30363D] px-4 sm:px-6 md:px-8 flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8B949E] shrink-0 select-none">
      <div className="flex items-center gap-4 sm:gap-8">
        {/* Dynamic Sync Status Glow */}
        <div className="flex items-center gap-2">
          {saveStatus === 'Saving...' ? (
            <div className="flex items-center gap-2 text-[#E2B93B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2B93B] shadow-[0_0_6px_rgba(226,185,59,0.6)] animate-pulse"></span>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#58A6FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#58A6FF] shadow-[0_0_6px_rgba(88,166,255,0.6)]"></span>
              <span>Saved ✓</span>
            </div>
          )}
        </div>

        {/* Real-time analytical details */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span>
            Words: <span className="text-[#F0F6FC] font-mono">{metrics.wordCount}</span>
          </span>
          <span>
            Chars: <span className="text-[#F0F6FC] font-mono">{metrics.charCount}</span>
          </span>
          <span>
            Lines: <span className="text-[#F0F6FC] font-mono">{metrics.lineCount}</span>
          </span>
          <span className="hidden sm:inline">
            Time: <span className="text-[#3FBB67] font-mono">{metrics.readingTime}</span>
          </span>
        </div>
      </div>

      {/* Persistence status banner */}
      <div className="flex items-center gap-2 italic opacity-50 text-[9px] sm:text-[10px]">
        {saveStatus === 'Saving...' ? 'Writing changes...' : 'Auto-save: Saved to browser'}
      </div>
    </footer>
  );
}
