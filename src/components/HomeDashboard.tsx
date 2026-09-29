import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Heart,
  BookOpen,
  Sparkles,
  Bell,
  Settings,
  Mic,
  ArrowRight,
  RefreshCw,
  Quote,
  Shield,
  Clock,
  Send,
  Download,
} from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { ActiveTab, Memory, Reminder } from '../types';
import { fetchDailyThought } from '../services/api';
import { audioService } from '../services/audio';

interface HomeDashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenVoice: () => void;
  onOpenSettings: () => void;
  onOpenDownload?: () => void;
  onStartChatPrompt: (prompt: string) => void;
  memories: Memory[];
  reminders: Reminder[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenVoice,
  onOpenSettings,
  onOpenDownload,
  onStartChatPrompt,
  memories,
  reminders,
}) => {
  const [greeting, setGreeting] = useState<{ title: string; subtitle: string; timeOfDay: string }>({
    title: 'Hello Srishti',
    subtitle: 'Ishant is right here beside you.',
    timeOfDay: 'day',
  });
  const [dailyThought, setDailyThought] = useState<string>(
    'Srishti, take a slow deep breath today. Sab theek ho jayega, and remember to drink a glass of water!'
  );
  const [isLoadingThought, setIsLoadingThought] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  // Calculate time of day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      setGreeting({
        title: 'Shubh Prabhat, Srishti',
        subtitle: 'May your morning bloom with quiet grace, just like a fresh tulip.',
        timeOfDay: 'morning',
      });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({
        title: 'Good Afternoon, Srishti',
        subtitle: 'Ishant here. Have you taken a short pause to breathe and hydrate?',
        timeOfDay: 'afternoon',
      });
    } else if (hour >= 17 && hour < 22) {
      setGreeting({
        title: 'Shubh Sandhya, Srishti',
        subtitle: 'The day is winding down. Time to leave the rush behind and relax.',
        timeOfDay: 'evening',
      });
    } else {
      setGreeting({
        title: 'Peaceful Night, Srishti',
        subtitle: 'Rest your mind tonight. sab shaant hai, Ishant is watching over your peace.',
        timeOfDay: 'night',
      });
    }

    // Load dynamic thought on first mount
    handleRefreshThought();
  }, []);

  const handleRefreshThought = async () => {
    setIsLoadingThought(true);
    try {
      const thought = await fetchDailyThought(greeting.timeOfDay, 'peaceful');
      setDailyThought(thought);
    } catch {
      // fallback
    } finally {
      setIsLoadingThought(false);
    }
  };

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onStartChatPrompt(quickInput.trim());
    setQuickInput('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Brand & Companion Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#08281d] via-[#051c14] to-[#04120d] border border-emerald-800/40 p-6 md:p-8 shadow-2xl">
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Tag & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-700/40 text-emerald-300 text-xs">
              <TulipIcon variant="simple" size={14} className="text-emerald-400" />
              <span className="font-semibold tracking-wider uppercase text-[10px]">Only us</span>
              <span className="text-emerald-600">•</span>
              <span className="text-emerald-200">Srishti’s Sanctuary</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-600/30 text-emerald-300 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-[11px]">Ishant AI • Active & Listening</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-emerald-400/90 font-medium mb-1">
              Personal AI Companion
            </p>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-emerald-50 font-semibold tracking-tight">
              {greeting.title}
            </h1>
            <p className="text-emerald-200/80 text-sm sm:text-base mt-1.5 max-w-xl font-light">
              {greeting.subtitle}
            </p>
          </div>

          {/* Daily Thought / Check-in Card from Ishant */}
          <div className="relative overflow-hidden rounded-2xl bg-[#03150f]/80 border border-emerald-700/30 p-4 sm:p-5 mt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium">
                <Quote className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ishant’s Daily Note for Srishti</span>
              </div>
              <button
                onClick={handleRefreshThought}
                disabled={isLoadingThought}
                title="Get another note from Ishant"
                className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 hover:text-emerald-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingThought ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed italic font-light">
              "{dailyThought}"
            </p>

            <div className="mt-3 pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  audioService.speak(dailyThought);
                }}
                className="text-emerald-400 hover:text-emerald-200 flex items-center gap-1 font-medium"
              >
                Listen to Ishant speak this
              </button>
              <button
                onClick={() => onStartChatPrompt(`Ishant, about your daily note: "${dailyThought}"...`)}
                className="text-emerald-300 hover:text-emerald-100 flex items-center gap-1 underline decoration-emerald-700 underline-offset-4"
              >
                Reply in Chat <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Chat Input Box inside Hero */}
          <form onSubmit={handleQuickSend} className="mt-4 relative flex items-center">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Talk to Ishant... (English, Hindi, Hinglish)"
              className="w-full bg-[#03140e]/95 border border-emerald-700/50 rounded-2xl py-3 pl-4 pr-12 text-sm text-emerald-100 placeholder-emerald-600/70 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white disabled:opacity-40 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-sm"
              title="Send to Ishant"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Voice Mode Feature Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#06241a] via-[#083023] to-[#0a382a] border border-emerald-600/40 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 p-0.5 shadow-lg shadow-emerald-900/50">
                <div className="w-full h-full bg-[#04150f] rounded-2xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-emerald-100">Voice Mode with Ishant</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/50 border border-emerald-500/40 text-emerald-300">
                  Ready
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Speak freely in Hinglish, Hindi, or English. Ishant responds gently with voice audio.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVoice}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#02100a] font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Start Voice Session</span>
          </button>
        </div>
      </section>

      {/* Download ZIP / Install APK Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-[#041a13] via-[#052219] to-[#041a13] border border-emerald-700/40 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-300 flex-shrink-0">
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-emerald-100">
                Download Free ZIP or Install on Phone
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-900 border border-emerald-500/50 text-emerald-300">
                100% Free
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/80 font-light">
              Get the complete source code archive or install Only us directly on your phone with zero fees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/only-us.zip"
            download="only-us-app.zip"
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Free ZIP</span>
          </a>

          <button
            onClick={onOpenDownload}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <span>APK Guide</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </button>
        </div>
      </section>

      {/* Primary Shortcuts Grid */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-emerald-400">
            Quick Shortcuts
          </h2>
          <span className="text-xs text-emerald-600">Private & Dedicated</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Chat Shortcut */}
          <button
            onClick={() => onNavigate('chat')}
            className="group relative text-left p-4 rounded-2xl bg-[#061e16]/80 hover:bg-[#08281d] border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-200 shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/50 text-emerald-400">
                Ishant AI
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-100 text-sm group-hover:text-emerald-300 transition-colors">
                AI Chat
              </h4>
              <p className="text-xs text-emerald-400/70 mt-0.5 line-clamp-1">
                Conversation, thoughts & warmth
              </p>
            </div>
          </button>

          {/* Srishti's Favourites Shortcut */}
          <button
            onClick={() => onNavigate('favourites')}
            className="group relative text-left p-4 rounded-2xl bg-gradient-to-br from-[#082a1e] to-[#041a13] hover:from-[#0a3526] hover:to-[#052218] border border-emerald-700/40 hover:border-emerald-500/60 transition-all duration-200 shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/70 border border-emerald-600/50 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-rose-800/40 text-rose-300">
                11 items
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-100 text-sm group-hover:text-emerald-300 transition-colors">
                Srishti's Favourites
              </h4>
              <p className="text-xs text-emerald-400/70 mt-0.5 line-clamp-1">
                Chole Bhature, Tulips, Thailand & more
              </p>
            </div>
          </button>

          {/* Memory Shortcut */}
          <button
            onClick={() => onNavigate('memory')}
            className="group relative text-left p-4 rounded-2xl bg-[#061e16]/80 hover:bg-[#08281d] border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-200 shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/50 text-teal-300">
                {memories.length} notes
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-100 text-sm group-hover:text-emerald-300 transition-colors">
                Memory
              </h4>
              <p className="text-xs text-emerald-400/70 mt-0.5 line-clamp-1">
                Personal reflections & moments
              </p>
            </div>
          </button>

          {/* Care Mode Shortcut */}
          <button
            onClick={() => onNavigate('care')}
            className="group relative text-left p-4 rounded-2xl bg-[#061e16]/80 hover:bg-[#08281d] border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-200 shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-amber-800/40 text-amber-300">
                Breathe & Calm
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-100 text-sm group-hover:text-emerald-300 transition-colors">
                Care Mode
              </h4>
              <p className="text-xs text-emerald-400/70 mt-0.5 line-clamp-1">
                Gentle check-in & calm space
              </p>
            </div>
          </button>

          {/* Reminders Shortcut */}
          <button
            onClick={() => onNavigate('reminders')}
            className="group relative text-left p-4 rounded-2xl bg-[#061e16]/80 hover:bg-[#08281d] border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-200 shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                <Bell className="w-5 h-5 text-sky-400" />
              </div>
              {pendingRemindersCount > 0 ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-950 border border-sky-700/50 text-sky-300">
                  {pendingRemindersCount} pending
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/50 text-emerald-400">
                  All done
                </span>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-emerald-100 text-sm group-hover:text-emerald-300 transition-colors">
                Reminders
              </h4>
              <p className="text-xs text-emerald-400/70 mt-0.5 line-clamp-1">
                Gentle nudges from Ishant
              </p>
            </div>
          </button>

          {/* Settings Shortcut */}
          <button
            onClick={onOpenSettings}
            className="group relative text-left p-4 rounded-2xl bg-[#061e16]/80 hover:bg-[#08281d] border border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-200 shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/50 text-emerald-400">
                Personalize
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-100 text-sm group-hover:text-emerald-300 transition-colors">
                Settings
              </h4>
              <p className="text-xs text-emerald-400/70 mt-0.5 line-clamp-1">
                Language, voice & privacy
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Suggested Conversations with Ishant */}
      <section className="rounded-3xl bg-[#051a13]/70 border border-emerald-800/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-200">Start a conversation with Ishant</h3>
          </div>
          <span className="text-xs text-emerald-500">Tap to ask</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'Kaisi ho Ishant? Kya haal chal?',
            'Suggest a hilarious comedy movie for tonight',
            'Momos craving ho rahi hai!',
            'Tell me a sweet quote about green tulips',
            'Let’s plan an imaginary trip to Thailand',
            'I am feeling a little tired today...',
          ].map((prompt, index) => (
            <button
              key={index}
              onClick={() => onStartChatPrompt(prompt)}
              className="text-left text-xs px-3.5 py-2 rounded-xl bg-[#03140e] hover:bg-emerald-900/40 border border-emerald-800/40 hover:border-emerald-600/50 text-emerald-200 hover:text-emerald-100 transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </section>

      {/* Calm Footnote */}
      <div className="text-center pt-2 text-xs text-emerald-600/80 flex items-center justify-center gap-1.5 font-light">
        <TulipIcon variant="simple" size={13} className="text-emerald-500/70" />
        <span>Only us • Dedicated exclusively to Srishti</span>
      </div>
    </div>
  );
};
