import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  ExternalLink,
  BookOpen,
  Compass,
  FileText,
  AlertTriangle,
  RotateCw,
  Eye,
  Sliders,
  CheckCircle2,
  Download,
  LayoutDashboard,
  Globe,
  Activity
} from 'lucide-react';
import { HudWidget } from './components/HudWidget';
import { IndeedSimulator } from './components/IndeedSimulator';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CandidateModal } from './components/CandidateModal';
import { ExportModal } from './components/ExportModal';
import { ExportExtensionButton } from './components/ExportExtensionButton';
import { InPageModalDialog } from './components/InPageModalDialog';
import { ResumeJobIngestionView } from './components/ResumeJobIngestionView';
import { TelemetryDashboardModal } from './components/TelemetryDashboardModal';
import { TelemetryManager } from './services/telemetry';
import { 
  DEFAULT_CANDIDATE, 
  TANG_CANDIDATE_PROFILE,
  STRIPE_FRONTEND_ARCHITECT_JD,
  FULL_INDEED_AI_TRAINER_JD, 
  FULL_INDEED_SENIOR_BACKEND_JD 
} from './data/sampleData';
import { ExtractedJobData, MatchAnalysisResult, CandidateProfile } from './types';
import { analyzeJobMatch, extractJobContent } from './services/api';

