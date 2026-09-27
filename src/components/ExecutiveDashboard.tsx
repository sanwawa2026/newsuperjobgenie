import React, { useState } from 'react';
import { 
  Crown, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Layers, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Compass, 
  Briefcase,
  Award,
  Terminal,
  Cpu
} from 'lucide-react';
import { MatchAnalysisResult, ExtractedJobData, CandidateProfile } from '../types';
import { TelemetryManager } from '../services/telemetry';

interface ExecutiveDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  jobData: ExtractedJobData;
  matchResult: MatchAnalysisResult;
  candidate: CandidateProfile;
  isBuggyMode: boolean;
  onToggleBuggyMode: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  jobData,
  matchResult,
  candidate,
  isBuggyMode,
  onToggleBuggyMode,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);

    if (key.includes('tier') || key.includes('letter')) {
      TelemetryManager.track('cover_letter_copied', {
        source: 'executive_dashboard',
        key
      });
    } else if (key.includes('rewrite') || key.includes('bullet')) {
      TelemetryManager.track('bullet_rewrite_copied', {
        source: 'executive_dashboard',
        key
      });
    }
  };

  const navItems = [
    { id: 'diagnostics', label: 'Extraction Diagnostics (153 vs 3000)', icon: Terminal },
    { id: 'matrix', label: 'Verification Matrix (Skill Gap)', icon: CheckCircle2 },
    { id: 'pivot', label: 'Career Pivot Analysis', icon: Compass },
    { id: 'bullets', label: 'Resume Rewrites & Optimization', icon: Sparkles },
    { id: 'letters', label: 'Cover Letters (3-Tier & 4-Tier)', icon: FileText },
    { id: 'profile', label: 'Candidate Profile (15y Arch)', icon: Briefcase },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md font-sans">
      <div className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  SUPERJOBGENIE EXECUTIVE DASHBOARD
                </h2>
                <span className="bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Career Pivot Intelligence Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                8,000+ Full Chars Deep Extraction • Cross-Track Skill Mapping Matrix • Executive Strategic Pivot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Toggle Buggy vs Fixed */}
            <button
              onClick={onToggleBuggyMode}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition flex items-center gap-1.5 ${
                isBuggyMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              <span>Mode: {isBuggyMode ? '⚠️ 153 Chars (Bug Simulation)' : '✅ 3000+ Chars Full (Fixed)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/60 border-b border-slate-800 flex space-x-1 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'cover-letter' && item.id === 'letters') || (activeTab === 'cover-letter-pro' && item.id === 'letters');
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (item.id === 'pivot') {
                    TelemetryManager.track('pivot_analysis_viewed', { source: 'dashboard' });
                  } else if (item.id === 'matrix') {
                    TelemetryManager.track('gap_matrix_inspected', { source: 'dashboard' });
                  }
                }}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm">
          {/* TAB 1: DIAGNOSTICS (153 vs 3000 Chars) */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-2">
                  <Terminal className="w-5 h-5" />
                  <h3>Indeed Scraping Root-Cause Diagnostic: Why Was It Truncated to 153 Characters?</h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  In modern Indeed postings, job content is rendered dynamically via client-side micro-frontends with deep DOM nesting:
                  The opening greeting happened to measure exactly <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">153 characters</code>.
                  Legacy scripts used <code className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">.jobsearch-JobComponent-description p</code> or summary selector <code className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">.job-snippet</code>, halting on the first child paragraph. Consequently, <strong>Benefits</strong>, <strong>Responsibilities</strong>, and the crucial <strong>Qualifications (A/B testing, time series, predictive modeling, Kaggle)</strong> were completely discarded!
                </p>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: The 153 Chars Bug */}
                <div className="bg-slate-950/80 border border-rose-500/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-rose-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Before Fix: 153 Chars Truncated (Buggy State)
                    </span>
                    <span className="bg-rose-500/20 text-rose-300 text-xs font-mono px-2 py-0.5 rounded-full border border-rose-500/30">
                      153 Chars / 1 Skill
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-rose-200/90 leading-relaxed">
                    {matchResult.diagnosticComparison.buggy153CharResult.falsityReason}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-slate-400">Captured Fragment:</div>
                    <blockquote className="p-2.5 bg-rose-950/30 border-l-2 border-rose-500 text-slate-300 italic text-[11px]">
                      "{jobData.rawTruncatedSnippet153}"
                    </blockquote>
                  </div>

                  <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-amber-300">Consequences:</div>
                    <p className="text-slate-300">
                      • JD only scanned the word "AI" (1 skill item).<br />
                      • Candidate profile contained "AI", resulting in 1/1 = 100% (fake 98% match).<br />
                      • Critical statistics, quantitative reasoning, and A/B testing were completely hidden!
                    </p>
                  </div>
                </div>

                {/* Right: The 3000+ Chars Full Traversal Fix */}
                <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      After Fix: 3000+ Chars Full Deep Extraction (SuperJobGenie 2.2)
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {jobData.characterCount} Chars / 14+ Skills
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-emerald-200/90 leading-relaxed">
                    {matchResult.diagnosticComparison.fixed3000CharResult.truthSummary}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-slate-400">Full Extraction Source & Selectors:</div>
                    <div className="p-2.5 bg-emerald-950/30 border-l-2 border-emerald-500 text-slate-300 text-[11px] space-y-1">
                      <div>• <strong>Primary Channel:</strong> <code className="text-cyan-300">div#jobDescriptionText</code> recursive node traversal (ul, li, p, h3)</div>
                      <div>• <strong>Fallback Channel:</strong> <code className="text-amber-300">&lt;script type="application/ld+json"&gt;</code> Schema.org native JobPosting parser</div>
                      <div>• <strong>Authentic Score:</strong> 54% High-Potential Career Pivot (Honest & realistic, zero fake 98%)</div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-emerald-300">Empowerment Value:</div>
                    <p className="text-slate-300">
                      • Accurately identifies candidate code review (Python/SQL/AWS) superpowers.<br />
                      • Transparently points out A/B testing and inferential statistics gaps.<br />
                      • Automatically activates Strategic Career Pivot & Customized Cover Letters, framing 15 years of engineering rigor!
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Solution snippet */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-4 h-4" />
                    Core Parser Solution (DOM Recursion + Schema.org Dual Redundancy):
                  </span>
                  <button
                    onClick={() => handleCopy(`// SuperJobGenie Deep Extraction Fix Code
function extractIndeedFullDescription(doc) {
  // 1. Primary: Schema.org JSON-LD (contains 100% untruncated original description)
  const ldJsonScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const s of ldJsonScripts) {
    try {
      const data = JSON.parse(s.textContent);
      const posting = Array.isArray(data) ? data.find(i => i['@type'] === 'JobPosting') : (data['@type'] === 'JobPosting' ? data : null);
      if (posting && posting.description) return cleanHtml(posting.description);
    } catch (e) {}
  }
  // 2. Deep extract #jobDescriptionText child nodes, retaining paragraphs & lists
  const container = doc.querySelector('#jobDescriptionText') || doc.querySelector('[data-testid="jobDescriptionText"]');
  if (container) {
    return Array.from(container.children).map(el => el.innerText.trim()).filter(Boolean).join('\\n\\n');
  }
  return '';
}`, 'fix-code')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded transition"
                  >
                    {copiedKey === 'fix-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Code</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`// 1. Fix 153 chars truncation: Target #jobDescriptionText directly
const container = document.querySelector('#jobDescriptionText') 
               || document.querySelector('[data-testid="jobDescriptionText"]');

// 2. Recursively traverse all paragraphs and list items rather than firstElementChild
const fullText = Array.from(container.querySelectorAll('p, li, h1, h2, h3, div'))
  .map(el => el.innerText.trim())
  .filter(Boolean)
  .join('\\n'); // Restores complete 3000+ chars body!`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: SKILL MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              {/* Score Breakdown Bar Charts */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Multi-Dimensional Scoring Model Breakdown (Authentic Score: {matchResult.overallMatchScore}%)
                  </h3>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">
                    {matchResult.matchTier}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Item 1 */}
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Core Technical Capabilities (Python/SQL/Algorithms)</span>
                      <span className="text-cyan-400 font-mono">
                        {matchResult.scoreBreakdown.coreTechnicalSkills.score} / {matchResult.scoreBreakdown.coreTechnicalSkills.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all"
                        style={{ width: `${(matchResult.scoreBreakdown.coreTechnicalSkills.score / matchResult.scoreBreakdown.coreTechnicalSkills.max) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-slate-400 text-[11px]">{matchResult.scoreBreakdown.coreTechnicalSkills.details}</p>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Domain & Quantitative Methodology (Stats/A-B Testing/Prediction)</span>
                      <span className="text-amber-400 font-mono">
                        {matchResult.scoreBreakdown.domainAndMethodology.score} / {matchResult.scoreBreakdown.domainAndMethodology.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${(matchResult.scoreBreakdown.domainAndMethodology.score / matchResult.scoreBreakdown.domainAndMethodology.max) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-slate-400 text-[11px]">{matchResult.scoreBreakdown.domainAndMethodology.details}</p>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Seniority & Architectural Leadership (15+ YOE Engineering Rigor)</span>
                      <span className="text-emerald-400 font-mono">
                        {matchResult.scoreBreakdown.seniorityAndArchitecture.score} / {matchResult.scoreBreakdown.seniorityAndArchitecture.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${(matchResult.scoreBreakdown.seniorityAndArchitecture.score / matchResult.scoreBreakdown.seniorityAndArchitecture.max) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-slate-400 text-[11px]">{matchResult.scoreBreakdown.seniorityAndArchitecture.details}</p>
                  </div>

                  {/* Item 4 */}
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Education & Certifications (CS Degree/AWS Solutions/Kaggle)</span>
                      <span className="text-purple-400 font-mono">
                        {matchResult.scoreBreakdown.educationAndCredentials.score} / {matchResult.scoreBreakdown.educationAndCredentials.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${(matchResult.scoreBreakdown.educationAndCredentials.score / matchResult.scoreBreakdown.educationAndCredentials.max) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-slate-400 text-[11px]">{matchResult.scoreBreakdown.educationAndCredentials.details}</p>
                  </div>
                </div>
              </div>

              {/* Verified vs Gaps List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Verified Skills */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified Capabilities (Total {matchResult.verifiedSkills.length})
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {matchResult.verifiedSkills.map((skill, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/70 border border-emerald-500/20 rounded-lg space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {skill.name}
                          </span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            {skill.category}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          <strong className="text-slate-400">Resume Evidence:</strong> {skill.resumeEvidence}
                        </p>
                        <p className="text-slate-400 text-[11px] italic">
                          <strong className="text-slate-400 not-italic">JD Requirement:</strong> {skill.jdContext}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skill Gaps */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5 uppercase">
                      <AlertTriangle className="w-4 h-4" />
                      Skill Gaps & Bridging Actions (Total {matchResult.missingSkillGaps.length})
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {matchResult.missingSkillGaps.map((gap, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/70 border border-amber-500/20 rounded-lg space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            {gap.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            gap.importance === 'Crucial' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            {gap.importance === 'Crucial' ? 'Crucial' : 'Bonus'}
                          </span>
                        </div>
                        <p className="text-cyan-300 text-[11px]">
                          <strong className="text-slate-400">Bridging Strategy:</strong> {gap.howToBridge}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAREER PIVOT ENGINE */}
          {activeTab === 'pivot' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/40 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Cross-Track Feasibility Deep Diagnostic (Career Pivot Blueprint)
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {matchResult.careerPivot.fromTrack} <ArrowRight className="inline w-4 h-4 mx-1 text-cyan-400" /> {matchResult.careerPivot.toTrack}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Pivot Feasibility Index:</div>
                    <div className="text-xl font-black text-emerald-400">
                      {matchResult.careerPivot.pivotFeasibilityScore}/100 ({matchResult.careerPivot.pivotFeasibility})
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-indigo-500/20 rounded-lg text-xs text-slate-200 leading-relaxed">
                  <strong className="text-cyan-300">Core Pivot Narrative: </strong>
                  {matchResult.careerPivot.keyPivotNarrative}
                </div>
              </div>

              {/* Transferable Superpowers */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Your 15-Year Architect Transferable Superpowers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {matchResult.careerPivot.transferableSuperpowers.map((power, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
                        0{idx + 1}
                      </div>
                      <p className="text-slate-200 font-medium leading-relaxed">{power}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Phase Roadmap */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Three-Phase Application Roadmap
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {matchResult.careerPivot.gapBridgingRoadmap.map((step, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/70 border border-amber-500/20 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">{step.phase}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-mono">
                          {step.timeframe}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{step.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Talking Points */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  High-Impact Interview Talking Points
                </h4>
                <div className="space-y-2.5">
                  {matchResult.careerPivot.interviewTalkingPoints.map((point, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-3 text-xs">
                      <span className="text-cyan-400 font-black text-sm shrink-0">“</span>
                      <p className="text-slate-200 leading-relaxed">{point}</p>
                      <button
                        onClick={() => handleCopy(point, `talking-${idx}`)}
                        className="ml-auto text-slate-400 hover:text-white shrink-0 p-1"
                        title="Copy Talking Point"
                      >
                        {copiedKey === `talking-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BULLET REWRITES */}
          {activeTab === 'bullets' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <h3>Resume Bullets Optimizer</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Refactor traditional backend engineering experience into <strong>quantitative reasoning, code evaluation, and algorithmic review</strong> perspectives tailored to the JD.
                </p>
              </div>

              <div className="space-y-4">
                {matchResult.resumeRewrites.map((rewrite, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400">Rewrite Case #{idx + 1}</span>
                      <button
                        onClick={() => handleCopy(rewrite.optimizedBullet, `bullet-${idx}`)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-[11px] transition shadow"
                      >
                        {copiedKey === `bullet-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Refined Bullet</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg space-y-1">
                        <div className="text-rose-400 font-bold text-[11px]">Original Resume (Backend focus):</div>
                        <p className="text-slate-300 leading-relaxed">{rewrite.originalExperience}</p>
                      </div>

                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-1">
                        <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Refined for AI Trainer & Quantitative Benchmark:
                        </div>
                        <p className="text-emerald-200 font-medium leading-relaxed">{rewrite.optimizedBullet}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-cyan-300 bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
                      <strong>💡 Impact:</strong> {rewrite.pivotImpact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COVER LETTERS */}
          {(activeTab === 'letters' || activeTab === 'cover-letter' || activeTab === 'cover-letter-pro') && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3-Tier Standard */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        3-Tier Standard Letter (Professional Baseline)
                      </span>
                      <button
                        onClick={() => handleCopy(matchResult.coverLetters.tier3Free, 'letter-free')}
                        className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded transition"
                      >
                        {copiedKey === 'letter-free' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={14}
                      value={matchResult.coverLetters.tier3Free}
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-sans text-xs leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">Suitable for direct email sending or general application submissions.</div>
                </div>

                {/* 4-Tier FAANG Pro */}
                <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400" />
                        4-Tier FAANG Pro Letter (Executive Architect Narrative)
                      </span>
                      <button
                        onClick={() => handleCopy(matchResult.coverLetters.tier4Pro, 'letter-pro')}
                        className="flex items-center gap-1 text-[11px] text-amber-200 hover:text-white bg-purple-900/60 border border-purple-500/40 px-2 py-1 rounded transition"
                      >
                        {copiedKey === 'letter-pro' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={14}
                      value={matchResult.coverLetters.tier4Pro}
                      className="w-full p-3 bg-slate-900 border border-purple-500/20 rounded-lg text-purple-100 font-sans text-xs leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                  <div className="text-[11px] text-purple-300/80">Highlights defensive engineering, edge concurrency, and rigorous code verification.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <Briefcase className="w-4 h-4" />
                    <h3>Currently Loaded Candidate Profile</h3>
                  </div>
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    15+ YOE Senior Software Engineer
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {candidate.skills.map((s, i) => (
                    <span key={i} className="text-[11px] bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Full Resume Preview ({candidate.rawResumeText.length} characters):</span>
                  <button
                    onClick={() => handleCopy(candidate.rawResumeText, 'resume-raw')}
                    className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded transition"
                  >
                    {copiedKey === 'resume-raw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Raw Resume</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 rounded-lg text-slate-300 font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {candidate.rawResumeText}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
