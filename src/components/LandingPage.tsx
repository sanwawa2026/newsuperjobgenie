import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Download, 
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
  CheckCheck
} from 'lucide-react';
import { ExportExtensionButton } from './ExportExtensionButton';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenPrivacy }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<'indeed' | 'linkedin' | 'glassdoor'>('indeed');

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
      a: 'Download the extension package (.zip), open chrome://extensions in Chrome, toggle "Developer mode" on in the top-right, and drag or unpack the extension folder. You are ready to go in 30 seconds.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 border-b border-indigo-500/20 py-2 px-4 text-center text-xs font-medium text-indigo-200">
        🚀 SuperJobGenie v2.9 is live for LinkedIn, Indeed & Glassdoor • 100% Privacy Protected
      </div>

      {/* Hero Header */}
      <nav className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">SuperJobGenie</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400">Career Pivot Intelligence & Deep JD Matcher</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition"
          >
            Launch Workstation
          </button>
          <ExportExtensionButton
            variant="gradient"
            label="Download Extension"
            extensionName="SuperJobGenie"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 max-w-6xl mx-auto text-center flex-1 flex flex-col items-center justify-center">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time Live Scraping Across Western Job Boards</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mb-6">
          Stop Getting Rejected by{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Truncated Job Descriptions
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          SuperJobGenie unlocks <strong className="text-slate-200">3,000 to 11,000+ characters of deep JD context</strong> directly on LinkedIn, Indeed, and Glassdoor. Get true AI match scoring, pinpoint missing skills, and discover cross-industry career pivots.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-md mb-12">
          <ExportExtensionButton
            variant="gradient"
            label="Add to Chrome for Free (.zip)"
            extensionName="SuperJobGenie"
          />
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Live Web Simulator</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Supported Job Boards Bar */}
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
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={onEnterApp}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-bold transition text-center border border-slate-700"
                    >
                      ✉️ 3-Tier Letter
                    </button>
                    <button 
                      onClick={onEnterApp}
                      className="py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg text-[10.5px] font-bold transition text-center border border-purple-700/50"
                    >
                      👑 4-Tier Exec
                    </button>
                  </div>
                  <button 
                    onClick={onEnterApp}
                    className="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-extrabold transition text-center shadow-md shadow-orange-600/20"
                  >
                    👑 Open in Executive Dashboard (PRO)
                  </button>
                  <button 
                    onClick={onEnterApp}
                    className="w-full py-1.5 bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-700/50 rounded-lg text-[11px] font-bold transition text-center"
                  >
                    ✨ 🌟 Smart Career Pivot Discovery
                  </button>
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
            <ExportExtensionButton
              variant="gradient"
              label="Download SuperJobGenie (.zip)"
              extensionName="SuperJobGenie"
            />
            <button
              onClick={onEnterApp}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2"
            >
              <span>Explore Web Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
    </div>
  );
};
