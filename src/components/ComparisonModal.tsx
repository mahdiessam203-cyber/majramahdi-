import React from 'react';
import { X, Scale, Sparkles, Trash2, MapPin, Clock, Coins, CheckCircle, ShieldAlert } from 'lucide-react';
import { ComparisonItem } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ComparisonItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onOpenAssistant: (query?: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  onOpenAssistant,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-[#E5E5EA] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E5EA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1D1D1F] text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">
                مقارنة التخصصات والجامعات
              </h3>
              <p className="text-xs text-[#86868B]">
                قارن بين الحدود الدنيا والأقساط والفرص الوظيفية جنباً إلى جنب ({items.length} من أصل 3)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                مسح الكل
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Scale className="w-12 h-12 text-[#86868B] mx-auto opacity-50" />
              <h4 className="text-base font-bold text-[#1D1D1F]">قائمة المقارنة فارغة</h4>
              <p className="text-xs text-[#86868B] max-w-sm mx-auto">
                يمكنك الضغط على أيقونة الميزان في بطاقة أي تخصص داخل الموقع لإضافته والمقارنة جنباً إلى جنب.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E5E5EA] bg-[#F5F5F7]/50 p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Top Row: Type and Delete */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          item.type === 'حكومي'
                            ? 'bg-blue-50 text-[#0071E3] border border-blue-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        {item.type === 'حكومي' ? 'تعليم حكومي' : 'تعليم أهلي'}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#86868B] hover:text-red-600 transition-colors p-1"
                        title="إزالة من المقارنة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Titles */}
                    <div>
                      <h4 className="text-base font-bold text-[#1D1D1F]">{item.name}</h4>
                      <p className="text-xs text-[#86868B]">{item.collegeName}</p>
                      <p className="text-xs font-semibold text-[#0071E3] mt-0.5">{item.universityName}</p>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-2 text-xs bg-white rounded-xl p-3 border border-[#E5E5EA]">
                      <div className="flex items-center justify-between py-1 border-b border-[#F5F5F7]">
                        <span className="text-[#86868B]">المحافظة:</span>
                        <span className="font-semibold text-[#1D1D1F] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.governorate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-[#F5F5F7]">
                        <span className="text-[#86868B]">الحد الأدنى (صباحي):</span>
                        <span className="font-bold text-[#0071E3]">{item.cutoffMorning}</span>
                      </div>

                      {item.cutoffParallel && (
                        <div className="flex items-center justify-between py-1 border-b border-[#F5F5F7]">
                          <span className="text-[#86868B]">الموازي الصباحي:</span>
                          <span className="font-semibold text-[#1D1D1F]">{item.cutoffParallel}</span>
                        </div>
                      )}

                      {item.cutoffEvening && (
                        <div className="flex items-center justify-between py-1 border-b border-[#F5F5F7]">
                          <span className="text-[#86868B]">المسائي:</span>
                          <span className="font-semibold text-emerald-700">{item.cutoffEvening}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between py-1 border-b border-[#F5F5F7]">
                        <span className="text-[#86868B]">القسط السنوي:</span>
                        <span className="font-bold text-emerald-700">
                          {item.type === 'حكومي'
                            ? 'مجاني (حكومي مركزي)'
                            : item.tuitionFeeMorning
                            ? `${item.tuitionFeeMorning.toLocaleString('en-US')} د.ع`
                            : 'غير محدد'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#86868B]">سنوات الدراسة:</span>
                        <span className="font-semibold text-[#1D1D1F] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.yearsOfStudy} سنوات
                        </span>
                      </div>
                    </div>

                    {/* Eligible Branches */}
                    <div>
                      <span className="text-[11px] font-semibold text-[#86868B] block mb-1">
                        الفروع المشمولة:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.eligibleBranches.map((br) => (
                          <span key={br} className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E5E5EA]">
                            {br}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Career path note */}
                    <p className="text-[11px] text-[#86868B] leading-relaxed">
                      {item.careerPath}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenAssistant(
                        `أريد مقارنة تفصيلية بين تخصص ${item.name} في ${item.universityName} من حيث المستقبل المهني والتعيين، ما رأيك؟`
                      )
                    }
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#E5E5EA] border border-[#E5E5EA] text-xs font-semibold text-[#1D1D1F] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                    استشر المساعد عن هذا الخيار
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
