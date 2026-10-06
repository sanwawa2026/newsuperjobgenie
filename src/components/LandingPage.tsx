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
  Award
} from 'lucide-react';
import { ExportExtensionButton } from './ExportExtensionButton';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenPrivacy }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const platforms = [
    { name: 'LinkedIn', desc: '6,500+ Chars Full Job Body Verified', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30' },
    { name: 'Indeed', desc: 'Unabridged Section & Requirement Parsing', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/30' },
    { name: 'Glassdoor', desc: 'Deep Description Extraction & Clean Insights', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30' }
  ];

  const features = [
    {
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      title: 'Zero Truncation (3,000 ~ 8,000+ Chars)',
      desc: 'Conventional extensions only read top 150-char snippets. SuperJobGenie extracts the complete, unabridged job spec right from the active DOM.'
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: 'Local Privacy Shield',
      desc: 'Your raw resume and confidential career history never leave your browser for tracking or data selling. Candidate data stays 100% under your control.'
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
      a: 'Most legacy scrapers choke on modern Single Page Applications (SPAs) and only capture 150 characters of greeting text. SuperJobGenie utilizes reactive DOM listeners and shadow-root injection to extract 3,000 to 8,000+ characters of deep requirements, giving you true match fidelity.'
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
      a: 'Download the extension package, open chrome://extensions in Chrome, toggle "Developer mode" on in the top-right, and drag or unpack the extension folder. You are ready to go in 30 seconds.'
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
      <section className="relative overflow-hidden pt-12 pb-20 px-6 max-w-5xl mx-auto text-center flex-1 flex flex-col items-center justify-center">
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
          SuperJobGenie unlocks <strong className="text-slate-200">3,000 to 8,000+ characters of deep JD context</strong> directly on LinkedIn, Indeed, and Glassdoor. Get true AI match scoring, pinpoint missing skills, and discover cross-industry career pivots.
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
        <div className="w-full max-w-3xl pt-8 border-t border-slate-800/80 mb-16">
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

        {/* 1:1 Live Browser & SuperJobGenie HUD Extension Showcase */}
        <div className="w-full max-w-5xl mx-auto text-left">
          <div className="text-center mb-6">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              Live Extension In-Action
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              See How SuperJobGenie Lives Inside Your Browser
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
              Zero tab switching. As you browse LinkedIn, Indeed or Glassdoor, our HUD automatically surfaces real-time fit &amp; full JD depth.
            </p>
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
                  <span>linkedin.com/jobs/collections/recommended</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SuperJobGenie Active</span>
              </div>
            </div>

            {/* Split View: Left Fake Job Page + Right Real HUD Extension */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] bg-slate-950/60 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              
              {/* Left Column: Job Post Background on LinkedIn */}
              <div className="lg:col-span-7 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      LinkedIn Active View
                    </span>
                    <h4 className="text-xl font-extrabold text-white mt-1.5">Senior Full Stack Software Engineer</h4>
                    <p className="text-xs text-slate-400 font-medium">Electric Car Leasing • Brighton, England • Hybrid</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    £75k - £90k/yr
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">About the job</div>
                  <p>
                    We’re looking for a Senior Fullstack Software Engineer (Python and React) to revolutionize our clean vehicle platform. Our tech stack is Python with GraphQL, React with Next.js, PostgreSQL and AWS IaC.
                  </p>
                  <p className="text-slate-400">
                    You will architect high-resilience services, coordinate with product designers, implement microfrontends, and drive our core engineering best practices...
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      ✓ 6,511 Characters Parsed in DOM
                    </span>
                    <span className="text-[10px] text-slate-500">
                      0% Truncation Loss
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400">Scraped Chars</div>
                    <div className="text-sm font-black text-cyan-400 font-mono">6,511</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400">Skills Detected</div>
                    <div className="text-sm font-black text-indigo-400 font-mono">14 Found</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400">Domain Match</div>
                    <div className="text-sm font-black text-emerald-400 font-mono">Clean Energy</div>
                  </div>
                </div>
              </div>

              {/* Right Column: 1:1 SuperJobGenie Floating HUD Interface */}
              <div className="lg:col-span-5 p-5 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between">
                
                {/* HUD Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                        ⚡
                      </div>
                      <span className="font-extrabold text-sm text-white tracking-tight">SuperJobGenie HUD</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Matched
                    </span>
                  </div>

                  {/* Score Ring Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Smart Role Fit</div>
                      <div className="text-xl font-black text-white">88% Strong Match</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Senior Fullstack Foundation</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xs font-black text-white bg-slate-950 shadow-md">
                      88%
                    </div>
                  </div>

                  {/* Verified Skills Pill Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Verified Skills (Have It)
                      </span>
                      <span className="font-mono text-slate-400">4 Core Match</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['React & Next.js', 'Python Backend', 'GraphQL API', 'TypeScript'].map(s => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-200">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gaps Pill Box */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-rose-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        Skill Gaps (To Bridge)
                      </span>
                      <span className="font-mono text-slate-400">1 Item</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/50 border border-rose-500/40 text-rose-200">
                        ⚡ AWS IaC / Terraform
                      </span>
                    </div>
                  </div>
                </div>

                {/* HUD Footer Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <button 
                    onClick={onEnterApp}
                    className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition text-center shadow-md shadow-indigo-600/20"
                  >
                    👑 Open in Executive Dashboard
                  </button>
                  <ExportExtensionButton
                    variant="default"
                    label="Get Extension"
                    extensionName="SuperJobGenie"
                  />
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
