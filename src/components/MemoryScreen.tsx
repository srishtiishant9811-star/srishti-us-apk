import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Share2,
  Info,
} from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { Memory } from '../types';

interface MemoryScreenProps {
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  onUpdateMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
}

const CATEGORIES: Memory['category'][] = [
  'Special Moment',
  'Thought & Reflection',
  'Milestone',
  'Inside Joke',
  'Future Dream',
  'Personal Note',
];

const MOODS = ['Peaceful', 'Happy', 'Grateful', 'Thoughtful', 'Cozy', 'Inspired'];

export const MemoryScreen: React.FC<MemoryScreenProps> = ({
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Memory['category']>('Special Moment');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('Peaceful');
  const [includeInContext, setIncludeInContext] = useState(true);

  const openAddModal = () => {
    setEditingMemory(null);
    setTitle('');
    setCategory('Special Moment');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setMood('Peaceful');
    setIncludeInContext(true);
    setIsModalOpen(true);
  };

  const openEditModal = (mem: Memory) => {
    setEditingMemory(mem);
    setTitle(mem.title);
    setCategory(mem.category);
    setDate(mem.date);
    setDescription(mem.description);
    setMood(mem.mood || 'Peaceful');
    setIncludeInContext(mem.includeInContext);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editingMemory) {
      onUpdateMemory({
        ...editingMemory,
        title: title.trim(),
        category,
        date,
        description: description.trim(),
        mood,
        includeInContext,
      });
    } else {
      onAddMemory({
        title: title.trim(),
        category,
        date,
        description: description.trim(),
        mood,
        includeInContext,
      });
    }

    setIsModalOpen(false);
  };

  const filteredMemories = memories.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.mood && m.mood.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241a] via-[#051c14] to-[#03110c] border border-emerald-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs mb-3">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold tracking-wider uppercase text-[10px]">
                Personal Memory
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-emerald-100 font-semibold tracking-tight">
              Srishti's Memories
            </h1>
            <p className="text-emerald-300/80 text-sm mt-1.5 max-w-xl font-light leading-relaxed">
              Your private sanctuary for reflections, special memories, milestones, and thoughts.
              Stored locally on your device.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Memory</span>
          </button>
        </div>

        {/* Distinction Notice */}
        <div className="mt-5 p-3 rounded-2xl bg-[#03130d]/80 border border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-400/80">
          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Memories here are your personal log of moments. Srishti's
            Favourites (Chole Bhature, Tulips, Thailand, etc.) is preserved as a separate dedicated
            section.
          </span>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories by title or thought..."
            className="w-full bg-[#051c14] border border-emerald-800/40 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-emerald-100 placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
          />
          <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
        </div>

        {/* Categories scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-emerald-700 text-emerald-50 font-semibold'
                : 'bg-emerald-950/50 text-emerald-400/80 border border-emerald-800/40 hover:bg-emerald-900/40'
            }`}
          >
            All ({memories.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-emerald-50 font-semibold'
                  : 'bg-emerald-950/50 text-emerald-400/80 border border-emerald-800/40 hover:bg-emerald-900/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memories List */}
      {filteredMemories.length === 0 ? (
        <div className="rounded-3xl bg-[#041610] border border-emerald-800/30 p-10 text-center text-emerald-400/80">
          <BookOpen className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-serif-luxury text-lg text-emerald-200">No memories found</h3>
          <p className="text-xs text-emerald-500 max-w-sm mx-auto mt-1">
            {searchQuery
              ? 'Try adjusting your search keywords or filter category.'
              : 'Add your first memory, cherished moment, or thought above.'}
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/60 text-emerald-100 text-xs font-medium"
          >
            + Add Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="group relative rounded-3xl bg-[#051c14] border border-emerald-800/40 hover:border-emerald-600/50 p-5 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/40 text-emerald-300">
                      {mem.category}
                    </span>
                    {mem.mood && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800/40 text-teal-300">
                        {mem.mood}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-emerald-500/80 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{mem.date}</span>
                  </div>
                </div>

                <h3 className="font-serif-luxury text-lg font-semibold text-emerald-100 group-hover:text-emerald-300 transition-colors">
                  {mem.title}
                </h3>
                <p className="text-xs text-emerald-300/80 mt-2 font-light leading-relaxed whitespace-pre-wrap">
                  {mem.description}
                </p>
              </div>

              {/* Footer: Context badge & Action Buttons */}
              <div className="mt-5 pt-3 border-t border-emerald-900/40 flex items-center justify-between">
                <button
                  onClick={() =>
                    onUpdateMemory({
                      ...mem,
                      includeInContext: !mem.includeInContext,
                    })
                  }
                  className={`text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
                    mem.includeInContext
                      ? 'bg-emerald-950 border border-emerald-700/50 text-emerald-300'
                      : 'text-emerald-600 hover:text-emerald-400'
                  }`}
                  title="When active, Ishant knows this memory during AI Chat"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{mem.includeInContext ? 'Shared with Ishant' : 'Private to notes'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(mem)}
                    className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900/50 transition-colors"
                    title="Edit memory"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${mem.title}"?`)) {
                        onDeleteMemory(mem.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-emerald-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#07241a] via-[#051c14] to-[#03130d] border border-emerald-600/50 p-6 md:p-7 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:text-emerald-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <TulipIcon variant="simple" size={20} className="text-emerald-400" />
              <h2 className="font-serif-luxury text-xl font-bold text-emerald-100">
                {editingMemory ? 'Edit Memory' : 'Add New Memory'}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. A walk in the rain, Evening tea conversation..."
                  className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-3 text-xs text-emerald-100 placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#051c14] text-emerald-100">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-2.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                  Mood / Feeling
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMood(m)}
                      className={`text-xs px-3 py-1 rounded-xl transition-all ${
                        mood === m
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/40'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                  Description / Personal Note
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What made this moment or thought special to you?"
                  className="w-full bg-[#03140e] border border-emerald-700/50 rounded-xl p-3 text-xs text-emerald-100 placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Context Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#03140e] border border-emerald-800/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-medium text-emerald-200">
                      Share with Ishant AI
                    </span>
                    <p className="text-[10px] text-emerald-500">
                      Ishant can gently recall this in your private chats.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeInContext}
                  onChange={(e) => setIncludeInContext(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-emerald-800 text-emerald-400 text-xs hover:text-emerald-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-950/50"
                >
                  {editingMemory ? 'Save Changes' : 'Add Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
