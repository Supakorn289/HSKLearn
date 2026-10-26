import React from 'react';
import { Volume2, Zap, ArrowLeftRight, Link2 } from 'lucide-react';
import { VocabWord, RelationType } from '../../types/hsk';
import { ColoredPinyin } from '../../utils/pinyinToneHelper';
import { speakChinese } from '../../utils/soundAndTts';

export interface LinkedWordItem {
  word: VocabWord;
  link: {
    relationType: RelationType;
    relationLabelThai: string;
  };
}

interface SemanticClusterViewProps {
  mainWord: VocabWord;
  linkedWords: LinkedWordItem[];
  onPlayWordAudio?: (hanzi: string) => void;
}

export const SemanticClusterView: React.FC<SemanticClusterViewProps> = ({
  mainWord,
  linkedWords,
  onPlayWordAudio,
}) => {
  if (!linkedWords || linkedWords.length === 0) return null;

  // Group by relation type
  const antonyms = linkedWords.filter((i) => i.link.relationType === 'ANTONYM');
  const spectrums = linkedWords.filter((i) => i.link.relationType === 'SPECTRUM');
  const synonyms = linkedWords.filter((i) => i.link.relationType === 'SYNONYM_PAIR');

  const handleSpeak = (hanzi: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayWordAudio) {
      onPlayWordAudio(hanzi);
    } else {
      speakChinese(hanzi, 1.0);
    }
  };

  return (
    <div className="w-full my-3 sm:my-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-4 space-y-3 sm:space-y-4">
      {/* 1. ANTONYM Split View (VS Comparison) */}
      {antonyms.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-0.5">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] sm:text-[11px] font-bold border border-rose-300/40 dark:border-rose-800/40">
              <Zap className="w-3 h-3" /> ANTONYM (คำตรงข้าม)
            </span>
            <span className="text-[10px] sm:text-[11px] font-thai text-slate-400">
              เรียนรู้คำตรงข้ามเป็นคู่
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 relative items-stretch">
            {/* Center VS Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black text-[10px] sm:text-[11px] flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              VS
            </div>

            {/* Left Card: Main Target Word */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/40 dark:bg-indigo-950/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-hanzi font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                    {mainWord.hanzi}
                  </span>
                  <button
                    onClick={(e) => handleSpeak(mainWord.hanzi, e)}
                    className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 shadow-sm"
                    title="ฟังเสียงคำหลัก"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ColoredPinyin pinyin={mainWord.pinyin} className="text-[11px] sm:text-xs mt-1" />
                <p className="font-thai text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">
                  {mainWord.thaiMeaning}
                </p>
              </div>
            </div>

            {/* Right Card: Antonym Word */}
            {antonyms.map(({ word, link }) => (
              <div
                key={word.id}
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-rose-300 dark:border-rose-800/60 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-hanzi font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                      {word.hanzi}
                    </span>
                    <button
                      onClick={(e) => handleSpeak(word.hanzi, e)}
                      className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 shadow-sm"
                      title="ฟังเสียงคำตรงข้าม"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ColoredPinyin pinyin={word.pinyin} className="text-[11px] sm:text-xs mt-1" />
                  <p className="font-thai text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold mt-1">
                    {word.thaiMeaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SPECTRUM Scale Stepper Node View */}
      {spectrums.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-0.5">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] sm:text-[11px] font-bold border border-amber-300/40 dark:border-amber-800/40">
              <ArrowLeftRight className="w-3 h-3" /> SPECTRUM (สเกลไล่ระดับ)
            </span>
            <span className="text-[10px] sm:text-[11px] font-thai text-slate-400">
              ความสัมพันธ์เชิงลำดับขั้น
            </span>
          </div>

          <div className="relative flex items-center justify-between gap-2 py-2 px-1 overflow-x-auto touch-scroll scrollbar-none">
            {/* Visual Connecting Gradient Bar */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-500 rounded-full z-0 opacity-70" />

            {/* Stepper Node 1: Main Word */}
            <div className="relative z-10 flex-1 min-w-[85px] sm:min-w-[100px] p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/60 flex flex-col items-center text-center shadow-md">
              <div className="flex items-center gap-1">
                <span className="font-hanzi font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                  {mainWord.hanzi}
                </span>
                <button
                  onClick={(e) => handleSpeak(mainWord.hanzi, e)}
                  className="p-1 rounded-md text-amber-600 dark:text-amber-400 hover:scale-110"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
              <ColoredPinyin pinyin={mainWord.pinyin} className="text-[10px] sm:text-[11px] mt-0.5" />
              <span className="font-thai text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate max-w-full">
                {mainWord.thaiMeaning}
              </span>
            </div>

            {/* Stepper Nodes: Spectrum Linked Words */}
            {spectrums.map(({ word, link }) => (
              <div
                key={word.id}
                className="relative z-10 flex-1 min-w-[85px] sm:min-w-[100px] p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center text-center shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <span className="font-hanzi font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                    {word.hanzi}
                  </span>
                  <button
                    onClick={(e) => handleSpeak(word.hanzi, e)}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:scale-110"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
                <ColoredPinyin pinyin={word.pinyin} className="text-[10px] sm:text-[11px] mt-0.5" />
                <span className="font-thai text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate max-w-full">
                  {word.thaiMeaning}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SYNONYM_PAIR / Grammatical Pair View */}
      {synonyms.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-0.5">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] sm:text-[11px] font-bold border border-indigo-300/40 dark:border-indigo-800/40">
              <Link2 className="w-3 h-3" /> SYNONYM_PAIR (คำคู่ไวยากรณ์)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {synonyms.map(({ word, link }) => (
              <div
                key={word.id}
                className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-hanzi font-black text-xl sm:text-2xl text-slate-900 dark:text-white shrink-0">
                    {word.hanzi}
                  </span>
                  <div className="min-w-0">
                    <ColoredPinyin pinyin={word.pinyin} className="text-[10px] sm:text-xs" />
                    <p className="font-thai text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {word.thaiMeaning}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleSpeak(word.hanzi, e)}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 shadow-sm shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
