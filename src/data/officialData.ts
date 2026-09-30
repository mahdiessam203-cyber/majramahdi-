import { MajorCategory, StudyBranch, ShiftType } from '../types';

// Official Unified Cutoffs Table from Ministry Guidelines 2026-2027 (الفصل الثالث: ج-1)
export interface UnifiedCutoffEntry {
  categoryOrSpecialty: string;
  govMorningScientific: number;
  govMorningLiterary?: number;
  govEveningScientific?: number;
  govEveningLiterary?: number;
  privateMorningScientific?: number;
  privateMorningLiterary?: number;
  privateEveningScientific?: number;
  privateEveningLiterary?: number;
  eligibleBranches: StudyBranch[];
  notes?: string;
}

export const OFFICIAL_UNIFIED_CUTOFFS: UnifiedCutoffEntry[] = [
  {
    categoryOrSpecialty: 'الطب العام والجراحة (الطب البشري)',
    govMorningScientific: 99.5,
    privateMorningScientific: 95.0,
    eligibleBranches: ['علمي', 'أحيائي'],
    notes: 'الحد الأدنى للقبول في كليات الطب البشري الأهلية هو 95% لسنة 2026 والدراسة المسائية ملغاة تماماً.',
  },
  {
    categoryOrSpecialty: 'طب وجراحة الفم والأسنان',
    govMorningScientific: 98.7,
    privateMorningScientific: 90.0,
    eligibleBranches: ['علمي', 'أحيائي'],
    notes: 'وفق قرارات وزارة التعليم العالي لسنة 2026 أصبح الحد الأدنى للقبول 90% ولا يوجد مسائي إطلاقاً.',
  },
  {
    categoryOrSpecialty: 'الصيدلة السريرية والعامة',
    govMorningScientific: 98.4,
    privateMorningScientific: 90.0,
    eligibleBranches: ['علمي', 'أحيائي'],
    notes: 'وفق قرارات وزارة التعليم العالي لسنة 2026 أصبح الحد الأدنى للقبول 90% ولا يوجد مسائي إطلاقاً.',
  },
  {
    categoryOrSpecialty: 'الهندسة (كافة الأقسام الهندسية العامة)',
    govMorningScientific: 75,
    govEveningScientific: 70,
    privateMorningScientific: 65,
    privateEveningScientific: 62,
    eligibleBranches: ['علمي', 'تطبيقي', 'أحيائي'],
  },
  {
    categoryOrSpecialty: 'الكلية التقنية / الهندسية',
    govMorningScientific: 72,
    govEveningScientific: 67,
    privateMorningScientific: 63,
    privateEveningScientific: 60,
    eligibleBranches: ['علمي', 'تطبيقي', 'صناعي'],
  },
  {
    categoryOrSpecialty: 'الكلية التقنية / الصحية والطبية',
    govMorningScientific: 80,
    govEveningScientific: 75,
    privateMorningScientific: 70,
    privateEveningScientific: 65,
    eligibleBranches: ['علمي', 'أحيائي'],
  },
  {
    categoryOrSpecialty: 'المعاهد الطبية التقنية',
    govMorningScientific: 80,
    govEveningScientific: 75,
    privateMorningScientific: 70,
    privateEveningScientific: 68,
    eligibleBranches: ['علمي', 'أحيائي', 'تمريض مهني'],
  },
  {
    categoryOrSpecialty: 'المعاهد التكنولوجية',
    govMorningScientific: 55,
    govEveningScientific: 50,
    privateMorningScientific: 50,
    privateEveningScientific: 50,
    eligibleBranches: ['علمي', 'تطبيقي', 'صناعي'],
  },
  {
    categoryOrSpecialty: 'التمريض',
    govMorningScientific: 85,
    govEveningScientific: 80,
    privateMorningScientific: 78,
    privateEveningScientific: 75,
    eligibleBranches: ['علمي', 'أحيائي', 'تمريض مهني'],
  },
  {
    categoryOrSpecialty: 'القانون / الحقوق',
    govMorningScientific: 75,
    govMorningLiterary: 75,
    govEveningScientific: 70,
    govEveningLiterary: 70,
    privateMorningScientific: 68,
    privateMorningLiterary: 68,
    privateEveningScientific: 65,
    privateEveningLiterary: 65,
    eligibleBranches: ['علمي', 'أدبي', 'تطبيقي', 'أحيائي'],
  },
  {
    categoryOrSpecialty: 'العلوم السياسية والدولية',
    govMorningScientific: 65,
    govMorningLiterary: 65,
    govEveningScientific: 60,
    govEveningLiterary: 60,
    privateMorningScientific: 60,
    privateMorningLiterary: 60,
    privateEveningScientific: 58,
    privateEveningLiterary: 58,
    eligibleBranches: ['علمي', 'أدبي', 'تطبيقي', 'أحيائي'],
  },
  {
    categoryOrSpecialty: 'علوم الحاسوب وتكنولوجيا المعلومات والذكاء الاصطناعي',
    govMorningScientific: 70,
    govEveningScientific: 65,
    privateMorningScientific: 63,
    privateEveningScientific: 60,
    eligibleBranches: ['علمي', 'تطبيقي', 'أحيائي', 'حاسوب وتقنية معلومات'],
  },
  {
    categoryOrSpecialty: 'الإدارة الصناعية للنفط والغاز',
    govMorningScientific: 80,
    govEveningScientific: 75,
    privateMorningScientific: 70,
    privateEveningScientific: 68,
    eligibleBranches: ['علمي', 'أحيائي', 'تطبيقي'],
  },
  {
    categoryOrSpecialty: 'الطب البيطري',
    govMorningScientific: 75,
    govEveningScientific: 70,
    privateMorningScientific: 70,
    privateEveningScientific: 68,
    eligibleBranches: ['علمي', 'أحيائي'],
  },
  {
    categoryOrSpecialty: 'التقانات الإحيائية',
    govMorningScientific: 70,
    govEveningScientific: 65,
    privateMorningScientific: 63,
    privateEveningScientific: 60,
    eligibleBranches: ['علمي', 'أحيائي'],
  },
  {
    categoryOrSpecialty: 'العلوم / العلوم الطبية التطبيقية',
    govMorningScientific: 70,
    govEveningScientific: 65,
    privateMorningScientific: 60,
    privateEveningScientific: 58,
    eligibleBranches: ['علمي', 'أحيائي', 'تطبيقي'],
  },
  {
    categoryOrSpecialty: 'العلوم البيئية والمناخ',
    govMorningScientific: 65,
    govEveningScientific: 60,
    privateMorningScientific: 60,
    privateEveningScientific: 58,
    eligibleBranches: ['علمي', 'أحيائي', 'تطبيقي'],
  },
  {
    categoryOrSpecialty: 'التحسس النائي والجيوفيزيائي',
    govMorningScientific: 70,
    govEveningScientific: 65,
    privateMorningScientific: 65,
    privateEveningScientific: 63,
    eligibleBranches: ['علمي', 'تطبيقي', 'أحيائي'],
  },
  {
    categoryOrSpecialty: 'الإدارة والاقتصاد / اقتصاديات الأعمال',
    govMorningScientific: 65,
    govMorningLiterary: 65,
    govEveningScientific: 60,
    govEveningLiterary: 60,
    privateMorningScientific: 58,
    privateMorningLiterary: 58,
    privateEveningScientific: 55,
    privateEveningLiterary: 55,
    eligibleBranches: ['علمي', 'أدبي', 'تجاري'],
  },
  {
    categoryOrSpecialty: 'اللغات والترجمة',
    govMorningScientific: 70,
    govMorningLiterary: 70,
    govEveningScientific: 65,
    govEveningLiterary: 65,
    privateMorningScientific: 60,
    privateMorningLiterary: 60,
    privateEveningScientific: 55,
    privateEveningLiterary: 55,
    eligibleBranches: ['علمي', 'أدبي'],
  },
  {
    categoryOrSpecialty: 'التربية والتربية للعلوم الصرفة والإنسانية',
    govMorningScientific: 70,
    govMorningLiterary: 70,
    govEveningScientific: 65,
    govEveningLiterary: 65,
    privateMorningScientific: 55,
    privateMorningLiterary: 55,
    privateEveningScientific: 55,
    privateEveningLiterary: 55,
    eligibleBranches: ['علمي', 'أدبي'],
  },
  {
    categoryOrSpecialty: 'التربية الأساسية',
    govMorningScientific: 70,
    govMorningLiterary: 70,
    govEveningScientific: 65,
    govEveningLiterary: 65,
    privateMorningScientific: 55,
    privateMorningLiterary: 55,
    privateEveningScientific: 53,
    privateEveningLiterary: 53,
    eligibleBranches: ['علمي', 'أدبي'],
  },
  {
    categoryOrSpecialty: 'الآداب',
    govMorningScientific: 65,
    govMorningLiterary: 65,
    govEveningScientific: 60,
    govEveningLiterary: 60,
    privateMorningScientific: 55,
    privateMorningLiterary: 55,
    privateEveningScientific: 53,
    privateEveningLiterary: 53,
    eligibleBranches: ['علمي', 'أدبي'],
  },
  {
    categoryOrSpecialty: 'الإعلام والصحافة والعلاقات العامة',
    govMorningScientific: 60,
    govMorningLiterary: 60,
    govEveningScientific: 55,
    govEveningLiterary: 55,
    privateMorningScientific: 54,
    privateMorningLiterary: 54,
    privateEveningScientific: 52,
    privateEveningLiterary: 52,
    eligibleBranches: ['علمي', 'أدبي', 'فنون'],
  },
  {
    categoryOrSpecialty: 'الفنون الجميلة والتطبيقية',
    govMorningScientific: 60,
    govMorningLiterary: 60,
    govEveningScientific: 55,
    govEveningLiterary: 55,
    privateMorningScientific: 50,
    privateMorningLiterary: 50,
    privateEveningScientific: 50,
    privateEveningLiterary: 50,
    eligibleBranches: ['علمي', 'أدبي', 'فنون'],
  },
  {
    categoryOrSpecialty: 'الزراعة والبيطرة الزراعية',
    govMorningScientific: 55,
    govEveningScientific: 50,
    privateMorningScientific: 50,
    privateEveningScientific: 50,
    eligibleBranches: ['علمي', 'أحيائي', 'زراعي'],
  },
];

