import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Trophy, Flame, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types/hsk';
import { ColoredPinyin } from '../../utils/pinyinToneHelper';
import {
  speakChinese,
  playCorrectSound,
  playWrongSound,
  playCelebrationSound,
  playClickSound,
} from '../../utils/soundAndTts';

interface DailyQuizModalProps {
  questions: QuizQuestion[];
  onCompleteQuiz: () => { success: boolean; earnedShield: boolean; newStreak: number };
  onClose: () => void;
}

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({
  questions,
  onCompleteQuiz,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    success: boolean;
    earnedShield: boolean;
    newStreak: number;
  } | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 text-center space-y-3 sm:space-y-4">
          <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto" />
          <p className="font-thai text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            ยังไม่มีข้อสอบมินิควิซสำหรับวันนี้ กรุณาเรียนคำศัพท์ HSK ให้ครบทั้ง 3 ระดับก่อน
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-thai font-bold text-xs sm:text-sm"
          >
            ปิด
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
      setScore((prev) => prev + 1);
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const result = onCompleteQuiz();
      setQuizResult(result);
      setIsFinished(true);
      playCelebrationSound();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-900/10 dark:border-white/10 p-4 sm:p-6 shadow-2xl my-auto max-h-[96dvh] overflow-y-auto">
        {!isFinished ? (
          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  ข้อ {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-[11px] sm:text-xs font-thai text-slate-400 font-semibold truncate max-w-[170px] sm:max-w-none">
                  {currentQ.type === 'ANTONYM_MATCH'
                    ? 'จับคู่คำตรงข้าม'
                    : currentQ.type === 'FILL_BLANK'
                    ? 'เติมคำในช่องว่าง'
                    : 'เลือกความหมายที่ถูกต้อง'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Progress */}
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 flex gap-1 sm:gap-1.5 mb-4 sm:mb-5">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    idx < currentIndex
                      ? 'bg-emerald-500'
                      : idx === currentIndex
                      ? 'bg-indigo-600'
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Question Card */}
            <div className="text-center py-1 sm:py-2 space-y-1 sm:space-y-1.5">
              <p className="font-thai text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                {currentQ.prompt}
              </p>
              {currentQ.questionDetail && (
                <p className="font-mono text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                  {currentQ.questionDetail}
                </p>
              )}
              {currentQ.targetWordHanzi && (
                <div className="pt-1 sm:pt-2">
                  <span
                    onClick={() => speakChinese(currentQ.targetWordHanzi, 1.0)}
                    className="cursor-pointer font-hanzi font-black text-5xl min-[360px]:text-6xl text-slate-900 dark:text-white hover:scale-105 inline-block transition-transform leading-none"
                    title="แตะเพื่อฟังเสียง"
                  >
                    {currentQ.targetWordHanzi}
                  </span>
                </div>
              )}
            </div>

            {/* Choices with Accessible Touch Targets (min 48px) */}
            <div className="space-y-2 sm:space-y-2.5 mt-4 sm:mt-5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQ.correctAnswer;

                let optionClass =
                  'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

                if (isAnswered) {
                  if (isCorrect) {
                    optionClass =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 shadow-sm';
                  } else if (isSelected) {
                    optionClass =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300';
                  } else {
                    optionClass = 'opacity-40 border-slate-200 dark:border-slate-800';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full min-h-[46px] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 font-thai font-bold text-xs sm:text-sm flex items-center justify-between text-left transition-all active:scale-[0.98] ${optionClass}`}
                  >
                    <span className="pr-2 leading-snug">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation on Answer */}
            {isAnswered && (
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-[11px] sm:text-xs font-thai text-indigo-900 dark:text-indigo-200">
                <span className="font-bold block mb-0.5">💡 คำอธิบาย:</span>
                <span className="leading-relaxed">{currentQ.explanation}</span>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full mt-3.5 sm:mt-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-thai font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all min-h-[46px]"
              >
                <span>{currentIndex + 1 === questions.length ? 'สรุปผลคะแนน' : 'ข้อถัดไป'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Victory Celebration Screen */
          <div className="text-center py-2 sm:py-4 space-y-3 sm:space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-500 shadow-xl">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
            </div>

            <div>
              <h3 className="font-thai font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                ยอดเยี่ยม! ทำควิซสำเร็จ
              </h3>
              <p className="font-thai text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                ตอบถูก <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-base sm:text-lg">{score}</span> / {questions.length} ข้อ
              </p>
            </div>

            {quizResult?.success ? (
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 font-thai font-bold text-xs sm:text-sm">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500 shrink-0" />
                <span>สแตกสะสมกลายเป็น {quizResult.newStreak} วันแล้ว! 🔥</span>
              </div>
            ) : (
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center text-amber-800 dark:text-amber-300 font-thai text-xs font-semibold leading-relaxed">
                <span>⚠️ ทำแบบฝึกหัดเสร็จสิ้น แต่ยังขาดการเรียนและฟังเสียงให้ครบ 3 ระดับ สแตกจึงยังไม่ถูกบันทึก</span>
              </div>
            )}

            {quizResult?.earnedShield && (
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center gap-1.5 sm:gap-2 text-sky-700 dark:text-sky-300 font-thai text-[11px] sm:text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                <span>คุณได้รับ Streak Shield เกราะป้องกันสตรีคเพิ่ม 1 ชิ้น!</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-thai font-black text-xs sm:text-sm active:scale-95 transition-all shadow-md min-h-[46px]"
            >
              กลับสู่ภารกิจประจำวัน
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
