import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction grounded in Iraqi Ministry of Higher Education & Scientific Research rules
const MAJRA_SYSTEM_INSTRUCTION = `أنت "مساعد مجرة الذكي" (Majarra AI Assistant) - المستشار الأكاديمي الرقمي المتخصص في شؤون القبول والجامعات العراقية التابع لمنصة "مجرة" (صُنع بواسطة المهندس مهدي عصام).
هدفك هو مساعدة الطلاب العراقيين وأولياء أمورهم في فهم:
1. الحدود الدنيا للقبول المركزي في الجامعات والمعاهد الحكومية (صباحي ومسائي).
2. قناة التعليم الحكومي الخاص الصباحي (الموازي) وضوابطها (تخفيض المعدل بمقدار درجتين إلى 4 درجات، وتخفيض الأقساط).
3. ضوابط القبول في الجامعات والكليات الأهلية المعترف بها عبر البوابة الإلكترونية لدائرة التعليم الجامعي الأهلي، وأقساطها والحدود الدنيا.
4. أفرع القبول والأهليات:
   - العلمي (الأحيائي والتطبيقي سابقاً، والعلمي الموحد حالياً).
   - الأدبي والفنون.
   - التعليم المهني بفروعه (الصناعي، الحاسوب وتقنية المعلومات، التجاري، الزراعي، الفنون التطبيقية، والتمريض المهني).
   - توضيح قنوات الأوائل لخريجي المعاهد والمهني (الـ 10% الأوائل على العراق يحق لهم التنافس في كليات الهندسة والعلوم والتقنيات المناظرة).
5. قوانين التعيين وتدرج ذوي المهن الطبية والصحية (قانون رقم 6 لسنة 2000 وتعديلاته الخاصة بالتعديل الأخير للتعيين المركزي حسب حاجة الوزارة)، ومستقبل التخصصات الحديثة مثل الذكاء الاصطناعي، الأمن السيبراني، هندسة تقنيات الأجهزة الطبية، والطاقة المتجددة.

أسلوبك:
- حديث، هادئ، واثق، منظم، ومكتوب بلغة عربية فصحى مع لمسة ودية يفهمها الطالب العراقي ("عزيزي الطالب").
- نسّق إجاباتك بنقاط واضحة أو جداول صغيرة وقوائم نقطية.
- ضع دائماً تنبيهاً ودياً بأن الحدود الدنيا تتفاوت سنوياً حسب نسب النجاح وخطة استيعاب الجامعات، وأن منصة "مجرة" بإشراف وتطوير المهندس مهدي عصام تقدم أحدث البيانات الاسترشادية الرسمية.
- إذا سأل الطالب عن معدل محدد وفرع ومحافظة، اقترح خيارات واقعية مقسمة إلى:
  * خيارات ذات فرصة عالية جداً (مضمونة)
  * خيارات تنافسية (متقاربة)
  * خيارات موازي أو أهلي كبديل مريح.`;

// API endpoint for Majra Assistant
app.post('/api/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history = [], studentProfile } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'مفتاح الذكاء الاصطناعي غير متوفر في إعدادات البيئة (GEMINI_API_KEY). يرجى التأكد من ضبط المفتاح.',
      });
    }

    // Build context with student profile if provided
    let contextNote = '';
    if (studentProfile) {
      contextNote = `\n[بيانات الطالب الحالية في المنصة]:
- المعدل: ${studentProfile.score || 'غير محدد'}
- الفرع: ${studentProfile.branch || 'غير محدد'}
- المحافظة: ${studentProfile.governorate || 'غير محدد'}
- التفضيل: ${studentProfile.preference || 'الكل'}\n`;
    }

    // Prepare contents
    const contents: any[] = [];

    // Add previous history if any
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'assistant') {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    // Add current query
    contents.push({
      role: 'user',
      parts: [{ text: contextNote + message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: MAJRA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'عذراً، لم أتمكن من استخراج رد دقيق في الوقت الحالي. يرجى المحاولة مرة أخرى.';

    res.json({ reply: replyText });
  } catch (err: any) {
    console.error('Error in /api/assistant:', err);
    res.status(500).json({
      error: err?.message || 'حدث خطأ أثناء معالجة الطلب في مساعد مجرى الذكي.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Majra Admission Engine' });
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
