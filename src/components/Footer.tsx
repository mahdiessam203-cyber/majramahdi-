import React from 'react';
import { Compass, GraduationCap, Building2, ShieldCheck, Heart, BookOpen } from 'lucide-react';
import { NavTabType } from './Navbar';

interface FooterProps {
  setActiveTab: (tab: NavTabType) => void;
  onOpenAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAssistant }) => {
  return (
    <footer className="mt-20 border-t border-[#E5E5EA] bg-[#F5F5F7] text-[#86868B] text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1D1D1F] font-bold text-base">
              <div className="w-8 h-8 rounded-xl bg-[#0071E3] flex items-center justify-center text-white shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span>مَجَرّة (Majarra)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#515154]">
              المنصة التفاعلية الشاملة للجامعات والأقسام والحدود الدنيا في العراق، صُممت بدقة لتخدم طلبة السادس الإعدادي والتعليم المهني.
            </p>
            <div className="text-xs font-bold text-[#0071E3]">
              صُنع بواسطة المهندس مهدي عصام
            </div>
          </div>

          {/* Col 2: Specialties & Universities Directories */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1D1D1F] text-xs">أدلة القبول الشاملة</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => setActiveTab('specialties')} className="hover:text-[#1D1D1F] transition-colors">
                  دليل التخصصات (حكومي وأهلي)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('universities')} className="hover:text-[#1D1D1F] transition-colors">
                  دليل الجامعات والمعاهد (حكومي وأهلي)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('matcher')} className="hover:text-[#1D1D1F] transition-colors">
                  شريط مطابقة المعدل الفوري
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('planner')} className="hover:text-[#1D1D1F] transition-colors">
                  مخطط مسودة استمارة القبول
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government & Private Sectors */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1D1D1F] text-xs">التعليم في العراق</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => setActiveTab('government')} className="hover:text-[#1D1D1F] transition-colors">
                  التعليم الحكومي والجامعات الرسمية
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('private')} className="hover:text-[#1D1D1F] transition-colors">
                  الجامعات والكليات الأهلية المعترف بها
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('comparator')} className="hover:text-[#1D1D1F] transition-colors">
                  مقارنة التخصصات والجامعات
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAssistant()} className="hover:text-[#1D1D1F] transition-colors">
                  ضوابط القبول الموازي والمسائي والمهني
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Credentials & Disclaimers */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1D1D1F] text-xs">الاعتماد والبيانات الرسمية</h4>
            <p className="text-[11px] leading-relaxed text-[#515154]">
              كافة البيانات والحدود الدنيا للأعوام 2024-2025/2026 مستخرجة ومحدثة وفق الدليل الإرشادي وضوابط القبول المركزي الصادرة عن وزارة التعليم العالي والبحث العلمي العراقية.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[#0071E3] font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>بيانات موثوقة ومفحوصة بالكامل</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#E5E5EA] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} منصة مَجَرّة للجامعات والقبولات العراقية. صُنع بواسطة المهندس مهدي عصام.
          </div>
          <div className="flex items-center gap-4 text-[#86868B]">
            <span>بغداد - جمهورية العراق</span>
            <span>•</span>
            <button onClick={() => onOpenAssistant()} className="hover:text-[#0071E3]">
              المساعد الذكي
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
