export type StudyBranch =
  | 'علمي'
  | 'أحيائي'
  | 'تطبيقي'
  | 'أدبي'
  | 'صناعي'
  | 'حاسوب وتقنية معلومات'
  | 'تجاري'
  | 'زراعي'
  | 'فنون'
  | 'تمريض مهني'
  | 'مهني'
  | 'إسلامي';

export type EducationPreference = 'الكل' | 'حكومي' | 'أهلي';
export type ShiftType = 'صباحي' | 'مسائي' | 'كلاهما';

export type MajorCategory =
  | 'الطب والعلوم الصحية'
  | 'الهندسة والتكنولوجيا'
  | 'علوم الحاسوب والذكاء الاصطناعي'
  | 'العلوم الصرفة والتطبيقية'
  | 'القانون والعلوم السياسية'
  | 'الإدارة والاقتصاد والمالية'
  | 'الآداب واللغات والتربية'
  | 'الإعلام والفنون'
  | 'الزراعة والطب البيطري'
  | 'المعاهد الطبية والتكنولوجية'
  | 'الكليات والمعاهد العسكرية والأمنية والنفطية';

export interface GovernmentDepartment {
  id: string;
  name: string;
  collegeName: string;
  universityName: string;
  universityId: string;
  governorate: string;
  category: MajorCategory;
  cutoffMorning: number; // الحد الأدنى صباحي مركزي
  cutoffParallel?: number; // الحد الأدنى الموازي (عادة أقل بـ 2-4 درجات)
  cutoffEvening?: number; // الحد الأدنى مسائي حكومي إن وجد
  eligibleBranches: StudyBranch[];
  yearsOfStudy: number;
  shift: ShiftType;
  careerPath: string;
  notes?: string;
  annualFeeParallel?: number; // قسط الموازي بالدينار العراقي (مخفض بنسبة 50%)
}

export interface GovernmentUniversity {
  id: string;
  name: string;
  shortName: string;
  governorate: string;
  type: 'حكومي';
  establishedYear: number;
  description: string;
  campusLocation: string;
  website?: string;
  collegesCount: number;
  branches?: string[]; // فروع ومقرات الجامعة
  departments: GovernmentDepartment[];
}

export interface PrivateDepartment {
  id: string;
  name: string;
  collegeName: string;
  universityName: string;
  universityId: string;
  governorate: string;
  category: MajorCategory;
  cutoffMorning: number;
  cutoffEvening?: number;
  tuitionFeeMorning: number; // بالدينار العراقي
  tuitionFeeEvening?: number; // بالدينار العراقي
  eligibleBranches: StudyBranch[];
  yearsOfStudy: number;
  hasEvening: boolean;
  careerPath: string;
  notes?: string;
}

export interface PrivateUniversity {
  id: string;
  name: string;
  shortName: string;
  governorate: string;
  type: 'أهلي';
  establishedYear: number;
  recognitionStatus: string;
  description: string;
  campusLocation: string;
  website?: string;
  departmentsCount: number;
  isKurdistanRegion?: boolean;
  region?: 'كردستان' | 'الاتحادي';
  branches?: string[]; // فروع الجامعة ومقراتها الرسمية بالمحافظات
  departments: PrivateDepartment[];
}

export interface ScoreMatchItem {
  id: string;
  name: string;
  collegeName: string;
  universityName: string;
  universityId: string;
  type: 'حكومي' | 'أهلي';
  governorate: string;
  category: MajorCategory;
  cutoffMorning: number;
  cutoffParallel?: number;
  cutoffEvening?: number;
  tuitionFeeMorning?: number;
  tuitionFeeEvening?: number;
  yearsOfStudy: number;
  matchTier: 'guaranteed' | 'competitive' | 'reach' | 'parallel';
  scoreDifference: number; // Student score minus cutoff
  eligibleBranches: StudyBranch[];
  shift: ShiftType;
  careerPath: string;
}

export interface StudentProfile {
  score: number | null;
  branch: StudyBranch;
  preference: EducationPreference;
  governorate: string;
  firstAttemptBonus: boolean; // إضافة درجة الدور الأول (+1)
  frenchLanguageBonus: boolean; // إضافة درجة اللغة الأجنبية (الفرنسية 8%)
}

export interface SpecialtyDefinition {
  id: string;
  name: string;
  category: MajorCategory;
  description: string;
  degreeAwarded: string; // الشهادة الممنوحة (بكالوريوس أو دبلوم)
  yearsOfStudy: number;
  eligibleBranches: StudyBranch[];
  careerPaths: string[];
  employmentStatus: string; // التعيين المركزي وقانون التدرج الطبي أو نقابة المهندسين والمحامين
  sectorType: 'حكومي' | 'أهلي' | 'كلاهما';
  skillsOverview?: string[];
  averageSalaryNote?: string;
  minimumCutoffGov?: number; // الحد الأدنى الحكومي العام
  minimumCutoffPrivate?: number; // الحد الأدنى الأهلي المعتمد بالوزارة
  averageTuitionFeePrivate?: number; // متوسط الأقساط الأهلية السنوية
}

export interface ComparisonItem {
  id: string;
  name: string;
  collegeName: string;
  universityName: string;
  type: 'حكومي' | 'أهلي';
  governorate: string;
  category: MajorCategory;
  cutoffMorning: number;
  cutoffEvening?: number;
  cutoffParallel?: number;
  tuitionFeeMorning?: number;
  tuitionFeeEvening?: number;
  yearsOfStudy: number;
  eligibleBranches: StudyBranch[];
  careerPath: string;
}
