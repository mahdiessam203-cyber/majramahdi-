import React from 'react';
import {
  Compass,
  GraduationCap,
  Building2,
  Sparkles,
  Scale,
  FileText,
  Search,
  Code2,
  BookOpen,
  Landmark
} from 'lucide-react';

export type NavTabType =
  | 'matcher'
  | 'specialties'
  | 'universities'
  | 'government'
  | 'private'
  | 'comparator'
  | 'planner';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  onOpenAssistant: (initialQuery?: string) => void;
  comparisonCount: number;
  draftCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAssistant,
  comparisonCount,
  draftCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#F5F5F7]/90 border-b border-[#E5E5EA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('matcher')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0071E3] via-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white shadow-md shadow-[#0071E3]/25">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#1D1D1F]">مَجَرّة</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/20">
                  Majarra
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#86868B]">
                <Code2 className="w-3.5 h-3.5 text-[#0071E3]" />
                <span className="text-[#1D1D1F] font-bold">صُنع بواسطة المهندس مهدي عصام</span>
              </div>
            </div>
          </div>

          {/* Navigation Segments (Apple style segmented control) */}
          <nav className="hidden xl:flex items-center bg-[#E5E5EA]/70 p-1.5 rounded-full text-xs font-semibold text-[#1D1D1F] shadow-xs gap-1">
            <button
              onClick={() => setActiveTab('matcher')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'matcher'
                  ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                  : 'text-[#515154] hover:text-[#1D1D1F]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#0071E3]" />
              مطابقة المعدل
            </button>

            <button
              onClick={() => setActiveTab('specialties')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'specialties'
                  ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                  : 'text-[#515154] hover:text-[#1D1D1F]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0071E3]" />
              دليل التخصصات
            </button>

            <button
              onClick={() => setActiveTab('universities')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'universities'
                  ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                  : 'text-[#515154] hover:text-[#1D1D1F]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#0071E3]" />
              الجامعات والمعاهد
            </button>

            <button
              onClick={() => setActiveTab('government')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'government'
                  ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                  : 'text-[#515154] hover:text-[#1D1D1F]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#0071E3]" />
              التعليم الحكومي
            </button>

            <button
              onClick={() => setActiveTab('private')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'private'
                  ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                  : 'text-[#515154] hover:text-[#1D1D1F]'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-600" />
              التعليم الأهلي
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 relative ${
                activeTab === 'planner'
                  ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                  : 'text-[#515154] hover:text-[#1D1D1F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              مسودة الاستمارة
              {draftCount > 0 && (
                <span className="w-4 h-4 text-[9px] rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold">
                  {draftCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('comparator')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 relative ${
                activeTab === 'comparator'
                  ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                  : 'text-[#515154] hover:text-[#1D1D1F]'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              المقارنة
              {comparisonCount > 0 && (
                <span className="w-4 h-4 text-[9px] rounded-full bg-[#1D1D1F] text-white flex items-center justify-center font-bold">
                  {comparisonCount}
                </span>
              )}
            </button>
          </nav>

          {/* Medium screen Nav (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center bg-[#E5E5EA]/70 p-1 rounded-full text-xs font-semibold text-[#1D1D1F] shadow-xs gap-1">
            <button
              onClick={() => setActiveTab('matcher')}
              className={`px-3 py-1.5 rounded-full ${activeTab === 'matcher' ? 'bg-white font-bold shadow-xs' : 'text-[#515154]'}`}
            >
              المعدل
            </button>
            <button
              onClick={() => setActiveTab('specialties')}
              className={`px-3 py-1.5 rounded-full ${activeTab === 'specialties' ? 'bg-white font-bold shadow-xs' : 'text-[#515154]'}`}
            >
              التخصصات
            </button>
            <button
              onClick={() => setActiveTab('universities')}
              className={`px-3 py-1.5 rounded-full ${activeTab === 'universities' ? 'bg-white font-bold shadow-xs' : 'text-[#515154]'}`}
            >
              الجامعات والمعاهد
            </button>
            <button
              onClick={() => setActiveTab('government')}
              className={`px-3 py-1.5 rounded-full ${activeTab === 'government' ? 'bg-white font-bold shadow-xs' : 'text-[#515154]'}`}
            >
              حكومي
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-3 py-1.5 rounded-full ${activeTab === 'private' ? 'bg-white font-bold shadow-xs' : 'text-[#515154]'}`}
            >
              أهلي
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3 py-1.5 rounded-full relative ${activeTab === 'planner' ? 'bg-white font-bold shadow-xs' : 'text-[#515154]'}`}
            >
              الاستمارة
              {draftCount > 0 && <span className="mr-1 text-[10px] text-[#0071E3]">({draftCount})</span>}
            </button>
            <button
              onClick={() => setActiveTab('comparator')}
              className={`px-3 py-1.5 rounded-full relative ${activeTab === 'comparator' ? 'bg-white font-bold shadow-xs' : 'text-[#515154]'}`}
            >
              المقارنة
              {comparisonCount > 0 && <span className="mr-1 text-[10px] text-amber-600">({comparisonCount})</span>}
            </button>
          </nav>

          {/* Right Action: AI Assistant */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAssistant()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow text-amber-200" />
              <span>مساعد مجرة الذكي</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2.5 border-t border-[#E5E5EA] text-[11px] font-semibold overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('matcher')}
            className={`py-1 px-2 rounded-lg flex flex-col items-center gap-0.5 shrink-0 ${
              activeTab === 'matcher' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>المعدل</span>
          </button>
          <button
            onClick={() => setActiveTab('specialties')}
            className={`py-1 px-2 rounded-lg flex flex-col items-center gap-0.5 shrink-0 ${
              activeTab === 'specialties' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>التخصصات</span>
          </button>
          <button
            onClick={() => setActiveTab('universities')}
            className={`py-1 px-2 rounded-lg flex flex-col items-center gap-0.5 shrink-0 ${
              activeTab === 'universities' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>الجامعات</span>
          </button>
          <button
            onClick={() => setActiveTab('government')}
            className={`py-1 px-2 rounded-lg flex flex-col items-center gap-0.5 shrink-0 ${
              activeTab === 'government' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>حكومي</span>
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`py-1 px-2 rounded-lg flex flex-col items-center gap-0.5 shrink-0 ${
              activeTab === 'private' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>أهلي</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`py-1 px-2 rounded-lg flex flex-col items-center gap-0.5 shrink-0 relative ${
              activeTab === 'planner' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الاستمارة</span>
            {draftCount > 0 && (
              <span className="absolute -top-1 right-2 w-3.5 h-3.5 text-[8px] rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold">
                {draftCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('comparator')}
            className={`py-1 px-2 rounded-lg flex flex-col items-center gap-0.5 shrink-0 relative ${
              activeTab === 'comparator' ? 'text-[#0071E3] font-bold' : 'text-[#86868B]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>مقارنة</span>
            {comparisonCount > 0 && (
              <span className="absolute -top-1 right-2 w-3.5 h-3.5 text-[8px] rounded-full bg-[#1D1D1F] text-white flex items-center justify-center font-bold">
                {comparisonCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
