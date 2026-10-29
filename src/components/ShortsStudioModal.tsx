import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Video, 
  Flame, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  X, 
  Maximize2, 
  Minimize2, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Award,
  Zap,
  Youtube,
  Download
} from 'lucide-react';

interface ShortsStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMatcher?: () => void;
}

interface ScriptPackage {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  hookThreeSec: string;
  targetAudience: string;
  duration: string;
  voiceoverTrack: string;
  masterTrack: string;
  timeline: {
    time: string;
    seconds: [number, number];
    stage: string;
    caption: string;
    voiceover: string;
    visual: string;
    sfx: string;
  }[];
  youtubeMetadata: {
    title: string;
    description: string;
    pinnedComment: string;
    tags: string[];
  };
  socialPush: {
    redditTitle: string;
    redditPost: string;
  };
}

export const ShortsStudioModal: React.FC<ShortsStudioModalProps> = ({
  isOpen,
  onClose,
  onOpenMatcher
}) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>('hack_10s');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'script' | 'metadata' | 'rebrand'>('simulator');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRecordingMode, setIsRecordingMode] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  const CHROME_STORE_URL =
    'https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb';

  const scriptPackages: ScriptPackage[] = [
    {
      id: 'hack_10s',
      badge: '🔥 Highest Viral Potential (CTR 18%+)',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      title: 'The 10-Second ATS Bypass Hack HR Doesn’t Want You To Know',
      hookThreeSec: 'Applied to 100 jobs and got ZERO interviews? Stop blaming your experience.',
      targetAudience: 'Job seekers facing cold auto-rejections on Workday & LinkedIn',
      duration: '22 Seconds (High-Retention Cut)',
      voiceoverTrack: '/audio/short_38s_voiceover.wav',
      masterTrack: '/audio/short_38s_master_mix.wav',
      timeline: [
        {
          time: '0:00 - 0:03',
          seconds: [0, 3],
          stage: 'HOOK (0-3s)',
          caption: '100 APPS. 0 INTERVIEWS? 🚫',
          voiceover: 'Applied to 100 jobs and got ZERO interviews? Stop blaming your experience.',
          visual: 'Show wall of 50+ cold rejection emails with red stamps. Creator pointing at screen in disbelief.',
          sfx: 'Subtle heartbreak bass drop + notification bell ding'
        },
        {
          time: '0:03 - 0:08',
          seconds: [3, 8],
          stage: 'THE TRAP (3-8s)',
          caption: 'THE ATS BOT TRAP 🤖❌',
          voiceover: '75% of resumes get rejected by automated ATS bots before a human ever looks at them. Why? Missing exact syntax match.',
          visual: 'Workday / Greenhouse candidate portal showing red "Match: 38% - Rejected by Bot" screen.',
          sfx: 'Glitch buzz + mechanical typing'
        },
        {
          time: '0:08 - 0:16',
          seconds: [8, 16],
          stage: 'THE HACK (8-16s)',
          caption: '10-SECOND ATS EQUALIZER ⚡',
          voiceover: 'Watch this: 1-Click scans the entire 8,000-char JD, reveals missing keywords, and tailors a bulletproof pitch in 10 seconds.',
          visual: 'SuperJobGenie popup on live job posting: radar sweeps, score jumps from 38% to 94% (Top 1% Exceptional), generates customized cover letter.',
          sfx: 'Laser sweep + level-up chime'
        },
        {
          time: '0:16 - 0:22',
          seconds: [16, 22],
          stage: 'CTA (16-22s)',
          caption: 'FREE TOOL IN PINNED COMMENT 👇',
          voiceover: 'Try the 100% free web tool or install the Chrome extension in pinned comments. Beat the bots and take your career back!',
          visual: 'Chrome Web Store 5-star rating badge + "Add to Chrome" button glowing + finger pointing to pinned comments.',
          sfx: 'Upbeat energetic riser + mouse click sound'
        }
      ],
      youtubeMetadata: {
        title: 'The 10-Second ATS Resume Hack HR Doesn’t Want You To Know #Shorts',
        description: `Applied to 100+ jobs and got ghosted by ATS bots? Here is the exact 10-second hack to beat automated filters and land real interviews in 2026.

⚡ Free 0-Install Web ATS Matcher:
👉 https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?ref=shorts

🚀 Free Chrome Extension (1-Click on LinkedIn & Indeed):
👉 https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb

No credit cards. 100% client-side privacy. Let's beat the bots together!`,
        pinnedComment: `📌 Want to test your resume against ANY job description for free right now?
👉 Try the 0-Install Web Tool: https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?ref=shorts
👉 Or add the Free Chrome Extension: https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne

(100% free, runs entirely inside your browser, zero resume data uploaded!)`,
        tags: [
          '#Shorts',
          '#ATSResume',
          '#JobHunting',
          '#ResumeTips',
          '#Layoffs',
          '#WorkdayHack',
          '#TechJobs',
          '#CareerAdvice',
          '#RemoteJobs',
          '#SuperJobGenie',
          '#CoverLetterAI',
          '#JobApocalypse'
        ]
      },
      socialPush: {
        redditTitle: 'I built a free tool to beat the 75% ATS rejection filter after getting 100+ rejections',
        redditPost: `Hey everyone, like many of you in tech and marketing, I watched qualified friends send out 150+ applications only to get rejected in 10 minutes by automated bots (Workday, Greenhouse).

I built SuperJobGenie — it runs 100% in your browser, parses full 8,000+ char JDs without truncation, and generates exact gap-bridging bullet points and cover letters in 10 seconds.

Completely free, no login or credit card needed for the web demo: [LINK]`
      }
    },
    {
      id: 'thirty_min',
      badge: '⚡ Workflow Pain Point (Relatability 9.8/10)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Stop Spending 30 Minutes Per Job Application',
      hookThreeSec: 'If you’re still manually copy-pasting your resume for every single job...',
      targetAudience: 'Exhausted job hunters applying to 20+ jobs a day manually',
      duration: '20 Seconds (Fast Paced)',
      voiceoverTrack: '/audio/short_38s_voiceover.wav',
      masterTrack: '/audio/viral_shorts_bgm.wav',
      timeline: [
        {
          time: '0:00 - 0:03',
          seconds: [0, 3],
          stage: 'HOOK (0-3s)',
          caption: 'STOP COPY-PASTING 🛑',
          voiceover: 'If you’re still spending 30 minutes manually tweaking your resume for every single job...',
          visual: 'Split screen: person frantically clicking Ctrl+C and Ctrl+V between 10 browser tabs, sweat drop icon.',
          sfx: 'Fast ticking stopwatch + error buzzer'
        },
        {
          time: '0:03 - 0:07',
          seconds: [3, 7],
          stage: 'REALITY CHECK',
          caption: '30 MINS vs 10 SECONDS ⏳',
          voiceover: '...you are fighting an automated algorithm with stone age tools. Recruiters spend 6 seconds reading your CV.',
          visual: 'Recruiter glancing at a screen and clicking "Archive Candidate" with a yawning emoji.',
          sfx: 'Whoosh transition + sigh'
        },
        {
          time: '0:07 - 0:15',
          seconds: [7, 15],
          stage: '1-CLICK DEMO',
          caption: '1-CLICK BROWSER RADAR 🚀',
          voiceover: 'Just hit SuperJobGenie right inside LinkedIn or Indeed. It grabs the full job body, matches your skills, and writes the custom pitch instantly.',
          visual: 'Hover over LinkedIn job page, SuperJobGenie HUD slides out seamlessly, generates a 4-tier cover letter with 1 click.',
          sfx: 'Cash register ding + futuristic UI sound'
        },
        {
          time: '0:15 - 0:20',
          seconds: [15, 20],
          stage: 'CTA',
          caption: 'GET THE FREE EXTENSION 👇',
          voiceover: 'Save 5 hours a week. Get the free Chrome extension in the description!',
          visual: 'Creator smiling sipping coffee. Pinned comment graphic and Chrome Web Store link.',
          sfx: 'Smooth upbeat finish'
        }
      ],
      youtubeMetadata: {
        title: 'Stop Spending 30 Minutes Per Job Application! (Do This Instead) #Shorts',
        description: `How to tailor your resume & cover letter to ANY job in under 10 seconds without manually copy-pasting.

⚡ Try the 0-Install Web Matcher:
👉 https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?ref=shorts

🚀 Free Chrome Extension (1-Click Auto Extraction):
👉 https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb`,
        pinnedComment: `💡 Stop wasting 30 mins per app. Try our free 1-click ATS tool here:
👉 Web Version (No Install): https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?ref=shorts
👉 Chrome Extension: https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne`,
        tags: [
          '#Shorts',
          '#JobApplicationHacks',
          '#ProductivityHacks',
          '#CareerGrowth',
          '#ResumeBuilder',
          '#SuperJobGenie',
          '#LinkedInTips',
          '#IndeedHacks'
        ]
      },
      socialPush: {
        redditTitle: 'Tired of spending 30 minutes on each job application? I built a 1-click Chrome tool',
        redditPost: `Every application asks for a tailored cover letter and resume keywords. Doing this manually for 50 jobs is practically a full-time job. I made a free tool that does it right on LinkedIn/Indeed in 10s.`
      }
    },
    {
      id: 'founder_story',
      badge: '❤️ Founder Authenticity (High Trust & Conversion)',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Why I Built a Free AI Job Tool for Laid-off Tech Workers',
      hookThreeSec: 'Last year, my closest friends were laid off from Big Tech. They sent hundreds of apps into the void.',
      targetAudience: 'Laid-off engineers, tech workers, and community members in r/Layoffs',
      duration: '24 Seconds (Empathetic Storytelling)',
      voiceoverTrack: '/audio/short_38s_voiceover.wav',
      masterTrack: '/audio/long_73s_master_mix.wav',
      timeline: [
        {
          time: '0:00 - 0:04',
          seconds: [0, 4],
          stage: 'VULNERABILITY',
          caption: 'THE TECH LAYOFF REALITY 📉',
          voiceover: 'Last year, my closest friends were laid off from Big Tech. They sent hundreds of applications into the void.',
          visual: 'News headlines of tech layoffs, empty office chair, dark moody lighting.',
          sfx: 'Mellow emotive chord'
        },
        {
          time: '0:04 - 0:11',
          seconds: [4, 11],
          stage: 'THE UNFAIR GAME',
          caption: 'BOTS FILTERING HUMANS 🤖',
          voiceover: 'Recruiters use AI to filter you out in 2 seconds. Why shouldn’t job seekers have AI to fight back? That’s why I built SuperJobGenie.',
          visual: 'AI robot hand discarding resumes into trash can, transitioning to SuperJobGenie shield logo.',
          sfx: 'Dramatic sub drop + switch to inspiring synth'
        },
        {
          time: '0:11 - 0:18',
          seconds: [11, 18],
          stage: 'MISSION & PRIVACY',
          caption: '100% CLIENT-SIDE PRIVACY 🛡️',
          voiceover: 'No paywalls, no tracking your resume data. Just a fast, client-side tool to get your resume past the bots.',
          visual: 'Green checkmarks: "Zero Data Upload", "Client-Side Processing", "Free on Chrome Web Store".',
          sfx: 'Crisp mechanical lock sound'
        },
        {
          time: '0:18 - 0:24',
          seconds: [18, 24],
          stage: 'CALL TO HOPE',
          caption: 'TAKE YOUR CAREER BACK 🚀',
          voiceover: 'Try the free web tool or install the extension in bio. You got this, let’s land that offer.',
          visual: 'High-five / handshake graphic, link in pinned comment highlight.',
          sfx: 'Inspiring climax riser'
        }
      ],
      youtubeMetadata: {
        title: 'Why I built a FREE AI job tool for laid-off tech workers #Shorts',
        description: `Big companies use AI to filter out 75% of candidates. I built SuperJobGenie so candidates have AI to fight back.

⚡ 100% Free Web Matcher:
👉 https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?ref=shorts

🚀 Free Chrome Extension on Web Store:
👉 https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne?utm_source=item-share-cb`,
        pinnedComment: `❤️ If you or someone you know is currently job hunting after layoffs, please share this free tool with them. Let's get people back to work! Link above.`,
        tags: [
          '#Shorts',
          '#TechLayoffs',
          '#SoftwareEngineer',
          '#JobSearchJourney',
          '#BuildInPublic',
          '#SoloFounder',
          '#SuperJobGenie'
        ]
      },
      socialPush: {
        redditTitle: 'I spent 3 months building a free AI tool for laid-off tech workers after seeing friends struggle',
        redditPost: `No ads, no paid subscriptions, no data collection. Just a local tool to match JDs and generate cover letters in 10s.`
      }
    },
    {
      id: 'bug_153',
      badge: '🔍 Industry Secret (Astonishment & Curiosity)',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      title: 'The 153-Character Bug: Why Your Dream Job Rejected You',
      hookThreeSec: 'Most browser job tools only read 153 characters of the job description. Here is the proof.',
      targetAudience: 'Tech candidates, engineers, and data analysts curious about how ATS works',
      duration: '22 Seconds (Technical Revelation)',
      voiceoverTrack: '/audio/short_38s_voiceover.wav',
      masterTrack: '/audio/short_38s_master_mix.wav',
      timeline: [
        {
          time: '0:00 - 0:04',
          seconds: [0, 4],
          stage: 'HOOK & PROOF',
          caption: 'THE 153-CHAR DISASTER ⚠️',
          voiceover: 'Most browser job tools only read 153 characters of the job description. Here is the proof.',
          visual: 'Code inspector zooming into truncated text: "We are hiring..." [153 chars truncated].',
          sfx: 'Scanner beep + error warning'
        },
        {
          time: '0:04 - 0:11',
          seconds: [4, 11],
          stage: 'THE IMPACT',
          caption: 'MISSING CRITICAL SKILLS 📉',
          voiceover: 'They miss 90% of the requirements like microfrontends and cloud architecture, giving you a fake match score.',
          visual: 'Comparison chart: Truncated 153 chars (1 skill found) vs Full 11,000 chars (12 skills found).',
          sfx: 'Glitch rewind'
        },
        {
          time: '0:11 - 0:18',
          seconds: [11, 18],
          stage: 'THE FIX',
          caption: '11,000+ CHARS DEEP EXTRACTION ⚡',
          voiceover: 'SuperJobGenie parses the entire deep DOM — over 11,000 characters — to ensure your resume matches every single requirement.',
          visual: 'SuperJobGenie deep DOM extraction animation with verified skills in glowing neon green.',
          sfx: 'Clean electric surge'
        },
        {
          time: '0:18 - 0:22',
          seconds: [18, 22],
          stage: 'CTA',
          caption: 'TEST YOUR RESUME FOR FREE 👇',
          voiceover: 'Test your resume on our free web tool right now. Pinned link in the comments.',
          visual: 'Final screen with YouTube subscribe button + pinned link highlight.',
          sfx: 'Crisp click'
        }
      ],
      youtubeMetadata: {
        title: 'The 153-Character Bug That Gets You Rejected from Dream Jobs #Shorts',
        description: `Why common resume tools give you fake match scores, and how 11,000+ char deep DOM extraction gives you the edge.

⚡ Test Your Resume Free:
👉 https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?ref=shorts

🚀 Free Chrome Extension:
👉 https://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne`,
        pinnedComment: `🔍 Test whether your resume passes full 8,000+ char deep JD matching for free:
👉 https://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app?ref=shorts`,
        tags: [
          '#Shorts',
          '#TechCareer',
          '#SoftwareEngineering',
          '#ATSAlgorithm',
          '#JobScam',
          '#SuperJobGenie'
        ]
      },
      socialPush: {
        redditTitle: 'PSA: Scraper tools might be truncating job descriptions to 153 characters and ruining your ATS score',
        redditPost: `I discovered a common issue in job matching extensions where only 153 characters of the JD are scraped, completely skipping technical stacks. Here's how to verify full text extraction.`
      }
    }
  ];

  const currentPackage = scriptPackages.find(p => p.id === selectedScriptId) || scriptPackages[0];

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 22) {
            setIsPlaying(false);
            return 0;
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Handle Audio Sync
  const togglePlayAudio = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentPackage.masterTrack || '/audio/short_38s_master_mix.wav');
        audioRef.current.muted = isMuted;
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };
      }
      audioRef.current.currentTime = currentTime;
      audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Determine current active timeline item
  const activeTimelineItem = currentPackage.timeline.find(
    t => currentTime >= t.seconds[0] && currentTime < t.seconds[1]
  ) || currentPackage.timeline[currentPackage.timeline.length - 1];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className={`bg-slate-950 border border-indigo-500/30 rounded-2xl w-full ${isRecordingMode ? 'max-w-2xl' : 'max-w-6xl'} max-h-[95vh] flex flex-col shadow-2xl shadow-indigo-500/20 overflow-hidden transition-all duration-300`}>
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/25 shrink-0">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>YouTube Shorts Studio</span>
                  <span className="text-[10px] font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                    Sprint to 500 Subs
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Turnkey 9:16 Viral Shorts Engine · Teleprompter · 1-Click CapCut &amp; YouTube Metadata
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordingMode(!isRecordingMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isRecordingMode 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle clean recording mode for screen capture (OBS/QuickTime)"
            >
              {isRecordingMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isRecordingMode ? 'Exit Clean Screen' : 'OBS Screen Mode'}</span>
            </button>

            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Sub-Header: Script Selector & Channel Subscriber Milestone */}
        {!isRecordingMode && (
          <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Script package selector pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold mr-1">Shorts Series:</span>
              {scriptPackages.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => {
                    setSelectedScriptId(pkg.id);
                    setCurrentTime(0);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current = null;
                    }
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                    selectedScriptId === pkg.id
                      ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{pkg.id === 'hack_10s' ? '#1 10-Sec ATS Hack' : pkg.id === 'thirty_min' ? '#2 Stop 30 Mins' : pkg.id === 'founder_story' ? '#3 Founder Story' : '#4 153-Char Bug'}</span>
                </button>
              ))}
            </div>

            {/* Target 500 Subs Milestone Tracker */}
            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl">
              <div className="flex items-center gap-1.5 font-bold">
                <Youtube className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-white">Channel Milestone:</span>
                <span className="text-rose-400 font-mono">361</span>
                <span className="text-slate-500">/</span>
                <span className="text-emerald-400 font-mono">500 Subs</span>
              </div>
              <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full" style={{ width: '72.2%' }}></div>
              </div>
              <span className="text-[11px] font-bold text-emerald-300">139 to Go!</span>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 9:16 Vertical Phone Simulator (Takes 5 cols on lg) */}
          <div className={`${isRecordingMode ? 'lg:col-span-12 max-w-sm mx-auto' : 'lg:col-span-5'} flex flex-col items-center`}>
            
            {/* Phone Bezel */}
            <div className="relative w-[300px] sm:w-[320px] aspect-[9/16] bg-slate-950 rounded-[44px] p-3 border-[6px] border-slate-800 shadow-2xl shadow-indigo-900/30 flex flex-col overflow-hidden ring-1 ring-slate-700">
              
              {/* Dynamic Island / Punch Hole */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 animate-ping"></div>
              </div>

              {/* Status Bar */}
              <div className="relative z-30 pt-1 px-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-300 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Phone Screen Canvas Content */}
              <div className="relative flex-1 rounded-[32px] overflow-hidden bg-slate-900 flex flex-col justify-between p-4 mt-2">
                
                {/* Background visual simulation layer based on active timeline */}
                <div className="absolute inset-0 z-0">
                  {currentTime < 3 ? (
                    <div className="w-full h-full bg-gradient-to-b from-red-950/80 via-slate-900 to-black p-4 flex flex-col justify-center items-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center animate-bounce">
                        <X className="w-10 h-10 text-red-400" />
                      </div>
                      <div className="bg-red-950/90 border border-red-500/50 p-2.5 rounded-xl text-left text-[11px] text-red-200 w-full space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          <span>Status: Rejected by ATS Bot</span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          "Unfortunately, after algorithmic parsing, we will not be moving forward..."
                        </p>
                      </div>
                      <div className="text-[11px] font-mono text-red-300 animate-pulse">
                        50+ Applications Discarded
                      </div>
                    </div>
                  ) : currentTime < 8 ? (
                    <div className="w-full h-full bg-gradient-to-b from-amber-950/80 via-slate-900 to-black p-4 flex flex-col justify-center items-center text-center space-y-3">
                      <div className="w-20 h-20 rounded-full border-4 border-amber-500/40 flex items-center justify-center relative">
                        <span className="text-2xl font-black text-amber-400 font-mono">38%</span>
                        <div className="absolute -top-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          BOT TRAP
                        </div>
                      </div>
                      <div className="bg-slate-950/90 border border-amber-500/40 p-2 rounded-xl text-left text-[10px] text-amber-200 w-full space-y-1 font-mono">
                        <div className="text-slate-400">MISSING ATS KEYWORDS:</div>
                        <div className="text-red-400 font-bold">• Microfrontend decoupling</div>
                        <div className="text-red-400 font-bold">• Latency optimization &lt;100ms</div>
                        <div className="text-red-400 font-bold">• Automated Playwright CI/CD</div>
                      </div>
                    </div>
                  ) : currentTime < 16 ? (
                    <div className="w-full h-full bg-gradient-to-b from-indigo-950/90 via-slate-900 to-black p-4 flex flex-col justify-center items-center text-center space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 animate-pulse">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center relative shadow-lg shadow-emerald-500/20">
                        <span className="text-2xl font-black text-emerald-400 font-mono">94%</span>
                        <div className="absolute -bottom-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                          TOP 1%
                        </div>
                      </div>
                      <div className="bg-slate-950/90 border border-emerald-500/40 p-2 rounded-xl text-left text-[10px] text-emerald-200 w-full space-y-1">
                        <div className="font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>4-Tier Executive Pitch Ready</span>
                        </div>
                        <p className="text-[9px] text-slate-300">
                          Tailored with 1-Click to Stripe / LinkedIn / Indeed job descriptions!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-orange-950/90 via-slate-900 to-black p-4 flex flex-col justify-center items-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Zap className="w-8 h-8 text-orange-400" />
                      </div>
                      <div className="text-sm font-black text-white">
                        SUPERJOBGENIE
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-orange-500/30 animate-bounce">
                        👉 FREE IN PINNED COMMENT
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                        <span>★★★★★</span>
                        <span className="text-slate-300">Chrome Web Store · 100% Free</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Overlay Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="bg-black/70 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-white">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>{activeTimelineItem.stage}</span>
                  </div>
                  <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-cyan-300">
                    {currentTime.toFixed(1)}s / 22.0s
                  </div>
                </div>

                {/* Center Dynamic Typography (Viral Creator Style Subtitles) */}
                <div className="relative z-10 my-auto text-center px-1">
                  <div className="inline-block bg-black/85 backdrop-blur-md border-2 border-yellow-400/80 px-3 py-1.5 rounded-xl shadow-2xl">
                    <span className="font-black text-base sm:text-lg tracking-tight uppercase text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {activeTimelineItem.caption}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2 px-2 bg-black/40 rounded-lg py-1">
                    "{activeTimelineItem.voiceover}"
                  </p>
                </div>

                {/* Bottom Overlay Actions inside Phone Simulator */}
                <div className="relative z-10 flex items-center justify-between bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayAudio}
                      className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    </button>
                    <button
                      onClick={handleRestart}
                      className="p-1 text-slate-300 hover:text-white"
                      title="Replay from start"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleToggleMute}
                      className="p-1 text-slate-300 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                    <span className="text-[9px] font-mono text-slate-400">@SuperJobGenie</span>
                  </div>
                </div>

              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2"></div>
            </div>

            {/* Scrubber & Timeline Bar */}
            <div className="w-full max-w-[320px] mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>0:00</span>
                <span className="text-cyan-400 font-bold">{currentTime.toFixed(1)}s</span>
                <span>0:22</span>
              </div>
              <input
                type="range"
                min="0"
                max="22"
                step="0.1"
                value={currentTime}
                onChange={e => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                <button
                  onClick={() => handleSeek(1)}
                  className={`py-1 rounded border transition ${currentTime < 3 ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  01 Hook
                </button>
                <button
                  onClick={() => handleSeek(5)}
                  className={`py-1 rounded border transition ${currentTime >= 3 && currentTime < 8 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  02 Trap
                </button>
                <button
                  onClick={() => handleSeek(11)}
                  className={`py-1 rounded border transition ${currentTime >= 8 && currentTime < 16 ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  03 Equalizer
                </button>
                <button
                  onClick={() => handleSeek(18)}
                  className={`py-1 rounded border transition ${currentTime >= 16 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  04 CTA
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Teleprompter, Storyboard & Creator Export (Takes 7 cols on lg) */}
          {!isRecordingMode && (
            <div className="lg:col-span-7 space-y-4">
              
              {/* Tabs Navigation */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'simulator'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Storyboard &amp; Audio</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'script'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Teleprompter Script</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('metadata')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'metadata'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5 text-rose-400" />
                    <span>YouTube Metadata</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('rebrand')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'rebrand'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rebranding Kit</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(currentPackage.youtubeMetadata.description, 'quick_desc')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    {copiedKey === 'quick_desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Bio Link</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Storyboard & Audio Master */}
              {activeTab === 'simulator' && (
                <div className="space-y-4">
                  {/* Current Script Meta Card */}
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentPackage.badgeColor}`}>
                        {currentPackage.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {currentPackage.duration}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {currentPackage.title}
                    </h4>
                    <p className="text-xs text-slate-300">
                      <strong>Target:</strong> {currentPackage.targetAudience}
                    </p>
                  </div>

                  {/* Scene Timeline Table */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Scene-By-Scene Timeline (CapCut / Premiere Ready)</span>
                      <span className="text-[10px] text-slate-400 font-mono">Click row to preview scene</span>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {currentPackage.timeline.map((item, idx) => {
                        const isActive = currentTime >= item.seconds[0] && currentTime < item.seconds[1];
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSeek(item.seconds[0])}
                            className={`p-3 rounded-xl border transition cursor-pointer ${
                              isActive
                                ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/50'
                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-mono font-bold text-cyan-400">{item.time}</span>
                              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                                {item.stage}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-yellow-300 mb-1">
                              "{item.caption}"
                            </div>
                            <div className="text-xs text-slate-300 font-sans mb-1">
                              <strong>Voiceover:</strong> {item.voiceover}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center justify-between">
                              <span><strong>Visual:</strong> {item.visual}</span>
                              <span className="text-indigo-300 font-mono text-[10px]">SFX: {item.sfx}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Audio Controls & Download */}
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlayAudio}
                        className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isPlaying ? 'Pause Audio' : 'Play Voiceover & BGM'}</span>
                      </button>
                      <button
                        onClick={handleRestart}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
                        title="Replay from 0s"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="/audio/short_38s_master_mix.wav"
                        download="SuperJobGenie_Short_Voiceover.wav"
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Download Voice Track</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Teleprompter Script */}
              {activeTab === 'script' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Full Teleprompter Voiceover Script</h4>
                      <p className="text-xs text-slate-400">Paced for native US delivery with emphasis anchors</p>
                    </div>
                    <button
                      onClick={() => {
                        const fullScript = currentPackage.timeline.map(t => `${t.time} [${t.stage}]\n${t.voiceover}`).join('\n\n');
                        copyToClipboard(fullScript, 'full_script');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {copiedKey === 'full_script' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy for Teleprompter / ElevenLabs</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 space-y-4 leading-relaxed max-h-[380px] overflow-y-auto">
                    {currentPackage.timeline.map((item, idx) => (
                      <div key={idx} className="border-b border-slate-800 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                          <span>{item.time} • {item.stage}</span>
                          <span className="text-[10px] text-amber-400">[PUNCH WORD: "{item.caption.split(' ')[0]}"]</span>
                        </div>
                        <p className="text-sm text-white font-sans font-medium">
                          "{item.voiceover}"
                        </p>
                        <div className="mt-1 text-[11px] text-slate-400">
                          🎯 <strong>Director's Note:</strong> {item.visual}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reddit / LinkedIn Companion Post */}
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        Reddit / LinkedIn Companion Post (Cross-Promote)
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${currentPackage.socialPush.redditTitle}\n\n${currentPackage.socialPush.redditPost}`, 'reddit_post')}
                        className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'reddit_post' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Post</span>
                      </button>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
                      <div className="font-bold text-white mb-1">Title: {currentPackage.socialPush.redditTitle}</div>
                      <p className="text-slate-400 text-[11px]">{currentPackage.socialPush.redditPost}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: YouTube Metadata */}
              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">YouTube Upload Package (High CTR &amp; SEO)</h4>
                      <p className="text-xs text-slate-400">Copy directly into YouTube Studio upload screen</p>
                    </div>
                    <button
                      onClick={() => {
                        const allMeta = `TITLE:\n${currentPackage.youtubeMetadata.title}\n\nDESCRIPTION:\n${currentPackage.youtubeMetadata.description}\n\nPINNED COMMENT:\n${currentPackage.youtubeMetadata.pinnedComment}\n\nTAGS:\n${currentPackage.youtubeMetadata.tags.join(' ')}`;
                        copyToClipboard(allMeta, 'all_meta');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {copiedKey === 'all_meta' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy All Metadata</span>
                    </button>
                  </div>

                  {/* Title Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-300">Video Title (Under 60 chars for mobile visibility):</label>
                      <button
                        onClick={() => copyToClipboard(currentPackage.youtubeMetadata.title, 'meta_title')}
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'meta_title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Title</span>
                      </button>
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white font-mono">
                      {currentPackage.youtubeMetadata.title}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-300">Description (With 0-Install &amp; Chrome Store Links):</label>
                      <button
                        onClick={() => copyToClipboard(currentPackage.youtubeMetadata.description, 'meta_desc')}
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'meta_desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Description</span>
                      </button>
                    </div>
                    <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                      {currentPackage.youtubeMetadata.description}
                    </pre>
                  </div>

                  {/* Pinned Comment Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-amber-300 flex items-center gap-1">
                        <span>📌 Pinned Comment (High-Conversion Hook):</span>
                      </label>
                      <button
                        onClick={() => copyToClipboard(currentPackage.youtubeMetadata.pinnedComment, 'meta_comment')}
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'meta_comment' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Pinned Comment</span>
                      </button>
                    </div>
                    <pre className="p-2.5 bg-amber-950/30 border border-amber-500/40 rounded-lg text-xs text-amber-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {currentPackage.youtubeMetadata.pinnedComment}
                    </pre>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-300">Tags &amp; Hashtags:</label>
                      <button
                        onClick={() => copyToClipboard(currentPackage.youtubeMetadata.tags.join(' '), 'meta_tags')}
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'meta_tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Tags</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentPackage.youtubeMetadata.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-800 text-indigo-300 rounded text-[11px] font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Channel Rebranding Kit */}
              {activeTab === 'rebrand' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Channel Rebranding Strategy &amp; Visual Assets</h4>
                    <p className="text-xs text-slate-400">Positioning the channel as the job hunter’s intelligence station with official 2560x1440 banner</p>
                  </div>

                  {/* Channel Banner Official Asset */}
                  <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border-2 border-indigo-500/40 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">Official YouTube Banner (2560 × 1440 px)</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                            Ready to Upload
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Pre-centered safe area (1546×423 px) — displays flawlessly on Mobile, Desktop, and TV.
                        </p>
                      </div>
                      <a
                        href="/assets/superjobgenie_yt_banner.jpg"
                        download="SuperJobGenie_YouTube_Banner_2560x1440.jpg"
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Banner (2560×1440)</span>
                      </a>
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 group">
                      <img
                        src="/assets/superjobgenie_yt_banner.jpg"
                        alt="SuperJobGenie Official YouTube Banner"
                        className="w-full h-auto object-cover max-h-48"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href="/assets/superjobgenie_yt_banner.jpg"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-800"
                        >
                          View Full Image ↗
                        </a>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between text-[11px] text-slate-300">
                      <span>💡 <strong>橫幅上传：</strong>YouTube 工作室 ➡️ 左侧「自訂 (Customization)」 ➡️ 「品牌宣傳 (Branding)」 ➡️ 「橫幅圖片 (Banner image)」點選【上傳】。</span>
                    </div>
                  </div>

                  {/* Channel Profile Picture / Avatar Asset */}
                  <div className="p-4 bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/30 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/superjobgenie_avatar.jpg"
                          alt="SuperJobGenie Channel Avatar"
                          className="w-14 h-14 rounded-full border-2 border-cyan-400 shadow-md shadow-cyan-500/20 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">Channel Profile Photo (Avatar)</span>
                            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/40">
                              High-Res 1:1
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Circular-crop optimized cyber genie lamp + AI neural chip logo.
                          </p>
                        </div>
                      </div>
                      <a
                        href="/assets/superjobgenie_avatar.jpg"
                        download="SuperJobGenie_Channel_Avatar.jpg"
                        className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 self-start sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Avatar</span>
                      </a>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between text-[11px] text-slate-300">
                      <span>💡 <strong>頭像上传：</strong>同在「品牌宣傳 (Branding)」 ➡️ 第一项「相片 (Picture)」點選【上傳】即可。</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1 */}
                    <div className="p-4 bg-slate-900 border-2 border-indigo-500/50 rounded-xl space-y-2 relative">
                      <span className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        RECOMMENDED
                      </span>
                      <div className="text-xs text-slate-400 font-semibold">Option A (Top Choice):</div>
                      <div className="text-sm font-black text-white">SuperJobGenie | AI Job Hunting Station</div>
                      <p className="text-xs text-slate-300">
                        <strong>Tagline:</strong> Beat the ATS Bots. Land Your Next Role with AI.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Balanced SEO authority, clear brand identity, perfectly matches the Chrome extension name.
                      </p>
                    </div>

                    {/* Option 2 */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="text-xs text-slate-400 font-semibold">Option B (High CTR):</div>
                      <div className="text-sm font-black text-white">Beat The ATS with JobGenie</div>
                      <p className="text-xs text-slate-300">
                        <strong>Tagline:</strong> Why 75% of resumes get rejected before human eyes see them — and how to fix it in 10s.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        High viral click-through rate, directly addresses the #1 search intent on YouTube.
                      </p>
                    </div>
                  </div>

                  {/* Channel About Copy */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Official YouTube About (Bio) Copy:</span>
                      <button
                        onClick={() => {
                          const aboutText = `Stop spending 30 mins per application. Land your next role with AI.\n\nWelcome to SuperJobGenie — the AI Job Hunting Station built to beat resume-rejecting ATS bots and ghost jobs.\n\nHere you’ll get:\n⚡ 10-sec ATS resume matching & missing keywords\n✍️ Tailored cover letters that actually get read\n🎯 Weekly high-paying remote & tech job alerts\n🛡️ Layoff recovery & job search productivity hacks\n\n100% Free Web Tool & Extension:\n👉 Instant Web Matcher (0-Install, No Signup):\nhttps://ais-pre-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app\n\n👉 SuperJobGenie Chrome Extension (1-Click on LinkedIn/Indeed):\nhttps://chromewebstore.google.com/detail/ghhibfhcclohbgfekckljkifkkpfkmne\n\n100% Client-Side Privacy — your resume never leaves your browser.\n\nSubscribe to beat the ATS bots & land more interviews!`;
                          copyToClipboard(aboutText, 'about_bio');
                        }}
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'about_bio' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy About Text (810 Chars / &lt;1000)</span>
                      </button>
                    </div>
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono leading-relaxed space-y-2">
                      <p>Stop spending 30 mins per application. Land your next role with AI.</p>
                      <p>Welcome to SuperJobGenie — the AI Job Hunting Station built to beat resume-rejecting ATS bots.</p>
                      <p className="text-indigo-300 font-bold">🔥 100% Free Web Matcher + Chrome Extension (810/1000 chars)</p>
                    </div>
                  </div>

                  {/* 7-Day Sprint Roadmap */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <span>7-Day Fast Sprint to 500 Subscribers Schedule</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                        <div className="font-bold text-white">Day 1 &amp; 2</div>
                        <div className="text-slate-400 text-[11px]">Rebrand Channel + Release Short #1 (The 10-Sec ATS Hack). Pin web test link.</div>
                      </div>
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                        <div className="font-bold text-white">Day 3 &amp; 4</div>
                        <div className="text-slate-400 text-[11px]">Post Short #2 (Stop 30 Mins) + Share on Reddit r/jobs &amp; r/SideProject.</div>
                      </div>
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                        <div className="font-bold text-white">Day 5 to 7</div>
                        <div className="text-slate-400 text-[11px]">Post Short #3 (Founder Story) + First Community Poll for Remote AI jobs.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Audio &amp; Video Tracks Synced · Gemini 3.8 Studio Engine</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenMatcher && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMatcher();
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Test 0-Install Web Matcher</span>
              </button>
            )}

            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <span>View Chrome Web Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
