import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Edit3, 
  RotateCw, 
  ExternalLink, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  Target, 
  Check, 
  ChevronRight,
  Database,
  Building,
  DollarSign,
  Crown,
  Layers,
  Code,
  Youtube
} from 'lucide-react';
import { ExtractedJobData, CandidateProfile, MatchAnalysisResult } from '../types';
import { TelemetryManager } from '../services/telemetry';
import { 
  STRIPE_FRONTEND_ARCHITECT_JD, 
  FULL_INDEED_AI_TRAINER_JD, 
  FULL_INDEED_SENIOR_BACKEND_JD,
  LINKEDIN_STAFF_INFRA_JD,
  GLASSDOOR_FINTECH_LEAD_JD,
  GREENHOUSE_AI_RESEARCH_JD
} from '../data/sampleData';

interface ResumeJobIngestionViewProps {
  candidate: CandidateProfile;
  jobData: ExtractedJobData;
  matchResult: MatchAnalysisResult;
  isBuggyMode: boolean;
  onToggleBuggyMode: () => void;
  onOpenEditCandidate: () => void;
  onSelectCandidatePreset: (preset: CandidateProfile) => void;
  onSelectJobPreset: (job: ExtractedJobData) => void;
  onCustomExtract?: (text: string) => void;
  onReanalyze: () => void;
  onOpenModal: () => void;
  onOpenJobCards?: () => void;
  isLoading: boolean;
}

