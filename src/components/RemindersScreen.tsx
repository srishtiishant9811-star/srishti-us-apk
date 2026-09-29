import React, { useState } from 'react';
import { Bell, Plus, CheckCircle2, Circle, Trash2, Clock, Calendar, Sparkles, X } from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { Reminder } from '../types';

interface RemindersScreenProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00 PM');
  const [category, setCategory] = useState<Reminder['category']>('Self Care');
  const [ishantNudge, setIshantNudge] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      time: time.trim() || 'Whenever possible',
      category,
      completed: false,
      ishantNudge:
        ishantNudge.trim() ||
        'Take a calm pause, Srishti. Main hoon yahan aapko remind karne ke liye.',
    });

    setTitle('');
    setTime('12:00 PM');
    setIshantNudge('');
    setIsModalOpen(false);
  };

  const pendingReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241a] via-[#051c14] to-[#03110c] border border-emerald-800/40 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs mb-3">
              <Bell className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold tracking-wider uppercase text-[10px]">
                Gentle Reminders
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-emerald-100 font-semibold tracking-tight">
              Reminders with Ishant
            </h1>
            <p className="text-emerald-300/80 text-sm mt-1.5 max-w-xl font-light leading-relaxed">
              Quiet, gentle nudges for your water, rest, medication, and special moments.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </section>

      {/* Pending Reminders List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 px-1">
          Active Reminders ({pendingReminders.length})
        </h3>

        {pendingReminders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#041610] border border-emerald-800/30 text-center text-emerald-400/80">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-serif-luxury text-emerald-200 text-base">
              All caught up for now, Srishti!
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              No pending tasks. Take a deep breath and relax.
            </p>
          </div>
        ) : (
          pendingReminders.map((rem) => (
            <div
              key={rem.id}
              className="group rounded-2xl bg-[#051c14] border border-emerald-800/40 hover:border-emerald-600/50 p-4 transition-all shadow-md flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className="mt-0.5 text-emerald-600 hover:text-emerald-400 transition-colors"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/40 text-emerald-300">
                      {rem.category}
                    </span>
                    <span className="text-xs text-sky-400/90 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {rem.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-emerald-100">{rem.title}</h4>
                  <p className="text-xs text-emerald-400/80 mt-1 font-light italic">
                    "{rem.ishantNudge}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDeleteReminder(rem.id)}
                className="p-1.5 rounded-lg text-emerald-600 hover:text-rose-400 transition-colors"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-3 pt-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 px-1">
            Completed ({completedReminders.length})
          </h3>

          {completedReminders.map((rem) => (
            <div
              key={rem.id}
              className="rounded-2xl bg-[#03130d]/80 border border-emerald-900/30 p-3.5 flex items-center justify-between gap-3 opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className="text-emerald-400"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-xs line-through text-emerald-300/80">{rem.title}</span>
                  <span className="text-[10px] text-emerald-600 ml-2">{rem.time}</span>
                </div>
              </div>

              <button
                onClick={() => onDeleteReminder(rem.id)}
                className="p-1 text-emerald-600 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#07241a] to-[#03130d] border border-emerald-600/50 p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:text-emerald-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-sky-400" />
              <h2 className="font-serif-luxury text-xl font-bold text-emerald-100">
                New Reminder
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drink water, Take a 15-min walk, Evening tea..."
                  className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-3 text-xs text-emerald-100 placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 05:00 PM"
                    className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400"
                  >
                    {['Self Care', 'Health', 'Rest', 'Special', 'Daily Routine'].map((c) => (
                      <option key={c} value={c} className="bg-[#051c14]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                  Ishant's Caring Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={ishantNudge}
                  onChange={(e) => setIshantNudge(e.target.value)}
                  placeholder="What gentle message should Ishant say?"
                  className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-3 text-xs text-emerald-100 placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-emerald-800 text-emerald-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
