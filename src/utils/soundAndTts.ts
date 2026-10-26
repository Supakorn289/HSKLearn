/**
 * Sound synthesis and Text-To-Speech (Web Speech API + Web Audio API)
 * Fully offline-capable, requires no external MP3 dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Text-to-Speech for Chinese Mandarin (zh-CN)
 * Supports normal speed (1.0) and slow speed (0.65)
 */
export function speakChinese(text: string, rate: number = 1.0): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Select zh-CN voice if available
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang.startsWith('zh') || v.lang.includes('CN') || v.lang.includes('cmn'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

/**
 * Card flip swoosh sound effect
 */
export function playFlipSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Ignore audio playback constraints
  }
}

/**
 * Correct answer chime sound (C5 -> E5 -> G5)
 */
export function playCorrectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime + idx * 0.08;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    });
  } catch {
    // Audio context may be blocked
  }
}

/**
 * Wrong answer error buzz
 */
export function playWrongSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.22);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Ignore
  }
}

/**
 * Triumphant fanfare for streak increase & celebration
 */
export function playCelebrationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime + i * 0.09;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft UI tap sound
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Ignore
  }
}

/**
 * Determines tone number (1-4, or 5 for neutral) from pinyin characters
 */
export function getPinyinToneNumber(pinyinWord: string): 1 | 2 | 3 | 4 | 5 {
  if (/[āēīōūǖĀĒĪŌŪǕ]/.test(pinyinWord)) return 1;
  if (/[áéíóúǘÁÉÍÓÚǗ]/.test(pinyinWord)) return 2;
  if (/[ǎěǐǒǔǚǍĚǏǑǓǙ]/.test(pinyinWord)) return 3;
  if (/[àèìòùǜÀÈÌÒÙǛ]/.test(pinyinWord)) return 4;
  return 5;
}

/**
 * Returns Tailwind text colors for tone rendering
 */
export function getToneColorClass(tone: 1 | 2 | 3 | 4 | 5): string {
  switch (tone) {
    case 1:
      return 'text-sky-500 dark:text-sky-400 font-semibold'; // Tone 1: High & level (Sky Blue)
    case 2:
      return 'text-emerald-500 dark:text-emerald-400 font-semibold'; // Tone 2: Rising (Emerald Green)
    case 3:
      return 'text-amber-500 dark:text-amber-400 font-semibold'; // Tone 3: Falling-rising (Amber Orange)
    case 4:
      return 'text-rose-500 dark:text-rose-400 font-semibold'; // Tone 4: Falling (Rose Red)
    case 5:
    default:
      return 'text-slate-600 dark:text-slate-300'; // Neutral tone (Muted)
  }
}

/**
 * Returns tone badge representation
 */
export function getToneBadge(tone: 1 | 2 | 3 | 4 | 5): { label: string; bg: string; text: string } {
  switch (tone) {
    case 1:
      return { label: 'เสียง 1 (ˉ)', bg: 'bg-sky-100 dark:bg-sky-950/60', text: 'text-sky-700 dark:text-sky-300' };
    case 2:
      return { label: 'เสียง 2 (ˊ)', bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300' };
    case 3:
      return { label: 'เสียง 3 (ˇ)', bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300' };
    case 4:
      return { label: 'เสียง 4 (ˋ)', bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300' };
    default:
      return { label: 'เสียงเบา', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
  }
}
