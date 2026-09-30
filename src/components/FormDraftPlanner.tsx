import React, { useMemo, useState } from 'react';
import {
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  Printer,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Coins,
  Download,
  FileDown,
  X,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { ScoreMatchItem, StudentProfile } from '../types';

interface FormDraftPlannerProps {
  draftItems: ScoreMatchItem[];
  onRemoveDraftItem: (id: string) => void;
  onMoveDraftItem: (index: number, direction: 'up' | 'down') => void;
  onClearDraft: () => void;
  onOpenAssistant: (query?: string) => void;
  profile: StudentProfile;
}

export const FormDraftPlanner: React.FC<FormDraftPlannerProps> = ({
  draftItems,
  onRemoveDraftItem,
  onMoveDraftItem,
  onClearDraft,
  onOpenAssistant,
  profile,
}) => {
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [studentFullName, setStudentFullName] = useState<string>('طالب عراقي - السادس الإعدادي');
  const [studentExamNumber, setStudentExamNumber] = useState<string>('242611004812');

  // Safety analysis of choices order
  const analysis = useMemo(() => {
    if (draftItems.length < 2) return { isSafe: true, message: 'أضف مزيداً من الخيارات (ينصح بـ 10 إلى 50 رغبة) لتأمين مسودة تقديم متوازنة.' };

    const warnings: string[] = [];
    for (let i = 0; i < draftItems.length - 1; i++) {
      const current = draftItems[i];
      const next = draftItems[i + 1];

      // If next item has higher cutoff than current by more than 1.5, warning about order
      if (next.cutoffMorning > current.cutoffMorning + 1.5) {
        warnings.push(`الخيار رقم (${i + 2}) [${next.name}] حده الأدنى أعلى ملحوظاً من الخيار رقم (${i + 1}) [${current.name}]. يفضل في الاستمارة ترتيب الرغبات تنازلياً حسب طموحك والحدود.`);
      }
    }

    return {
      isSafe: warnings.length === 0,
      warnings,
      message: warnings.length === 0
        ? 'ترتيب استمارتك متناسق ومدروس بحسب تسلسل الحدود الدنيا والرغبات.'
        : 'يوجد ملاحظات على تسلسل بعض الرغبات:',
    };
  }, [draftItems]);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const instituteCount = useMemo(() => {
    return draftItems.filter(item =>
      item.collegeName.includes('معهد') ||
      item.name.includes('دبلوم') ||
      item.category === 'المعاهد الطبية والتكنولوجية'
    ).length;
  }, [draftItems]);

  const collegeCount = draftItems.length - instituteCount;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="rounded-3xl bg-white border border-[#E5E5EA] shadow-xs p-6 sm:p-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">
              <FileText className="w-4 h-4" />
              مخطط مسودة استمارة القبول المركزي
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F]">
              مسودة استمارتي الإلكترونية
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B]">
              رتّب خياراتك الجامعية بالأولويات لضمان عدم ضياع مقعدك في القبول المركزي الحكومي أو بوابات التقديم الأهلية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {draftItems.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setShowPdfModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  تصدير وثيقة PDF رسمية
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E5EA] hover:bg-[#F5F5F7] text-[#1D1D1F] text-xs font-semibold transition-colors flex items-center gap-1.5"
                  title="طباعة سريعة"
                >
                  <Printer className="w-4 h-4 text-[#86868B]" />
                  طباعة فورية
                </button>
                <button
                  type="button"
                  onClick={onClearDraft}
                  className="px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                >
                  تفريغ
                </button>
              </>
            )}
          </div>
        </div>

        {/* Safety Feedback Banner */}
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
            analysis.isSafe
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          {analysis.isSafe ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-bold">{analysis.message}</p>
            {analysis.warnings && analysis.warnings.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90">
                {analysis.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Items List */}
      {draftItems.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E5E5EA] p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-[#86868B] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#1D1D1F]">لا توجد رغبات مضافة في المسودة بعد</h3>
          <p className="text-xs text-[#86868B] max-w-sm mx-auto">
            تصفح نتائج مطابقة المعدل أو صفحات التعليم الحكومي والأهلي واضغط على زر "+ إضافة للمسودة" لبناء استمارتك.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#86868B] px-2 font-semibold">
            <span>التسلسل والتخصص</span>
            <span>التحكم في الترتيب والإجراءات</span>
          </div>

          {draftItems.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-[#E5E5EA] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-4">
                {/* Ranking Badge */}
                <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] font-extrabold text-sm flex items-center justify-center shrink-0">
                  {index + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                      {item.name}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.type === 'حكومي'
                          ? 'bg-blue-50 text-[#0071E3]'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs text-[#86868B]">
                    {item.collegeName} - {item.universityName} ({item.governorate})
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#515154] pt-1">
                    <span>
                      الحد الأدنى: <strong>{item.cutoffMorning}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      نوع الدراسة: <strong>{item.shift}</strong>
                    </span>
                    {item.tuitionFeeMorning && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">
                          القسط: {item.tuitionFeeMorning.toLocaleString('en-US')} د.ع
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Controls */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onMoveDraftItem(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] disabled:opacity-30 text-[#1D1D1F] transition-colors"
                  title="رفع للأعلى"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveDraftItem(index, 'down')}
                  disabled={index === draftItems.length - 1}
                  className="p-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] disabled:opacity-30 text-[#1D1D1F] transition-colors"
                  title="إنزال للأسفل"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveDraftItem(item.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors mr-1"
                  title="حذف من المسودة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* AI Advisor on Draft Form */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#0071E3]/5 to-[#409CFF]/10 border border-[#0071E3]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0071E3]" />
                هل تريد تدقيقاً شاملاً لمسودتك؟
              </h4>
              <p className="text-xs text-[#86868B]">
                يمكن لمساعد مجرى الذكي مراجعة خياراتك الـ ({draftItems.length}) ومقارنتها بمعدلك والتأكد من ترتيب الأمان.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenAssistant(
                  `قمت باختيار ${draftItems.length} رغبات في مسودتي بمعدل ${profile.score || '85'}. الخيارات هي: ${draftItems
                    .map((d, i) => `${i + 1}. ${d.name} (${d.universityName})`)
                    .join(' - ')}. هل ترتيبي متناسق ومضمون؟ وما هي نصائحك؟`
                )
              }
              className="px-4 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-xs shrink-0"
            >
              تدقيق المسودة بالذكاء الاصطناعي
            </button>
          </div>
        </div>
      )}

      {/* Official PDF Document Preview & Print Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E5E5EA] my-auto overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Control Bar (Excluded from print) */}
            <div className="no-print p-4 sm:p-6 border-b border-[#E5E5EA] bg-[#F5F5F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-base font-extrabold text-[#1D1D1F]">
                    معاينة وثيقة استمارة الرغبات (A4 Printable Document)
                  </h3>
                </div>
                <p className="text-xs text-[#86868B]">
                  استمارة رسمية مطابقة لمعايير دليل القبول المركزي لوزارة التعليم العالي والبحث العلمي ومنصة قـدّم.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  طباعة / حفظ كملف PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="p-2 rounded-xl bg-white hover:bg-[#E5E5EA] text-[#1D1D1F] border border-[#E5E5EA] transition-colors"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customization Inputs (Excluded from print) */}
            <div className="no-print p-4 bg-[#F5F5F7]/50 border-b border-[#E5E5EA] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] mb-1">
                  اسم الطالب الرباعي (للطباعة على الوثيقة):
                </label>
                <input
                  type="text"
                  value={studentFullName}
                  onChange={(e) => setStudentFullName(e.target.value)}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-[#E5E5EA] focus:border-[#0071E3] focus:outline-none"
                  placeholder="اكتب اسم الطالب الكامل"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] mb-1">
                  الرقم الامتحاني الوزاري:
                </label>
                <input
                  type="text"
                  value={studentExamNumber}
                  onChange={(e) => setStudentExamNumber(e.target.value)}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-white border border-[#E5E5EA] focus:border-[#0071E3] focus:outline-none"
                  placeholder="الرقم الامتحاني المكون من 12 رقماً"
                />
              </div>
            </div>

            {/* Scrollable Printable Document Container */}
            <div className="p-4 sm:p-8 overflow-y-auto grow bg-[#E5E5EA]/20 print:bg-white print:p-0 print:m-0 print:overflow-visible">
              <div
                id="printable-official-form"
                className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E5E5EA] shadow-sm max-w-[850px] mx-auto text-[#1D1D1F] print:border-0 print:shadow-none print:p-4 print:max-w-none print:w-full space-y-6"
              >
                {/* Official Letterhead */}
                <div className="border-b-2 border-[#1D1D1F] pb-4 flex items-center justify-between gap-4 text-right">
                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-sm text-[#1D1D1F]">جمهورية العراق</p>
                    <p className="font-semibold text-gray-700">وزارة التعليم العالي والبحث العلمي</p>
                    <p className="text-gray-600">دائرة الدراسات والتخطيط والمتابعة</p>
                    <p className="text-[11px] text-gray-500">منظومة القبول المركزي - منصة قـدّم (HEPIQ)</p>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 border-2 border-amber-700 flex items-center justify-center text-white font-black shadow-xs text-xs">
                      جمهورية<br />العراق
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 block">
                      استمارة ترشيح الرغبات
                    </span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-200 inline-block">
                      العام الدراسي 2026 - 2027
                    </span>
                  </div>

                  <div className="text-left text-xs space-y-1">
                    <p className="font-mono font-bold text-[#1D1D1F] tracking-wider text-[11px]">
                      REF: HEPIQ-2026-{draftItems.length}R
                    </p>
                    <p className="text-gray-600 text-[11px]">التاريخ: {currentDate}</p>
                    <div className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>مسودة موثقة إلكترونياً</span>
                    </div>
                  </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-[#F5F5F7] print:bg-gray-100 p-4 rounded-xl border border-gray-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-3 leading-relaxed">
                  <div>
                    <span className="text-gray-500 block text-[10px]">اسم الطالب الرباعي:</span>
                    <strong className="text-gray-900 text-sm">{studentFullName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">الرقم الامتحاني الوزاري:</span>
                    <strong className="font-mono text-gray-900 text-sm tracking-wider">{studentExamNumber}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">الفرع الدراسي:</span>
                    <strong className="text-[#0071E3]">{profile.branch}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">المعدل العام التنافسي:</span>
                    <strong className="text-emerald-700 text-sm">{profile.score}%</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">سكن الطالب / المحافظة:</span>
                    <strong className="text-gray-900">{profile.governorate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">توزيع الخيارات:</span>
                    <span className="font-semibold text-gray-800">
                      {draftItems.length} رغبة ({collegeCount} كليات + {instituteCount} معاهد)
                    </span>
                  </div>
                </div>

                {/* Official Rule Notice */}
                <div className="text-[11px] p-2.5 rounded-lg border bg-blue-50/70 border-blue-200 text-blue-950 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#0071E3] shrink-0" />
                    <span>
                      <strong>تنبيه وزاري رسمي:</strong> وفق ضوابط القبول المركزي لسنة 2026/2027، يُشترط لخريجي الفرع العلمي اختيار ما لا يقل عن (10) معاهد أو كليات بوليتكنك من أصل (50) خياراً، وللفرع الأدبي ما لا يقل عن (10) معاهد من أصل 25 إلى 50 رغبة.
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${instituteCount >= 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {instituteCount >= 10 ? 'مستوفٍ لنسبة المعاهد' : `المعاهد: ${instituteCount}/10`}
                  </span>
                </div>

                {/* Choices Table */}
                <div className="border border-gray-300 rounded-xl overflow-hidden print:border-gray-800">
                  <table className="w-full text-right border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-gray-100 print:bg-gray-200 border-b border-gray-300 text-gray-800 font-bold">
                        <th className="py-2.5 px-2 text-center w-8 border-l border-gray-300">#</th>
                        <th className="py-2.5 px-3 border-l border-gray-300">التخصص / القسم الدراسي</th>
                        <th className="py-2.5 px-3 border-l border-gray-300">الكلية / المعهد</th>
                        <th className="py-2.5 px-3 border-l border-gray-300">الجامعة / المؤسسة</th>
                        <th className="py-2.5 px-2 border-l border-gray-300 text-center w-16">المحافظة</th>
                        <th className="py-2.5 px-2 border-l border-gray-300 text-center w-16">الدراسة</th>
                        <th className="py-2.5 px-2 border-l border-gray-300 text-center w-16">الحد الأدنى</th>
                        <th className="py-2.5 px-2 text-center w-24">الرسوم / القسط</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 print:divide-gray-400">
                      {draftItems.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 print:bg-gray-50'} hover:bg-blue-50/30`}
                        >
                          <td className="py-2 px-2 text-center font-bold font-mono border-l border-gray-200 text-gray-700">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3 font-bold text-gray-900 border-l border-gray-200">
                            {item.name}
                          </td>
                          <td className="py-2 px-3 text-gray-700 border-l border-gray-200">
                            {item.collegeName}
                          </td>
                          <td className="py-2 px-3 text-gray-700 border-l border-gray-200 font-medium">
                            {item.universityName}
                          </td>
                          <td className="py-2 px-2 text-center text-gray-600 border-l border-gray-200">
                            {item.governorate}
                          </td>
                          <td className="py-2 px-2 text-center border-l border-gray-200">
                            <span className="font-semibold text-gray-800">
                              {item.shift}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-[#0071E3] border-l border-gray-200">
                            {item.cutoffMorning}
                          </td>
                          <td className="py-2 px-2 text-center text-[10px] text-gray-700">
                            {item.tuitionFeeMorning ? (
                              <span className="font-semibold text-emerald-800">
                                {item.tuitionFeeMorning.toLocaleString('en-US')} د.ع
                              </span>
                            ) : item.cutoffParallel ? (
                              <span className="text-gray-500">حكومي موازي</span>
                            ) : (
                              <span className="text-gray-400">مجاني مركزي</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pledges & Signatures */}
                <div className="pt-4 border-t border-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-[10px] text-gray-600">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">تعهد وإقرار الطالب:</p>
                    <p className="leading-normal">
                      أقر بصحة البيانات وتسلسل الرغبات المدونة أعلاه، وعلمي بالضوابط الوزارية النافذة وعدم الجمع بين وظيفة ودراسة أو دراستين.
                    </p>
                    <div className="pt-4">
                      <span>توقيع الطالب: _________________</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="font-bold text-gray-900">المصادقة والتوثيق الإلكتروني:</p>
                    <div className="w-16 h-16 mx-auto my-1 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <QrCode className="w-12 h-12 text-gray-700" />
                    </div>
                    <span className="font-mono text-[9px] text-gray-500 block">QR VERIFIED #HEPIQ-IQ</span>
                  </div>

                  <div className="space-y-1 text-left">
                    <p className="font-bold text-gray-900">ختم التدقيق والاستلام:</p>
                    <div className="h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-[9px]">
                      ختم شعبة التسجيل والقبول المركزي
                    </div>
                    <p className="text-[9px] text-gray-400 pt-1">طُبعت عبر منصة مَجَرّة - الدليل الشامل للجامعات العراقية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS for Print to ensure pristine PDF output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-official-form, #printable-official-form * {
            visibility: visible !important;
          }
          #printable-official-form {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 15mm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: #000 !important;
            font-size: 11pt !important;
          }
          .no-print {
            display: none !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
    </div>
  );
};
