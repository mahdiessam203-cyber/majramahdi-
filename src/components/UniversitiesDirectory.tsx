import React, { useState, useMemo } from 'react';
import {
  Building2,
  GraduationCap,
  MapPin,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  Clock,
  Coins,
  Sparkles,
  Scale,
  Plus,
  Check,
  Award,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Filter,
  BookOpen
} from 'lucide-react';
import {
  GovernmentUniversity,
  PrivateUniversity,
  StudyBranch,
  ComparisonItem,
  ScoreMatchItem,
} from '../types';
import {
  GOVERNMENT_UNIVERSITIES,
  PRIVATE_UNIVERSITIES,
  IRAQI_GOVERNORATES,
  STUDY_BRANCHES,
} from '../data/iraqiUniversitiesData';

interface UniversitiesDirectoryProps {
  onOpenAssistant: (query?: string) => void;
  onAddToComparison: (item: ComparisonItem) => void;
  onAddToDraft: (item: ScoreMatchItem) => void;
  comparisonItems: ComparisonItem[];
  draftItems: ScoreMatchItem[];
}

export const UniversitiesDirectory: React.FC<UniversitiesDirectoryProps> = ({
  onOpenAssistant,
  onAddToComparison,
  onAddToDraft,
  comparisonItems,
  draftItems,
}) => {
  // Sector choice: strictly separate Government vs Private
  const [sector, setSector] = useState<'حكومي' | 'أهلي'>('حكومي');
  const [govCategoryFilter, setGovCategoryFilter] = useState<'الكل' | 'جامعات' | 'تقنية ومعاهد' | 'عسكرية وأمنية ونفطية' | 'كليات الوقفين'>('الكل');
  const [privateRegionFilter, setPrivateRegionFilter] = useState<'الكل' | 'الاتحادي' | 'كردستان'>('الكل');
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('u-baghdad');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<StudyBranch | 'الكل'>('الكل');
  const [departmentSearch, setDepartmentSearch] = useState<string>('');

  // Handle switching sector
  const handleSectorChange = (newSector: 'حكومي' | 'أهلي') => {
    setSector(newSector);
    if (newSector === 'حكومي') {
      setSelectedUniversityId('u-baghdad');
    } else {
      setSelectedUniversityId('p-bayan');
    }
  };

  // Filter universities based on sector, search, and governorate
  const universitiesList = useMemo(() => {
    const list = sector === 'حكومي' ? GOVERNMENT_UNIVERSITIES : PRIVATE_UNIVERSITIES;
    return list.filter((uni) => {
      if (sector === 'حكومي' && govCategoryFilter !== 'الكل') {
        const isMilitaryOrSecurityOrOil =
          uni.id.startsWith('inst-oil') ||
          uni.id.startsWith('inst-police') ||
          uni.id.startsWith('inst-military') ||
          uni.id.startsWith('inst-air') ||
          uni.id.startsWith('inst-higher') ||
          uni.id.startsWith('inst-national') ||
          uni.name.includes('الشرطة') ||
          uni.name.includes('العسكرية') ||
          uni.name.includes('النفطي') ||
          uni.name.includes('الأمن') ||
          uni.name.includes('الدفاع');

        const isWaqf =
          uni.id.startsWith('u-imam') ||
          uni.name.includes('الوقف') ||
          uni.name.includes('الكاظم') ||
          uni.name.includes('الأعظم');

        const isTechnicalOrInstitute =
          !isMilitaryOrSecurityOrOil &&
          !isWaqf &&
          (uni.name.includes('التقنية') ||
            uni.name.includes('معاهد') ||
            uni.departments.some(
              (d) =>
                d.name.includes('دبلوم') ||
                d.collegeName.includes('معهد') ||
                d.collegeName.includes('التقنية')
            ));

        if (govCategoryFilter === 'عسكرية وأمنية ونفطية' && !isMilitaryOrSecurityOrOil) return false;
        if (govCategoryFilter === 'كليات الوقفين' && !isWaqf) return false;
        if (govCategoryFilter === 'تقنية ومعاهد' && !isTechnicalOrInstitute) return false;
        if (govCategoryFilter === 'جامعات' && (isTechnicalOrInstitute || isMilitaryOrSecurityOrOil || isWaqf))
          return false;
      }
      if (sector === 'أهلي' && privateRegionFilter !== 'الكل') {
        const uniRegion = (uni as any).region || ((uni as any).isKurdistanRegion ? 'كردستان' : 'الاتحادي');
        if (uniRegion !== privateRegionFilter) return false;
      }
      if (selectedGovernorate !== 'الكل' && uni.governorate !== selectedGovernorate) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = uni.name.toLowerCase().includes(q) || uni.shortName.toLowerCase().includes(q);
        const matchesDesc = uni.description.toLowerCase().includes(q);
        const matchesLocation = uni.campusLocation.toLowerCase().includes(q);
        const matchesDept = uni.departments.some(d => d.name.toLowerCase().includes(q) || d.collegeName.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesLocation && !matchesDept) return false;
      }
      return true;
    });
  }, [sector, govCategoryFilter, privateRegionFilter, selectedGovernorate, searchQuery]);

  // Selected University data
  const selectedUniversity = useMemo(() => {
    const list = sector === 'حكومي' ? GOVERNMENT_UNIVERSITIES : PRIVATE_UNIVERSITIES;
    const found = list.find((u) => u.id === selectedUniversityId);
    if (found) return found;
    return list[0];
  }, [sector, selectedUniversityId]);

  // Filtered departments inside selected university
  const filteredDepartments = useMemo(() => {
    if (!selectedUniversity) return [];
    return selectedUniversity.departments.filter((dept) => {
      if (departmentSearch.trim()) {
        const q = departmentSearch.toLowerCase().trim();
        const matchesName = dept.name.toLowerCase().includes(q);
        const matchesCollege = dept.collegeName.toLowerCase().includes(q);
        if (!matchesName && !matchesCollege) return false;
      }
      if (selectedBranchFilter !== 'الكل' && !dept.eligibleBranches.includes(selectedBranchFilter as StudyBranch)) {
        return false;
      }
      return true;
    });
  }, [selectedUniversity, departmentSearch, selectedBranchFilter]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Card with Apple Aesthetics */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E5EA] shadow-xs p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">
              <Building2 className="w-4 h-4" />
              منصة مَجَرّة • الدليل الرسمي للجامعات والمعاهد
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1D1D1F]">
              الجامعات والمعاهد
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              اختر نوع التعليم (حكومي أو أهلي)، ثم حدد أي جامعة أو معهد للاطلاع على معلوماتها الكاملة، موقعها الجغرافي، ونبذتها التأسيسية، وكافة الأقسام المتاحة ومعدلات القبول والأقساط والفروع المقبولة.
            </p>
            <div className="text-xs font-bold text-[#0071E3] pt-1">
              صُنع بواسطة المهندس مهدي عصام
            </div>
          </div>

          {/* Sector Toggle: [ التعليم الحكومي | التعليم الأهلي ] */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs font-bold text-[#86868B]">حدد نوع التعليم (عزل كامل):</span>
            <div className="inline-flex p-1.5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] shadow-xs">
              <button
                type="button"
                onClick={() => handleSectorChange('حكومي')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
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

        {/* Government Category Selector (48 Total: Universities vs Polytechnic vs Military/Security/Oil vs Waqf) */}
        {sector === 'حكومي' && (
          <div className="mt-6 pt-4 border-t border-[#F5F5F7] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#86868B]">تصنيف المؤسسات الحكومية:</span>
            <div className="inline-flex flex-wrap p-1 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] gap-1">
              <button
                type="button"
                onClick={() => setGovCategoryFilter('الكل')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  govCategoryFilter === 'الكل'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                الكل (48)
              </button>
              <button
                type="button"
                onClick={() => setGovCategoryFilter('جامعات')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  govCategoryFilter === 'جامعات'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                الجامعات الأكاديمية (30)
              </button>
              <button
                type="button"
                onClick={() => setGovCategoryFilter('تقنية ومعاهد')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  govCategoryFilter === 'تقنية ومعاهد'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                الجامعات التقنية والمعاهد (4)
              </button>
              <button
                type="button"
                onClick={() => setGovCategoryFilter('عسكرية وأمنية ونفطية')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  govCategoryFilter === 'عسكرية وأمنية ونفطية'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                عسكرية وأمنية ونفطية (12)
              </button>
              <button
                type="button"
                onClick={() => setGovCategoryFilter('كليات الوقفين')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  govCategoryFilter === 'كليات الوقفين'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                كليات الوقفين (2)
              </button>
            </div>
          </div>
        )}

        {/* Private Region Selector (75 Federal + 14 Kurdistan) */}
        {sector === 'أهلي' && (
          <div className="mt-6 pt-4 border-t border-[#F5F5F7] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#86868B]">تصنيف الجامعات والكليات الأهلية:</span>
            <div className="inline-flex p-1 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]">
              <button
                type="button"
                onClick={() => {
                  setPrivateRegionFilter('الكل');
                  setSelectedGovernorate('الكل');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  privateRegionFilter === 'الكل'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                جميع الجامعات والكليات الأهلية (89)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrivateRegionFilter('الاتحادي');
                  if (['أربيل', 'السليمانية', 'دهوك'].includes(selectedGovernorate)) {
                    setSelectedGovernorate('الكل');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  privateRegionFilter === 'الاتحادي'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                كليات وجامعات المحافظات الاتحادية (75)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrivateRegionFilter('كردستان');
                  if (!['أربيل', 'السليمانية', 'دهوك'].includes(selectedGovernorate)) {
                    setSelectedGovernorate('الكل');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  privateRegionFilter === 'كردستان'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#515154] hover:text-[#1D1D1F]'
                }`}
              >
                جامعات وكليات إقليم كردستان (14)
              </button>
            </div>
          </div>
        )}

        {/* Search & Governorate Filters */}
        <div className="mt-6 pt-4 border-t border-[#F5F5F7] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">
              ابحث باسم الجامعة أو المعهد أو الكلية:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="مثال: جامعة بغداد، الجامعة التكنولوجية، التقنية الوسطى، جامعة البيان..."
                className="w-full text-xs font-medium py-2.5 px-3 pl-8 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white focus:outline-none transition-all text-[#1D1D1F]"
              />
              <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#86868B] mb-1">
              المحافظة:
            </label>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
            >
              <option value="الكل">جميع المحافظات العراقية</option>
              {IRAQI_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Layout: Master List of Universities (Horizontal pills / selector) + Detail View of Selected University */}
      <div className="space-y-6">
        {/* Universities Selector Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#86868B]">
            <span>
              اختر {sector === 'حكومي' ? 'جامعة أو معهد حكومي' : 'جامعة أو كلية أهلية'} ({universitiesList.length} مؤسسة):
            </span>
            <span className="text-[11px] text-[#0071E3]">
              انقر للاطلاع على معلومات الجامعة وأقسامها
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {universitiesList.map((uni) => {
              const isSelected = selectedUniversity?.id === uni.id;
              return (
                <button
                  key={uni.id}
                  onClick={() => setSelectedUniversityId(uni.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? sector === 'حكومي'
                        ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-md'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-[#1D1D1F] border-[#E5E5EA] hover:border-[#0071E3]/40'
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#86868B]'}`} />
                  <span>{uni.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#86868B]'
                  }`}>
                    {uni.governorate}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected University Comprehensive Card */}
        {selectedUniversity && (
          <div className="rounded-3xl bg-white border border-[#E5E5EA] shadow-xs overflow-hidden">
            {/* University Bio & Location Header */}
            <div className="p-6 sm:p-8 space-y-6 border-b border-[#F5F5F7]">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        sector === 'حكومي'
                          ? 'bg-blue-50 text-[#0071E3] border border-blue-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {sector === 'حكومي' ? 'جامعة / معهد حكومي' : 'جامعة / كلية أهلية معتمدة'}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F7] text-[#515154] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
                      المحافظة: {selectedUniversity.governorate}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F7] text-[#515154] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      تأسست سنة {selectedUniversity.establishedYear}
                    </span>
                    {'recognitionStatus' in selectedUniversity && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedUniversity.recognitionStatus}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F]">
                    {selectedUniversity.name}
                  </h2>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#86868B]">
                    <span className="text-[#1D1D1F] font-bold">الموقع والحرم الجامعي:</span>
                    <span>{selectedUniversity.campusLocation}</span>
                  </div>

                  {'branches' in selectedUniversity && selectedUniversity.branches && selectedUniversity.branches.length > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <span>فروع ومقرات الجامعة الرسمية في المحافظات ({selectedUniversity.branches.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedUniversity.branches.map((br, bIdx) => (
                          <span
                            key={bIdx}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-950 shadow-2xs"
                          >
                            {br}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[#515154] leading-relaxed max-w-4xl pt-1">
                    {selectedUniversity.description}
                  </p>
                </div>

                {/* Right Action buttons: Website & AI Assistant */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                  {selectedUniversity.website && (
                    <a
                      href={selectedUniversity.website}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#E5E5EA]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>الموقع الرسمي للجامعة</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onOpenAssistant(
                        `ما هي ميزات وأقسام ${selectedUniversity.name} (${sector})؟ وما هي معدلات القبول وأفضل الخيارات للتقديم فيها؟`
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>اسأل مساعد مجرّة عن هذه الجامعة</span>
                  </button>
                </div>
              </div>
            </div>

            {/* University Departments Section */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1D1D1F] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0071E3]" />
                    <span>الأقسام والتخصصات المتوفرة في {selectedUniversity.name}</span>
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    إجمالي ({selectedUniversity.departments.length}) تخصص معتمد ومفصل مع الحدود الدنيا والأقساط والفروع
                  </p>
                </div>

                {/* Filter within departments */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={departmentSearch}
                      onChange={(e) => setDepartmentSearch(e.target.value)}
                      placeholder="ابحث في أقسام الجامعة..."
                      className="text-xs font-medium py-2 px-3 pl-7 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white focus:outline-none text-[#1D1D1F]"
                    />
                    <Search className="w-3 h-3 text-[#86868B] absolute left-2 top-2.5" />
                  </div>

                  <select
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value as any)}
                    className="text-xs font-semibold py-2 px-3 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-1 focus:ring-[#0071E3]"
                  >
                    <option value="الكل">جميع الفروع المقبولة</option>
                    {STUDY_BRANCHES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Departments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDepartments.map((dept) => {
                  const isGovernment = sector === 'حكومي';
                  const isCompared = comparisonItems.some((c) => c.id === dept.id);
                  const isDrafted = draftItems.some((d) => d.id === dept.id);

                  // Extract fees and cutoffs
                  const morningCutoff = dept.cutoffMorning;
                  const parallelCutoff = 'cutoffParallel' in dept ? (dept as any).cutoffParallel : null;
                  const eveningCutoff = dept.cutoffEvening;
                  const parallelFee = 'annualFeeParallel' in dept ? (dept as any).annualFeeParallel : null;
                  const morningFee = 'tuitionFeeMorning' in dept ? (dept as any).tuitionFeeMorning : null;
                  const eveningFee = 'tuitionFeeEvening' in dept ? (dept as any).tuitionFeeEvening : null;

                  return (
                    <div
                      key={dept.id}
                      className="rounded-2xl border border-[#E5E5EA] bg-[#FFFFFF] p-5 flex flex-col justify-between hover:shadow-md hover:border-[#0071E3]/30 transition-all group"
                    >
                      <div className="space-y-3">
                        {/* Header: College & Category */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#515154] truncate">
                            {dept.collegeName}
                          </span>
                          <span className="text-[10px] font-semibold text-[#86868B] shrink-0">
                            {dept.yearsOfStudy} سنوات
                          </span>
                        </div>

                        {/* Department Name */}
                        <h4 className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors leading-snug">
                          {dept.name}
                        </h4>

                        {/* Cutoffs & Fees Badge Box */}
                        <div className="p-3 rounded-xl bg-[#F5F5F7] space-y-2 text-xs">
                          {/* Morning Cutoff */}
                          <div className="flex items-center justify-between">
                            <span className="text-[#86868B]">الحد الأدنى صباحي:</span>
                            <span className={`font-black text-sm ${isGovernment ? 'text-[#0071E3]' : 'text-emerald-700'}`}>
                              {morningCutoff.toFixed(1)}
                            </span>
                          </div>

                          {/* Parallel if Government */}
                          {isGovernment && parallelCutoff && (
                            <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                              <span className="text-[#86868B]">الموازي الصباحي:</span>
                              <span className="font-bold text-[#1D1D1F]">
                                {parallelCutoff.toFixed(1)}
                                {parallelFee && (
                                  <span className="text-[10px] text-[#86868B] mr-1">
                                    ({(parallelFee / 1000).toLocaleString('ar-IQ')} ألف د.ع)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}

                          {/* Evening Cutoff */}
                          {eveningCutoff && (
                            <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                              <span className="text-[#86868B]">الحد الأدنى مسائي:</span>
                              <span className="font-bold text-[#1D1D1F]">
                                {eveningCutoff.toFixed(1)}
                              </span>
                            </div>
                          )}

                          {/* Private Tuition Fees */}
                          {!isGovernment && morningFee && (
                            <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                              <span className="text-[#86868B]">القسط السنوي صباحي:</span>
                              <span className="font-extrabold text-emerald-800">
                                {(morningFee / 1000000).toFixed(2)} مليون د.ع
                              </span>
                            </div>
                          )}

                          {!isGovernment && eveningFee && (
                            <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-1.5">
                              <span className="text-[#86868B]">القسط السنوي مسائي:</span>
                              <span className="font-bold text-[#1D1D1F]">
                                {(eveningFee / 1000000).toFixed(2)} مليون د.ع
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Eligible Branches */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#86868B] block">الفروع المقبولة:</span>
                          <div className="flex flex-wrap gap-1">
                            {dept.eligibleBranches.map((br) => (
                              <span
                                key={br}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#1D1D1F]"
                              >
                                {br}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Career Path / Note */}
                        {dept.careerPath && (
                          <p className="text-[11px] text-[#86868B] line-clamp-2 leading-relaxed">
                            {dept.careerPath}
                          </p>
                        )}
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
                              type: sector,
                              governorate: dept.governorate,
                              category: dept.category,
                              cutoffMorning: dept.cutoffMorning,
                              cutoffParallel: parallelCutoff || undefined,
                              cutoffEvening: dept.cutoffEvening || undefined,
                              tuitionFeeMorning: morningFee || parallelFee || undefined,
                              tuitionFeeEvening: eveningFee || undefined,
                              yearsOfStudy: dept.yearsOfStudy,
                              matchTier: 'guaranteed',
                              scoreDifference: 0,
                              eligibleBranches: dept.eligibleBranches,
                              shift: ('shift' in dept ? (dept as any).shift : 'صباحي') || 'صباحي',
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
                              + مسودة الاستمارة
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
                                type: sector,
                                governorate: dept.governorate,
                                category: dept.category,
                                cutoffMorning: dept.cutoffMorning,
                                cutoffParallel: parallelCutoff || undefined,
                                cutoffEvening: dept.cutoffEvening || undefined,
                                tuitionFeeMorning: morningFee || parallelFee || undefined,
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
                                `ما هي شروط وخطة القبول في قسم ${dept.name} بكلية ${dept.collegeName} في ${dept.universityName}؟ وما هي تفاصيل التعيين والمستقبل الوظيفي؟`
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

              {filteredDepartments.length === 0 && (
                <div className="text-center py-12 bg-[#F5F5F7] rounded-2xl">
                  <p className="text-xs text-[#86868B] font-semibold">
                    لا توجد أقسام مطابقة للبحث أو الفلترة في هذه الجامعة حالياً.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
