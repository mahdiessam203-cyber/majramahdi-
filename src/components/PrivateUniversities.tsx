import React, { useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Search,
  CheckCircle,
  Coins,
  Clock,
  Sparkles,
  Scale,
  Plus,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  BookOpen,
  Briefcase,
  Award,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { PrivateUniversity, StudyBranch, ComparisonItem, ScoreMatchItem, SpecialtyDefinition } from '../types';
import { PRIVATE_UNIVERSITIES, IRAQI_GOVERNORATES, STUDY_BRANCHES } from '../data/iraqiUniversitiesData';
import { ALL_PRIVATE_SPECIALTIES } from '../data/specialtiesDirectory';

interface PrivateUniversitiesProps {
  onOpenAssistant: (query?: string) => void;
  onAddToComparison: (item: ComparisonItem) => void;
  onAddToDraft: (item: ScoreMatchItem) => void;
  comparisonItems: ComparisonItem[];
  draftItems: ScoreMatchItem[];
}

export const PrivateUniversities: React.FC<PrivateUniversitiesProps> = ({
  onOpenAssistant,
  onAddToComparison,
  onAddToDraft,
  comparisonItems,
  draftItems,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'specialties' | 'universities'>('specialties');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('priv-dent');
  const [specialtySearchQuery, setSpecialtySearchQuery] = useState<string>('');
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [selectedBranch, setSelectedBranch] = useState<StudyBranch | 'الكل'>('الكل');
  const [maxTuitionFilter, setMaxTuitionFilter] = useState<number>(15000000);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [regionFilter, setRegionFilter] = useState<'الكل' | 'الاتحادي' | 'كردستان'>('الكل');

  // Flatten all private departments across all recognized private universities
  const allPrivDepartments = useMemo(() => {
    return PRIVATE_UNIVERSITIES.flatMap((uni) =>
      uni.departments.map((dept) => ({
        ...dept,
        universityShortName: uni.shortName,
        establishedYear: uni.establishedYear,
        campusLocation: uni.campusLocation,
        website: uni.website,
        recognitionStatus: uni.recognitionStatus,
        region: uni.region || (uni.isKurdistanRegion ? 'كردستان' : 'الاتحادي'),
      }))
    );
  }, []);

  // Filter list of private specialties by search query or branch
  const filteredSpecialtiesList = useMemo(() => {
    return ALL_PRIVATE_SPECIALTIES.filter((spec) => {
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

  // Selected Private Specialty Definition
  const currentSpecialty = useMemo(() => {
    const found = ALL_PRIVATE_SPECIALTIES.find((s) => s.id === selectedSpecialtyId);
    if (found) return found;
    return ALL_PRIVATE_SPECIALTIES[0];
  }, [selectedSpecialtyId]);

  // Find all private universities and colleges offering the currently selected specialty
  const offeringUniversities = useMemo(() => {
    if (!currentSpecialty) return [];

    const norm = currentSpecialty.name.toLowerCase();
    const keywords = norm
      .replace(/[\(\)]/g, '')
      .split(' ')
      .filter((w) => w.length > 2 && !['في', 'من', 'أو', 'على', 'عام', 'الأهلية', 'المعتمدة', 'الكليات', 'والجامعات'].includes(w));

    return allPrivDepartments.filter((dept) => {
      const deptName = dept.name.toLowerCase();
      const matches =
        deptName.includes(norm) ||
        norm.includes(deptName) ||
        keywords.some((k) => deptName.includes(k));

      if (!matches) return false;

      // Filter by governorate
      if (selectedGovernorate !== 'الكل' && dept.governorate !== selectedGovernorate) {
        return false;
      }

      // Filter by region
      if (regionFilter !== 'الكل') {
        const deptRegion = (dept as any).region;
        if (deptRegion && deptRegion !== regionFilter) {
          return false;
        }
      }

      // Filter by tuition budget
      if (dept.tuitionFeeMorning > maxTuitionFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      return sortOrder === 'desc'
        ? b.cutoffMorning - a.cutoffMorning
        : a.cutoffMorning - b.cutoffMorning;
    });
  }, [currentSpecialty, allPrivDepartments, selectedGovernorate, regionFilter, maxTuitionFilter, sortOrder]);

  // Filtered universities when in "by-university" mode
  const filteredUniversities = useMemo(() => {
    return PRIVATE_UNIVERSITIES.filter((uni) => {
      if (selectedGovernorate !== 'الكل' && uni.governorate !== selectedGovernorate) {
        return false;
      }
      if (regionFilter !== 'الكل') {
        const uniRegion = uni.region || (uni.isKurdistanRegion ? 'كردستان' : 'الاتحادي');
        if (uniRegion !== regionFilter) {
          return false;
        }
      }
      return true;
    });
  }, [selectedGovernorate, regionFilter]);

  // Active University in detail mode
  const activeUniversity = useMemo(() => {
    if (!selectedUniId) return null;
    return PRIVATE_UNIVERSITIES.find((u) => u.id === selectedUniId) || null;
  }, [selectedUniId]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header section with Apple aesthetics and Mahdi Essam attribution */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E5EA] shadow-xs p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              منصة مجرّة • دليل التعليم الأهلي العراقي المعزول
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F]">
              الأقسام والجامعات والكليات الأهلية
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              ابحث عن أي قسم في الكليات الأهلية لمعرفة حدوده الدنيا (صباحي ومسائي)، الأقساط السنوية بالدينار العراقي، والفروع المقبولة، ثم استعرض كافة الجامعات الأهلية المعترف بها التي توفره.
            </p>
            <div className="text-[11px] font-bold text-emerald-700 pt-1">
              صُنع بواسطة المهندس مهدي عصام
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#F5F5F7] text-xs font-bold self-start md:self-center shadow-xs">
            <button
              onClick={() => {
                setActiveTabMode('specialties');
                setSelectedUniId(null);
              }}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTabMode === 'specialties'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              دليل وبحث التخصصات الأهلية
            </button>
            <button
              onClick={() => setActiveTabMode('universities')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTabMode === 'universities'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              دليل الجامعات والكليات ({PRIVATE_UNIVERSITIES.length})
            </button>
          </div>
        </div>

        {/* Region Filter Pills (75 Federal + 14 Kurdistan) */}
        <div className="mt-8 pt-6 border-t border-[#F5F5F7] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#86868B]">النطاق الجغرافي والاعتماد:</span>
            <div className="inline-flex p-1 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]">
              <button
                type="button"
                onClick={() => {
                  setRegionFilter('الكل');
                  setSelectedGovernorate('الكل');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  regionFilter === 'الكل'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                جميع الجامعات والكليات الأهلية (89)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegionFilter('الاتحادي');
                  if (['أربيل', 'السليمانية', 'دهوك'].includes(selectedGovernorate)) {
                    setSelectedGovernorate('الكل');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  regionFilter === 'الاتحادي'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                الكليات والجامعات الأهلية الاتحادية (75)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegionFilter('كردستان');
                  if (!['أربيل', 'السليمانية', 'دهوك'].includes(selectedGovernorate)) {
                    setSelectedGovernorate('الكل');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  regionFilter === 'كردستان'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                جامعات وكليات إقليم كردستان (14)
              </button>
            </div>
          </div>
        </div>

        {/* Global Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">المحافظة:</label>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-emerald-600"
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
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">الفرع الدراسي:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as any)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-emerald-600"
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-[#86868B]">أقصى قسط سنوي:</label>
              <span className="text-[11px] font-bold text-emerald-700">
                {(maxTuitionFilter / 1000000).toFixed(1)} مليون د.ع
              </span>
            </div>
            <input
              type="range"
              min={1500000}
              max={15000000}
              step={500000}
              value={maxTuitionFilter}
              onChange={(e) => setMaxTuitionFilter(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* MODE 1: Dedicated Private Specialties Explorer */}
      {activeTabMode === 'specialties' && (
        <section className="space-y-8">
          {/* Search Private Specialty Box */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={specialtySearchQuery}
                onChange={(e) => setSpecialtySearchQuery(e.target.value)}
                placeholder="ابحث عن أي قسم أهلي (مثال: طب الأسنان، الصيدلة، التخدير، التحليلات، التمريض، الأجهزة الطبية، القانون...)"
                className="w-full text-sm font-medium py-3 px-4 pl-10 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-emerald-600 focus:bg-white focus:outline-none transition-all text-[#1D1D1F]"
              />
              <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
            </div>
            <span className="text-xs text-[#86868B] shrink-0 font-medium">
              يتوفر {filteredSpecialtiesList.length} تخصصاً أهلياً معتمداً
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
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-[#1D1D1F] border border-[#E5E5EA] hover:border-emerald-500/40'
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
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
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

                    {currentSpecialty.averageSalaryNote && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200/60 mt-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-600" />
                        {currentSpecialty.averageSalaryNote}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenAssistant(
                        `ما هي أفضل الجامعات والكليات الأهلية المعترف بها لدراسة قسم ${currentSpecialty.name} في العراق؟ وما هي أسعار الأقساط وشروط التقديم؟`
                      )
                    }
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-2 border border-emerald-200"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    استشر مساعد مجرة عن هذا القسم الأهلي
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

                  {/* Col 2: Recognition & Career */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F7]/70 space-y-2 border border-[#E5E5EA]/60">
                    <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      الاعتراف الرسمي والفرص المهنية:
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

                {/* Sub-Header: Private Universities offering this department */}
                <div className="pt-6 border-t border-[#F5F5F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1D1D1F]">
                      الكليات والجامعات الأهلية المعترف بها التي يتوفر فيها قسم ({currentSpecialty.name})
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      متاح في {offeringUniversities.length} كلية وجامعة أهلية معتمدة مع تفاصيل الأقساط والحدود الدنيا
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

                {/* Private Universities Offering List */}
                {offeringUniversities.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#F5F5F7] text-center text-xs text-[#86868B]">
                    لا تتوفر جامعات أهلية مطابقة للمحافظة أو سقف القسط المحدد حالياً لهذا التخصص.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {offeringUniversities.map((dept) => {
                      const isCompared = comparisonItems.some((c) => c.id === dept.id);
                      const isDrafted = draftItems.some((d) => d.id === dept.id);

                      return (
                        <div
                          key={`${dept.universityId}-${dept.id}`}
                          className="flex flex-col justify-between rounded-2xl bg-white border border-[#E5E5EA] hover:border-emerald-500/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-5 transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                معترف بها رسمياً
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

                            {/* Cutoffs & Tuition Box */}
                            <div className="p-3.5 rounded-xl bg-[#F5F5F7] space-y-2.5 text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[#86868B]">الحد الأدنى صباحي:</span>
                                  <span className="font-extrabold text-[#1D1D1F] text-sm">
                                    {dept.cutoffMorning}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[#86868B]">القسط الصباحي:</span>
                                  <span className="font-extrabold text-emerald-700">
                                    {dept.tuitionFeeMorning.toLocaleString('en-US')} د.ع
                                  </span>
                                </div>
                              </div>

                              {dept.hasEvening && dept.cutoffEvening && (
                                <div className="border-t border-[#E5E5EA] pt-2 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[#86868B]">الحد الأدنى مسائي:</span>
                                    <span className="font-bold text-[#1D1D1F]">
                                      {dept.cutoffEvening}
                                    </span>
                                  </div>
                                  {dept.tuitionFeeEvening && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-[#86868B]">القسط المسائي:</span>
                                      <span className="font-bold text-emerald-700">
                                        {dept.tuitionFeeEvening.toLocaleString('en-US')} د.ع
                                      </span>
                                    </div>
                                  )}
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
                                  type: 'أهلي',
                                  governorate: dept.governorate,
                                  category: dept.category,
                                  cutoffMorning: dept.cutoffMorning,
                                  cutoffEvening: dept.cutoffEvening,
                                  tuitionFeeMorning: dept.tuitionFeeMorning,
                                  tuitionFeeEvening: dept.tuitionFeeEvening,
                                  yearsOfStudy: dept.yearsOfStudy,
                                  matchTier: 'guaranteed',
                                  scoreDifference: 0,
                                  eligibleBranches: dept.eligibleBranches,
                                  shift: dept.hasEvening ? 'كلاهما' : 'صباحي',
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
                                    type: 'أهلي',
                                    governorate: dept.governorate,
                                    category: dept.category,
                                    cutoffMorning: dept.cutoffMorning,
                                    cutoffEvening: dept.cutoffEvening,
                                    tuitionFeeMorning: dept.tuitionFeeMorning,
                                    tuitionFeeEvening: dept.tuitionFeeEvening,
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
                                    `ما هي شروط القبول والتسجيل في قسم ${dept.name} بجامعة ${dept.universityName}؟ وكيف يتم دفع الأقساط؟`
                                  )
                                }
                                className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
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

      {/* MODE 2: Private Universities Directory */}
      {activeTabMode === 'universities' && (
        <section className="space-y-6">
          {!activeUniversity ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => setSelectedUniId(uni.id)}
                  className="group cursor-pointer flex flex-col justify-between rounded-3xl bg-white border border-[#E5E5EA] hover:border-emerald-500/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        معترف بها رسمياً
                      </span>
                      <span className="text-xs text-[#86868B] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {uni.governorate}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#1D1D1F] group-hover:text-emerald-700 transition-colors">
                      {uni.name}
                    </h3>

                    <p className="text-xs text-[#515154] line-clamp-2 leading-relaxed">
                      {uni.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#515154]">
                      <span className="px-2 py-1 rounded-lg bg-[#F5F5F7] font-semibold">
                        {uni.departments.length} أقسام وتخصصات
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-[#F5F5F7]">
                        تأسست {uni.establishedYear}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F5F5F7] flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>استعراض الأقسام والأقساط والحدود الدنيا</span>
                    <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedUniId(null)}
                className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                العودة إلى قائمة الجامعات والكليات الأهلية
              </button>

              <div className="rounded-3xl bg-white border border-[#E5E5EA] shadow-xs p-6 sm:p-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">
                        {activeUniversity.name}
                      </h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        معترف بها رسمياً
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#86868B]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {activeUniversity.governorate} - {activeUniversity.campusLocation}
                      </span>
                      <span>سنة التأسيس: {activeUniversity.establishedYear}</span>
                      <span>الأقسام: {activeUniversity.departments.length}</span>
                    </div>
                  </div>

                  {activeUniversity.website && (
                    <a
                      href={activeUniversity.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
                    >
                      الموقع الرسمي للجامعة
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
                  {activeUniversity.description}
                </p>
              </div>

              {/* Department Cards for this active university */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeUniversity.departments.map((dept) => {
                  const isCompared = comparisonItems.some((c) => c.id === dept.id);
                  const isDrafted = draftItems.some((d) => d.id === dept.id);

                  return (
                    <div
                      key={dept.id}
                      className="flex flex-col justify-between rounded-3xl bg-white border border-[#E5E5EA] p-6 space-y-4 hover:border-emerald-500/40 hover:shadow-xs transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                            {dept.category}
                          </span>
                          <span className="text-xs text-[#86868B]">{dept.yearsOfStudy} سنوات</span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-[#1D1D1F]">{dept.name}</h4>
                          <p className="text-xs text-[#86868B]">{dept.collegeName}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#F5F5F7] space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#86868B]">الحد الأدنى صباحي:</span>
                            <span className="font-bold text-[#1D1D1F]">{dept.cutoffMorning}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#86868B]">القسط الصباحي:</span>
                            <span className="font-extrabold text-emerald-700">
                              {dept.tuitionFeeMorning.toLocaleString('en-US')} د.ع
                            </span>
                          </div>
                          {dept.hasEvening && dept.cutoffEvening && (
                            <div className="border-t border-[#E5E5EA] pt-1.5 flex items-center justify-between">
                              <span className="text-[#86868B]">الحد الأدنى مسائي:</span>
                              <span className="font-bold text-[#1D1D1F]">{dept.cutoffEvening}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#F5F5F7] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onAddToDraft({
                              id: dept.id,
                              name: dept.name,
                              collegeName: dept.collegeName,
                              universityName: dept.universityName,
                              universityId: dept.universityId,
                              type: 'أهلي',
                              governorate: dept.governorate,
                              category: dept.category,
                              cutoffMorning: dept.cutoffMorning,
                              cutoffEvening: dept.cutoffEvening,
                              tuitionFeeMorning: dept.tuitionFeeMorning,
                              tuitionFeeEvening: dept.tuitionFeeEvening,
                              yearsOfStudy: dept.yearsOfStudy,
                              matchTier: 'guaranteed',
                              scoreDifference: 0,
                              eligibleBranches: dept.eligibleBranches,
                              shift: dept.hasEvening ? 'كلاهما' : 'صباحي',
                              careerPath: dept.careerPath,
                            })
                          }
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-bold ${
                            isDrafted ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F5F5F7] hover:bg-[#E5E5EA]'
                          }`}
                        >
                          {isDrafted ? 'في المسودة' : '+ استمارة'}
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
                                type: 'أهلي',
                                governorate: dept.governorate,
                                category: dept.category,
                                cutoffMorning: dept.cutoffMorning,
                                cutoffEvening: dept.cutoffEvening,
                                tuitionFeeMorning: dept.tuitionFeeMorning,
                                tuitionFeeEvening: dept.tuitionFeeEvening,
                                yearsOfStudy: dept.yearsOfStudy,
                                eligibleBranches: dept.eligibleBranches,
                                careerPath: dept.careerPath,
                              })
                            }
                            className={`p-2 rounded-xl text-xs ${
                              isCompared ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] hover:bg-[#E5E5EA]'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenAssistant(
                                `ما رأيك بقسم ${dept.name} في ${dept.universityName}؟ وما هي خطة القبول؟`
                              )
                            }
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
