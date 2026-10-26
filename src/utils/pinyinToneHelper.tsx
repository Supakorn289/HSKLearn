import React from 'react';
import { getPinyinToneNumber, getToneColorClass } from './soundAndTts';

/**
 * Pinyin tone highlighter component.
 * Parses pinyin text into syllables and applies distinct, high-contrast tone colors:
 * Tone 1: Sky Blue
 * Tone 2: Emerald Green
 * Tone 3: Amber Orange
 * Tone 4: Rose Red
 * Tone 5: Neutral Muted
 */
export const ColoredPinyin: React.FC<{ pinyin: string; className?: string }> = ({
  pinyin,
  className = '',
}) => {
  if (!pinyin) return null;
  const parts = pinyin.split(/\s+/);

  return (
    <span className={`inline-flex flex-wrap gap-1 items-baseline font-sans tracking-wide ${className}`}>
      {parts.map((syllable, idx) => {
        const tone = getPinyinToneNumber(syllable);
        return (
          <span key={idx} className={getToneColorClass(tone)}>
            {syllable}
          </span>
        );
      })}
    </span>
  );
};
