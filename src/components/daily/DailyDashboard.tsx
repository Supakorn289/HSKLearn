import React from 'react';
import { Sparkles, Trophy, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { HSKLevel, VocabWord } from '../../types/hsk';
import { ColoredPinyin } from '../../utils/pinyinToneHelper';
import { playClickSound } from '../../utils/soundAndTts';

interface DailyDashboardProps {
  onStartStudy: (level: HSKLevel) => void;
  onOpenQuiz: () => void;
  onInspectWord?: (word: VocabWord) => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  onStartStudy,
  onOpenQuiz,
}) => {
  const {
    vocabDatabase,
    stats,
    currentSession,
    currentSimulatedDate,
    getWordById,
  } = useAppStore();

  // Helper to calculate A-Z progress for each level
  const getLevelProgress = (level: HSKLevel) => {
    const words = vocabDatabase
      .filter((w) => w.hskLevel === level)
      .sort((a, b) => a.pinyinSortKey.localeCompare(b.pinyinSortKey));

    if (words.length === 0)
      return { percent: 0, currentLetter: 'A', totalWords: 0, learnedCount: 0 };

    const learnedCount = words.filter((w) => {
      const s = stats.wordStatuses[w.id];
      return s === 'LEARNED_AS_MAIN' || s === 'LEARNED_AS_LINKED';
    }).length;

    const percent = Math.min(100, Math.round((learnedCount / words.length) * 100));

    const currentTask = currentSession?.tasks[level];
    const currentWord = currentTask ? getWordById(currentTask.mainWordId) : null;
    const currentLetter = currentWord ? currentWord.pinyinLetter : 'A';

    return { percent, currentLetter, totalWords: words.length, learnedCount };
  };

  const allLevelsCompleted = currentSession
    ? Object.values(currentSession.tasks).every((t) => t.viewed && t.audioListened)
    : false;

  // Custom Crafted Neo-Brutalism Palettes: Solid Black Borders + Vibrant Pastels
  const missionTiers = [
    {
      level: 1 as HSKLevel,
      name: 'HSK 1',
      subtitle: 'ระดับพื้นฐาน A-Z',
      cardBg: 'bg-[#E0F2FE] dark:bg-[#0c2a42]',
      borderClass: 'border-2 border-slate-900 dark:border-slate-700',
      badgeBg: 'bg-sky-400 text-slate-950 border-2 border-slate-900',
      letterBox: 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-300 border-2 border-slate-900 dark:border-slate-700',
      progressTrack: 'bg-white/80 dark:bg-slate-800 border border-slate-900/40',
      progressBar: 'bg-sky-600 dark:bg-sky-400',
      btnClass: 'bg-sky-500 hover:bg-sky-400 text-slate-950 border-2 border-slate-900',
    },
    {
      level: 2 as HSKLevel,
      name: 'HSK 2',
      subtitle: 'ระดับกลางต้น A-Z',
      cardBg: 'bg-[#D1FAE5] dark:bg-[#064232]',
      borderClass: 'border-2 border-slate-900 dark:border-slate-700',
      badgeBg: 'bg-emerald-400 text-slate-950 border-2 border-slate-900',
      letterBox: 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-300 border-2 border-slate-900 dark:border-slate-700',
      progressTrack: 'bg-white/80 dark:bg-slate-800 border border-slate-900/40',
      progressBar: 'bg-emerald-600 dark:bg-emerald-400',
      btnClass: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-2 border-slate-900',
    },
    {
      level: 3 as HSKLevel,
      name: 'HSK 3',
      subtitle: 'ระดับใช้งานคล่อง A-Z',
      cardBg: 'bg-[#EDE9FE] dark:bg-[#2d124d]',
      borderClass: 'border-2 border-slate-900 dark:border-slate-700',
      badgeBg: 'bg-purple-400 text-slate-950 border-2 border-slate-900',
      letterBox: 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-300 border-2 border-slate-900 dark:border-slate-700',
      progressTrack: 'bg-white/80 dark:bg-slate-800 border border-slate-900/40',
      progressBar: 'bg-purple-600 dark:bg-purple-400',
      btnClass: 'bg-purple-500 hover:bg-purple-400 text-slate-950 border-2 border-slate-900',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 sm:pb-28 max-w-3xl mx-auto px-3 sm:px-4 pt-2.5 sm:pt-3">
      {/* Bento 1: Daily Mission Hero Header (Mobile-First Responsive) */}
      <section className="rounded-xl sm:rounded-2xl bg-indigo-950 text-white p-4 sm:p-6 border-2 border-slate-900 dark:border-slate-700 neo-shadow relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-amber-400 text-slate-950 border-2 border-slate-900 font-thai text-[11px] sm:text-xs font-black neo-shadow-sm">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950 shrink-0" />
              <span>A-Z Daily Quota System</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-thai font-black tracking-tight mt-1">
              ภารกิจเรียนประจำวัน
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm font-thai text-indigo-200">
              วันเรียนที่ {currentSimulatedDate} • 3 ระดับ HSK 1, 2, 3
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-900 neo-shadow-sm self-start sm:self-auto shrink-0">
            <div>
              <span className="text-[10px] sm:text-[11px] font-thai text-slate-500 dark:text-slate-400 block font-semibold leading-tight">
                เรียนสะสมทั้งหมด
              </span>
              <span className="text-lg sm:text-xl font-mono font-black">
                {stats.totalWordsLearned} <span className="text-xs text-slate-400 font-normal">/ {vocabDatabase.length} คำ</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento 2: Bonus Memory Recall / Anti-Duplicate Banner */}
      {currentSession && currentSession.bonusReviewWords.length > 0 && (
        <section className="rounded-xl bg-amber-100 dark:bg-amber-950/70 border-2 border-slate-900 dark:border-amber-600 p-3.5 sm:p-4 neo-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 shrink-0 neo-shadow-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-white">
                  BONUS RECALL
                </span>
                <span className="font-thai text-xs font-black text-slate-900 dark:text-amber-200">
                  ระบบข้ามคำที่เคยเรียนพ่วงอัตโนมัติ!
                </span>
              </div>
              <p className="font-thai text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium leading-relaxed">
                คิว A-Z ข้ามคำ {currentSession.bonusReviewWords.map((id) => {
                  const w = getWordById(id);
                  return w ? `「${w.hanzi}」` : '';
                }).join(' ')} ที่คุณเคยเรียนพ่วงแล้ว เพื่อรักษาโควตาคำใหม่วันนี้ให้เต็มที่
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bento 3: Neo-Brutalist HSK 1, 2, 3 Cards (Fully Fluid Responsive) */}
      <section className="space-y-3 sm:space-y-4">
        {missionTiers.map((tier) => {
          const task = currentSession?.tasks[tier.level];
          const mainWord = task ? getWordById(task.mainWordId) : null;
          const { percent, currentLetter, learnedCount, totalWords } = getLevelProgress(tier.level);
          const isCompleted = task?.viewed && task?.audioListened;

          return (
            <div
              key={tier.level}
              onClick={() => {
                playClickSound();
                onStartStudy(tier.level);
              }}
              className={`cursor-pointer group relative rounded-xl ${tier.cardBg} ${tier.borderClass} p-3.5 sm:p-5 neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all select-none`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                {/* Level Info & Target Word */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Letter Box */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${tier.letterBox} flex flex-col items-center justify-center font-mono font-black shrink-0 neo-shadow-sm`}>
                    <span className="text-[8px] sm:text-[9px] uppercase font-bold opacity-70 leading-none">หมวด</span>
                    <span className="text-xl sm:text-2xl leading-none mt-0.5">{currentLetter}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className={`px-2 py-0.2 sm:px-2.5 sm:py-0.5 rounded font-mono text-[11px] sm:text-xs font-black ${tier.badgeBg} neo-shadow-sm shrink-0`}>
                        {tier.name}
                      </span>
                      <span className="font-thai text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 font-bold truncate">
                        {tier.subtitle}
                      </span>
                    </div>

                    {mainWord && (
                      <div className="flex items-baseline gap-2 mt-1 sm:mt-1.5 flex-wrap">
                        <span className="font-hanzi font-black text-2xl min-[360px]:text-3xl sm:text-4xl text-slate-950 dark:text-white leading-tight">
                          {mainWord.hanzi}
                        </span>
                        <ColoredPinyin pinyin={mainWord.pinyin} className="text-xs sm:text-sm font-bold" />
                        <span className="font-thai text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">
                          {mainWord.thaiMeaning}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Mini Bar & Action State */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between pt-2 sm:pt-0 border-t border-slate-900/10 sm:border-t-0">
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 block">
                      A-Z: {learnedCount}/{totalWords} ({percent}%)
                    </span>
                    <div className={`w-24 min-[360px]:w-28 sm:w-32 h-2 sm:h-2.5 rounded-full ${tier.progressTrack} overflow-hidden mt-1`}>
                      <div
                        className={`h-full rounded-full ${tier.progressBar}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs font-thai font-black neo-shadow-sm shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                      <span>เรียนแล้ว</span>
                    </div>
                  ) : task?.viewed ? (
                    <div className="neo-btn flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 text-[11px] sm:text-xs font-thai font-black shrink-0">
                      <span>รอฟังเสียง</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  ) : (
                    <div className={`neo-btn flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl ${tier.btnClass} text-[11px] sm:text-xs font-thai font-black shrink-0`}>
                      <span>แตะเพื่อเรียน</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Mini Quiz Callout Banner (Neo-Brutalist Accent) */}
      <section
        onClick={() => {
          if (!allLevelsCompleted) {
            useAppStore.getState().showToast('⚠️ กรุณาเรียนและฟังเสียงคำศัพท์ให้ครบทั้ง 3 ระดับก่อนเริ่มมินิควิซ');
            return;
          }
          onOpenQuiz();
        }}
        className={`cursor-pointer rounded-xl p-4 sm:p-5 text-slate-950 border-2 border-slate-900 neo-shadow flex items-center justify-between gap-3 sm:gap-4 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none select-none ${
          allLevelsCompleted
            ? 'bg-amber-400 dark:bg-amber-500'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 flex items-center justify-center shrink-0 neo-shadow-sm">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-thai font-black text-sm sm:text-base">มินิควิซประจำวัน 3 ข้อ</span>
              {allLevelsCompleted && (
                <span className="font-thai text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-slate-900 text-white shrink-0">
                  ปลดล็อกแล้ว!
                </span>
              )}
            </div>
            <p className="font-thai text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium leading-tight">
              {allLevelsCompleted
                ? 'ทำควิซเพื่อจุดไฟสแตกประจำวัน 🔥 และรับ Streak Shield'
                : 'เรียนครบทั้ง 3 ระดับเพื่อปลดล็อกมินิควิซ'}
            </p>
          </div>
        </div>

        <button className="neo-btn px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-900 font-thai font-black text-xs shrink-0">
          เริ่มควิซ
        </button>
      </section>
    </div>
  );
};
