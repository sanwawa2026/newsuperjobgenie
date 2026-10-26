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
  Download,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CleanStudioDemo16x9Props {
  onClose?: () => void;
  autoStart?: boolean;
}

export const CleanStudioDemo16x9: React.FC<CleanStudioDemo16x9Props> = ({
  onClose,
  autoStart = true
}) => {
  const [mode, setMode] = useState<'simulator' | 'cards'>('simulator');
  const [isPlaying, setIsPlaying] = useState<boolean>(autoStart);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const TOTAL_DURATION = 20.0;
  const CHROME_STORE_URL =
    'https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb';

  const cardsData = [
    {
      id: 'card1',
      title: '01 传统 ATS 字符截断陷阱 (38%)',
      desc: '搜索页只抓取 153 字符摘要，导致核心技术栈 98% 丢失，被机筛秒拒。',
      img: '/assets/cards/card1_ats_38.jpg',
      badge: '38% MISMATCH',
      color: 'text-red-400 border-red-800 bg-red-950/40'
    },
    {
      id: 'card2',
      title: '02 深度 DOM 激光全量抓取 (97%)',
      desc: '直接从 LinkedIn / Indeed 深度 DOM 提取 11,480 完整字符，核心架构完全对齐。',
      img: '/assets/cards/card2_smart_match_97.jpg',
      badge: '11K DEEP DOM',
      color: 'text-orange-400 border-orange-800 bg-orange-950/40'
    },
    {
      id: 'card3',
      title: '03 四阶定制高管 Cover Letter',
      desc: '痛点 Hook + 240万量化业绩 + 跨赛道可迁移技能 + 落地计划，1.8秒即成。',
      img: '/assets/cards/card3_cover_letter.jpg',
      badge: 'EXECUTIVE LETTER',
      color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
    },
    {
      id: 'card4',
      title: '04 100% 本地隐私安全 · 官方商店',
      desc: '简历与薪资不出本地浏览器，Chrome Web Store 官方发布，永久免费。',
      img: '/assets/cards/card4_brand_chrome.jpg',
      badge: 'CHROME v3.0 FREE',
      color: 'text-blue-400 border-blue-800 bg-blue-950/40'
    }
  ];

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

  // Robust verified client-side download to prevent 0-byte downloads
  const handleDownloadDesktop = async (type: 'zip' | 'html') => {
    try {
      setDownloadStatus(type === 'zip' ? '正在打包下载 ZIP (2.2MB)...' : '正在获取单文件 HTML...');
      const url = type === 'zip' ? '/api/download-cool-webpage-zip' : '/api/download-standalone-html';
      const filename = type === 'zip' ? 'SuperJobGenie_Cool_Webpage_Desktop.zip' : 'SuperJobGenie_Showcase.html';

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Received 0 bytes payload');

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      setDownloadStatus(type === 'zip' ? '✓ ZIP 下载成功 (2.2MB)！解压即可' : '✓ HTML 下载成功！双击即可打开');
      setTimeout(() => setDownloadStatus(null), 4000);
    } catch (err: any) {
      console.error('Download error:', err);
      setDownloadStatus('下载异常，请重试');
      setTimeout(() => setDownloadStatus(null), 3500);
    }
  };

  // Timer loop for interactive simulator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && mode === 'simulator') {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          const next = +(prev + 0.1).toFixed(1);
          if (next === 5.0 || next === 10.0 || next === 15.0) {
            playMechanicalTick(1100);
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
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
    playMechanicalTick(750);
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
              16:9 MASTER STUDIO
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-[#20252a] rounded-lg border border-[#343b42]">
            <button
              onClick={() => {
                setMode('simulator');
                playMechanicalTick(900);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition ${
                mode === 'simulator' ? 'bg-[#ff4d15] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>TE 机械控制台</span>
            </button>
            <button
              onClick={() => {
                setMode('cards');
                playMechanicalTick(900);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition ${
                mode === 'cards' ? 'bg-[#ff4d15] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>4 大实战卡片</span>
            </button>
          </div>
        </div>

        {/* Phase Indicators */}
        {mode === 'simulator' && (
          <div className="hidden md:flex items-center gap-2 text-[10px]">
            <span className={`px-2 py-0.5 rounded cursor-pointer transition ${activePhase === 1 ? 'bg-red-950 text-red-400 border border-red-800' : 'text-neutral-500'}`} onClick={() => { setCurrentTime(0); playMechanicalTick(800); }}>
              01 BOT TRAP
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`px-2 py-0.5 rounded cursor-pointer transition ${activePhase === 2 ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'text-neutral-500'}`} onClick={() => { setCurrentTime(5.0); }}>
              02 11K SCAN
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`px-2 py-0.5 rounded cursor-pointer transition ${activePhase === 3 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-neutral-500'}`} onClick={() => { setCurrentTime(10.0); }}>
              03 97% PIVOT
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`px-2 py-0.5 rounded cursor-pointer transition ${activePhase === 4 ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'text-neutral-500'}`} onClick={() => { setCurrentTime(15.0); }}>
              04 VERIFIED
            </span>
          </div>
        )}

        {/* Action Controls & Download */}
        <div className="flex items-center gap-2">
          {downloadStatus && (
            <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 animate-pulse hidden lg:inline">
              {downloadStatus}
            </span>
          )}

          {/* Direct HTML single-file download (no unzipping needed) */}
          <button
            onClick={() => handleDownloadDesktop('html')}
            className="flex items-center gap-1 px-2 py-1 bg-[#22272c] hover:bg-[#2d343b] text-neutral-200 hover:text-white border border-[#3b434a] text-[10px] font-bold uppercase rounded shadow transition"
            title="直接下载单个 HTML 离线文件，在 Mac / Windows 双击即可在浏览器全屏运行与 1080p 录屏"
          >
            <Download className="w-3 h-3 text-[#ff4d15]" />
            <span className="hidden sm:inline">下载单文件 HTML</span>
            <span className="sm:hidden">HTML</span>
          </button>

          {/* Full ZIP bundle download */}
          <button
            onClick={() => handleDownloadDesktop('zip')}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#ff4d15] hover:bg-[#e63e07] text-white text-[10px] font-bold uppercase rounded shadow transition"
            title="打包下载完整离线桌面网页包 (ZIP 2.2MB，已完整验证无损)，解压后双击即可全屏录屏"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">下载离线包 (ZIP)</span>
            <span className="sm:hidden">ZIP</span>
          </button>

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
      {/* 16:9 Main Stage                                                           */}
      {/* ========================================================================= */}
      {mode === 'simulator' ? (
        <div className="relative flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-between gap-6 overflow-hidden bg-gradient-to-br from-[#121417] via-[#171a1e] to-[#0c0e10]">
          {/* Subtle technical background grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Scanlines Overlay */}
          {scanlines && (
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.22)_0px,rgba(0,0,0,0.22)_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
          )}

          {/* LEFT COLUMN: Real-Time Hardware Rotary Dial Instrument (Teenage Eng.) */}
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

          {/* RIGHT COLUMN: Cinematic Scene Transitions */}
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
      ) : (
        /* CARDS GALLERY MODE: 4 High-Resolution Showcase Cards */
        <div className="relative flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#101214] via-[#15181b] to-[#0a0c0e]">
          <div className="flex items-center justify-between pb-2 border-b border-[#262c31]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-300 uppercase">
                4-PANEL INDUSTRIAL SHOWCASE
              </span>
              <span className="text-[10px] text-neutral-500">
                (点击切换卡片，适合截图与短视频分镜头展示)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {cardsData.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCardIndex(idx);
                    playMechanicalTick(900 + idx * 100);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded border transition ${
                    activeCardIndex === idx 
                      ? 'bg-[#ff4d15] text-white border-[#ff6633]' 
                      : 'bg-[#1b2024] text-neutral-400 border-[#2d343b] hover:text-white'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 py-3 items-center">
            {/* Left Card Preview Image */}
            <div className="relative h-full max-h-[300px] rounded-xl overflow-hidden border-2 border-[#333b42] shadow-2xl bg-black flex items-center justify-center group">
              <img
                src={cardsData[activeCardIndex].img}
                alt={cardsData[activeCardIndex].title}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-white/20 text-[10px] font-bold text-white">
                {cardsData[activeCardIndex].badge}
              </div>
            </div>

            {/* Right Card Detailed Description & Action */}
            <div className="h-full flex flex-col justify-between p-4 rounded-xl bg-[#14171a] border border-[#2a3036]">
              <div>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded border mb-2 ${cardsData[activeCardIndex].color}`}>
                  PHASE 0{activeCardIndex + 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {cardsData[activeCardIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {cardsData[activeCardIndex].desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#23282d]">
                <button
                  onClick={() => {
                    const next = (activeCardIndex + 1) % cardsData.length;
                    setActiveCardIndex(next);
                    playMechanicalTick(950);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#23292f] hover:bg-[#2d343b] text-neutral-200 text-xs font-bold rounded border border-[#39424a] transition"
                >
                  <span>下一张卡片</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4d15] hover:bg-[#e63e07] text-white text-xs font-bold rounded shadow transition"
                >
                  <span>免费安装 Chrome 插件</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
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
              playMechanicalTick(600);
            }}
            className="p-1.5 rounded-lg bg-[#20252a] hover:bg-[#2a3036] text-neutral-300 transition flex items-center justify-center border border-[#343b42]"
            title="Rewind"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-neutral-400 font-mono">
            00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 00:20
          </span>
        </div>

        {/* Scrubber Progress Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            setCurrentTime(+(percentage * TOTAL_DURATION).toFixed(1));
            playMechanicalTick(700);
          }}
          className="flex-1 h-2 bg-[#20252a] rounded-full overflow-hidden cursor-pointer relative border border-[#2d343b]"
        >
          <div
            className="h-full bg-gradient-to-r from-[#ff4d15] to-[#ff7d47] transition-all duration-100 rounded-full"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />
        </div>

        {/* Live Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>V3.0.0 LIVE</span>
        </div>
      </div>
    </div>
  );
};
