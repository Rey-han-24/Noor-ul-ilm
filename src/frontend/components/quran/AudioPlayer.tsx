/**
 * Quran Audio Player Component
 * 
 * A beautiful, accessible audio player for Quran recitation.
 * Features verse-by-verse playback with autoplay option.
 * 
 * @module frontend/components/quran/AudioPlayer
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  QURAN_RECITERS, 
  ReciterId, 
  getAyahAudioUrl 
} from '@/backend/services/quran-audio';

interface AudioPlayerProps {
  /** Surah number (1-114) */
  surahNumber: number;
  /** Total ayahs in the surah */
  totalAyahs: number;
  /** Current ayah being viewed (for sync) */
  currentAyah?: number;
  /** Callback when ayah changes during playback */
  onAyahChange?: (ayahNumber: number) => void;
  /** Callback when player is closed */
  onClose?: () => void;
  /** Whether to show mini player */
  mini?: boolean;
}

/**
 * Quran Audio Player
 * 
 * Provides audio playback for Quran recitation with:
 * - Multiple reciter selection
 * - Verse-by-verse playback
 * - Continuous/repeat modes
 * - Progress bar with seek
 * - Keyboard shortcuts
 */
export default function AudioPlayer({
  surahNumber,
  totalAyahs,
  currentAyah = 1,
  onAyahChange,
  onClose,
  mini = false,
}: AudioPlayerProps) {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playingAyah, setPlayingAyah] = useState(currentAyah);
  const [reciter, setReciter] = useState<ReciterId>('ar.alafasy');
  const [autoplay, setAutoplay] = useState(true);
  const [repeatMode, setRepeatMode] = useState<'none' | 'ayah' | 'surah'>('none');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [volume, _setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle audio ended - defined before useEffect that uses it
  const handleAudioEnded = useCallback(() => {
    if (repeatMode === 'ayah') {
      // Repeat current ayah
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (autoplay && playingAyah < totalAyahs) {
      // Play next ayah
      const nextAyah = playingAyah + 1;
      setPlayingAyah(nextAyah);
      onAyahChange?.(nextAyah);
      setTimeout(() => audioRef.current?.play(), 100);
    } else if (repeatMode === 'surah' && playingAyah === totalAyahs) {
      // Restart surah
      setPlayingAyah(1);
      onAyahChange?.(1);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      setIsPlaying(false);
    }
  }, [playingAyah, totalAyahs, autoplay, repeatMode, onAyahChange]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Update audio source when ayah or reciter changes
  useEffect(() => {
    if (audioRef.current) {
      const url = getAyahAudioUrl(surahNumber, playingAyah, reciter);
      audioRef.current.src = url;
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [surahNumber, playingAyah, reciter, volume, playbackRate]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleAudioEnded();
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [handleAudioEnded]);

  // Update progress bar
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Play/Pause toggle
  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Playback failed:', error);
      }
    }
  }, [isPlaying]);

  // Play specific ayah
  const playAyah = useCallback(async (ayahNumber: number) => {
    setPlayingAyah(ayahNumber);
    onAyahChange?.(ayahNumber);
    
    // Wait for source to update, then play
    setTimeout(async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Playback failed:', error);
        }
      }
    }, 100);
  }, [onAyahChange]);

  // Skip to previous ayah
  const previousAyah = useCallback(() => {
    if (playingAyah > 1) {
      playAyah(playingAyah - 1);
    }
  }, [playingAyah, playAyah]);

  // Skip to next ayah
  const nextAyah = useCallback(() => {
    if (playingAyah < totalAyahs) {
      playAyah(playingAyah + 1);
    }
  }, [playingAyah, totalAyahs, playAyah]);

  // Seek to position
  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current reciter info
  const currentReciter = QURAN_RECITERS.find(r => r.id === reciter);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          previousAyah();
          break;
        case 'ArrowRight':
          nextAyah();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playingAyah, isPlaying, togglePlay, previousAyah, nextAyah]);

  // Mini player view
  if (mini) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] p-2">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--primary)] transition-transform hover:scale-105 disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </button>
        <span className="text-sm text-[var(--foreground-muted)]">
          Ayah {playingAyah}/{totalAyahs}
        </span>
      </div>
    );
  }

  // Full player view
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-xl border-t border-[var(--gold)]/20 bg-[var(--card-background)] p-4 shadow-2xl">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--foreground)]">
          Audio Recitation
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Reciter Selector */}
          <div className="relative">
            <button
              onClick={() => setShowReciterMenu(!showReciterMenu)}
              className="flex items-center gap-2 rounded-lg border border-[var(--gold)]/20 px-3 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--gold)]/40"
            >
              <span>{currentReciter?.name || 'Select Reciter'}</span>
              <ChevronDownIcon />
            </button>
            
            {showReciterMenu && (
              <div className="absolute bottom-full right-0 z-50 mb-1 max-h-64 w-64 overflow-y-auto rounded-lg border border-[var(--gold)]/20 bg-[var(--card-background)] py-1 shadow-xl">
                {QURAN_RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setReciter(r.id);
                      setShowReciterMenu(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--gold)]/10 ${
                      reciter === r.id ? 'bg-[var(--gold)]/5 text-[var(--gold)]' : 'text-[var(--foreground)]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">
                        {r.style} • {r.country}
                      </div>
                    </div>
                    {r.popular && (
                      <span className="rounded bg-[var(--gold)]/10 px-1.5 py-0.5 text-xs text-[var(--gold)]">
                        Popular
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--gold)]/10 hover:text-[var(--foreground)]"
              aria-label="Close audio player"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {/* Now Playing */}
      <div className="mb-4 text-center">
        <div className="mb-1 text-lg font-semibold text-[var(--gold)]">
          Ayah {playingAyah}
        </div>
        <div className="text-xs text-[var(--foreground-muted)]">
          of {totalAyahs} verses
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="mb-4 h-2 cursor-pointer rounded-full bg-[var(--gold)]/20"
        onClick={seekTo}
        role="slider"
        aria-label="Audio progress"
        aria-valuenow={progress}
        aria-valuemax={duration}
      >
        <div 
          className="h-full rounded-full bg-[var(--gold)] transition-all"
          style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="mb-4 flex justify-between text-xs text-[var(--foreground-muted)]">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous */}
        <button
          onClick={previousAyah}
          disabled={playingAyah <= 1}
          className="rounded-full p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/10 disabled:opacity-30"
          aria-label="Previous ayah"
        >
          <PreviousIcon />
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--primary)] shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <LoadingSpinner className="h-6 w-6" />
          ) : isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={nextAyah}
          disabled={playingAyah >= totalAyahs}
          className="rounded-full p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/10 disabled:opacity-30"
          aria-label="Next ayah"
        >
          <NextIcon />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="mt-4 flex items-center justify-center gap-4">
        {/* Autoplay Toggle */}
        <button
          onClick={() => setAutoplay(!autoplay)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            autoplay
              ? 'bg-[var(--gold)]/20 text-[var(--gold)]'
              : 'text-[var(--foreground-muted)] hover:bg-[var(--gold)]/10'
          }`}
          aria-label={autoplay ? 'Disable autoplay' : 'Enable autoplay'}
        >
          Autoplay {autoplay ? 'ON' : 'OFF'}
        </button>

        {/* Repeat Mode */}
        <button
          onClick={() => {
            const modes: ('none' | 'ayah' | 'surah')[] = ['none', 'ayah', 'surah'];
            const currentIndex = modes.indexOf(repeatMode);
            setRepeatMode(modes[(currentIndex + 1) % modes.length]);
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            repeatMode !== 'none'
              ? 'bg-[var(--gold)]/20 text-[var(--gold)]'
              : 'text-[var(--foreground-muted)] hover:bg-[var(--gold)]/10'
          }`}
          aria-label={`Repeat mode: ${repeatMode}`}
        >
          {repeatMode === 'none' && '🔁 Repeat OFF'}
          {repeatMode === 'ayah' && '🔂 Repeat Ayah'}
          {repeatMode === 'surah' && '🔁 Repeat Surah'}
        </button>

        {/* Playback Speed */}
        <select
          value={playbackRate}
          onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          className="rounded-lg border border-[var(--gold)]/20 bg-transparent px-2 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none"
          aria-label="Playback speed"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
        </select>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 text-center text-xs text-[var(--foreground-muted)]">
        <kbd className="rounded bg-[var(--gold)]/10 px-1.5 py-0.5">Space</kbd> Play/Pause
        <span className="mx-2">•</span>
        <kbd className="rounded bg-[var(--gold)]/10 px-1.5 py-0.5">←</kbd>
        <kbd className="rounded bg-[var(--gold)]/10 px-1.5 py-0.5">→</kbd> Navigate
      </div>
    </div>
  );
}

// Icon Components
function PlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function PreviousIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function LoadingSpinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
