import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialVocabDatabase } from '../data/seedDatabase';
import {
  DailyActivityRecord,
  DailyLevelTask,
  DailySession,
  HSKLevel,
  QuizQuestion,
  UserStats,
  VocabWord,
  WordStatus
} from '../types/hsk';

export interface DayStreakActivity {
  date: string;
  shortDate: string;
  dayOfWeek: string;
  wordsLearned: number;
  status: 'COMPLETED' | 'SHIELD_USED' | 'MISSED' | 'TODAY_PENDING';
  statusLabel: string;
  fillColor: string;
  isToday: boolean;
}

interface AppState {
  vocabDatabase: VocabWord[];
  stats: UserStats;
  currentSession: DailySession | null;
  quizQuestions: QuizQuestion[];
  isDarkMode: boolean;
  currentSimulatedDate: string; // YYYY-MM-DD
  activeTab: 'daily' | 'vault' | 'settings' | 'extra';
  toastMessage: string | null;

  // Actions
  initDailySession: (forceDate?: string) => void;
  markTaskViewed: (level: HSKLevel) => void;
  markTaskAudioPlayed: (level: HSKLevel) => void;
  completeDailyQuiz: () => { success: boolean; earnedShield: boolean; newStreak: number };
  toggleBookmark: (wordId: string) => void;
  rateWordRetention: (wordId: string, score: number) => void;
  simulateNextDay: () => void;
  toggleDarkMode: () => void;
  setActiveTab: (tab: 'daily' | 'vault' | 'settings' | 'extra') => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  importDatabaseJson: (jsonData: string) => { success: boolean; count?: number; error?: string };
  exportBackupJson: () => string;
  resetToDefault: () => void;
  getWordById: (id: string) => VocabWord | undefined;
  getLast30DaysActivity: () => DayStreakActivity[];
}

// Helper to get formatted local date string YYYY-MM-DD
function getLocalDateString(dateObj: Date = new Date()): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const THAI_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

// Generate 30 days of initial realistic activity history for rich visualization
function generateSeedActivityHistory(baseDateStr: string, initialStreak: number = 7): Record<string, DailyActivityRecord> {
  const history: Record<string, DailyActivityRecord> = {};
  const baseDate = new Date(baseDateStr + 'T00:00:00');

  for (let i = 29; i >= 1; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dStr = getLocalDateString(d);

    if (i <= initialStreak) {
      history[dStr] = {
        date: dStr,
        wordsLearned: 3 + (i % 3 === 0 ? 1 : 0),
        completed: true,
        shieldUsed: false
      };
    } else if (i === 14) {
      history[dStr] = {
        date: dStr,
        wordsLearned: 0,
        completed: false,
        shieldUsed: true
      };
    } else if (i % 5 === 0) {
      history[dStr] = {
        date: dStr,
        wordsLearned: 0,
        completed: false,
        shieldUsed: false
      };
    } else {
      history[dStr] = {
        date: dStr,
        wordsLearned: 3,
        completed: true,
        shieldUsed: false
      };
    }
  }

  return history;
}

