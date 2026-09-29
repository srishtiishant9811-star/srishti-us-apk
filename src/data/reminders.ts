import { Reminder } from '../types';

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Hydration break & stretch',
    time: '11:00 AM',
    category: 'Self Care',
    completed: false,
    ishantNudge: 'Ek glass thanda ya warm paani piyo aur shoulders ko halka rotate karo Srishti.',
    createdAt: '2026-09-29T08:00:00Z',
  },
  {
    id: 'rem-2',
    title: '20-Minute Screen Rest & Eye Care',
    time: '04:00 PM',
    category: 'Rest',
    completed: false,
    ishantNudge: 'Aankhon ko thoda aaram do. Look outside the window at something green for 20 seconds.',
    createdAt: '2026-09-29T08:00:00Z',
  },
  {
    id: 'rem-3',
    title: 'Evening unwind & favorite music',
    time: '08:30 PM',
    category: 'Daily Routine',
    completed: false,
    ishantNudge: 'Put on "Love Me Like You Do", dim the room lights, and take a deep relaxing breath.',
    createdAt: '2026-09-29T08:00:00Z',
  },
];
