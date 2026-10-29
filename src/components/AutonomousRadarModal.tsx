import React, { useState, useEffect } from 'react';
import {
  Bot,
  Send,
  Bell,
  Mail,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  MessageSquare,
  Clock,
  Compass,
  Cpu,
  ChevronRight,
  Flame,
  Smartphone,
  X,
  MapPin,
  Globe
} from 'lucide-react';

interface AutonomousRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SimulatedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  region: 'North America' | 'Singapore' | 'Taiwan' | 'Hong Kong' | 'Global Remote';
  platform: 'Indeed US' | 'Indeed SG' | 'Indeed HK' | 'Indeed TW' | 'LinkedIn' | 'RemoteOK';
  score: number;
  salary: string;
  matchedSkills: string[];
  gapSkills: string[];
  dispatchedAt: string;
  summary: string;
  tailoredHook: string;
}

export const AutonomousRadarModal: React.FC<AutonomousRadarModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'telegram' | 'architecture' | 'code'>('simulation');
  const [threshold, setThreshold] = useState<number>(85);
  const [targetRole, setTargetRole] = useState<string>('Senior Full Stack / Distributed Systems Architect');
  const [targetLocations, setTargetLocations] = useState<string>('United States & Canada (Primary Flagship), Singapore, Taiwan, Hong Kong, Remote Global');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    'North America (US & CA)',
    'Singapore (SG)',
    'Taiwan (TW)',
    'Hong Kong (HK)',
    'Remote Global'
  ]);
  const [channelTelegram, setChannelTelegram] = useState<boolean>(true);
  const [channelEmail, setChannelEmail] = useState<boolean>(true);
  const [telegramChatId, setTelegramChatId] = useState<string>('@superjob_seeker_pro');
  const [emailAddress, setEmailAddress] = useState<string>('alex.tang@techlead.dev');
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [detectedJobs, setDetectedJobs] = useState<SimulatedJob[]>([]);
  const [selectedJobForTelegram, setSelectedJobForTelegram] = useState<SimulatedJob | null>(null);
  const [copiedCodeTab, setCopiedCodeTab] = useState<string | null>(null);
  const [phoneNotificationVisible, setPhoneNotificationVisible] = useState<boolean>(false);

  const sampleDispatchedJobs: SimulatedJob[] = [
    {
      id: 'job-us-1',
      title: 'Full Stack Software Engineer (Build Reliability)',
      company: 'SpaceX',
      location: 'Hawthorne, Los Angeles, CA (Hybrid)',
      region: 'North America',
      platform: 'Indeed US',
      score: 97,
      salary: '$125,000 - $175,000 / yr',
      matchedSkills: ['Python & C#', 'Distributed Microservices', 'High-Throughput Telemetry', 'Docker / Kubernetes', 'PostgreSQL'],
      gapSkills: ['AS9100 Aerospace Compliance'],
      dispatchedAt: 'Just now',
      summary: 'Matches 97% of your candidate profile. Full 5,523 char JD verified with zero keyword truncation.',
      tailoredHook: '15+ years architecting mission-critical distributed systems and sub-second telemetry pipelines.'
    },
    {
      id: 'job-sg-1',
      title: 'Senior Backend Engineer (Distributed Systems)',
      company: 'SeaMoney (Shopee FinTech)',
      location: 'Singapore (Hybrid)',
      region: 'Singapore',
      platform: 'Indeed SG',
      score: 94,
      salary: 'SGD 11,500 - 15,000 / mo',
      matchedSkills: ['Go / Golang', 'Distributed Microservices', 'Kafka / Redis', 'High Concurrency', 'PostgreSQL'],
      gapSkills: ['Kubernetes Helm Chart Tuning'],
      dispatchedAt: '2 mins ago',
      summary: 'Matches 94% of your resume. Full 8,400 char JD verified. High-urgency hiring manager tag.',
      tailoredHook: '15+ years architecting fault-tolerant microservices, directly matching SeaMoney high-throughput payment settlement.'
    },
    {
      id: 'job-tw-1',
      title: 'Senior Software Engineer, Backend Development',
      company: 'Appier (AI SaaS)',
      location: 'Taipei, Taiwan (Hybrid / Remote)',
      region: 'Taiwan',
      platform: 'Indeed TW',
      score: 91,
      salary: 'TWD 160,000 - 220,000 / mo',
      matchedSkills: ['Golang & Python', 'Microservices Architecture', 'RESTful APIs', 'AWS Cloud', 'High-Concurrency Systems'],
      gapSkills: ['Playable Ad Tech Protocols'],
      dispatchedAt: '5 mins ago',
      summary: 'Matches 91% of your resume. Unabridged full JD captured from Indeed Taiwan details pane.',
      tailoredHook: 'Demonstrated leadership in enterprise SaaS scalability and cloud-native microservice transformations.'
    },
    {
      id: 'job-hk-1',
      title: 'Senior Analyst Programmer / Backend Engineer',
      company: 'Standard Chartered Bank',
      location: 'Quarry Bay, Hong Kong Island',
      region: 'Hong Kong',
      platform: 'Indeed HK',
      score: 89,
      salary: 'HKD 55,000 - 75,000 / mo',
      matchedSkills: ['Spring Boot / Java', 'Financial System Design', 'Oracle / PostgreSQL', 'CI/CD Pipeline', 'Agile Leadership'],
      gapSkills: ['HKMA Regulatory Guidelines'],
      dispatchedAt: '8 mins ago',
      summary: 'Matches 89% of your resume. Verified financial architecture requirements from Indeed HK.',
      tailoredHook: 'Enterprise-grade code review rigor and 99.99% transaction reliability across high-volume platforms.'
    },
    {
      id: 'job-remote-1',
      title: 'Staff Distributed Systems Engineer',
      company: 'GitLab Ecosystem Partner',
      location: 'Global Remote (US / APAC Timezones)',
      region: 'Global Remote',
      platform: 'RemoteOK',
      score: 88,
      salary: '$140,000 - $185,000 USD / yr',
      matchedSkills: ['CI/CD Automation', 'Docker & K8s', 'Type-Safe Microservices', 'Distributed Observability'],
      gapSkills: ['Terraform CDK'],
      dispatchedAt: '12 mins ago',
      summary: 'Matches 88% of your resume. Async-first global engineering squad with flexible hours.',
      tailoredHook: 'Spearheaded automated quality gates and distributed container pipelines across 40+ squads.'
    }
  ];

  // Initialize with the top matched job
  useEffect(() => {
    if (!selectedJobForTelegram && sampleDispatchedJobs.length > 0) {
      setSelectedJobForTelegram(sampleDispatchedJobs[0]);
    }
  }, []);

  const toggleRegion = (regionName: string) => {
    setSelectedRegions(prev => {
      const exists = prev.includes(regionName);
      const updated = exists ? prev.filter(r => r !== regionName) : [...prev, regionName];
      setTargetLocations(updated.join(', '));
      return updated;
    });
  };

  const handleRunRadarScan = () => {
    setIsScanning(true);
    setScanLogs([]);
    setDetectedJobs([]);
    setPhoneNotificationVisible(false);

    const logSteps = [
      '📡 [RADAR] Initializing SuperJobGenie Autonomous Scout Worker...',
      '🗺️ [REGIONS] Locking primary flagship theater: United States & Canada (North America)...',
      '🌐 [CROSS-EXPAND] Linking APAC & Global sectors: Singapore, Taiwan (tw.indeed.com), Hong Kong (hk.indeed.com), Remote...',
      '🔍 [CRAWL] Scraping active job streams: Indeed Global, LinkedIn, Glassdoor, RemoteOK...',
      '📥 [INGEST] Discovered 28 candidate postings, capturing unabridged full-text DOMs (avg 6,800 chars)...',
      '🧠 [EVAL] Executing local semantic matrix engine against Candidate Profile (15+ YOE Senior Staff SWE)...',
      '⚖️ [FILTER] Enforcing role fit threshold: Match Score >= ' + threshold + '%...',
      '🎯 [DISCOVER] Intercepted ' + sampleDispatchedJobs.filter(j => j.score >= threshold).length + ' top-tier matches (SpaceX 97%, SeaMoney SG 94%, Appier TW 91%, StanChart HK 89%)!',
      '📱 [DISPATCH] Generating rich Markdown cards & 1-click apply links for Telegram Bot...',
      '🚀 [SUCCESS] Telemetry dispatched! Mobile phone received immediate top-match notification.'
    ];

    logSteps.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, log]);
        if (index === 6) {
          setDetectedJobs(sampleDispatchedJobs.filter(j => j.score >= threshold));
        }
        if (index === logSteps.length - 1) {
          setIsScanning(false);
          setPhoneNotificationVisible(true);
          setSelectedJobForTelegram(sampleDispatchedJobs[0]);
        }
      }, (index + 1) * 360);
    });
  };

  const handleCopyCode = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeTab(tabId);
    setTimeout(() => setCopiedCodeTab(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  SuperJobGenie Autonomous Scout Radar &amp; Bot Dispatch System
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase tracking-wide">
                  Autonomous Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Profile Ingestion → 24/7 Silent Autonomous Crawl → ≥85% Top Fit Instant Dispatch (Telegram &amp; Email)
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'simulation'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Live Simulation &amp; Cruise Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'telegram'
                ? 'border-indigo-400 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Telegram Phone Dispatch Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3-Tier Architecture Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'code'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Production Code Implementation</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: SIMULATION & RADAR CONTROLS */}
          {activeTab === 'simulation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Control Panel: Configurations */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      Radar Cruise Configuration
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                      ● READY
                    </span>
                  </div>

                  {/* Target Role */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Target Job Roles
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Target Locations with Flagship North America & APAC */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Target Regions &amp; Theaters
                      </label>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        ★ North America Flagship
                      </span>
                    </div>

                    {/* Quick Selection Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[
                        { key: 'North America (US & CA)', label: '🇺🇸 North America (Primary)', badge: 'Primary' },
                        { key: 'Singapore (SG)', label: '🇸🇬 Singapore', badge: 'APAC' },
                        { key: 'Taiwan (TW)', label: '🇹🇼 Taiwan', badge: 'APAC' },
                        { key: 'Hong Kong (HK)', label: '🇭🇰 Hong Kong', badge: 'APAC' },
                        { key: 'Remote Global', label: '🌐 Remote Global', badge: 'Global' }
                      ].map(reg => {
                        const isSelected = selectedRegions.includes(reg.key);
                        return (
                          <button
                            key={reg.key}
                            type="button"
                            onClick={() => toggleRegion(reg.key)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 border ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <span>{reg.label}</span>
                            {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      value={targetLocations}
                      onChange={(e) => setTargetLocations(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Threshold Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-300">Alert Match Threshold</span>
                      <span className="text-cyan-400 font-bold font-mono px-2 py-0.5 bg-cyan-950/80 rounded border border-cyan-800 text-xs">
                        ≥ {threshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={65}
                      max={95}
                      step={1}
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>Broad (65%)</span>
                      <span className="text-cyan-400 font-semibold">Recommended (85%)</span>
                      <span>Strict (95%)</span>
                    </div>
                  </div>

                  {/* Notification Channels */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-medium text-slate-300">
                      Dispatch Channels
                    </span>
                    
                    <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-sky-400" />
                        <span className="text-xs text-slate-200">Telegram Bot (@SuperJobGenieBot)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={channelTelegram}
                        onChange={(e) => setChannelTelegram(e.target.checked)}
                        className="rounded accent-cyan-400 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-200">Email Alerts (Resend / SendGrid)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={channelEmail}
                        onChange={(e) => setChannelEmail(e.target.checked)}
                        className="rounded accent-cyan-400 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Run Button */}
                  <button
                    onClick={handleRunRadarScan}
                    disabled={isScanning}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isScanning ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin text-white" />
                        <span>Scanning Global Job Stream in Background...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Simulate Autonomous Radar Scan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Panel: Terminal Logs & Live Dispatched Feed */}
              <div className="lg:col-span-7 space-y-4 flex flex-col">
                {/* Terminal Window */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs flex flex-col h-56">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-slate-400">superjobgenie-radar-daemon.sh</span>
                    </div>
                    <span className="text-[10px] text-cyan-400">CRON: EVERY 30 MIN</span>
                  </div>

                  <div className="p-3 overflow-y-auto flex-1 space-y-1 text-slate-300">
                    {scanLogs.length === 0 ? (
                      <div className="text-slate-500 italic py-6 text-center">
                        Click [Simulate Autonomous Radar Scan] on the left to monitor real-time crawling logs, semantic matching, and Telegram alert pipeline...
                      </div>
                    ) : (
                      scanLogs.map((log, i) => (
                        <div key={i} className="leading-relaxed animate-in fade-in duration-150">
                          {log.includes('SUCCESS') ? (
                            <span className="text-emerald-400 font-bold">{log}</span>
                          ) : log.includes('DISPATCH') || log.includes('DISCOVER') ? (
                            <span className="text-cyan-300 font-semibold">{log}</span>
                          ) : log.includes('CRON') || log.includes('RADAR') || log.includes('REGIONS') ? (
                            <span className="text-indigo-300">{log}</span>
                          ) : (
                            <span>{log}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Dispatched Results */}
                <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      Intercepted Positions Above Threshold (≥{threshold}%)
                    </span>
                    <span className="text-xs font-mono text-cyan-400">
                      {detectedJobs.length > 0 ? `${detectedJobs.length} Jobs Alert Dispatched` : 'Awaiting Radar Interception'}
                    </span>
                  </div>

                  {detectedJobs.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No positions triggered yet. Run the simulation scan above or adjust the threshold slider.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {detectedJobs.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJobForTelegram(job)}
                          className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 ${
                            selectedJobForTelegram?.id === job.id
                              ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {job.platform}
                              </span>
                              <span className="text-xs font-bold text-white truncate">
                                {job.title}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span className="text-cyan-300 font-semibold">{job.company}</span>
                              <span>•</span>
                              <span>{job.location}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-mono">{job.salary}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right">
                              <span className="text-base font-black font-mono text-cyan-400">
                                {job.score}%
                              </span>
                              <span className="block text-[9px] text-slate-500 uppercase">
                                Fit Score
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TELEGRAM PHONE NOTIFICATION PREVIEW */}
          {activeTab === 'telegram' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Phone Frame Simulator */}
              <div className="md:col-span-6 flex justify-center">
                <div className="w-[340px] bg-slate-950 rounded-[36px] border-4 border-slate-700 shadow-2xl p-3 relative overflow-hidden">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {/* Screen Content */}
                  <div className="bg-[#17212b] rounded-[28px] overflow-hidden pt-7 pb-4 px-3 flex flex-col min-h-[520px] text-white">
                    {/* Telegram Header */}
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#232e3c] mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-md">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>SuperJobGenie Radar</span>
                          <span className="text-[9px] bg-cyan-900/80 text-cyan-300 px-1 rounded font-mono">bot</span>
                        </div>
                        <div className="text-[10px] text-[#708499]">automated career sentinel</div>
                      </div>
                    </div>

                    {/* Telegram Message Bubble */}
                    <div className="bg-[#1e2c3a] rounded-2xl p-3.5 border border-[#2c3e50] shadow-sm space-y-2.5 text-xs text-slate-200">
                      <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold border-b border-[#2c3e50]/70 pb-1.5">
                        <span className="flex items-center gap-1">
                          🎯 Top-Match Opportunity Intercepted
                        </span>
                        <span className="font-mono text-emerald-400 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-800 text-[10px]">
                          {selectedJobForTelegram?.score || 97}% Fit
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-sm text-white">
                          {selectedJobForTelegram?.title || 'Full Stack Software Engineer'}
                        </div>
                        <div className="text-[#8ba2b9] text-[11px] mt-0.5">
                          🏢 {selectedJobForTelegram?.company || 'SpaceX'} • 📍 {selectedJobForTelegram?.location || 'Hawthorne, CA'}
                        </div>
                        <div className="text-emerald-300 text-[11px] font-mono mt-0.5">
                          💰 {selectedJobForTelegram?.salary || '$125,000 - $175,000 / yr'}
                        </div>
                      </div>

                      <div className="bg-[#17212b] p-2 rounded-lg text-[11px] space-y-1 border border-[#283849]">
                        <div className="text-slate-400 font-semibold text-[10px] uppercase">
                          ✨ Top Verified Technical Alignments:
                        </div>
                        <div className="text-slate-200 flex flex-wrap gap-1">
                          {selectedJobForTelegram?.matchedSkills.slice(0, 4).map((s, idx) => (
                            <span key={idx} className="bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded text-[10px] border border-cyan-800">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/50">
                        <span className="text-indigo-300 font-semibold text-[10px] block">
                          📝 Strategic Pitch Hook:
                        </span>
                        <span className="text-[10px] italic text-slate-300">
                          "{selectedJobForTelegram?.tailoredHook}"
                        </span>
                      </div>

                      {/* Telegram Interactive Buttons */}
                      <div className="space-y-1.5 pt-1">
                        <button className="w-full py-1.5 bg-[#2b5278] hover:bg-[#326291] text-white font-bold rounded-lg text-center text-xs flex items-center justify-center gap-1.5 transition">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Apply on {selectedJobForTelegram?.platform || 'Job Board'}</span>
                        </button>
                        <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-center text-xs flex items-center justify-center gap-1.5 transition">
                          <Copy className="w-3 h-3" />
                          <span>Copy Pre-Generated Cover Letter</span>
                        </button>
                      </div>

                      <div className="text-[9px] text-[#708499] text-right font-mono">
                        11:42 AM · SuperJobGenie Radar
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telegram Bot Setup Instructions */}
              <div className="md:col-span-6 space-y-4">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-sky-400" />
                    <h3 className="text-sm font-bold text-white">
                      Why Telegram Bot is the Ultimate Sentinel for Tech Professionals
                    </h3>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Zero-Friction Instant Delivery</strong>: No extra app installation required; global engineers keep Telegram active 24/7.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Sub-Second Rich Interactive Cards</strong>: Supports Markdown, clickable inline buttons, instant job board links, and one-click pitch copy.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>100% Free &amp; Unlimited Quotas</strong>: Official Telegram Bot API has zero recurring commercial messaging fees.</span>
                    </li>
                  </ul>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold block">
                      3-Step Setup for Official Telegram Bot:
                    </span>
                    <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                      <li>Search for <span className="text-white font-mono">@BotFather</span> in Telegram and send <span className="text-cyan-300 font-mono">/newbot</span> to receive your <strong>API Token</strong></li>
                      <li>Send a test message to your Bot and call <span className="text-white font-mono">getUpdates</span> to retrieve your <strong>Chat ID</strong></li>
                      <li>Paste your Token and Chat ID into SuperJobGenie to activate silent, 24/7 job cruising!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGIC 3-TIER ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 rounded-xl p-5">
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Strategic Roadmap: Upgrading from Browser Copilot to 24/7 Autonomous Scout
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Job seekers waste 2 hours daily manually refreshing job portals and calculating ATS scores.
                  By enabling a silent sentinel where users configure preferences before sleep and wake up to 3 verified 90%+ match opportunities on Telegram, user retention and viral growth compound exponentially.
                </p>
              </div>

              {/* 3 Tiers Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tier 1 */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded w-fit border border-emerald-800 mb-2 font-bold">
                      Tier A · Zero Server Cost
                    </div>
                    <h4 className="text-sm font-bold text-white">Extension Client-Side Alarm Engine</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Utilizes Manifest V3 <span className="text-cyan-300 font-mono">chrome.alarms</span> to wake background service workers periodically. While Chrome is active, it scans open RSS job streams and computes match scores 100% locally.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="text-emerald-400">✓ Advantage: Zero server bills, 100% local privacy</div>
                    <div className="text-slate-400">• Trade-off: Requires browser to remain running</div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="bg-slate-950/80 border border-cyan-700/60 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-lg shadow-cyan-500/5">
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded w-fit border border-cyan-800 mb-2 font-bold">
                      Tier B · Cloud Sentinel (Recommended)
                    </div>
                    <h4 className="text-sm font-bold text-white">Serverless Cloud Cron Dispatcher</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Deploy Cloudflare Workers / GitHub Actions / Vercel Cron every 2 hours. Ingest open job feeds, execute the match matrix, and dispatch instant webhooks to Telegram &amp; Email when threshold is met.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="text-cyan-300">✓ Advantage: 24/7 cruise even when user's PC is asleep</div>
                    <div className="text-slate-400">• Cost: Free tier covers tens of thousands of runs</div>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded w-fit border border-indigo-800 mb-2 font-bold">
                      Tier C · Interactive Auto-Apply
                    </div>
                    <h4 className="text-sm font-bold text-white">Interactive 1-Click Submission Bot</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Embed action buttons in Telegram cards: <span className="text-amber-300 font-mono">[🚀 Confirm &amp; Submit Application]</span>. When tapped, a headless worker submits the pre-generated cover letter with human-in-the-loop safety.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="text-indigo-300">✓ Advantage: Industry-leading autonomous efficiency</div>
                    <div className="text-slate-400">• Safety: Retains human confirmation step</div>
                  </div>
                </div>
              </div>

              {/* Anti-Bot Guidelines */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Anti-Scraping &amp; Platform Security Defense Architecture
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">1. Prioritize Public RSS &amp; Open APIs</strong>
                    Indeed, RemoteOK, and major boards offer standard RSS feeds that bypass Cloudflare anti-bot blocks without triggering rate limits.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">2. Decentralized Client-Side Polling</strong>
                    Under Tier A, requests originate naturally from distributed candidate IP addresses, eliminating central scraper bot signatures.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">3. Sniper Precision Over Spam</strong>
                    Only alert on high-probability (≥85% to 90%) fits—delivering 1-3 high-conversion leads per day and preventing inbox fatigue.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: READY-TO-USE CODE IMPLEMENTATION */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Production-ready boilerplate for direct deployment into Node.js or Chrome Extension service workers:
                </div>
                {copiedCodeTab && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" /> Copied to clipboard!
                  </span>
                )}
              </div>

              {/* Code Snippet 1: Telegram Webhook */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold">1. telegramDispatcher.ts (Dispatches rich interactive cards via Telegram API)</span>
                  <button
                    onClick={() => handleCopyCode(telegramCodeSample, 'tg')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded cursor-pointer transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-slate-300 text-[11px] leading-relaxed">
                  <code>{telegramCodeSample}</code>
                </pre>
              </div>

              {/* Code Snippet 2: Chrome Alarm Cron */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                  <span className="text-emerald-400 font-bold">2. backgroundCron.js (Manifest V3 Background Service Worker Alarm)</span>
                  <button
                    onClick={() => handleCopyCode(chromeAlarmCodeSample, 'chrome')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded cursor-pointer transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-slate-300 text-[11px] leading-relaxed">
                  <code>{chromeAlarmCodeSample}</code>
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SuperJobGenie Autonomous Sentinel 3.3.0 · Multi-Region Flagship Ready</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition cursor-pointer"
          >
            Close Mission Center
          </button>
        </div>

      </div>
    </div>
  );
};

const telegramCodeSample = `// Telegram Bot Rich Interactive Card Dispatcher (Zero 3rd-party dependencies, native fetch)
export async function sendTelegramJobAlert({
  botToken,
  chatId,
  jobTitle,
  company,
  location,
  salary,
  matchScore,
  matchedSkills,
  applyUrl,
  tailoredCoverLetterHook
}: {
  botToken: string;
  chatId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  matchedSkills: string[];
  applyUrl: string;
  tailoredCoverLetterHook: string;
}) {
  const messageText = 
\`🎯 *[SuperJobGenie High-Match Opportunity Intercepted]*

🏆 *Role*: \${jobTitle}
🏢 *Company*: \${company}
📍 *Location*: \${location}
💰 *Compensation*: \${salary}
🔥 *Role Fit*: *\${matchScore}% (Top Tier)*

✨ *Key Verified Technical Alignments*:
\${matchedSkills.map(s => \`• \${s}\`).join('\\n')}

📝 *Strategic Pitch Hook*:
_"\${tailoredCoverLetterHook}"_

⚡ Click buttons below to apply directly or copy tailored cover letter!\`;

  const payload = {
    chat_id: chatId,
    text: messageText,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔗 View Position on Job Board', url: applyUrl }
        ],
        [
          { text: '📋 Copy Tailored Pitch Letter', callback_data: 'copy_letter' }
        ]
      ]
    }
  };

  const response = await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.json();
}`;

const chromeAlarmCodeSample = `// Chrome Extension Manifest V3 - background.js Periodic Sentinel Cruise
chrome.runtime.onInstalled.addListener(() => {
  // Register 30-minute cruise alarm
  chrome.alarms.create('superjob_radar_cron', {
    periodInMinutes: 30
  });
  console.log('[SuperJobGenie] Autonomous background radar initialized');
});

// Alarm Listener
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'superjob_radar_cron') {
    const { resumeProfile, targetCriteria, matchThreshold, telegramConfig } = 
      await chrome.storage.local.get(['resumeProfile', 'targetCriteria', 'matchThreshold', 'telegramConfig']);
    
    if (!resumeProfile || !telegramConfig) return;

    // 1. Fetch live jobs across North America & APAC job streams
    const jobs = await fetchOpenJobFeeds(targetCriteria);

    // 2. Local semantic match engine evaluation
    for (const job of jobs) {
      const match = await calculateLocalMatchScore(job, resumeProfile);
      
      // 3. Dispatch alert when match meets threshold (e.g., >= 85%)
      if (match.score >= (matchThreshold || 85)) {
        await dispatchTelegramNotification(telegramConfig, job, match);
      }
    }
  }
});`;
