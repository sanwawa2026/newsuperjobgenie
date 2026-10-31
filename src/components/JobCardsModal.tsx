import React, { useState, useMemo, useRef } from 'react';
import { toPng } from 'html-to-image';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Maximize2, 
  ChevronRight, 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Flame, 
  Layers, 
  FileSpreadsheet, 
  Share2, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  MonitorPlay,
  RotateCcw,
  Music
} from 'lucide-react';
import { JobLeadCard } from '../types';
import { 
  INITIAL_JOB_LEADS, 
  parseLeadsFromCSV, 
  generateClean5ColumnCSV, 
  generateCommunityPostMarkdown 
} from '../data/jobLeadsData';

interface JobCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateTargetRole?: string;
}

export function JobCardsModal({ isOpen, onClose, candidateTargetRole = 'Full Stack Cloud Engineer' }: JobCardsModalProps) {
  const [leads, setLeads] = useState<JobLeadCard[]>(INITIAL_JOB_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'studio' | 'digest'>('grid');
  const [studioAspect, setStudioAspect] = useState<'community-16-9' | 'shorts-9-16' | 'podium-trio'>('community-16-9');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const webMatcherUrl = 'https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?view=workstation';

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.keyMatchedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier = 
        selectedTier === 'all' ||
        (selectedTier === 'top1' && lead.matchScore >= 90) ||
        (selectedTier === 'strong' && lead.matchScore >= 75 && lead.matchScore < 90);

      return matchesSearch && matchesTier;
    });
  }, [leads, searchQuery, selectedTier]);

  const activeLead = filteredLeads[activeCardIndex] || filteredLeads[0] || leads[0];
  const cardCanvasRef = useRef<HTMLDivElement>(null);
  const [isExportingPNG, setIsExportingPNG] = useState<boolean>(false);

  const handleCopyNotice = (msg: string) => {
    setCopiedNotice(msg);
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  const handleDownloadCardPNG = async () => {
    if (!cardCanvasRef.current) return;
    setIsExportingPNG(true);
    try {
      const dataUrl = await toPng(cardCanvasRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#020617'
      });
      const link = document.createElement('a');
      const filename = studioAspect === 'podium-trio'
        ? `SuperJobGenie_Top3_Podium_California_Leads.png`
        : `${activeLead.company.replace(/[^a-zA-Z0-9]/g, '_')}_ATS_${activeLead.matchScore}pct_JobCard.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
      handleCopyNotice(`✓ Saved ${filename} to Downloads!`);
    } catch (err) {
      console.error('Failed to export PNG:', err);
      handleCopyNotice('Auto-export error. Please use shortcut: Win+Shift+S / Cmd+Shift+4');
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    handleCopyNotice(`Copied: ${label}`);
  };

  const handleDownloadCleanCSV = () => {
    const csvContent = generateClean5ColumnCSV(leads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SuperJobGenie_Clean_Summary_5Col_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    handleCopyNotice('Downloaded clean 5-column CSV');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseLeadsFromCSV(content);
        setLeads(parsed);
        setActiveCardIndex(0);
        handleCopyNotice(`Successfully imported ${parsed.length} jobs from CSV!`);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Toast Notification */}
        {copiedNotice && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>{copiedNotice}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Job Cards Studio
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {leads.length} Verified Leads • 2026-10-31
                </span>
                <span className="hidden sm:inline-block bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full">
                  Target: {candidateTargetRole}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transform bloated, wide CSV rows into sleek, presentation-ready cards for YouTube Community, Shorts & Social.
              </p>
            </div>
          </div>

          {/* View Mode Switcher & Quick Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Cards Grid</span>
              </button>
              <button
                onClick={() => setViewMode('studio')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'studio' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>Screenshot Studio</span>
              </button>
              <button
                onClick={() => setViewMode('digest')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'digest' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Community Post</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subheader Toolbar: Search, Filters & Import/Export */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company (SpaceX, Vivodyne...), skill, or city..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedTier('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  selectedTier === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({leads.length})
              </button>
              <button
                onClick={() => setSelectedTier('top1')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  selectedTier === 'top1' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                Top 1% Exceptional (≥90%)
              </button>
              <button
                onClick={() => setSelectedTier('strong')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  selectedTier === 'strong' ? 'bg-sky-600 text-white' : 'text-sky-400 hover:text-sky-300'
                }`}
              >
                Competitive (75-89%)
              </button>
            </div>
          </div>

          {/* Import / Export Buttons */}
          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleDownloadCleanCSV}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Download 5-column readable CSV without 300-char URLs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clean 5-Col CSV</span>
            </button>

            <button
              onClick={() => handleCopyText(generateCommunityPostMarkdown(leads, webMatcherUrl), 'YouTube Community Post Text')}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Community Text</span>
            </button>

            <a
              href="/api/download-bgm-video"
              download="fullstck_cloud_engineer_with_tech_bgm.mp4"
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
              title="Download 55s video with studio-mastered Cyberpunk Tech BGM"
            >
              <Music className="w-3.5 h-3.5 text-emerald-200" />
              <span>Video + BGM (55s)</span>
            </a>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/30">
          
          {/* ================= MODE 1: CARDS GRID ================= */}
          {viewMode === 'grid' && (
            <div className="space-y-4">
              {/* Tech BGM Banner & Audio Player */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Music className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                       <span>Cyberpunk Tech BGM Video Track Ready (55s)</span>
                       <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                         -17.4 dB Broadcast Mastered
                       </span>
                     </div>
                     <p className="text-[11px] text-slate-400">
                       118 BPM Synthwave ambient groove (16th rolling bass, punchy drums, shimmer plucks) mixed losslessly into the 0:55 video.
                     </p>
                   </div>
                 </div>

                 <div className="flex items-center gap-2">
                   <audio 
                     controls 
                     className="h-8 w-44 rounded-lg opacity-90"
                     src="/assets/aistudio/fullstck_cloud_engineer_with_bgm.mp4"
                   />
                   <a
                     href="/api/download-bgm-video"
                     download="fullstck_cloud_engineer_with_tech_bgm.mp4"
                     className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md"
                   >
                     <Download className="w-3.5 h-3.5" />
                     <span>Download MP4</span>
                   </a>
                 </div>
               </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Showing {filteredLeads.length} of {leads.length} California tech jobs</span>
                <span className="text-[11px] text-cyan-400">💡 Click "Focus &amp; Snapshot" on any card to view high-res capture mode</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeads.map((job, idx) => {
                  const isTopTier = job.matchScore >= 90;
                  const companyInitials = job.company
                    .split(/\s+/)
                    .map(w => w[0])
                    .join('')
                    .slice(0, 3)
                    .toUpperCase();

                  return (
                    <div
                      key={job.id}
                      className="group relative bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-cyan-500/10"
                    >
                      {/* Top Bar: Company & Score */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner ${
                              isTopTier 
                                ? 'bg-gradient-to-br from-cyan-900/60 to-indigo-900/60 border border-cyan-500/40 text-cyan-300' 
                                : 'bg-slate-800 border border-slate-700 text-slate-300'
                            }`}>
                              {companyInitials}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                                <span>{job.company}</span>
                                {isTopTier && (
                                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                <span className="truncate max-w-[150px]">{job.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Futuristic Circular Gauge Ring */}
                          <div className="flex flex-col items-end">
                            <div className={`relative px-2.5 py-1 rounded-xl font-mono font-black text-sm border flex items-center gap-1 shadow-sm ${
                              isTopTier 
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                                : 'bg-sky-950/60 border-sky-500/40 text-sky-300'
                            }`}>
                              <span className="text-base font-extrabold">{job.matchScore}%</span>
                              <span className="text-[10px] opacity-75 font-normal">ATS</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
                              {job.matchTier.replace(' Exceptional', '')}
                            </span>
                          </div>
                        </div>

                        {/* Job Title */}
                        <h3 className="font-bold text-slate-100 text-sm leading-snug mb-2 line-clamp-2">
                          {job.title}
                        </h3>

                        {/* Salary & Freshness */}
                        <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px]">
                          {job.salary && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono font-medium">
                              {job.salary}
                            </span>
                          )}
                          <span className="bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {job.postingFreshness}
                          </span>
                        </div>

                        {/* Key Matched Skills Chips */}
                        <div className="space-y-1.5 mb-4">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            <span>Matched Skills &amp; Keywords</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.keyMatchedSkills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="bg-slate-800/90 hover:bg-slate-750 text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded-md text-[10px] font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2 text-xs">
                        <button
                          onClick={() => {
                            setActiveCardIndex(idx);
                            setViewMode('studio');
                          }}
                          className="px-2.5 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 rounded-lg font-semibold flex items-center gap-1 transition cursor-pointer text-[11px]"
                          title="Open in high-res screenshot presentation mode"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Focus Snapshot</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(
                              `[${job.matchScore}% Match] ${job.company} - ${job.title}\nLocation: ${job.location}\nKey Skills: ${job.keyMatchedSkills.join(', ')}\nIndeed URL: ${job.jobUrl}`,
                              `${job.company} lead card text`
                            )}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition cursor-pointer"
                            title="Copy card text"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={job.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-md transition flex items-center gap-1 text-[11px] font-medium"
                            title="Open original Indeed posting"
                          >
                            <span>Indeed</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= MODE 2: SCREENSHOT STUDIO ================= */}
          {viewMode === 'studio' && (
            <div className="space-y-4">
              
              {/* Studio Controls Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <MonitorPlay className="w-4 h-4 text-cyan-400" />
                    <span>Canvas Aspect:</span>
                  </span>
                  
                  <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setStudioAspect('community-16-9')}
                      className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                        studioAspect === 'community-16-9' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      16:9 / 4:3 (Community Post)
                    </button>
                    <button
                      onClick={() => setStudioAspect('shorts-9-16')}
                      className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                        studioAspect === 'shorts-9-16' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      9:16 (Shorts Overlay)
                    </button>
                    <button
                      onClick={() => setStudioAspect('podium-trio')}
                      className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                        studioAspect === 'podium-trio' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Top 3 Podium (SpaceX &amp; Vivodyne)
                    </button>
                  </div>
                </div>

                {/* Card Navigator & Download Action */}
                <div className="flex flex-wrap items-center gap-2">
                  {studioAspect !== 'podium-trio' && (
                    <>
                      <span className="text-slate-400">Card:</span>
                      <select
                        value={activeCardIndex}
                        onChange={(e) => setActiveCardIndex(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
                      >
                        {filteredLeads.map((c, i) => (
                          <option key={c.id} value={i}>
                            #{i + 1} - {c.company} ({c.matchScore}%)
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          handleCopyText(
                            `🔥 [${activeLead.matchScore}% Match] ${activeLead.company} — ${activeLead.title}\n📍 ${activeLead.location}\n⚡ Key Skills: ${activeLead.keyMatchedSkills.join(', ')}\n🔗 Test your resume: ${webMatcherUrl}`,
                            `${activeLead.company} snapshot caption`
                          );
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md font-medium flex items-center gap-1 cursor-pointer"
                        title="Copy text caption for social media"
                      >
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span>Copy Caption</span>
                      </button>
                    </>
                  )}

                  {/* 1-Click High-Res PNG Download Button */}
                  <button
                    onClick={handleDownloadCardPNG}
                    disabled={isExportingPNG}
                    className="px-3 py-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-lg text-xs shadow-lg shadow-emerald-500/25 transition flex items-center gap-1.5 cursor-pointer"
                    title="1-Click Download High-Res PNG Image directly to computer"
                  >
                    <Download className={`w-3.5 h-3.5 text-slate-950 ${isExportingPNG ? 'animate-bounce' : ''}`} />
                    <span>{isExportingPNG ? 'Generating PNG...' : '📥 Download Card (PNG)'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions Pill for User */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>How to save image:</strong> Click the green <strong>"📥 Download Card (PNG)"</strong> button above, or press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-indigo-400/40 rounded font-mono text-white text-[11px]">Win + Shift + S</kbd> (Windows) / <kbd className="px-1.5 py-0.5 bg-slate-900 border border-indigo-400/40 rounded font-mono text-white text-[11px]">Cmd + Shift + 4</kbd> (Mac) to clip lossless PNG.
                  </span>
                </div>
                <button
                  onClick={handleDownloadCardPNG}
                  disabled={isExportingPNG}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image Now</span>
                </button>
              </div>

              {/* Stage Canvas */}
              <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-6 sm:p-10 flex items-center justify-center min-h-[500px]">
                
                {/* 1. COMMUNITY POST 16:9 / 4:3 CARD */}
                {studioAspect === 'community-16-9' && (
                  <div
                    ref={cardCanvasRef}
                    className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-7 shadow-2xl shadow-cyan-500/20 relative overflow-hidden"
                  >
                    {/* Glowing Top Ambient Ribbon */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"></div>

                    {/* Branding Watermark */}
                    <div className="flex items-center justify-between border-b border-slate-800/90 pb-4 mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="font-extrabold text-white text-xs tracking-wider">SUPERJOBGENIE</span>
                          <span className="text-[10px] text-cyan-400 font-mono ml-2">ATS MATCH RADAR • CA TECH</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>100% Real Scanned Indeed Posting</span>
                        </div>
                        <button
                          onClick={handleDownloadCardPNG}
                          disabled={isExportingPNG}
                          className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-2.5 py-1 rounded-lg text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-1 cursor-pointer"
                          title="Download this card as PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isExportingPNG ? '...' : 'Save PNG'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Card Hero: Company, Title & Big Match Score Gauge */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
                      <div className="md:col-span-8 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md text-xs font-mono font-bold">
                            {activeLead.company}
                          </span>
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {activeLead.location}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                          {activeLead.title}
                        </h2>
                        {activeLead.salary && (
                          <div className="text-emerald-400 font-mono text-sm font-bold">
                            Compensation: {activeLead.salary}
                          </div>
                        )}
                      </div>

                      {/* Glowing Score HUD Circle */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl shadow-inner">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-24 h-24 -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              className="text-slate-800"
                              fill="transparent"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              strokeDasharray={251.2}
                              strokeDashoffset={251.2 - (251.2 * activeLead.matchScore) / 100}
                              strokeLinecap="round"
                              className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white font-mono">{activeLead.matchScore}%</span>
                            <span className="text-[9px] uppercase tracking-wider text-cyan-300 font-bold">ATS MATCH</span>
                          </div>
                        </div>
                        <span className="mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {activeLead.matchTier}
                        </span>
                      </div>
                    </div>

                    {/* Matched Skills Grid */}
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          <span>ATS Verified Skills Checklist (Alex Chen Resume Match)</span>
                        </span>
                        <span className="text-emerald-400 font-mono font-bold text-[11px]">Sub-Second Verification</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {activeLead.keyMatchedSkills.map((sk, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{sk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                      <div className="text-slate-400">
                        <span>Free 0-Install Web Matcher: </span>
                        <code className="text-cyan-300 font-mono font-semibold">superjobgenie-web.run.app</code>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span>Chrome Web Store Verified Assistant</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SHORTS / MOBILE 9:16 VERTICAL OVERLAY */}
                {studioAspect === 'shorts-9-16' && (
                  <div
                    ref={cardCanvasRef}
                    className="w-full max-w-[340px] bg-slate-950 border-2 border-cyan-500/60 rounded-3xl p-5 shadow-2xl shadow-cyan-500/25 flex flex-col justify-between aspect-[9/16] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-cyan-400 to-indigo-500"></div>

                    {/* Top Tag */}
                    <div className="text-center pt-2">
                      <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>ATS Top 1% Lead</span>
                      </div>
                    </div>

                    {/* Middle Score Circle */}
                    <div className="my-auto flex flex-col items-center justify-center space-y-4">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-36 h-36 -rotate-90">
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-slate-800"
                            fill="transparent"
                          />
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={377}
                            strokeDashoffset={377 - (377 * activeLead.matchScore) / 100}
                            strokeLinecap="round"
                            className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-white font-mono">{activeLead.matchScore}%</span>
                          <span className="text-[11px] font-bold text-cyan-300 tracking-wider">ROLE FIT</span>
                        </div>
                      </div>

                      <div className="text-center space-y-1">
                        <div className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
                          {activeLead.company}
                        </div>
                        <h3 className="text-lg font-black text-white leading-tight">
                          {activeLead.title}
                        </h3>
                        <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{activeLead.location}</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-1.5 text-left">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          <span>Verified ATS Skills</span>
                        </div>
                        {activeLead.keyMatchedSkills.slice(0, 3).map((sk, i) => (
                          <div key={i} className="text-[11px] text-slate-200 truncate flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            <span>{sk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Link Badge */}
                    <div className="pt-2 text-center border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Free ATS Scanner in Pinned Comment</div>
                      <div className="text-xs font-mono font-bold text-cyan-300">SuperJobGenie Web Matcher</div>
                    </div>
                  </div>
                )}

                {/* 3. TOP 3 PODIUM (SpaceX, Vivodyne, Superhuman) */}
                {studioAspect === 'podium-trio' && (
                  <div ref={cardCanvasRef} className="w-full max-w-4xl space-y-6 p-4 rounded-3xl bg-slate-950">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        California Top 3 Championship Match (Full Stack Engineering)
                      </h3>
                      <p className="text-xs text-slate-400">
                        11,000+ Character Deep ATS Extraction • Indeed Live Radar
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      {/* #2 SpaceX (96%) */}
                      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md text-xs font-mono font-bold">
                              #2 PODIUM
                            </span>
                            <span className="font-mono text-xl font-black text-indigo-400">96%</span>
                          </div>
                          <div className="text-sm font-black text-white mb-1">SpaceX</div>
                          <div className="text-xs text-slate-300 font-semibold mb-2">Full Stack Engineer (App Software)</div>
                          <div className="text-[11px] text-slate-400 mb-3">Palo Alto, CA (Hybrid)</div>
                          <div className="space-y-1 text-[11px] text-slate-300 border-t border-slate-800 pt-2">
                            <div>• Python / In-stream Data Processing</div>
                            <div>• Angular / Modern Frontend</div>
                            <div>• Highly Reliable Mission Software</div>
                          </div>
                        </div>
                      </div>

                      {/* #1 Vivodyne (97%) - Elevated center */}
                      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-400 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20 flex flex-col justify-between relative -translate-y-2">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Flame className="w-3 h-3 fill-slate-950" />
                          <span>#1 Highest Match</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-3 mt-1">
                            <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-md text-xs font-mono font-bold">
                              #1 TOP FIT
                            </span>
                            <span className="font-mono text-3xl font-black text-cyan-300">97%</span>
                          </div>
                          <div className="text-base font-black text-white mb-1">Vivodyne</div>
                          <div className="text-xs text-slate-200 font-semibold mb-2">Senior Full Stack Software Engineer</div>
                          <div className="text-[11px] text-slate-400 mb-3">San Francisco, CA</div>
                          <div className="space-y-1 text-[11px] text-slate-200 border-t border-slate-800 pt-2">
                            <div>• Frontend-Led Full-Stack Architecture</div>
                            <div>• React / Next.js Component Pipelines</div>
                            <div>• High-Throughput Biotech Data Platform</div>
                          </div>
                        </div>
                      </div>

                      {/* #3 Superhuman (96%) */}
                      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-xs font-mono font-bold">
                              #3 PODIUM
                            </span>
                            <span className="font-mono text-xl font-black text-purple-400">96%</span>
                          </div>
                          <div className="text-sm font-black text-white mb-1">Superhuman</div>
                          <div className="text-xs text-slate-300 font-semibold mb-2">Software Engineer (Full-Stack DevEx)</div>
                          <div className="text-[11px] text-slate-400 mb-3">San Francisco, CA (Hybrid)</div>
                          <div className="space-y-1 text-[11px] text-slate-300 border-t border-slate-800 pt-2">
                            <div>• Large-Scale Cloud Distributed Systems</div>
                            <div>• Java / Spring Boot &amp; Python</div>
                            <div>• Sub-100ms Ergonomic UI Architecture</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= MODE 3: YOUTUBE COMMUNITY DIGEST ================= */}
          {viewMode === 'digest' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-purple-400" />
                      <span>Ready-to-Post YouTube Community Text</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Copy this exact text into your YouTube channel community tab alongside the screenshot image.
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyText(generateCommunityPostMarkdown(leads, webMatcherUrl), 'Community Post Text')}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Community Text</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                  {generateCommunityPostMarkdown(leads, webMatcherUrl)}
                </div>
              </div>

              {/* Clean 5-Column CSV Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Clean 5-Column CSV Summary (No 300-char URLs)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Solves the "too wide CSV" problem by condensing columns to Rank, Role, Company, Location, Score, Tier, and Skills.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadCleanCSV}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Clean CSV</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-x-auto max-h-56">
                  <table className="w-full text-left text-xs font-mono text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                        <th className="py-2 px-2">Rank</th>
                        <th className="py-2 px-2">Company</th>
                        <th className="py-2 px-2">Role Title</th>
                        <th className="py-2 px-2">Location</th>
                        <th className="py-2 px-2">Score</th>
                        <th className="py-2 px-2">Key Skills</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 8).map((j, idx) => (
                        <tr key={j.id} className="border-b border-slate-900 hover:bg-slate-900/60">
                          <td className="py-1.5 px-2 text-cyan-400">#{idx + 1}</td>
                          <td className="py-1.5 px-2 font-bold text-white">{j.company}</td>
                          <td className="py-1.5 px-2 text-slate-200 truncate max-w-[200px]">{j.title}</td>
                          <td className="py-1.5 px-2 text-slate-400 truncate max-w-[150px]">{j.location}</td>
                          <td className="py-1.5 px-2 font-bold text-emerald-400">{j.matchScore}%</td>
                          <td className="py-1.5 px-2 text-slate-400 truncate max-w-[220px]">{j.keyMatchedSkills.slice(0, 2).join(' • ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-[10px] text-slate-500 pt-2 text-center">
                    + {leads.length - 8} more jobs included in download file
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>SuperJobGenie Job Cards Engine • Fully synced with Indeed California Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyText(generateCommunityPostMarkdown(leads, webMatcherUrl), 'Full Digest')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
            >
              Copy Digest
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
