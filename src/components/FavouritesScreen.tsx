import React, { useState } from 'react';
import {
  Utensils,
  Palette,
  Film,
  Tv,
  Sun,
  Music,
  Compass,
  Gamepad2,
  Flame,
  Sparkles,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
  X,
  Edit3,
  Check,
  Search,
} from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { FavouriteItem } from '../types';
import { audioService } from '../services/audio';

interface FavouritesScreenProps {
  favourites: FavouriteItem[];
  onUpdateFavourite: (updated: FavouriteItem) => void;
  onTalkAboutFavourite: (prompt: string) => void;
}

export const FavouritesScreen: React.FC<FavouritesScreenProps> = ({
  favourites,
  onUpdateFavourite,
  onTalkAboutFavourite,
}) => {
  const [selectedItem, setSelectedItem] = useState<FavouriteItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPersonalNote, setEditingPersonalNote] = useState(false);
  const [personalNoteInput, setPersonalNoteInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Helper to render distinct icons
  const renderIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Tulip':
        return <TulipIcon variant="logo" size={26} className={className} />;
      case 'Utensils':
        return <Utensils className={className} />;
      case 'Palette':
        return <Palette className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Film':
        return <Film className={className} />;
      case 'Tv':
        return <Tv className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Music':
        return <Music className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      default:
        return <Heart className={className} />;
    }
  };

  const filteredItems = favourites.filter(
    (item) =>
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDetail = (item: FavouriteItem) => {
    setSelectedItem(item);
    setPersonalNoteInput(item.personalUserNote || '');
    setEditingPersonalNote(false);
    setIsPlayingAudio(false);
  };

  const closeDetail = () => {
    audioService.stopSpeaking();
    setIsPlayingAudio(false);
    setSelectedItem(null);
  };

  const savePersonalNote = () => {
    if (!selectedItem) return;
    const updated: FavouriteItem = {
      ...selectedItem,
      personalUserNote: personalNoteInput.trim(),
    };
    onUpdateFavourite(updated);
    setSelectedItem(updated);
    setEditingPersonalNote(false);
  };

  const toggleSpeakIshantNote = (text: string) => {
    if (isPlayingAudio) {
      audioService.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioService.speak(text, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#092b1f] via-[#051c14] to-[#03110c] border border-emerald-700/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
            <span className="font-semibold tracking-wider uppercase text-[10px]">
              Private Collection
            </span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-emerald-100 font-semibold tracking-tight">
            Srishti's Favourites
          </h1>
          <p className="text-emerald-300/80 text-sm mt-1.5 max-w-xl font-light leading-relaxed">
            The distinct tastes, cherished memories, flavors, and melodies that bring joy and calm to
            Srishti. Separate from general memory, carefully kept in the Only us sanctuary.
          </p>

          {/* Search bar */}
          <div className="mt-4 relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search favourites (e.g. Momos, Green, Tulip, Song)..."
              className="w-full bg-[#03140e]/90 border border-emerald-700/40 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-emerald-100 placeholder-emerald-600/70 focus:outline-none focus:border-emerald-400"
            />
            <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => openDetail(item)}
            className="group relative cursor-pointer text-left p-5 rounded-3xl bg-[#051c14]/90 hover:bg-[#08291e] border border-emerald-800/40 hover:border-emerald-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-950/60 active:scale-[0.99]"
          >
            {/* Top row: Category badge and Icon */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/90 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50">
                  {item.category}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform shadow-inner">
                  {renderIcon(item.iconName, 'w-5 h-5 text-emerald-300')}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif-luxury text-xl font-semibold text-emerald-100 group-hover:text-emerald-300 transition-colors">
                {item.value}
              </h3>
              <p className="text-xs text-emerald-400/70 mt-1 line-clamp-2 leading-relaxed font-light">
                {item.tagline}
              </p>
            </div>

            {/* Bottom row: Ishant's Note snippet */}
            <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs">
              <span className="text-emerald-500/90 italic line-clamp-1 text-[11px]">
                "{item.ishantNote}"
              </span>
              <span className="text-emerald-400 font-medium text-[11px] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2">
                Explore →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal / Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#07241a] via-[#051c14] to-[#03130d] border border-emerald-600/50 p-6 md:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={closeDetail}
              className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:text-emerald-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 p-2 flex items-center justify-center border border-emerald-600/50 shadow-lg">
                {renderIcon(selectedItem.iconName, 'w-7 h-7 text-emerald-200')}
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/50">
                  {selectedItem.category}
                </span>
                <h2 className="font-serif-luxury text-2xl font-bold text-emerald-100 mt-0.5">
                  {selectedItem.value}
                </h2>
              </div>
            </div>

            <p className="text-xs text-emerald-300/80 font-light leading-relaxed border-b border-emerald-900/50 pb-4">
              {selectedItem.tagline}
            </p>

            {/* Story & Essence */}
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                  Why It’s Special
                </h4>
                <p className="text-sm text-emerald-100/90 leading-relaxed font-light bg-[#03140e]/70 p-3 rounded-2xl border border-emerald-800/40">
                  {selectedItem.detailStory}
                </p>
              </div>

              {/* Ishant's Note with Audio Listen */}
              <div className="rounded-2xl bg-[#06241b] border border-emerald-700/50 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <TulipIcon variant="simple" size={16} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-200">
                      Ishant's Note on this
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSpeakIshantNote(selectedItem.ishantNote)}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-200"
                  >
                    {isPlayingAudio ? (
                      <VolumeX className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed italic">
                  "{selectedItem.ishantNote}"
                </p>
              </div>

              {/* Srishti's Personal Note */}
              <div className="rounded-2xl bg-[#03130d] border border-emerald-800/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-300">
                    Srishti’s Private Note
                  </span>
                  {!editingPersonalNote ? (
                    <button
                      onClick={() => setEditingPersonalNote(true)}
                      className="text-xs text-emerald-400 hover:text-emerald-200 flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{selectedItem.personalUserNote ? 'Edit note' : '+ Add personal note'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={savePersonalNote}
                      className="text-xs text-emerald-300 hover:text-emerald-100 flex items-center gap-1 font-semibold"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  )}
                </div>

                {editingPersonalNote ? (
                  <textarea
                    value={personalNoteInput}
                    onChange={(e) => setPersonalNoteInput(e.target.value)}
                    placeholder="Add your own private memory or thought about this favourite..."
                    rows={3}
                    className="w-full bg-[#051c14] border border-emerald-700/60 rounded-xl p-2.5 text-xs text-emerald-100 placeholder-emerald-600/70 focus:outline-none focus:border-emerald-400"
                  />
                ) : selectedItem.personalUserNote ? (
                  <p className="text-xs text-emerald-200 font-light leading-relaxed">
                    {selectedItem.personalUserNote}
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600 italic font-light">
                    No personal note added yet. Tap edit to write a thought here.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions: Talk to Ishant */}
            <div className="mt-6 pt-4 border-t border-emerald-900/50 flex items-center justify-end gap-3">
              <button
                onClick={closeDetail}
                className="px-4 py-2.5 rounded-xl border border-emerald-800/60 text-emerald-400 hover:text-emerald-200 text-xs font-medium"
              >
                Close
              </button>

              <button
                onClick={() => {
                  closeDetail();
                  onTalkAboutFavourite(selectedItem.chatPrompt);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/60"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Talk to Ishant about this</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
