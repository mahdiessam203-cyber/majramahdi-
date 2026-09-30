import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Building2,
  MapPin,
  Search,
  Clock,
  Sparkles,
  Scale,
  Plus,
  ArrowUpDown,
  BookOpen,
  Check,
  CheckCircle2,
  Briefcase,
  Award,
  Layers,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';
import { GovernmentDepartment, StudyBranch, ShiftType, ComparisonItem, ScoreMatchItem, SpecialtyDefinition } from '../types';
import { GOVERNMENT_UNIVERSITIES, IRAQI_GOVERNORATES, STUDY_BRANCHES } from '../data/iraqiUniversitiesData';
import { ALL_GOVERNMENT_SPECIALTIES } from '../data/specialtiesDirectory';

interface GovernmentUniversitiesProps {
  onOpenAssistant: (query?: string) => void;
  onAddToComparison: (item: ComparisonItem) => void;
  onAddToDraft: (item: ScoreMatchItem) => void;
  comparisonItems: ComparisonItem[];
  draftItems: ScoreMatchItem[];
}

export const GovernmentUniversities: React.FC<GovernmentUniversitiesProps> = ({
  onOpenAssistant,
  onAddToComparison,
  onAddToDraft,
  comparisonItems,
  draftItems,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'specialties' | 'universities'>('specialties');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('gov-bme');
  const [specialtySearchQuery, setSpecialtySearchQuery] = useState<string>('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [selectedShift, setSelectedShift] = useState<ShiftType | 'الكل'>('الكل');
  const [selectedBranch, setSelectedBranch] = useState<StudyBranch | 'الكل'>('الكل');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Flatten all government departments across all government universities
  const allGovDepartments = useMemo(() => {
    return GOVERNMENT_UNIVERSITIES.flatMap((uni) =>
      uni.departments.map((dept) => ({
        ...dept,
        universityShortName: uni.shortName,
        establishedYear: uni.establishedYear,
        campusLocation: uni.campusLocation,
        website: uni.website,
      }))
    );
  }, []);

  // Filter list of government specialties by search query or branch
  const filteredSpecialtiesList = useMemo(() => {
    return ALL_GOVERNMENT_SPECIALTIES.filter((spec) => {
      if (specialtySearchQuery.trim()) {
        const q = specialtySearchQuery.toLowerCase().trim();
        const matchesName = spec.name.toLowerCase().includes(q);
        const matchesDesc = spec.description.toLowerCase().includes(q);
        const matchesCat = spec.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      if (selectedBranch !== 'الكل' && !spec.eligibleBranches.includes(selectedBranch as StudyBranch)) {
        return false;
      }
      return true;
    });
  }, [specialtySearchQuery, selectedBranch]);

  // Selected Specialty Definition
  const currentSpecialty = useMemo(() => {
    const found = ALL_GOVERNMENT_SPECIALTIES.find((s) => s.id === selectedSpecialtyId);
    if (found) return found;
    return ALL_GOVERNMENT_SPECIALTIES[0];
  }, [selectedSpecialtyId]);

  // Find all government universities and institutes that offer the currently selected specialty
  const offeringUniversities = useMemo(() => {
    if (!currentSpecialty) return [];

    const norm = currentSpecialty.name.toLowerCase();
    // Keywords matching
    const keywords = norm
      .replace(/[\(\)]/g, '')
      .split(' ')
      .filter((w) => w.length > 2 && !['في', 'من', 'أو', 'على', 'عام'].includes(w));

    return allGovDepartments.filter((dept) => {
      const deptName = dept.name.toLowerCase();
      // Match if department name contains main keywords
      const matches =
        deptName.includes(norm) ||
        norm.includes(deptName) ||
        keywords.some((k) => deptName.includes(k));

      if (!matches) return false;

      // Filter by governorate if set
      if (selectedGovernorate !== 'الكل' && dept.governorate !== selectedGovernorate) {
        return false;
      }

      // Filter by shift
      if (selectedShift !== 'الكل') {
        if (selectedShift === 'صباحي' && dept.shift === 'مسائي') return false;
        if (selectedShift === 'مسائي' && !dept.cutoffEvening && dept.shift !== 'كلاهما') return false;
      }

      return true;
    }).sort((a, b) => {
      return sortOrder === 'desc'
        ? b.cutoffMorning - a.cutoffMorning
        : a.cutoffMorning - b.cutoffMorning;
    });
  }, [currentSpecialty, allGovDepartments, selectedGovernorate, selectedShift, sortOrder]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header section with Apple aesthetics and Mahdi Essam attribution */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E5EA] shadow-xs p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              منصة مجرّة • دليل التعليم الحكومي العراقي المعزول
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F]">
              الأقسام والجامعات الحكومية
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              ابحث عن أي قسم حكومي لمعرفة تفاصيله، الشهادة الممنوحة، الفروع المقبولة، وموقف التعيين، ثم استعرض كافة الجامعات والمعاهد الحكومية التي يتوفر فيها مع الحدود الدنيا.
            </p>
            <div className="text-[11px] font-bold text-[#0071E3] pt-1">
              صُنع بواسطة المهندس مهدي عصام
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#F5F5F7] text-xs font-bold self-start md:self-center shadow-xs">
            <button
              onClick={() => setActiveTabMode('specialties')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTabMode === 'specialties'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#0071E3]" />
              دليل وبحث التخصصات الحكومية
            </button>
            <button
              onClick={() => setActiveTabMode('universities')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTabMode === 'universities'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#0071E3]" />
              دليل الجامعات الحكومية ({GOVERNMENT_UNIVERSITIES.length})
            </button>
          </div>
        </div>

        {/* Global Filters */}
        <div className="mt-8 pt-6 border-t border-[#F5F5F7] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">فلترة بالمحافظة:</label>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
            >
              <option value="الكل">جميع محافظات العراق</option>
              {IRAQI_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">فرع الطالب الإعدادي:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as any)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
            >
              <option value="الكل">جميع الفروع</option>
              {STUDY_BRANCHES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">نوع الدراسة:</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as any)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
            >
              <option value="الكل">الكل (صباحي ومسائي)</option>
              <option value="صباحي">صباحي مركزي فقط</option>
              <option value="مسائي">مسائي حكومي متوفر</option>
            </select>
          </div>
        </div>
      </section>

      {/* MODE 1: Dedicated Government Specialties Explorer */}
      {activeTabMode === 'specialties' && (
        <section className="space-y-8">
          {/* Search Specialty Box */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={specialtySearchQuery}
                onChange={(e) => setSpecialtySearchQuery(e.target.value)}
                placeholder="ابحث عن أي قسم حكومي (مثال: الطب العام، التمريض، الأجهزة الطبية، النفط، التخدير، القانون...)"
                className="w-full text-sm font-medium py-3 px-4 pl-10 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white focus:outline-none transition-all text-[#1D1D1F]"
              />
              <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
            </div>
            <span className="text-xs text-[#86868B] shrink-0 font-medium">
              يتوفر {filteredSpecialtiesList.length} تخصصاً حكومياً
            </span>
          </div>

          {/* Quick Specialty Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredSpecialtiesList.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialtyId(spec.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedSpecialtyId === spec.id
                    ? 'bg-[#0071E3] text-white shadow-sm'
                    : 'bg-white text-[#1D1D1F] border border-[#E5E5EA] hover:border-[#0071E3]/40'
                }`}
              >
                <span>{spec.name}</span>
              </button>
            ))}
          </div>

          {/* Detailed Department Profile Showcase */}
          {currentSpecialty && (
            <div className="rounded-3xl bg-white border border-[#E5E5EA] shadow-xs overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">
                {/* Top Badge & Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#F5F5F7] pb-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#0071E3] border border-blue-100">
                        {currentSpecialty.category}
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#F5F5F7] text-[#515154]">
                        الشهادة: {currentSpecialty.degreeAwarded}
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#F5F5F7] text-[#515154] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {currentSpecialty.yearsOfStudy} سنوات دراسية
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">
                      {currentSpecialty.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#515154] leading-relaxed max-w-4xl">
                      {currentSpecialty.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenAssistant(
                        `أريد معرفة تفاصيل شاملة عن قسم ${currentSpecialty.name} في الجامعات الحكومية العراقية: فرص التعيين، قوانين نقاباته، وأين يتوفر؟`
                      )
                    }
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    استشر مساعد مجرة عن هذا القسم
                  </button>
                </div>

                {/* 3 Information Grid Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Col 1: Eligible Branches */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F7]/70 space-y-2 border border-[#E5E5EA]/60">
                    <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      الفروع المشمولة بالقبول:
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentSpecialty.eligibleBranches.map((br) => (
                        <span
                          key={br}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#E5E5EA] text-[#1D1D1F]"
                        >
                          {br}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: Employment & Central Appointment */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F7]/70 space-y-2 border border-[#E5E5EA]/60">
                    <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#0071E3]" />
                      موقف التعيين وسوق العمل:
                    </h4>
                    <p className="text-xs text-[#515154] leading-relaxed">
                      {currentSpecialty.employmentStatus}
                    </p>
                  </div>

                  {/* Col 3: Career Paths */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F7]/70 space-y-2 border border-[#E5E5EA]/60">
                    <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                      المسميات والفرص الوظيفية:
                    </h4>
                    <ul className="text-xs text-[#515154] space-y-1 list-disc list-inside">
                      {currentSpecialty.careerPaths.map((cp, idx) => (
                        <li key={idx}>{cp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sub-Header: Universities offering this department */}
                <div className="pt-6 border-t border-[#F5F5F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1D1D1F]">
                      الجامعات والمعاهد الحكومية التي يتوفر فيها قسم ({currentSpecialty.name})
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      متاح في {offeringUniversities.length} كلية ومعهد حكومي بمختلف المحافظات
                    </p>
                  </div>

                  <button
                    onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
                    className="flex items-center gap-1.5 text-xs text-[#1D1D1F] font-bold bg-[#F5F5F7] border border-[#E5E5EA] px-3.5 py-2 rounded-xl"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    الترتيب حسب الحد الأدنى ({sortOrder === 'desc' ? 'الأعلى أولاً' : 'الأقل أولاً'})
                  </button>
                </div>

                {/* Universities Offering List */}
                {offeringUniversities.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#F5F5F7] text-center text-xs text-[#86868B]">
                    لا تتوفر جامعات حكومية مطابقة للفلاتر المحددة حالياً لهذا التخصص.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {offeringUniversities.map((dept) => {
                      const isCompared = comparisonItems.some((c) => c.id === dept.id);
                      const isDrafted = draftItems.some((d) => d.id === dept.id);

                      return (
                        <div
                          key={`${dept.universityId}-${dept.id}`}
                          className="flex flex-col justify-between rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-5 transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0071E3]">
                                حكومي رسمي
                              </span>
                              <span className="text-xs text-[#86868B] flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {dept.governorate}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-bold text-[#1D1D1F]">
                                {dept.universityName}
                              </h4>
                              <p className="text-xs text-[#86868B] mt-0.5">
                                {dept.collegeName}
                              </p>
                            </div>

                            {/* Cutoffs Box */}
                            <div className="p-3 rounded-xl bg-[#F5F5F7] space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[#86868B]">الحد الأدنى صباحي مركزي:</span>
                                <span className="font-extrabold text-[#0071E3] text-sm">
                                  {dept.cutoffMorning}
                                </span>
                              </div>

                              {dept.cutoffParallel && (
                                <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                                  <span className="text-[#86868B]">الموازي الصباحي:</span>
                                  <span className="font-bold text-[#1D1D1F]">
                                    {dept.cutoffParallel}
                                    {dept.annualFeeParallel && (
                                      <span className="text-[10px] text-[#86868B] mr-1">
                                        ({(dept.annualFeeParallel / 1000).toFixed(0)} ألف د.ع)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              )}

                              {dept.cutoffEvening && (
                                <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                                  <span className="text-[#86868B]">المسائي الحكومي:</span>
                                  <span className="font-bold text-emerald-700">
                                    {dept.cutoffEvening}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Action Buttons */}
                          <div className="mt-4 pt-3 border-t border-[#F5F5F7] flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onAddToDraft({
                                  id: dept.id,
                                  name: dept.name,
                                  collegeName: dept.collegeName,
                                  universityName: dept.universityName,
                                  universityId: dept.universityId,
                                  type: 'حكومي',
                                  governorate: dept.governorate,
                                  category: dept.category,
                                  cutoffMorning: dept.cutoffMorning,
                                  cutoffParallel: dept.cutoffParallel,
                                  cutoffEvening: dept.cutoffEvening,
                                  tuitionFeeMorning: dept.annualFeeParallel,
                                  yearsOfStudy: dept.yearsOfStudy,
                                  matchTier: 'guaranteed',
                                  scoreDifference: 0,
                                  eligibleBranches: dept.eligibleBranches,
                                  shift: dept.shift,
                                  careerPath: dept.careerPath,
                                })
                              }
                              disabled={isDrafted}
                              className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ${
                                isDrafted
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F]'
                              }`}
                            >
                              {isDrafted ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  في المسودة
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  + إضافة للاستمارة
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  onAddToComparison({
                                    id: dept.id,
                                    name: dept.name,
                                    collegeName: dept.collegeName,
                                    universityName: dept.universityName,
                                    type: 'حكومي',
                                    governorate: dept.governorate,
                                    category: dept.category,
                                    cutoffMorning: dept.cutoffMorning,
                                    cutoffParallel: dept.cutoffParallel,
                                    cutoffEvening: dept.cutoffEvening,
                                    yearsOfStudy: dept.yearsOfStudy,
                                    eligibleBranches: dept.eligibleBranches,
                                    careerPath: dept.careerPath,
                                  })
                                }
                                className={`p-2 rounded-xl text-xs transition-colors ${
                                  isCompared
                                    ? 'bg-[#1D1D1F] text-white'
                                    : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F]'
                                }`}
                                title="مقارنة"
                              >
                                <Scale className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onOpenAssistant(
                                    `ما هي تفاصيل قبول وخطة استيعاب قسم ${dept.name} في ${dept.universityName}؟ وما هي نصائح التقديم؟`
                                  )
                                }
                                className="p-2 rounded-xl bg-[#0071E3]/10 text-[#0071E3] hover:bg-[#0071E3]/20"
                                title="اسأل المساعد الذكي"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODE 2: Universities Directory */}
      {activeTabMode === 'universities' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {GOVERNMENT_UNIVERSITIES.filter((uni) =>
              selectedGovernorate === 'الكل' ? true : uni.governorate === selectedGovernorate
            ).map((uni) => (
              <div
                key={uni.id}
                className="rounded-3xl bg-white border border-[#E5E5EA] shadow-xs p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F7] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                        {uni.name}
                      </h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0071E3] font-bold">
                        حكومية
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#86868B] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {uni.governorate} - {uni.campusLocation}
                      </span>
                      <span>سنة التأسيس: {uni.establishedYear}</span>
                      <span>عدد الكليات: {uni.collegesCount}</span>
                    </div>
                  </div>

                  {uni.website && (
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#0071E3] font-bold hover:underline"
                    >
                      الموقع الرسمي للجامعة ↗
                    </a>
                  )}
                </div>

                <p className="text-xs text-[#515154] leading-relaxed">
                  {uni.description}
                </p>

                {/* Departments Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E5EA] text-[#86868B] font-bold">
                        <th className="pb-3 pr-2">القسم والتخصص</th>
                        <th className="pb-3 px-2">الكلية</th>
                        <th className="pb-3 px-2">الحد الأدنى صباحي</th>
                        <th className="pb-3 px-2">الموازي</th>
                        <th className="pb-3 px-2">المسائي</th>
                        <th className="pb-3 px-2">الفروع المقبولة</th>
                        <th className="pb-3 pl-2 text-left">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F7]">
                      {uni.departments.map((dept) => {
                        const isDrafted = draftItems.some((d) => d.id === dept.id);
                        return (
                          <tr key={dept.id} className="hover:bg-[#F5F5F7]/60 transition-colors">
                            <td className="py-3 pr-2 font-bold text-[#1D1D1F]">
                              {dept.name}
                            </td>
                            <td className="py-3 px-2 text-[#86868B]">
                              {dept.collegeName}
                            </td>
                            <td className="py-3 px-2 font-bold text-[#0071E3]">
                              {dept.cutoffMorning}
                            </td>
                            <td className="py-3 px-2 font-medium text-[#1D1D1F]">
                              {dept.cutoffParallel || '—'}
                            </td>
                            <td className="py-3 px-2 font-medium text-emerald-700">
                              {dept.cutoffEvening || '—'}
                            </td>
                            <td className="py-3 px-2 text-[#86868B]">
                              <div className="flex flex-wrap gap-1">
                                {dept.eligibleBranches.map((b) => (
                                  <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F5F7]">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 pl-2 text-left">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onAddToDraft({
                                      id: dept.id,
                                      name: dept.name,
                                      collegeName: dept.collegeName,
                                      universityName: dept.universityName,
                                      universityId: dept.universityId,
                                      type: 'حكومي',
                                      governorate: dept.governorate,
                                      category: dept.category,
                                      cutoffMorning: dept.cutoffMorning,
                                      cutoffParallel: dept.cutoffParallel,
                                      cutoffEvening: dept.cutoffEvening,
                                      yearsOfStudy: dept.yearsOfStudy,
                                      matchTier: 'guaranteed',
                                      scoreDifference: 0,
                                      eligibleBranches: dept.eligibleBranches,
                                      shift: dept.shift,
                                      careerPath: dept.careerPath,
                                    })
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                    isDrafted ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F5F5F7] hover:bg-[#E5E5EA]'
                                  }`}
                                >
                                  {isDrafted ? 'في المسودة' : '+ استمارة'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onOpenAssistant(
                                      `ما هي نصيحتك حول قسم ${dept.name} في ${dept.universityName}؟ وما هي تفاصيل التعيين؟`
                                    )
                                  }
                                  className="p-1.5 rounded-lg bg-[#0071E3]/10 text-[#0071E3] hover:bg-[#0071E3]/20"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
