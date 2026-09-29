/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { ChatScreen } from './components/ChatScreen';
import { FavouritesScreen } from './components/FavouritesScreen';
import { MemoryScreen } from './components/MemoryScreen';
import { CareModeScreen } from './components/CareModeScreen';
import { RemindersScreen } from './components/RemindersScreen';
import { VoiceModeModal } from './components/VoiceModeModal';
import { SettingsModal } from './components/SettingsModal';
import { DownloadModal } from './components/DownloadModal';
import { ActiveTab, Message, Memory, FavouriteItem, Reminder } from './types';
import { INITIAL_FAVOURITES } from './data/favourites';
import { INITIAL_MEMORIES } from './data/memories';
import { INITIAL_REMINDERS } from './data/reminders';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string>('');

  // Persistent States
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('only_us_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem('only_us_memories');
      return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [favourites, setFavourites] = useState<FavouriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('only_us_favourites');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all 11 required items exist if schema evolves
        if (Array.isArray(parsed) && parsed.length >= 11) return parsed;
      }
      return INITIAL_FAVOURITES;
    } catch {
      return INITIAL_FAVOURITES;
    }
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('only_us_reminders');
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [voiceReadoutEnabled, setVoiceReadoutEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('only_us_voice_readout');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [preferredLanguage, setPreferredLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem('only_us_pref_lang') || 'Hinglish & Natural';
    } catch {
      return 'Hinglish & Natural';
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('only_us_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('only_us_memories', JSON.stringify(memories));
    } catch {
      // ignore
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('only_us_favourites', JSON.stringify(favourites));
    } catch {
      // ignore
    }
  }, [favourites]);

  useEffect(() => {
    try {
      localStorage.setItem('only_us_reminders', JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem('only_us_voice_readout', JSON.stringify(voiceReadoutEnabled));
    } catch {
      // ignore
    }
  }, [voiceReadoutEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('only_us_pref_lang', preferredLanguage);
    } catch {
      // ignore
    }
  }, [preferredLanguage]);

  // Handlers
  const handleStartChatPrompt = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setActiveTab('chat');
  };

  const handleUpdateFavourite = (updated: FavouriteItem) => {
    setFavourites((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleAddMemory = (newMemory: Omit<Memory, 'id' | 'createdAt'>) => {
    const memory: Memory = {
      ...newMemory,
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setMemories((prev) => [memory, ...prev]);
  };

  const handleUpdateMemory = (updated: Memory) => {
    setMemories((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleAddReminder = (newRem: Omit<Reminder, 'id' | 'createdAt'>) => {
    const reminder: Reminder = {
      ...newRem,
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [reminder, ...prev]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllData = () => {
    setMessages([]);
    localStorage.removeItem('only_us_messages');
  };

  return (
    <div className="min-h-screen bg-[#04100c] text-emerald-50 selection:bg-emerald-700 selection:text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onNavigateHome={() => setActiveTab('home')}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-4 pb-20">
        {activeTab === 'home' && (
          <HomeDashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenDownload={() => setIsDownloadModalOpen(true)}
            onStartChatPrompt={handleStartChatPrompt}
            memories={memories}
            reminders={reminders}
          />
        )}

        {activeTab === 'chat' && (
          <ChatScreen
            messages={messages}
            setMessages={setMessages}
            memories={memories}
            initialPrompt={initialChatPrompt}
            onClearInitialPrompt={() => setInitialChatPrompt('')}
            voiceReadoutEnabled={voiceReadoutEnabled}
          />
        )}

        {activeTab === 'favourites' && (
          <FavouritesScreen
            favourites={favourites}
            onUpdateFavourite={handleUpdateFavourite}
            onTalkAboutFavourite={handleStartChatPrompt}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryScreen
            memories={memories}
            onAddMemory={handleAddMemory}
            onUpdateMemory={handleUpdateMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        )}

        {activeTab === 'care' && <CareModeScreen />}

        {activeTab === 'reminders' && (
          <RemindersScreen
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}
      </main>

      {/* Bottom Floating Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Voice Mode Modal */}
      <VoiceModeModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSendToChatHistory={(userText, assistantReply) => {
          const userMsg: Message = {
            id: `msg-${Date.now()}-u`,
            role: 'user',
            text: userText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isVoiceInput: true,
          };
          const aiMsg: Message = {
            id: `msg-${Date.now()}-a`,
            role: 'assistant',
            text: assistantReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, userMsg, aiMsg]);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        voiceReadoutEnabled={voiceReadoutEnabled}
        setVoiceReadoutEnabled={setVoiceReadoutEnabled}
        preferredLanguage={preferredLanguage}
        setPreferredLanguage={setPreferredLanguage}
        memories={memories}
        favourites={favourites}
        reminders={reminders}
        messages={messages}
        onClearAllData={handleClearAllData}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
      />

      {/* Download ZIP & APK Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
