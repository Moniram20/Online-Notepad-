import React, { useEffect } from 'react';

interface EditorProps {
  text: string;
  setText: (val: string) => void;
  fontFamily: string;
  fontSize: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function Editor({
  text,
  setText,
  fontFamily,
  fontSize,
  isBold,
  isItalic,
  isUnderline,
  textareaRef,
  onKeyDown
}: EditorProps) {

  // Auto Focus on load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  return (
    <div className="flex-1 w-full bg-[#0F1117] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-5xl h-full flex flex-col bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl overflow-hidden">
        {/* Editor Writing Board */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none'
          }}
          className="flex-1 w-full bg-transparent p-6 sm:p-8 md:p-10 leading-relaxed text-[#E6EDF3] placeholder-[#484F58] focus:outline-none overflow-y-auto resize-none transition-all duration-150 font-light"
          placeholder="Start writing your thoughts..."
          id="notepad-textarea"
          spellCheck="true"
        />
      </div>
    </div>
  );
}
