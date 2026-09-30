import { GovernmentUniversity, PrivateUniversity, StudyBranch, MajorCategory } from '../types';
import {
  ALL_PRIVATE_UNIVERSITIES,
  FEDERAL_PRIVATE_UNIVERSITIES,
  KURDISTAN_UNIVERSITIES,
} from './privateUniversitiesData';
import { BAGHDAD_GOV_UNIVERSITIES } from './govUniversitiesBaghdad';
import { SOUTH_GOV_UNIVERSITIES } from './govUniversitiesSouth';
import { EUPHRATES_GOV_UNIVERSITIES } from './govUniversitiesEuphrates';
import { NORTHWEST_GOV_UNIVERSITIES } from './govUniversitiesNorthWest';
import { MILITARY_SECURITY_OIL_INSTITUTIONS } from './militarySecurityOilInstitutes';
import { WAQF_COLLEGES_UNIVERSITIES } from './waqfColleges';

export const IRAQI_GOVERNORATES = [
  'بغداد',
  'البصرة',
  'نينوى',
  'أربيل',
  'النجف',
  'كربلاء',
  'بابل',
  'ذي قار',
  'كركوك',
  'الأنبار',
  'ديالى',
  'صلاح الدين',
  'ميسان',
  'واسط',
  'المثنى',
  'القادسية',
  'دهوك',
  'السليمانية',
];

export const STUDY_BRANCHES: { value: StudyBranch; label: string; desc: string }[] = [
  { value: 'علمي', label: 'العلمي (الموحد)', desc: 'شامل للمنهج العلمي الحديث' },
  { value: 'أحيائي', label: 'الفرع الأحيائي', desc: 'مؤهل للمجموعات الطبية والبيولوجية والهندسية' },
  { value: 'تطبيقي', label: 'الفرع التطبيقي', desc: 'مؤهل للهندسة، التكنولوجيا، العلوم والإدارة' },
  { value: 'أدبي', label: 'الفرع الأدبي', desc: 'مؤهل للقانون، الإدارة، اللغات، الآداب والإعلام' },
  { value: 'صناعي', label: 'مهني - صناعي', desc: 'مؤهل لكليات التقنية الهندسية والمعاهد التكنولوجية' },
  { value: 'حاسوب وتقنية معلومات', label: 'مهني - حاسوب وتقنية معلومات', desc: 'مؤهل لهندسة الحاسوب وهندسة البرمجيات والتقنيات' },
  { value: 'تجاري', label: 'مهني - تجاري', desc: 'مؤهل لكليات الإدارة والاقتصاد والمعاهد الإدارية' },
  { value: 'زراعي', label: 'مهني - زراعي', desc: 'مؤهل لكليات الزراعة والمعاهد الزراعية' },
  { value: 'فنون', label: 'الفرع الفني / فنون تطبيقية', desc: 'مؤهل للفنون الجميلة والتصميم' },
  { value: 'تمريض مهني', label: 'مهني - تمريض', desc: 'مؤهل لكليات ومعاهد التمريض' },
  { value: 'مهني', label: 'التعليم المهني العام', desc: 'مؤهل للكليات التقنية والمعاهد التطبيقية' },
  { value: 'إسلامي', label: 'الفرع الإسلامي / الوقفين', desc: 'مؤهل للعلوم الإسلامية والشريعة والقانون والآداب' },
];

export const MAJOR_CATEGORIES: MajorCategory[] = [
  'الطب والعلوم الصحية',
  'الهندسة والتكنولوجيا',
  'علوم الحاسوب والذكاء الاصطناعي',
  'العلوم الصرفة والتطبيقية',
  'القانون والعلوم السياسية',
  'الإدارة والاقتصاد والمالية',
  'الآداب واللغات والتربية',
  'الإعلام والفنون',
  'الزراعة والطب البيطري',
  'المعاهد الطبية والتكنولوجية',
  'الكليات والمعاهد العسكرية والأمنية والنفطية',
];

// Unified complete list of all Iraqi Government Universities and Institutes
export const GOVERNMENT_UNIVERSITIES: GovernmentUniversity[] = [
  ...BAGHDAD_GOV_UNIVERSITIES,
  ...SOUTH_GOV_UNIVERSITIES,
  ...EUPHRATES_GOV_UNIVERSITIES,
  ...NORTHWEST_GOV_UNIVERSITIES,
  ...MILITARY_SECURITY_OIL_INSTITUTIONS,
  ...WAQF_COLLEGES_UNIVERSITIES,
];

export const PRIVATE_UNIVERSITIES: PrivateUniversity[] = ALL_PRIVATE_UNIVERSITIES;
export { FEDERAL_PRIVATE_UNIVERSITIES, KURDISTAN_UNIVERSITIES };

// Helper to flatten all departments for instant search & matching
export function getAllDepartments() {
  const govDepts = GOVERNMENT_UNIVERSITIES.flatMap((uni) =>
    uni.departments.map((dept) => ({
      ...dept,
      type: 'حكومي' as const,
      universityShortName: uni.shortName,
      establishedYear: uni.establishedYear,
      website: uni.website,
    }))
  );

  const privDepts = PRIVATE_UNIVERSITIES.flatMap((uni) =>
    uni.departments.map((dept) => ({
      ...dept,
      type: 'أهلي' as const,
      universityShortName: uni.shortName,
      establishedYear: uni.establishedYear,
      website: uni.website,
      cutoffParallel: undefined,
      annualFeeParallel: undefined,
      shift: (dept.hasEvening ? 'كلاهما' : 'صباحي') as any,
    }))
  );

  return { govDepts, privDepts };
}
