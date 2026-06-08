import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
  Download,
  Printer,
  Copy,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronDown
} from 'lucide-react';

interface ToolbarProps {
  fontFamily: string;
  setFontFamily: (val: string) => void;
  fontSize: string;
  setFontSize: (val: string) => void;
  onTransform: (mode: 'upper' | 'lower' | 'capitalize') => void;
  isBold: boolean;
  setIsBold: (val: boolean) => void;
  isItalic: boolean;
  setIsItalic: (val: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (val: boolean) => void;
  isNumberedList: boolean;
  onToggleNumberedList: () => void;
  isBulletList: boolean;
  onToggleBulletList: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDownloadTxt: () => void;
  onPrint: () => void;
  onCopy: () => void;
  onClearClick: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export default function Toolbar({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  onTransform,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  isUnderline,
  setIsUnderline,
  isNumberedList,
  onToggleNumberedList,
  isBulletList,
  onToggleBulletList,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDownloadTxt,
  onPrint,
  onCopy,
  onClearClick,
  isFullscreen,
  toggleFullscreen
}: ToolbarProps) {
  const fontSizes = ['12px', '14px', '18px', '20px', '24px', '36px'];
  
  const fontFamilies = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
    { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
    { name: 'Roboto', value: '"Roboto", sans-serif' },
    { name: 'Poppins', value: '"Poppins", sans-serif' }
  ];

  return (
    <nav className="w-full bg-[#1C2128] border-b border-[#30363D] px-4 sm:px-6 md:px-8 py-3 flex flex-wrap items-center gap-3 shrink-0 no-print" id="toolbar-container">
      {/* Font Family & Size Droplist Group */}
      <div className="flex items-center gap-2 border-r border-[#30363D] pr-3 sm:pr-4" id="font-group-controls">
        {/* Font Family Dropdown */}
        <div className="relative min-w-[130px] sm:min-w-[160px]">
          <select
            className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-[#0D1117] text-[#C9D1D9] border border-[#30363D] rounded-md appearance-none cursor-pointer focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all font-sans"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            id="font-family-select"
            aria-label="Font Family"
          >
            {fontFamilies.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Font Size Dropdown */}
        <div className="relative min-w-[70px] sm:min-w-[85px]">
          <select
            className="w-full h-9 pl-3 pr-8 text-xs font-medium bg-[#0D1117] text-[#C9D1D9] border border-[#30363D] rounded-md appearance-none cursor-pointer focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            id="font-size-select"
            aria-label="Font Size"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Undo & Redo controls */}
      <div className="flex items-center gap-1 border-r border-[#30363D] pr-3 sm:pr-4" id="history-group-controls">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-md transition-all active:scale-95 cursor-pointer ${
            canUndo
              ? 'text-[#8B949E] hover:text-[#58A6FF] hover:bg-[#30363D]'
              : 'text-[#30363D] cursor-not-allowed opacity-40'
          }`}
          title="Undo (Ctrl+Z)"
          id="btn-undo"
          aria-label="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-md transition-all active:scale-95 cursor-pointer ${
            canRedo
              ? 'text-[#8B949E] hover:text-[#58A6FF] hover:bg-[#30363D]'
              : 'text-[#30363D] cursor-not-allowed opacity-40'
          }`}
          title="Redo (Ctrl+Y)"
          id="btn-redo"
          aria-label="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Font Style Controls (Bold, Italic, Underline, Bullet/Numbered List) with visual highlights */}
      <div className="flex items-center gap-1 border-r border-[#30363D] pr-3 sm:pr-4" id="formatting-group-controls">
        <button
          type="button"
          onClick={() => setIsBold(!isBold)}
          className={`p-2 rounded-md border transition-all active:scale-95 cursor-pointer ${
            isBold
              ? 'bg-[#1F6FEB] text-white border-blue-500 shadow-sm shadow-[#1F6FEB]/20'
              : 'text-[#8B949E] hover:text-white hover:bg-[#30363D] border-transparent'
          }`}
          title={isBold ? 'Bold Mode: ON (Ctrl+B)' : 'Bold Mode: OFF (Ctrl+B)'}
          id="btn-bold"
          aria-label="Toggle Bold Mode"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsItalic(!isItalic)}
          className={`p-2 rounded-md border transition-all active:scale-95 cursor-pointer ${
            isItalic
              ? 'bg-[#1F6FEB] text-white border-blue-500 shadow-sm shadow-[#1F6FEB]/20'
              : 'text-[#8B949E] hover:text-white hover:bg-[#30363D] border-transparent'
          }`}
          title={isItalic ? 'Italic Mode: ON (Ctrl+I)' : 'Italic Mode: OFF (Ctrl+I)'}
          id="btn-italic"
          aria-label="Toggle Italic Mode"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsUnderline(!isUnderline)}
          className={`p-2 rounded-md border transition-all active:scale-95 cursor-pointer ${
            isUnderline
              ? 'bg-[#1F6FEB] text-white border-blue-500 shadow-sm shadow-[#1F6FEB]/20'
              : 'text-[#8B949E] hover:text-white hover:bg-[#30363D] border-transparent'
          }`}
          title={isUnderline ? 'Underline Mode: ON (Ctrl+U)' : 'Underline Mode: OFF (Ctrl+U)'}
          id="btn-underline"
          aria-label="Toggle Underline Mode"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleNumberedList}
          className={`p-2 rounded-md border transition-all active:scale-95 cursor-pointer ${
            isNumberedList
              ? 'bg-[#1F6FEB] text-white border-blue-500 shadow-sm shadow-[#1F6FEB]/20'
              : 'text-[#8B949E] hover:text-white hover:bg-[#30363D] border-transparent'
          }`}
          title={isNumberedList ? 'Numbered List Mode: ON' : 'Numbered List Mode: OFF'}
          id="btn-numbered-list"
          aria-label="Toggle Numbered List Mode"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleBulletList}
          className={`p-2 rounded-md border transition-all active:scale-95 cursor-pointer ${
            isBulletList
              ? 'bg-[#1F6FEB] text-white border-blue-500 shadow-sm shadow-[#1F6FEB]/20'
              : 'text-[#8B949E] hover:text-white hover:bg-[#30363D] border-transparent'
          }`}
          title={isBulletList ? 'Bullet List Mode: ON' : 'Bullet List Mode: OFF'}
          id="btn-bullet-list"
          aria-label="Toggle Bullet List Mode"
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Case transformations */}
      <div className="flex items-center gap-1.5 border-r border-[#30363D] pr-3 sm:pr-4" id="transform-group-controls">
        <button
          type="button"
          onClick={() => onTransform('upper')}
          className="px-2 py-1.5 text-[10px] font-bold hover:bg-[#30363D] rounded border border-[#30363D] bg-[#0D1117]/40 text-[#8B949E] hover:text-white transition-all active:scale-95 text-center min-w-[28px] cursor-pointer font-mono"
          title="Convert selection or document to UPPERCASE"
          id="btn-uppercase"
        >
          AA
        </button>
        <button
          type="button"
          onClick={() => onTransform('lower')}
          className="px-2 py-1.5 text-[10px] font-bold hover:bg-[#30363D] rounded border border-[#30363D] bg-[#0D1117]/40 text-[#8B949E] hover:text-white transition-all active:scale-95 text-center min-w-[28px] cursor-pointer font-mono"
          title="Convert selection or document to lowercase"
          id="btn-lowercase"
        >
          aa
        </button>
        <button
          type="button"
          onClick={() => onTransform('capitalize')}
          className="px-2 py-1.5 text-[10px] font-bold hover:bg-[#30363D] rounded border border-[#30363D] bg-[#0D1117]/40 text-[#8B949E] hover:text-white transition-all active:scale-95 text-center min-w-[28px] cursor-pointer font-mono"
          title="Capitalize Word cases"
          id="btn-capitalize"
        >
          Aa
        </button>
      </div>

      {/* Export & Document action triggers */}
      <div className="flex items-center gap-1.5 border-r border-[#30363D] pr-3 sm:pr-4" id="export-group-controls">
        <button
          type="button"
          onClick={onDownloadTxt}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold hover:bg-[#30363D] bg-[#0D1117]/40 text-[#C9D1D9] rounded border border-[#30363D] hover:text-white transition-all active:scale-95 cursor-pointer"
          title="Download Plain Text Document (.txt)"
          id="btn-download-txt"
        >
          <Download className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span className="hidden lg:inline">Download TXT</span>
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold hover:bg-[#30363D] bg-[#0D1117]/40 text-[#C9D1D9] rounded border border-[#30363D] hover:text-white transition-all active:scale-95 cursor-pointer"
          title="Print Notes or Save to PDF"
          id="btn-print-pdf"
        >
          <Printer className="w-3.5 h-3.5 text-[#3FBB67]" />
          <span className="hidden lg:inline">Print / PDF</span>
        </button>
      </div>

      {/* Utilities Action Group */}
      <div className="flex items-center gap-2 ml-auto" id="utilities-group-controls">
        {/* Copy Button */}
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-semibold hover:bg-[#30363D] bg-[#161B22] rounded-md border border-[#30363D] transition-all text-[#C9D1D9] active:scale-95 cursor-pointer"
          title="Copy Entire Content"
          id="btn-copy-doc"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Copy</span>
        </button>

        {/* Clear Button */}
        <button
          type="button"
          onClick={onClearClick}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-semibold hover:bg-red-900/20 text-red-400 bg-[#161B22] rounded-md border border-red-900/40 transition-all active:scale-95 cursor-pointer"
          title="Clear Document"
          id="btn-clear-doc"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Fullscreen Trigger */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className={`p-2 rounded-md border transition-all active:scale-95 cursor-pointer ${
            isFullscreen
              ? 'bg-[#1F6FEB] text-white border-blue-500 shadow-md'
              : 'hover:bg-[#30363D] border-[#30363D] text-[#8B949E] hover:text-white bg-[#161B22]'
          }`}
          title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen Editor'}
          id="btn-fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  );
}
