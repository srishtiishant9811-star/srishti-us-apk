import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Languages,
  Shield,
  Download,
  Trash2,
  Heart,
  Sparkles,
  Info,
  Smartphone,
} from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { Memory, FavouriteItem, Reminder, Message } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceReadoutEnabled: boolean;
  setVoiceReadoutEnabled: (enabled: boolean) => void;
  preferredLanguage: string;
  setPreferredLanguage: (lang: string) => void;
  memories: Memory[];
  favourites: FavouriteItem[];
  reminders: Reminder[];
  messages: Message[];
  onClearAllData: () => void;
  onOpenDownload?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voiceReadoutEnabled,
  setVoiceReadoutEnabled,
  preferredLanguage,
  setPreferredLanguage,
  memories,
  favourites,
  reminders,
  messages,
  onClearAllData,
  onOpenDownload,
}) => {
  if (!isOpen) return null;

  const handleExportData = () => {
    const exportPayload = {
      app: 'Only us',
      assistant: 'Ishant AI',
      owner: 'Srishti',
      exportedAt: new Date().toISOString(),
      memories,
      favourites,
      reminders,
      chatHistoryCount: messages.length,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `only-us-srishti-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#08291f] via-[#051c14] to-[#02110c] border border-emerald-600/50 p-6 md:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:text-emerald-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center">
            <TulipIcon variant="logo" size={24} />
          </div>
          <div>
            <h2 className="font-serif-luxury text-xl font-bold text-emerald-100">
              Only us Settings
            </h2>
            <p className="text-xs text-emerald-400/80 font-light">
              Personalize Ishant AI for Srishti
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Voice Readout Toggle */}
          <div className="p-4 rounded-2xl bg-[#03140e] border border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
                {voiceReadoutEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-emerald-200">
                  Read replies aloud
                </h4>
                <p className="text-[11px] text-emerald-500 font-light">
                  Ishant speaks his messages with gentle speech audio
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={voiceReadoutEnabled}
              onChange={(e) => setVoiceReadoutEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Language Preference */}
          <div className="p-4 rounded-2xl bg-[#03140e] border border-emerald-800/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
              <Languages className="w-4 h-4 text-emerald-400" />
              <span>Conversation Style</span>
            </div>
            <p className="text-[11px] text-emerald-500 font-light">
              Ishant understands Hindi, Hinglish, and English naturally.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {['Hinglish & Natural', 'English Only', 'Shuddh Hindi', 'Auto-Adapt'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setPreferredLanguage(lang)}
                  className={`text-xs p-2 rounded-xl border text-center transition-all ${
                    preferredLanguage === lang
                      ? 'bg-emerald-700 border-emerald-400 text-white font-semibold'
                      : 'bg-[#051c14] border-emerald-800/40 text-emerald-400/80 hover:bg-emerald-900/30'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Download App Package & APK */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#052219] to-emerald-950/60 border border-emerald-700/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-emerald-100 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get App (APK / ZIP)</span>
              </h4>
              <p className="text-[11px] text-emerald-400/80 font-light">
                Download only-us-app.zip or install on your phone
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onOpenDownload) onOpenDownload();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <span>Download</span>
            </button>
          </div>

          {/* Backup & Export */}
          <div className="p-4 rounded-2xl bg-[#03140e] border border-emerald-800/50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-emerald-200">
                Export Memories & Notes
              </h4>
              <p className="text-[11px] text-emerald-500 font-light">
                Download a private backup JSON file
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 hover:text-emerald-100 text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* About Companion */}
          <div className="p-4 rounded-2xl bg-[#03140e] border border-emerald-800/50 text-xs space-y-2 text-emerald-300/80 font-light">
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>About "Only us"</span>
            </div>
            <p className="leading-relaxed">
              <strong>App Name:</strong> Only us
              <br />
              <strong>AI Companion:</strong> Ishant
              <br />
              <strong>Created For:</strong> Srishti
              <br />
              Designed with a tulip-inspired green aesthetic, private local memory persistence, and
              real AI intelligence.
            </p>
          </div>

          {/* Reset / Clear Data */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('Reset local history and restore default state?')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-2xl border border-rose-900/50 text-rose-400 hover:bg-rose-950/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Local Conversation History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
