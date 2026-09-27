import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  Users, 
  FileCheck2, 
  Sparkles, 
  Copy, 
  Crown, 
  Clock, 
  TrendingUp, 
  Compass, 
  RotateCcw,
  CheckCircle2,
  X
} from 'lucide-react';
import { TelemetryManager, TelemetryEvent, TelemetrySummary } from '../services/telemetry';

interface TelemetryDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryDashboardModal: React.FC<TelemetryDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [summary, setSummary] = useState<TelemetrySummary>({
    resumesUploaded: 0,
    jobsAnalyzed: 0,
    deepPanelExpands: 0,
    gapMatrixInspects: 0,
    pivotViews: 0,
    lettersCopied: 0,
    rewritesCopied: 0,
    paywallHits: 0,
    decisionActions: 0
  });

  useEffect(() => {
    const unsubscribe = TelemetryManager.subscribe((newEvents) => {
      setEvents(newEvents);
      setSummary(TelemetryManager.getSummary());
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  // Conversion calculations
  const deepAnalysisRate = summary.jobsAnalyzed > 0 
    ? Math.round((summary.deepPanelExpands / summary.jobsAnalyzed) * 100) 
    : 0;
  
  const actionTakeRate = summary.jobsAnalyzed > 0 
    ? Math.round(((summary.lettersCopied + summary.rewritesCopied + summary.decisionActions) / summary.jobsAnalyzed) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md font-sans">
      <div className="w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  V1.0 TELEMETRY & BEHAVIOR OBSERVATORY
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  REAL-TIME SENSORS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Observatory guiding data-driven iterations · Monitoring the real funnel from viewing jobs to immediate application
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => TelemetryManager.clear()}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 transition flex items-center gap-1"
              title="Reset telemetry counters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Core Conversion Chain Funnel */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>V1.0 Golden Conversion Funnel (The 5-Step Core Chain)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {/* Step 1 */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 relative">
                <span className="text-[10px] font-mono text-indigo-400">STEP 1</span>
                <div className="text-xs font-bold text-white">Target Job</div>
                <div className="text-xl font-black text-cyan-300">{summary.jobsAnalyzed}</div>
                <p className="text-[10px] text-slate-400">Total jobs parsed</p>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 relative">
                <span className="text-[10px] font-mono text-indigo-400">STEP 2</span>
                <div className="text-xs font-bold text-white">Match Computed</div>
                <div className="text-xl font-black text-emerald-400">{summary.jobsAnalyzed}</div>
                <p className="text-[10px] text-slate-400">100% automated score</p>
              </div>

              {/* Step 3 */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 relative">
                <span className="text-[10px] font-mono text-indigo-400">STEP 3</span>
                <div className="text-xs font-bold text-white">Deep Inspection</div>
                <div className="text-xl font-black text-indigo-300">{summary.deepPanelExpands}</div>
                <p className="text-[10px] text-slate-400">Expand rate {deepAnalysisRate}%</p>
              </div>

              {/* Step 4 */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 relative">
                <span className="text-[10px] font-mono text-indigo-400">STEP 4</span>
                <div className="text-xs font-bold text-white">Strategic Verdict</div>
                <div className="text-xl font-black text-amber-300">{summary.decisionActions}</div>
                <p className="text-[10px] text-slate-400">Confidence unlocked</p>
              </div>

              {/* Step 5 */}
              <div className="p-3 bg-slate-900 border border-indigo-500/40 rounded-lg space-y-1 relative bg-gradient-to-b from-indigo-950/40 to-slate-900">
                <span className="text-[10px] font-mono text-amber-400">STEP 5 ★</span>
                <div className="text-xs font-bold text-white">Action Taken</div>
                <div className="text-xl font-black text-amber-400">{summary.lettersCopied + summary.rewritesCopied}</div>
                <p className="text-[10px] text-slate-400">Letter/bullets copied</p>
              </div>
            </div>
          </div>

          {/* 10 Key Telemetry Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Resume Upload / Switch</span>
                <Users className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-lg font-black text-white">{summary.resumesUploaded}</div>
              <p className="text-[10px] text-slate-400">Profiles activated & preset switched</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Job Extraction Count</span>
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-lg font-black text-cyan-300">{summary.jobsAnalyzed}</div>
              <p className="text-[10px] text-slate-400">Full 8,000+ chars deep extraction</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Deep Match Expands</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-lg font-black text-purple-300">{summary.deepPanelExpands}</div>
              <p className="text-[10px] text-slate-400">In-depth investigation after score</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Gap Matrix Inspects</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-black text-amber-300">{summary.gapMatrixInspects}</div>
              <p className="text-[10px] text-slate-400">Missing criteria focus checks</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Career Pivot Views</span>
                <Compass className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-lg font-black text-pink-300">{summary.pivotViews}</div>
              <p className="text-[10px] text-slate-400">Cross-track feasibility inspection</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Cover Letter Copied</span>
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-black text-emerald-300">{summary.lettersCopied}</div>
              <p className="text-[10px] text-slate-400">Exported directly to job sites</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Resume Bullet Rewrites</span>
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-lg font-black text-sky-300">{summary.rewritesCopied}</div>
              <p className="text-[10px] text-slate-400">Tailored bullet point exports</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Paywall Hits</span>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-black text-amber-400">{summary.paywallHits}</div>
              <p className="text-[10px] text-slate-400">High-value upgrade touchpoints</p>
            </div>

          </div>

          {/* Real-time Activity Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Live Event Stream</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Recent {events.length} events</span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 max-h-56 overflow-y-auto space-y-1.5 font-mono text-xs">
              {events.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No events recorded yet. Listening to user interactions in workstation and simulator...
                </div>
              ) : (
                events.map((evt) => (
                  <div key={evt.id} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span className="font-bold text-indigo-300">{evt.eventType}</span>
                      <span className="text-slate-400 truncate max-w-md">
                        {JSON.stringify(evt.payload)}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[10px] shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
