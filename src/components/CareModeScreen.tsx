import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Droplets,
  Wind,
  Moon,
  Volume2,
  VolumeX,
  RefreshCw,
  Send,
  Coffee,
  Eye,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { audioService } from '../services/audio';
import { fetchCareCheckin } from '../services/api';

export const CareModeScreen: React.FC = () => {
  // Breathing exercise state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Ambient sound state
  const [ambientType, setAmbientType] = useState<string | null>(audioService.getAmbientType());

  // Mood check-in state
  const [selectedMood, setSelectedMood] = useState<string>('Tired');
  const [moodNotes, setMoodNotes] = useState('');
  const [careAdvice, setCareAdvice] = useState<string>(
    'Srishti, ek gehri saans lijiye. Have a warm glass of water, relax your shoulders, and take things one gentle step at a time.'
  );
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Daily self-care habits log
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [habits, setHabits] = useState([
    { id: 1, text: 'Drank 4+ glasses of water', done: true },
    { id: 2, text: 'Rested eyes from screen for 10 mins', done: false },
    { id: 3, text: 'Gentle neck & shoulder stretches', done: false },
    { id: 4, text: 'Listened to "Love Me Like You Do" or calming audio', done: false },
  ]);

  // Breathing cycle runner (4-7-8 breathing)
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // switch phase
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              return 4;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const handleToggleBreathing = () => {
    if (isBreathingActive) {
      setIsBreathingActive(false);
      setBreathPhase('Inhale');
      setBreathTimer(4);
    } else {
      setIsBreathingActive(true);
      setBreathPhase('Inhale');
      setBreathTimer(4);
      audioService.playGentleChime();
    }
  };

  const handleToggleSound = (type: 'rain' | 'breeze' | 'bowl') => {
    const isPlaying = audioService.toggleAmbientSound(type);
    setAmbientType(isPlaying ? type : null);
  };

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAdvice(true);
    try {
      const advice = await fetchCareCheckin(selectedMood, moodNotes);
      setCareAdvice(advice);
      setMoodNotes('');
    } catch {
      // fallback
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06291d] via-[#041d15] to-[#02110c] border border-emerald-700/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold tracking-wider uppercase text-[10px]">
              Care & Comfort
            </span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-emerald-100 font-semibold tracking-tight">
            Care Mode with Ishant
          </h1>
          <p className="text-emerald-300/80 text-sm mt-1.5 max-w-xl font-light leading-relaxed">
            A serene sanctuary to release tension, steady your breath, track hydration, and receive
            gentle words of support.
          </p>
        </div>
      </section>

      {/* Guided 4-7-8 Breathing Circle */}
      <section className="rounded-3xl bg-gradient-to-b from-[#051c14] to-[#03130d] border border-emerald-800/40 p-6 sm:p-8 shadow-xl text-center">
        <h3 className="font-serif-luxury text-xl font-semibold text-emerald-100 mb-1">
          4-7-8 Serene Breathing
        </h3>
        <p className="text-xs text-emerald-400/80 max-w-md mx-auto font-light mb-6">
          Inhale serenity for 4s, hold for 7s, and gently release all fatigue for 8s.
        </p>

        {/* Dynamic Expanding/Contracting Circle */}
        <div className="relative w-52 h-52 mx-auto flex items-center justify-center my-4">
          {/* Animated glow rings */}
          <div
            className={`absolute inset-0 rounded-full bg-emerald-500/10 transition-all duration-1000 ${
              isBreathingActive && breathPhase === 'Inhale'
                ? 'scale-110 opacity-70'
                : isBreathingActive && breathPhase === 'Hold'
                ? 'scale-105 opacity-50'
                : 'scale-90 opacity-20'
            }`}
          />

          <div
            className={`w-40 h-40 rounded-full border-2 flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
              isBreathingActive
                ? breathPhase === 'Inhale'
                  ? 'border-emerald-400 bg-emerald-900/40 scale-105 shadow-emerald-500/30'
                  : breathPhase === 'Hold'
                  ? 'border-teal-400 bg-teal-900/40 scale-100 shadow-teal-500/20'
                  : 'border-emerald-600 bg-emerald-950/60 scale-90 shadow-emerald-950/40'
                : 'border-emerald-700/50 bg-[#041911]'
            }`}
          >
            <TulipIcon variant="simple" size={24} className="text-emerald-400 mb-1" />
            <span className="text-base font-semibold tracking-wider uppercase text-emerald-100">
              {isBreathingActive ? breathPhase : 'Ready'}
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1">
              {isBreathingActive ? `${breathTimer}s` : 'Tap Start'}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleBreathing}
          className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg active:scale-95 ${
            isBreathingActive
              ? 'bg-rose-950/80 border border-rose-700 text-rose-200 hover:bg-rose-900'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/60'
          }`}
        >
          {isBreathingActive ? 'Stop Exercise' : 'Start Breathing Exercise'}
        </button>
      </section>

      {/* Mood Check-In & Ishant's Comfort */}
      <section className="rounded-3xl bg-[#051c14] border border-emerald-800/40 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
            <h3 className="font-serif-luxury text-lg font-semibold text-emerald-100">
              How are you feeling right now, Srishti?
            </h3>
          </div>
          <span className="text-xs text-emerald-500">Private check-in</span>
        </div>

        {/* Mood Pills */}
        <div className="flex flex-wrap gap-2">
          {['Tired', 'Overwhelmed', 'Serene', 'Happy', 'Need Comfort', 'Reflective'].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
                selectedMood === mood
                  ? 'bg-emerald-600 border-emerald-400 text-white font-semibold shadow-md'
                  : 'bg-[#03140e] border-emerald-800/50 text-emerald-300/80 hover:bg-emerald-900/40'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        <form onSubmit={handleMoodSubmit} className="space-y-3">
          <textarea
            value={moodNotes}
            onChange={(e) => setMoodNotes(e.target.value)}
            rows={2}
            placeholder="Want to write down what's on your mind? (Optional)..."
            className="w-full bg-[#03140e] border border-emerald-700/50 rounded-2xl p-3 text-xs text-emerald-100 placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
          />

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoadingAdvice}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-emerald-950/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAdvice ? 'animate-spin' : ''}`} />
              <span>Ask Ishant for advice</span>
            </button>
          </div>
        </form>

        {/* Ishant's Guidance Output Card */}
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-[#07261c] to-[#041710] border border-emerald-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TulipIcon variant="simple" size={16} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-200">
                Ishant's Comfort for Srishti
              </span>
            </div>
            <button
              onClick={() => audioService.speak(careAdvice)}
              className="text-xs text-emerald-400 hover:text-emerald-200 flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read aloud</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed italic font-light">
            "{careAdvice}"
          </p>
        </div>
      </section>

      {/* Ambient Soundscapes */}
      <section className="rounded-3xl bg-[#051c14] border border-emerald-800/40 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif-luxury text-base font-semibold text-emerald-100">
              Calm Ambient Soundscapes
            </h3>
          </div>
          {ambientType && (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 animate-pulse">
              Playing {ambientType}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleToggleSound('rain')}
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              ambientType === 'rain'
                ? 'bg-emerald-800/50 border-emerald-400 text-emerald-100 shadow-md'
                : 'bg-[#03140e] border-emerald-800/50 text-emerald-400/80 hover:bg-emerald-900/30'
            }`}
          >
            <Droplets className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
            <span className="text-xs font-medium block">Gentle Rain</span>
            <span className="text-[9px] text-emerald-500 block">Soft shower</span>
          </button>

          <button
            onClick={() => handleToggleSound('breeze')}
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              ambientType === 'breeze'
                ? 'bg-emerald-800/50 border-emerald-400 text-emerald-100 shadow-md'
                : 'bg-[#03140e] border-emerald-800/50 text-emerald-400/80 hover:bg-emerald-900/30'
            }`}
          >
            <Wind className="w-5 h-5 mx-auto mb-1 text-teal-400" />
            <span className="text-xs font-medium block">Forest Breeze</span>
            <span className="text-[9px] text-emerald-500 block">Deep resonance</span>
          </button>

          <button
            onClick={() => handleToggleSound('bowl')}
            className={`p-3.5 rounded-2xl border text-center transition-all ${
              ambientType === 'bowl'
                ? 'bg-emerald-800/50 border-emerald-400 text-emerald-100 shadow-md'
                : 'bg-[#03140e] border-emerald-800/50 text-emerald-400/80 hover:bg-emerald-900/30'
            }`}
          >
            <Moon className="w-5 h-5 mx-auto mb-1 text-amber-400" />
            <span className="text-xs font-medium block">Singing Bowl</span>
            <span className="text-[9px] text-emerald-500 block">Pure harmony</span>
          </button>
        </div>
      </section>

      {/* Hydration & Gentle Habits */}
      <section className="rounded-3xl bg-[#051c14] border border-emerald-800/40 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-400" />
            <h3 className="font-serif-luxury text-base font-semibold text-emerald-100">
              Hydration & Daily Care
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-300 font-semibold">{waterGlasses} Glasses Today</span>
            <button
              onClick={() => setWaterGlasses((prev) => prev + 1)}
              className="px-2 py-0.5 rounded-lg bg-sky-950 border border-sky-700 text-sky-200 text-xs font-bold hover:bg-sky-900"
            >
              +1 Glass
            </button>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="cursor-pointer flex items-center justify-between p-3 rounded-2xl bg-[#03140e] border border-emerald-800/40 hover:border-emerald-600/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {habit.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-emerald-700" />
                )}
                <span
                  className={`text-xs ${
                    habit.done ? 'line-through text-emerald-500/70' : 'text-emerald-200'
                  }`}
                >
                  {habit.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
