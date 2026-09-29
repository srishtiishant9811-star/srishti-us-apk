import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  FileArchive,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'zip' | 'apk'>('zip');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/api/download-zip';
    link.download = 'only-us-app.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#08291f] via-[#051c14] to-[#02110c] border border-emerald-500/50 p-6 md:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:text-emerald-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 p-2 flex items-center justify-center border border-emerald-600/50 shadow-lg">
            <TulipIcon variant="logo" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                100% Free Forever
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-950 border border-teal-700/50 text-teal-300">
                No Sign-up Needed
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-emerald-100 mt-1">
              Download Only us Free
            </h2>
          </div>
        </div>

        {/* Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#03130d] border border-emerald-800/40 mb-5">
          <button
            onClick={() => setActiveTab('zip')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'zip'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400/80 hover:text-emerald-200'
            }`}
          >
            <FileArchive className="w-4 h-4" />
            <span>Free ZIP Download</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'apk'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400/80 hover:text-emerald-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Free APK / Mobile</span>
          </button>
        </div>

        {/* Tab 1: ZIP Download */}
        {activeTab === 'zip' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#041911] border border-emerald-700/40 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  Full Source Archive
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                  FREE • only-us-app.zip (~125 KB)
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 font-light leading-relaxed">
                Contains the complete application: React + TypeScript frontend, Express backend, Gemini AI chat system, Srishti's favourites & memories, Care Mode, audio services, and APK conversion configs. 100% free to download, inspect, and run anywhere.
              </p>
            </div>

            {/* Direct Instant Free Download Links */}
            <div className="space-y-2">
              <a
                href="/only-us.zip"
                download="only-us-app.zip"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-[#02100a] font-bold text-sm tracking-wide shadow-xl shadow-emerald-950/70 flex items-center justify-center gap-2 transition-all active:scale-[0.98] select-none"
              >
                <Download className="w-4 h-4" />
                <span>Instant Free Download (.zip)</span>
              </a>

              <button
                onClick={handleDownloadZip}
                disabled={isDownloading}
                className="w-full py-2.5 rounded-xl border border-emerald-700/50 hover:border-emerald-500 text-emerald-300 hover:text-emerald-100 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Alternate Free Download Route (/api/download-zip)</span>
              </button>
            </div>

            {/* Quick Run Guide */}
            <div className="p-4 rounded-2xl bg-[#03130d] border border-emerald-800/40 text-left space-y-2 text-xs">
              <h4 className="font-semibold text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to use the free ZIP on your computer</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-emerald-400/90 font-mono text-[11px]">
                <li>Unzip <span className="text-emerald-200">only-us-app.zip</span></li>
                <li>Run <span className="text-emerald-200">npm install</span></li>
                <li>Run <span className="text-emerald-200">npm run dev</span></li>
                <li>Open <span className="text-emerald-200">http://localhost:3000</span> in any browser</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: APK & Mobile Install */}
        {activeTab === 'apk' && (
          <div className="space-y-4 text-left">
            {/* Direct WebAPK Install on Android */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06291d] to-[#041b13] border border-emerald-600/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Option 1: Direct Android Install (WebAPK)</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-500/40 text-emerald-300">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 font-light leading-relaxed">
                Android Chrome will automatically generate and install a native WebAPK with the Tulip icon on Srishti's phone home screen and app launcher. No app store fees, no developer account required.
              </p>

              {isInstallable ? (
                <button
                  onClick={install}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#02100a] font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/60 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Only us Now (Free)</span>
                </button>
              ) : isInstalled ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Only us is already installed on this device!</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#03130d] border border-emerald-800/40 text-xs text-emerald-300/90 font-light leading-relaxed">
                  Open this link on your Android phone in <strong>Chrome</strong>, tap the <strong>3 dots (⋮)</strong> at the top right, then select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </div>
              )}
            </div>

            {/* Option 2: 1-Click APK via PWABuilder */}
            <div className="p-4 rounded-2xl bg-[#041911] border border-emerald-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FileArchive className="w-4 h-4 text-teal-400" />
                  <span>Option 2: Download Standalone .APK (Free)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-teal-300">
                  Free .apk Generator
                </span>
              </div>
              <p className="text-xs text-emerald-400/80 font-light leading-relaxed">
                Microsoft's free official PWABuilder turns this web app into a signed standalone <code className="text-emerald-300">.apk</code> file in seconds at zero cost:
              </p>

              <ol className="list-decimal list-inside space-y-1 text-xs text-emerald-300/90 font-light pl-1">
                <li>Visit <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-medium">pwabuilder.com</a> (completely free tool)</li>
                <li>Paste the app URL below and click <strong>Start</strong></li>
                <li>Click <strong>Package for Android</strong> &gt; <strong>Download APK</strong></li>
              </ol>

              {/* Copy URL Box */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-[#03130d] border border-emerald-800/50 rounded-xl px-3 py-1.5 text-[11px] font-mono text-emerald-300 focus:outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/60 border border-emerald-600/50 text-emerald-200 text-xs flex items-center gap-1 transition-all"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* iOS Safari Info */}
            {isIOS && (
              <div className="p-3.5 rounded-2xl bg-[#03130d] border border-emerald-800/40 text-xs text-emerald-400/90 space-y-1">
                <span className="font-semibold text-emerald-200 block">For iPhone / iPad (iOS):</span>
                <span>Tap the <strong>Share</strong> button in Safari toolbar, scroll down, and tap <strong>Add to Home Screen</strong>.</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-emerald-900/50 flex items-center justify-between">
          <span className="text-[11px] text-emerald-600 font-light flex items-center gap-1">
            <TulipIcon variant="simple" size={12} className="text-emerald-500" />
            <span>Only us for Srishti</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-emerald-800 text-emerald-400 hover:text-emerald-200 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
