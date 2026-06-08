import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Footer from './components/Footer';
import { SaveStatus, TextMetrics } from './types';
import { calculateMetrics, titleCase } from './utils';
import { HardDrive, HelpCircle, Maximize2, Minimize2, Copy, Trash2 } from 'lucide-react';

export default function App() {
  // 1. Text editor state with LocalStorage persistence
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem('online_notepad_saved_content') ?? '';
  });

  // Font typography modes
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('online_notepad_font_family') ?? '"Poppins", sans-serif';
  });
  const [fontSize, setFontSize] = useState<string>(() => {
    return localStorage.getItem('online_notepad_font_size') ?? '18px';
  });

  // Styling toggles with LocalStorage memory
  const [isBold, setIsBold] = useState<boolean>(() => {
    return localStorage.getItem('online_notepad_is_bold') === 'true';
  });
  const [isItalic, setIsItalic] = useState<boolean>(() => {
    return localStorage.getItem('online_notepad_is_italic') === 'true';
  });
  const [isUnderline, setIsUnderline] = useState<boolean>(() => {
    return localStorage.getItem('online_notepad_is_underline') === 'true';
  });

  // Microsoft Word style lists & viewport variables
  const [isNumberedList, setIsNumberedList] = useState<boolean>(false);
  const [isBulletList, setIsBulletList] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Save status & Feedback Toast states
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('Saved ✓');
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Undo / Redo list tracks for offline context
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isHistoryNavRef = useRef(false);

  // Viewport textarea pointer hook
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Real-time metric indicators (words, characters, lines, reading velocity)
  const metrics = calculateMetrics(text);

  // Cache Font configurations
  useEffect(() => {
    localStorage.setItem('online_notepad_font_family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('online_notepad_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('online_notepad_is_bold', String(isBold));
  }, [isBold]);

  useEffect(() => {
    localStorage.setItem('online_notepad_is_italic', String(isItalic));
  }, [isItalic]);

  useEffect(() => {
    localStorage.setItem('online_notepad_is_underline', String(isUnderline));
  }, [isUnderline]);

  // Debounced LocalStorage Auto-Save
  useEffect(() => {
    const savedVal = localStorage.getItem('online_notepad_saved_content') ?? '';
    if (text === savedVal) {
      setSaveStatus('Saved ✓');
      return;
    }

    setSaveStatus('Saving...');

    const timer = setTimeout(() => {
      localStorage.setItem('online_notepad_saved_content', text);
      setSaveStatus('Saved ✓');
    }, 450); // 450ms save debouncer

    return () => clearTimeout(timer);
  }, [text]);

  // Capture edits in History stack for non-stale Undo / Redo
  useEffect(() => {
    if (isHistoryNavRef.current) {
      isHistoryNavRef.current = false;
      return;
    }

    if (history.length === 0) {
      setHistory([text]);
      setHistoryIndex(0);
      return;
    }

    if (text === history[historyIndex]) {
      return;
    }

    const timer = setTimeout(() => {
      const sliced = history.slice(0, historyIndex + 1);
      setHistory([...sliced, text]);
      setHistoryIndex(sliced.length);
    }, 400);

    return () => clearTimeout(timer);
  }, [text]);

  // Fullscreen toggle event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Global escape key listener
  useEffect(() => {
    const handleGlobalEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowShortcutsModal(false);
        setShowConfirmClear(false);
      }
    };
    window.addEventListener('keydown', handleGlobalEsc);
    return () => window.removeEventListener('keydown', handleGlobalEsc);
  }, []);

  // Undo & Redo Handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryNavRef.current = true;
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setText(history[prev]);
      showNotification('Undone ↩️');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryNavRef.current = true;
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setText(history[next]);
      showNotification('Redone ↪️');
    }
  };

  // Helper function to dispatch active flash alerts
  const showNotification = (msg: string) => {
    setToast({ message: msg, visible: true });
    const delay = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(delay);
  };

  // Copy to clipboard helper that works in various iframe circumstances
  const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
    try {
      if (textareaRef.current) textareaRef.current.focus();
    } catch {}

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        return true;
      }
    } catch {}

    try {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      if (textareaRef.current) textareaRef.current.focus();
      return !!successful;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      showNotification('Copied to clipboard! 📋');
    } else {
      showNotification('Failed to copy. Please select manually.');
    }
  };

  const handleDownloadTxt = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const docUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = docUrl;
      anchor.download = `online-notepad-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(docUrl);
      showNotification('Notepad exported successfully! 📝');
    } catch {
      showNotification('Export failed.');
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      showNotification('Print not supported in this iframe.');
    }
  };

  const handleClearConfirm = () => {
    setText('');
    localStorage.setItem('online_notepad_saved_content', '');
    const sliced = history.slice(0, historyIndex + 1);
    setHistory([...sliced, '']);
    setHistoryIndex(sliced.length);
    setShowConfirmClear(false);
    showNotification('Notepad cleared successfully! 🧹');
  };

  const toggleFullscreen = () => {
    const element = document.documentElement;
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Case transforms
  const handleTransform = (mode: 'upper' | 'lower' | 'capitalize') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selection = currentText.substring(start, end);

    if (!selection) {
      let newText = '';
      if (mode === 'upper') newText = currentText.toUpperCase();
      else if (mode === 'lower') newText = currentText.toLowerCase();
      else if (mode === 'capitalize') newText = titleCase(currentText);

      setText(newText);
      const sliced = history.slice(0, historyIndex + 1);
      setHistory([...sliced, newText]);
      setHistoryIndex(sliced.length);
      showNotification(`Converted text to ${mode}! ✨`);
      return;
    }

    let newSelection = '';
    if (mode === 'upper') newSelection = selection.toUpperCase();
    else if (mode === 'lower') newSelection = selection.toLowerCase();
    else if (mode === 'capitalize') newSelection = titleCase(selection);

    const updatedText = currentText.substring(0, start) + newSelection + currentText.substring(end);
    setText(updatedText);

    const sliced = history.slice(0, historyIndex + 1);
    setHistory([...sliced, updatedText]);
    setHistoryIndex(sliced.length);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newSelection.length);
    }, 0);

    showNotification(`Converted selection to ${mode}! ✨`);
  };

  // List utilities (Numbered & Bullet Lists)
  const handleToggleNumberedList = () => {
    const nextState = !isNumberedList;
    setIsNumberedList(nextState);
    if (nextState) {
      setIsBulletList(false);
      insertPrefixAtCurrentLine('1. ');
    } else {
      removePrefixAtCurrentLine(/^\s*\d+\.\s*/);
    }
  };

  const handleToggleBulletList = () => {
    const nextState = !isBulletList;
    setIsBulletList(nextState);
    if (nextState) {
      setIsNumberedList(false);
      insertPrefixAtCurrentLine('• ');
    } else {
      removePrefixAtCurrentLine(/^\s*•\s*/);
    }
  };

  const insertPrefixAtCurrentLine = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const beforeCursor = currentText.substring(0, start);
    const afterCursor = currentText.substring(end);

    const linesBefore = beforeCursor.split('\n');
    const currentLine = linesBefore[linesBefore.length - 1];

    const bulletRegex = /^\s*•\s*/;
    const numberRegex = /^\s*\d+\.\s*/;

    let updatedLine = currentLine;
    let newCursorOffset = 0;

    if (bulletRegex.test(currentLine)) {
      updatedLine = currentLine.replace(bulletRegex, prefix);
      newCursorOffset = prefix.length - (currentLine.match(bulletRegex)?.[0].length ?? 0);
    } else if (numberRegex.test(currentLine)) {
      updatedLine = currentLine.replace(numberRegex, prefix);
      newCursorOffset = prefix.length - (currentLine.match(numberRegex)?.[0].length ?? 0);
    } else {
      updatedLine = prefix + currentLine;
      newCursorOffset = prefix.length;
    }

    const lineStartIndex = start - currentLine.length;
    const updatedBeforeCursor = currentText.substring(0, lineStartIndex) + updatedLine;
    const updatedText = updatedBeforeCursor + afterCursor;

    setText(updatedText);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + newCursorOffset;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const removePrefixAtCurrentLine = (regex: RegExp) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentText = textarea.value;

    const beforeCursor = currentText.substring(0, start);
    const afterCursor = currentText.substring(start);

    const linesBefore = beforeCursor.split('\n');
    const currentLine = linesBefore[linesBefore.length - 1];

    if (regex.test(currentLine)) {
      const match = currentLine.match(regex);
      const matchLength = match ? match[0].length : 0;
      const updatedLine = currentLine.replace(regex, '');

      const lineStartIndex = start - currentLine.length;
      const updatedBeforeCursor = currentText.substring(0, lineStartIndex) + updatedLine;
      const updatedText = updatedBeforeCursor + afterCursor;

      setText(updatedText);

      setTimeout(() => {
        textarea.focus();
        const newPos = Math.max(lineStartIndex, start - matchLength);
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    }
  };

  // Keyboard events inside editor (formatting shortcuts)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsBold(!isBold);
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setIsItalic(!isItalic);
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        setIsUnderline(!isUnderline);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        showNotification('Saved manually to browser! 💾');
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handleRedo();
      }
    }

    // List navigation automation on newline (Enter)
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;

        const beforeCursor = currentText.substring(0, start);
        const afterCursor = currentText.substring(end);

        const linesBefore = beforeCursor.split('\n');
        const currentLine = linesBefore[linesBefore.length - 1];

        if (isNumberedList || isBulletList) {
          e.preventDefault();

          const bulletRegex = /^\s*•\s*$/;
          const numberRegex = /^\s*\d+\.\s*$/;

          // Break the list recursion if newline is empty
          if (bulletRegex.test(currentLine) || numberRegex.test(currentLine)) {
            const lineStartIndex = start - currentLine.length;
            const newBeforeCursor = currentText.substring(0, lineStartIndex);
            const updatedText = newBeforeCursor + afterCursor;

            setText(updatedText);

            const sliced = history.slice(0, historyIndex + 1);
            setHistory([...sliced, updatedText]);
            setHistoryIndex(sliced.length);

            setIsBulletList(false);
            setIsNumberedList(false);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(lineStartIndex, lineStartIndex);
            }, 0);
            return;
          }

          let prefix = '';
          if (isBulletList) {
            prefix = '• ';
          } else if (isNumberedList) {
            let nextNum = 1;
            const currentLineMatch = currentLine.match(/^\s*(\d+)\.\s*/);
            if (currentLineMatch) {
              nextNum = parseInt(currentLineMatch[1], 10) + 1;
            } else {
              for (let i = linesBefore.length - 2; i >= 0; i--) {
                const match = linesBefore[i].match(/^\s*(\d+)\.\s*/);
                if (match) {
                  nextNum = parseInt(match[1], 10) + 1;
                  break;
                }
              }
            }
            prefix = `${nextNum}. `;
          }

          const insertion = `\n${prefix}`;
          const updatedText = beforeCursor + insertion + afterCursor;

          setText(updatedText);

          const sliced = history.slice(0, historyIndex + 1);
          setHistory([...sliced, updatedText]);
          setHistoryIndex(sliced.length);

          const newCursorPos = start + insertion.length;
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen text-[#E6EDF3] bg-[#0F1117] select-none transition-colors duration-200 overflow-hidden" id="app-container">
      {/* Top Header Row with Shortcuts Trigger */}
      {!isFullscreen && (
        <Header onShowShortcuts={() => setShowShortcutsModal(true)} />
      )}

      {/* Editing & Format Actions Row */}
      <Toolbar
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onTransform={handleTransform}
        isBold={isBold}
        setIsBold={setIsBold}
        isItalic={isItalic}
        setIsItalic={setIsItalic}
        isUnderline={isUnderline}
        setIsUnderline={setIsUnderline}
        isNumberedList={isNumberedList}
        onToggleNumberedList={handleToggleNumberedList}
        isBulletList={isBulletList}
        onToggleBulletList={handleToggleBulletList}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onDownloadTxt={handleDownloadTxt}
        onPrint={handlePrint}
        onCopy={handleCopy}
         onClearClick={() => setShowConfirmClear(true)}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Primary Notepad Editor Panel */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#0F1117]" id="editor-wrapper">
        <Editor
          text={text}
          setText={setText}
          fontFamily={fontFamily}
          fontSize={fontSize}
          isBold={isBold}
          isItalic={isItalic}
          isUnderline={isUnderline}
          textareaRef={textareaRef}
          onKeyDown={handleKeyDown}
        />
      </main>

      {/* Word Count Metric Footer Row */}
      <Footer metrics={metrics} saveStatus={saveStatus} />

      {/* Saving alert badge */}
      <div 
        className="fixed bottom-14 right-6 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B22]/95 backdrop-blur-md border border-[#30363D] shadow-lg shadow-black/40 text-[10px] font-mono select-none no-print transition-all duration-300"
        id="floating-save-indicator"
        title="Offline Storage Autocache State"
      >
        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
          saveStatus === 'Saving...' 
            ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]' 
            : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
        }`}></span>
        <span className="text-[#8B949E]">{saveStatus}</span>
      </div>

      {/* Clear Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print" id="clear-confirm-modal" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl p-6 relative animate-fadeIn">
            <h3 className="text-lg font-display font-semibold text-[#F0F6FC] mb-2">
              Clear entire document?
            </h3>
            <p className="text-xs text-[#8B949E] leading-relaxed mb-6">
              This action is irreversible and will permanently delete all content from this note document. Are you sure you want to proceed?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-900/10 active:scale-95 cursor-pointer"
              >
                Yes, clear content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Guide Cover Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs no-print" id="shortcuts-guide-modal" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl p-6 relative animate-fadeIn">
            <h3 className="text-lg font-display font-semibold text-[#F0F6FC] mb-1">
              Keyboard Shortcuts Guide
            </h3>
            <p className="text-xs text-[#8B949E] mb-5 font-sans">
              Increase your writing throughput using these quick key combinations:
            </p>

            <div className="flex flex-col gap-3 font-sans max-h-[280px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#30363D]">
                <span className="text-gray-300">Toggle Bold Mode</span>
                <kbd className="px-2 py-1 bg-[#21262D] rounded border border-[#30363D] text-[10px] font-mono text-white select-all">Ctrl + B</kbd>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#30363D]">
                <span className="text-gray-300">Toggle Italic Mode</span>
                <kbd className="px-2 py-1 bg-[#21262D] rounded border border-[#30363D] text-[10px] font-mono text-white select-all">Ctrl + I</kbd>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#30363D]">
                <span className="text-gray-300">Toggle Underline Mode</span>
                <kbd className="px-2 py-1 bg-[#21262D] rounded border border-[#30363D] text-[10px] font-mono text-white select-all">Ctrl + U</kbd>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#30363D]">
                <span className="text-gray-300">Save Document Manually</span>
                <kbd className="px-2 py-1 bg-[#21262D] rounded border border-[#30363D] text-[10px] font-mono text-white select-all">Ctrl + S</kbd>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#30363D]">
                <span className="text-gray-300">Undo Action</span>
                <kbd className="px-2 py-1 bg-[#21262D] rounded border border-[#30363D] text-[10px] font-mono text-white select-all">Ctrl + Z</kbd>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#30363D]">
                <span className="text-gray-300">Redo Action</span>
                <kbd className="px-2 py-1 bg-[#21262D] rounded border border-[#30363D] text-[10px] font-mono text-white select-all">Ctrl + Y</kbd>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-gray-300">Dismiss Modal Guide</span>
                <kbd className="px-2 py-1 bg-[#21262D] rounded border border-[#30363D] text-[10px] font-mono text-white select-all">ESC</kbd>
              </div>
            </div>

            <div className="flex items-center justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#1F6FEB] hover:bg-[#388BFD] rounded-lg transition-all active:scale-95 cursor-pointer text-center"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating active Toast notices */}
      {toast && toast.visible && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 transform" id="global-action-toast">
          <div className="bg-[#1C2128]/95 backdrop-blur-md border border-blue-500/40 px-5 py-2.5 rounded-xl shadow-2xl text-[11px] sm:text-xs font-semibold tracking-wide text-white flex items-center gap-2 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
