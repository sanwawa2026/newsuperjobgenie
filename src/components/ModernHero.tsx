import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  FileText, 
  Lock, 
  Zap, 
  Download, 
  AlertTriangle,
  Layers,
  ChevronRight,
  Globe,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageSquare
} from 'lucide-react';

interface ModernHeroProps {
  onEnterSimulator: () => void;
  lang: 'zh' | 'en';
  onToggleLang: () => void;
}

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb';

export const ModernHero: React.FC<ModernHeroProps> = ({
  onEnterSimulator,
  lang,
  onToggleLang
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activePresenterTab, setActivePresenterTab] = useState<'story' | 'pivot' | 'privacy' | 'letter'>('story');
  const [scanlines, setScanlines] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/short_38s_master_mix.wav');
      audioRef.current.onended = () => setIsPlayingAudio(false);
      audioRef.current.onerror = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Autoplay error:', err);
        setIsPlayingAudio(false);
      });
    }
  };

  const handleDownload = async (type: 'html' | 'zip') => {
    try {
      setDownloadNotice(lang === 'zh' ? '正在准备下载文件...' : 'Preparing download...');
      const url = type === 'html' ? '/api/download-standalone-html' : '/api/download-cool-webpage-zip';
      const filename = type === 'html' ? 'SuperJobGenie_Showcase.html' : 'SuperJobGenie_Cool_Webpage_Desktop.zip';

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (blob.size === 0) throw new Error('File size is 0 bytes');

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      setDownloadNotice(lang === 'zh' ? '✓ 下载成功！直接双击即可离线全屏运行' : '✓ Downloaded! Double-click to open offline');
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error(err);
      setDownloadNotice(lang === 'zh' ? '下载遇到问题，请重试' : 'Download failed, please retry');
      setTimeout(() => setDownloadNotice(null), 3000);
    }
  };

  const presenterMessages = {
    story: {
      tagZh: '复古人主讲 · 真实求职经历',
      tagEn: 'Presenter · True Seeker Journey',
      quoteZh: '“我拿到面试全靠这个免费 Chrome 小工具！上传匿名 resume 全方位筛选，隐私绝不外泄；最惊喜的是匹配度低也不出局，SmartMatch 帮我轻松跨赛道，还自动定制专业 Cover Letter，完全免费！”',
      quoteEn: '“I landed my top interviews all thanks to this free Chrome tool! Anonymous resume uploads with zero data leakage; low scores don’t count you out—SmartMatch unlocked dream cross-track roles, plus tailored Cover Letters!”',
      metric: '100% 免费 · 真实破局'
    },
    pivot: {
      tagZh: '突破低分出局 · SmartMatch 跨赛道',
      tagEn: 'SmartMatch Strategic Career Pivot',
      quoteZh: '“传统机筛因为 153 字符截断把候选人打出 38% 低分直接淘汰。SuperJobGenie 深度解析 11,480 完整字符，挖掘你沉淀的底层通用工程能力，跨赛道匹配高薪新职位！”',
      quoteEn: '“Legacy ATS bots truncate job specs to 153 chars, falsely stamping 38% rejections. SuperJobGenie parses 11,480 chars to uncover your transferable superpowers into high-paying roles!”',
      metric: '38% 误判 ➔ 97% 顶尖匹配'
    },
    privacy: {
      tagZh: '100% 本地端运行 · 隐私绝对安全',
      tagEn: '100% Client-Side Local Privacy',
      quoteZh: '“求职隐私是我最看重的事！SuperJobGenie 纯在你的本地 Chrome 浏览器沙箱内运行，绝不将个人简历、手机号与薪资期望上传到任何三方云端数据库！”',
      quoteEn: '“Privacy is non-negotiable! SuperJobGenie executes 100% inside your local Chrome sandbox. Zero resume data or salary history ever leaves your machine.”',
      metric: '0 数据上传 · 本地沙箱运算'
    },
    letter: {
      tagZh: '专业定制 Cover Letter · 告别垃圾桶',
      tagEn: 'Tailored Cover Letter · Skip the Bin',
      quoteZh: '“最担心求职信写不好被 HR 直接扔进垃圾桶。SuperJobGenie 将岗位抓取到的真实痛点与个人量化成果精准结合，1 键生成直击招聘主管痛点的 4-Tier 专业自荐信！”',
      quoteEn: '“Never worry about your letter being binned again. SuperJobGenie weaves real JD pain points with quantifiable metrics to produce executive-tier motivation letters in 1 click!”',
      metric: '直击 HR 痛点 · 1键生成复制'
    }
  };

  const activeQuote = presenterMessages[activePresenterTab];

  return (
    <div className="relative w-full overflow-hidden pt-6 pb-16">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Floating Badge Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              {lang === 'zh' ? 'Google 官方 Chrome Web Store 认证 v3.0' : 'Google Chrome Web Store Verified v3.0'}
            </span>
            <span className="hidden sm:inline-flex text-xs text-slate-400 items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'zh' ? '100% 本地运行 · 绝无数据泄露' : '100% Client-Side · Zero Data Upload'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLang}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition shadow-sm"
              title="切换语言 / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'zh' ? 'English' : '中文'}</span>
            </button>

            <button
              onClick={() => handleDownload('html')}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition shadow-sm"
              title="一键下载独立离线单文件 HTML，双击即可在浏览器直接打开"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'zh' ? '下载酷炫单文件网页 (双击即开)' : 'Download Standalone HTML'}</span>
            </button>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Compelling Story & Value Propositions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'zh' ? '求职破局秘密武器 · 免费 Chrome 扩展' : 'Secret Weapon for Job Seekers · 100% Free'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
              {lang === 'zh' ? (
                <>
                  别让<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-orange-400">低分出局</span>挡住你！
                  <br />
                  我拿下面试全靠这个
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400"> 免费 Chrome 小工具</span>
                </>
              ) : (
                <>
                  Don't Let Low ATS Scores Disqualify You!
                  <br />
                  Land Top Interviews with
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400"> SuperJobGenie</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              {lang === 'zh' ? (
                <>
                  传统机筛只抓取 153 个字符导致误判淘汰？SuperJobGenie 深度解析未截断的 <strong>11,000+ 字符</strong> 真实岗位要求。即使初始匹配度低，也能用 <strong>SmartMatch</strong> 挖掘可迁移核心能力，跨界转换高薪赛道，并 1 键生成直击 HR 痛点的专业求职信！
                </>
              ) : (
                <>
                  Traditional ATS bots truncate job postings to 153 characters, auto-rejecting qualified candidates. SuperJobGenie extracts unabridged <strong>11,000+ char specs</strong>, discovers your transferable superpowers with <strong>SmartMatch</strong>, and generates interview-winning tailored cover letters!
                </>
              )}
            </p>

            {/* 4 Pillars Quick Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'zh' ? '1. 匿名上传 · 隐私第一' : '1. Local Privacy First'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'zh' ? '纯本地计算，简历不传三方，绝对安全' : '100% Client-side, zero cloud database leakage'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'zh' ? '2. SmartMatch 转换赛道' : '2. Smart Career Pivot'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'zh' ? '低匹配度不出局，轻松转换高薪新赛道' : 'Low match is not out! Unlock transferable skills'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'zh' ? '3. 专业定制 CoverLetter' : '3. Tailored Cover Letters'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'zh' ? '告别垃圾桶！深度定制直击 HR 痛点' : 'Never get binned! FAANG-caliber custom pitch'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Zap className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'zh' ? '4. 100% 永久免费' : '4. 100% Free Forever'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'zh' ? 'Chrome 官方商店一键安装，零套路' : 'Direct from Chrome Store, no credit card needed'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <span>{lang === 'zh' ? '免费添加到 Chrome 扩展' : 'Add to Chrome · Free'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <button
                onClick={onEnterSimulator}
                className="px-5 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'zh' ? '在线体验求职工作台' : 'Live Workstation'}</span>
              </button>

              <button
                onClick={() => handleDownload('html')}
                className="px-4 py-3.5 rounded-xl font-semibold text-xs bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/70 flex items-center gap-1.5 transition"
                title="单文件 HTML，可存放到 Mac 桌面双击直接运行"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'zh' ? '下载单文件网页' : 'Download HTML'}</span>
              </button>
            </div>

            {downloadNotice && (
              <div className="mt-3 text-xs font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-3 py-2 rounded-lg animate-fadeIn flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{downloadNotice}</span>
              </div>
            )}
          </div>

          {/* Right Column: THE BELOVED RETRO PERSON ("复古人") PRESENTATION */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="w-full max-w-[480px] rounded-3xl bg-slate-900/90 border border-slate-700/80 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative">
              
              {/* Presenter Topic Switcher Tabs */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActivePresenterTab('story')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      activePresenterTab === 'story'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'zh' ? '💡 真实故事' : '💡 Story'}
                  </button>
                  <button
                    onClick={() => setActivePresenterTab('pivot')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      activePresenterTab === 'pivot'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'zh' ? '⚡ 换赛道' : '⚡ Pivot'}
                  </button>
                  <button
                    onClick={() => setActivePresenterTab('privacy')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      activePresenterTab === 'privacy'
                        ? 'bg-purple-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'zh' ? '🔒 隐私第一' : '🔒 Privacy'}
                  </button>
                  <button
                    onClick={() => setActivePresenterTab('letter')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      activePresenterTab === 'letter'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'zh' ? '📄 定制信' : '📄 Cover Letter'}
                  </button>
                </div>

                {/* Scanlines Toggle Button */}
                <button
                  onClick={() => setScanlines(!scanlines)}
                  className={`text-[10px] font-mono px-2 py-1 rounded border transition ${
                    scanlines ? 'bg-slate-800 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title="Toggle CRT Scanline Effect"
                >
                  CRT {scanlines ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* The Retro Person CRT Monitor Screen */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border-2 border-slate-700/80 shadow-2xl flex items-center justify-center group">
                
                {/* 1080p Pristine Frame of the Retro Computer-Head Character */}
                <img
                  src="/assets/aistudio/hf_hero_frame3.jpg"
                  alt="SuperJobGenie 复古人 主讲"
                  className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
                />

                {/* CRT Scanline Filter Overlay */}
                {scanlines && (
                  <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_2px,transparent_2px,transparent_4px)] mix-blend-overlay" />
                )}

                {/* Screen Glow Vignette */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />

                {/* Top Badge on Monitor Screen */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 shadow-md">
                  <span className={`w-2 h-2 rounded-full ${isPlayingAudio ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
                  <span>{lang === 'zh' ? activeQuote.tagZh : activeQuote.tagEn}</span>
                </div>

                {/* Dynamic Metric Tag */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-mono font-black shadow-lg">
                  {activeQuote.metric}
                </div>

                {/* Audio Playing Equalizer Waveform Overlay */}
                {isPlayingAudio && (
                  <div className="absolute bottom-3 left-3 flex items-end gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-emerald-500/40">
                    <span className="w-1 h-3 bg-emerald-400 animate-bounce" />
                    <span className="w-1 h-5 bg-emerald-400 animate-pulse" />
                    <span className="w-1 h-2 bg-emerald-400 animate-bounce" />
                    <span className="w-1 h-4 bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-300 ml-1 font-bold">PLAYING...</span>
                  </div>
                )}
              </div>

              {/* Dynamic Speech Bubble Under the Retro Person */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs leading-relaxed shadow-inner relative">
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="italic font-medium">
                    {lang === 'zh' ? activeQuote.quoteZh : activeQuote.quoteEn}
                  </p>
                </div>
              </div>

              {/* Voiceover & Interactive Action Bar */}
              <div className="flex items-center gap-2.5 mt-4">
                <button
                  onClick={toggleAudio}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    isPlayingAudio
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{lang === 'zh' ? '暂停复古人原声讲解' : 'Pause Audio'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'zh' ? '▶ 听复古人讲解破局心得 (38秒)' : '▶ Play 38s Voiceover'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onEnterSimulator}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'zh' ? '亲自体验' : 'Try Demo'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
