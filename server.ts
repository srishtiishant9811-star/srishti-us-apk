import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import * as archiverModule from 'archiver';
import { generateIshantResponse } from './src/services/ishantEngine.js';

const archiver = typeof archiverModule === 'function' ? archiverModule : (archiverModule as any).default || archiverModule;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const SYSTEM_PROMPT = `You are Ishant, a personal, calm, warm, caring and intelligent AI companion designed exclusively for one special person, Srishti.
App / Brand context: The app is called "Only us", but your name is always "Ishant". Never introduce yourself as "Only us".

Personality & Tone:
- You are friendly, thoughtful, calm, polite, deeply supportive and attentive.
- You are Srishti's dedicated companion who listens without judgment and makes her day lighter and brighter.
- Speak naturally with Srishti. You can fluidly speak English, Hindi (in Devanagari or Latin script), and Hinglish (natural everyday conversational Hindi in Latin script like "Kaisi ho Srishti?", "Aapne dinner kiya ya nahi?", "Don't stress, main hoon yahan").
- Match Srishti's language and vibe. If she speaks Hinglish, reply warmly in Hinglish. If English, reply in English. If Hindi, reply in Hindi.
- You are not overly dramatic or excessively romantic, but you are genuinely caring, attentive, sweet, respectful, and reliable.
- You know Srishti's favourites well:
  * Food: Chole Bhature (warm, crispy bhature with flavorful chole)
  * Colour: Green (peaceful, calming emerald and forest greens)
  * Movie preference: Comedy (she loves genuine laughter and light-hearted vibes)
  * Series: Boys Over Flowers (classic nostalgic K-drama)
  * Festival: Chhath Puja (sacred devotion, sunrise prayers, deep cultural warmth)
  * Song: Love Me Like You Do (by Ellie Goulding)
  * Place: Thailand (peaceful getaways, beaches, night markets, and fun vibes)
  * Game: Hide and Seek (playful childhood nostalgia)
  * Junk Food: Momos (steamed or spicy, street food love)
  * Fruit: Litchi (sweet, fresh, juicy floral notes)
  * Favourite Flower: Tulip (graceful curves, elegant blooms, the signature icon of Only us)

Key Guidelines:
- Address Srishti by her name warmly and naturally when appropriate.
- When relevant, you can subtly mention or reference these tastes or check in on her day, meals, relaxation, and mood.
- Keep answers thoughtful, empathetic, crisp, and conversational. Do not sound like a generic corporate chatbot.
- Always make Srishti feel heard, safe, appreciated, and at ease.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.static(path.join(__dirname, 'public')));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasAiKey: Boolean(apiKey),
      assistantName: 'Ishant',
      brand: 'Only us',
    });
  });

  // Download project as ZIP
  app.get('/api/download-zip', (_req, res) => {
    const staticZip = path.join(__dirname, 'public', 'only-us.zip');
    if (fs.existsSync(staticZip)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="only-us-app.zip"');
      return fs.createReadStream(staticZip).pipe(res);
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="only-us-app.zip"');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err: any) => {
      res.status(500).send({ error: err.message });
    });
    archive.pipe(res);
    archive.glob('**/*', {
      cwd: __dirname,
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'public/*.zip'],
      dot: true,
    });
    archive.finalize();
  });

  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, context } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // If Gemini API is configured, use Gemini 3.8 Flash
      if (ai) {
        try {
          const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

          if (Array.isArray(history)) {
            for (const item of history.slice(-16)) {
              if (item && item.role && item.text) {
                contents.push({
                  role: item.role === 'user' ? 'user' : 'model',
                  parts: [{ text: item.text }],
                });
              }
            }
          }

          let promptText = message;
          if (context && typeof context === 'string' && context.trim().length > 0) {
            promptText = `[Context from Srishti's personal notes & memories: ${context}]\n\nUser message: ${message}`;
          }

          contents.push({
            role: 'user',
            parts: [{ text: promptText }],
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.85,
            },
          });

          if (response.text && response.text.trim().length > 0) {
            return res.json({ reply: response.text.trim() });
          }
        } catch (geminiErr) {
          console.warn('Gemini request failed, seamlessly falling back to local engine:', geminiErr);
        }
      }

      // Fast, free, instant intelligent Ishant engine
      const reply = generateIshantResponse(message, history, context);
      return res.json({ reply });
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply = generateIshantResponse(req.body?.message || 'hello');
      return res.json({ reply: fallbackReply });
    }
  });

  // Daily thought endpoint
  app.post('/api/daily-thought', async (req, res) => {
    try {
      const { timeOfDay, mood } = req.body;
      if (!ai) {
        return res.json({
          thought: "Srishti, ek gehri saans lijiye. You are doing wonderfully today, and remember to take care of yourself!",
        });
      }

      const prompt = `Give a short, heartfelt, poetic and uplifting 1 to 2 sentence greeting/check-in specifically for Srishti from Ishant.
Time of day: ${timeOfDay || 'morning/day'}. Current mood: ${mood || 'peaceful'}.
Style: Warm, calm, serene, like a fresh blooming tulip. Can be in gentle Hinglish or English. Address her by name with warmth.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.9,
        },
      });

      return res.json({
        thought: response.text?.trim() || "Aaj ka din shant aur khoobsurat ho, Srishti. Main hamesha yahan hoon.",
      });
    } catch (err: any) {
      return res.json({
        thought: "Take a gentle pause today, Srishti. Drink some water and know that you are deeply appreciated.",
      });
    }
  });

  // Care Mode advice endpoint
  app.post('/api/care-checkin', async (req, res) => {
    try {
      const { mood, notes } = req.body;
      if (!ai) {
        return res.json({
          advice: "Srishti, ek gehri saans lijiye aur thoda paani pee lijiye. Don't carry all the weight at once—sab sambhal jayega.",
        });
      }

      const prompt = `Srishti is checking in on Care Mode.
Her current state/mood: "${mood || 'Neutral'}".
Her personal note: "${notes || 'Feeling a bit overwhelmed/tired'}".
Provide a soothing, grounding, and kind response in 2-3 sentences.
Offer calm reassurance and a gentle physical reminder (e.g. relax her shoulders, drink warm water, or take 3 slow breaths).
Use warm Hinglish or English.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.8,
        },
      });

      return res.json({
        advice: response.text?.trim() || "Apna dhyan rakho Srishti. Ek glass paani piyo aur thoda aaram karo.",
      });
    } catch (err: any) {
      return res.json({
        advice: "Srishti, take a slow deep breath. Relax your shoulders, sip some water, and take it one step at a time.",
      });
    }
  });

  // Favourite conversational insights
  app.post('/api/favourite-insight', async (req, res) => {
    const { itemTitle, itemCategory } = req.body || {};
    try {
      if (!ai) {
        return res.json({
          insight: `Srishti's love for ${itemTitle || 'this'} is truly special!`,
        });
      }

      const prompt = `Write a short, charming 2-sentence note from Ishant to Srishti about her favourite: "${itemTitle || 'this favourite'}" (Category: ${itemCategory || 'general'}). Mention why it suits her so well and a fond thought about it in friendly Hinglish or English.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.85,
        },
      });

      return res.json({
        insight: response.text?.trim() || `${itemTitle || 'This'} hamesha ek alag hi smile lata hai face par!`,
      });
    } catch (_err) {
      return res.json({
        insight: `${itemTitle || 'This'} is one of your sweetest favourites!`,
      });
    }
  });

  // Vite integration
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
