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
  X
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
  platform: 'Indeed SG' | 'Indeed HK' | 'LinkedIn TW' | 'RemoteOK';
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
  const [targetRole, setTargetRole] = useState<string>('Senior Backend / Full-Stack Engineer');
  const [targetLocations, setTargetLocations] = useState<string>('Singapore, Taiwan, Hong Kong, Remote');
  const [channelTelegram, setChannelTelegram] = useState<boolean>(true);
  const [channelEmail, setChannelEmail] = useState<boolean>(true);
  const [telegramChatId, setTelegramChatId] = useState<string>('@superjob_seeker_demo');
  const [emailAddress, setEmailAddress] = useState<string>('alex.tang@techlead.dev');
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [detectedJobs, setDetectedJobs] = useState<SimulatedJob[]>([]);
  const [selectedJobForTelegram, setSelectedJobForTelegram] = useState<SimulatedJob | null>(null);
  const [copiedCodeTab, setCopiedCodeTab] = useState<string | null>(null);
  const [phoneNotificationVisible, setPhoneNotificationVisible] = useState<boolean>(false);

  const sampleDispatchedJobs: SimulatedJob[] = [
    {
      id: 'job-1',
      title: 'Senior Backend Engineer (Go / Microservices)',
      company: 'SeaMoney (Shopee FinTech)',
      location: 'Singapore (Hybrid)',
      platform: 'Indeed SG',
      score: 94,
      salary: 'SGD 11,500 - 15,000 / mo',
      matchedSkills: ['Go / Golang', 'Distributed Microservices', 'Kafka / Redis', 'High Concurrency', 'PostgreSQL'],
      gapSkills: ['Kubernetes Helm Chart Tuning'],
      dispatchedAt: 'Just now',
      summary: 'Matches 94% of your resume. Full 8,400 char JD verified. High-urgency hiring manager tag.',
      tailoredHook: '15+ years architecting fault-tolerant microservices, directly matching SeaMoney high-throughput payment settlement.'
    },
    {
      id: 'job-2',
      title: '资深全端 / 后端架构师 (Golang / 云原生)',
      company: 'Taiwan FinTech Innovation Lab',
      location: 'Taipei, Taiwan (Hybrid / Remote)',
      platform: 'Indeed HK',
      score: 91,
      salary: 'TWD 160,000 - 220,000 / mo',
      matchedSkills: ['Golang', '分散式架構', 'RESTful API', 'AWS ECS', '微服務重構'],
      gapSkills: ['Solidity (Plus only)'],
      dispatchedAt: '2 mins ago',
      summary: 'Matches 91% of your resume. Traditional Chinese JD with deep microservices emphasis.',
      tailoredHook: '擁有大規模跨國微服務重構落地實績，完美契合團隊高併發金融微服務雲原生轉型。'
    },
    {
      id: 'job-3',
      title: 'Staff Platform Engineer (Remote)',
      company: 'GitLab Ecosystem Partner',
      location: 'APAC Remote (SG/TW/HK)',
      platform: 'RemoteOK',
      score: 88,
      salary: '$140k - $175k USD / yr',
      matchedSkills: ['CI/CD Pipelines', 'Docker', 'Type-Safe APIs', 'Distributed Observability'],
      gapSkills: ['Terraform CDK'],
      dispatchedAt: '12 mins ago',
      summary: 'Matches 88% of your resume. Zero timezone penalty for APAC engineers.',
      tailoredHook: 'Spearheaded automated quality gates and containerized pipelines across 40+ squads.'
    }
  ];

  // Initialize with the top matched job
  useEffect(() => {
    if (!selectedJobForTelegram && sampleDispatchedJobs.length > 0) {
      setSelectedJobForTelegram(sampleDispatchedJobs[0]);
    }
  }, []);

  const handleRunRadarScan = () => {
    setIsScanning(true);
    setScanLogs([]);
    setDetectedJobs([]);
    setPhoneNotificationVisible(false);

    const logSteps = [
      '📡 [RADAR] 启动 SuperJobGenie 自主巡航引擎 (Autonomous Scout Worker)...',
      '🔍 [CRAWL] 抓取目标招聘源: Indeed SG, Indeed HK, LinkedIn TW, RemoteOK...',
      '📥 [INGEST] 发现 18 个候选岗位，捕获无截断全文本 DOM (平均 7,200 字符)...',
      '🧠 [EVAL] 运行本地语义匹配算法，比对候选人简历 (唐总 Profile - 15+ YOE)...',
      '⚖️ [FILTER] 应用报警阈值门槛: Match Score >= ' + threshold + '%...',
      '🎯 [DISCOVER] 命中 3 个顶级匹配职位 (94%, 91%, 88%)！',
      '📱 [DISPATCH] 正在向 Telegram Bot API 组装富文本卡片 & 申请链接...',
      '🚀 [SUCCESS] Telegram 告警信令推送成功！手机端收到即时通知。'
    ];

    logSteps.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, log]);
        if (index === 4) {
          setDetectedJobs(sampleDispatchedJobs.filter(j => j.score >= threshold));
        }
        if (index === logSteps.length - 1) {
          setIsScanning(false);
          setPhoneNotificationVisible(true);
          setSelectedJobForTelegram(sampleDispatchedJobs[0]);
        }
      }, (index + 1) * 380);
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
                  SuperJobGenie 自动化巡航雷达与 Bot 告警系统
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase tracking-wide">
                  Autonomous Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">
                上传简历与意向职位 → 后台自主巡航扫盘 → 达到设定匹配度（如 ≥85%）秒推 Telegram / Email
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
            <span>实时巡航与仿真演练</span>
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
            <span>Telegram 手机端推送预览</span>
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
            <span>军师三级架构战略推演</span>
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
            <span>开箱即用代码实现</span>
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
                      巡航规则与触发配置
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                      ● READY
                    </span>
                  </div>

                  {/* Target Role */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      目标意向职位 (Target Roles)
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Target Locations */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      巡航区域与国家 (Target Regions)
                    </label>
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
                      <span className="text-slate-300">告警匹配度门槛 (Match Threshold)</span>
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
                      <span>宽松 (65%)</span>
                      <span className="text-cyan-400 font-semibold">军师推荐 (85%)</span>
                      <span>严苛 (95%)</span>
                    </div>
                  </div>

                  {/* Notification Channels */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="block text-xs font-medium text-slate-300">
                      告警分发渠道 (Dispatch Channels)
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
                        <span className="text-xs text-slate-200">Email 即时快讯 (Resend / SendGrid)</span>
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
                        <span>正在后台高速扫描全球职位库...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>启动自动巡航扫描 (Simulate Radar Scan)</span>
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
                        点击左侧【启动自动巡航扫描】以观察巡航日志、语义评分与 Telegram 告警链路...
                      </div>
                    ) : (
                      scanLogs.map((log, i) => (
                        <div key={i} className="leading-relaxed animate-in fade-in duration-150">
                          {log.includes('SUCCESS') ? (
                            <span className="text-emerald-400 font-bold">{log}</span>
                          ) : log.includes('DISPATCH') || log.includes('DISCOVER') ? (
                            <span className="text-cyan-300 font-semibold">{log}</span>
                          ) : log.includes('CRON') || log.includes('RADAR') ? (
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
                      巡航雷达拦截到符合阈值 (≥{threshold}%) 的职位
                    </span>
                    <span className="text-xs font-mono text-cyan-400">
                      {detectedJobs.length > 0 ? `${detectedJobs.length} 岗位已触发推送` : '等待巡航捕获'}
                    </span>
                  </div>

                  {detectedJobs.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      尚未触发告警。请运行上方巡航扫描或调整阈值滑块。
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
                              <span>{job.company}</span>
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
                          🎯 发现极高匹配职位 (Top Fit)
                        </span>
                        <span className="font-mono text-emerald-400 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-800 text-[10px]">
                          {selectedJobForTelegram?.score || 94}% 匹配度
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-sm text-white">
                          {selectedJobForTelegram?.title || 'Senior Backend Engineer'}
                        </div>
                        <div className="text-[#8ba2b9] text-[11px] mt-0.5">
                          🏢 {selectedJobForTelegram?.company || 'SeaMoney'} • 📍 {selectedJobForTelegram?.location || 'Singapore'}
                        </div>
                        <div className="text-emerald-300 text-[11px] font-mono mt-0.5">
                          💰 {selectedJobForTelegram?.salary || 'SGD 12,000 - 15,000'}
                        </div>
                      </div>

                      <div className="bg-[#17212b] p-2 rounded-lg text-[11px] space-y-1 border border-[#283849]">
                        <div className="text-slate-400 font-semibold text-[10px] uppercase">
                          ✨ 优势直击 (Top Alignments):
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
                          📝 军师定制敲门砖 (1-Click Pitch):
                        </span>
                        <span className="text-[10px] italic text-slate-300">
                          "{selectedJobForTelegram?.tailoredHook}"
                        </span>
                      </div>

                      {/* Telegram Interactive Buttons */}
                      <div className="space-y-1.5 pt-1">
                        <button className="w-full py-1.5 bg-[#2b5278] hover:bg-[#326291] text-white font-bold rounded-lg text-center text-xs flex items-center justify-center gap-1.5 transition">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>直达职位申请页面 (Indeed SG)</span>
                        </button>
                        <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-center text-xs flex items-center justify-center gap-1.5 transition">
                          <Copy className="w-3 h-3" />
                          <span>复制预生成求职信</span>
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
                      为什么 Telegram Bot 是最受求职者欢迎的告警终端？
                    </h3>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>0 门槛即时交付</strong>：无需用户安装新 App，海外/跨国开发者几乎 100% 日常挂着 Telegram。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>毫秒级富文本推送</strong>：支持 Markdown、内嵌按钮（Inline Buttons）、一键跳转原始链接或复制简历话术。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>完全免费 &amp; 无限配额</strong>：Telegram 官方 Bot API 永久免费，单用户推送频次完全不受任何商业资费限制。</span>
                    </li>
                  </ul>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold block">
                      3 步极速接入官方 Telegram Bot:
                    </span>
                    <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                      <li>在 Telegram 中搜索并私聊 <span className="text-white font-mono">@BotFather</span>，发送 <span className="text-cyan-300 font-mono">/newbot</span> 创建机器人并获取 <strong>API Token</strong></li>
                      <li>向你的 Bot 发送一条消息，调用 <span className="text-white font-mono">getUpdates</span> 获取你的 <strong>Chat ID</strong></li>
                      <li>在 SuperJobGenie 设置中粘贴 Token 和 Chat ID，即可开启全天候静默求职哨兵！</li>
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
                  军师战略推演：从「浏览器求职副驾驶 (Copilot)」升级为「全自动无人求职雷达 (Autonomous Scout)」
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  不仅完全可行，而且是 SuperJobGenie 建立坚不可摧的商业壁垒（Moat）的核心路径。
                  求职者最大的痛点是<strong>「每天花 2 小时在各大招聘网肉眼刷职位、算匹配度、疲惫不堪」</strong>。
                  只要实现「睡前配置好简历与意向，早晨醒来 Telegram 里直接躺着 3 个 90%+ 匹配职位和定制求职信」，产品黏性将直接呈指数级爆炸。
                </p>
              </div>

              {/* 3 Tiers Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tier 1 */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded w-fit border border-emerald-800 mb-2 font-bold">
                      方案 A · 零服务器成本
                    </div>
                    <h4 className="text-sm font-bold text-white">Extension 客户端本地巡航</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      利用 Chrome Extension 自带的 <span className="text-cyan-300 font-mono">chrome.alarms</span> 定时唤醒 Background Service Worker。用户开着浏览器时，插件在后台定时抓取公开 Job RSS，在本地浏览器内完成打分。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="text-emerald-400">✓ 优势：0 服务器开销，100% 隐私</div>
                    <div className="text-slate-400">• 门槛：用户需保持 Chrome 打开</div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="bg-slate-950/80 border border-cyan-700/60 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-lg shadow-cyan-500/5">
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded w-fit border border-cyan-800 mb-2 font-bold">
                      方案 B · 军师首选 (推荐)
                    </div>
                    <h4 className="text-sm font-bold text-white">云端 Serverless 定时哨兵</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      使用 Cloudflare Workers / GitHub Actions / Vercel Cron 每 2 小时运行一次。统一抓取 Google Jobs API 或开放聚合源，调用匹配算法，命中高分直接 Webhook 推送 Telegram / Email。
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="text-cyan-300">✓ 优势：用户电脑关机也能全天候巡航</div>
                    <div className="text-slate-400">• 成本：无服务器每月几万次执行免费</div>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded w-fit border border-indigo-800 mb-2 font-bold">
                      方案 C · 终极杀手形态
                    </div>
                    <h4 className="text-sm font-bold text-white">Telegram 交互式一键代投</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      在 Telegram 告警卡片里增加按钮：<span className="text-amber-300 font-mono">[🚀 确认一键代投]</span>。用户在手机上点击确认后，无头浏览器（Playwright）自动调取已生成的求职信替用户提交申请！
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="text-indigo-300">✓ 优势：行业绝无仅有的终极自动化</div>
                    <div className="text-slate-400">• 安全：保留 Human-in-the-loop 确认</div>
                  </div>
                </div>
              </div>

              {/* Anti-Bot Guidelines */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  军师避坑锦囊：关于各大招聘平台反爬与风控的应对法则
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">1. 优先走公开 RSS 与 Open API</strong>
                    Indeed、RemoteOK、WeWorkRemotely 等均提供标准 RSS Feed，走 RSS 完全不触发任何 Cloudflare 反爬！
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">2. 客户端分散请求 (Decentralized)</strong>
                    若采用方案 A，请求分散在数万用户的个人 IP 上，完全没有集中爬虫的特征，永远不会被封 IP。
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">3. 绝不泛滥投递 (Quality &gt; Quantity)</strong>
                    仅针对 ≥85% 甚至 ≥90% 的真正高匹配职位触发告警，每天仅 1-3 篇精选，用户绝不受垃圾信息骚扰。
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
                  军师为主公整理好的<strong>核心落地代码</strong>，直接复制即可在 Node.js / Chrome Extension 中调用：
                </div>
                {copiedCodeTab && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" /> 已复制到剪贴板！
                  </span>
                )}
              </div>

              {/* Code Snippet 1: Telegram Webhook */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold">1. telegramDispatcher.ts (直接向 Telegram 推送富文本卡片)</span>
                  <button
                    onClick={() => handleCopyCode(telegramCodeSample, 'tg')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded cursor-pointer transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>复制代码</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-slate-300 text-[11px] leading-relaxed">
                  <code>{telegramCodeSample}</code>
                </pre>
              </div>

              {/* Code Snippet 2: Chrome Alarm Cron */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                  <span className="text-emerald-400 font-bold">2. backgroundCron.js (Chrome 扩展后台定时巡航)</span>
                  <button
                    onClick={() => handleCopyCode(chromeAlarmCodeSample, 'chrome')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded cursor-pointer transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>复制代码</span>
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
            <span>SuperJobGenie Autonomous Sentinel 3.2.0 · Ready to integrate</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition cursor-pointer"
          >
            关闭控制台
          </button>
        </div>

      </div>
    </div>
  );
};

const telegramCodeSample = `// Telegram Bot 富文本告警推送核心实现 (零第三方依赖，纯 fetch)
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
\`🎯 *【SuperJobGenie 高分职位发现】*

🏆 *职位*: \${jobTitle}
🏢 *公司*: \${company}
📍 *地区*: \${location}
💰 *薪资*: \${salary}
🔥 *匹配度*: *\${matchScore}% (Top Tier)*

✨ *命中核心技术栈*:
\${matchedSkills.map(s => \`• \${s}\`).join('\\n')}

📝 *定制敲门砖摘要*:
_"\${tailoredCoverLetterHook}"_

⚡ 点击下方按钮直达申请或复制求职信！\`;

  const payload = {
    chat_id: chatId,
    text: messageText,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔗 直达职位页面', url: applyUrl }
        ],
        [
          { text: '📋 复制预生成求职信', callback_data: 'copy_letter' }
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

const chromeAlarmCodeSample = `// Chrome Extension Manifest V3 - background.js 定时后台巡航
chrome.runtime.onInstalled.addListener(() => {
  // 注册每 60 分钟巡航一次的闹钟
  chrome.alarms.create('superjob_radar_cron', {
    periodInMinutes: 60
  });
  console.log('[SuperJobGenie] 后台自动巡航雷达已启动');
});

// 闹钟触发监听
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'superjob_radar_cron') {
    const { resumeProfile, targetCriteria, matchThreshold, telegramConfig } = 
      await chrome.storage.local.get(['resumeProfile', 'targetCriteria', 'matchThreshold', 'telegramConfig']);
    
    if (!resumeProfile || !telegramConfig) return;

    // 1. 定时拉取职位开放数据源
    const jobs = await fetchOpenJobFeeds(targetCriteria);

    // 2. 本地深度语义匹配引擎比对
    for (const job of jobs) {
      const match = await calculateLocalMatchScore(job, resumeProfile);
      
      // 3. 达到设定阈值 (例如 85%)，立即触发推送
      if (match.score >= (matchThreshold || 85)) {
        await dispatchTelegramNotification(telegramConfig, job, match);
      }
    }
  }
});`;
