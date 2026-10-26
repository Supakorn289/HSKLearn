import React from 'react';
import { Flame, Shield, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

function getFlameConfig(streak: number) {
  if (streak >= 100) {
    return {
      gradient: 'from-amber-400 via-orange-500 to-rose-600',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.6)]',
      label: 'มหาเทพ 100+ วัน',
    };
  }
  if (streak >= 30) {
    return {
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      glow: 'shadow-[0_0_18px_rgba(217,70,239,0.5)]',
      label: 'ระดับสูง 30+ วัน',
    };
  }
  if (streak >= 7) {
    return {
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-[0_0_14px_rgba(245,158,11,0.5)]',
      label: 'ต่อเนื่อง 7+ วัน',
    };
  }
  return {
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-sm',
    label: 'เริ่มต้น',
  };
}

export const TopHeader: React.FC = () => {
  const { stats, isDarkMode, toggleDarkMode, currentSession } = useAppStore();
  const flame = getFlameConfig(stats.streak);
  const isFlameLit = Boolean(currentSession?.quizCompleted);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 border-b-2 border-slate-900/10 dark:border-white/10 transition-colors duration-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo & Brand (Responsive Neo-Brutalist Badge) */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-400 border-2 border-slate-900 dark:border-slate-700 flex items-center justify-center neo-shadow-sm shrink-0">
            <span className="font-hanzi font-black text-base sm:text-xl text-slate-950">
              汉
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="font-thai font-black text-sm sm:text-base leading-tight text-slate-900 dark:text-white flex items-center gap-1 sm:gap-1.5 truncate">
              <span>HSK Daily Stack</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1 sm:px-1.5 py-0.2 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black shrink-0">
                A-Z
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] font-thai text-slate-500 dark:text-slate-400 font-medium truncate hidden min-[360px]:block">
              เรียนภาษาจีนวันละสแตก
            </p>
          </div>
        </div>

        {/* Right Badges & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Flame Stack Badge with On/Off State */}
          <div
            title={
              isFlameLit
                ? `🔥 ไฟจุดติดแล้ว! ทำภารกิจวันนี้สำเร็จ สแตกสะสม ${stats.streak} วัน (${flame.label})`
                : `💤 ไฟยังดับอยู่: เรียนครบ 3 ระดับและทำควิซเพื่อจุดไฟสแตกวันนี้!`
            }
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border-2 transition-all duration-300 select-none ${
              isFlameLit
                ? 'bg-amber-400 dark:bg-amber-500 text-slate-950 border-slate-900 dark:border-slate-950 neo-shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-800'
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 shrink-0 ${
                isFlameLit
                  ? 'text-rose-600 fill-rose-500 animate-bounce'
                  : 'text-slate-400 dark:text-slate-500 stroke-[1.75]'
              }`}
            />
            <span
              className={`font-mono text-xs ${
                isFlameLit
                  ? 'font-black text-slate-950'
                  : 'font-semibold text-slate-400 dark:text-slate-500'
              }`}
            >
              {stats.streak}
            </span>
            <span
              className={`text-[10px] hidden md:inline ${
                isFlameLit
                  ? 'font-bold text-slate-900 opacity-90'
                  : 'font-medium text-slate-400 dark:text-slate-500'
              }`}
            >
              {isFlameLit ? 'วัน 🔥' : 'วัน'}
            </span>
          </div>

          {/* Streak Shields Badge */}
          <div
            title={`เกราะป้องกันสตรีคคงเหลือ: ${stats.streakShields}/2`}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-sky-100 dark:bg-sky-950/60 border-2 border-slate-900/80 dark:border-sky-800/80 neo-shadow-sm"
          >
            <Shield className={`w-3.5 h-3.5 ${stats.streakShields > 0 ? 'text-sky-600 dark:text-sky-400 fill-sky-500/40' : 'text-slate-300 dark:text-slate-600'}`} />
            <span className="font-mono font-black text-xs text-sky-900 dark:text-sky-300">
              {stats.streakShields}/2
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="สลับโหมดมืด/สว่าง"
            className="neo-btn w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white shrink-0"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
