import React, { useState } from 'react';
import { X, Check, FileText, Plus, Trash2 } from 'lucide-react';
import { CandidateProfile } from '../types';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  onSave: (updated: CandidateProfile) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSave,
}) => {
  const [title, setTitle] = useState(candidate.title);
  const [targetRole, setTargetRole] = useState(candidate.targetRole || candidate.title);
  const [location, setLocation] = useState(candidate.location || 'San Francisco, CA / London / Remote');
  const [experience, setExperience] = useState(candidate.yearsOfExperience);
  const [isAnonymousMode, setIsAnonymousMode] = useState(candidate.isAnonymousMode ?? true);
  const [resumeText, setResumeText] = useState(candidate.rawResumeText);
  const [skillsStr, setSkillsStr] = useState(candidate.skills.join(', '));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      ...candidate,
      title,
      targetRole,
      location,
      yearsOfExperience: experience,
      isAnonymousMode,
      anonymizedLabel: isAnonymousMode ? 'Anonymous Mode Active (PII Scrubbed: Tang / Krishna / AI Technician)' : 'Standard Profile Mode',
      rawResumeText: resumeText,
      skills: skillsList,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Edit Candidate Profile & Resume Text</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Target Role Focus:</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Candidate Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <span className="font-semibold text-emerald-400 block text-xs">Privacy & ATS Scrubbing Shield:</span>
              <span className="text-[11px] text-slate-400">Automatically scrubs names, phone numbers, addresses, and emails (PII)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymousMode(!isAnonymousMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                isAnonymousMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isAnonymousMode ? '✓ Privacy Mode Active' : 'Standard Mode'}
            </button>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Extracted Skills (comma separated):
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Full Resume Text (Full 15+ YOE Experience):
            </label>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold shadow"
            >
              Save & Re-analyze
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
