import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Flame,
  Shield,
  Volume2,
  Sparkles,
  BookOpen,
  Search,
  Settings,
  Star,
  RotateCw,
  FastForward,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  ChevronRight,
  X,
  RefreshCw,
  Download,
  Upload,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Calendar,
  LayoutGrid,
  ListFilter
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';
import type { DayStreakActivity } from './store/useAppStore';

import { useAppStore } from './store/useAppStore';
import { HSKLevel, VocabWord, RelationType } from './types/hsk';
import {
  speakChinese,
  playFlipSound,
  playCorrectSound,
  playWrongSound,
  playCelebrationSound,
  playClickSound,
  getPinyinToneNumber,
  getToneColorClass,
  getToneBadge
} from './utils/soundAndTts';

// Helper to colorize individual syllables in pinyin string
function renderToneColoredPinyin(pinyinText: string) {
  const parts = pinyinText.split(/\s+/);
  return (
    <span className="inline-flex flex-wrap gap-1 items-center">
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
}

// Flame visual configuration based on streak milestones
function getFlameConfig(streak: number) {
  if (streak >= 100) {
    return {
      gradient: 'from-amber-300 via-yellow-400 to-amber-600',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.6)]',
      label: 'เปลวเพลิงมหาเทพ 100+ วัน',
      iconColor: 'text-amber-300'
    };
  }
  if (streak >= 30) {
    return {
      gradient: 'from-purple-500 via-pink-500 to-indigo-600',
      glow: 'shadow-[0_0_18px_rgba(217,70,239,0.5)]',
      label: 'เพลิงสีม่วง 30+ วัน',
      iconColor: 'text-pink-400'
    };
  }
  if (streak >= 7) {
    return {
      gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      glow: 'shadow-[0_0_16px_rgba(14,165,233,0.5)]',
      label: 'เพลิงสีฟ้า 7+ วัน',
      iconColor: 'text-sky-300'
    };
  }
  return {
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    glow: 'shadow-[0_0_14px_rgba(249,115,22,0.4)]',
    label: 'เพลิงส้มเริ่มต้น',
    iconColor: 'text-orange-400'
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DayStreakActivity }>;
}

const StreakTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 text-white border border-slate-700/80 p-3 rounded-2xl shadow-xl text-xs backdrop-blur-md space-y-1.5 z-50">
        <div className="flex items-center justify-between gap-4 border-b border-slate-700/60 pb-1 font-semibold text-slate-300">
          <span>{data.shortDate} ({data.dayOfWeek})</span>
          <span className="text-[10px] font-mono text-slate-400">{data.date}</span>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: data.fillColor }}
          />
          <span className="font-bold text-xs text-white">
            {data.statusLabel}
          </span>
        </div>
        {data.wordsLearned > 0 && (
          <p className="text-emerald-400 font-semibold text-[11px]">
            เรียนสะสม: {data.wordsLearned} คำในระดับ HSK 1-3
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function App() {
  const {
    vocabDatabase,
    stats,
    currentSession,
    quizQuestions,
    isDarkMode,
    currentSimulatedDate,
    activeTab,
    toastMessage,
    initDailySession,
    markTaskViewed,
    markTaskAudioPlayed,
    completeDailyQuiz,
    toggleBookmark,
    rateWordRetention,
    simulateNextDay,
    toggleDarkMode,
    setActiveTab,
    clearToast,
    importDatabaseJson,
    exportBackupJson,
    resetToDefault,
    getWordById,
    getLast30DaysActivity
  } = useAppStore();

  // Selected level card for active learning modal
  const [selectedLearnLevel, setSelectedLearnLevel] = useState<HSKLevel | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showLinkedClusters, setShowLinkedClusters] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState<1.0 | 0.65>(1.0);

  // Daily Quiz Modal state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Vocab Vault filters & View Mode
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultLevelFilter, setVaultLevelFilter] = useState<'ALL' | 1 | 2 | 3>('ALL');
  const [vaultStatusFilter, setVaultStatusFilter] = useState<'ALL' | 'UNLEARNED' | 'LEARNED' | 'BOOKMARKED'>('ALL');
  const [vaultLetterFilter, setVaultLetterFilter] = useState<string>('ALL');
  const [vaultViewMode, setVaultViewMode] = useState<'grid' | 'spacious'>('grid');

  // Word detail popup
  const [inspectWord, setInspectWord] = useState<VocabWord | null>(null);

  // Settings & Import/Export states
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);

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

  const flame = getFlameConfig(stats.streak);

  // Active word when learning a level
  const activeLevelTask = selectedLearnLevel && currentSession ? currentSession.tasks[selectedLearnLevel] : null;
  const activeMainWord = activeLevelTask ? getWordById(activeLevelTask.mainWordId) : null;
  const activeLinkedWords: { word: VocabWord; link: { relationType: RelationType; relationLabelThai: string } }[] = [];

  if (activeMainWord && activeMainWord.relatedWords) {
    activeMainWord.relatedWords.forEach(rel => {
      const w = getWordById(rel.targetWordId);
      if (w) {
        activeLinkedWords.push({ word: w, link: rel });
      }
    });
  }

  // Handle opening a level card
  const handleOpenLearnLevel = (level: HSKLevel) => {
    playClickSound();
    setSelectedLearnLevel(level);
    setIsFlipped(false);
    setShowLinkedClusters(false);
    markTaskViewed(level);
  };

  // Speak word and mark audioListened
  const handlePlayWordAudio = async (text: string, level?: HSKLevel, customRate?: number) => {
    const rate = customRate || ttsSpeed;
    await speakChinese(text, rate);
    if (level) {
      markTaskAudioPlayed(level);
    }
  };

  // Trigger Quiz
  const handleStartDailyQuiz = () => {
    playClickSound();
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizAnswered(false);
    setIsAnswerCorrect(null);
    setQuizScore(0);
    setQuizFinished(false);
    setIsQuizModalOpen(true);
  };

  // Submit an option in quiz
  const handleSelectQuizOption = (option: string) => {
    if (quizAnswered) return;
    const currentQ = quizQuestions[currentQuizIndex];
    if (!currentQ) return;

    setSelectedOption(option);
    setQuizAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      playCorrectSound();
      setQuizScore(prev => prev + 1);
    } else {
      playWrongSound();
    }
  };

  const handleNextQuizQuestion = () => {
    playClickSound();
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizAnswered(false);
      setIsAnswerCorrect(null);
    } else {
      // Quiz complete!
      const result = completeDailyQuiz();
      setQuizFinished(true);
      if (result.success) {
        playCelebrationSound();
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Calculate A-Z Progress for each level
  const getLevelProgress = (level: HSKLevel) => {
    const words = vocabDatabase
      .filter(w => w.hskLevel === level)
      .sort((a, b) => a.pinyinSortKey.localeCompare(b.pinyinSortKey));
    
    if (words.length === 0) return { percent: 0, currentLetter: 'A', totalWords: 0, learnedCount: 0 };

    const learnedCount = words.filter(w => {
      const s = stats.wordStatuses[w.id];
      return s === 'LEARNED_AS_MAIN' || s === 'LEARNED_AS_LINKED';
    }).length;

    const percent = Math.min(100, Math.round((learnedCount / words.length) * 100));

    // Current letter from task or unlearned
    const currentTask = currentSession?.tasks[level];
    const currentWord = currentTask ? getWordById(currentTask.mainWordId) : null;
    const currentLetter = currentWord ? currentWord.pinyinLetter : 'Z';

    return { percent, currentLetter, totalWords: words.length, learnedCount };
  };

  // Check if daily quiz can be unlocked
  const allLevelsCompleted = currentSession
    ? Object.values(currentSession.tasks).every(t => t.viewed && t.audioListened)
    : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-sm font-medium shadow-xl backdrop-blur-md flex items-center gap-2 border border-slate-700/30 max-w-sm text-center"
          >
            <span>{toastMessage}</span>
            <button onClick={clearToast} className="p-0.5 hover:opacity-70">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR / HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand & Stack Fire Counter */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r ${flame.gradient} text-white font-bold text-sm shadow-md ${flame.glow}`}
            >
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span>{stats.streak}</span>
              <span className="text-[11px] font-normal opacity-90 hidden sm:inline">Stack</span>
            </motion.div>

            {/* Streak Ice Shields */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-300 dark:border-sky-800/60">
              <Shield className="w-3.5 h-3.5 fill-sky-500/20 text-sky-500" />
              <span>{stats.streakShields}/2</span>
              <span className="hidden sm:inline font-normal text-[11px]">เกราะ</span>
            </div>
          </div>

          {/* Dev Test Button + Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={simulateNextDay}
              title="จำลองวันถัดไปเพื่อทดสอบการเดินคิว A-Z และเกราะ Stack"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all border border-indigo-200 dark:border-indigo-800"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">จำลองวันถัดไป</span>
              <span className="sm:hidden">+1 วัน</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => { playClickSound(); setActiveTab('daily'); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'daily'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>เรียนวันนี้</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('vault'); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'vault'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>คลังคำศัพท์ A-Z</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('settings'); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>จัดการข้อมูล</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 pb-20">
        {/* ========================================================= */}
        {/* TAB 1: DAILY STUDY (เรียนวันนี้) */}
        {/* ========================================================= */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            {/* Date and Mission Summary Banner */}
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 rounded-3xl p-4 sm:p-5 border border-indigo-200/50 dark:border-indigo-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                    ภารกิจประจำวัน HSK 3.0
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold mt-0.5">
                    วันเรียนที่ {currentSimulatedDate}
                  </h1>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">ความคืบหน้ารวม</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.totalWordsLearned} / {vocabDatabase.length} คำ
                  </span>
                </div>
              </div>

              {/* Anti-Duplicate Notice / Bonus Memory Recall Banner */}
              {currentSession && currentSession.bonusReviewWords.length > 0 && (
                <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-amber-800 dark:text-amber-300">
                      ⚡ Bonus Memory Recall! ข้ามคำที่เคยเรียนแล้ว:
                    </strong>
                    <span>
                      คิว A-Z ได้ข้ามคำศัพท์ {currentSession.bonusReviewWords.map(id => {
                        const w = getWordById(id);
                        return w ? `「${w.hanzi}」` : '';
                      }).join(' ')} ที่คุณเคยเรียนพ่วงไปแล้วโดยอัตโนมัติ เพื่อไม่ให้เสียโควตาคำใหม่วันนี้!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3 Level Daily Cards */}
            <div className="space-y-3.5">
              {([1, 2, 3] as HSKLevel[]).map(level => {
                const task = currentSession?.tasks[level];
                const mainWord = task ? getWordById(task.mainWordId) : null;
                const { percent, currentLetter } = getLevelProgress(level);
                const isCompleted = task?.viewed && task?.audioListened;

                return (
                  <motion.div
                    key={level}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleOpenLearnLevel(level)}
                    className={`cursor-pointer rounded-3xl p-4 sm:p-5 border transition-all duration-200 relative overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/50 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:border-indigo-400 dark:hover:border-indigo-600'
                    }`}
                  >
                    {/* Top Level Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-wider ${
                          level === 1
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : level === 2
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          HSK {level}
                        </span>

                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          หมวดพินอิน {currentLetter}
                        </span>

                        {task?.isSpacedRepetition && (
                          <span className="px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[10px] font-semibold">
                            🔁 ทบทวนคำที่จำยาก
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>เรียนแล้ว</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                            <span>กดเพื่อเปิดเรียน</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Word Preview Card Info */}
                    {mainWord && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl sm:text-4xl font-black font-hanzi text-slate-900 dark:text-white">
                            {mainWord.hanzi}
                          </span>
                          <div>
                            <span className="text-base font-semibold block">
                              {renderToneColoredPinyin(mainWord.pinyin)}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                              {mainWord.thaiMeaning}
                            </span>
                          </div>
                        </div>

                        {/* Linked Cluster Badge */}
                        {mainWord.relatedWords && mainWord.relatedWords.length > 0 && (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-200 dark:border-indigo-800">
                              <Sparkles className="w-3 h-3 text-indigo-500" />
                              <span>+{mainWord.relatedWords.length} คำเชื่อมโยง</span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* A-Z Level Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>A-Z ความคืบหน้า</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            level === 1 ? 'bg-blue-500' : level === 2 ? 'bg-emerald-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Daily Mini-Quiz Action Callout */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartDailyQuiz}
                disabled={!allLevelsCompleted && !currentSession?.quizCompleted}
                className={`w-full py-4 px-6 rounded-3xl font-bold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all ${
                  currentSession?.quizCompleted
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
                    : allLevelsCompleted
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-indigo-500/30 hover:opacity-95 animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                {currentSession?.quizCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>ภารกิจและ Quiz วันนี้สำเร็จแล้ว! (ทำซ้ำเพื่อทบทวน)</span>
                  </>
                ) : allLevelsCompleted ? (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                    <span>ท้าทายเพื่อเก็บ Stack วันนี้ (Daily Mini-Quiz 3 ข้อ)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>เปิดดูและฟังเสียงครบทั้ง 3 ระดับเพื่อปลดล็อก Quiz (+1 Stack)</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VOCABULARY VAULT (คลังคำศัพท์ A-Z - ปรับปรุงให้อ่านชัดเด่นสะดุดตา) */}
        {/* ========================================================= */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            {/* Header & Quick Count Summary */}
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-950/50 dark:via-purple-950/30 p-4 rounded-3xl border border-indigo-200/60 dark:border-indigo-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  คลังคำศัพท์ HSK 3.0 (A-Z Vocabulary Vault)
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  คำศัพท์ทั้งหมด {vocabDatabase.length} คำ
                </h2>
              </div>

              {/* View Mode Toggle: Grid vs Spacious */}
              <div className="flex items-center gap-1.5 self-start sm:self-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button
                  onClick={() => { playClickSound(); setVaultViewMode('grid'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    vaultViewMode === 'grid'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>การ์ดเด่น</span>
                </button>
                <button
                  onClick={() => { playClickSound(); setVaultViewMode('spacious'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    vaultViewMode === 'spacious'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>อ่านประโยคละเอียด</span>
                </button>
              </div>
            </div>

            {/* Search Input with high contrast */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาตัวอักษรจีน, พินอิน หรือคำแปลไทย..."
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm"
              />
              {vaultSearch && (
                <button
                  onClick={() => setVaultSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Level & Status Filter Chips */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {(['ALL', 1, 2, 3] as const).map(lvl => (
                <button
                  key={String(lvl)}
                  onClick={() => { playClickSound(); setVaultLevelFilter(lvl); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    vaultLevelFilter === lvl
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {lvl === 'ALL' ? 'ทุกระดับ (All)' : `HSK ${lvl}`}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

              {(['ALL', 'BOOKMARKED', 'LEARNED', 'UNLEARNED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => { playClickSound(); setVaultStatusFilter(st); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    vaultStatusFilter === st
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {st === 'ALL'
                    ? 'ทั้งหมด'
                    : st === 'BOOKMARKED'
                    ? `⭐ ติดดาว (${stats.bookmarks.length})`
                    : st === 'LEARNED'
                    ? 'เรียนแล้ว'
                    : 'ยังไม่เรียน'}
                </button>
              ))}
            </div>

            {/* A-Z Letter Filter Bar */}
            <div className="overflow-x-auto pb-1 flex gap-1.5 scrollbar-none">
              {['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map(char => (
                <button
                  key={char}
                  onClick={() => { playClickSound(); setVaultLetterFilter(char); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black shrink-0 transition-all ${
                    vaultLetterFilter === char
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

            {/* High-Contrast Word Cards Grid / Spacious List */}
            <div className={vaultViewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1" : "space-y-3.5 pt-1"}>
              {vocabDatabase
                .filter(w => {
                  if (vaultLevelFilter !== 'ALL' && w.hskLevel !== vaultLevelFilter) return false;
                  if (vaultLetterFilter !== 'ALL' && w.pinyinLetter !== vaultLetterFilter) return false;
                  if (vaultStatusFilter === 'BOOKMARKED' && !stats.bookmarks.includes(w.id)) return false;
                  const st = stats.wordStatuses[w.id] || 'UNLEARNED';
                  if (vaultStatusFilter === 'LEARNED' && st === 'UNLEARNED') return false;
                  if (vaultStatusFilter === 'UNLEARNED' && st !== 'UNLEARNED') return false;

                  if (vaultSearch.trim()) {
                    const q = vaultSearch.toLowerCase().trim();
                    return (
                      w.hanzi.includes(q) ||
                      w.pinyin.toLowerCase().includes(q) ||
                      w.thaiMeaning.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map(word => {
                  const status = stats.wordStatuses[word.id] || 'UNLEARNED';
                  const isBookmarked = stats.bookmarks.includes(word.id);

                  return (
                    <motion.div
                      key={word.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      onClick={() => setInspectWord(word)}
                      className="group cursor-pointer bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black tracking-wide ${
                            word.hskLevel === 1
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : word.hskLevel === 2
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          }`}>
                            HSK {word.hskLevel}
                          </span>

                          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                            [{word.pinyinLetter}]
                          </span>

                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                            {word.partOfSpeech}
                          </span>
                        </div>

                        {/* Status chip */}
                        <div>
                          {status === 'LEARNED_AS_MAIN' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                              ✓ เรียนหลักแล้ว
                            </span>
                          ) : status === 'LEARNED_AS_LINKED' ? (
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                              ⚡ เรียนพ่วงแล้ว
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium">
                              ยังไม่เรียน
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Character Plaque & High-Contrast Typography */}
                      <div className="flex items-center gap-4 py-1">
                        {/* High-Contrast Hanzi Tile */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-950 dark:to-slate-800 border-2 border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                          <span className="text-4xl sm:text-5xl font-black font-hanzi text-slate-950 dark:text-amber-300 drop-shadow-sm tracking-tight">
                            {word.hanzi}
                          </span>
                        </div>

                        {/* Pinyin and Thai Definition */}
                        <div className="flex-1 min-w-0">
                          <div className="inline-block px-2.5 py-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-base sm:text-lg font-black tracking-wide mb-1 shadow-sm">
                            {renderToneColoredPinyin(word.pinyin)}
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                            {word.thaiMeaning}
                          </h3>
                        </div>

                        {/* Quick Audio & Bookmark Actions */}
                        <div className="flex flex-col gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handlePlayWordAudio(word.hanzi)}
                            className="p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 shadow-sm transition-all active:scale-95"
                            title="ฟังเสียงอ่านภาษาจีน"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleBookmark(word.id)}
                            className={`p-2.5 rounded-2xl transition-all active:scale-95 ${
                              isBookmarked
                                ? 'bg-amber-100 text-amber-500 dark:bg-amber-950/70'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 hover:text-amber-400'
                            }`}
                            title="ติดดาวคำนี้"
                          >
                            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Spacious Mode: Example Sentence Highlight */}
                      {vaultViewMode === 'spacious' && (
                        <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/70 dark:border-slate-800 text-xs space-y-1">
                          <p className="font-hanzi font-bold text-sm text-slate-900 dark:text-white">
                            {word.example.hanzi.split(word.hanzi).map((chunk, i, arr) => (
                              <React.Fragment key={i}>
                                {chunk}
                                {i < arr.length - 1 && (
                                  <span className="text-indigo-600 dark:text-indigo-400 font-black underline decoration-2">
                                    {word.hanzi}
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">
                            {word.example.pinyin}
                          </p>
                          <p className="text-slate-700 dark:text-slate-200 font-semibold pt-0.5">
                            "{word.example.thai}"
                          </p>
                        </div>
                      )}

                      {/* Semantic Cluster Pills */}
                      {word.relatedWords && word.relatedWords.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            คำเชื่อมโยง:
                          </span>
                          {word.relatedWords.map((rel, rIdx) => {
                            const targetWord = getWordById(rel.targetWordId);
                            if (!targetWord) return null;
                            return (
                              <span
                                key={rIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200/60 dark:border-indigo-800/50"
                              >
                                <span>{rel.relationLabelThai}</span>
                                <span className="font-hanzi font-black text-indigo-900 dark:text-white">{targetWord.hanzi}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SETTINGS & DATA MANAGEMENT (จัดการฐานข้อมูล) */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Stack ปัจจุบัน</span>
                <span className="text-xl font-black text-amber-500 mt-1 block">{stats.streak} วัน</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">สถิติสูงสุด</span>
                <span className="text-xl font-black text-indigo-500 mt-1 block">{stats.maxStreak} วัน</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">คำที่เรียนรู้</span>
                <span className="text-xl font-black text-emerald-500 mt-1 block">{stats.totalWordsLearned} คำ</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">เกราะน้ำแข็ง</span>
                <span className="text-xl font-black text-sky-500 mt-1 block">{stats.streakShields} / 2</span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 30-DAY STREAK ACTIVITY & CONSISTENCY PATTERN (RECHARTS) */}
            {/* ======================================================== */}
            {(() => {
              const last30Days = getLast30DaysActivity();
              const activeDaysCount = last30Days.filter(d => d.status === 'COMPLETED').length;
              const shieldDaysCount = last30Days.filter(d => d.status === 'SHIELD_USED').length;
              const totalWords30Days = last30Days.reduce((acc, d) => acc + d.wordsLearned, 0);
              const consistencyRate = Math.round(((activeDaysCount + shieldDaysCount) / 30) * 100);

              return (
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  {/* Title & Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4" />
                        <span>สถิติความสม่ำเสมอ 30 วันล่าสุด (Recharts Streak Activity)</span>
                      </span>
                      <h2 className="text-base sm:text-lg font-bold mt-0.5 text-slate-900 dark:text-white">
                        Consistency Patterns & Habit Analysis
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                        <span>ความสม่ำเสมอ {consistencyRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Consistency Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">วันเข้าเรียนสำเร็จ</span>
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{activeDaysCount} / 30 วัน</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">คำที่เรียนในรอบ 30 วัน</span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{totalWords30Days} คำ</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">เกราะน้ำแข็งคุ้มครอง</span>
                      <span className="text-base font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">{shieldDaysCount} วัน</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">ระดับความต่อเนื่อง</span>
                      <span className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                        {consistencyRate >= 80 ? '🔥 ระดับสูงมาก' : consistencyRate >= 60 ? '⚡ ปานกลาง' : '🌱 กำลังเริ่มต้น'}
                      </span>
                    </div>
                  </div>

                  {/* Recharts Bar Chart */}
                  <div className="w-full h-56 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={last30Days} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} opacity={0.6} />
                        <XAxis
                          dataKey="shortDate"
                          tickLine={false}
                          axisLine={{ stroke: isDarkMode ? '#475569' : '#cbd5e1' }}
                          tick={{ fontSize: 9, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                          interval={4}
                        />
                        <YAxis
                          allowDecimals={false}
                          domain={[0, 4]}
                          ticks={[0, 1, 2, 3, 4]}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                        />
                        <Tooltip content={<StreakTooltip />} />
                        <Bar
                          dataKey="wordsLearned"
                          radius={[4, 4, 0, 0]}
                          minPointSize={4}
                        >
                          {last30Days.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fillColor} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend Chips */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span>สำเร็จ (+1 Stack)</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>วันนี้สำเร็จแล้ว</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span>เกราะน้ำแข็งคุ้มครอง</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>วันนี้รอเรียน</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>พักการเรียน</span>
                      </span>
                    </div>
                  </div>

                  {/* Consistency Pattern Insight */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <strong className="font-semibold block text-indigo-800 dark:text-indigo-300">
                        วิเคราะห์รูปแบบความสม่ำเสมอ (Consistency Pattern Insight):
                      </strong>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {consistencyRate >= 80
                          ? `ยอดเยี่ยมมาก! คุณมีอัตราความสม่ำเสมอสูงถึง ${consistencyRate}% ในช่วง 30 วันที่ผ่านมา การเรียนรู้คำศัพท์ HSK 3.0 อย่างต่อเนื่องทำให้ตัวอักษรจีนและคู่คำตรงข้ามฝังแน่นในความจำระยะยาวได้มีประสิทธิภาพสูงสุด`
                          : `คำแนะนำเพื่อความก้าวหน้า: พยายามสะสม Stack อย่างน้อย 7 วันติดต่อกัน เพื่อรับเกราะน้ำแข็ง (Streak Shield) ช่วยปกป้องความต่อเนื่องในวันที่คุณติดธุระ`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Backup & Restore Controls */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-500" />
                <span>สำรองและกู้คืนข้อมูล (Backup & Restore)</span>
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ข้อมูลการเรียน ความคืบหน้า และคำศัพท์ทั้งหมดจะถูกบันทึกไว้ในเบราว์เซอร์ (Offline-First) คุณสามารถคัดลอก JSON เพื่อสำรองหรือกู้คืนไปยังอุปกรณ์อื่นได้
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => {
                    const json = exportBackupJson();
                    navigator.clipboard.writeText(json);
                    setExportCopied(true);
                    setTimeout(() => setExportCopied(false), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{exportCopied ? 'คัดลอก JSON สำเร็จ!' : 'ส่งออกข้อมูล (Export JSON)'}</span>
                </button>

                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>นำเข้าข้อมูล (Import JSON)</span>
                </button>
              </div>
            </div>

            {/* Spaced Repetition & Level Reset */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>รีเซ็ตข้อมูลเริ่มต้น (Factory Reset)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                หากต้องการเริ่มต้นเรียนใหม่ทั้งหมด ล้าง Stack และคืนค่าคำศัพท์ทั้งหมดเป็นสถานะยังไม่เรียน
              </p>
              <button
                onClick={() => {
                  if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้น?')) {
                    resetToDefault();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                ล้างข้อมูลและเริ่มต้นใหม่
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: INTERACTIVE 3D FLASHCARD & SEMANTIC NODE CLUSTER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedLearnLevel && activeMainWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    HSK {selectedLearnLevel} • อักษร {activeMainWord.pinyinLetter}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeMainWord.partOfSpeech}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleBookmark(activeMainWord.id)}
                    className="p-2 text-slate-400 hover:text-amber-500 rounded-xl"
                  >
                    <Star className={`w-4 h-4 ${stats.bookmarks.includes(activeMainWord.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => setSelectedLearnLevel(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Card Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                {/* 3D Flip Card Container */}
                <div className="perspective-1000 w-full min-h-[260px]">
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="w-full h-full min-h-[260px] preserve-3d relative cursor-pointer"
                    onClick={() => {
                      playFlipSound();
                      setIsFlipped(!isFlipped);
                    }}
                  >
                    {/* FRONT SIDE OF CARD */}
                    <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800/60 p-6 flex flex-col justify-between items-center text-center shadow-lg">
                      <div className="w-full flex justify-between items-center text-xs text-slate-400">
                        <span>{getToneBadge(getPinyinToneNumber(activeMainWord.pinyin)).label}</span>
                        <span className="flex items-center gap-1 text-indigo-500">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>แตะเพื่อพลิกดูประโยค</span>
                        </span>
                      </div>

                      <div className="my-auto py-2">
                        <h2 className="text-6xl sm:text-7xl font-black font-hanzi text-slate-900 dark:text-white mb-2">
                          {activeMainWord.hanzi}
                        </h2>
                        <div className="text-2xl font-bold mb-1">
                          {renderToneColoredPinyin(activeMainWord.pinyin)}
                        </div>
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                          {activeMainWord.thaiMeaning}
                        </p>
                      </div>

                      {/* Audio Controls */}
                      <div className="w-full flex items-center justify-center gap-3 pt-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handlePlayWordAudio(activeMainWord.hanzi, selectedLearnLevel, 1.0)}
                          className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>ฟังเสียง (1.0x)</span>
                        </button>

                        <button
                          onClick={() => handlePlayWordAudio(activeMainWord.hanzi, selectedLearnLevel, 0.65)}
                          className="px-3.5 py-2 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-transform active:scale-95"
                        >
                          <span>ช้า (0.65x)</span>
                        </button>
                      </div>
                    </div>

                    {/* BACK SIDE OF CARD (Example Sentence & Details) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl bg-gradient-to-br from-purple-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-purple-950/30 border-2 border-purple-200 dark:border-purple-800/60 p-6 flex flex-col justify-between shadow-lg">
                      <div className="flex justify-between items-center text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        <span>ประโยคตัวอย่างการใช้งาน</span>
                        <span className="flex items-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>แตะเพื่อพลิกกลับ</span>
                        </span>
                      </div>

                      <div className="my-auto py-3 space-y-2 text-left">
                        <p className="text-xl sm:text-2xl font-hanzi font-bold text-slate-900 dark:text-white leading-relaxed">
                          {/* Highlight target word in sentence */}
                          {activeMainWord.example.hanzi.split(activeMainWord.hanzi).map((chunk, i, arr) => (
                            <React.Fragment key={i}>
                              {chunk}
                              {i < arr.length - 1 && (
                                <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-500 decoration-2 font-black">
                                  {activeMainWord.hanzi}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </p>

                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                          {activeMainWord.example.pinyin}
                        </p>

                        <p className="text-base text-slate-800 dark:text-slate-100 font-semibold pt-1">
                          "{activeMainWord.example.thai}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-purple-900/40" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handlePlayWordAudio(activeMainWord.example.hanzi, selectedLearnLevel, 1.0)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>ฟังทั้งประโยค</span>
                        </button>

                        <span className="text-[11px] text-slate-400">
                          คำศัพท์: {activeMainWord.hanzi}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* SEMANTIC CLUSTER ENGINE EXPANSION */}
                {activeLinkedWords.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        playClickSound();
                        setShowLinkedClusters(!showLinkedClusters);
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-pink-500/20 border border-indigo-300 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-300 text-sm font-bold flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                        <span>คำเชื่อมโยงและคำตรงข้าม ({activeLinkedWords.length} คำ)</span>
                      </div>
                      <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-lg">
                        {showLinkedClusters ? 'ย่อแผง' : 'กางออกดูเปรียบเทียบ'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {showLinkedClusters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-3 overflow-hidden"
                        >
                          {/* Visual connection indicator */}
                          <div className="text-center text-xs text-indigo-500 dark:text-indigo-400 font-semibold flex items-center justify-center gap-1.5">
                            <span className="h-px w-8 bg-indigo-300 dark:bg-indigo-700" />
                            <span>ความสัมพันธ์เชิงความหมาย (Semantic Network)</span>
                            <span className="h-px w-8 bg-indigo-300 dark:bg-indigo-700" />
                          </div>

                          {/* Side-by-Side or Stacked Linked Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {activeLinkedWords.map(({ word: linkedWord, link }) => (
                              <div
                                key={linkedWord.id}
                                className="bg-slate-50 dark:bg-slate-800/90 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-800/80 shadow-sm flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                      {link.relationLabelThai}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      HSK {linkedWord.hskLevel}
                                    </span>
                                  </div>

                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-3xl font-black font-hanzi text-slate-900 dark:text-white">
                                      {linkedWord.hanzi}
                                    </span>
                                    <span className="text-sm font-bold">
                                      {renderToneColoredPinyin(linkedWord.pinyin)}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-2">
                                    {linkedWord.thaiMeaning}
                                  </p>

                                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900/60 text-xs border border-slate-200/60 dark:border-slate-700/50">
                                    <p className="font-hanzi font-semibold text-slate-800 dark:text-slate-100">
                                      {linkedWord.example.hanzi}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                      {linkedWord.example.thai}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                  <button
                                    onClick={() => handlePlayWordAudio(linkedWord.hanzi, selectedLearnLevel, 1.0)}
                                    className="px-2.5 py-1 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>ฟังคำนี้</span>
                                  </button>
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ✓ บันทึกเป็นคำพ่วงแล้ว
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Spaced Repetition Self-Assessment (1, 3, 5) */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs space-y-2 border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold block text-slate-700 dark:text-slate-300">
                    ระดับความจำคำนี้ (สำหรับระบบ Spaced Repetition):
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { playClickSound(); rateWordRetention(activeMainWord.id, 1); }}
                      className={`flex-1 py-1.5 rounded-xl text-center font-semibold transition-all ${
                        stats.wordReviewScores[activeMainWord.id] === 1
                          ? 'bg-rose-500 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-rose-50'
                      }`}
                    >
                      1: จำยาก
                    </button>
                    <button
                      onClick={() => { playClickSound(); rateWordRetention(activeMainWord.id, 3); }}
                      className={`flex-1 py-1.5 rounded-xl text-center font-semibold transition-all ${
                        stats.wordReviewScores[activeMainWord.id] === 3 || !stats.wordReviewScores[activeMainWord.id]
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-indigo-50'
                      }`}
                    >
                      3: พอจำได้
                    </button>
                    <button
                      onClick={() => { playClickSound(); rateWordRetention(activeMainWord.id, 5); }}
                      className={`flex-1 py-1.5 rounded-xl text-center font-semibold transition-all ${
                        stats.wordReviewScores[activeMainWord.id] === 5
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
                      }`}
                    >
                      5: แม่นยำ
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeLevelTask?.audioListened ? '✓ ฟังเสียงแล้ว' : 'แตะปุ่มลำโพงเพื่อบันทึกการฟัง'}
                </span>
                <button
                  onClick={() => setSelectedLearnLevel(null)}
                  className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-transform active:scale-95"
                >
                  เสร็จสิ้นบทเรียนนี้
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: DAILY MINI-QUIZ (3 ข้อ) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isQuizModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {!quizFinished ? (
                <div>
                  {/* Quiz Progress Header */}
                  <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-bold">
                        Daily Mini-Quiz (ข้อที่ {currentQuizIndex + 1} จาก {quizQuestions.length})
                      </span>
                    </div>
                    <button
                      onClick={() => setIsQuizModalOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Content */}
                  {quizQuestions[currentQuizIndex] && (
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 inline-block mb-2">
                          {quizQuestions[currentQuizIndex].type === 'ANTONYM_MATCH'
                            ? 'ทดสอบคำตรงข้าม'
                            : quizQuestions[currentQuizIndex].type === 'FILL_BLANK'
                            ? 'เติมคำในประโยค'
                            : 'ความหมายของคำ'}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                          {quizQuestions[currentQuizIndex].prompt}
                        </h3>
                        {quizQuestions[currentQuizIndex].questionDetail && (
                          <p className="mt-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {quizQuestions[currentQuizIndex].questionDetail}
                          </p>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {quizQuestions[currentQuizIndex].options.map((opt, idx) => {
                          const isChosen = selectedOption === opt;
                          const isCorrectOpt = opt === quizQuestions[currentQuizIndex].correctAnswer;

                          let btnStyle = 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100 hover:border-indigo-400';

                          if (quizAnswered) {
                            if (isCorrectOpt) {
                              btnStyle = 'bg-emerald-500 text-white border-emerald-600';
                            } else if (isChosen && !isCorrectOpt) {
                              btnStyle = 'bg-rose-500 text-white border-rose-600';
                            } else {
                              btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                            }
                          }

                          return (
                            <motion.button
                              key={idx}
                              whileHover={!quizAnswered ? { scale: 1.01 } : {}}
                              whileTap={!quizAnswered ? { scale: 0.99 } : {}}
                              disabled={quizAnswered}
                              onClick={() => handleSelectQuizOption(opt)}
                              className={`w-full p-3.5 rounded-2xl border text-sm font-semibold text-left transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizAnswered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Explanation Callout */}
                      {quizAnswered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3.5 rounded-2xl text-xs ${
                            isAnswerCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <strong className="block mb-0.5">
                            {isAnswerCorrect ? '🎉 ถูกต้อง!' : '❌ ยังไม่ถูกต้อง'}
                          </strong>
                          <span>{quizQuestions[currentQuizIndex].explanation}</span>
                        </motion.div>
                      )}

                      {/* Next button */}
                      {quizAnswered && (
                        <div className="pt-2">
                          <button
                            onClick={handleNextQuizQuestion}
                            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>{currentQuizIndex + 1 < quizQuestions.length ? 'ข้อถัดไป' : 'ดูผลคะแนนและรับ Stack'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Celebration Finished View */
                <div className="p-6 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30"
                  >
                    <Flame className="w-10 h-10 text-white fill-current animate-bounce" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      ยินดีด้วย! ภารกิจสำเร็จ
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      คุณทำคะแนนได้ {quizScore} / {quizQuestions.length} ข้อในมินิควิซประจำวัน
                    </p>
                  </div>

                  {/* Streak Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-300 dark:border-amber-800 text-center">
                    <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold uppercase tracking-wider">
                      ความต่อเนื่องประจำวัน
                    </span>
                    <div className="text-4xl font-black text-amber-600 dark:text-amber-400 mt-1">
                      🔥 {stats.streak} วันติดต่อกัน!
                    </div>
                    {stats.streak % 7 === 0 && (
                      <p className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-2">
                        🛡️ ปลดล็อกเกราะน้ำแข็ง (Streak Shield) เพิ่ม 1 ชิ้น!
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setIsQuizModalOpen(false)}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md"
                  >
                    กลับสู่หน้าหลัก
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: WORD INSPECT POPUP (From Vocab Vault) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {inspectWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setInspectWord(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  HSK {inspectWord.hskLevel}
                </span>
                <span className="text-xs text-slate-400">{inspectWord.partOfSpeech}</span>
              </div>

              <div className="text-center py-2">
                <h3 className="text-5xl font-black font-hanzi text-slate-900 dark:text-white">
                  {inspectWord.hanzi}
                </h3>
                <div className="text-xl font-bold mt-1">
                  {renderToneColoredPinyin(inspectWord.pinyin)}
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 font-medium mt-1">
                  {inspectWord.thaiMeaning}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs space-y-1">
                <span className="font-semibold text-slate-400 block">ตัวอย่างประโยค:</span>
                <p className="font-hanzi font-bold text-sm text-slate-900 dark:text-white">
                  {inspectWord.example.hanzi}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {inspectWord.example.pinyin}
                </p>
                <p className="text-slate-700 dark:text-slate-200 font-medium pt-0.5">
                  "{inspectWord.example.thai}"
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handlePlayWordAudio(inspectWord.hanzi)}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>ออกเสียงคำศัพท์</span>
                </button>
                <button
                  onClick={() => handlePlayWordAudio(inspectWord.example.hanzi)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>ออกเสียงประโยค</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: IMPORT JSON MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-500" />
                  <span>นำเข้าคำศัพท์ผ่าน JSON (Custom Import)</span>
                </h3>
                <button onClick={() => setShowImportModal(false)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                วาง JSON Array ของ VocabWord ที่มีฟิลด์ `id`, `hskLevel`, `hanzi`, `pinyin`, `thaiMeaning`, `example`, `relatedWords`
              </p>

              <textarea
                rows={7}
                placeholder='[ { "id": "hsk1_custom_001", "hskLevel": 1, "pinyinLetter": "N", "pinyinSortKey": "ni", "hanzi": "你", "pinyin": "nǐ", "thaiMeaning": "คุณ, เธอ", "partOfSpeech": "สรรพนาม", "example": { "hanzi": "你好！", "pinyin": "Nǐ hǎo!", "thai": "สวัสดี!" }, "relatedWords": [] } ]'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    const res = importDatabaseJson(importJsonText);
                    if (res.success) {
                      setShowImportModal(false);
                      setImportJsonText('');
                    } else {
                      alert('นำเข้าล้มเหลว: ' + res.error);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  ยืนยันการนำเข้า
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
