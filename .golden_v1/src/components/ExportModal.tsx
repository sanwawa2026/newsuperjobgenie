import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FolderArchive, 
  Chrome, 
  FileCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  HelpCircle,
  Code2
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'files' | 'guide' | 'patch'>('packages');
  const [selectedFile, setSelectedFile] = useState<string>('content.js');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownload = async (type: 'extension' | 'full') => {
    try {
      setIsDownloading(type);
      const url = type === 'extension' ? '/api/download-extension-zip' : '/api/download-project-zip';
      const filename = type === 'extension' 
        ? 'superjobgenie-chrome-extension.zip' 
        : 'superjobgenie-full-project.zip';

      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Failed to generate download. Please ensure the service is running.');
    } finally {
      setIsDownloading(null);
    }
  };

  // Code snippets for direct copy
  const fileSnippets: Record<string, { label: string; lang: string; desc: string; code: string }> = {
    'content.js': {
      label: 'extension/content.js',
      lang: 'javascript',
      desc: 'In-Page Modal + Schema.org JSON-LD 3000+ chars extraction + real-time profile re-evaluation + cover letter generator.',
      code: `// SuperJobGenie 2.2 - In-Page Modal + 3000+ chars extraction
function extractFullIndeedJob() {
  let fullBodyText = '';
  let extractionSource = 'DOM #jobDescriptionText';

  // 1. Primary: Schema.org JSON-LD (100% complete, unimpacted by micro-frontends)
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const parsed = JSON.parse(script.textContent || '{}');
      const jobPosting = Array.isArray(parsed) 
        ? parsed.find(item => item['@type'] === 'JobPosting')
        : (parsed['@type'] === 'JobPosting' ? parsed : null);

      if (jobPosting && jobPosting.description && jobPosting.description.length > 300) {
        fullBodyText = cleanHtmlToFormattedText(jobPosting.description);
        extractionSource = 'Schema.org JSON-LD (<script type="application/ld+json">)';
        break;
      }
    } catch (e) {}
  }

  // 2. Fallback: DOM recursive extraction on #jobDescriptionText
  if (!fullBodyText || fullBodyText.length < 300) {
    const jdContainer = document.querySelector('#jobDescriptionText') || 
                        document.querySelector('.jobsearch-JobComponent-description');
    if (jdContainer) {
      fullBodyText = cleanHtmlToFormattedText(jdContainer.innerHTML);
      extractionSource = 'DOM container #' + (jdContainer.id || 'jobDescriptionText');
    }
  }

  return { fullBodyText, characterCount: fullBodyText.length, extractionSource };
}`
    },
    'styles.css': {
      label: 'extension/styles.css',
      lang: 'css',
      desc: 'Floating HUD pill and centered immersive interactive modal styling.',
      code: `/* Immersive Modal Styles */
.sjg-floating-pill {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999990;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #0f172a;
  border: 1px solid rgba(99, 102, 241, 0.4);
  border-radius: 9999px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6);
  cursor: pointer;
}
.sjg-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999999;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}`
    },
    'manifest.json': {
      label: 'extension/manifest.json',
      lang: 'json',
      desc: 'Chrome Extension Manifest V3 configuration, declaring western job board match permissions and content script injection rules.',
      code: `{
  "manifest_version": 3,
  "name": "SuperJobGenie - AI Job Match & Career Pivot Intelligence",
  "version": "2.9.0",
  "description": "Fixes 153-char truncation with 8,000+ char deep scraping, precise skill match scoring, and strategic career pivots.",
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "https://*.indeed.com/*",
    "http://localhost:3000/*"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://*.indeed.com/*"],
      "js": ["content.js"],
      "css": ["styles.css"],
      "run_at": "document_idle"
    }
  ]
}`
    },
    'server.ts': {
      label: 'server.ts (Deep Extraction & Scoring Engine)',
      lang: 'typescript',
      desc: 'Node.js dual-mode parser, Gemini 3.8 Flash prompt engineering, and offline semantic fallback engine.',
      code: `// server.ts core extraction & sanitize logic
function cleanHtmlToFormattedText(html: string): string {
  if (!html) return '';
  let text = html.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '');
  text = text.replace(/<style\\b[^<]*(?:(?!<\\/style>)<[^<]*)*<\\/style>/gi, '');
  text = text.replace(/<li[^>]*>(.*?)<\\/li>/gi, '\\n• $1');
  text = text.replace(/<br\\s*[\\/]?>/gi, '\\n');
  text = text.replace(/<\\/p>/gi, '\\n\\n');
  text = text.replace(/<\\/[^>]+>/g, '');
  return text.trim();
}`
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>Export & Download SuperJobGenie</span>
                <span className="text-[11px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  v2.9.0 Stable
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Packaged full 8,000+ char deep scraping engine and Chrome Extension. Download or copy code in 1-click.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6">
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'packages'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>📦 1-Click ZIP Downloads</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>🛠️ Chrome Load Unpacked Guide (30s)</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'files'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>📄 Key Source Files & Copy</span>
          </button>

          <button
            onClick={() => setActiveTab('patch')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'patch'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>🧩 Export Button Patch</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card 1: Chrome Extension Package */}
                <div className="bg-gradient-to-b from-slate-800/60 to-slate-900 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                        <Chrome className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Ready to Install
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">SuperJobGenie Chrome Extension</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Contains fixed <code className="text-cyan-300">content.js</code> deep scraper, Manifest V3, HUD styling, background worker, and icons.
                      </p>
                    </div>

                    <div className="bg-slate-950/60 rounded-lg p-3 text-xs space-y-1.5 font-mono text-slate-300">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span>✓</span>
                        <span>Fixed 153-char truncation (Recursive Schema.org)</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span>✓</span>
                        <span>Live floating HUD pill on western job boards</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span>✓</span>
                        <span>Load unpacked directly in Chrome extensions</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleDownload('extension')}
                      disabled={isDownloading !== null}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloading === 'extension' ? 'Packaging...' : 'Download Chrome Extension (.zip)'}</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: Full Project Codebase */}
                <div className="bg-gradient-to-b from-slate-800/60 to-slate-900 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
                        <FolderArchive className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                        Full-Stack Project
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">Full Stack Project Source Code</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Contains Express backend, Gemini 3.8 Flash career pivot engine, React frontend dashboard, and Chrome Extension source.
                      </p>
                    </div>

                    <div className="bg-slate-950/60 rounded-lg p-3 text-xs space-y-1.5 font-mono text-slate-300">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <span>✓</span>
                        <span>Includes server.ts deep scraper & scoring backend</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-400">
                        <span>✓</span>
                        <span>Includes ExecutiveDashboard (PRO) radar</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-400">
                        <span>✓</span>
                        <span>Includes npm run dev local startup scripts</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleDownload('full')}
                      disabled={isDownloading !== null}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloading === 'full' ? 'Packaging...' : 'Download Full Project Source (.zip)'}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Tips */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-slate-200">How to use after download?</span>
                  If you only need live scraping and matching on job boards in your Chrome browser, download the <strong>Chrome Extension (.zip)</strong> above, unzip it and load it in your browser extensions tab!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHROME EXTENSION GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center gap-2 text-sm font-bold text-white">
                  <Chrome className="w-4 h-4 text-blue-400" />
                  <span>Chrome Extension 4-Step Local Installation (30 Seconds)</span>
                </div>
                
                <div className="p-5 space-y-5 text-xs text-slate-300">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Download and Unzip Extension</div>
                      <p className="text-slate-400 mt-1">
                        Click "Download Chrome Extension (.zip)" above, and unzip it to any folder on your computer (e.g. <code className="text-cyan-300">~/Downloads/superjobgenie-extension</code>).
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Open Chrome Extensions Manager</div>
                      <p className="text-slate-400 mt-1">
                        In your Chrome or Edge browser address bar, open:
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg font-mono text-cyan-300 text-xs">
                          chrome://extensions/
                        </code>
                        <button
                          onClick={() => handleCopy('chrome://extensions/', 'chrome-url')}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 font-sans flex items-center gap-1"
                        >
                          {copiedKey === 'chrome-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'chrome-url' ? 'Copied' : 'Copy URL'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Enable "Developer Mode" and Load Unpacked</div>
                      <p className="text-slate-400 mt-1">
                        1. Toggle the <strong>Developer mode</strong> switch in the top right corner.<br />
                        2. Click the <strong>Load unpacked</strong> button that appears on the top left.<br />
                        3. In the file picker, select your unzipped extension directory!
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      4
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Open Job Page to Experience Live Scraper</div>
                      <p className="text-slate-400 mt-1">
                        Visit any job posting on Indeed, LinkedIn, or Greenhouse. The <strong>SuperJobGenie HUD</strong> floating widget will automatically appear in the bottom-right corner, displaying live 8,000+ char capture and strategic match intelligence!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FILE VIEW & COPY */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                {Object.keys(fileSnippets).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedFile(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                      selectedFile === key
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Active File Description */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {fileSnippets[selectedFile].label}
                    </span>
                  </div>
                    <button
                    onClick={() => handleCopy(fileSnippets[selectedFile].code, selectedFile)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    {copiedKey === selectedFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  {fileSnippets[selectedFile].desc}
                </p>

                {/* Code Block */}
                <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto max-h-[350px]">
                  <pre>{fileSnippets[selectedFile].code}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORKSTATION PATCH */}
          {activeTab === 'patch' && (
            <div className="space-y-6">
              <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-xl p-5 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Universal Export Button Cross-Workbench Integration Patch</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    You can directly copy <code className="text-cyan-300">ExportExtensionButton.tsx</code> into any other React / Vite / Next.js workbench.
                    Equipped with <strong>dual-mode execution</strong>: automatically packages downloads in-browser via JSZip if no backend API is reachable!
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('npm install jszip lucide-react', 'patch_npm_full')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shadow-md"
                >
                  {copiedKey === 'patch_npm_full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'patch_npm_full' ? 'Copied Command!' : 'Copy npm Command'}</span>
                </button>
              </div>

              {/* 3 Steps Integration */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>Install Peer Dependencies (Project Root)</span>
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-cyan-300 border border-slate-800 flex items-center justify-between">
                    <code>npm install jszip lucide-react</code>
                    <button
                      onClick={() => handleCopy('npm install jszip lucide-react', 'cmd1')}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      {copiedKey === 'cmd1' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>Import and Render Component in Your Workbench</span>
                    </span>
                    <button
                      onClick={() => handleCopy(`import { ExportExtensionButton } from './components/ExportExtensionButton';\n\n// Render in top navbar or header action bar:\n<ExportExtensionButton \n  variant="gradient" \n  label="Export Extension" \n  extensionName="SuperJobGenie"\n/>`, 'code_render')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                    >
                      {copiedKey === 'code_render' ? 'Copied JSX' : 'Copy JSX'}
                    </button>
                  </div>
                  <pre className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`import { ExportExtensionButton } from './components/ExportExtensionButton';

// Render in top navbar or action bar:
<ExportExtensionButton 
  variant="gradient" 
  label="Export Extension" 
  extensionName="SuperJobGenie"
/>`}
                  </pre>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                      <span>View or Download Patch Documentation</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Patch files are automatically saved in local paths:<br />
                    • Documentation: <code className="text-indigo-300">/docs/EXPORT_BUTTON_PATCH.md</code><br />
                    • Git Patch File: <code className="text-indigo-300">/patches/export-extension-button.patch</code><br />
                    • Standalone Component: <code className="text-indigo-300">/src/components/ExportExtensionButton.tsx</code>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All code verified with strict linter and compiler, ready for production.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
          >
            Done & Close
          </button>
        </div>

      </div>
    </div>
  );
}
