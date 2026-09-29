import { Memory } from '../types';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'A Moment of Pure Quiet',
    category: 'Thought & Reflection',
    date: '2026-09-28',
    description: 'Took a quiet walk in the late afternoon. The breeze felt cool and everything seemed to pause for a few precious minutes.',
    mood: 'Peaceful',
    includeInContext: true,
    createdAt: '2026-09-28T16:30:00Z',
  },
  {
    id: 'mem-2',
    title: 'Favorite Evening Tea & Laughter',
    category: 'Special Moment',
    date: '2026-09-25',
    description: 'Shared warm tea, hot snacks, and endless silly jokes that left our stomachs hurting from laughing so hard.',
    mood: 'Happy',
    includeInContext: true,
    createdAt: '2026-09-25T19:00:00Z',
  },
];
