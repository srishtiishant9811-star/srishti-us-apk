import { generateIshantResponse } from './ishantEngine';

const BASE_URL =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'file:' ||
    (window.location.hostname === 'localhost' && window.location.port !== '3000'))
    ? 'https://ais-pre-nghvkeooyypfw5ultpkddb-963600186660.asia-east1.run.app'
    : '';

export interface ChatRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; text: string }>;
  context?: string;
}

export async function sendChatMessage(req: ChatRequest): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch (error) {
    console.warn('Network chat fallback to instant local Ishant engine:', error);
  }

  // Instant zero-latency offline reply
  return generateIshantResponse(req.message, req.history as any, req.context);
}

export async function fetchDailyThought(timeOfDay: string, mood?: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/api/daily-thought`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeOfDay, mood }),
    });
    if (!res.ok) throw new Error('Failed to fetch daily thought');
    const data = await res.json();
    return data.thought;
  } catch {
    return "Aaj ka din shant aur sukoon bhara ho Srishti. Remember to breathe and take care of yourself.";
  }
}

export async function fetchCareCheckin(mood: string, notes?: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/api/care-checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, notes }),
    });
    if (!res.ok) throw new Error('Care checkin failed');
    const data = await res.json();
    return data.advice;
  } catch {
    return "Srishti, ek gehri saans lijiye. Have a glass of warm water, stretch gently, and remember you don't have to carry everything at once.";
  }
}

export async function fetchFavouriteInsight(itemTitle: string, itemCategory: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/api/favourite-insight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemTitle, itemCategory }),
    });
    if (!res.ok) throw new Error('Insight failed');
    const data = await res.json();
    return data.insight;
  } catch {
    return `${itemTitle} holds a special place in your heart, Srishti!`;
  }
}