// Department item offering in a university
export interface OfferingUniversityInfo {
  universityId: string;
  universityName: string;
  universityType: 'حكومي' | 'أهلي';
  collegeName: string;
  governorate: string;
  cutoffMorning: number;
  cutoffEvening?: number;
  cutoffParallel?: number;
  tuitionFeeMorning?: number;
  tuitionFeeEvening?: number;
  eligibleBranches: StudyBranch[];
  shift: ShiftType;
  campusLocation?: string;
  website?: string;
}

// Full Specialty Entity for the Specialties Explorer
export interface FullSpecialtyItem {
  id: string;
  name: string;
  sectorType: 'حكومي' | 'أهلي' | 'كلاهما';
  category: MajorCategory;
  description: string;
  degreeAwarded: string;
  yearsOfStudy: number;
  eligibleBranches: StudyBranch[];
  // Ministry Official Limits
  minCutoffMorningGov?: number;
  minCutoffEveningGov?: number;
  minCutoffMorningPrivate?: number;
  minCutoffEveningPrivate?: number;
  averageTuitionPrivate?: number;
  careerPaths: string[];
  employmentStatus: string;
  // List of universities offering it
  offeringUniversities: OfferingUniversityInfo[];
}

// Complete University Entity for the Universities Explorer
export interface FullUniversityItem {
  id: string;
  name: string;
  shortName: string;
  type: 'حكومي' | 'أهلي';
  governorate: string;
  establishedYear: number;
  campusLocation: string;
  website: string;
  collegesCount: number;
  recognitionStatus: string;
  description: string;
  departments: {
    id: string;
    name: string;
    collegeName: string;
    category: MajorCategory;
    cutoffMorning: number;
    cutoffEvening?: number;
    cutoffParallel?: number;
    tuitionFeeMorning?: number;
    tuitionFeeEvening?: number;
    eligibleBranches: StudyBranch[];
    yearsOfStudy: number;
    shift: ShiftType;
    careerPath: string;
  }[];
}
