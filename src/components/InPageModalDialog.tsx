import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  UserCheck, 
  FileText, 
  Terminal, 
  RotateCw, 
  Briefcase, 
  ShieldCheck,
  Send,
  Eye,
  Sliders
} from 'lucide-react';
import { MatchAnalysisResult, ExtractedJobData, CandidateProfile } from '../types';
import { TelemetryManager } from '../services/telemetry';

interface InPageModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: ExtractedJobData;
  matchResult: MatchAnalysisResult;
  candidate: CandidateProfile;
  isBuggyMode: boolean;
  onToggleBuggyMode: () => void;
  onRescan: () => void;
  onOpenDashboard: (tab?: string) => void;
  onSelectCandidatePreset: (preset: CandidateProfile) => void;
  candidatePresets: CandidateProfile[];
}

export const InPageModalDialog: React.FC<InPageModalDialogProps> = ({
  isOpen,
  onClose,
  jobData,
  matchResult,
  candidate,
  isBuggyMode,
  onToggleBuggyMode,
  onRescan,
  onOpenDashboard,
  onSelectCandidatePreset,
  candidatePresets,
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'profile' | 'coverletter' | 'fulljd' | 'diff'>('match');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);

    if (key.includes('cl')) {
      TelemetryManager.track('cover_letter_copied', {
        source: 'in_page_modal',
        charLength: text.length
      });
    }
  };

  const displayChars = isBuggyMode ? 153 : matchResult.charCountCaptured;
  const displayScore = isBuggyMode ? 98 : matchResult.overallMatchScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md font-sans">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-indigo-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(99,102,241,0.2)] flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide text-white">SuperJobGenie 2.2</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  In-Page Job Modal
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  3,000+ Chars Full Extraction
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Captured <strong className="text-emerald-400">{displayChars.toLocaleString()}</strong> characters • Source: {jobData.extractionSource}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenDashboard('diagnostics');
              }}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full PRO Console</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
              title="Close modal (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job Headline & Score Strip */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">{jobData.title}</h3>
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                {jobData.company}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{jobData.location}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{jobData.salary}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Match Score</div>
                <div className={`text-lg font-black leading-none ${isBuggyMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {displayScore}%
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500/40 flex items-center justify-center font-bold text-xs bg-indigo-950/60 text-indigo-300">
                {isBuggyMode ? '153' : '3k+'}
              </div>
            </div>

            <button
              onClick={onToggleBuggyMode}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1 ${
                isBuggyMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isBuggyMode ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
              <span>{isBuggyMode ? '153-Char Truncated' : '3,000+ Chars Full'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-slate-900 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3.5 py-2.5 font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'match'
                ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🎯 Match & Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2.5 font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>👤 Candidate & Privacy Shield</span>
          </button>
          <button
            onClick={() => setActiveTab('coverletter')}
            className={`px-3.5 py-2.5 font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'coverletter'
                ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>✉️ Tailored Cover Letter</span>
          </button>
          <button
            onClick={() => setActiveTab('fulljd')}
            className={`px-3.5 py-2.5 font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fulljd'
                ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>📄 Full JD Inspector ({displayChars} chars)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: MATCH */}
          {activeTab === 'match' && (
            <div className="space-y-4">
              {/* Strategic Decision & Action Guidance */}
              <div className="p-3 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-900/60 rounded-lg text-indigo-300">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </span>
                    <span className="font-bold text-white text-xs">
                      {matchResult.matchHeadline}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Recommended to Apply 🚀
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="leading-relaxed">
                    💡 <strong className="text-white">Strategic Verdict:</strong> A high match rate signals a strong opportunity—<strong>definitely worth applying immediately</strong>!
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Don’t let missing keywords cause hesitation. By tailoring your cover letter and highlighting transferable superpowers, you can reframe experience gaps into a distinctive advantage.
                  </p>
                </div>
              </div>

              {/* Verified Skills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Core Qualifications ({matchResult.verifiedSkills.length} items)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Direct Alignment with Hard Criteria</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchResult.verifiedSkills.map((sk, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{sk.name}</span>
                        <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {sk.category}
                        </span>
                      </div>
                      {sk.resumeEvidence && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          <span className="text-slate-500">Evidence: </span>{sk.resumeEvidence}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Gaps & Pivot Bridging */}
              {matchResult.missingSkillGaps.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                       <span>Bridgeable Skill Gaps ({matchResult.missingSkillGaps.length} items) · Cover Letter Strategy</span>
                    </h4>
                    <span className="text-[11px] text-cyan-300 font-medium">Reframe in cover letter to stand out</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchResult.missingSkillGaps.map((sk, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-200 text-xs">{sk.name}</span>
                          <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                            Cover Letter Focus
                          </span>
                        </div>
                        {sk.howToBridge && (
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            <span className="text-cyan-400 font-semibold">Narrative Strategy: </span>{sk.howToBridge}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => setActiveTab('coverletter')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-900 transition"
                    >
                      <span>View Tailored Cover Letter (Gaps Addressed) →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & PRIVACY */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Privacy Shield & ATS Scrubbing Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Current Status: <strong className="text-emerald-300">{candidate.anonymizedLabel || 'Anonymized Protection'}</strong>
                  </p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[11px] px-2.5 py-1 rounded-full border border-emerald-500/40">
                  Zero PII Leakage
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 mb-2">Select Preset Candidate Profile (Instant Re-match):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {candidatePresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => onSelectCandidatePreset(preset)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        preset.id === candidate.id
                          ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/20'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs">{preset.title}</div>
                        <div className="text-[11px] text-indigo-300 font-medium">
                          {preset.yearsOfExperience} YOE • {preset.location || 'Remote'}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-3 mt-1 leading-relaxed">
                          {preset.rawResumeText.slice(0, 140)}...
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {preset.skills.slice(0, 4).map((s, i) => (
                          <span key={i} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Extracted Candidate Skills ({candidate.skills.length} items)</span>
                  <span className="text-[11px] text-slate-400">{candidate.yearsOfExperience} YOE Depth</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((sk, idx) => (
                    <span key={idx} className="bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-[11px] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COVER LETTER */}
          {activeTab === 'coverletter' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Tailored Cover Letter for Full 3,000+ Character JD</h4>
                  <p className="text-[11px] text-slate-400">Highlights 15 years of architecture rigor to bridge quantitative and evaluation requirements.</p>
                </div>
                <button
                  onClick={() => handleCopy(matchResult.coverLetters.tier4Pro || matchResult.coverLetters.tier3Free, 'cl-modal')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition shadow"
                >
                  {copiedKey === 'cl-modal' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'cl-modal' ? 'Copied to Clipboard' : 'Copy Cover Letter'}</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-200 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap">
                {matchResult.coverLetters.tier4Pro || matchResult.coverLetters.tier3Free}
              </div>
            </div>
          )}

          {/* TAB 4: FULL JD */}
          {activeTab === 'fulljd' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Full Captured Job Description Text ({displayChars.toLocaleString()} characters)</h4>
                  <p className="text-[11px] text-slate-400">Extraction Channel: {jobData.extractionSource}</p>
                </div>
                <button
                  onClick={() => handleCopy(jobData.fullBodyText, 'jd-modal')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition border border-slate-700"
                >
                  {copiedKey === 'jd-modal' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'jd-modal' ? 'Copied Full JD' : 'Copy Full JD'}</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap">
                {isBuggyMode ? jobData.rawTruncatedSnippet153 : jobData.fullBodyText}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span>Shortcut: Press <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded text-[10px] border border-slate-700">ESC</kbd> to close</span>
            <span>•</span>
            <span className="text-cyan-400">Integrated 3,000+ Chars Full Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRescan}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-semibold transition flex items-center gap-1.5"
            >
              <RotateCw className="w-3 h-3 text-cyan-400" />
              <span>Re-analyze</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition shadow-md shadow-indigo-600/30"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
