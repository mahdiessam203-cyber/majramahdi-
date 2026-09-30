import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { StudentProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface MajraAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  initialQuery?: string;
}

export const MajraAssistantModal: React.FC<MajraAssistantModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `مرحباً بك! أنا **مساعد مجرّة الذكي**، مستشارك الأكاديمي لشؤون القبول والجامعات العراقية (صُنع بواسطة المهندس مهدي عصام). 
يمكنني إجابتك بدقة وتفصيل عن:
- أهليات الفروع (خريجي الصناعة، الحاسوب، الأحيائي، التطبيقي، والأدبي).
- اقتراحات قبول تناسب معدلك ومحافظتك سواء حكومي أو أهلي معزولين تماماً.
- الفروقات بين التخصصات والتعيين المركزي وقانون تدرج المهن الطبية والصحية رقم 6 لسنة 2000 وتعديلاته.
- شروط القبول الموازي الحكومي والجامعات والكليات الأهلية المعترف بها وأقساطها.

تفضل بطرح أي سؤال وسأجيبك فوراً!`,
      timestamp: 'الآن',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts
  const suggestedPrompts = [
    'هل يستطيع خريج الصناعة أو إعدادية الحاسوب التقديم على هندسة تقنيات الحاسوب؟',
    `معدلي ${profile.score || 85} ${profile.branch} من ${profile.governorate || 'بغداد'}، ما هي أفضل الخيارات الحكومية والأهلية؟`,
    'ما هو الفرق بين هندسة النفط وهندسة تكرير النفط والغاز وسوق العمل؟',
    'كيف يعمل نظام التعليم الموازي الصباحي وما هي نسب تخفيض المعدل والأقساط؟',
    'ما هي كليات طب الأسنان والصيدلة الأهلية المعتمدة وأقساطها؟',
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial query if passed
  useEffect(() => {
    if (initialQuery && isOpen) {
      sendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-6),
          studentProfile: {
            score: profile.score,
            branch: profile.branch,
            governorate: profile.governorate,
            preference: profile.preference,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'فشل في استلام الرد من المساعد');
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'عذراً، لم أتلق رداً كافياً.',
        timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Error querying assistant:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'عذراً، حدث خطأ أثناء الاتصال بالخادم الذكي. يرجى التأكد من ضبط المفتاح أو المحاولة بعد لحظات.',
        timestamp: 'الآن',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `تم بدء محادثة استشارية جديدة. تفضل بطرح أي سؤال بخصوص القبول والجامعات العراقية!`,
        timestamp: 'الآن',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[90vh] sm:h-[82vh] flex flex-col rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#E5E5EA] shadow-2xl overflow-hidden">
        {/* Apple-style Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E5E5EA] bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#409CFF] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  مساعد مجرّة الذكي
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                  محدث بضوابط 2026
                </span>
              </div>
              <p className="text-[11px] text-[#86868B]">
                المستشار الرقمي للقبول المركزي • صُنع بواسطة المهندس مهدي عصام
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              title="محادثة جديدة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student Context Bar */}
        <div className="px-6 py-2 bg-[#F5F5F7] border-b border-[#E5E5EA] flex items-center justify-between text-[11px] text-[#515154]">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span>
              المعدل: <strong className="text-[#0071E3]">{profile.score || 'غير محدد'}</strong>
            </span>
            <span>•</span>
            <span>
              الفرع: <strong className="text-[#1D1D1F]">{profile.branch}</strong>
            </span>
            <span>•</span>
            <span>
              المحافظة: <strong className="text-[#1D1D1F]">{profile.governorate || 'الكل'}</strong>
            </span>
          </div>
          <span className="text-[10px] text-[#86868B] hidden sm:inline">
            سياق الطالب مدمج تلقائياً
          </span>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                  msg.sender === 'user'
                    ? 'bg-[#1D1D1F] text-white'
                    : 'bg-[#0071E3]/10 text-[#0071E3]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0071E3] text-white font-medium rounded-tr-sm'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA]/70 rounded-tl-sm space-y-2'
                }`}
              >
                <div className="whitespace-pre-line break-words">
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] mt-1 text-left ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-[#86868B]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] px-4 py-3 flex items-center gap-2 text-xs text-[#86868B]">
                <Loader2 className="w-4 h-4 animate-spin text-[#0071E3]" />
                <span>مساعد مجرى يقوم بتحليل ضوابط القبول والحدود الدنيا...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-[#F5F5F7] bg-white flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-[11px] font-semibold text-[#86868B] shrink-0">
            مقترحات شائعة:
          </span>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(prompt)}
              disabled={isLoading}
              className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] border border-[#E5E5EA] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#E5E5EA] bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب استفسارك هنا (مثال: هل يقبل قسم التمريض خريجي الصناعة؟)..."
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white focus:outline-none text-[#1D1D1F] transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>إرسال</span>
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
