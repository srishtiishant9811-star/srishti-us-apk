import React from 'react';
import { Home, MessageCircle, Heart, BookOpen, Sparkles, Bell } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Ishant',
      icon: MessageCircle,
      badge: 'AI',
    },
    {
      id: 'favourites' as ActiveTab,
      label: 'Favourites',
      icon: Heart,
    },
    {
      id: 'memory' as ActiveTab,
      label: 'Memory',
      icon: BookOpen,
    },
    {
      id: 'care' as ActiveTab,
      label: 'Care Mode',
      icon: Sparkles,
    },
    {
      id: 'reminders' as ActiveTab,
      label: 'Reminders',
      icon: Bell,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none pb-2 sm:pb-3 px-3">
      <div className="max-w-md mx-auto pointer-events-auto backdrop-blur-2xl bg-[#03150f]/90 border border-emerald-800/40 rounded-3xl p-1.5 shadow-2xl shadow-emerald-950/80">
        <div className="grid grid-cols-6 items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-gradient-to-b from-emerald-800/60 to-emerald-900/40 text-emerald-200 border border-emerald-500/40 shadow-sm'
                    : 'text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110 text-emerald-300 stroke-[2.2]' : 'scale-100 stroke-[1.8]'
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-bold px-1 rounded-full bg-emerald-500 text-[#04100c]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] mt-1 font-medium tracking-tight truncate max-w-full ${
                    isActive ? 'text-emerald-200 font-semibold' : 'text-emerald-500/80'
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
