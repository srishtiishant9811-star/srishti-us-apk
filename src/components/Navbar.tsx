import React from 'react';
import { TulipIcon } from './TulipIcon';
import { Sparkles, Mic, Settings, Volume2, VolumeX, Download } from 'lucide-react';
import { audioService } from '../services/audio';

interface NavbarProps {
  onOpenVoice: () => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  onOpenDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenVoice,
  onOpenSettings,
  onNavigateHome,
  onOpenDownload,
}) => {
  const [isPlayingAmbient, setIsPlayingAmbient] = React.useState(false);

  const toggleSound = () => {
    const isPlaying = audioService.toggleAmbientSound('rain');
    setIsPlayingAmbient(isPlaying);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#04100c]/85 border-b border-emerald-900/30 px-4 py-3 transition-all">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Brand & Emblem */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-950 via-[#06241a] to-emerald-900/40 p-2 border border-emerald-700/30 shadow-inner flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
            <TulipIcon variant="logo" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-luxury text-lg tracking-wider text-emerald-100 font-semibold group-hover:text-emerald-300 transition-colors">
                Only us
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-emerald-400">
                Srishti
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium tracking-wide">Ishant AI</span>
              <span className="text-emerald-600/70">• Online</span>
            </div>
          </div>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Download ZIP / APK Button */}
          <button
            onClick={onOpenDownload}
            title="Download ZIP or Install APK"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/50 hover:border-emerald-600/70 text-emerald-300 hover:text-emerald-100 text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ZIP / APK</span>
          </button>

          {/* Ambient Rain Sound toggle */}
          <button
            onClick={toggleSound}
            title={isPlayingAmbient ? 'Pause ambient rain' : 'Play peaceful rain ambient'}
            className={`p-2 rounded-xl border transition-all ${
              isPlayingAmbient
                ? 'bg-emerald-800/30 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20 animate-pulse'
                : 'bg-emerald-950/40 border-emerald-900/40 text-emerald-400/80 hover:text-emerald-200 hover:border-emerald-800/60'
            }`}
          >
            {isPlayingAmbient ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Mode Shortcut */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 hover:from-emerald-800/80 hover:to-emerald-700/60 border border-emerald-600/40 text-emerald-200 text-xs font-medium shadow-sm transition-all active:scale-95"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Voice</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/40 text-emerald-400/80 hover:text-emerald-200 hover:border-emerald-800/60 transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
