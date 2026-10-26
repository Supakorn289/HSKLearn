import React, { useState } from 'react';
import { X, Volume2, Snail, RotateCw, Star, Layers } from 'lucide-react';
import { VocabWord, HSKLevel } from '../../types/hsk';
import { ColoredPinyin } from '../../utils/pinyinToneHelper';
import { SemanticClusterView, LinkedWordItem } from './SemanticClusterView';
import { speakChinese, playFlipSound, playClickSound } from '../../utils/soundAndTts';

interface FlashcardModalProps {
  level: HSKLevel;
  mainWord: VocabWord;
  linkedWords: LinkedWordItem[];
  isBookmarked: boolean;
  onToggleBookmark: (wordId: string) => void;
  onRateRetention: (wordId: string, rating: number) => void;
  onAudioPlayed?: () => void;
  onClose: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  level,
  mainWord,
  linkedWords,
  isBookmarked,
  onToggleBookmark,
  onRateRetention,
  onAudioPlayed,
  onClose,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showLinkedClusters, setShowLinkedClusters] = useState(false);
  const [hasListenedAudio, setHasListenedAudio] = useState(false);

  const handleFlipCard = () => {
    playFlipSound();
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = async (text: string, rate: number = 1.0) => {
    setHasListenedAudio(true);
    await speakChinese(text, rate);
    if (onAudioPlayed) {
      onAudioPlayed();
    }
  };

  const handleRate = (score: number) => {
    playClickSound();
    onRateRetention(mainWord.id, score);
    // Rating retention confirms active study of this card
    if (onAudioPlayed) {
      onAudioPlayed();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg flex flex-col gap-2.5 sm:gap-3.5 max-h-[96dvh] my-auto">
        {/* Top Bar: Level, Bookmark & Close */}
        <div className="flex items-center justify-between text-white px-1 sm:px-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-mono text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/20 backdrop-blur-md">
              HSK {level} • หมวด {mainWord.pinyinLetter}
            </span>
            <span className="font-thai text-[11px] sm:text-xs text-slate-300">
              {mainWord.partOfSpeech}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onToggleBookmark(mainWord.id)}
              className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md transition-colors ${
                isBookmarked
                  ? 'bg-amber-400 text-slate-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="บันทึกคำศัพท์"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="ปิด"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Tactile Flashcard with Responsive Fluid Height */}
        <div
          onClick={handleFlipCard}
          className="relative w-full h-[min(54vh,420px)] min-h-[300px] cursor-pointer perspective-1000 select-none"
        >
          <div
            className={`w-full h-full rounded-2xl sm:rounded-3xl transition-transform duration-500 preserve-3d shadow-2xl ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE */}
            <div className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-900/10 dark:border-white/10 p-4 sm:p-6 flex flex-col justify-between items-center text-center">
              <div className="w-full flex justify-between items-center">
                <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                  {mainWord.pinyinSortKey}
                </span>
                <span className="text-[11px] sm:text-xs font-thai text-slate-400 flex items-center gap-1">
                  <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> แตะเพื่อดูคำแปล
                </span>
              </div>

              {/* Hanzi & Pinyin */}
              <div className="my-auto space-y-2 sm:space-y-4">
                <h2 className="font-hanzi font-black text-6xl min-[360px]:text-7xl sm:text-8xl tracking-tight text-slate-900 dark:text-white leading-none">
                  {mainWord.hanzi}
                </h2>
                <ColoredPinyin pinyin={mainWord.pinyin} className="text-xl sm:text-2xl md:text-3xl justify-center font-bold" />
              </div>

              {/* Audio Controls */}
              <div
                className="flex flex-col items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button
                    onClick={() => handlePlayAudio(mainWord.hanzi, 1.0)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-thai font-bold text-xs border border-indigo-200 dark:border-indigo-800 shadow-sm transition-all active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>ฟังปกติ 1.0x</span>
                  </button>
                  <button
                    onClick={() => handlePlayAudio(mainWord.hanzi, 0.65)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-600 dark:text-amber-400 font-thai font-bold text-xs border border-amber-200 dark:border-amber-800 shadow-sm transition-all active:scale-95"
                  >
                    <Snail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>ฟังช้า 0.65x</span>
                  </button>
                </div>
                {hasListenedAudio ? (
                  <span className="text-[10px] sm:text-[11px] font-thai text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ บันทึกการฟังเสียงแล้ว
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-thai text-slate-400">
                    แตะเพื่อฟังการออกเสียงภาษาจีน
                  </span>
                )}
              </div>
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl backface-hidden rotate-y-180 bg-white dark:bg-slate-900 border-2 border-indigo-500/40 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto touch-scroll">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 sm:pb-3">
                  <div>
                    <h3 className="font-hanzi font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                      {mainWord.hanzi}
                    </h3>
                    <ColoredPinyin pinyin={mainWord.pinyin} className="text-xs sm:text-sm font-semibold" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAudio(mainWord.hanzi, 1.0);
                    }}
                    className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform"
                    title="ฟังเสียงคำศัพท์"
                  >
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Thai Meaning */}
                <div>
                  <span className="text-[10px] sm:text-[11px] font-thai text-slate-400 block">คำแปลความหมาย</span>
                  <p className="font-thai font-black text-lg sm:text-xl text-slate-900 dark:text-white mt-0.5 leading-snug">
                    {mainWord.thaiMeaning}
                  </p>
                </div>

                {/* Example Sentence */}
                {mainWord.example && (
                  <div
                    className="p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-hanzi font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {mainWord.example.hanzi}
                      </span>
                      <button
                        onClick={() => handlePlayAudio(mainWord.example.hanzi, 1.0)}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 shrink-0"
                        title="ฟังประโยคตัวอย่าง"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {mainWord.example.pinyin && (
                      <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5">{mainWord.example.pinyin}</p>
                    )}
                    {mainWord.example.thai && (
                      <p className="text-[11px] sm:text-xs font-thai text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {mainWord.example.thai}
                      </p>
                    )}
                  </div>
                )}

                {/* Semantic Clusters Section */}
                {linkedWords.length > 0 && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShowLinkedClusters(!showLinkedClusters)}
                      className="w-full py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-thai text-xs font-bold flex items-center justify-between border border-indigo-200/60 dark:border-indigo-800/60"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        คำพ่วงความสัมพันธ์ ({linkedWords.length} คำ)
                      </span>
                      <span>{showLinkedClusters ? 'ซ่อน' : 'แสดง'}</span>
                    </button>

                    {showLinkedClusters && (
                      <SemanticClusterView
                        mainWord={mainWord}
                        linkedWords={linkedWords}
                        onPlayWordAudio={(h) => handlePlayAudio(h, 1.0)}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="text-center text-[10px] sm:text-[11px] font-thai text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                แตะเพื่อพลิกกลับไปหน้าแรก
              </div>
            </div>
          </div>
        </div>

        {/* Spaced Repetition Rating Assessment Bar (1 - 3 - 5) */}
        <div className="space-y-1 sm:space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-thai text-slate-300 text-center block">
            ประเมินความจำเพื่อจัดรอบทบทวน (Spaced Repetition)
          </span>
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            <button
              onClick={() => handleRate(1)}
              className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl sm:rounded-2xl bg-rose-500/15 hover:bg-rose-500 border-2 border-rose-500/40 text-rose-500 dark:text-rose-400 hover:text-white font-thai font-bold text-[11px] sm:text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all min-h-[46px]"
            >
              <span className="font-mono text-sm sm:text-base font-black leading-none">1</span>
              <span>ยังจำไม่ได้</span>
            </button>

            <button
              onClick={() => handleRate(3)}
              className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl sm:rounded-2xl bg-amber-500/15 hover:bg-amber-500 border-2 border-amber-500/40 text-amber-500 dark:text-amber-400 hover:text-white font-thai font-bold text-[11px] sm:text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all min-h-[46px]"
            >
              <span className="font-mono text-sm sm:text-base font-black leading-none">3</span>
              <span>พอจำได้</span>
            </button>

            <button
              onClick={() => handleRate(5)}
              className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl sm:rounded-2xl bg-emerald-500/15 hover:bg-emerald-500 border-2 border-emerald-500/40 text-emerald-500 dark:text-emerald-400 hover:text-white font-thai font-bold text-[11px] sm:text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all min-h-[46px]"
            >
              <span className="font-mono text-sm sm:text-base font-black leading-none">5</span>
              <span>จำได้แม่น</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
