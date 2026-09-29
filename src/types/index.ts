export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isVoiceInput?: boolean;
}

export interface Memory {
  id: string;
  title: string;
  category: 'Special Moment' | 'Thought & Reflection' | 'Milestone' | 'Inside Joke' | 'Future Dream' | 'Personal Note';
  date: string;
  description: string;
  mood?: string;
  includeInContext: boolean;
  createdAt: string;
}

export interface FavouriteItem {
  id: string;
  category: string;
  value: string;
  tagline: string;
  iconName: string;
  colorAccent: string;
  ishantNote: string;
  detailStory: string;
  chatPrompt: string;
  personalUserNote?: string;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  category: 'Self Care' | 'Health' | 'Rest' | 'Special' | 'Daily Routine';
  completed: boolean;
  ishantNudge: string;
  createdAt: string;
}

export interface CareMoodLog {
  id: string;
  timestamp: string;
  mood: 'Serene' | 'Happy' | 'Tired' | 'Overwhelmed' | 'Peaceful' | 'Need Comfort';
  note?: string;
  adviceFromIshant?: string;
}

export type ActiveTab = 'home' | 'chat' | 'favourites' | 'memory' | 'care' | 'reminders';
