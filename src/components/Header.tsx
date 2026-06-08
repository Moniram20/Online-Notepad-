import React from 'react';
import { FileText, HelpCircle, HardDrive } from 'lucide-react';

interface HeaderProps {
  onShowShortcuts: () => void;
}

export default function Header({ onShowShortcuts }: HeaderProps) {
  return (
    <header className="w-full bg-[#161B22] border-b border-[#30363D] h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 z-10 transition-colors shrink-0">
      
      {/* Left segment */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 text-white shrink-0">
          <FileText className="w-5 h-5" />
        </div>

        <div className="flex flex-col min-w-0">
          <h1 className="text-base sm:text-lg font-display font-bold tracking-tight text-[#F0F6FC] flex items-center gap-2">
            Online Notepad
            <span className="text-[9px] uppercase tracking-widest bg-[#238636]/20 text-[#3FBB67] font-mono px-1.5 py-0.5 rounded font-bold">
              Local
            </span>
          </h1>
          <span className="text-[10px] text-[#8B949E] hidden sm:inline">
            Offline-first distraction-free editor. Autocached in your browser.
          </span>
        </div>
      </div>

      {/* Right segment */}
      <div className="flex items-center gap-4 text-sm font-medium">
        {/* Local Storage Indicator Status */}
        <div className="hidden sm:flex items-center gap-2 text-[#8B949E] text-xs font-semibold select-none">
          <HardDrive className="w-3.5 h-3.5 text-[#3FBB67]" />
          <span>LocalStorage Persistent</span>
        </div>

        {/* Shortcuts guide */}
        <button
          onClick={onShowShortcuts}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8B949E] hover:text-white hover:bg-[#30363D] border border-transparent rounded-lg transition-all cursor-pointer"
          title="Keyboard Shortcuts"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans font-semibold">Shortcuts</span>
        </button>
      </div>
    </header>
  );
}
