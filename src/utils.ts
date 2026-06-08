import { TextMetrics } from './types';

/**
 * Calculates characters, words, and lines metric properties from markdown text.
 */
export function calculateMetrics(text: string): TextMetrics {
  const charCount = text.length;
  
  // Clean whitespace separation for words
  const cleanText = text.trim();
  const wordCount = cleanText === '' ? 0 : cleanText.split(/\s+/).filter(Boolean).length;
  
  // Line assessment
  const lineCount = text === '' ? 0 : text.split('\n').length;

  // Reading time math (225 words per minute)
  let readingTime = '0s read';
  if (wordCount > 0) {
    const totalSeconds = (wordCount / 225) * 60;
    if (totalSeconds < 60) {
      readingTime = `${Math.ceil(totalSeconds)}s read`;
    } else {
      readingTime = `${Math.ceil(totalSeconds / 60)} min read`;
    }
  }
  
  return {
    charCount,
    wordCount,
    lineCount,
    readingTime
  };
}

/**
 * Capitalizes the first letter of each word in a string.
 */
export function titleCase(str: string): string {
  return str.split(/(\s+)/).map(word => {
    if (!word || /^\s+$/.test(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}