export default function App() {
  const [candidate, setCandidate] = useState<CandidateProfile>(TANG_CANDIDATE_PROFILE);
  const [currentJob, setCurrentJob] = useState<ExtractedJobData>(STRIPE_FRONTEND_ARCHITECT_JD);
  const [activeViewMode, setActiveViewMode] = useState<'ingestion' | 'simulator'>('ingestion');
  const [isBuggyMode, setIsBuggyMode] = useState<boolean>(false); // default to fixed 3000+ chars
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [dashboardTab, setDashboardTab] = useState<string>('diagnostics');
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isInPageModalOpen, setIsInPageModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHud, setShowHud] = useState<boolean>(true);

  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState<boolean>(false);

  // Match analysis state
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult>({
    jobTitle: STRIPE_FRONTEND_ARCHITECT_JD.title,
    company: STRIPE_FRONTEND_ARCHITECT_JD.company,
    location: STRIPE_FRONTEND_ARCHITECT_JD.location,
    salary: STRIPE_FRONTEND_ARCHITECT_JD.salary,
    charCountCaptured: STRIPE_FRONTEND_ARCHITECT_JD.characterCount,
    wordCountCaptured: STRIPE_FRONTEND_ARCHITECT_JD.wordCount,
    isTruncatedWarning: false,
    extractionMethod: STRIPE_FRONTEND_ARCHITECT_JD.extractionSource,
    overallMatchScore: 92,
    matchTier: 'Top 1% Exceptional',
    matchHeadline: '92% Exceptional Architect Match (15+ YOE Frontend & High-Performance Distributed Systems)',
    diagnosticComparison: {
      buggy153CharResult: {
        charsCaptured: 153,
        skillsFoundInJd: 1,
        apparentScore: 98,
        falsityReason:
          'Previous scraper captured only top 153 chars greeting, missing critical requirements like microfrontends, sub-100ms latency, and Web Vitals, resulting in an inaccurate score.'
      },
      fixed3000CharResult: {
        charsCaptured: STRIPE_FRONTEND_ARCHITECT_JD.characterCount,
        skillsFoundInJd: 12,
        realScore: 92,
        truthSummary:
          'With 3,000+ chars captured, deep analysis detected TypeScript/React microfrontends, 40+ squad design systems, and sub-100ms optimization, perfectly validating the candidate’s 15+ years experience.'
      }
    },
    scoreBreakdown: {
      coreTechnicalSkills: {
        score: 38,
        max: 40,
        details: 'TypeScript, React, Next.js, Node.js, microfrontend architectures, and end-to-end type safety 100% aligned.'
      },
      domainAndMethodology: {
        score: 23,
        max: 25,
        details: 'Large-scale payments settlement, multi-team design system governance, and strict Core Web Vitals.'
      },
      seniorityAndArchitecture: {
        score: 19,
        max: 20,
        details: '15+ years experience leading major cross-team architectural refactorings and mentoring senior engineers.'
      },
      educationAndCredentials: {
        score: 12,
        max: 15,
        details: 'B.S. in Computer Science with AWS Solutions Architect certification.'
      }
    },
    verifiedSkills: [
      {
        name: 'TypeScript & React Architecture',
        category: 'Technical',
        resumeEvidence: '15+ YOE architecting high-performance React/TypeScript apps and microfrontend infrastructure',
        jdContext: 'Architect, build, and maintain performance-critical UI components and design systems'
      },
      {
        name: 'Microfrontends & Modular Systems',
        category: 'Technical',
        resumeEvidence: 'Led microfrontend decoupling & deployment pipelines with 99.99% availability',
        jdContext: 'Drive microfrontend decoupling, isolated builds, code-splitting strategies'
      },
      {
        name: 'Web Vitals & Performance Optimization',
        category: 'Technical',
        resumeEvidence: 'Optimized Core Web Vitals LCP < 1.2s, reduced bundle size by 42%',
        jdContext: 'Ensuring sub-100ms interaction latencies and strict Web Vitals compliance'
      },
      {
        name: 'System Design & Distributed Scalability',
        category: 'Methodology',
        resumeEvidence: 'Solid distributed systems and high-concurrency experience handling massive scale',
        jdContext: 'Large-scale distributed web applications processing millions of daily transactions'
      },
      {
        name: 'CI/CD & Automated Quality Gates',
        category: 'Tool',
        resumeEvidence: 'Built automated test suites (Jest, Playwright) and multi-stage CI/CD pipelines',
        jdContext: 'Establishing high-standard automated testing (Jest, Playwright) and CI/CD'
      }
    ],
    missingSkillGaps: [
      {
        name: 'GraphQL & gRPC Federation Tuning',
        category: 'Technical',
        importance: 'Nice-to-have',
        howToBridge: 'Highlight API contract governance (GraphQL/REST) and schema abstraction in cover letter.'
      }
    ],
    careerPivot: {
      isCrossTrack: false,
      fromTrack: 'Senior Fullstack / Frontend Architect',
      toTrack: 'Staff Frontend Architect',
      pivotFeasibility: 'High',
      pivotFeasibilityScore: 92,
      transferableSuperpowers: [
        '15 years enterprise frontend infrastructure and microfrontend decoupling experience',
        'Proven performance track record (LCP < 1.2s, 42% bundle reduction, sub-100ms latencies)',
        'Holistic end-to-end architectural perspective bridging UI ergonomics with backend scalability'
      ],
      gapBridgingRoadmap: [
        {
          phase: 'Phase 1: Contract Alignment',
          action: 'Emphasize cross-team API contract governance (GraphQL/REST) and strict TypeScript typing in cover letter.',
          timeframe: 'Immediate'
        },
        {
          phase: 'Phase 2: Organizational Impact',
          action: 'Detail how you scaled a unified Design System and automated quality gates across 40+ squads.',
          timeframe: 'Interview'
        }
      ],
      interviewTalkingPoints: [
        'Walk through smoothly decoupling a monolithic frontend into resilient microfrontends with 99.99% uptime.',
        'Share metrics on bundle size reduction and Web Vitals optimization in high-concurrency checkout flows.'
      ],
      keyPivotNarrative:
        'With 15 years architecting enterprise frontend infrastructure and distributed systems, the candidate not only fulfills Stripe’s rigorous component craftsmanship standards, but brings the organizational leadership required to scale design systems across 40+ squads.'
    },
    resumeRewrites: [
      {
        originalExperience: 'Led team developing frontend components and managed daily code reviews and deployments.',
        optimizedBullet:
          'Spearheaded microfrontend architecture evolution and unified design system adoption across 40+ engineering squads; enforced rigorous automated quality gates (Jest / Playwright), driving Core Web Vitals LCP < 1.2s and sustaining 99.99% uptime across core payment flows.',
        pivotImpact: 'Directly aligns with Stripe JD requirements for sub-100ms latencies and multi-squad design system governance.'
      }
    ],
    coverLetters: {
      tier3Free: `Dear Stripe Hiring Team,\n\nI am writing to express my strong enthusiasm for the Staff Frontend Architect position at Stripe. With over 15 years of engineering experience architecting scalable frontend systems and resilient web infrastructures, I have dedicated my career to building high-performance, developer-friendly interfaces that process millions of critical transactions daily.\n\nThroughout my career, I have spearheaded the evolution of decoupled microfrontends, reduced bundle sizes by 42%, and driven Core Web Vitals (LCP < 1.2s) across large-scale commercial platforms. What excites me most about Stripe is your relentless commitment to developer ergonomics and rock-solid payment reliability.\n\nI look forward to discussing how my experience scaling design systems across dozens of squads and enforcing type-safe client-server contracts can contribute to Stripe's ongoing mission.\n\nSincerely,\nCandidate (PII Scrubbed)`,
      tier4Pro: `Dear Stripe Engineering Leadership Team,\n\nI am thrilled to apply for the Staff Frontend Architect role at Stripe. Having spent 15+ years architecting mission-critical web applications and frontend infrastructure, I resonate deeply with Stripe's craft-driven approach to developer tools, payment elements, and global financial infrastructure.\n\nKey alignments with your requirements include:\n• Performance-Critical Architecture: Proven track record driving web vitals and sub-100ms interaction latencies across high-concurrency transaction flows, slashing bundle overhead by 42%.\n• Scale & System Governance: Successfully unified design systems and UI component pipelines across 40+ squads with TypeScript strict typing and robust Jest/Playwright coverage.\n• End-to-End Type Safety: Deep expertise bridging distributed backend services with client applications via schema-first architectures.\n\nI would welcome the opportunity to connect and share detailed architectural case studies on building scalable frontend platforms at Stripe.\n\nSincerely,\nCandidate (PII Scrubbed: Tang / Krishna / AI Technician)`
    }
  });

  const candidatePresets = [
    TANG_CANDIDATE_PROFILE,
    DEFAULT_CANDIDATE,
    {
      id: 'ai-quant-engineer',
      name: 'Quantitative Data / AI Algorithm Engineer',
      title: 'Senior Quantitative Data Engineer',
      location: 'New York, NY / Remote',
      targetRole: 'AI Trainer / Product Analyst',
      yearsOfExperience: 8,
      education: 'Master of Applied Statistics',
      certifications: ['AWS Machine Learning Specialty'],
      isAnonymousMode: true,
      anonymizedLabel: 'Anonymous Mode Active (PII Scrubbed)',
      uploadedFileName: 'quant-data-engineer.pdf',
      uploadedFileSize: '76 KB',
      rawResumeText: '8+ years of quantitative data analysis and machine learning workflows. Expert in Python, SQL, and statistical inference. Led dozens of large-scale A/B experiments and predictive models, actively participating in LLM RLHF and instruction tuning pipelines.',
      skills: ['Python', 'SQL', 'PyTorch', 'A/B Testing', 'Hypothesis Testing', 'Statistical Modeling', 'Predictive Modeling', 'Pandas', 'Scikit-learn', 'AWS']
    }
  ];

  const runAnalysis = async (job: ExtractedJobData, cand: CandidateProfile) => {
    setIsLoading(true);
    try {
      const jdText = isBuggyMode ? job.rawTruncatedSnippet153 : job.fullBodyText;
      const result = await analyzeJobMatch({
        jobDescription: jdText,
        resumeText: cand.rawResumeText,
        candidateSkills: cand.skills,
      });
      setMatchResult(result);
      TelemetryManager.track('match_score_viewed', {
        jobTitle: job.title,
        company: job.company,
        score: result.overallMatchScore,
        tier: result.matchTier,
        charsAnalyzed: jdText.length
      });
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectJobPreset = (preset: ExtractedJobData) => {
    setCurrentJob(preset);
    TelemetryManager.track('job_extracted_auto', {
      jobTitle: preset.title,
      company: preset.company,
      charCount: preset.characterCount
    });
    runAnalysis(preset, candidate);
  };

  const handleSelectCandidatePreset = (preset: CandidateProfile) => {
    setCandidate(preset);
    TelemetryManager.track('candidate_profile_switched', {
      candidateName: preset.name,
      targetRole: preset.targetRole || preset.title
    });
    runAnalysis(currentJob, preset);
  };

  const handleCustomExtract = async (rawInput: string) => {
    setIsLoading(true);
    try {
      const isUrl = rawInput.startsWith('http://') || rawInput.startsWith('https://');
      const payload = isUrl ? { url: rawInput } : { text: rawInput };
      const extracted = await extractJobContent(payload);
      setCurrentJob(extracted);
      TelemetryManager.track('job_extracted_manual', {
        isUrl,
        charCount: extracted.characterCount,
        title: extracted.title
      });
      await runAnalysis(extracted, candidate);
    } catch (err) {
      console.error('Custom extract error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCandidate = (updated: CandidateProfile) => {
    setCandidate(updated);
    runAnalysis(currentJob, updated);
  };

  const handleClearCandidate = () => {
    const emptyCand: CandidateProfile = {
      id: 'empty-custom',
      name: 'Custom Candidate',
      title: 'Senior Software Engineer',
      yearsOfExperience: 0,
      education: 'B.S. in Computer Science',
      certifications: [],
      rawResumeText: '',
      skills: [],
    };
    setCandidate(emptyCand);
    setIsCandidateModalOpen(true);
  };

  const handleOpenDashboardWithTab = (tab: string = 'diagnostics') => {
    setDashboardTab(tab);
    setIsDashboardOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Top Application Header matching user screenshot */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white">
                  SUPERJOBGENIE
                </h1>
                <span className="text-[10px] font-bold bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Career Pivot Intelligence
                </span>
              </div>
              <p className="text-xs bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent font-medium">
                8,000+ Chars Full Deep Extraction & Multi-Track Pivot Platform
              </p>
            </div>
          </div>

          {/* Center Target Role & Privacy Pill */}
          <div className="hidden xl:flex items-center gap-2 text-xs bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400">Target:</span>
            <span className="font-semibold text-white truncate max-w-xs">{candidate.targetRole || candidate.title}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{candidate.location || 'San Francisco / Remote'}</span>
            <button
              onClick={() => {
                const nextState = !candidate.isAnonymousMode;
                handleSaveCandidate({
                  ...candidate,
                  isAnonymousMode: nextState,
                  anonymizedLabel: nextState ? 'Anonymous Mode Active (PII Scrubbed: Tang / Krishna / AI Technician)' : 'Standard Name Mode'
                });
              }}
              className="ml-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 transition cursor-pointer"
              title="Toggle privacy anonymization mode"
            >
              {candidate.isAnonymousMode ? '✓ Privacy Mode Active' : 'Standard Mode'}
            </button>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Quick Re-calculate */}
            <button
              onClick={() => runAnalysis(currentJob, candidate)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              title="Re-calculate match and pivot analysis"
            >
              <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Re-calculate</span>
            </button>

            {/* Credits Counter */}
            <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg text-amber-300 text-xs font-bold">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>3/3 Available Credits</span>
            </div>

            {/* View Switcher: Ingestion Studio vs Live Simulator */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveViewMode('ingestion')}
                className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                  activeViewMode === 'ingestion'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Job Ingestion Workstation"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Workstation</span>
              </button>
              <button
                onClick={() => setActiveViewMode('simulator')}
                className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                  activeViewMode === 'simulator'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Indeed Job Simulator"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Indeed Simulator</span>
              </button>
            </div>

            {/* In-Page Modal Trigger Button */}
            <button
              onClick={() => setIsInPageModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              title="Open in-page modal with 3,000+ chars analysis"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Open In-Page Modal</span>
            </button>

            {/* Open Executive Dashboard */}
            <button
              onClick={() => handleOpenDashboardWithTab('diagnostics')}
              className="hidden lg:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>PRO Dashboard</span>
            </button>

            {/* V1.0 Telemetry Data Observatory */}
            <button
              onClick={() => setIsTelemetryModalOpen(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="View V1.0 user behavior telemetry & conversion funnel metrics"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">V1.0 Observatory</span>
            </button>

            {/* Export & Download Extension (English with Standalone Workstation Patch) */}
            <ExportExtensionButton
              variant="gradient"
              label="Export Extension"
              extensionName="SuperJobGenie"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {activeViewMode === 'ingestion' ? (
          <ResumeJobIngestionView
            candidate={candidate}
            jobData={currentJob}
            matchResult={matchResult}
            isBuggyMode={isBuggyMode}
            onToggleBuggyMode={() => setIsBuggyMode(!isBuggyMode)}
            onOpenEditCandidate={() => setIsCandidateModalOpen(true)}
            onSelectCandidatePreset={handleSelectCandidatePreset}
            onSelectJobPreset={handleSelectJobPreset}
            onReanalyze={() => runAnalysis(currentJob, candidate)}
            onOpenModal={() => setIsInPageModalOpen(true)}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Currently in <strong>Indeed Job Page Live Simulator</strong>. Click <strong>SuperJobGenie 🚀</strong> in the bottom right corner to open the in-page modal.</span>
              </span>
              <button
                onClick={() => setActiveViewMode('ingestion')}
                className="text-indigo-400 hover:text-indigo-300 font-bold"
              >
                Return to Workstation →
              </button>
            </div>
            <IndeedSimulator
              currentJob={currentJob}
              isBuggyMode={isBuggyMode}
              onSelectPreset={handleSelectJobPreset}
              onCustomExtract={handleCustomExtract}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Persistent Floating SuperJobGenie Launcher Button in Bottom Right Corner (Matches user video) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Toggle HUD icon */}
        <button
          onClick={() => setShowHud(!showHud)}
          className="p-2.5 text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-full border border-slate-700 shadow-xl backdrop-blur-sm transition"
          title={showHud ? 'Hide side HUD widget' : 'Show side HUD widget'}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Floating SuperJobGenie Launcher Pill */}
        <button
          onClick={() => setIsInPageModalOpen(true)}
          className="group px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-[0_8px_30px_rgba(79,70,229,0.5)] border border-indigo-400/40 font-bold text-xs flex items-center gap-2.5 transition transform hover:scale-105"
          title="Click to launch SuperJobGenie in-page modal"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="tracking-wide">SuperJobGenie 🚀</span>
          <span className="bg-black/30 text-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/10">
            {isBuggyMode ? '153 chars' : `${currentJob.characterCount.toLocaleString()} chars`}
          </span>
          <span className="bg-emerald-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full text-[11px]">
            {isBuggyMode ? '98%' : `${matchResult.overallMatchScore}%`}
          </span>
        </button>
      </div>

      {/* In-Page Floating Modal Dialog (Preserved & Enhanced) */}
      <InPageModalDialog
        isOpen={isInPageModalOpen}
        onClose={() => setIsInPageModalOpen(false)}
        jobData={currentJob}
        matchResult={matchResult}
        candidate={candidate}
        isBuggyMode={isBuggyMode}
        onToggleBuggyMode={() => setIsBuggyMode(!isBuggyMode)}
        onRescan={() => runAnalysis(currentJob, candidate)}
        onOpenDashboard={handleOpenDashboardWithTab}
        onSelectCandidatePreset={handleSelectCandidatePreset}
        candidatePresets={candidatePresets}
      />

      {/* Floating HUD Widget */}
      {showHud && (
        <HudWidget
          jobData={currentJob}
          matchResult={matchResult}
          candidate={candidate}
          isBuggyMode={isBuggyMode}
          onToggleBuggyMode={() => setIsBuggyMode(!isBuggyMode)}
          onRescan={() => runAnalysis(currentJob, candidate)}
          onOpenDashboard={handleOpenDashboardWithTab}
          onOpenEditCandidate={() => setIsCandidateModalOpen(true)}
          onClearCandidate={handleClearCandidate}
          isLoading={isLoading}
        />
      )}

      {/* Executive Dashboard Modal */}
      <ExecutiveDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        activeTab={dashboardTab}
        onTabChange={setDashboardTab}
        jobData={currentJob}
        matchResult={matchResult}
        candidate={candidate}
        isBuggyMode={isBuggyMode}
        onToggleBuggyMode={() => setIsBuggyMode(!isBuggyMode)}
      />

      {/* Candidate Profile & Resume Edit Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        candidate={candidate}
        onSave={handleSaveCandidate}
      />

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* V1.0 Telemetry Data Observatory Modal */}
      <TelemetryDashboardModal
        isOpen={isTelemetryModalOpen}
        onClose={() => setIsTelemetryModalOpen(false)}
      />
    </div>
  );
}
