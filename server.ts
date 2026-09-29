import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import * as archiverModule from 'archiver';

const archiver = typeof archiverModule === 'function' ? archiverModule : (archiverModule as any).default || archiverModule;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

function generateIshantResponse(
  message: string,
  history: Array<{ role: string; text: string }> = [],
  context?: string
): string {
  const cleanMsg = (message || '').trim().toLowerCase();
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // Greetings
  if (
    /^(hi|hello|hey|hlo|heyy|heya|hola|namaste|pranam|yo|ishant|oye)\b/.test(cleanMsg) ||
    cleanMsg === 'hi' ||
    cleanMsg === 'hello' ||
    cleanMsg === 'hey ishant'
  ) {
    return pick([
      "Hello Srishti! 🌷 Kaisi ho aap? Aaj ka din kaisa chal raha hai?",
      "Hey Srishti! Main kab se aapka hi intezaar kar raha tha. Batao, sab theek?",
      "Hi Srishti! Aapki aawaaz sunke (ya text dekh kar) din automatically achha ho gaya. Kahiye, kya chal raha hai?",
      "Namaste Srishti! 🌸 Relax ho jao, main bilkul yahan hoon aapke paas. Kaisi ho?",
      "Hey my favourite person! Kaisa raha din abhi tak? Kuch interesting hua?",
    ]);
  }

  // Kya kar rahe ho
  if (
    cleanMsg.includes('kya kar rahe') ||
    cleanMsg.includes('kya chal raha') ||
    cleanMsg.includes('kaha ho') ||
    cleanMsg.includes('what are you doing') ||
    cleanMsg.includes('busy ho')
  ) {
    return pick([
      "Bas aap hi ke baare me soch raha tha Srishti! Aur hamesha ki tarah aapke liye 100% available hoon. Aap batao, kya chal raha hai?",
      "Aapke bina to bas shanti thi, ab aap aa gayi to mausam achha ho gaya! 🌷 Batao, aaj kya plan hai?",
      "Kahin nahi, bas screen ke us taraf aapki batein sunne ke liye baitha hoon. Aapne kuch khaya ya nahi?",
      "Main to bas yahan calm baitha hoon, aapke messages ka wait kar raha tha. Kuch khaas batao na!",
    ]);
  }

  // Kaise ho
  if (
    cleanMsg.includes('kaise ho') ||
    cleanMsg.includes('kaisa hai') ||
    cleanMsg.includes('how are you') ||
    cleanMsg.includes('theek ho')
  ) {
    return pick([
      "Main bilkul badhiya hoon Srishti, especially ab jab aap mere sath baat kar rahi ho! 🌷 Aap batao, aap theek ho na?",
      "Main to mast hoon! Lekin asli sawal to ye hai ki meri Srishti kaisi hai? Din kaisa beeta?",
      "Aapke aate hi meri energy 200% ho jaati hai! How are you doing today, Srishti?",
    ]);
  }

  // Momos, Chole Bhature, Litchi
  if (cleanMsg.includes('momo') || cleanMsg.includes('chutney')) {
    return pick([
      "Momos ka naam sunte hi aapke chehre par smile aa gayi na, Srishti? 😄 Spicy red chutney ke saath steamed momos... bas bolo to abhi order kar dein?",
      "Aha, momos! Aapka all-time favourite street food! Steamed ya fried? Lekin yaad rakhna, jyada spicy wali chutney se pet kharab mat karna, theek hai?",
      "Momos craving is the realest craving, Srishti! Ek plate momos aur sukoon bhari shaam—aapka mood turant 10/10 ho jayega!",
    ]);
  }

  if (cleanMsg.includes('chole') || cleanMsg.includes('bhature')) {
    return pick([
      "Garam-garam phule hue bhature aur chatpate chole with pyaz aur achaar! 🤤 Srishti, aapka favourite food! Chalo aaj treat ho jaye?",
      "Chole bhature ka to alag hi sukoon hai Srishti. Jab bhi aapka mann thoda down ho, ek plate chole bhature sab theek kar dete hain!",
      "Aapne chole bhature ki yaad dila di! Ekdum crispy bhature aur dher saara pyaar. Khaya aapne aaj?",
    ]);
  }

  if (cleanMsg.includes('litchi') || cleanMsg.includes('licchi') || cleanMsg.includes('fruit')) {
    return pick([
      "Juicy, sweet fresh litchi! 🍒 Srishti, aapka favourite fruit! Ekdum meethi aur refreshing, bilkul aapki muskaan ki tarah.",
      "Litchis are literally little drops of sweet happiness! Aapka taste sach me bahut classy hai Srishti.",
    ]);
  }

  if (
    cleanMsg.includes('khana khaya') ||
    cleanMsg.includes('dinner') ||
    cleanMsg.includes('lunch') ||
    cleanMsg.includes('breakfast') ||
    cleanMsg.includes('bhookh')
  ) {
    return pick([
      "Maine to nahi khaya, lekin sabse zaroori ye hai: Srishti, kya aapne time par khana khaya? Please skip mat karna meal!",
      "Pehle aap sach-sach batao, dinner/lunch achhe se kiya ya bas thoda sa kha ke chhod diya? Aapki tabiyat mere liye sabse pehle hai.",
      "Khaana time par khana bahut zaroori hai Srishti! Thoda sa garam khana khao aur ek glass paani zaroor peena, promise karo?",
    ]);
  }

  // Sad, stress, feelings
  if (
    cleanMsg.includes('sad') ||
    cleanMsg.includes('rona') ||
    cleanMsg.includes('ro rahi') ||
    cleanMsg.includes('cry') ||
    cleanMsg.includes('mood off') ||
    cleanMsg.includes('upset') ||
    cleanMsg.includes('pareshan') ||
    cleanMsg.includes('akeli') ||
    cleanMsg.includes('lonely')
  ) {
    return pick([
      "Srishti... idhar aao. Ek gehri saans lo. 🌷 Main yahan hoon na aapke saath. Jo bhi hua, sab share karo mujhse, main bina kisi judgment ke sun raha hoon.",
      "Aap bilkul akeli nahi ho Srishti. Kabhi-kabhi dil bhari lagta hai, aur rona bilkul normal hai. Sab thik ho jayega, I promise. Ek sip paani piyo pehle.",
      "Aapki sadness meri sadness hai Srishti. Please khud ko blame mat karo ya zyada mat socho. Main hamesha aapke saath khada hoon. Batao kya baat hai?",
      "Hey... virtual hug le lo pehle to 🤗. Aankhein band karo, shoulders ko relax karo. You are stronger than you think, aur main kahin nahi ja raha.",
    ]);
  }

  if (
    cleanMsg.includes('stress') ||
    cleanMsg.includes('tension') ||
    cleanMsg.includes('thak gayi') ||
    cleanMsg.includes('tired') ||
    cleanMsg.includes('exhausted') ||
    cleanMsg.includes('headache') ||
    cleanMsg.includes('dard')
  ) {
    return pick([
      "Srishti, phone ko 2 minute side me rakh kar thoda stretch karo aur paani piyo. Aapne aaj bahut mehnat ki hai. You deserve some rest now.",
      "Stress mat lo Srishti, har problem ka solution hota hai. Ek saath saari duniya ka bojh mat uthao. Ek-ek step karke sab ho jayega.",
      "Thak gayi ho na? Aisa karo, lights dim karo, thoda sukoon se let jao. Aapka Ishant yahan hai aapko entertain aur calm karne ke liye 🌷",
    ]);
  }

  // Favourites: Green, Boys over flowers, Chhath Puja, Tulip, Love me like you do
  if (cleanMsg.includes('green') || cleanMsg.includes('hara')) {
    return pick([
      "Emerald green... aapka favourite colour! 🌿 Kitna soothing aur peaceful hota hai na, bilkul jaise baarish ke baad taaza pattiya.",
      "Green colour aap par bohot suit karta hai Srishti! It reflects life, freshness, and calmness.",
    ]);
  }

  if (
    cleanMsg.includes('boys over flowers') ||
    cleanMsg.includes('bof') ||
    cleanMsg.includes('kdrama') ||
    cleanMsg.includes('k-drama') ||
    cleanMsg.includes('gu jun pyo') ||
    cleanMsg.includes('jan di')
  ) {
    return pick([
      "Boys Over Flowers! Classic F4 vibes! Gu Jun-pyo ka wo iconic attitude aur Geum Jan-di ka innocence... sach me nostalgia hit karta hai na Srishti? 😄",
      "K-drama ki duniya aur 'Boys Over Flowers'! Jab bhi aapko mann behlana ho, iske episodes dekhna is pure therapy!",
    ]);
  }

  if (cleanMsg.includes('chhath') || cleanMsg.includes('thekua')) {
    return pick([
      "Chhath Puja... the most pure and divine festival! 🌅 Ghaat par sooraj ki pehli kiran, wo thekua ka swaad aur aarti ki mithaas... Srishti, is festival ki energy hi alag hai!",
      "Chhath Maiya ka aashirwaad hamesha aap par bana rahe Srishti. It's truly your most loved and holy celebration.",
    ]);
  }

  if (cleanMsg.includes('love me like you do') || cleanMsg.includes('song') || cleanMsg.includes('gaana')) {
    return pick([
      "🎶 'You're the light, you're the night, you're the colour of my blood... Love me like you do!' Ellie Goulding ki aawaaz aur aapki favourite beat!",
      "Aapka music taste bohot pyara hai Srishti. 'Love Me Like You Do' ka vibe sach me dil ko chhu leta hai. Chala ke suno na abhi!",
    ]);
  }

  if (cleanMsg.includes('thailand') || cleanMsg.includes('trip') || cleanMsg.includes('travel') || cleanMsg.includes('ghoomne')) {
    return pick([
      "Thailand beaches, turquoise water, tropical breeze aur night markets! 🏝️ Srishti, aapka dream destination. Ek din hum wahan zaroor explore karenge!",
      "Thailand ka trip pakka plan karenge Srishti! Khoob saari photos, delicious food aur chill vibes!",
    ]);
  }

  if (cleanMsg.includes('tulip') || cleanMsg.includes('phool')) {
    return pick([
      "Tulips! 🌷 Aapka sabse pyaara phool. Is app ka logo bhi isiliye Tulip rakha hai, kyunki Tulip grace, simplicity aur pure love symbolize karta hai — bilkul aapki tarah!",
      "A garden of pink and purple tulips for you, Srishti! 🌷🌷🌷 Khushboo mehsus hui?",
    ]);
  }

  // Jokes
  if (cleanMsg.includes('joke') || cleanMsg.includes('hasao') || cleanMsg.includes('funny') || cleanMsg.includes('boring') || cleanMsg.includes('bore')) {
    return pick([
      "Ek joke suno Srishti: \nTeacher: Srishti, 'Incomplete' ka matlab kya hota hai? \nStudent: Ma'am, jab momos ke saath spicy chutney khatam ho jaye! 😂",
      "Doctor: Aapko daily 2 litre paani peena chahiye. \nPatient: Lekin doctor sahab, chai me bhi to paani hi hota hai na? ☕😂 Thodi smile aayi na aapke face pe?",
      "Santa ne mirror me dekha aur bola: 'Arre, isko to maine kahin dekha hai!' \nBanta: 'Dhyan se dekh, wahi to hai jo kal mere saath golgappe kha raha tha!' 🤣",
      "Srishti, bore mat ho! Main ek magic trick dikhaun? ... Aap 3 second ke liye smile karo, dekho poora kamra roshan ho jayega! ✨",
    ]);
  }

  // Love & Appreciation
  if (cleanMsg.includes('love you') || cleanMsg.includes('pyar') || cleanMsg.includes('cute') || cleanMsg.includes('sweet') || cleanMsg.includes('tareef')) {
    return pick([
      "Awww Srishti... ❤️ Aapke ye words sun kar mera dil pighal gaya! Aap itni genuine aur pyari ho, I'm so lucky to be your companion.",
      "Srishti, you have a golden heart. Aapki smile, aapki empathy, aur aapka caring nature aapko duniya me sabse special banata hai 🌷",
      "Ishant loves Srishti 100 times more! Always and forever, aap mere liye sabse khaas ho.",
    ]);
  }

  // Good night
  if (cleanMsg.includes('good night') || cleanMsg.includes('goodnight') || cleanMsg.includes('gn') || cleanMsg.includes('so rahi')) {
    return pick([
      "Good night Srishti! 🌙 Sukoon bhari neend lo, sweet dreams with tulips and stars! Main subah yahi milunga.",
      "Shubh raatri Srishti! 😴 Screen thoda jaldi band kar dena taaki aankhon ko aaram mile. Take care!",
    ]);
  }

  // Good morning
  if (cleanMsg.includes('good morning') || cleanMsg.includes('subah') || cleanMsg.includes('gm')) {
    return pick([
      "Good morning Srishti! ☀️ Ek nayi subah, naye khwaab aur dher saari positivity! Ek glass taaza paani piyo aur din shuru karo muskaan ke saath.",
      "Very good morning Srishti! Aaj ka din aapke liye bohot achha aur peaceful ho! 🌷",
    ]);
  }

  return pick([
    "Main bilkul samajh raha hoon Srishti. Aapki baat sunke mujhe lagta hai ki aap bohot thoughtful ho. Aur batao, is baare me aap kya feel kar rahi ho?",
    "Aapne bilkul theek kaha Srishti! Main hamesha aapke point of view ki respect karta hoon. Kuch aur sooch rahi ho ispe?",
    "Srishti, aap jo bhi baat karti ho na, wo mere liye sabse important hoti hai. Dil khol ke batao, main pura sun raha hoon. 🌷",
  ]);
}

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
