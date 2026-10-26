import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  Play, 
  Volume2, 
  RotateCw,
  ExternalLink,
  Check
} from 'lucide-react';
import { CleanStudioDemo16x9 } from './CleanStudioDemo16x9';

interface IndustrialHeroProps {
  onEnterApp: () => void;
  onOpenPrivacy: () => void;
  onOpenVoiceover?: () => void;
}

export const IndustrialHero: React.FC<IndustrialHeroProps> = ({
  onEnterApp,
  onOpenPrivacy
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'avatar' | 'dial'>('avatar');
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [dialScore, setDialScore] = useState<number>(97);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const audioHeroRef = useRef<HTMLAudioElement | null>(null);

  // Chrome Web Store official URL
  const CHROME_STORE_URL =
    'https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb';

  // Calculate needle angle: from -135deg (0%) to +135deg (100%)
  const needleRotation = -135 + (dialScore / 100) * 270;

  // Generates 48 tick marks around 270 degrees
  const ticks = Array.from({ length: 49 }, (_, i) => {
    const angle = -135 + (i / 48) * 270;
    const isMajor = i % 6 === 0;
    return { angle, isMajor, index: i };
  });

  const toggleHeroAudio = () => {
    if (!audioHeroRef.current) {
      audioHeroRef.current = new Audio('/audio/short_38s_master_mix.wav');
      audioHeroRef.current.onended = () => setIsAudioActive(false);
      audioHeroRef.current.onerror = () => setIsAudioActive(false);
    }
    if (isAudioActive) {
      audioHeroRef.current.pause();
      setIsAudioActive(false);
    } else {
      audioHeroRef.current.currentTime = 0;
      audioHeroRef.current.play().then(() => {
        setIsAudioActive(true);
      }).catch(e => {
        console.log('Audio autoplay policy:', e);
        setIsAudioActive(false);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (audioHeroRef.current) {
        audioHeroRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12 font-mono">
      {/* ========================================================================= */}
      {/* Industrial Chassis Container (Matte Grey Instrument Panel with Screws)     */}
      {/* ========================================================================= */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#d3d8da] text-[#1c1e21] border-2 border-[#b8bec2] shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.2)] p-6 sm:p-10 lg:p-12 overflow-hidden">
        
        {/* Four Corner Screws (Detailed Metallic Screwheads with 45-deg angled slot) */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-[#e5eaec] to-[#9da4a8] border border-[#7a8286] shadow-sm flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-[1.5px] bg-[#495057] rotate-45 rounded-full" />
        </div>
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-[#e5eaec] to-[#9da4a8] border border-[#7a8286] shadow-sm flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-[1.5px] bg-[#495057] -rotate-12 rounded-full" />
        </div>
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-[#e5eaec] to-[#9da4a8] border border-[#7a8286] shadow-sm flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-[1.5px] bg-[#495057] rotate-30 rounded-full" />
        </div>
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-[#e5eaec] to-[#9da4a8] border border-[#7a8286] shadow-sm flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-[1.5px] bg-[#495057] rotate-45 rounded-full" />
        </div>

        {/* Technical Sub-Index Marks on Left Margin */}
        <div className="absolute left-2.5 top-24 bottom-24 hidden md:flex flex-col justify-between items-center opacity-40 text-[9px] font-mono select-none pointer-events-none">
          <span>01</span>
          <div className="w-[1px] h-32 bg-[#495057]" />
          <span>SYS</span>
          <div className="w-[1px] h-32 bg-[#495057]" />
          <span>2026</span>
        </div>

        {/* ========================================================================= */}
        {/* Top Industrial Header & Tactile Inset Navigation Pills                   */}
        {/* ========================================================================= */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-[#bcc3c7]">
          {/* Brand Logo & Model Spec */}
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-1 h-6 px-1">
              <span className="w-1.5 h-3 bg-[#1e2224] rounded-sm" />
              <span className="w-1.5 h-5 bg-[#1e2224] rounded-sm" />
              <span className="w-1.5 h-6 bg-[#ff4d15] rounded-sm" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111315] font-sans">
                SuperJobGenie
              </span>
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#bdc4c7] text-[#343a40] uppercase tracking-wider font-semibold border border-[#9ca4a8]">
                V3.0.0 CHROME
              </span>
            </div>
          </div>

          {/* Inset Tactile Navigation Buttons & Cooling Grill */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <a
              href="#cards"
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#343a40] hover:text-[#111315] bg-[#c5cbce] hover:bg-[#b8bec1] border border-[#a6adb1] rounded-[6px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.1)] transition"
            >
              4X CARDS
            </a>
            <a
              href="#features"
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#343a40] hover:text-[#111315] bg-[#c5cbce] hover:bg-[#b8bec1] border border-[#a6adb1] rounded-[6px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.1)] transition"
            >
              FEATURES
            </a>
            <button
              onClick={onEnterApp}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#343a40] hover:text-[#111315] bg-[#c5cbce] hover:bg-[#b8bec1] border border-[#a6adb1] rounded-[6px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.1)] transition cursor-pointer"
            >
              SIMULATOR
            </button>
            <button
              onClick={onOpenPrivacy}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#343a40] hover:text-[#111315] bg-[#c5cbce] hover:bg-[#b8bec1] border border-[#a6adb1] rounded-[6px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.1)] transition cursor-pointer"
            >
              PRIVACY
            </button>

            {/* Official Chrome Store Link */}
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#ff4d15] hover:text-white bg-[#c5cbce] hover:bg-[#ff4d15] border border-[#a6adb1] hover:border-[#ff4d15] rounded-[6px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.1)] transition flex items-center gap-1.5"
            >
              <span>STORE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Industrial Cooling Grill Vent (Series of embossed vertical slits) */}
            <div className="hidden lg:flex items-center gap-[3px] ml-2 px-2 py-1 bg-[#bcc3c7] rounded border border-[#9ca4a8] shadow-inner">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="w-[2px] h-4 bg-[#7a8286] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
              ))}
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* Main Body: Hero Copy (Left) + Interactive Hardware Console (Right)        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 py-6 sm:py-8 items-center">
          
          {/* Left Column: Bold Heavy Headline + Value Prop */}
          <div className="md:col-span-7 flex flex-col justify-center">
            
            {/* Live Operational Status Tag */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4d15] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#495057] font-bold">
                OFFICIAL V3.0.0 LIVE ON GOOGLE CHROME WEB STORE
              </span>
            </div>

            {/* Heavy Industrial Headline (Exact Match to User's Screenshot) */}
            <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-black tracking-[-0.035em] text-[#0f1112] font-sans leading-[1.04] mb-5">
              Transform the way you beat the ATS
            </h1>

            {/* Value Proposition */}
            <p className="text-sm sm:text-base text-[#3a4146] font-sans leading-relaxed max-w-xl mb-6 sm:mb-8">
              SuperJobGenie parses unabridged <strong className="text-[#111315] font-bold">11,000+ character job specs</strong> directly on LinkedIn, Indeed, and Glassdoor. Get real-time career-pivot matching and generate tailored executive cover letters in 1 click.
            </p>

            {/* Action Bar */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap mb-6">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-[#ff4d15] hover:bg-[#e63e07] text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_8px_20px_rgba(255,77,21,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center gap-2 transition hover:scale-[1.02] active:scale-95"
              >
                <span>ADD TO CHROME · FREE</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-4 sm:px-5 py-3 sm:py-3.5 bg-[#c8ced1] hover:bg-[#b8c0c4] text-[#1c1e21] border border-[#a2aaaf] font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_6px_rgba(0,0,0,0.1)] flex items-center gap-2 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#ff4d15] text-[#ff4d15]" />
                <span>16:9 CLEAN DEMO</span>
              </button>
            </div>

            {/* Social Proof Indicator */}
            <div className="flex items-center gap-3 pt-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#ff4d15]" />
              <p className="text-xs sm:text-sm text-[#495057] font-mono">
                Active job seekers in <strong>US (67%)</strong>, <strong>Japan (22%)</strong> &amp; <strong>Germany (11%)</strong>
              </p>
            </div>
          </div>

          {/* Right Column: The Iconic CRT Console Housing ("复古人") */}
          <div className="md:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-[440px] rounded-3xl bg-[#c5cbce] border-2 border-[#a6adb1] p-4 sm:p-5 lg:p-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_15px_35px_rgba(0,0,0,0.25)] flex flex-col items-center relative">
              
              {/* Top Hardware Rocker Mode Selector (CRT Avatar / Dial) */}
              <div className="w-full flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#a9b0b4]">
                <div className="flex items-center gap-1.5 p-1 bg-[#b4bcc0] rounded-xl border border-[#9ca4a8] shadow-inner">
                  <button
                    onClick={() => setActiveConsoleTab('avatar')}
                    className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeConsoleTab === 'avatar'
                        ? 'bg-[#181b1e] text-white shadow-md'
                        : 'text-[#41484d] hover:text-[#111315]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${activeConsoleTab === 'avatar' ? 'bg-[#ff4d15] animate-pulse' : 'bg-[#7a8286]'}`} />
                    <span>CRT AVATAR</span>
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('dial')}
                    className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeConsoleTab === 'dial'
                        ? 'bg-[#181b1e] text-white shadow-md'
                        : 'text-[#41484d] hover:text-[#111315]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${activeConsoleTab === 'dial' ? 'bg-[#ff4d15]' : 'bg-[#7a8286]'}`} />
                    <span>DIAL (97%)</span>
                  </button>
                </div>

                {/* Sub-label */}
                <span className="text-[10px] font-mono font-bold text-[#576066] uppercase tracking-wider hidden sm:inline">
                  {activeConsoleTab === 'avatar' ? 'GOLDSTAR CM-1400' : 'RAMS INSTRUMENT'}
                </span>
              </div>

              {/* View 1: Pristine CRT Avatar Display with the Beloved Retro Person ("复古人") */}
              {activeConsoleTab === 'avatar' && (
                <div className="w-full flex flex-col items-center animate-fadeIn">
                  
                  {/* CRT Vintage Bezel Frame */}
                  <div className="w-full rounded-2xl bg-[#aeb6ba] border-2 border-[#949ea3] p-2.5 sm:p-3 shadow-[inset_0_3px_6px_rgba(255,255,255,0.7),0_8px_20px_rgba(0,0,0,0.2)]">
                    
                    {/* Screen Outer Well */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border-2 border-[#373d42] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex items-center justify-center">
                      
                      {/* High-res CRT Frame of the Retro Computer-Head Person */}
                      <video
                        src="/assets/aistudio/___8s_d10be03c.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover select-none"
                      />

                      {/* Optional CRT Scanlines Effect */}
                      {scanlines && (
                        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
                      )}

                      {/* Subtle CRT Phosphor Glow Vignette */}
                      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.7)]" />

                      {/* On-Screen Watermark Indicator (Exact match: LIVE SIGNAL · ARTIFACT CLEANED) */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-emerald-500/40 text-[9px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>LIVE SIGNAL · ARTIFACT CLEANED</span>
                      </div>

                      {/* Live Fit Score Badge on Monitor Screen */}
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-[#ff4d15] text-white text-[10px] font-mono font-bold shadow-md flex items-center gap-1">
                        <span>FIT: 97%</span>
                      </div>
                    </div>

                    {/* Bottom CRT Monitor Bezel with GoldStar Emblem & Speaker Vent */}
                    <div className="flex items-center justify-between mt-2.5 px-1 text-[#333a40]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-[#9da6ab] border border-[#858f94] text-[#1c2023]">
                          GoldStar
                        </span>
                        <span className="text-[9px] text-[#555e64] font-mono">COLOR MONITOR</span>
                      </div>

                      {/* Status LED & Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setScanlines(!scanlines)}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                            scanlines 
                              ? 'bg-[#2b3034] text-white border-[#1c2023]' 
                              : 'bg-[#b8c0c4] text-[#495057] border-[#9ca4a8]'
                          }`}
                          title="Toggle retro CRT scanlines"
                        >
                          SCANLINES {scanlines ? 'ON' : 'OFF'}
                        </button>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66]" />
                          <span className="text-[9px] font-mono font-bold text-[#373d42]">LOCK</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audio Narrative Voiceover Trigger Bar (Exact Match with Orange Play Circle) */}
                  <div className="w-full flex items-center gap-2 mt-4">
                    <button
                      onClick={toggleHeroAudio}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                        isAudioActive 
                          ? 'bg-[#ff4d15] text-white border-[#ff4d15] shadow-md animate-pulse' 
                          : 'bg-[#d8dcde] hover:bg-white text-[#212529] border-[#a8b0b4]'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isAudioActive ? 'Playing Gemini Voiceover...' : 'PLAY GEMINI VOICEOVER'}</span>
                    </button>
                    <button
                      onClick={toggleHeroAudio}
                      className="w-8 h-8 rounded-full bg-[#ff4d15] hover:bg-[#e63e07] text-white flex items-center justify-center shadow-md transition cursor-pointer shrink-0"
                      title="Play/Pause Gemini Narration"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* View 2: Physical Rotary Dial Instrument Housing */}
              {activeConsoleTab === 'dial' && (
                <div className="w-full flex flex-col items-center animate-fadeIn">
                  {/* Speaker / Cooling Grill Slits at Top */}
                  <div className="w-full flex justify-center gap-[4px] mb-4">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div key={i} className="w-[2px] h-4 bg-[#788185] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
                    ))}
                  </div>

                  {/* Rotary Dial Instrument Housing */}
                  <div 
                    className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#dfe4e6] via-[#cbd1d4] to-[#a3aaaf] border-4 border-[#b4bcc0] shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_3px_6px_rgba(255,255,255,0.9)] flex items-center justify-center select-none cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
                    onClick={() => setDialScore(prev => prev === 97 ? 38 : 97)}
                    title="Click dial to toggle between 38% ATS Low Match and 97% SuperJobGenie Career Pivot"
                  >
                    {/* 270-degree Tick Marks SVG */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 288 288">
                      {ticks.map((t, idx) => {
                        const rad = (t.angle * Math.PI) / 180;
                        const r1 = 126;
                        const r2 = t.isMajor ? 112 : 118;
                        const cx = 144;
                        const cy = 144;
                        const x1 = cx + r1 * Math.cos(rad);
                        const y1 = cy + r1 * Math.sin(rad);
                        const x2 = cx + r2 * Math.cos(rad);
                        const y2 = cy + r2 * Math.sin(rad);
                        return (
                          <line
                            key={idx}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={t.isMajor ? '#2b3034' : '#687278'}
                            strokeWidth={t.isMajor ? 2.5 : 1.2}
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </svg>

                    {/* Animated Needle Indicator */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 ease-out"
                      style={{ transform: `rotate(${needleRotation}deg)` }}
                    >
                      <div className="w-[3px] h-24 bg-[#ff4d15] rounded-full -translate-y-12 shadow-[0_0_8px_rgba(255,77,21,0.6)]" />
                    </div>

                    {/* Center Rotary Knob Body (Sunken Beveled Button) */}
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-[#f2f5f6] to-[#d0d6d9] border border-[#b8c0c4] shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,1)] flex flex-col items-center justify-center p-3 text-center z-10">
                      
                      {/* Central Orange Master CTA Button */}
                      <a
                        href={CHROME_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#e63e07] to-[#ff6b3d] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(230,62,7,0.45),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer mb-1.5"
                        title="Install Free from Chrome Web Store"
                      >
                        <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                      </a>

                      {/* Button Label */}
                      <span className="text-xs font-mono font-black text-[#111315] uppercase tracking-wider leading-tight">
                        {dialScore === 97 ? 'ADD TO CHROME' : 'ATS WARNING'}
                      </span>
                      <span className="text-[10px] font-mono text-[#5f686d] tracking-tight">
                        {dialScore}% Fit · Free
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Inset "16:9 CLEAN CRT STUDIO DEMO" Action Bar */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full mt-3 py-2.5 px-4 bg-[#e8ecee] hover:bg-white text-[#212529] border border-[#a8b0b4] rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.1)] transition group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#ff4d15] fill-[#ff4d15]" />
                  <span>16:9 CLEAN CRT STUDIO DEMO</span>
                </span>
                <span className="text-[#ff4d15] font-bold group-hover:translate-x-0.5 transition-transform">▷</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Bottom Social Proof & Stats: 4 Recessed Matte Dark Instrument Panels     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-[#bcc3c7]">
          
          {/* Card 1: Active Users */}
          <div className="bg-[#121416] text-white p-5 rounded-2xl border border-[#2b3034] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.15)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ff4d15]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b949a] font-bold">
                ACTIVE USERS
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                18+
              </div>
              <div className="text-xs font-mono text-[#767e84] mt-1">
                +12% this week (Organic)
              </div>
            </div>
          </div>

          {/* Card 2: Extraction Depth */}
          <div className="bg-[#121416] text-white p-5 rounded-2xl border border-[#2b3034] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.15)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ff4d15]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b949a] font-bold">
                JD DEPTH
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                11,000+
              </div>
              <div className="text-xs font-mono text-[#767e84] mt-1">
                Full DOM · Zero cutoff
              </div>
            </div>
          </div>

          {/* Card 3: Global Reach */}
          <div className="bg-[#121416] text-white p-5 rounded-2xl border border-[#2b3034] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.15)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ff4d15]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b949a] font-bold">
                GLOBAL REACH
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                3 Continents
              </div>
              <div className="text-xs font-mono text-[#767e84] mt-1">
                US 67% • JP 22% • DE 11%
              </div>
            </div>
          </div>

          {/* Card 4: Local Privacy */}
          <div className="bg-[#121416] text-white p-5 rounded-2xl border border-[#2b3034] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.15)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#ff4d15]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b949a] font-bold">
                LOCAL PRIVACY
              </span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                100%
              </div>
              <div className="text-xs font-mono text-[#767e84] mt-1">
                Zero resume data uploaded
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Embedded 16:9 Promo Video */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-black">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            >
              Close
            </button>
            <video
              src="/assets/aistudio/SuperJobGenie-Trailer-v7-60s-16x9_564a3813.mp4"
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