export const ResumeJobIngestionView: React.FC<ResumeJobIngestionViewProps> = ({
  candidate,
  jobData,
  matchResult,
  isBuggyMode,
  onToggleBuggyMode,
  onOpenEditCandidate,
  onSelectCandidatePreset,
  onSelectJobPreset,
  onCustomExtract,
  onReanalyze,
  onOpenModal,
  onOpenJobCards,
  isLoading,
}) => {
  const [activeSourceTab, setActiveSourceTab] = useState<'indeed' | 'linkedin' | 'glassdoor' | 'ats' | 'manual'>('indeed');
  const [isAnonymousActive, setIsAnonymousActive] = useState<boolean>(candidate.isAnonymousMode ?? true);
  const [customPasteText, setCustomPasteText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);

  const displayChars = isBuggyMode ? 153 : jobData.characterCount;
  const displayScore = isBuggyMode ? 98 : matchResult.overallMatchScore;

  return (
    <div className="space-y-6 font-sans">
      
      {/* YouTube Shorts Community Welcome Banner */}
      <div className="p-3.5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-rose-950/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-600/30">
            <Youtube className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">👋 Welcome YouTube Community!</span>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                As Promised in our Shorts: 100% Free
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              No login, no credit card required. Test your resume against any job posting below to get your ATS match score &amp; tailored pitch in 10 seconds!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#ff4d15] hover:bg-[#e63e07] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-md shadow-orange-500/20"
          >
            <span>👉 Get Chrome Extension</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Solution Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-indigo-950/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">8,000+ Chars Full Deep Extraction & Career Pivot Engine</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                153-Char Truncation Eradicated · Schema.org Deep DOM
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Supports in-page popups and bottom-right <strong className="text-indigo-300">SuperJobGenie 🚀</strong> HUD invocation, integrating real resume skill multi-dimensional matching & cross-domain pivot intelligence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleBuggyMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
              isBuggyMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isBuggyMode ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{isBuggyMode ? 'Current: 153-Char Truncated (Fake 98%)' : 'Current: 8,000+ Chars Full Extraction'}</span>
          </button>

          {onOpenJobCards && (
            <button
              onClick={onOpenJobCards}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/25 transition flex items-center gap-1.5 cursor-pointer"
              title="Open Job Cards Studio (Indeed California Leads & Screenshot Studio)"
            >
              <Layers className="w-4 h-4 text-cyan-200" />
              <span>Job Cards (15 Leads)</span>
            </button>
          )}

          <button
            onClick={onOpenModal}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open SuperJobGenie HUD</span>
          </button>
        </div>
      </div>

      {/* STEP 1: Candidate Resume Ingestion & Privacy Shield */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-black text-xs">
              1
            </span>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide uppercase">
                STEP 1: Candidate Resume Ingestion & Privacy Shield
              </h2>
              <p className="text-[11px] text-slate-400">
                Candidate Resume Parsing & PII Scrubbing Protection Shield
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEditCandidate}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit Resume & Params</span>
            </button>
            <button
              onClick={onReanalyze}
              disabled={isLoading}
              className="text-xs bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-analyze Resume</span>
            </button>
          </div>
        </div>

        {/* Configuration Row: Location, Target Role, Privacy Shield */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Candidate Location
            </span>
            <div className="font-semibold text-xs text-white">
              {candidate.location || 'San Francisco, CA / London / Remote'}
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-indigo-400" />
              Target Role / Level Focus
            </span>
            <div className="font-semibold text-xs text-indigo-300">
              {candidate.targetRole || candidate.title}
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Privacy & ATS Scrubbing
              </span>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                {isAnonymousActive ? 'Anonymous Mode Active' : 'Real Name Mode'}
              </div>
            </div>
            <button
              onClick={() => setIsAnonymousActive(!isAnonymousActive)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                isAnonymousActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isAnonymousActive ? '✓ Privacy Shield On' : 'Disable Shield'}
            </button>
          </div>
        </div>

        {/* Uploaded Resume Card & Parsed Skills */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-2">
                  <span>{candidate.uploadedFileName || 'tang-resume-eng-lead.pdf'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({candidate.uploadedFileSize || '84 KB'})</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-bold">
                    ✓ Parsed & Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {candidate.yearsOfExperience}+ Years Tech Exp • CS Bachelor • Holder of AWS / K8s Authoritative Architect Certifications
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 font-mono">
              PII Scrubbed: Tang / Krishna / AI Technician
            </div>
          </div>

          {/* Resume Snippet */}
          <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
            {candidate.rawResumeText.slice(0, 260)}...
          </div>

          {/* Extracted Core Skills */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Extracted Core Skills ({candidate.skills.length} items):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: Target Job Requirements (JD Deep Scraper) */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center font-black text-xs">
              2
            </span>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide uppercase">
                STEP 2: Target Job Requirements (JD Deep Scraper)
              </h2>
              <p className="text-[11px] text-slate-400">
                Real-time Job Ingestion • Bypass 153-Char Truncation • Capture 3,000+ Chars Unabridged Duties & Requirements
              </p>
            </div>
          </div>

          {/* Platform Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setActiveSourceTab('indeed');
                setShowPasteBox(false);
                onSelectJobPreset(FULL_INDEED_AI_TRAINER_JD);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                activeSourceTab === 'indeed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Indeed (US/UK/EU)</span>
            </button>
            <button
              onClick={() => {
                setActiveSourceTab('linkedin');
                setShowPasteBox(false);
                onSelectJobPreset(LINKEDIN_STAFF_INFRA_JD);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                activeSourceTab === 'linkedin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>LinkedIn (Jobs)</span>
            </button>
            <button
              onClick={() => {
                setActiveSourceTab('glassdoor');
                setShowPasteBox(false);
                onSelectJobPreset(GLASSDOOR_FINTECH_LEAD_JD);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                activeSourceTab === 'glassdoor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Glassdoor</span>
            </button>
            <button
              onClick={() => {
                setActiveSourceTab('ats');
                setShowPasteBox(false);
                onSelectJobPreset(GREENHOUSE_AI_RESEARCH_JD);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                activeSourceTab === 'ats'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Greenhouse / Lever ATS</span>
            </button>
            <button
              onClick={() => {
                setActiveSourceTab('manual');
                setShowPasteBox(true);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                activeSourceTab === 'manual' || showPasteBox
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Paste Custom JD / URL</span>
            </button>
          </div>
        </div>

        {/* Custom Paste Textarea Box (v1.0 Zero-Install Ingestion) */}
        {(showPasteBox || activeSourceTab === 'manual') && (
          <div className="p-4 bg-indigo-950/30 border border-indigo-500/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Paste Any Job Description or Posting URL (No Install Needed):
              </span>
              <button
                onClick={() => setShowPasteBox(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Close Box ✕
              </button>
            </div>
            <textarea
              value={customPasteText}
              onChange={(e) => setCustomPasteText(e.target.value)}
              placeholder="Paste raw JD text from LinkedIn / Indeed / Greenhouse / Workday, or paste a job URL..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-mono"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                100% processed client-side. No credit card, no sign-in required.
              </p>
              <button
                onClick={() => {
                  if (customPasteText.trim() && onCustomExtract) {
                    onCustomExtract(customPasteText.trim());
                    TelemetryManager.track('custom_jd_pasted_and_analyzed', {
                      charCount: customPasteText.trim().length
                    });
                  }
                }}
                disabled={!customPasteText.trim() || isLoading}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ Calculate ATS Match Score Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Preset Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">Or Pick a Live Preset JD:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectJobPreset(STRIPE_FRONTEND_ARCHITECT_JD)}
              className={`px-3 py-1 rounded-lg font-semibold border transition ${
                jobData.title.includes('Staff Frontend')
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Stripe (Staff Frontend)
            </button>
            <button
              onClick={() => onSelectJobPreset(LINKEDIN_STAFF_INFRA_JD)}
              className={`px-3 py-1 rounded-lg font-semibold border transition ${
                jobData.title.includes('Staff Infrastructure')
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              LinkedIn: Datadog (Staff Infra)
            </button>
            <button
              onClick={() => onSelectJobPreset(GLASSDOOR_FINTECH_LEAD_JD)}
              className={`px-3 py-1 rounded-lg font-semibold border transition ${
                jobData.title.includes('Lead Architect - Core Banking')
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Glassdoor: Revolut (Fintech Lead)
            </button>
            <button
              onClick={() => onSelectJobPreset(GREENHOUSE_AI_RESEARCH_JD)}
              className={`px-3 py-1 rounded-lg font-semibold border transition ${
                jobData.title.includes('Senior AI Systems')
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Greenhouse: Anthropic (AI Systems)
            </button>
            <button
              onClick={() => onSelectJobPreset(FULL_INDEED_AI_TRAINER_JD)}
              className={`px-3 py-1 rounded-lg font-semibold border transition ${
                jobData.title.includes('AI Trainer')
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Indeed: DataAnnotation (AI Trainer)
            </button>
            <button
              onClick={() => onSelectJobPreset(FULL_INDEED_SENIOR_BACKEND_JD)}
              className={`px-3 py-1 rounded-lg font-semibold border transition ${
                jobData.title.includes('Staff / Senior Backend')
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Indeed: CloudScale (Backend Lead)
            </button>
          </div>
        </div>

        {/* Target Job Main Card */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Building className="w-3 h-3 text-purple-400" />
                Target Company / Platform
              </span>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{jobData.company}</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-mono">
                  {jobData.location}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-indigo-400" />
                Job Title
              </span>
              <div className="text-sm font-bold text-indigo-300">
                {jobData.title}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                Compensation / Salary Range
              </span>
              <div className="text-sm font-bold text-emerald-400">
                {jobData.salary || 'Competitive / Not Disclosed'}
              </div>
            </div>
          </div>

          {/* Character Capture Diagnostics Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-semibold">Extraction Depth:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {displayChars.toLocaleString()} Chars Unabridged Captured
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">
                Source: {jobData.extractionSource}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Overall Match Score:</span>
              <span className={`font-black font-mono text-sm ${isBuggyMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                {displayScore}%
              </span>
            </div>
          </div>

          {/* Job Content Body */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3 font-sans text-xs leading-relaxed text-slate-300 max-h-[380px] overflow-y-auto">
            <div className="font-bold text-white text-xs border-b border-slate-800 pb-2">
              Unabridged Job Requirements & Description
            </div>
            <div className="whitespace-pre-wrap font-sans text-xs text-slate-200 space-y-2">
              {isBuggyMode ? jobData.rawTruncatedSnippet153 : jobData.fullBodyText}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: Strategic Decision & Actionable Pivot Card */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-black text-xs">
              3
            </span>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Strategic Decision & Immediate Action</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Recommended to Apply 🚀
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                A high match score signals an excellent opportunity to apply; bridge any missing skill gaps through a customized cover letter and cross-track superpowers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenModal}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Intelligence Modal</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1: Verified Assets */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Verified Core Assets
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{matchResult.verifiedSkills.length} items</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Core technical capabilities and distributed architecture rigor fully aligned—your rock-solid foundation for interviews.
            </p>
          </div>

          {/* Card 2: Gap Bridging Strategy */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Gap Bridging Strategy
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{matchResult.missingSkillGaps.length} bridgeable</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              No need to panic over missing keywords! Reframe your engineering depth into high adaptability and problem-solving rigor.
            </p>
          </div>

          {/* Card 3: Instant Application Arsenal */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                Application Arsenal
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                Customized cover letters and targeted resume bullet rewrites generated—ready to copy & apply in 10 seconds!
              </p>
            </div>
            <button
              onClick={() => {
                TelemetryManager.track('decision_action_clicked', { source: 'ingestion_step_3' });
                onOpenModal();
              }}
              className="mt-2 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <span>View Tailored Cover Letters & Bullets →</span>
            </button>
          </div>
        </div>
      </section>

      {/* STEP 4: High-Converting Conversion Hook (v1.0 -> v2.0 Chrome Extension) */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-orange-500/50 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/40 p-6 shadow-2xl shadow-orange-500/10">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                10x Faster Workflow · Official Chrome Extension
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                ✓ 100% Client-Side Privacy (Zero Data Upload)
              </span>
            </div>

            <h3 className="text-lg lg:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>💡 Tired of copy-pasting between LinkedIn / Indeed and this page?</span>
            </h3>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Install the official <strong className="text-orange-400 font-bold">SuperJobGenie Chrome Extension (v2.0)</strong> to auto-extract full job descriptions, calculate ATS match score, and generate interview-ready cover letters <strong className="text-white underline decoration-orange-500 decoration-2">with 1-Click directly inside your browser</strong> on LinkedIn, Indeed, Glassdoor, and Greenhouse!
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Auto Extraction
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> No More Manual Copy-Pasting
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Free on Chrome Web Store
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <a
              href="https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => TelemetryManager.track('cta_install_extension_clicked', { source: 'ingestion_bottom_banner' })}
              className="px-6 py-3.5 bg-gradient-to-r from-[#ff4d15] to-orange-500 hover:from-[#e63e07] hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-orange-500/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 group text-center"
            >
              <span>👉 Add to Chrome — Free on Web Store</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </a>
            <p className="text-center text-[11px] text-slate-400 font-medium">
              ⚡ Over 10x application speed boost · 100% Free
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
