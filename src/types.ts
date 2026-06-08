export type SaveStatus = 'Saved ✓' | 'Saving...' | 'Local Cache Realtime';

export interface Note {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  isPinned: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface EditorState {
  text: string;
  fontFamily: string; // 'font-sans' | 'font-display' | 'font-mono' | 'font-serif'
  fontSize: string;   // 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl'
  isBold: boolean;
  isItalic: boolean;
  isFullscreen: boolean;
  saveStatus: SaveStatus;
  lastSaved: Date;
}

export interface TextMetrics {
  charCount: number;
  wordCount: number;
  lineCount: number;
  readingTime: string;
}
