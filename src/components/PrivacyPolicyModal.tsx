import React from 'react';
import { ShieldCheck, X, CheckCircle2, Lock, EyeOff, Server, HardDrive } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">SuperJobGenie Privacy Policy</h3>
              <p className="text-xs text-slate-400">Chrome Web Store & GDPR Single-Purpose Compliance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-300 text-sm mb-1">Our Core Privacy Commitment</h4>
              <p className="text-emerald-100/90">
                SuperJobGenie is built on a <strong>zero-tracking, client-first architecture</strong>. Your raw resume, personal career history, contact details, and job browsing activity remain strictly stored on your own local browser instance. We never sell, rent, or transfer your personal data.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">1. Single Purpose Declaration</h4>
            <p>
              The single purpose of the SuperJobGenie extension is to empower job seekers by extracting authentic, unabridged job descriptions directly from supported recruitment web pages (LinkedIn, Indeed, Glassdoor) and computing real-time skills alignment against the user's provided candidate profile.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">2. Data We Collect and How It Is Used</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                <strong className="text-slate-200">Candidate Profile & Resume Text:</strong> Stored strictly in local Chrome Storage (`chrome.storage.local`) on your machine. Never uploaded to external servers without your explicit click.
              </li>
              <li>
                <strong className="text-slate-200">Extracted Job Data:</strong> Analyzed in memory on the active tab DOM to compute skill gaps and role match scores.
              </li>
              <li>
                <strong className="text-slate-200">Permissions Usage:</strong> The `activeTab` permission is solely utilized to read job descriptions when you view a supported job board. No background browsing habits across unauthorized domains are ever monitored.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">3. Third-Party Disclosures & Non-Sale of Data</h4>
            <p>
              SuperJobGenie does not sell, trade, or monetize personal information. We do not use user data for advertising, marketing profiling, or credit scoring.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">4. Data Deletion & User Control</h4>
            <p>
              You maintain total sovereignty over your data. You can clear your stored candidate profile, parsed skills, and history at any time with one click using the "Clear Profile" button inside the HUD or by uninstalling the extension from Chrome.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">5. Contact Information</h4>
            <p>
              For privacy inquiries, audit requests, or questions regarding our data practices, please reach out to our team at: <span className="text-indigo-400 font-mono">support@superjobgenie.com</span>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Effective Date: October 2026 • Version 2.9 Compliance</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
          >
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
};
