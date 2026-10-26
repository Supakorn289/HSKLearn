export type HSKLevel = 1 | 2 | 3;

export type WordStatus = 'UNLEARNED' | 'LEARNED_AS_MAIN' | 'LEARNED_AS_LINKED';

export type RelationType = 'ANTONYM' | 'SPECTRUM' | 'SYNONYM_PAIR';

export interface ExampleSentence {
  hanzi: string;
  pinyin: string;
  thai: string;
}

export interface RelatedWordLink {
  targetWordId: string;
  relationType: RelationType;
  relationLabelThai: string; // เช่น "คำตรงข้าม", "ระดับต่ำกว่า", "ระดับสูงกว่า", "คำคู่กัน"
}

export interface VocabWord {
  id: string;              // เช่น "hsk1_a_001"
  hskLevel: HSKLevel;
  pinyinLetter: string;    // "A" - "Z"
  pinyinSortKey: string;   // พินอินตัดวรรณยุกต์สำหรับเรียงลำดับ เช่น "ai", "ba"
  hanzi: string;           // ตัวจีน เช่น "右"
  pinyin: string;          // พินอินมีวรรณยุกต์ เช่น "yòu"
  thaiMeaning: string;     // คำแปลไทย เช่น "ขวา, ด้านขวา"
  partOfSpeech: string;    // เช่น "คำนามบอกตำแหน่ง"
  example: ExampleSentence;
  relatedWords: RelatedWordLink[]; // ผูก ID ของคำตรงข้ามหรือคำกลุ่มเดียวกัน
}

export interface DailyLevelTask {
  level: HSKLevel;
  mainWordId: string;
  linkedWordIds: string[];
  viewed: boolean;
  audioListened: boolean;
  isSpacedRepetition?: boolean;
}

export interface DailySession {
  date: string; // "YYYY-MM-DD"
  tasks: Record<HSKLevel, DailyLevelTask>;
  bonusReviewWords: string[]; // คำที่ถูกข้ามเนื่องจากสถานะเป็น LEARNED_AS_LINKED
  quizCompleted: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'ANTONYM_MATCH' | 'MEANING_CHOICE' | 'FILL_BLANK' | 'SPECTRUM_ORDER';
  prompt: string;
  questionDetail?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  targetWordHanzi: string;
}

export interface DailyActivityRecord {
  date: string; // "YYYY-MM-DD"
  wordsLearned: number;
  completed: boolean;
  shieldUsed?: boolean;
}

export interface UserStats {
  streak: number;
  maxStreak: number;
  streakShields: number; // max 2
  lastCompletedDate: string | null; // "YYYY-MM-DD"
  totalDaysStudied: number;
  totalWordsLearned: number;
  bookmarks: string[]; // word IDs
  wordStatuses: Record<string, WordStatus>;
  wordReviewScores: Record<string, number>; // score 1-5 for spaced repetition
  activityHistory: Record<string, DailyActivityRecord>; // date -> activity record
}

