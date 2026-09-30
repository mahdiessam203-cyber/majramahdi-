import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Building2,
  GraduationCap,
  MapPin,
  Clock,
  CheckCircle2,
  Briefcase,
  Award,
  Sparkles,
  Scale,
  Plus,
  Search,
  Check,
  ChevronDown,
  Layers,
  Coins,
  ArrowUpDown,
  Filter,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { StudyBranch, ComparisonItem, ScoreMatchItem, MajorCategory } from '../types';
import {
  GOVERNMENT_UNIVERSITIES,
  PRIVATE_UNIVERSITIES,
  IRAQI_GOVERNORATES,
  STUDY_BRANCHES,
  MAJOR_CATEGORIES,
} from '../data/iraqiUniversitiesData';
import { ALL_GOVERNMENT_SPECIALTIES, ALL_PRIVATE_SPECIALTIES, ALL_109_SPECIALTIES } from '../data/specialtiesDirectory';
import { OFFICIAL_UNIFIED_CUTOFFS } from '../data/officialData';

interface SpecialtiesExplorerProps {
  onOpenAssistant: (query?: string) => void;
  onAddToComparison: (item: ComparisonItem) => void;
  onAddToDraft: (item: ScoreMatchItem) => void;
  comparisonItems: ComparisonItem[];
  draftItems: ScoreMatchItem[];
}

