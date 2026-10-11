import React, { useState, useRef } from 'react';
import { Volume2, Play, Pause, Download, Sparkles, X, CheckCircle, Clock } from 'lucide-react';

interface VoiceoverStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AudioScene {
  id: string;
  title: string;
  timeRange: string;
  file: string;
  text: string;
  durationEst: string;
}

export const VoiceoverStudioModal: React.FC<VoiceoverStudioModalProps> = ({ isOpen, onClose }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const scenes: AudioScene[] = [
    {
      id: 'scene1',
      title: 'Scene 1: The Void (Pain Hook)',
      timeRange: '0:00 - 0:09',
      file: '/audio/scene1.wav',
      durationEst: '8s',
      text: 'Stop shouting into the void. Hours tailoring resumes for black holes where human eyes never look. 50 applications. Zero replies. Six hours lost.'
    },
    {
      id: 'scene2',
      title: 'Scene 2: The Breakthrough (Meet SuperJobGenie)',
      timeRange: '0:10 - 0:19',
      file: '/audio/scene2.wav',
      durationEst: '8s',
      text: 'Meet SuperJobGenie. The local-first intelligence layer, built directly into your browser. Over six thousand characters of deep job description verified in real time.'
    },
    {
      id: 'scene3',
      title: 'Scene 3: The Dopamine Hit (97% Role Fit Score)',
      timeRange: '0:20 - 0:34',
      file: '/audio/scene3.wav',
      durationEst: '9s',
      text: 'Role fit score: 97 percent. Top one percent exceptional match. C-sharp, .NET, SQL, Python, PostgreSQL. Zero skill gaps.'
    },
    {
      id: 'scene4',
      title: 'Scene 4: Offer-Ready Applications & Pivot Radar',
      timeRange: '0:35 - 0:47',
      file: '/audio/scene4.wav',
      durationEst: '7s',
      text: 'From raw JD to offer-ready. Tailored professional applications in seconds. Plus smart career pivot discovery to unlock high-demand adjacent tracks.'
    },
    {
      id: 'scene5',
      title: 'Scene 5: High-Impact Outro & Call to Action',
      timeRange: '0:48 - 1:00',
      file: '/audio/scene5.wav',
      durationEst: '8s',
      text: 'SuperJobGenie. Move faster. Land better. Add to Chrome — it\'s free. Available now on the Chrome Web Store.'
    }
  ];

  const handleTogglePlay = (scene: AudioScene) => {
    if (playingId === scene.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(scene.file);
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
      audio.play().catch(e => console.error('Audio playback error:', e));
      setPlayingId(scene.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-500/20 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Gemini 3.8 Flash Studio Voiceover</h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Broadcast Ready (WAV)
                </span>
              </div>
              <p className="text-xs text-slate-400">Time-aligned 60s trailer voice track for your video</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setPlayingId(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              All 5 audio scenes were synthesized using <strong>gemini-3.8-flash-tts</strong> with Scene 4's Tech Product Leader tone. Preview individual scenes below, or play/download the <strong>Full 60s Master Mix</strong> with background music pre-blended!
            </span>
          </div>

          {/* Master 60s Mix Card */}
          <div className="bg-gradient-to-r from-amber-950/40 via-indigo-950/50 to-slate-900 border-2 border-amber-500/40 rounded-xl p-4 shadow-xl shadow-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-amber-300">👑 Full 60s Video Master Mix (Voice + BGM)</span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                  All-In-One 60.2s WAV
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePlay({
                    id: 'master_mix',
                    title: 'Full 60s Master Mix',
                    timeRange: '0:00 - 1:00',
                    file: '/audio/superjobgenie_trailer_master_mix.wav',
                    durationEst: '60s',
                    text: ''
                  })}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-md ${
                    playingId === 'master_mix'
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                  }`}
                >
                  {playingId === 'master_mix' ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause Full Mix</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Full 60s Track</span>
                    </>
                  )}
                </button>
                <a
                  href="/audio/superjobgenie_trailer_master_mix.wav"
                  download="superjobgenie_trailer_master_mix.wav"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition border border-slate-700"
                  title="Download complete 60s mixed audio track"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                </a>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete, ready-to-drop soundtrack: All 5 scene voiceovers synchronized to video timestamps (0:00, 0:10, 0:20, 0:35, 0:48) plus the dark cyber ambient background music track with automatic volume ducking. Drop directly onto your video timeline at 0:00!
            </p>
          </div>

          <div className="space-y-3">
            {scenes.map((scene) => {
              const isPlaying = playingId === scene.id;
              return (
                <div
                  key={scene.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isPlaying
                      ? 'bg-indigo-950/50 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{scene.title}</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {scene.timeRange}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePlay(scene)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                          isPlaying
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play Audio</span>
                          </>
                        )}
                      </button>
                      <a
                        href={scene.file}
                        download={scene.file.split('/').pop()}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                        title="Download WAV file"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    "{scene.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4" />
            5/5 Broadcast Audio Clips Generated
          </span>
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setPlayingId(null);
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
