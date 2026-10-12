import React, { useState, useRef } from 'react';
import { Volume2, Play, Pause, Download, Sparkles, X, CheckCircle, Clock, Smartphone, Monitor } from 'lucide-react';

interface VoiceoverStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  timeRange: string;
  voiceOnlyFile: string;
  masterMixFile: string;
  badge: string;
  badgeColor: string;
  script: string;
}

export const VoiceoverStudioModal: React.FC<VoiceoverStudioModalProps> = ({ isOpen, onClose }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const tracks: AudioTrack[] = [
    {
      id: 'short_38s',
      title: '📱 38s Vertical Short (Reels, TikTok & YouTube Shorts)',
      subtitle: 'High-retention algorithm cut • Fast hook • Pivot prioritized',
      timeRange: '0:00 - 0:38',
      voiceOnlyFile: '/audio/short_38s_voiceover.wav',
      masterMixFile: '/audio/short_38s_master_mix.wav',
      badge: 'Shorts / TikTok Ready',
      badgeColor: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
      script: 'Stop shouting into the void. Fifty applications, zero replies. Meet SuperJobGenie: the local-first AI built right into your browser. Instant role alignment across six thousand characters of deep job description. Don\'t just match current jobs. Discover high-paying adjacent tracks. And generate tailored, executive cover letters in seconds. SuperJobGenie. Move faster. Switch tracks. Add to Chrome — it\'s free.'
    },
    {
      id: 'long_73s',
      title: '🖥️ 73s Cinematic Long-Form (YouTube & Official Landing Page)',
      subtitle: 'Full emotional narrative • Measured breathing room • 1:13 BGM beat-matched',
      timeRange: '0:00 - 1:13',
      voiceOnlyFile: '/audio/long_73s_voiceover.wav',
      masterMixFile: '/audio/long_73s_master_mix.wav',
      badge: 'YouTube / 4K Trailer Ready',
      badgeColor: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
      script: 'Stop shouting into the void. Hours tailoring resumes for black holes where human eyes never look. Fifty applications. Zero replies. Six hours lost. Meet SuperJobGenie. The local-first intelligence layer, built directly into your browser. Over six thousand characters of deep job description verified in real time. Role fit score: ninety-seven percent. Top one percent exceptional match. C-sharp, .NET, SQL, Python, PostgreSQL. Zero skill gaps. From raw JD to offer-ready. Tailored professional applications in seconds. Plus smart career pivot discovery to unlock high-demand adjacent tracks. SuperJobGenie. Move faster. Switch tracks. Add to Chrome — it\'s free. Available now on the Chrome Web Store.'
    }
  ];

  const handleTogglePlay = (trackId: string, file: string) => {
    if (playingId === `${trackId}_${file}`) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(file);
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
      audio.play().catch(e => console.error('Audio playback error:', e));
      setPlayingId(`${trackId}_${file}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-500/20 overflow-hidden">
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
                <h3 className="text-base font-bold text-white">Gemini 3.8 Flash Studio Voiceover Hub</h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  All Master Tracks Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Time-aligned 38s Vertical Short & 73s Long-Form Audio Packages</p>
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              All audio tracks are recorded with the authoritative, inspiring <strong>Tech Product Leader</strong> voice tone. Choose between <strong>Clean Voice Only</strong> (to mix with your own audio track) or <strong>Full Master Mix</strong> (voice + cyber ambient BGM pre-blended).
            </span>
          </div>

          <div className="space-y-4">
            {tracks.map((track) => {
              const isPlayingVoice = playingId === `${track.id}_${track.voiceOnlyFile}`;
              const isPlayingMix = playingId === `${track.id}_${track.masterMixFile}`;

              return (
                <div
                  key={track.id}
                  className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white">{track.title}</span>
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${track.badgeColor}`}>
                          {track.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{track.subtitle}</p>
                    </div>

                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded flex items-center gap-1 self-start sm:self-auto">
                      <Clock className="w-3 h-3" />
                      {track.timeRange}
                    </span>
                  </div>

                  {/* Play & Download Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
                    {/* Master Mix Button */}
                    <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-500/30 rounded-lg p-2">
                      <button
                        onClick={() => handleTogglePlay(track.id, track.masterMixFile)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm ${
                          isPlayingMix
                            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                        }`}
                      >
                        {isPlayingMix ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Pause Full Mix</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play Full Mix (BGM + Voice)</span>
                          </>
                        )}
                      </button>
                      <a
                        href={track.masterMixFile}
                        download={track.masterMixFile.split('/').pop()}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-md transition"
                        title="Download Full Master Mix WAV"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Pure Voice Button */}
                    <div className="flex items-center gap-2 bg-indigo-950/30 border border-indigo-500/30 rounded-lg p-2">
                      <button
                        onClick={() => handleTogglePlay(track.id, track.voiceOnlyFile)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm ${
                          isPlayingVoice
                            ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isPlayingVoice ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Pause Voice</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play Voice Only (Clean)</span>
                          </>
                        )}
                      </button>
                      <a
                        href={track.voiceOnlyFile}
                        download={track.voiceOnlyFile.split('/').pop()}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md transition"
                        title="Download Clean Voice WAV"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Spoken Script Box */}
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
                    "{track.script}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4" />
            38s Short & 73s Long Master Packages Ready
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
