import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  BarChart3,
  ShieldAlert,
  Flame,
  Shield,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  FastForward,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useAppStore, DayStreakActivity } from '../../store/useAppStore';
import { playClickSound } from '../../utils/soundAndTts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DayStreakActivity }>;
}

const StreakTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 text-white border border-slate-700/80 p-2.5 sm:p-3 rounded-2xl shadow-xl text-xs backdrop-blur-md space-y-1 z-50 font-thai">
        <div className="flex items-center justify-between gap-3 border-b border-slate-700/60 pb-1 font-semibold text-slate-300">
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

export const SettingsAndStats: React.FC = () => {
  const {
    stats,
    vocabDatabase,
    getLast30DaysActivity,
    exportBackupJson,
    importDatabaseJson,
    loadFullVocabDirectly,
    simulateNextDay,
    resetToDefault,
    showToast,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLoadingFullVocab, setIsLoadingFullVocab] = useState(false);

  const activityData = getLast30DaysActivity();

  // Calculate level progress
  const hsk1Words = vocabDatabase.filter((w) => w.hskLevel === 1);
  const hsk2Words = vocabDatabase.filter((w) => w.hskLevel === 2);
  const hsk3Words = vocabDatabase.filter((w) => w.hskLevel === 3);

  const getLearnedCount = (words: typeof vocabDatabase) =>
    words.filter((w) => {
      const s = stats.wordStatuses[w.id];
      return s === 'LEARNED_AS_MAIN' || s === 'LEARNED_AS_LINKED';
    }).length;

  const hsk1Learned = getLearnedCount(hsk1Words);
  const hsk2Learned = getLearnedCount(hsk2Words);
  const hsk3Learned = getLearnedCount(hsk3Words);

  const handleExport = () => {
    playClickSound();
    const jsonString = exportBackupJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hsk-daily-stack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON เรียบร้อยแล้ว');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importDatabaseJson(content);
        if (result.success) {
          showToast(`กู้คืนข้อมูลสำเร็จ! นำเข้า ${result.count || 0} คำศัพท์`);
        } else {
          showToast(`เกิดข้อผิดพลาด: ${result.error || 'ไฟล์ไม่ถูกต้อง'}`);
        }
      } catch (err) {
        showToast('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleLoadFullVocab = async () => {
    playClickSound();
    setIsLoadingFullVocab(true);
    const res = await loadFullVocabDirectly();
    setIsLoadingFullVocab(false);
    if (res.success) {
      showToast(`⚡ โหลดคลังคำศัพท์สมบูรณ์สำเร็จ! รวม ${res.count} คำ`);
    }
  };

  const handleSimulateNextDay = () => {
    playClickSound();
    simulateNextDay();
  };

  const handleConfirmReset = () => {
    playClickSound();
    resetToDefault();
    setShowResetConfirm(false);
    showToast('รีเซ็ตข้อมูลทั้งหมดกลับคืนค่าเริ่มต้นเรียบร้อยแล้ว');
  };

  const chartData = activityData.map((d) => ({
    ...d,
    displayHeight: d.wordsLearned > 0 ? d.wordsLearned : 0.35,
  }));

  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto px-3 sm:px-4 pt-2 sm:pt-3 pb-32 sm:pb-36">
      {/* 30-Day Activity Graph */}
      <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-900/10 dark:border-white/10 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-thai font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                สถิติความสม่ำเสมอ 30 วัน
              </h3>
              <p className="font-thai text-[11px] sm:text-xs text-slate-500">
                ประวัติการเรียนสแตกและเกราะป้องกันย้อนหลัง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-thai font-semibold flex-wrap">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500" /> สำเร็จ
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-500" /> ใช้เกราะ
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500" /> วันนี้
            </span>
          </div>
        </div>

        <div className="w-full h-44 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
              <XAxis dataKey="shortDate" stroke="#94a3b8" fontSize={9} tickLine={false} interval="preserveStartEnd" />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} domain={[0, 4]} />
              <Tooltip content={<StreakTooltip />} />
              <Bar dataKey="displayHeight" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fillColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Level Breakdown Progress */}
      <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-900/10 dark:border-white/10 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
        <h3 className="font-thai font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>ความก้าวหน้าตามระดับ HSK (A-Z)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {[
            {
              level: 'HSK 1',
              learned: hsk1Learned,
              total: hsk1Words.length,
              color: 'bg-sky-500',
              textColor: 'text-sky-600 dark:text-sky-400',
            },
            {
              level: 'HSK 2',
              learned: hsk2Learned,
              total: hsk2Words.length,
              color: 'bg-emerald-500',
              textColor: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              level: 'HSK 3',
              learned: hsk3Learned,
              total: hsk3Words.length,
              color: 'bg-violet-500',
              textColor: 'text-violet-600 dark:text-violet-400',
            },
          ].map((item) => {
            const percent = item.total > 0 ? Math.round((item.learned / item.total) * 100) : 0;
            return (
              <div
                key={item.level}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5 sm:space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className={`font-mono text-xs font-black ${item.textColor}`}>{item.level}</span>
                  <span className="font-mono text-xs font-bold text-slate-500">{percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent}%` }} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-thai text-slate-500 block">
                  {item.learned} จาก {item.total} คำ
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Backup & Restore JSON */}
      <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-900/10 dark:border-white/10 p-4 sm:p-6 shadow-sm space-y-2.5 sm:space-y-3">
        <h3 className="font-thai font-black text-sm sm:text-base text-slate-900 dark:text-white">
          สำรองข้อมูล & กู้คืน (Backup / Restore)
        </h3>
        <p className="font-thai text-[11px] sm:text-xs text-slate-500">
          สามารถสำรองข้อมูลความก้าวหน้าทั้งหมดเป็นไฟล์ JSON หรือโหลดคลังคำศัพท์ HSK 1-3 สมบูรณ์ (2,294 คำ)
        </p>

        {/* 1-Click Load Full Vocab Button */}
        <button
          onClick={handleLoadFullVocab}
          disabled={isLoadingFullVocab || vocabDatabase.length >= 2294}
          className={`w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border font-thai font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[46px] ${
            vocabDatabase.length >= 2294
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 opacity-90'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-slate-900 shadow-md'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>
            {vocabDatabase.length >= 2294
              ? `✓ โหลดคลังคำศัพท์ครบสมบูรณ์แล้ว (${vocabDatabase.length} คำ)`
              : isLoadingFullVocab
              ? 'กำลังโหลดคลังคำศัพท์ 2,294 คำ...'
              : '⚡ โหลดคลังคำศัพท์สมบูรณ์ HSK 1-3 (2,294 คำ) ในคลิกเดียว'}
          </span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
          <button
            onClick={handleExport}
            className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-thai font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[46px]"
          >
            <Download className="w-4 h-4" />
            <span>สำรองข้อมูลเป็น JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-thai font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[46px]"
          >
            <Upload className="w-4 h-4" />
            <span>นำเข้าข้อมูลจาก JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </section>

      {/* Developer & Simulation Zone */}
      <section className="rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-900/10 dark:border-white/10 p-4 sm:p-6 space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="font-thai font-black text-sm sm:text-base">จำลองเวลา & ทดสอบระบบ (Simulation)</h3>
        </div>
        <p className="font-thai text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          ทดสอบความต่อเนื่องของสตรีค เกราะป้องกันสตรีค (Streak Shield) และการจัดคิวคำศัพท์ A-Z วันถัดไป
        </p>
        <button
          onClick={handleSimulateNextDay}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-thai font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-indigo-600/20 min-h-[42px]"
        >
          <FastForward className="w-4 h-4" />
          <span>จำลองเดินหน้าไปวันถัดไป (+1 วัน)</span>
        </button>
      </section>

      {/* Factory Reset Zone */}
      <section className="rounded-2xl sm:rounded-3xl bg-rose-500/5 border-2 border-rose-500/20 p-4 sm:p-6 space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="font-thai font-black text-sm sm:text-base">รีเซ็ตข้อมูลเริ่มต้น (Factory Reset)</h3>
        </div>
        <p className="font-thai text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          ล้างสถิติ สแตกสะสม และประวัติคำศัพท์ที่เรียนแล้วทั้งหมดกลับคืนสู่ค่าเริ่มต้นจากระบบ
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-thai font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-rose-600/20 min-h-[42px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>รีเซ็ตข้อมูลทั้งหมด</span>
        </button>
      </section>

      {/* Factory Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-500/40 p-5 sm:p-6 shadow-2xl text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h4 className="font-thai font-black text-base sm:text-lg text-slate-900 dark:text-white">
              ยืนยันการล้างข้อมูลทั้งหมด?
            </h4>
            <p className="font-thai text-xs text-slate-500 leading-relaxed">
              การกระทำนี้จะล้างสถิติ Streak Shield บันทึกคำศัพท์ และประวัติการเรียนทั้งหมดและไม่สามารถย้อนคืนได้
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 sm:py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-thai font-bold text-xs min-h-[44px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 sm:py-3 rounded-xl bg-rose-600 text-white font-thai font-bold text-xs shadow-md shadow-rose-600/30 min-h-[44px]"
              >
                ยืนยันการล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