export const SpecialtiesExplorer: React.FC<SpecialtiesExplorerProps> = ({
  onOpenAssistant,
  onAddToComparison,
  onAddToDraft,
  comparisonItems,
  draftItems,
}) => {
  // Sector toggle: 'الكل' (جميع التخصصات الـ 109) | 'حكومي' | 'أهلي'
  const [sector, setSector] = useState<'الكل' | 'حكومي' | 'أهلي'>('الكل');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('spec-med-general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedBranch, setSelectedBranch] = useState<StudyBranch | 'الكل'>('الكل');
  const [showUniversitiesModal, setShowUniversitiesModal] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [governorateFilter, setGovernorateFilter] = useState<string>('الكل');

  // Choose specialty list based on selected sector
  const specialtiesList = useMemo(() => {
    if (sector === 'حكومي') return ALL_GOVERNMENT_SPECIALTIES;
    if (sector === 'أهلي') return ALL_PRIVATE_SPECIALTIES;
    return ALL_109_SPECIALTIES;
  }, [sector]);

  // When sector changes, default selected specialty to the first item
  const handleSectorChange = (newSector: 'الكل' | 'حكومي' | 'أهلي') => {
    setSector(newSector);
    const list = newSector === 'حكومي'
      ? ALL_GOVERNMENT_SPECIALTIES
      : newSector === 'أهلي'
        ? ALL_PRIVATE_SPECIALTIES
        : ALL_109_SPECIALTIES;
    if (list.length > 0) {
      setSelectedSpecialtyId(list[0].id);
    }
  };

  // Filter specialties list
  const filteredSpecialties = useMemo(() => {
    return specialtiesList.filter((spec) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = spec.name.toLowerCase().includes(q);
        const matchesDesc = spec.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      if (selectedCategory !== 'الكل' && spec.category !== selectedCategory) {
        return false;
      }
      if (selectedBranch !== 'الكل' && !spec.eligibleBranches.includes(selectedBranch as StudyBranch)) {
        return false;
      }
      return true;
    });
  }, [specialtiesList, searchQuery, selectedCategory, selectedBranch]);

  // Active selected specialty
  const activeSpecialty = useMemo(() => {
    const found = specialtiesList.find((s) => s.id === selectedSpecialtyId);
    if (found) return found;
    return specialtiesList[0];
  }, [specialtiesList, selectedSpecialtyId]);

  // Find official unified cutoff limits from Ministry Guide
  const unifiedCutoff = useMemo(() => {
    if (!activeSpecialty) return null;
    const name = activeSpecialty.name.toLowerCase();
    return OFFICIAL_UNIFIED_CUTOFFS.find((entry) => {
      const eName = entry.categoryOrSpecialty.toLowerCase();
      return (
        name.includes(eName) ||
        eName.includes(name) ||
        (activeSpecialty.category && eName.includes(activeSpecialty.category.toLowerCase()))
      );
    });
  }, [activeSpecialty]);

  // Find all universities/institutes offering the selected specialty
  const offeringUniversities = useMemo(() => {
    if (!activeSpecialty) return [];

    const norm = activeSpecialty.name.toLowerCase();
    const keywords = norm
      .replace(/[\(\)]/g, '')
      .split(' ')
      .filter((w) => w.length > 2 && !['في', 'من', 'أو', 'على', 'عام', 'الأهلية', 'المعتمدة', 'الكليات', 'والجامعات'].includes(w));

    const list: any[] = [];

    if (sector === 'حكومي' || sector === 'الكل') {
      GOVERNMENT_UNIVERSITIES.forEach((uni) => {
        if (governorateFilter !== 'الكل' && uni.governorate !== governorateFilter) return;

        uni.departments.forEach((dept) => {
          const deptName = dept.name.toLowerCase();
          const matches =
            deptName.includes(norm) ||
            norm.includes(deptName) ||
            keywords.some((k) => deptName.includes(k));

          if (matches) {
            list.push({
              ...dept,
              universityShortName: uni.shortName,
              campusLocation: uni.campusLocation,
              establishedYear: uni.establishedYear,
              website: uni.website,
              type: 'حكومي' as const,
            });
          }
        });
      });
    }

    if (sector === 'أهلي' || sector === 'الكل') {
      PRIVATE_UNIVERSITIES.forEach((uni) => {
        if (governorateFilter !== 'الكل' && uni.governorate !== governorateFilter) return;

        uni.departments.forEach((dept) => {
          const deptName = dept.name.toLowerCase();
          const matches =
            deptName.includes(norm) ||
            norm.includes(deptName) ||
            keywords.some((k) => deptName.includes(k));

          if (matches) {
            list.push({
              ...dept,
              universityShortName: uni.shortName,
              campusLocation: uni.campusLocation,
              establishedYear: uni.establishedYear,
              website: uni.website,
              type: 'أهلي' as const,
            });
          }
        });
      });
    }

    return list.sort((a, b) =>
      sortOrder === 'desc' ? b.cutoffMorning - a.cutoffMorning : a.cutoffMorning - b.cutoffMorning
    );
  }, [activeSpecialty, sector, governorateFilter, sortOrder]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Card with Apple Aesthetics */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E5EA] shadow-xs p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">
              <BookOpen className="w-4 h-4" />
              منصة مَجَرّة • الدليل الشامل للتخصصات والأقسام
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1D1D1F]">
              قائمة التخصصات والأقسام
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              اختر أي تخصص للاطلاع على نبذته الكاملة، الشهادة الممنوحة، الفروع المقبولة، ومجالات العمل، ثم اضغط على زر الجامعات لعرض كل الكليات والمعاهد التي يتوفر بها ومعدلات قبولها.
            </p>
            <div className="text-xs font-bold text-[#0071E3] pt-1">
              صُنع بواسطة المهندس مهدي عصام
            </div>
          </div>

          {/* Sector Toggle: [ الكل (109 تخصصات) | حكومي | أهلي ] */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs font-bold text-[#86868B]">حدد نطاق العرض:</span>
            <div className="inline-flex p-1.5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] shadow-xs">
              <button
                type="button"
                onClick={() => handleSectorChange('الكل')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  sector === 'الكل'
                    ? 'bg-[#1D1D1F] text-white shadow-sm'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>جميع التخصصات (109)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSectorChange('حكومي')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  sector === 'حكومي'
                    ? 'bg-[#0071E3] text-white shadow-sm'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>التعليم الحكومي</span>
              </button>
              <button
                type="button"
                onClick={() => handleSectorChange('أهلي')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  sector === 'أهلي'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>التعليم الأهلي</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-8 pt-6 border-t border-[#F5F5F7] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">ابحث باسم التخصص:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="مثال: هندسة تقنيات الأجهزة الطبية، صيدلة، تمريض..."
                className="w-full text-xs font-medium py-2.5 px-3 pl-8 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white focus:outline-none transition-all text-[#1D1D1F]"
              />
              <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">المجال الأكاديمي:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
            >
              <option value="الكل">جميع المجالات والتخصصات</option>
              {MAJOR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">فلترة حسب الفرع الدراسي:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as any)}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
            >
              <option value="الكل">جميع الفروع (علمي، أحيائي، تطبيقي، أدبي، مهني...)</option>
              {STUDY_BRANCHES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Specialties Selection Carousel / Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#86868B]">
          <span>اختر تخصصاً من قائمة {sector === 'حكومي' ? 'التعليم الحكومي' : 'التعليم الأهلي'} ({filteredSpecialties.length}):</span>
          <span className="text-[11px] text-[#0071E3]">انقر للاطلاع على التفاصيل والجامعات</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filteredSpecialties.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialtyId(spec.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedSpecialtyId === spec.id
                  ? sector === 'حكومي'
                    ? 'bg-[#0071E3] text-white shadow-md'
                    : 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-[#1D1D1F] border border-[#E5E5EA] hover:border-[#0071E3]/40'
              }`}
            >
              <span>{spec.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Specialty Detailed Card */}
      {activeSpecialty && (
        <div className="rounded-3xl bg-white border border-[#E5E5EA] shadow-xs overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#F5F5F7] pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      sector === 'حكومي'
                        ? 'bg-blue-50 text-[#0071E3] border border-blue-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {sector === 'حكومي' ? 'تخصص حكومي رسمي' : 'تخصص أهلي معتمد'}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F7] text-[#515154]">
                    الشهادة: {activeSpecialty.degreeAwarded}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F7] text-[#515154] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeSpecialty.yearsOfStudy} سنوات دراسية
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F]">
                  {activeSpecialty.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#515154] leading-relaxed max-w-4xl">
                  {activeSpecialty.description}
                </p>
              </div>

              {/* Action: Ask AI about this specialty */}
              <button
                type="button"
                onClick={() =>
                  onOpenAssistant(
                    `أريد معرفة تفاصيل شاملة عن تخصص ${activeSpecialty.name} (${sector}): شروط القبول، المواد الدراسية، مستقبل الوظائف، والجامعات الموصى بها؟`
                  )
                }
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] text-xs font-bold transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                استشر مساعد مجرّة عن هذا التخصص
              </button>
            </div>

            {/* Official Ministry Limits Bar from Guide & Data */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-[#F5F5F7] to-emerald-50/70 border border-[#E5E5EA] space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-[#1D1D1F]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0071E3]" />
                  <span>المعدلات والأقساط الرسمية المعتمدة بوزارة التعليم العالي العراقي لسنة 2026-2027:</span>
                </div>
                <span className="text-[11px] font-semibold text-[#86868B]">
                  بيانات رسمية معتمدة
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-white p-3 rounded-xl border border-[#E5E5EA] shadow-2xs">
                  <span className="text-[#86868B] block text-[11px]">حكومي صباحي (مركزي):</span>
                  <strong className="text-base font-black text-[#0071E3]">
                    {activeSpecialty.minimumCutoffGov ? `${activeSpecialty.minimumCutoffGov}%` : unifiedCutoff?.govMorningScientific ? `${unifiedCutoff.govMorningScientific}%` : 'تفاضلي'}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E5EA] shadow-2xs">
                  <span className="text-[#86868B] block text-[11px]">موازي حكومي (تعليم خاص):</span>
                  <strong className="text-base font-black text-[#1D1D1F]">
                    {activeSpecialty.minimumCutoffGov ? `${Math.max(50, activeSpecialty.minimumCutoffGov - 3).toFixed(1)}%` : unifiedCutoff?.govEveningScientific ? `${unifiedCutoff.govEveningScientific}%` : 'أقل بـ 3 درجات'}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E5EA] shadow-2xs">
                  <span className="text-[#86868B] block text-[11px]">أهلي (صباحي / مسائي):</span>
                  <strong className="text-base font-black text-emerald-700">
                    {activeSpecialty.minimumCutoffPrivate ? `${activeSpecialty.minimumCutoffPrivate}%` : unifiedCutoff?.privateMorningScientific ? `${unifiedCutoff.privateMorningScientific}%` : 'غير متوفر'}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E5E5EA] shadow-2xs">
                  <span className="text-[#86868B] block text-[11px]">متوسط الأقساط الأهلية:</span>
                  <strong className="text-sm font-black text-emerald-800">
                    {activeSpecialty.averageTuitionFeePrivate ? `${activeSpecialty.averageTuitionFeePrivate.toLocaleString('en-US')} د.ع` : 'حكومي مجاني'}
                  </strong>
                </div>
              </div>
            </div>

            {/* 3 Detail Columns: Branches, Career, Employment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col 1: Eligible Branches */}
              <div className="p-4 rounded-2xl bg-[#F5F5F7] space-y-2 border border-[#E5E5EA]">
                <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  الفروع الإعدادية المشمولة بالتقديم:
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeSpecialty.eligibleBranches.map((br) => (
                    <span
                      key={br}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-[#E5E5EA] text-[#1D1D1F]"
                    >
                      {br}
                    </span>
                  ))}
                </div>
              </div>

              {/* Col 2: Employment Status */}
              <div className="p-4 rounded-2xl bg-[#F5F5F7] space-y-2 border border-[#E5E5EA]">
                <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
                  موقف التعيين ونقابات المهنة:
                </h4>
                <p className="text-xs text-[#515154] leading-relaxed">
                  {activeSpecialty.employmentStatus}
                </p>
              </div>

              {/* Col 3: Career Paths */}
              <div className="p-4 rounded-2xl bg-[#F5F5F7] space-y-2 border border-[#E5E5EA]">
                <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  مجالات العمل والوظائف:
                </h4>
                <ul className="text-xs text-[#515154] space-y-1 list-disc list-inside">
                  {activeSpecialty.careerPaths.map((cp, idx) => (
                    <li key={idx}>{cp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PROMINENT ICON & BUTTON: Universities Offering This Specialty */}
            <div className="pt-6 border-t border-[#F5F5F7] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                      sector === 'حكومي' ? 'bg-[#0071E3]' : 'bg-emerald-600'
                    }`}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#1D1D1F]">
                      الجامعات والمعاهد التي تضم تخصص ({activeSpecialty.name})
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      يتوفر في ({offeringUniversities.length}) مؤسسة تعليمية {sector === 'حكومي' ? 'حكومية' : 'أهلية معترف بها'}
                    </p>
                  </div>
                </div>

                {/* Filter and Sort inside universities */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <select
                    value={governorateFilter}
                    onChange={(e) => setGovernorateFilter(e.target.value)}
                    className="text-xs font-bold py-2 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
                  >
                    <option value="الكل">كل المحافظات</option>
                    {IRAQI_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
                    className="flex items-center gap-1.5 text-xs text-[#1D1D1F] font-bold bg-[#F5F5F7] border border-[#E5E5EA] px-3.5 py-2 rounded-xl"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortOrder === 'desc' ? 'الأعلى معدلاً' : 'الأقل معدلاً'}
                  </button>
                </div>
              </div>

              {/* Universities List Grid */}
              {offeringUniversities.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#F5F5F7] text-center text-xs text-[#86868B]">
                  لا تتوفر جامعات مطابقة للفلترة الحالية لهذا التخصص.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {offeringUniversities.map((item) => {
                    const isCompared = comparisonItems.some((c) => c.id === item.id);
                    const isDrafted = draftItems.some((d) => d.id === item.id);

                    return (
                      <div
                        key={`${item.universityId}-${item.id}`}
                        className="flex flex-col justify-between rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-5 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                item.type === 'حكومي'
                                  ? 'bg-blue-50 text-[#0071E3]'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {item.type === 'حكومي' ? 'حكومي رسمي' : 'أهلي معتمد'}
                            </span>
                            <span className="text-xs text-[#86868B] flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.governorate}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-[#1D1D1F]">
                              {item.universityName}
                            </h4>
                            <p className="text-xs text-[#86868B] mt-0.5 font-medium">
                              {item.collegeName}
                            </p>
                          </div>

                          {/* Scores & Fees Block */}
                          <div className="p-3.5 rounded-xl bg-[#F5F5F7] space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[#86868B]">الحد الأدنى صباحي:</span>
                              <span className={`font-black text-sm ${item.type === 'حكومي' ? 'text-[#0071E3]' : 'text-emerald-700'}`}>
                                {item.cutoffMorning.toFixed(1)}
                              </span>
                            </div>

                            {item.cutoffParallel && (
                              <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                                <span className="text-[#86868B]">التعليم الموازي:</span>
                                <span className="font-bold text-[#1D1D1F]">
                                  {item.cutoffParallel.toFixed(1)}
                                </span>
                              </div>
                            )}

                            {item.cutoffEvening && (
                              <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                                <span className="text-[#86868B]">الحد الأدنى مسائي:</span>
                                <span className="font-bold text-[#1D1D1F]">
                                  {item.cutoffEvening.toFixed(1)}
                                </span>
                              </div>
                            )}

                            {item.tuitionFeeMorning && (
                              <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                                <span className="text-[#86868B]">القسط السنوي صباحي:</span>
                                <span className="font-extrabold text-emerald-800">
                                  {(item.tuitionFeeMorning / 1000000).toFixed(2)} مليون د.ع
                                </span>
                              </div>
                            )}

                            {item.tuitionFeeEvening && (
                              <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                                <span className="text-[#86868B]">القسط السنوي مسائي:</span>
                                <span className="font-bold text-[#1D1D1F]">
                                  {(item.tuitionFeeEvening / 1000000).toFixed(2)} مليون د.ع
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Eligible Branches if available */}
                          {item.eligibleBranches && item.eligibleBranches.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[#86868B] block">الفروع المقبولة:</span>
                              <div className="flex flex-wrap gap-1">
                                {item.eligibleBranches.map((br: any) => (
                                  <span
                                    key={br}
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#1D1D1F]"
                                  >
                                    {br}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-[#F5F5F7] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onAddToDraft({
                                id: item.id,
                                name: item.name,
                                collegeName: item.collegeName,
                                universityName: item.universityName,
                                universityId: item.universityId,
                                type: item.type,
                                governorate: item.governorate,
                                category: item.category,
                                cutoffMorning: item.cutoffMorning,
                                cutoffParallel: item.cutoffParallel,
                                cutoffEvening: item.cutoffEvening,
                                tuitionFeeMorning: item.tuitionFeeMorning,
                                tuitionFeeEvening: item.tuitionFeeEvening,
                                yearsOfStudy: item.yearsOfStudy,
                                matchTier: 'guaranteed',
                                scoreDifference: 0,
                                eligibleBranches: item.eligibleBranches,
                                shift: item.shift || 'صباحي',
                                careerPath: item.careerPath,
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
                                + مسودة الاستمارة
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                onAddToComparison({
                                  id: item.id,
                                  name: item.name,
                                  collegeName: item.collegeName,
                                  universityName: item.universityName,
                                  type: item.type,
                                  governorate: item.governorate,
                                  category: item.category,
                                  cutoffMorning: item.cutoffMorning,
                                  cutoffParallel: item.cutoffParallel,
                                  cutoffEvening: item.cutoffEvening,
                                  tuitionFeeMorning: item.tuitionFeeMorning,
                                  yearsOfStudy: item.yearsOfStudy,
                                  eligibleBranches: item.eligibleBranches,
                                  careerPath: item.careerPath,
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
                                  `ما هي خطة القبول في ${item.name} بكلية ${item.collegeName} في ${item.universityName} (${item.type})؟ وما هي نصائح التقديم؟`
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
        </div>
      )}
    </div>
  );
};
