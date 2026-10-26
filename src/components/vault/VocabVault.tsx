import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Volume2,
  Filter,
  LayoutGrid,
  List,
  Star,
  CheckCircle2,
  X,
  Sparkles,
  Link2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VocabWord, HSKLevel } from '../../types/hsk';
import { ColoredPinyin } from '../../utils/pinyinToneHelper';
import { speakChinese, playClickSound } from '../../utils/soundAndTts';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const VocabVault: React.FC = () => {
  const { vocabDatabase, stats, toggleBookmark } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | HSKLevel>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UNLEARNED' | 'LEARNED' | 'BOOKMARKED'>('ALL');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'spacious'>('grid');
  const [inspectWord, setInspectWord] = useState<VocabWord | null>(null);
  const [displayLimit, setDisplayLimit] = useState(60);

  useEffect(() => {
    setDisplayLimit(60);
  }, [searchTerm, selectedLevel, selectedStatus, selectedLetter]);

  const filteredWords = useMemo(() => {
    return vocabDatabase.filter((w) => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.thaiMeaning.toLowerCase().includes(q) ||
        w.pinyinLetter.toLowerCase() === q;

      const matchLevel = selectedLevel === 'ALL' || w.hskLevel === selectedLevel;

      const status = stats.wordStatuses[w.id] || 'UNLEARNED';
      const isBookmarked = stats.bookmarks.includes(w.id);

      let matchStatus = true;
      if (selectedStatus === 'LEARNED') {
        matchStatus = status === 'LEARNED_AS_MAIN' || status === 'LEARNED_AS_LINKED';
      } else if (selectedStatus === 'UNLEARNED') {
        matchStatus = status === 'UNLEARNED';
      } else if (selectedStatus === 'BOOKMARKED') {
        matchStatus = isBookmarked;
      }

      const matchLetter = selectedLetter === 'ALL' || w.pinyinLetter === selectedLetter;

      return matchSearch && matchLevel && matchStatus && matchLetter;
    });
  }, [vocabDatabase, stats, searchTerm, selectedLevel, selectedStatus, selectedLetter]);

  const visibleWords = useMemo(() => {
    return filteredWords.slice(0, displayLimit);
  }, [filteredWords, displayLimit]);

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakChinese(text, 1.0);
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    toggleBookmark(id);
  };

  return (
    <div className="space-y-3.5 sm:space-y-4 max-w-3xl mx-auto px-3 sm:px-4 pt-2 sm:pt-3 pb-24 sm:pb-28">
      {/* Sticky Top Search & Filter Bar */}
      <div className="sticky top-14 sm:top-16 z-30 backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 py-2 sm:py-2.5 border-b border-slate-200/80 dark:border-slate-800/80 space-y-2 sm:space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาตัวจีน, พินอิน หรือคำแปล..."
              className="w-full pl-9 pr-8 py-2 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-thai text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grid / Spacious Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => { playClickSound(); setViewMode('grid'); }}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-400'
              }`}
              title="มุมมองตาราง"
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => { playClickSound(); setViewMode('spacious'); }}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${
                viewMode === 'spacious'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-400'
              }`}
              title="มุมมองรายการพร้อมตัวอย่าง"
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Level & Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none touch-scroll text-[11px] sm:text-xs font-thai font-semibold">
          {/* Level Filters */}
          {(['ALL', 1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => { playClickSound(); setSelectedLevel(lvl); }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shrink-0 transition-all ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              {lvl === 'ALL' ? 'ทุกระดับ HSK' : `HSK ${lvl}`}
            </button>
          ))}

          <span className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 shrink-0 mx-0.5" />

          {/* Status Filters */}
          {[
            { id: 'ALL', label: 'ทั้งหมด' },
            { id: 'LEARNED', label: 'เรียนแล้ว' },
            { id: 'UNLEARNED', label: 'ยังไม่เรียน' },
            { id: 'BOOKMARKED', label: 'บันทึกไว้' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => { playClickSound(); setSelectedStatus(st.id as any); }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shrink-0 transition-all ${
                selectedStatus === st.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Horizontal A-Z Snap Scroll Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none touch-scroll">
          <button
            onClick={() => { playClickSound(); setSelectedLetter('ALL'); }}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[11px] sm:text-xs font-mono font-bold shrink-0 transition-all ${
              selectedLetter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            All
          </button>
          {ALPHABET.map((char) => (
            <button
              key={char}
              onClick={() => { playClickSound(); setSelectedLetter(char); }}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[11px] sm:text-xs font-mono font-bold shrink-0 transition-all ${
                selectedLetter === char
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Vocab List or Grid (Fluid Multi-Column) */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-12 sm:py-16 space-y-2">
          <p className="font-thai text-xs sm:text-sm text-slate-400">ไม่พบคำศัพท์ที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Modern Compact Grid View: 2 columns on small phones, 3 on tablets, 4 on desktop */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
          {visibleWords.map((word) => {
            const status = stats.wordStatuses[word.id] || 'UNLEARNED';
            const isBookmarked = stats.bookmarks.includes(word.id);

            return (
              <div
                key={word.id}
                onClick={() => setInspectWord(word)}
                className="cursor-pointer group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col justify-between shadow-sm transition-all duration-200 relative min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      HSK {word.hskLevel}-{word.pinyinLetter}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => handleToggleStar(word.id, e)}
                        className={`p-1 rounded-md ${
                          isBookmarked
                            ? 'text-amber-400'
                            : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={(e) => handleSpeak(word.hanzi, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-hanzi font-black text-2xl min-[360px]:text-3xl text-slate-900 dark:text-white mt-1 leading-tight">
                    {word.hanzi}
                  </h4>
                  <ColoredPinyin pinyin={word.pinyin} className="text-[11px] sm:text-xs mt-0.5 truncate" />
                  <p className="font-thai text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                    {word.thaiMeaning}
                  </p>
                </div>

                {status !== 'UNLEARNED' && (
                  <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-thai">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {status === 'LEARNED_AS_LINKED' ? 'เรียนพ่วง' : 'เรียนแล้ว'}
                    </span>
                    {word.relatedWords && word.relatedWords.length > 0 && (
                      <span className="text-indigo-500 font-mono font-bold flex items-center gap-0.5">
                        <Link2 className="w-3 h-3" />
                        {word.relatedWords.length}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Spacious List View with Example Sentences */
        <div className="space-y-2.5 sm:space-y-3">
          {visibleWords.map((word) => {
            const status = stats.wordStatuses[word.id] || 'UNLEARNED';
            const isBookmarked = stats.bookmarks.includes(word.id);

            return (
              <div
                key={word.id}
                onClick={() => setInspectWord(word)}
                className="cursor-pointer p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm flex items-center justify-between gap-3 sm:gap-4 transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center font-hanzi font-black text-2xl sm:text-3xl text-slate-900 dark:text-white shrink-0">
                    {word.hanzi}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <ColoredPinyin pinyin={word.pinyin} className="text-xs sm:text-sm font-semibold" />
                      <span className="font-mono text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        HSK {word.hskLevel} • {word.pinyinLetter}
                      </span>
                      {status !== 'UNLEARNED' && (
                        <span className="text-[9px] sm:text-[10px] font-thai font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          {status === 'LEARNED_AS_LINKED' ? 'พ่วง' : 'แล้ว'}
                        </span>
                      )}
                    </div>
                    <p className="font-thai text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5 truncate">
                      {word.thaiMeaning}
                    </p>
                    {word.example && (
                      <p className="font-hanzi text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {word.example.hanzi} ({word.example.thai})
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button
                    onClick={(e) => handleToggleStar(word.id, e)}
                    className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
                      isBookmarked
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  </button>
                  <button
                    onClick={(e) => handleSpeak(word.hanzi, e)}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination / Load More Bar */}
      {filteredWords.length > displayLimit && (
        <div className="pt-4 pb-6 flex flex-col items-center gap-2">
          <p className="font-thai text-xs text-slate-500">
            แสดง {visibleWords.length} จากทั้งหมด {filteredWords.length.toLocaleString()} คำ
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => {
                playClickSound();
                setDisplayLimit((prev) => prev + 60);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-thai font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              แสดงเพิ่มอีก 60 คำ (+60)
            </button>
            <button
              onClick={() => {
                playClickSound();
                setDisplayLimit(filteredWords.length);
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-thai font-bold text-xs active:scale-95 transition-all"
            >
              แสดงทั้งหมด ({filteredWords.length.toLocaleString()} คำ)
            </button>
          </div>
        </div>
      )}

      {/* Word Detail Inspect Popup (Responsive) */}
      {inspectWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-900/10 dark:border-white/10 p-5 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 my-auto max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 sm:pb-3">
              <span className="font-mono text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                HSK {inspectWord.hskLevel} • หมวด {inspectWord.pinyinLetter}
              </span>
              <button
                onClick={() => setInspectWord(null)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-1 sm:py-2 space-y-1.5 sm:space-y-2">
              <h3 className="font-hanzi font-black text-5xl sm:text-6xl text-slate-900 dark:text-white">
                {inspectWord.hanzi}
              </h3>
              <ColoredPinyin pinyin={inspectWord.pinyin} className="text-lg sm:text-xl justify-center font-bold" />
              <p className="font-thai font-black text-base sm:text-lg text-slate-900 dark:text-white mt-1">
                {inspectWord.thaiMeaning}
              </p>
              <span className="text-[11px] sm:text-xs font-thai text-slate-400 block">
                ชนิดคำ: {inspectWord.partOfSpeech}
              </span>
            </div>

            {inspectWord.example && (
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-hanzi text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {inspectWord.example.hanzi}
                  </span>
                  <button
                    onClick={() => speakChinese(inspectWord.example.hanzi, 1.0)}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-mono text-[11px] sm:text-xs text-slate-500">{inspectWord.example.pinyin}</p>
                <p className="font-thai text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300">
                  {inspectWord.example.thai}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => speakChinese(inspectWord.hanzi, 1.0)}
                className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-indigo-600 text-white font-thai font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>ฟังเสียง (1.0x)</span>
              </button>
              <button
                onClick={() => speakChinese(inspectWord.hanzi, 0.65)}
                className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-500 text-white font-thai font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>ฟังเสียงช้า (0.65x)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
