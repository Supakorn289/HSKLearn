import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { DailyDashboard } from './components/daily/DailyDashboard';
import { FlashcardModal } from './components/study/FlashcardModal';
import { DailyQuizModal } from './components/quiz/DailyQuizModal';
import { VocabVault } from './components/vault/VocabVault';
import { SettingsAndStats } from './components/settings/SettingsAndStats';
import { HSKLevel, VocabWord, RelationType } from './types/hsk';
import { LinkedWordItem } from './components/study/SemanticClusterView';
import { X } from 'lucide-react';

export const App: React.FC = () => {
  const {
    currentSession,
    quizQuestions,
    isDarkMode,
    activeTab,
    toastMessage,
    stats,
    initDailySession,
    markTaskViewed,
    markTaskAudioPlayed,
    completeDailyQuiz,
    toggleBookmark,
    rateWordRetention,
    setActiveTab,
    clearToast,
    getWordById,
  } = useAppStore();

  const [selectedLevel, setSelectedLevel] = useState<HSKLevel | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Initialize daily session on mount
  useEffect(() => {
    initDailySession();
  }, [initDailySession]);

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Active word when learning a level
  const activeLevelTask = selectedLevel && currentSession ? currentSession.tasks[selectedLevel] : null;
  const activeMainWord = activeLevelTask ? getWordById(activeLevelTask.mainWordId) : null;
  const activeLinkedWords: LinkedWordItem[] = [];

  if (activeMainWord && activeMainWord.relatedWords) {
    activeMainWord.relatedWords.forEach((rel) => {
      const w = getWordById(rel.targetWordId);
      if (w) {
        activeLinkedWords.push({ word: w, link: rel });
      }
    });
  }

  const handleOpenLearnLevel = (level: HSKLevel) => {
    setSelectedLevel(level);
    markTaskViewed(level);
  };

  const handleAudioPlayed = () => {
    if (selectedLevel) {
      markTaskAudioPlayed(selectedLevel);
    }
  };

  const allLevelsCompleted = currentSession
    ? Object.values(currentSession.tasks).every((t) => t.viewed && t.audioListened)
    : false;

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-[max(12px,env(safe-area-inset-top,12px))] left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs sm:text-sm font-thai font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-slate-700/30 max-w-sm text-center animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={clearToast} className="p-0.5 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <TopHeader />

      {/* Main Tab Views */}
      <main className="flex-1 w-full">
        {activeTab === 'daily' && (
          <DailyDashboard
            onStartStudy={handleOpenLearnLevel}
            onOpenQuiz={() => setIsQuizModalOpen(true)}
          />
        )}
        {activeTab === 'vault' && <VocabVault />}
        {activeTab === 'settings' && <SettingsAndStats />}
      </main>

      {/* Flashcard Study Modal */}
      {selectedLevel && activeMainWord && (
        <FlashcardModal
          level={selectedLevel}
          mainWord={activeMainWord}
          linkedWords={activeLinkedWords}
          isBookmarked={stats.bookmarks.includes(activeMainWord.id)}
          onToggleBookmark={toggleBookmark}
          onRateRetention={rateWordRetention}
          onAudioPlayed={handleAudioPlayed}
          onClose={() => setSelectedLevel(null)}
        />
      )}

      {/* Mini Quiz Modal */}
      {isQuizModalOpen && (
        <DailyQuizModal
          questions={quizQuestions}
          onCompleteQuiz={completeDailyQuiz}
          onClose={() => setIsQuizModalOpen(false)}
        />
      )}

      {/* Floating Bottom Navigation */}
      <BottomNav
        currentTab={activeTab === 'daily' || activeTab === 'vault' || activeTab === 'settings' ? activeTab : 'daily'}
        onChangeTab={(tab: NavTab) => setActiveTab(tab)}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
        isQuizReady={allLevelsCompleted}
        isQuizCompleted={currentSession?.quizCompleted || false}
      />
    </div>
  );
};

export default App;
