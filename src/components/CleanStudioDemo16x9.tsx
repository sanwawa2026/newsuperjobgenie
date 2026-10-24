import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Volume2,
  VolumeX,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download
} from 'lucide-react';

interface CleanStudioDemo16x9Props {
  onClose?: () => void;
  autoStart?: boolean;
}

export const CleanStudioDemo16x9: React.FC<CleanStudioDemo16x9Props> = ({
  onClose,
  autoStart = true
}) => {
  const [mode, setMode] = useState<'avatar' | 'simulator'>('avatar');
  const [isPlaying, setIsPlaying] = useState<boolean>(autoStart);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(false);
  const [audioTrack, setAudioTrack] = useState<'38s' | '73s' | 'none'>('38s');

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const TOTAL_DURATION = mode === 'avatar' ? (audioTrack === '73s' ? 73 : 38) : 20;
  const CHROME_STORE_URL =
    'https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb';

  // Subtitle cues for the 38s cut
  const getSubtitles = (time: number) => {
    if (time < 3.5) return 'Stop shouting into the void. Fifty applications, zero replies.';
    if (time < 7.5) return 'Meet SuperJobGenie: the local-first AI built right into your browser.';
    if (time < 12.0) return 'Instant role alignment across 11,000+ characters of deep job description.';
    if (time < 18.0) return 'Discover high-paying adjacent tracks & generate tailored executive cover letters.';
    if (time < 26.0) return '100% Local Privacy. Zero resume data uploaded to external servers.';
    if (time < 35.0) return 'SuperJobGenie. Move faster. Switch tracks. Add to Chrome — it is free.';
    return 'Official v3.0 Live on Google Chrome Web Store.';
  };

  // Sync audio with video
  useEffect(() => {
    if (mode === 'avatar') {
      if (audioTrack === 'none' || isMuted) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        const audioSrc = audioTrack === '73s' ? '/audio/long_73s_master_mix.wav' : '/audio/short_38s_master_mix.wav';
        if (!audioRef.current || audioRef.current.src !== window.location.origin + audioSrc) {
          audioRef.current = new Audio(audioSrc);
          audioRef.current.currentTime = currentTime;
        }
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isPlaying, isMuted, audioTrack, mode]);

  // Audio synthesis for crisp tactile clicks (No external audio file dependency)
  const playMechanicalTick = (freq: number = 800) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            return TOTAL_DURATION;
          }
          const next = +(prev + 0.1).toFixed(1);
          if (mode === 'simulator' && (next === 5.0 || next === 10.0 || next === 15.0)) {
            playMechanicalTick(1200);
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMuted, TOTAL_DURATION, mode]);

  // Determine current active phase for simulator
  let activePhase = 1;
  if (currentTime >= 15.0) activePhase = 4;
  else if (currentTime >= 10.0) activePhase = 3;
  else if (currentTime >= 5.0) activePhase = 2;

  // Calculate needle angle
  let calculatedScore = 38;
  if (currentTime < 5.0) {
    calculatedScore = 38;
  } else if (currentTime < 9.0) {
    const progress = (currentTime - 5.0) / 4.0;
    calculatedScore = Math.round(38 + progress * (97 - 38));
  } else {
    calculatedScore = 97;
  }

  const needleRotation = -135 + (calculatedScore / 100) * 270;

  const handleTogglePlay = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      if (videoRef.current) videoRef.current.currentTime = 0;
      if (audioRef.current) audioRef.current.currentTime = 0;
      setIsPlaying(true);
    } else {
      const nextPlay = !isPlaying;
      setIsPlaying(nextPlay);
      if (videoRef.current) {
        if (nextPlay) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-[#0d0f11] text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono select-none border-2 border-[#333a40]"
    >
      {/* ========================================================================= */}
      {/* Top Studio Broadcast Bar                                                  */}
      {/* ========================================================================= */}
      <div className="h-11 bg-[#16191c] border-b border-[#282d32] px-3 sm:px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#ff4d15] animate-pulse shadow-[0_0_8px_#ff4d15]' : 'bg-[#6c757d]'}`} />
            <span className="text-[11px] font-bold tracking-widest text-[#d1d5db] uppercase hidden sm:inline">
              {isPlaying ? '16:9 MASTER STUDIO' : 'STANDBY'}
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-[#20252a] rounded-lg border border-[#343b42]">
            <button
              onClick={() => {
                setMode('avatar');
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition ${
                mode === 'avatar' ? 'bg-[#ff4d15] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Clean Avatar 1080p
            </button>
            <button
              onClick={() => {
                setMode('simulator');
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition ${
                mode === 'simulator' ? 'bg-[#ff4d15] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interactive HUD
            </button>
          </div>
        </div>

        {/* Center Indicators for mode */}
        {mode === 'avatar' ? (
          <div className="hidden md:flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              ✓ ARTIFACT REMOVED
            </span>
            <span className="text-neutral-500">|</span>
            <button
              onClick={() => setScanlines(!scanlines)}
              className={`px-2 py-0.5 rounded border transition ${
                scanlines ? 'bg-cyan-950 text-cyan-300 border-cyan-700' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}
            >
              CRT Scanlines: {scanlines ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setAudioTrack(prev => prev === '38s' ? '73s' : prev === '73s' ? 'none' : '38s')}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition"
              title="Switch audio narration track"
            >
              Audio: {audioTrack === '38s' ? '38s Master Mix' : audioTrack === '73s' ? '73s Long Mix' : 'Mute'}
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-[10px]">
            <span className={`px-2 py-0.5 rounded ${activePhase === 1 ? 'bg-red-950 text-red-400 border border-red-800' : 'text-neutral-500'}`}>
              01 BOT TRAP
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`px-2 py-0.5 rounded ${activePhase === 2 ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'text-neutral-500'}`}>
              02 11K SCAN
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`px-2 py-0.5 rounded ${activePhase === 3 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-neutral-500'}`}>
              03 97% PIVOT
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`px-2 py-0.5 rounded ${activePhase === 4 ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'text-neutral-500'}`}>
              04 VERIFIED
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <a
            href="/api/download-cool-webpage-zip"
            download="SuperJobGenie_Cool_Webpage_Desktop.zip"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ff4d15] hover:bg-[#e63e07] text-white text-[10px] font-bold uppercase rounded shadow transition"
            title="一键将炫酷网页打包下载到桌面，双击 index.html 即可本地离线全屏运行与高清录屏"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">下载炫酷网页 (ZIP)</span>
            <span className="sm:hidden">下载网页</span>
          </a>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 text-neutral-400 hover:text-white transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleFullscreen}
            className="p-1 text-neutral-400 hover:text-white transition"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] rounded"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 16:9 Main Stage: Either Clean Retro Avatar OR Interactive Hardware HUD    */}
      {/* ========================================================================= */}
      {mode === 'avatar' ? (
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Scrubbed Clean Video Player */}
          <video
            ref={videoRef}
            src="/assets/aistudio/hf_hero_scrub_fa42f989.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* CRT Scanline Overlay */}
          {scanlines && (
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.22)_0px,rgba(0,0,0,0.22)_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
          )}

          {/* CRT Curved Glass Vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.85)]" />

          {/* Top Left GoldStar Model Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs">
            <span className="font-bold text-white tracking-widest uppercase">GoldStar</span>
            <span className="text-neutral-400 text-[10px]">CM-1400 COLOR MONITOR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 shadow-[0_0_6px_#34d399]" />
          </div>

          {/* Top Right Live Spec */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-neutral-300 font-mono">
            <span>1920x1080 · 24FPS</span>
            <span className="text-[#ff4d15] font-bold">100% CLEAN</span>
          </div>

          {/* Subtitles Overlay Banner at Bottom */}
          <div className="absolute bottom-6 inset-x-4 flex justify-center pointer-events-none">
            <div className="max-w-2xl px-5 py-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-center shadow-2xl">
              <p className="text-sm sm:text-base font-sans font-medium text-white tracking-wide">
                {getSubtitles(currentTime)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-between gap-6 overflow-hidden bg-gradient-to-br from-[#121417] via-[#171a1e] to-[#0c0e10]">
          {/* Subtle technical background grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* ======================================================================= */}
        {/* LEFT COLUMN: Real-Time Hardware Rotary Dial Instrument (Teenage Eng.)   */}
        {/* ======================================================================= */}
        <div className="w-[45%] h-full flex flex-col justify-between z-10">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ff4d15] shadow-[0_0_6px_#ff4d15]" />
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                PRECISION DIAL V3
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
              DOM DEPTH: {activePhase === 1 ? '153 CHARS' : '11,480 CHARS'}
            </span>
          </div>

          {/* Rotary Dial Gauge */}
          <div className="relative flex items-center justify-center my-auto py-2">
            
            {/* Outer Instrument Ring */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#262c31] via-[#1c2024] to-[#121517] border-4 border-[#343b42] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_12px_30px_rgba(0,0,0,0.7)] flex items-center justify-center">
              
              {/* Dial Tick Marks */}
              {Array.from({ length: 41 }).map((_, i) => {
                const angle = -135 + (i / 40) * 270;
                const isMajor = i % 5 === 0;
                return (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-start pointer-events-none"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div
                      className={`w-[1.5px] rounded-full transition-colors duration-300 ${
                        isMajor
                          ? calculatedScore >= (i / 40) * 100
                            ? 'h-3 bg-[#ff4d15]'
                            : 'h-3 bg-neutral-600'
                          : calculatedScore >= (i / 40) * 100
                            ? 'h-1.5 bg-[#ff4d15]/60'
                            : 'h-1.5 bg-neutral-700'
                      }`}
                    />
                  </div>
                );
              })}

              {/* Rotary Needle */}
              <div
                className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="absolute w-1 sm:w-1.5 h-20 sm:h-24 bg-gradient-to-t from-[#ff4d15] to-[#ff7d47] -top-2 rounded-full shadow-[0_0_10px_#ff4d15]" />
              </div>

              {/* Center Core Display */}
              <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#0a0c0e] border-2 border-[#2f353b] flex flex-col items-center justify-center shadow-inner">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                  {activePhase === 1 ? 'ATS MISMATCH' : 'ROLE FIT'}
                </span>
                <span className={`text-3xl sm:text-4xl font-black tracking-tight font-sans transition-colors ${
                  calculatedScore > 80 ? 'text-[#ff4d15]' : 'text-red-400'
                }`}>
                  {calculatedScore}%
                </span>
                <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
                  {activePhase === 1 ? 'BOT REJECT' : 'INTERVIEW READY'}
                </span>
              </div>
            </div>
          </div>

          {/* Lower Dial Caption */}
          <div className="p-2.5 rounded-lg bg-[#14171a] border border-[#262c31] flex items-center justify-between text-xs">
            <span className="text-neutral-400">Status</span>
            <span className={`font-bold uppercase tracking-wider ${
              activePhase === 1 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {activePhase === 1 ? '⚠️ 153-Char Truncation' : '✓ 11K Full DOM Synced'}
            </span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: Cinematic Scene Transitions (Clean, High-Fidelity)        */}
        {/* ======================================================================= */}
        <div className="w-[55%] h-full flex flex-col justify-between z-10">

          {/* SCENE 1: The Traditional ATS Trap (0-5s) */}
          {activePhase === 1 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 shadow-lg">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>The 153-Character Trap</span>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-3">
                  Traditional ATS tools only read the initial API preview snippet, truncating your job description at 153 characters:
                </p>
                <div className="bg-black/60 p-3 rounded border border-red-900/40 text-[11px] font-mono text-red-300/90 leading-tight">
                  &quot;Seeking Senior Product Architect to lead platform engineering and multi-region...&quot; <span className="text-red-500 font-bold">[TRUNCATED - 98% LOST]</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-[#14171a] border border-red-900/40">
                  <div className="text-[10px] text-neutral-400 uppercase">Missing Keywords</div>
                  <div className="text-xl font-bold text-red-400 mt-1">12 Detected</div>
                </div>
                <div className="p-3 rounded-lg bg-[#14171a] border border-red-900/40">
                  <div className="text-[10px] text-neutral-400 uppercase">Bot Outcome</div>
                  <div className="text-xl font-bold text-red-400 mt-1">Auto-Filtered</div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 2: SuperJobGenie DOM Extraction (5-10s) */}
          {activePhase === 2 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-900/60 shadow-lg">
                <div className="flex items-center gap-2 text-[#ff4d15] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-[#ff4d15]" />
                  <span>Deep DOM Laser Scan Activated</span>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-3">
                  SuperJobGenie extracts the complete 11,480-character DOM directly from LinkedIn and Indeed in real-time.
                </p>
                <div className="bg-black/60 p-3 rounded border border-orange-900/40 text-[11px] font-mono text-orange-300/90 leading-tight">
                  ✓ Full JD Unlocked (11,480 / 11,480 Chars)<br />
                  ✓ 100% Core Requirements Parsed<br />
                  ✓ Role Alignment: 97% Verified Top Tier
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-[#14171a] border border-orange-900/40">
                  <div className="text-[10px] text-neutral-400 uppercase">Extraction Depth</div>
                  <div className="text-xl font-bold text-[#ff4d15] mt-1">11,480 Chars</div>
                </div>
                <div className="p-3 rounded-lg bg-[#14171a] border border-orange-900/40">
                  <div className="text-[10px] text-neutral-400 uppercase">Match Upgrade</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">38% → 97%</div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 3: Pivot Intelligence & 4-Tier Cover Letter (10-15s) */}
          {activePhase === 3 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/60 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Executive 4-Tier Cover Letter</span>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-3">
                  Instantly translates past career achievements into high-leverage transferable skills hiring managers look for.
                </p>
                <div className="bg-black/60 p-3 rounded border border-emerald-900/40 space-y-1 text-[11px] font-mono text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">T1:</span> Hook & High-Impact Thesis
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">T2:</span> Quantified Evidence ($2.4M ARR)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">T3:</span> Transferable Domain Fit
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">T4:</span> Immediate Execution Plan
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-[#14171a] border border-emerald-900/40">
                  <div className="text-[10px] text-neutral-400 uppercase">Hiring Manager Status</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">Approved ✓</div>
                </div>
                <div className="p-3 rounded-lg bg-[#14171a] border border-emerald-900/40">
                  <div className="text-[10px] text-neutral-400 uppercase">Generation Speed</div>
                  <div className="text-xl font-bold text-white mt-1">1.8 Seconds</div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 4: 100% Privacy & Chrome Store Launch (15-20s) */}
          {activePhase === 4 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/60 shadow-lg">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>100% Local Privacy Guaranteed</span>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-3">
                  Zero cloud uploads. Your resume, salary expectations, and job history stay strictly in your browser session.
                </p>
                <div className="bg-black/60 p-3 rounded border border-blue-900/40 flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Chrome Web Store v3.0.0</span>
                  <span className="text-xs font-bold text-yellow-400">★★★★★ 5.0 Rating</span>
                </div>
              </div>

              <div className="mt-4">
                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#ff4d15] hover:bg-[#e63e07] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(255,77,21,0.4)] flex items-center justify-center gap-2 transition"
                >
                  <span>Install Free from Chrome Web Store</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* Bottom Timeline Scrubber & Playback Controls                              */}
      {/* ========================================================================= */}
      <div className="h-12 bg-[#14171a] border-t border-[#262c31] px-4 flex items-center justify-between gap-4 z-20">
        
        {/* Play/Pause / Rewind */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="p-1.5 rounded-lg bg-[#ff4d15] hover:bg-[#e63e07] text-white transition flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          </button>
          <button
            onClick={() => {
              setCurrentTime(0);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-lg bg-[#22272c] hover:bg-[#2d343b] text-neutral-300 transition"
            title="Replay from start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-neutral-400 font-mono ml-2">
            {currentTime.toFixed(1)}s / {TOTAL_DURATION}.0s
          </span>
        </div>

        {/* Progress Bar with Phase Markers */}
        <div className="relative flex-1 max-w-xl h-2 bg-[#262c31] rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPct = Math.max(0, Math.min(1, clickX / rect.width));
            setCurrentTime(+(newPct * TOTAL_DURATION).toFixed(1));
          }}
        >
          <div 
            className="h-full bg-[#ff4d15] transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />
        </div>

        {/* Status Callout */}
        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <span>Phase {activePhase} of 4</span>
          <span className="text-neutral-600">|</span>
          <span className="text-white font-bold">{Math.round((currentTime / TOTAL_DURATION) * 100)}% Complete</span>
        </div>

      </div>
    </div>
  );
};