// Calculate days between two YYYY-MM-DD strings
function getDaysDifference(d1: string, d2: string): number {
  const date1 = new Date(d1 + 'T00:00:00');
  const date2 = new Date(d2 + 'T00:00:00');
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Generator for 3 Daily Quiz Questions based on learned words
function generateQuizQuestions(
  words: VocabWord[],
  allWords: VocabWord[]
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  if (words.length === 0) return [];

  // Question 1: Antonym or Spectrum matching
  const wordWithRelation = words.find(w => w.relatedWords && w.relatedWords.length > 0) || words[0];
  const relation = wordWithRelation.relatedWords?.[0];

  if (relation) {
    const targetWord = allWords.find(w => w.id === relation.targetWordId);
    if (targetWord) {
      const isAntonym = relation.relationType === 'ANTONYM';
      const prompt = isAntonym
        ? `คำตรงข้ามของ 「${wordWithRelation.hanzi}」 (${wordWithRelation.pinyin} - ${wordWithRelation.thaiMeaning}) คือคำใด?`
        : `คำที่อยู่ในกลุ่ม/สเกลเดียวกับ 「${wordWithRelation.hanzi}」 (${relation.relationLabelThai}) คือคำใด?`;

      // Distractors
      const distractors = allWords
        .filter(w => w.id !== targetWord.id && w.id !== wordWithRelation.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => `${w.hanzi} (${w.pinyin} - ${w.thaiMeaning})`);

      const correctStr = `${targetWord.hanzi} (${targetWord.pinyin} - ${targetWord.thaiMeaning})`;
      const options = [...distractors, correctStr].sort(() => 0.5 - Math.random());

      questions.push({
        id: 'quiz_q1_' + Date.now(),
        type: isAntonym ? 'ANTONYM_MATCH' : 'SPECTRUM_ORDER',
        prompt,
        options,
        correctAnswer: correctStr,
        explanation: `「${wordWithRelation.hanzi}」 มีความสัมพันธ์เป็น ${relation.relationLabelThai} กับ 「${targetWord.hanzi}」`,
        targetWordHanzi: wordWithRelation.hanzi
      });
    }
  }

  // Question 2: Meaning Choice from another word
  const secondWord = words[1 % words.length];
  const prompt2 = `คำศัพท์ 「${secondWord.hanzi}」 (${secondWord.pinyin}) แปลว่าอะไร?`;
  const distractors2 = allWords
    .filter(w => w.id !== secondWord.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(w => w.thaiMeaning);
  const correctStr2 = secondWord.thaiMeaning;
  const options2 = [...distractors2, correctStr2].sort(() => 0.5 - Math.random());

  questions.push({
    id: 'quiz_q2_' + Date.now(),
    type: 'MEANING_CHOICE',
    prompt: prompt2,
    options: options2,
    correctAnswer: correctStr2,
    explanation: `「${secondWord.hanzi}」 (${secondWord.pinyin}) แปลว่า "${secondWord.thaiMeaning}" ตัวอย่าง: ${secondWord.example.hanzi}`,
    targetWordHanzi: secondWord.hanzi
  });

  // Question 3: Fill in the blank in example sentence
  const thirdWord = words[2 % words.length] || words[0];
  const sentenceWithBlank = thirdWord.example.hanzi.replace(thirdWord.hanzi, ' ______ ');
  const prompt3 = `เลือกคำศัพท์ที่ถูกต้องเติมลงในช่องว่าง:`;
  const questionDetail3 = `"${sentenceWithBlank}" (${thirdWord.example.thai})`;
  const distractors3 = allWords
    .filter(w => w.id !== thirdWord.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(w => `${w.hanzi} (${w.pinyin})`);
  const correctStr3 = `${thirdWord.hanzi} (${thirdWord.pinyin})`;
  const options3 = [...distractors3, correctStr3].sort(() => 0.5 - Math.random());

  questions.push({
    id: 'quiz_q3_' + Date.now(),
    type: 'FILL_BLANK',
    prompt: prompt3,
    questionDetail: questionDetail3,
    options: options3,
    correctAnswer: correctStr3,
    explanation: `ประโยคที่สมบูรณ์คือ "${thirdWord.example.hanzi}" (${thirdWord.example.pinyin}) แปลว่า "${thirdWord.example.thai}"`,
    targetWordHanzi: thirdWord.hanzi
  });

  return questions;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      vocabDatabase: initialVocabDatabase,
      stats: {
        streak: 7,
        maxStreak: 12,
        streakShields: 1, // Start with 1 welcome shield
        lastCompletedDate: null,
        totalDaysStudied: 22,
        totalWordsLearned: 24,
        bookmarks: ['hsk1_a_001', 'hsk1_y_001'],
        wordStatuses: {
          'hsk1_a_001': 'LEARNED_AS_MAIN',
          'hsk1_x_001': 'LEARNED_AS_LINKED',
          'hsk1_b_001': 'LEARNED_AS_MAIN',
          'hsk1_d_001': 'LEARNED_AS_MAIN',
          'hsk1_x_002': 'LEARNED_AS_LINKED'
        },
        wordReviewScores: {
          'hsk1_a_001': 5,
          'hsk1_d_001': 4
        },
        activityHistory: generateSeedActivityHistory(getLocalDateString(), 7)
      },
      currentSession: null,
      quizQuestions: [],
      isDarkMode: true, // Default modern dark theme
      currentSimulatedDate: getLocalDateString(),
      activeTab: 'daily',
      toastMessage: null,

      getWordById: (id: string) => {
        return get().vocabDatabase.find(w => w.id === id);
      },

      showToast: (msg: string) => {
        set({ toastMessage: msg });
        setTimeout(() => {
          if (get().toastMessage === msg) {
            set({ toastMessage: null });
          }
        }, 3500);
      },

      clearToast: () => set({ toastMessage: null }),

      toggleDarkMode: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        if (typeof document !== 'undefined') {
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      initDailySession: (forceDate?: string) => {
        const { vocabDatabase, stats, currentSession, currentSimulatedDate, showToast } = get();
        const targetDate = forceDate || currentSimulatedDate || getLocalDateString();

        // If today's session is already generated and matches the date, keep it
        if (currentSession && currentSession.date === targetDate) {
          return;
        }

        // Streak & Shield Integrity Check when switching to a new date
        let updatedStreak = stats.streak;
        let updatedShields = stats.streakShields;
        const updatedHistory = { ...(stats.activityHistory || {}) };

        if (stats.lastCompletedDate) {
          const daysDiff = getDaysDifference(stats.lastCompletedDate, targetDate);
          if (daysDiff > 1) {
            // User missed one or more days!
            if (updatedShields > 0) {
              updatedShields -= 1;
              const prevDate = new Date(targetDate + 'T00:00:00');
              prevDate.setDate(prevDate.getDate() - 1);
              const prevDateStr = getLocalDateString(prevDate);
              updatedHistory[prevDateStr] = {
                date: prevDateStr,
                wordsLearned: 0,
                completed: false,
                shieldUsed: true
              };
              showToast('🛡️ ใช้เกราะป้องกันไฟดับ (Streak Shield) เพื่อรักษา Stack ของคุณ!');
            } else {
              updatedStreak = 0;
              showToast('💔 พลาดการเรียนไปเกิน 1 วัน Stack จึงถูกรีเซ็ตเป็น 0');
            }
          }
        }

        const levels: HSKLevel[] = [1, 2, 3];
        const newTasks: Record<HSKLevel, DailyLevelTask> = {} as Record<HSKLevel, DailyLevelTask>;
        const bonusReviewWordIds: string[] = [];
        const sessionWords: VocabWord[] = [];

        levels.forEach(lvl => {
          // All words for this level, sorted alphabetically by pinyinSortKey
          const levelWords = vocabDatabase
            .filter(w => w.hskLevel === lvl)
            .sort((a, b) => a.pinyinSortKey.localeCompare(b.pinyinSortKey));

          let mainWord: VocabWord | undefined;
          let isSpacedRepetition = false;

          // Anti-duplicate Queue Algorithm:
          // Walk A-Z. Skip any words with LEARNED_AS_LINKED (and collect them to bonusReview)
          // Stop at the first UNLEARNED word.
          for (const word of levelWords) {
            const status: WordStatus = stats.wordStatuses[word.id] || 'UNLEARNED';
            if (status === 'UNLEARNED') {
              mainWord = word;
              break;
            } else if (status === 'LEARNED_AS_LINKED') {
              // Word was taught as a related word earlier! Skip it from daily quota, add to bonus review
              if (!bonusReviewWordIds.includes(word.id)) {
                bonusReviewWordIds.push(word.id);
              }
            }
          }

          // Level Asymmetry Fallback:
          // If no unlearned word remains in this level, switch to Spaced Repetition!
          if (!mainWord) {
            isSpacedRepetition = true;
            // Find word with lowest review score or least recent
            mainWord = [...levelWords].sort((a, b) => {
              const scoreA = stats.wordReviewScores[a.id] ?? 3;
              const scoreB = stats.wordReviewScores[b.id] ?? 3;
              return scoreA - scoreB;
            })[0] || levelWords[0];
          }

          if (mainWord) {
            sessionWords.push(mainWord);
            const linkedWordIds = (mainWord.relatedWords || []).map(r => r.targetWordId);
            
            // Also add linked words to session for quiz pool
            linkedWordIds.forEach(id => {
              const linkedWord = vocabDatabase.find(w => w.id === id);
              if (linkedWord && !sessionWords.some(w => w.id === linkedWord.id)) {
                sessionWords.push(linkedWord);
              }
            });

            newTasks[lvl] = {
              level: lvl,
              mainWordId: mainWord.id,
              linkedWordIds,
              viewed: false,
              audioListened: false,
              isSpacedRepetition
            };
          }
        });

        // Generate Quiz Questions for this day
        const quiz = generateQuizQuestions(sessionWords, vocabDatabase);

        set({
          currentSimulatedDate: targetDate,
          currentSession: {
            date: targetDate,
            tasks: newTasks,
            bonusReviewWords: bonusReviewWordIds,
            quizCompleted: false
          },
          quizQuestions: quiz,
          stats: {
            ...stats,
            streak: updatedStreak,
            streakShields: updatedShields,
            activityHistory: updatedHistory
          }
        });
      },

      markTaskViewed: (level: HSKLevel) => {
        const { currentSession, stats, vocabDatabase } = get();
        if (!currentSession) return;

        const task = currentSession.tasks[level];
        if (!task) return;

        const mainWordId = task.mainWordId;
        const linkedIds = task.linkedWordIds || [];

        const updatedWordStatuses = { ...stats.wordStatuses };
        updatedWordStatuses[mainWordId] = 'LEARNED_AS_MAIN';

        // Auto-assign LEARNED_AS_LINKED to related words so A-Z pointer skips them later
        linkedIds.forEach(lId => {
          if (!updatedWordStatuses[lId] || updatedWordStatuses[lId] === 'UNLEARNED') {
            updatedWordStatuses[lId] = 'LEARNED_AS_LINKED';
          }
        });

        // Calculate total learned words
        const totalLearned = Object.values(updatedWordStatuses).filter(
          s => s === 'LEARNED_AS_MAIN' || s === 'LEARNED_AS_LINKED'
        ).length;

        set({
          currentSession: {
            ...currentSession,
            tasks: {
              ...currentSession.tasks,
              [level]: {
                ...task,
                viewed: true
              }
            }
          },
          stats: {
            ...stats,
            wordStatuses: updatedWordStatuses,
            totalWordsLearned: totalLearned
          }
        });
      },

      markTaskAudioPlayed: (level: HSKLevel) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const task = currentSession.tasks[level];
        if (!task) return;

        set({
          currentSession: {
            ...currentSession,
            tasks: {
              ...currentSession.tasks,
              [level]: {
                ...task,
                audioListened: true
              }
            }
          }
        });
      },

      completeDailyQuiz: () => {
        const { currentSession, stats, showToast } = get();
        if (!currentSession) return { success: false, earnedShield: false, newStreak: stats.streak };

        // Requirements check: All 3 tasks must be viewed and listened to
        const tasks = Object.values(currentSession.tasks);
        const allCompleted = tasks.every(t => t.viewed && t.audioListened);

        if (!allCompleted) {
          showToast('⚠️ ต้องเปิดดูการ์ดและฟังเสียงให้ครบทั้ง 3 ระดับก่อนส่งแบบทดสอบ');
          return { success: false, earnedShield: false, newStreak: stats.streak };
        }

        const isNewDayCompletion = stats.lastCompletedDate !== currentSession.date;
        let newStreak = stats.streak;
        let earnedShield = false;
        let updatedShields = stats.streakShields;

        if (isNewDayCompletion) {
          newStreak = stats.streak + 1;
          // Award +1 shield every 7 streak days, max 2
          if (newStreak % 7 === 0 && updatedShields < 2) {
            updatedShields += 1;
            earnedShield = true;
          }
        }

        const maxStreak = Math.max(stats.maxStreak, newStreak);

        // Update Activity History for 30-day streak chart
        const updatedHistory = { ...(stats.activityHistory || {}) };
        updatedHistory[currentSession.date] = {
          date: currentSession.date,
          wordsLearned: 3 + (currentSession.bonusReviewWords?.length || 0),
          completed: true,
          shieldUsed: false
        };

        set({
          currentSession: {
            ...currentSession,
            quizCompleted: true
          },
          stats: {
            ...stats,
            streak: newStreak,
            maxStreak,
            streakShields: updatedShields,
            lastCompletedDate: currentSession.date,
            totalDaysStudied: isNewDayCompletion ? stats.totalDaysStudied + 1 : stats.totalDaysStudied,
            activityHistory: updatedHistory
          }
        });

        return { success: true, earnedShield, newStreak };
      },

      getLast30DaysActivity: () => {
        const { currentSimulatedDate, stats, currentSession } = get();
        const baseDate = new Date(currentSimulatedDate + 'T00:00:00');
        const history = stats.activityHistory || {};
        const result: DayStreakActivity[] = [];

        for (let i = 29; i >= 0; i--) {
          const d = new Date(baseDate);
          d.setDate(d.getDate() - i);
          const dateStr = getLocalDateString(d);
          const isToday = i === 0;
          const dayOfWeek = THAI_DAYS[d.getDay()];
          const shortDate = `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`;

          const record = history[dateStr];

          if (isToday) {
            if (currentSession?.quizCompleted || record?.completed) {
              result.push({
                date: dateStr,
                shortDate,
                dayOfWeek,
                wordsLearned: record?.wordsLearned || 3,
                status: 'COMPLETED',
                statusLabel: 'เรียนสำเร็จวันนี้ (+1 Stack)',
                fillColor: '#10b981', // emerald-500
                isToday: true
              });
            } else {
              result.push({
                date: dateStr,
                shortDate,
                dayOfWeek,
                wordsLearned: 0,
                status: 'TODAY_PENDING',
                statusLabel: 'วันนี้: กำลังรอทำภารกิจ',
                fillColor: '#f59e0b', // amber-500
                isToday: true
              });
            }
          } else if (record?.completed) {
            result.push({
              date: dateStr,
              shortDate,
              dayOfWeek,
              wordsLearned: record.wordsLearned || 3,
              status: 'COMPLETED',
              statusLabel: `สำเร็จ: เรียน ${record.wordsLearned || 3} คำ`,
              fillColor: '#6366f1', // indigo-500
              isToday: false
            });
          } else if (record?.shieldUsed) {
            result.push({
              date: dateStr,
              shortDate,
              dayOfWeek,
              wordsLearned: 0,
              status: 'SHIELD_USED',
              statusLabel: 'ใช้เกราะน้ำแข็งคุ้มครอง Stack',
              fillColor: '#0ea5e9', // sky-500
              isToday: false
            });
          } else {
            result.push({
              date: dateStr,
              shortDate,
              dayOfWeek,
              wordsLearned: 0,
              status: 'MISSED',
              statusLabel: 'ไม่ได้เข้าเรียน',
              fillColor: '#94a3b8', // slate-400
              isToday: false
            });
          }
        }

        return result;
      },

      toggleBookmark: (wordId: string) => {
        const { stats, showToast } = get();
        const isBookmarked = stats.bookmarks.includes(wordId);
        const updated = isBookmarked
          ? stats.bookmarks.filter(id => id !== wordId)
          : [...stats.bookmarks, wordId];

        set({
          stats: {
            ...stats,
            bookmarks: updated
          }
        });

        showToast(isBookmarked ? 'ยกเลิกการติดดาวคำศัพท์แล้ว' : '⭐ ติดดาวคำศัพท์ในคลังแล้ว');
      },

      rateWordRetention: (wordId: string, score: number) => {
        const { stats } = get();
        set({
          stats: {
            ...stats,
            wordReviewScores: {
              ...stats.wordReviewScores,
              [wordId]: score
            }
          }
        });
      },

      simulateNextDay: () => {
        const { currentSimulatedDate, showToast, initDailySession } = get();
        const currentDate = new Date(currentSimulatedDate + 'T00:00:00');
        currentDate.setDate(currentDate.getDate() + 1);
        const nextDateStr = getLocalDateString(currentDate);

        showToast(`⏩ จำลองเวลาเดินหน้าไปยังวันที่ ${nextDateStr}`);
        initDailySession(nextDateStr);
      },

      importDatabaseJson: (jsonData: string) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (!Array.isArray(parsed)) {
            return { success: false, error: 'ข้อมูล JSON ต้องเป็น Array ของ VocabWord' };
          }
          // Validate required fields on sample
          const isValid = parsed.every(w => w.id && w.hanzi && w.pinyin && w.thaiMeaning && w.hskLevel);
          if (!isValid) {
            return { success: false, error: 'รูปแบบข้อมูลไม่ถูกต้อง ขาด id, hanzi, pinyin หรือ thaiMeaning' };
          }

          // Merge by ID
          const currentMap = new Map(get().vocabDatabase.map(w => [w.id, w]));
          parsed.forEach(w => currentMap.set(w.id, w));
          const merged = Array.from(currentMap.values());

          set({ vocabDatabase: merged });
          get().showToast(`นำเข้าคำศัพท์สำเร็จ! ทั้งหมด ${merged.length} คำ`);
          return { success: true, count: merged.length };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Invalid JSON';
          return { success: false, error: message };
        }
      },

      exportBackupJson: () => {
        const state = get();
        const backup = {
          exportDate: new Date().toISOString(),
          stats: state.stats,
          vocabDatabase: state.vocabDatabase
        };
        return JSON.stringify(backup, null, 2);
      },

      resetToDefault: () => {
        set({
          vocabDatabase: initialVocabDatabase,
          stats: {
            streak: 0,
            maxStreak: 0,
            streakShields: 1,
            lastCompletedDate: null,
            totalDaysStudied: 0,
            totalWordsLearned: 0,
            bookmarks: [],
            wordStatuses: {},
            wordReviewScores: {},
            activityHistory: generateSeedActivityHistory(getLocalDateString(), 0)
          },
          currentSession: null,
          currentSimulatedDate: getLocalDateString()
        });
        get().initDailySession();
        get().showToast('รีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว');
      }
    }),
    {
      name: 'hsk-daily-stack-storage',
      partialize: (state) => ({
        vocabDatabase: state.vocabDatabase,
        stats: state.stats,
        currentSession: state.currentSession,
        currentSimulatedDate: state.currentSimulatedDate,
        isDarkMode: state.isDarkMode
      })
    }
  )
);
