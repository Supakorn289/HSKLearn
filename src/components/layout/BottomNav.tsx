import React from 'react';
import { Sparkles, Layers, BrainCircuit, BarChart3 } from 'lucide-react';

export type NavTab = 'daily' | 'vault' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenQuizModal?: () => void;
  isQuizReady?: boolean;
  isQuizCompleted?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  onOpenQuizModal,
  isQuizReady = false,
  isQuizCompleted = false,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[max(10px,env(safe-area-inset-bottom,16px))] pt-1.5 px-3 sm:px-4 pointer-events-none">
      <div className="max-w-md w-full mx-auto pointer-events-auto backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border-2 border-slate-900/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 shadow-2xl shadow-indigo-950/20 flex items-center justify-around gap-1">
        {/* Tab 1: Daily Dashboard */}
        <button
          onClick={() => onChangeTab('daily')}
          className={`flex-1 py-1.5 sm:py-2 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-200 select-none min-h-[44px] ${
            currentTab === 'daily'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md shadow-slate-900/20'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white active:scale-95'
          }`}
        >
          <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${currentTab === 'daily' ? 'scale-110 text-amber-400' : ''}`} />
          <span className="font-thai text-[9px] min-[360px]:text-[10px] font-bold tracking-tight truncate max-w-full">
            ภารกิจวันนี้
          </span>
        </button>

        {/* Tab 2: Vocab Vault */}
        <button
          onClick={() => onChangeTab('vault')}
          className={`flex-1 py-1.5 sm:py-2 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-200 select-none min-h-[44px] ${
            currentTab === 'vault'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md shadow-slate-900/20'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white active:scale-95'
          }`}
        >
          <Layers className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${currentTab === 'vault' ? 'scale-110 text-indigo-400' : ''}`} />
          <span className="font-thai text-[9px] min-[360px]:text-[10px] font-bold tracking-tight truncate max-w-full">
            คลัง A-Z
          </span>
        </button>

        {/* Quick Quiz Action Button */}
        {onOpenQuizModal && (
          <button
            onClick={onOpenQuizModal}
            className={`flex-1 py-1.5 sm:py-2 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-200 select-none min-h-[44px] relative ${
              isQuizCompleted
                ? 'text-emerald-600 dark:text-emerald-400 opacity-90'
                : isQuizReady
                ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 animate-pulse'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5" />
              {isQuizReady && !isQuizCompleted && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-400 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <span className="font-thai text-[9px] min-[360px]:text-[10px] font-bold tracking-tight truncate max-w-full">
              {isQuizCompleted ? 'ควิซสำเร็จ' : 'มินิควิซ 3 ข้อ'}
            </span>
          </button>
        )}

        {/* Tab 3: Settings & Stats */}
        <button
          onClick={() => onChangeTab('settings')}
          className={`flex-1 py-1.5 sm:py-2 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-200 select-none min-h-[44px] ${
            currentTab === 'settings'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md shadow-slate-900/20'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white active:scale-95'
          }`}
        >
          <BarChart3 className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${currentTab === 'settings' ? 'scale-110 text-sky-400' : ''}`} />
          <span className="font-thai text-[9px] min-[360px]:text-[10px] font-bold tracking-tight truncate max-w-full">
            สถิติ & ตั้งค่า
          </span>
        </button>
      </div>
    </nav>
  );
};
