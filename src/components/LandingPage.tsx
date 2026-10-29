import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Compass, 
  FileText, 
  Star, 
  Zap, 
  Check, 
  Lock, 
  Globe2, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Eye,
  Award,
  AlertTriangle,
  Building2,
  CheckCheck,
  Volume2,
  ArrowUpRight,
  X
} from 'lucide-react';
import { VoiceoverStudioModal } from './VoiceoverStudioModal';
import { IndustrialHero } from './IndustrialHero';
import { AutonomousRadarModal } from './AutonomousRadarModal';
import { Bot, BellRing, Youtube, Play, Video } from 'lucide-react';

const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenPrivacy: () => void;
  onOpenShortsStudio?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onEnterApp, 
  onOpenPrivacy,
  onOpenShortsStudio 
}) => {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<'indeed' | 'linkedin' | 'glassdoor'>('indeed');
  const [isVoiceoverModalOpen, setIsVoiceoverModalOpen] = useState<boolean>(false);
  const [isRadarModalOpen, setIsRadarModalOpen] = useState<boolean>(false);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(true);
  const [isBarDismissed, setIsBarDismissed] = useState<boolean>(false);
  const [selectedCardPreview, setSelectedCardPreview] = useState<{
    id: string;
    num: string;
    title: string;
    subtitle: string;
    tag: string;
    tagColor: string;
    borderHover: string;
    img: string;
    description: string;
    keyPoints: string[];
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowStickyBar(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const breakthroughCards = [
    {
      id: 'card1',
      num: '01',
      title: 'ATS Warning Radar',
      subtitle: 'Low Match & Keyword Filter Detection',
      tag: '01 · ATS TRAP',
      tagColor: 'bg-red-950/80 text-red-300 border-red-500/40',
      borderHover: 'hover:border-red-500/50',
      img: '/assets/cards/card1_ats_38.jpg',
      description: 'Exposes the 38% low-match bottleneck caused by Indeed/LinkedIn truncating job postings to 153 characters before sending to traditional ATS bots.',
      keyPoints: [
        '12 Missing critical keywords flagged immediately',
        'Auto-rejection bot filter status warning',
        'Side-by-side gap analysis vs target requirements'
      ]
    },
    {
      id: 'card2',
      num: '02',
      title: '97% Top 1% Match Ring',
      subtitle: 'Career Pivot & Transferable Skill HUD',
      tag: '02 · SMART PIVOT',
      tagColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      borderHover: 'hover:border-cyan-500/50',
      img: '/assets/cards/card2_smart_match_97.jpg',
      description: 'Reads full 11,000+ char DOM directly in the browser to uncover high-impact transferable skills and match high-compensation adjacent tech roles.',
      keyPoints: [
        '97% Verified Role Fit across core competencies',
        'Cross-industry transferable capability mapper',
        'Top 1% candidate percentile benchmark'
      ]
    },
    {
      id: 'card3',
      num: '03',
      title: '4-Tier Executive Pitch',
      subtitle: 'Interview-Approved Motivation Letter',
      tag: '03 · COVER LETTER',
      tagColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      borderHover: 'hover:border-emerald-500/50',
      img: '/assets/cards/card3_cover_letter.jpg',
      description: 'Generates structured 4-tier executive cover letters backed by quantifiable career metrics ($2.4M ARR impact) and zero generic template fluff.',
      keyPoints: [
        'Tier 1-4 thesis & high-impact hooks',
        'Auto-infused with verified JD bullet requirements',
        'Hiring manager approved direct interview tone'
      ]
    },
    {
      id: 'card4',
      num: '04',
      title: 'Official Chrome Store v3.0',
      subtitle: '100% Client-Side Privacy Shield',
      tag: '04 · VERIFIED STORE',
      tagColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      borderHover: 'hover:border-amber-500/50',
      img: '/assets/cards/card4_brand_chrome.jpg',
      description: 'Official Google Chrome Web Store approved extension. Runs 100% inside your local browser session — zero resume data or salary history ever leaves your machine.',
      keyPoints: [
        'Verified in US (67%), JP (22%), DE (11%)',
        'Zero tracking / zero remote database storage',
        'Instant 1-click install from Chrome Web Store'
      ]
    }
  ];

  const platforms = [
    { name: 'Indeed', desc: 'SpaceX, Anduril 10,980+ Chars Depth Parsed', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/30' },
    { name: 'LinkedIn', desc: '6,500+ Chars Full Job Body Verified', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30' },
    { name: 'Glassdoor', desc: 'Base Salary Range + Deep Requirements', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30' }
  ];

  // Authentic battle-tested showcase presets extracted from real user videos & sessions
  const showcaseData = {
    indeed: {
      platformLabel: 'Indeed Unabridged Deep Scanner',
      tabUrl: 'indeed.com/jobs?q=software+engineer&l=Hawthorne%2C+CA',
      jobTitle: 'Full Stack Software Engineer (Build Reliability)',
      company: 'SpaceX',
      location: 'Hawthorne, CA • On-site / Hybrid',
      salary: '$125,000 - $175,000 a year',
      charsCaptured: '5,523',
      summary: 'SpaceX was founded under the belief that a future where humanity is out exploring the stars is fundamentally more exciting. Today SpaceX is actively developing the technologies to make this possible.',
      score: 97,
      scoreTier: 'Top 1% Exceptional Match',
      tierSub: '4 matched core requirements · 0 gaps',
      skillsMatched: [
        'C#, .NET, SQL, HTML, CSS, Angular',
        'Python, PostgreSQL',
        'Deep understanding of object-oriented design',
        'Understanding of UI/UX design patterns'
      ],
      skillGaps: []
    },
    linkedin: {
      platformLabel: 'LinkedIn Real-Time Scanner',
      tabUrl: 'linkedin.com/jobs/search/?keywords=software+engineer',
      jobTitle: 'Software Engineer',
      company: 'Aurora Energy Research',
      location: 'Oxford, UK • Hybrid',
      salary: '£65,000 - £80,000 / yr',
      charsCaptured: '6,781',
      summary: 'Aurora Energy Research is expanding its software engineering platform. Looking for engineers experienced in building high-availability data infrastructure and quantitative energy models.',
      score: 86,
      scoreTier: 'Competitive Strong Match',
      tierSub: 'High core skill alignment · Meets primary job requirements',
      skillsMatched: [
        'Implement well-defined features in Python & React',
        'Develop secure communication & REST/GraphQL APIs',
        'Write unit and integration tests (Jest / PyTest)',
        'Use profiling, logging & telemetry monitoring',
        'Participate in architecture & design discussions'
      ],
      skillGaps: [
        'Domain knowledge in UK/EU wholesale energy markets'
      ]
    },
    glassdoor: {
      platformLabel: 'Glassdoor Native Scanner',
      tabUrl: 'glassdoor.co.uk/Job/london-software-engineer-jobs',
      jobTitle: 'Senior Software Engineer (VP Platform)',
      company: 'Bank of America',
      location: 'London, England • Hybrid',
      salary: '£82k - £98k / yr (Employer provided)',
      charsCaptured: '7,450',
      summary: 'Bank of America is looking for a Senior Software Engineer to design, develop and implement complex distributed financial transaction software across Global Markets & Banking.',
      score: 88,
      scoreTier: 'Competitive Strong Match',
      tierSub: 'Strong Core Alignment · Meets enterprise financial standards',
      skillsMatched: [
        'Java / Spring Boot microservices backend',
        'High concurrency transaction processing',
        'Relational databases (PostgreSQL / Oracle)',
        'CI/CD automation & Docker containerization',
        'Cross-functional technical leadership'
      ],
      skillGaps: [
        'Capital Markets & fixed-income settlement workflow'
      ]
    }
  };

  const activeCase = showcaseData[activePlatformTab];

  const features = [
    {
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      title: 'Zero Truncation (3,000 ~ 11,000+ Chars)',
      desc: 'Conventional extensions choke on modern SPAs and only read top 150-char greetings. SuperJobGenie extracts the complete, unabridged job spec from active DOM.'
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: 'Local Privacy Shield',
      desc: 'Your raw resume and confidential career history never leave your browser for tracking or data selling. Candidate data stays 100% under your local control.'
    },
    {
      icon: <Compass className="w-6 h-6 text-purple-400" />,
      title: 'Smart Career Pivot Discovery',
      desc: 'Stuck in a saturated track? Our cross-domain semantic engine maps your transferable foundation to high-demand adjacent industries.'
    },
    {
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      title: 'Tailored 4-Tier Cover Letters',
      desc: 'Generate executive-ready cover letters customized with actual job bullet requirements, quantifiable impact metrics, and zero generic fluff.'
    }
  ];

  const faqs = [
    {
      q: 'How does SuperJobGenie differ from other job assistant extensions?',
      a: 'Most legacy scrapers choke on modern Single Page Applications (SPAs) and only capture 150 characters of greeting text. SuperJobGenie utilizes reactive DOM listeners and shadow-root injection to extract 3,000 to 11,000+ characters of deep requirements, giving you true match fidelity.'
    },
    {
      q: 'Does SuperJobGenie upload my resume to third-party databases?',
      a: 'Never. SuperJobGenie runs directly inside your local browser instance. Resume parsing, skill extraction, and scoring matching occur locally, strictly adhering to enterprise privacy and GDPR standards.'
    },
    {
      q: 'Which platforms are supported right now?',
      a: 'SuperJobGenie is fully optimized for LinkedIn, Indeed, and Glassdoor, with experimental support for Greenhouse and Lever ATS boards.'
    },
    {
      q: 'How do I install the extension in Google Chrome?',
      a: 'Simply click "Add to Chrome" to visit our official Google Chrome Web Store listing and install in 1 click. The extension updates automatically and requires zero manual zip unpacking or developer mode setup.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-[#ff4d15] selection:text-white pt-4 sm:pt-8">

      {/* Beloved First Version: Tactile Industrial Hardware Hero with Retro Person & Rotary Dial */}
      <IndustrialHero
        onEnterApp={onEnterApp}
        onOpenPrivacy={onOpenPrivacy}
      />

      {/* ========================================================================= */}
      {/* 4 High-Def Breakthrough Cards Showcase (Right Under Hardware Hero)       */}
      {/* ========================================================================= */}
      <section id="cards" className="py-12 bg-slate-950 border-y border-slate-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#ff4d15]/10 text-[#ff4d15] border border-[#ff4d15]/30 uppercase tracking-widest">
              Visual Intelligence Suite · 4 Breakthrough Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3 mb-2 font-mono">
              The 4 Pillars That Break the ATS Ceiling
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any card to inspect full high-definition diagnostics, transferable skills, and executive generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {breakthroughCards.map((card) => (
              <div 
                key={card.id}
                onClick={() => setSelectedCardPreview(card)}
                className={`group rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden ${card.borderHover} transition-all duration-300 flex flex-col cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1`}
              >
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${card.tagColor} border`}>
                    {card.tag}
                  </span>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-mono font-bold border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
                      <Eye className="w-3.5 h-3.5 text-[#ff4d15]" />
                      <span>Inspect 4K Card</span>
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#ff4d15] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {card.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{card.subtitle}</span>
                    <span className="text-[#ff4d15] font-bold">Zoom ↗</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Autonomous Scout Radar & Telegram Bot Banner (User Innovation Request)    */}
      {/* ========================================================================= */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  AI Agent Evolution · Next-Gen Autonomous Scout
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  ● 24/7 BACKGROUND RADAR
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                Autonomous Scout Radar &amp; Telegram Bot Instant Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tired of manually refreshing job boards every day? Set your profile and target criteria once, and SuperJobGenie silently scouts global job streams 24/7. When a high-alignment position (<strong>≥85% Match</strong>) is detected, it dispatches the vetted job card and tailored pitch straight to your <strong>Telegram &amp; Inbox</strong> in milliseconds!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => setIsRadarModalOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Launch Autonomous Radar &amp; Bot Mission Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* YouTube Shorts Studio & 500 Subscribers Sprint Section                     */}
      {/* ========================================================================= */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-indigo-950/70 border-2 border-rose-500/40 p-6 sm:p-8 shadow-2xl shadow-rose-500/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-rose-400" />
                  YouTube Intelligence Station · Sprint to 500 Subscribers
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-950 text-rose-400 border border-rose-500/30 font-bold">
                  ● 361 / 500 SUBS (72.2%)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                The 9:16 Shorts Engine: "Beat The ATS Bots"
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empowering job seekers to conquer algorithmic rejections. Every Short exposes the 75% ATS rejection trap and delivers a 10-second solution pointing back to our free 0-install web tool &amp; Chrome extension.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              {onOpenShortsStudio && (
                <button
                  onClick={onOpenShortsStudio}
                  className="px-5 py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch 9:16 Shorts Studio &amp; Teleprompter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 4 Short Packages Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
            <div 
              onClick={onOpenShortsStudio}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-rose-400 font-bold">SHORT #01</span>
                <span className="text-slate-400">22s Paced</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-rose-300 transition">
                The 10-Second ATS Bypass Hack
              </div>
              <p className="text-[11px] text-slate-400">
                100 apps, 0 interviews? Workday 38% bot trap vs 94% instant match.
              </p>
            </div>

            <div 
              onClick={onOpenShortsStudio}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 font-bold">SHORT #02</span>
                <span className="text-slate-400">20s Fast</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                Stop Spending 30 Mins Per Job
              </div>
              <p className="text-[11px] text-slate-400">
                Frantic copy-paste between LinkedIn/Word vs 1-Click browser extraction.
              </p>
            </div>

            <div 
              onClick={onOpenShortsStudio}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">SHORT #03</span>
                <span className="text-slate-400">24s Empathy</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                Built for Laid-off Tech Workers
              </div>
              <p className="text-[11px] text-slate-400">
                Solo Founder authenticity: 100% client-side privacy, zero paywalls.
              </p>
            </div>

            <div 
              onClick={onOpenShortsStudio}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-indigo-400 font-bold">SHORT #04</span>
                <span className="text-slate-400">22s Deep Tech</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                The 153-Character Bug Exposed
              </div>
              <p className="text-[11px] text-slate-400">
                Why scrapers lose 90% of JD data vs SuperJobGenie's 11,000+ chars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Job Boards Bar */}
      <section className="relative overflow-hidden pt-4 pb-16 px-6 max-w-6xl mx-auto text-center flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl pt-8 border-t border-slate-800/80 mb-12">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Battle-tested across primary Western job engines
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {platforms.map(p => (
              <div 
                key={p.name}
                className={`p-4 rounded-xl bg-gradient-to-b ${p.color} border ${p.border} backdrop-blur-sm text-left`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Verified</span>
                </div>
                <p className="text-xs text-slate-300">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1:1 Live Browser & SuperJobGenie HUD Extension Multi-Platform Showcase */}
        {/* ========================================================================= */}
        <div className="w-full max-w-5xl mx-auto text-left">
          
          {/* Platform Tab Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                Live Extension In-Action
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white mt-1">
                Real In-Situ Extraction &amp; Dynamic Scoring
              </h3>
            </div>
            
            {/* Interactive Switcher between Indeed, LinkedIn & Glassdoor */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold shadow-lg">
              <button
                onClick={() => setActivePlatformTab('indeed')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activePlatformTab === 'indeed' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Indeed Demo</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('linkedin')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activePlatformTab === 'linkedin' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>LinkedIn Demo</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('glassdoor')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activePlatformTab === 'glassdoor' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Glassdoor Demo</span>
              </button>
            </div>
          </div>

          {/* Chrome Window Mockup Frame */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-indigo-500/10 overflow-hidden">
            {/* Browser Tab Bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <div className="ml-3 px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{activeCase.tabUrl}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SuperJobGenie Active</span>
              </div>
            </div>

            {/* Split View: Left Fake Job Page + Right Compact HUD Extension */}
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-950/60 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              
              {/* Left Column: Job Post Background on Job Board */}
              <div className="lg:col-span-7 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                      {activeCase.platformLabel}
                    </span>
                    <h4 className="text-xl font-extrabold text-white mt-2 leading-tight">{activeCase.jobTitle}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">🏢 {activeCase.company} • 📍 {activeCase.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-emerald-300 border border-slate-700 shrink-0">
                    {activeCase.salary}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">About the job</div>
                  <p>{activeCase.summary}</p>
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      ✓ {activeCase.charsCaptured} Characters Verified in Active DOM
                    </span>
                    <span className="text-[10px] text-slate-500">
                      0% Truncation Loss
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400">Scraped Chars</div>
                    <div className="text-sm font-black text-cyan-400 font-mono">{activeCase.charsCaptured}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400">Verified Skills</div>
                    <div className="text-sm font-black text-emerald-400 font-mono">{activeCase.skillsMatched.length} Core</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400">Skill Gaps</div>
                    <div className="text-sm font-black text-amber-400 font-mono">{activeCase.skillGaps.length} Actionable</div>
                  </div>
                </div>
              </div>

              {/* Right Column: 1:1 SuperJobGenie Floating HUD Interface (Compact & Non-Truncated) */}
              <div className="lg:col-span-5 p-4 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between">
                
                {/* HUD Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                        ⚡
                      </div>
                      <span className="font-extrabold text-xs text-white tracking-tight">SUPERJOBGENIE HUD</span>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">👑 PRO</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ⚡ {activeCase.charsCaptured} chars
                    </span>
                  </div>

                  {/* Score Ring Banner */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Role Fit Score</div>
                      <div className="text-lg font-black text-white">{activeCase.score}% {activeCase.scoreTier}</div>
                      <div className="text-[9.5px] text-slate-400 mt-0.5">{activeCase.tierSub}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xs font-black text-white bg-slate-950 shadow-md">
                      {activeCase.score}%
                    </div>
                  </div>

                  {/* Verified Skills Pill Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verified Skills (Have It)
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">{activeCase.skillsMatched.length} Matched</span>
                    </div>
                    <div className="space-y-1">
                      {activeCase.skillsMatched.slice(0, 3).map((s, idx) => (
                        <div key={idx} className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 truncate" title={s}>
                          ✓ {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gaps Pill Box */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="font-bold text-rose-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Skill Gaps (To Bridge)
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">{activeCase.skillGaps.length} Item</span>
                    </div>
                    <div className="space-y-1">
                      {activeCase.skillGaps.map((g, idx) => (
                        <div key={idx} className="px-2 py-1 rounded-md text-[10px] font-semibold bg-rose-950/40 border border-rose-500/30 text-rose-200 truncate" title={g}>
                          ⚡ {g}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* HUD Footer Action: Compacted Buttons Fitting Cleanly */}
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  <a
                    href={CHROME_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-gradient-to-r from-[#ff4d15] to-orange-500 hover:from-[#e63e07] hover:to-orange-600 text-white rounded-lg text-xs font-black transition text-center shadow-md shadow-orange-600/25 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ Add to Chrome · Free (v3.0.0)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {/* Prominently Elevated Career Pivot Discovery */}
                  <button 
                    onClick={onEnterApp}
                    className="w-full p-2 bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-cyan-950/95 hover:from-indigo-900 hover:to-cyan-900 text-indigo-100 border border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] rounded-lg text-left transition flex flex-col gap-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-[11px] text-white flex items-center gap-1.5">
                        <span className="text-cyan-300">🧭</span> Smart Career Pivot Discovery
                      </span>
                      <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 text-[8.5px] font-black px-1.5 py-0.2 rounded uppercase">
                        V2.0 AI
                      </span>
                    </div>
                    <div className="text-[9.5px] text-indigo-200/80 flex items-center justify-between font-medium">
                      <span>Cross-Domain Transferable Skills & Auto-Match</span>
                      <span className="text-cyan-300 group-hover:translate-x-0.5 transition-transform font-bold">→</span>
                    </div>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={onEnterApp}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-bold transition text-center border border-slate-700 cursor-pointer"
                    >
                      ✉️ 3-Tier Letter
                    </button>
                    <button 
                      onClick={onEnterApp}
                      className="py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg text-[10.5px] font-bold transition text-center border border-purple-700/50 cursor-pointer"
                    >
                      👑 4-Tier Exec
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Feature Value Pillars */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Built for High-Stakes Career Moves
            </h2>
            <p className="text-sm text-slate-400">
              Why blind applying fails — and how SuperJobGenie gives you an unfair advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5 Unfair Strategic Advantages vs Incumbents (Moats) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-900/80 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#ff4d15]/10 text-[#ff4d15] border border-[#ff4d15]/30 uppercase tracking-widest inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Strategic Moats · Competitive Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3 mb-3">
              Why SuperJobGenie? 5 Asymmetric Advantages Legacy Tools Can't Match
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Traditional tools (Jobscan, Teal, LazyApply) rely on naive keyword counts or blind spam scripts that trigger account bans. SuperJobGenie provides an elite cognitive cockpit for high-caliber professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Moat 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden group hover:border-amber-500/60 transition shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">✨</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Industry First · Proprietary
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition">
                Autonomous Career Pivot Discovery
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Legacy matchers rely on rigid literal string matches—switch domains and they instantly assign a misleading 20% score. SuperJobGenie unearths <strong className="text-amber-300">transferable meta-capabilities</strong> with bridge narratives to unlock premium adjacent roles.
              </p>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                <div className="flex items-center gap-2 text-rose-400">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Jobscan: Red-flags missing jargon and penalizes score</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>SuperJobGenie: Extracts 75%+ hidden transferable superpowers</span>
                </div>
              </div>
            </div>

            {/* Moat 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-500/60 transition shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">⚡</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Zero Tab-Switching
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                Zero-Friction In-Situ HUD Cockpit
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Decisions happen where you browse. Injected via isolated Shadow DOM directly beside job listings on Indeed, LinkedIn, and Glassdoor—<strong className="text-cyan-300">no page switching, no 20 open tabs</strong>.
              </p>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                <div className="flex items-center gap-2 text-rose-400">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Legacy Plugins: Force copy-pasting to external portals</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>SuperJobGenie: 50ms instant on-page deep X-ray analysis</span>
                </div>
              </div>
            </div>

            {/* Moat 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 relative overflow-hidden group hover:border-purple-500/60 transition shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">👑</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Executive Caliber
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-400 transition">
                3-Tier &amp; 4-Tier Strategic Cover Letters
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Say goodbye to generic AI begging templates. 3-Tier targets recruiter ATS criteria; 4-Tier addresses hiring executives with <strong className="text-purple-300">strategic industry insights and a 90-day execution roadmap</strong>.
              </p>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                <div className="flex items-center gap-2 text-rose-400">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Generic AI: "I am writing with great excitement..." (Trash)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>SuperJobGenie: Consultative value proposition that wins calls</span>
                </div>
              </div>
            </div>

            {/* Moat 4 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-500/60 transition shadow-xl">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🌐</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Global &amp; APAC Native
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                Multi-Lingual &amp; APAC Workplace Semantic Engine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Western tools fail completely on mixed bilingual (Singapore), Traditional Chinese (Taiwan/HK), or Japanese JDs. SuperJobGenie understands cross-cultural workplace context, extracting <strong className="text-emerald-300">true responsibilities and hidden nuances</strong>.
              </p>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                <div className="flex items-center gap-2 text-rose-400">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Western SaaS: Broken tokenization on international JDs</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>SuperJobGenie: Native parsing across US, EU, and APAC markets</span>
                </div>
              </div>
            </div>

            {/* Moat 5 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/30 relative overflow-hidden group hover:border-blue-500/60 transition shadow-xl md:col-span-2 lg:col-span-2">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🎯</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Sniper Precision vs Blind Spam
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition">
                Privacy-First Architecture &amp; Sniper Targeting (Sniper vs Spam Bot)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Certain competitors (like LazyApply) blast thousands of unreviewed applications, getting candidate emails marked as spam and LinkedIn accounts banned. SuperJobGenie enforces the <strong>"High-Conversion Co-pilot"</strong> ethos:
                100% local browser execution, zero resume leaks, focusing exclusively on ≥85% top-alignment roles for 5-10x higher interview callback rates.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-2 text-rose-400">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Spam Scripts: Burn candidate reputation and trigger platform bans</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>SuperJobGenie: High-probability sniper precision with user in full control</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need to know about SuperJobGenie and Chrome Web Store installation.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-cyan-300 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-b from-slate-950 to-indigo-950/40 border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to Accelerate Your Career Pivot?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Install the SuperJobGenie Chrome extension today and experience instant deep JD extraction with 100% privacy preservation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-gradient-to-r from-[#ff4d15] via-orange-500 to-amber-500 hover:from-[#e63e07] hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3.6a6.4 6.4 0 0 1 5.54 3.2h-7.14a4 4 0 0 0-2.4 1.4L6.16 6.8A6.38 6.38 0 0 1 12 5.6zm-6.4 6.4a6.4 6.4 0 0 1 .8-3.1l3.57 6.18a4 4 0 0 0 2.4 1.32l-3.37 5.84A6.4 6.4 0 0 1 5.6 12zm8.8 6.4a6.38 6.38 0 0 1-5.54-3.2h7.14a4 4 0 0 0 2.4-1.4l1.84 3.4A6.38 6.38 0 0 1 14.4 18.4zM12 14a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/>
              </svg>
              <span>Add to Chrome · Official Store</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </a>

            <button
              onClick={onEnterApp}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Web Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="/superjobgenie-v2-extension.zip"
              download="superjobgenie-v2-extension.zip"
              className="px-5 py-3.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-cyan-300 border border-cyan-500/30 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer hover:border-cyan-400"
              title="Download unpackable V2.0 Autonomous Scout Chrome Extension (Manifest V3)"
            >
              <span>📦 Download V2.0 Extension Zip</span>
            </a>
          </div>

          {/* Chrome Web Store Trust Pillar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Google Chrome Web Store Verified · Manifest V3 · 100% Client-Side Privacy</span>
            </span>
          </div>
        </div>
      </section>

      {/* Footer & Privacy Link */}
      <footer className="py-8 px-6 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full mx-auto gap-4">
        <div>
          © {new Date().getFullYear()} SuperJobGenie. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenPrivacy}
            className="hover:text-cyan-400 transition underline underline-offset-4"
          >
            Privacy Policy (GDPR / Chrome Compliance)
          </button>
          <button
            onClick={onEnterApp}
            className="hover:text-white transition"
          >
            Workstation
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </footer>

      {/* 4K Breakthrough Card Lightbox Modal */}
      {selectedCardPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Card High-Def Image View */}
            <div className="md:w-3/5 bg-black flex items-center justify-center p-3 sm:p-6 overflow-hidden">
              <img
                src={selectedCardPreview.img}
                alt={selectedCardPreview.title}
                className="max-h-[50vh] md:max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Card Intelligence Info & Rationale */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${selectedCardPreview.tagColor} border`}>
                    {selectedCardPreview.tag}
                  </span>
                  <button
                    onClick={() => setSelectedCardPreview(null)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition text-xs font-mono"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                <h3 className="text-xl font-black text-white tracking-tight mb-1">
                  {selectedCardPreview.title}
                </h3>
                <p className="text-xs font-mono text-[#ff4d15] mb-4">
                  {selectedCardPreview.subtitle}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  {selectedCardPreview.description}
                </p>

                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Key Architectural Capabilities:
                  </span>
                  {selectedCardPreview.keyPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCardPreview(null);
                    onEnterApp();
                  }}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold text-center border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Try in Simulator</span>
                </button>
                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#ff4d15] to-orange-500 hover:from-[#e63e07] hover:to-orange-600 text-white rounded-xl text-xs font-mono font-bold text-center transition flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3.6a6.4 6.4 0 0 1 5.54 3.2h-7.14a4 4 0 0 0-2.4 1.4L6.16 6.8A6.38 6.38 0 0 1 12 5.6zm-6.4 6.4a6.4 6.4 0 0 1 .8-3.1l3.57 6.18a4 4 0 0 0 2.4 1.32l-3.37 5.84A6.4 6.4 0 0 1 5.6 12zm8.8 6.4a6.38 6.38 0 0 1-5.54-3.2h7.14a4 4 0 0 0 2.4-1.4l1.84 3.4A6.38 6.38 0 0 1 14.4 18.4zM12 14a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/>
                  </svg>
                  <span>Add to Chrome (Free)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Sticky Conversion Dock (Never let a visitor bounce without installing) */}
      {showStickyBar && !isBarDismissed && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900/95 border-2 border-orange-500/40 rounded-2xl p-3 sm:px-4 sm:py-3 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(255,77,21,0.25)] backdrop-blur-xl flex items-center justify-between gap-3 sm:gap-5 text-xs text-white max-w-xl mx-auto">
            {/* Left badge & rating */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff4d15] to-amber-500 flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3.6a6.4 6.4 0 0 1 5.54 3.2h-7.14a4 4 0 0 0-2.4 1.4L6.16 6.8A6.38 6.38 0 0 1 12 5.6zm-6.4 6.4a6.4 6.4 0 0 1 .8-3.1l3.57 6.18a4 4 0 0 0 2.4 1.32l-3.37 5.84A6.4 6.4 0 0 1 5.6 12zm8.8 6.4a6.38 6.38 0 0 1-5.54-3.2h7.14a4 4 0 0 0 2.4-1.4l1.84 3.4A6.38 6.38 0 0 1 14.4 18.4zM12 14a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5 font-bold tracking-tight">
                  <span>SuperJobGenie v3.0.0</span>
                  <span className="text-amber-400 font-mono text-[11px]">★★★★★ 5.0</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Official Chrome Web Store · 100% Local Privacy
                </div>
              </div>
            </div>

            {/* CTA Button & Dismiss */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2 bg-[#ff4d15] hover:bg-[#e63e07] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5 transition hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <span>Add to Chrome · Free</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
              <button
                onClick={() => setIsBarDismissed(true)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voiceover Studio Modal */}
      <VoiceoverStudioModal
        isOpen={isVoiceoverModalOpen}
        onClose={() => setIsVoiceoverModalOpen(false)}
      />

      {/* Autonomous Scout Radar & Bot Dispatch Modal */}
      <AutonomousRadarModal
        isOpen={isRadarModalOpen}
        onClose={() => setIsRadarModalOpen(false)}
      />
    </div>
  );
};
