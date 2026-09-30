import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Scale,
  Plus,
  Coins,
  ChevronDown,
  Info,
  ShieldCheck,
  Check,
  ArrowRight,
  GraduationCap,
  Building2,
  BookOpen,
  SlidersHorizontal,
  Filter,
  Layers,
  ArrowUpDown,
  Stethoscope,
  X,
  ExternalLink
} from 'lucide-react';
import {
  StudyBranch,
  EducationPreference,
  ScoreMatchItem,
  StudentProfile,
  ComparisonItem,
  MajorCategory,
} from '../types';
import {
  STUDY_BRANCHES,
  IRAQI_GOVERNORATES,
  GOVERNMENT_UNIVERSITIES,
  PRIVATE_UNIVERSITIES,
} from '../data/iraqiUniversitiesData';

interface ScoreMatcherProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onOpenAssistant: (query?: string) => void;
  onAddToComparison: (item: ComparisonItem) => void;
  onAddToDraft: (item: ScoreMatchItem) => void;
  comparisonItems: ComparisonItem[];
  draftItems: ScoreMatchItem[];
}

// Canonical Specialty grouping interface
export interface SpecialtyGroup {
  id: string;
  name: string;
  category: MajorCategory;
  description: string;
  degreeAwarded: string;
  yearsOfStudy: number;
  careerPath: string;
  official2026Rule?: string;
  hasMedicalEveningBan?: boolean;
  // Lowest cutoffs
  minGovMorning: number | null;
  minGovParallel: number | null;
  minPrivateMorning: number | null;
  minPrivateEvening: number | null;
  // Lowest private tuition
  minPrivateTuition: number | null;
  maxPrivateTuition: number | null;
  // Counts
  govCount: number;
  privateCount: number;
  totalCount: number;
  // Matching tier for student
  matchTier: 'guaranteed' | 'competitive' | 'parallel';
  scoreDifference: number;
  // Offerings list
  offerings: ScoreMatchItem[];
}

// Canonical specialty normalizer to prevent duplication and clutter
function getCanonicalSpecialtyMeta(deptName: string, category: MajorCategory): {
  id: string;
  name: string;
  category: MajorCategory;
  description: string;
  degreeAwarded: string;
  yearsOfStudy: number;
  careerPath: string;
  official2026Rule?: string;
  hasMedicalEveningBan?: boolean;
} {
  const norm = deptName
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();

  // 0. المعاهد التقنية الحكومية (شهادة الدبلوم الفني - سنتان)
  if (norm.includes('دبلوم') || norm.includes('معهد')) {
    // معاهد طبية
    if (
      norm.includes('صيدل') ||
      norm.includes('مختبر') ||
      norm.includes('تحليلات') ||
      norm.includes('تمريض') ||
      norm.includes('تخدير') ||
      norm.includes('اشعه') ||
      norm.includes('صحه مجتمع') ||
      norm.includes('اجهزه طبيه') ||
      norm.includes('فحص بصر') ||
      norm.includes('بصريات') ||
      norm.includes('علاج طبيعي')
    ) {
      return {
        id: 'spec-inst-medical',
        name: 'دبلوم المعاهد الطبية التقنية (صيدلة، تحليلات، تمريض، صحة مجتمع)',
        category: 'المعاهد الطبية والتكنولوجية',
        description: 'دبلوم تقني صحي لمدة سنتين في المعاهد الطبية التقنية الحكومية بمحافظات العراق بتعيين مركزي مباشر.',
        degreeAwarded: 'دبلوم تقني طبي (سنتان بعد الإعدادية)',
        yearsOfStudy: 2,
        careerPath: 'مساعد صيدلي، فني تحليلات، ممرض فني، مساعد تخدير مع تعيين مركزي 100% بوزارة الصحة، والأوائل 10% يكملون الكليات المناظرة.',
        official2026Rule: 'الحدود الدنيا تبدأ من 88% إلى 94% حسب التخصص والمحافظة.',
      };
    }

    // معاهد تكنولوجية وهندسية
    if (
      norm.includes('كهربا') ||
      norm.includes('ميكانيك') ||
      norm.includes('مساحه') ||
      norm.includes('بناء') ||
      norm.includes('تكنولوجي') ||
      norm.includes('الكترون') ||
      norm.includes('سيارات') ||
      norm.includes('انشاء')
    ) {
      return {
        id: 'spec-inst-tech',
        name: 'دبلوم المعاهد التكنولوجية والهندسية (كهرباء، ميكانيك، مساحة، إنشاءات)',
        category: 'المعاهد الطبية والتكنولوجية',
        description: 'دبلوم تقني تكنولوجي وهندسي لمدة سنتين لإعداد ملاكات فنية مساندة في الكهرباء، المساحة، البناء والميكانيك والتشغيل.',
        degreeAwarded: 'دبلوم تقني هندسي (سنتان بعد الإعدادية)',
        yearsOfStudy: 2,
        careerPath: 'فني تشغيل وصيانة في المحطات الكهربائية، مشاريع الطرق والجسور، شركات المقاولات والنفط، ويحق للأوائل إكمال كلية الهندسة.',
        official2026Rule: 'الحدود الدنيا للقبول تبدأ من 60% إلى 70% وتؤهل خريجي المهني الصناعي.',
      };
    }

    // معاهد إدارة
    if (
      norm.includes('محاسب') ||
      norm.includes('اداره') ||
      norm.includes('مواد') ||
      norm.includes('مكتب') ||
      norm.includes('مصرف') ||
      norm.includes('مالي')
    ) {
      return {
        id: 'spec-inst-admin',
        name: 'دبلوم معاهد الإدارة التقنية (محاسبة، إدارة مواد، إدارة مكاتب)',
        category: 'المعاهد الطبية والتكنولوجية',
        description: 'دبلوم تقني إداري لمدة سنتين في إدارة المخازن والمستودعات والمحاسبة المالية وإدارة المكاتب الحديثة.',
        degreeAwarded: 'دبلوم تقني إداري (سنتان بعد الإعدادية)',
        yearsOfStudy: 2,
        careerPath: 'محاسب فني، مدير مخازن ومواد، سكرتارية تنفيذية في دوائر الدولة والشركات التجارية والمصارف.',
        official2026Rule: 'الحدود الدنيا للقبول تبدأ من 58% إلى 68% للفرعين العلمي والأدبي والتجاري.',
      };
    }

    // معاهد زراعية
    if (norm.includes('زراع') || norm.includes('حيوان') || norm.includes('نبات')) {
      return {
        id: 'spec-inst-agri',
        name: 'دبلوم المعاهد الزراعية والإنتاج الحيواني والنباتي',
        category: 'المعاهد الطبية والتكنولوجية',
        description: 'دبلوم تقني زراعي لمدة سنتين لإعداد كوادر متخصصة في إدارة المزارع والبيوت البلاستيكية والإنتاج الحيواني.',
        degreeAwarded: 'دبلوم تقني زراعي (سنتان)',
        yearsOfStudy: 2,
        careerPath: 'فني زراعي وإشراف على الحقول الزراعية ومشاريع الإنتاج الحيواني ومزارع الدواجن.',
      };
    }
  }

  // 1. General Medicine
  if (
    norm.includes('الطب العام') ||
    norm.includes('الطب البشري') ||
    norm.includes('طب وجراحه عامه') ||
    (norm.includes('طب') && !norm.includes('اسنان') && !norm.includes('بيطري') && !norm.includes('حياتي') && !norm.includes('طوارئ') && !norm.includes('تقنيات'))
  ) {
    return {
      id: 'spec-general-medicine',
      name: 'الطب العام والجراحة (الطب البشري)',
      category: 'الطب والعلوم الصحية',
      description: 'التخصص الطبي البشري لتخريج أطباء مؤهلين سريرياً وجراحياً لمشافي وزارة الصحة والمراكز التخصصية.',
      degreeAwarded: 'بكالوريوس في الطب والجراحة العامة (MBChB)',
      yearsOfStudy: 6,
      careerPath: 'طبيب مقيم دوري، إقامة قدمى، بورد جراحي وباطني، مستشفيات وزارة الصحة والقطاع الخاص.',
      official2026Rule: 'الحد الأدنى للقبول في كليات الطب البشري الأهلية هو 95.0% والدراسة المسائية ملغاة نهائياً وفق قرارات وزارة التعليم العالي لسنة 2026.',
      hasMedicalEveningBan: true,
    };
  }

  // 2. Dentistry
  if (norm.includes('اسنان')) {
    return {
      id: 'spec-dentistry',
      name: 'طب وجراحة الفم والأسنان',
      category: 'الطب والعلوم الصحية',
      description: 'تخصص يعنى بتشخيص وعلاج وتجميل أمراض الفم واللثة والفكين والتقويم وزراعة الأسنان في العيادات والمراكز التخصصية.',
      degreeAwarded: 'بكالوريوس في طب وجراحة الفم والأسنان (B.D.S)',
      yearsOfStudy: 5,
      careerPath: 'طبيب أسنان، جراحة الوجه والفكين، زراعة وتقويم الأسنان، فتح عيادة خاصة ومراكز تخصصية.',
      official2026Rule: 'الحد الأدنى للقبول في كليات طب الأسنان الأهلية هو 90.0% والدراسة المسائية ملغاة نهائياً وفق قرارات وزارة التعليم العالي لسنة 2026.',
      hasMedicalEveningBan: true,
    };
  }

  // 3. Pharmacy
  if (norm.includes('صيدل') || norm === 'صيدله') {
    return {
      id: 'spec-pharmacy',
      name: 'الصيدلة السريرية والعامة',
      category: 'الطب والعلوم الصحية',
      description: 'دراسة العلوم الصيدلانية السريرية، الكيمياء الدوائية، الرقابة على الأدوية، وتصميم الخطط العلاجية.',
      degreeAwarded: 'بكالوريوس في العلوم الصيدلانية (B.Pharm)',
      yearsOfStudy: 5,
      careerPath: 'صيدلي سريري بالمستشفيات، فتح صيدلية خاصة، مكاتب الأدوية العلمية، مصانع الأدوية.',
      official2026Rule: 'الحد الأدنى للقبول في كليات الصيدلة الأهلية هو 90.0% والدراسة المسائية ملغاة نهائياً وفق قرارات وزارة التعليم العالي لسنة 2026.',
      hasMedicalEveningBan: true,
    };
  }

  // 4. Nursing
  if (norm.includes('تمريض')) {
    return {
      id: 'spec-nursing',
      name: 'علوم التمريض',
      category: 'الطب والعلوم الصحية',
      description: 'إعداد كوادر تمريضية جامعية لإدارة العناية المركزة وصالات العمليات ورعاية المرضى الحرجة.',
      degreeAwarded: 'بكالوريوس في علوم التمريض',
      yearsOfStudy: 4,
      careerPath: 'ممرض جامعي، مشرف عناية مركزة، إدارة أقسام الطوارئ والمستشفيات، تعيين مركزي 100%.',
      official2026Rule: 'الحد الأدنى للقبول في كليات التمريض الأهلية هو 70.0% صباحي و 68.0% مسائي لسنة 2026.',
      hasMedicalEveningBan: false,
    };
  }

  // 5. Anesthesia
  if (norm.includes('تخدير')) {
    return {
      id: 'spec-anesthesia',
      name: 'تقنيات التخدير والعناية المركزة',
      category: 'الطب والعلوم الصحية',
      description: 'إدارة أجهزة التخدير والغازات الطبية ومراقبة العلامات الحيوية للعمليات الجراحية المعقدة.',
      degreeAwarded: 'بكالوريوس تقني في التخدير',
      yearsOfStudy: 4,
      careerPath: 'تقني تخدير بصالات العمليات الجراحية، مراكز الإنعاش والعناية المركزة، مشافي القطاعين العام والخاص.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 70.0% صباحي و 68.0% مسائي.',
    };
  }

  // 6. Radiology
  if (norm.includes('اشعه')) {
    return {
      id: 'spec-radiology',
      name: 'تقنيات الأشعة والتصوير الطبي والسونار',
      category: 'الطب والعلوم الصحية',
      description: 'تشغيل أجهزة المفراس الحلزوني CT، الرنين المغناطيسي MRI، والأشعة السينية ومستشفيات الأورام.',
      degreeAwarded: 'بكالوريوس تقني في الأشعة',
      yearsOfStudy: 4,
      careerPath: 'أخصائي تصوير طبي بالمستشفيات ومراكز الرنين والمفراس التخصصية والعيادات الخاصة.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 70.0% صباحي و 68.0% مسائي.',
    };
  }

  // 7. Medical Laboratories / Pathological Analysis
  if (norm.includes('تحليلات') || norm.includes('مختبر')) {
    return {
      id: 'spec-pathology',
      name: 'تقنيات المختبرات والتحليلات المرضية',
      category: 'الطب والعلوم الصحية',
      description: 'الفحوصات السريرية، المناعة، فحص الدم والأورام، الأحياء المجهرية، والتحاليل الوراثية الجزيئية.',
      degreeAwarded: 'بكالوريوس تقني في التحليلات المرضية',
      yearsOfStudy: 4,
      careerPath: 'مختبرات المستشفيات الحكومية والأهلية، بنوك الدم، فتح مختبر تحليلات مرضي تخصصي.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 70.0% صباحي و 68.0% مسائي.',
    };
  }

  // 8. Optometry
  if (norm.includes('بصريات') || norm.includes('فحص بصر')) {
    return {
      id: 'spec-optometry',
      name: 'تقنيات فحص البصر والبصريات',
      category: 'الطب والعلوم الصحية',
      description: 'فحص حدة الإبصار، تشخيص عيوب الانكسار، وصف وتجهيز العدسات والنظارات الطبية وجراحة العيون.',
      degreeAwarded: 'بكالوريوس تقني في البصريات',
      yearsOfStudy: 4,
      careerPath: 'مستشفيات العيون، مراكز الليزك وجراحة العين، فتح مركز بصريات ونظارات طبية خاص.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 70.0% صباحي و 68.0% مسائي.',
    };
  }

  // 9. Dental Technologies
  if (norm.includes('صناعه اسنان')) {
    return {
      id: 'spec-dental-tech',
      name: 'تقنيات صناعة وتجميل الأسنان',
      category: 'الطب والعلوم الصحية',
      description: 'تصميم وصناعة الجسور وزراعة الأسنان، تقويم الأسنان، وعدسات الابتسامة الخزفية الرقمية.',
      degreeAwarded: 'بكالوريوس تقني في صناعة الأسنان',
      yearsOfStudy: 4,
      careerPath: 'مختبرات صناعة الأسنان الحديثة، مراكز زراعة الأسنان، فتح مختبر خاص لصناعة الأسنان.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 70.0% صباحي و 68.0% مسائي.',
    };
  }

  // 10. Physical Therapy
  if (norm.includes('علاج طبيعي')) {
    return {
      id: 'spec-physical-therapy',
      name: 'تقنيات العلاج الطبيعي والتأهيل الطبي',
      category: 'الطب والعلوم الصحية',
      description: 'تأهيل إصابات العمود الفقري، الجلطات الدماغية، إصابات الملاعب الرياضية، وإعادة الحركة.',
      degreeAwarded: 'بكالوريوس تقني في العلاج الطبيعي',
      yearsOfStudy: 4,
      careerPath: 'مراكز التأهيل الطبي، أندية رياضية، مستشفيات العظام والمفاصل، مراكز العلاج الطبيعي الأهلية.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 70.0% صباحي و 68.0% مسائي.',
    };
  }

  // 11. Biomedical Engineering
  if (norm.includes('طب حياتي') || norm.includes('اجهزه طبيه') || norm.includes('ليزر وبصريات')) {
    return {
      id: 'spec-biomedical-eng',
      name: 'هندسة الطب الحياتي والأجهزة الطبية',
      category: 'الهندسة والتكنولوجيا',
      description: 'صيانة ومعايرة وتصميم الأجهزة الطبية الحديثة، أجهزة الرنين، الحاضنات، وأجهزة الإنعاش ومحطات العمليات.',
      degreeAwarded: 'بكالوريوس هندسة الطب الحياتي / الأجهزة الطبية',
      yearsOfStudy: 5,
      careerPath: 'مهندس أجهزة طبية بالمستشفيات، شركات استيراد الأجهزة الطبية العالمية، شركات الصيانة الطبية المتقدمة.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 75.0% صباحي و 70.0% مسائي.',
    };
  }

  // 12. Petroleum Engineering
  if (norm.includes('نفط') || norm.includes('غاز')) {
    return {
      id: 'spec-petroleum-eng',
      name: 'هندسة النفط والغاز والطاقة',
      category: 'الهندسة والتكنولوجيا',
      description: 'حفر وإنتاج وتكرير النفط الخام والغاز الطبيعي وهندسة المكامن وإدارة الحقول النفطية العملاقة.',
      degreeAwarded: 'بكالوريوس هندسة النفط',
      yearsOfStudy: 4,
      careerPath: 'شركات النفط الوطنية (نفط البصرة، نفط الشمال، نفط الوسط) والشركات العالمية الكبرى العاملة بالعراق.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 72.0% صباحي و 70.0% مسائي.',
    };
  }

  // 13. Architecture
  if (norm.includes('عماره') || norm.includes('معماري')) {
    return {
      id: 'spec-architecture',
      name: 'هندسة العمارة والتخطيط العمراني',
      category: 'الهندسة والتكنولوجيا',
      description: 'تصميم المباني والمنشآت الذكية، التخطيط الحضري، والتصميم البيئي والديكور المعماري.',
      degreeAwarded: 'بكالوريوس في هندسة العمارة',
      yearsOfStudy: 5,
      careerPath: 'مكاتب استشارية هندسية، شركات المقاولات والتطوير العقاري، دوائر الإسكان والبلديات.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 72.0% صباحي و 70.0% مسائي.',
    };
  }

  // 14. Computer & AI Engineering
  if (
    norm.includes('هندسه') &&
    (norm.includes('حاسوب') || norm.includes('برمجيات') || norm.includes('ذكاء اصطناعي') || norm.includes('امن سيبراني') || norm.includes('اتصالات') || norm.includes('شبكات'))
  ) {
    return {
      id: 'spec-computer-eng-ai',
      name: 'هندسة الحاسوب والبرمجيات والذكاء الاصطناعي',
      category: 'الهندسة والتكنولوجيا',
      description: 'تطوير النظم البرمجية المعقدة، خوارزميات الذكاء الاصطناعي، الأمن السيبراني، وشبكات الحوسبة السحابية.',
      degreeAwarded: 'بكالوريوس هندسة الحاسوب / البرمجيات',
      yearsOfStudy: 4,
      careerPath: 'مهندس برمجيات، أخصائي أمن سيبراني، مهندس ذكاء اصطناعي، شركات الاتصالات والبنوك والقطاع التكنولوجي.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 65.0% صباحي و 63.0% مسائي.',
    };
  }

  // 15. Civil Engineering
  if (norm.includes('مدني') || norm.includes('بناء وانشاء')) {
    return {
      id: 'spec-civil-eng',
      name: 'الهندسة المدنية والإنشاءات',
      category: 'الهندسة والتكنولوجيا',
      description: 'تصميم وتنفيذ الجسور، الطرق السريعة، الأبراج السكنية، المنشآت الهيدروليكية، وإدارة المشاريع.',
      degreeAwarded: 'بكالوريوس هندسة مدنية',
      yearsOfStudy: 4,
      careerPath: 'مهندس موقع واستشاري، شركات المقاولات الكبرى، وزارات الإعمار والإسكان والبلديات.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 62.0% صباحي و 60.0% مسائي.',
    };
  }

  // 16. Electrical Engineering
  if (norm.includes('كهربا')) {
    return {
      id: 'spec-electrical-eng',
      name: 'الهندسة الكهربائية والإلكترونية',
      category: 'الهندسة والتكنولوجيا',
      description: 'توليد ونقل الطاقة الكهربائية، المحطات والمحولات، التحكم الصناعي والآلات الذكية.',
      degreeAwarded: 'بكالوريوس هندسة كهربائية',
      yearsOfStudy: 4,
      careerPath: 'محطات توليد الكهرباء، شركات الطاقة والصناعة، وزارة الكهرباء والنفط والاتصالات.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 62.0% صباحي و 60.0% مسائي.',
    };
  }

  // 17. Mechanical Engineering
  if (norm.includes('ميكانيك')) {
    return {
      id: 'spec-mechanical-eng',
      name: 'الهندسة الميكانيكية والكهروميكانيكية',
      category: 'الهندسة والتكنولوجيا',
      description: 'المحركات، التكييف والتبريد المركزي، التوربينات، وتصميم خطوط الإنتاج الصناعية والسيارات.',
      degreeAwarded: 'بكالوريوس هندسة ميكانيكية',
      yearsOfStudy: 4,
      careerPath: 'مصانع وشركات التكييف والتبريد والمحطات الصناعية والنفطية، وزارة الصناعة والمعادن.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 62.0% صباحي و 60.0% مسائي.',
    };
  }

  // 18. Law
  if (norm.includes('قانون') || norm.includes('حقوق')) {
    return {
      id: 'spec-law',
      name: 'القانون والحقوق والعلوم الجنائية',
      category: 'القانون والعلوم السياسية',
      description: 'دراسة التشريعات المدنية والجنائية والتجارية والدستورية وإجراءات التقاضي والمحاكم والتحكيم الدولي.',
      degreeAwarded: 'بكالوريوس في القانون',
      yearsOfStudy: 4,
      careerPath: 'محامٍ مجاز بنقابة المحامين، قاضٍ، مستشار قانوني بالشركات والوزارات، الادعاء العام والتحقيق الجنائي.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 65.0% صباحي و 62.0% مسائي.',
    };
  }

  // 19. Computer Science & IT
  if (norm.includes('علوم الحاسوب') || norm.includes('تكنولوجيا المعلومات') || norm.includes('نظم المعلومات')) {
    return {
      id: 'spec-computer-science',
      name: 'علوم الحاسوب وتكنولوجيا المعلومات',
      category: 'العلوم الصرفة والتطبيقية',
      description: 'هندسة البيانات، تطوير الويب والتطبيقات الذكية، إدارة قواعد البيانات، وتطوير الحوسبة السحابية.',
      degreeAwarded: 'بكالوريوس في علوم الحاسوب / تقنية المعلومات',
      yearsOfStudy: 4,
      careerPath: 'مطور برمجيات، مسؤول قواعد بيانات، مهندس سحابي، وظائف التحول الرقمي بالقطاعين الحكومي والأهلي.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 62.0% صباحي و 60.0% مسائي.',
    };
  }

  // 20. Business & Accounting
  if (norm.includes('محاسبه') || norm.includes('ماليه') || norm.includes('مصرف')) {
    return {
      id: 'spec-accounting-finance',
      name: 'المحاسبة والعلوم المالية والمصرفية',
      category: 'الإدارة والاقتصاد والمالية',
      description: 'التدقيق المالي، المحاسبة الضريبية، إدارة الاستثمارات والمحافظ المالية، والمصارف الإسلامية والتجارية.',
      degreeAwarded: 'بكالوريوس في المحاسبة / العلوم المالية والمصرفية',
      yearsOfStudy: 4,
      careerPath: 'محاسب قانوني، مدقق حسابات، مدير مالي بالبنوك والشركات الاستثمارية ودوائر الضريبة والجمارك.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 58.0% صباحي و 56.0% مسائي.',
    };
  }

  // 21. Business Administration
  if (norm.includes('اداره اعمال') || (norm.includes('اداره') && !norm.includes('اقتصاد'))) {
    return {
      id: 'spec-business-admin',
      name: 'إدارة الأعمال والتسويق الرقمي',
      category: 'الإدارة والاقتصاد والمالية',
      description: 'التخطيط الاستراتيجي، إدارة الموارد البشرية، ريادة الأعمال، سلاسل الإمداد، والتسويق الإلكتروني.',
      degreeAwarded: 'بكالوريوس في إدارة الأعمال',
      yearsOfStudy: 4,
      careerPath: 'مدير تنفيذي، ريادة المشاريع والشركات الناشئة، إدارة الموارد البشرية والتسويق والعلاقات المؤسسية.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 58.0% صباحي و 56.0% مسائي.',
    };
  }

  // 22. English & Translation
  if (norm.includes('انجليزي') || norm.includes('ترجمه') || norm.includes('لغه انجليزيه')) {
    return {
      id: 'spec-english-translation',
      name: 'اللغة الإنجليزية والترجمة',
      category: 'الآداب واللغات والتربية',
      description: 'الترجمة الفورية والتحريرية، تدريس اللغة الإنجليزية، اللغويات، والأدب الإنجليزي المقارن.',
      degreeAwarded: 'بكالوريوس في اللغة الإنجليزية والترجمة',
      yearsOfStudy: 4,
      careerPath: 'مترجم قانوني وفوري معتمد، تدريس، العمل بالمنظمات الدولية ووكالات الأنباء والسفارات.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 55.0% صباحي و 53.0% مسائي.',
    };
  }

  // 23. Media & Journalism
  if (norm.includes('اعلام') || norm.includes('صحافه')) {
    return {
      id: 'spec-media-journalism',
      name: 'الإعلام والصحافة وصناعة المحتوى الرقمي',
      category: 'الإعلام والفنون',
      description: 'الصحافة الاستقصائية، التقديم التلفزيوني والإذاعي، صناعة المحتوى الرقمي، والعلاقات العامة والإعلان.',
      degreeAwarded: 'بكالوريوس في الإعلام والاتصال',
      yearsOfStudy: 4,
      careerPath: 'مذيع، صحفي، مدير منصات تواصل اجتماعي، منتج ومخرج محتوى إعلامي، علاقات عامة بالمؤسسات.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 55.0% صباحي و 53.0% مسائي.',
    };
  }

  // 24. Veterinary Medicine
  if (norm.includes('بيطري')) {
    return {
      id: 'spec-veterinary-med',
      name: 'الطب البيطري والجراحة البيطرية',
      category: 'الزراعة والطب البيطري',
      description: 'تشخيص وعلاج أمراض الحيوانات الداجنة والمواشي ومشاريع الثروة الحيوانية والرقابة الصحية على اللحوم.',
      degreeAwarded: 'بكالوريوس في الطب والجراحة البيطرية (B.V.M.S)',
      yearsOfStudy: 5,
      careerPath: 'طبيب بيطري، عيادة بيطرية خاصة، دوائر البيطرة التابعة لوزارة الزراعة والمجازر وشركات الدواجن.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 68.0% صباحي و 65.0% مسائي.',
    };
  }

  // 25. Chemical & Petrochemical Engineering
  if (norm.includes('كيمياو') || norm.includes('بتروكيماو') || norm.includes('تكرير')) {
    return {
      id: 'spec-chemical-eng',
      name: 'الهندسة الكيمياوية وتكرير البتروكيماويات',
      category: 'الهندسة والتكنولوجيا',
      description: 'تصميم العمليات الصناعية الكيميائية، تكرير النفط، صناعة الأسمدة، اللدائن، والصناعات الدوائية.',
      degreeAwarded: 'بكالوريوس هندسة كيمياوية',
      yearsOfStudy: 4,
      careerPath: 'المصافي النفطية، مصانع البتروكيماويات والأسمدة، محطات معالجة المياه، والشركات الصناعية الكبرى.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 65.0% صباحي و 62.0% مسائي.',
    };
  }

  // 26. Aviation Engineering
  if (norm.includes('طيران') || norm.includes('فضاء')) {
    return {
      id: 'spec-aviation-eng',
      name: 'هندسة الطيران وتقنيات الملاحة الجوية',
      category: 'الهندسة والتكنولوجيا',
      description: 'هياكل ومحركات الطائرات، إلكترونيات الطيران، نظم الملاحة والرادار، وإدارة صيانة الأساطيل الجوية.',
      degreeAwarded: 'بكالوريوس هندسة طيران',
      yearsOfStudy: 4,
      careerPath: 'الخطوط الجوية العراقية، سلطة الطيران المدني بالمطارات، شركات صيانة الطائرات الدولية.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 72.0% صباحي و 70.0% مسائي.',
    };
  }

  // 27. Materials Engineering
  if (norm.includes('مواد') && (norm.includes('هندس') || norm.includes('بوليمر') || norm.includes('سيراميك'))) {
    return {
      id: 'spec-materials-eng',
      name: 'هندسة المواد والبوليمرات وتكنولوجيا النانو',
      category: 'الهندسة والتكنولوجيا',
      description: 'تصنيع واختبار المواد المتقدمة، المعادن والسبائك، البوليمرات والمواد المركبة والسيراميك الحديث.',
      degreeAwarded: 'بكالوريوس هندسة المواد',
      yearsOfStudy: 4,
      careerPath: 'مصانع الحديد والصلب، البوليمرات واللدائن، الفحص الهندسي، ووزارة الصناعة والمعادن.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 62.0% صباحي و 60.0% مسائي.',
    };
  }

  // 28. Pure Sciences (Chemistry, Biology, Physics, Geology)
  if (
    norm.includes('كيمياء') ||
    norm.includes('فيزياء') ||
    norm.includes('علوم الحياه') ||
    norm.includes('احياء') ||
    norm.includes('جيولوج') ||
    norm.includes('تحسس نائي') ||
    norm.includes('بيئه')
  ) {
    return {
      id: 'spec-pure-sciences',
      name: 'العلوم الصرفة والتطبيقية (كيمياء، فيزياء، أحياء، بيئة)',
      category: 'العلوم الصرفة والتطبيقية',
      description: 'دراسة العلوم الطبيعية الأساسية والتطبيقية، الكيمياء التحليلية، الفيزياء الإشعاعية، وعلم الأحياء الجزيئي.',
      degreeAwarded: 'بكالوريوس في العلوم (B.Sc.)',
      yearsOfStudy: 4,
      careerPath: 'مختبرات البحوث والسيطرة النوعية، المختبرات البيئية، وزارة النفط، والصناعات الدوائية والغذائية.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 58.0% صباحي و 55.0% مسائي.',
    };
  }

  // 29. Colleges of Education & Basic Education
  if (norm.includes('تربيه') || norm.includes('معلم جامعي')) {
    return {
      id: 'spec-education',
      name: 'التربية والتربية الأساسية (إعداد المدرسين والمعلمين)',
      category: 'الآداب واللغات والتربية',
      description: 'تأهيل كوادر تدريسية جامعية متخصصة للمدارس الإعدادية والمتوسطة والابتدائية بمناهج تربوية وطرق تدريس حديثة.',
      degreeAwarded: 'بكالوريوس في التربية / التربية الأساسية',
      yearsOfStudy: 4,
      careerPath: 'مدرس أو معلم جامعي في مدارس وزارة التربية، المدارس الدولية والخاصة، ومراكز التدريب التربوي.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 55.0% صباحي و 53.0% مسائي.',
    };
  }

  // 30. Agricultural Sciences & Food
  if (norm.includes('زراع') || norm.includes('اغذيه') || norm.includes('محاصيل') || norm.includes('وقايه نبات')) {
    return {
      id: 'spec-agriculture',
      name: 'العلوم الزراعية والأغذية والإنتاج النباتي والحيواني',
      category: 'الزراعة والطب البيطري',
      description: 'علوم الإنتاج النباتي والحيواني، استصلاح الأراضي، وقاية المزروعات، وتكنولوجيا التصنيع الغذائي.',
      degreeAwarded: 'بكالوريوس في العلوم الزراعية',
      yearsOfStudy: 4,
      careerPath: 'مهندس زراعي، إدارة مشاريع البيوت الزجاجية والدواجن، مصانع الألبان والأغذية، ووزارة الزراعة.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 55.0% صباحي و 53.0% مسائي.',
    };
  }

  // 31. Political Science
  if (norm.includes('سياس') || norm.includes('علاقات دوليه')) {
    return {
      id: 'spec-political-science',
      name: 'العلوم السياسية والعلاقات الدولية والدبلوماسية',
      category: 'القانون والعلوم السياسية',
      description: 'دراسة النظم السياسية، العلاقات الدبلوماسية، المنظمات الدولية، الاستراتيجية، وإدارة الأزمات والتحليل السياسي.',
      degreeAwarded: 'بكالوريوس في العلوم السياسية',
      yearsOfStudy: 4,
      careerPath: 'السلك الدبلوماسي بوزارة الخارجية، معاهد الدراسات الاستراتيجية، التحليل السياسي والإعلام الدولي.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 55.0% صباحي و 53.0% مسائي.',
    };
  }

  // 32. Fine Arts & Applied Arts
  if (norm.includes('فنون جميله') || norm.includes('فنون تطبيقيه') || norm.includes('تصميم داخلي')) {
    return {
      id: 'spec-fine-arts',
      name: 'الفنون الجميلة والتصميم الداخلي والطباعي',
      category: 'الإعلام والفنون',
      description: 'التصميم الداخلي والديكور، الفنون التشكيلية والرسم والنحت، التصميم الطباعي والإعلاني، والسينما والمسرح.',
      degreeAwarded: 'بكالوريوس في الفنون الجميلة / التطبيقية',
      yearsOfStudy: 4,
      careerPath: 'مهندس تصميم ديكور داخلي، مخرج، مصمم جرافيك وإعلانات، وفنان تشكيلي بنقابة الفنانين العراقيين.',
      official2026Rule: 'الحد الأدنى للقبول الأهلي: 55.0% صباحي و 53.0% مسائي.',
    };
  }

  // Default fallback for any other unique department
  const slug = 'spec-' + norm.replace(/\s+/g, '-').slice(0, 30);
  return {
    id: slug,
    name: deptName,
    category: category,
    description: `تخصص أكاديمي معتمد في الجامعات العراقية يمنح درجة البكالوريوس مع برامج دراسية متقدمة.`,
    degreeAwarded: 'شهادة البكالوريوس',
    yearsOfStudy: 4,
    careerPath: 'العمل في القطاعين الحكومي والخاص بموجب التخصص الأكاديمي.',
    official2026Rule: 'الحدود الدنيا وفق ضوابط وزارة التعليم العالي والبحث العلمي لسنة 2026.',
  };
}

export const ScoreMatcher: React.FC<ScoreMatcherProps> = ({
  profile,
  setProfile,
  onOpenAssistant,
  onAddToComparison,
  onAddToDraft,
  comparisonItems,
  draftItems,
}) => {
  const [scoreInput, setScoreInput] = useState<string>(profile.score ? profile.score.toString() : '88.50');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTierFilter, setActiveTierFilter] = useState<'all' | 'guaranteed' | 'competitive' | 'parallel'>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>(profile.governorate || 'الكل');
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  // Selected Specialization for the deep drilldown view (ومن ادخل على التخصص تظهر الجامعات)
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);

  // Drilldown filters inside the specialty view
  const [drilldownSectorTab, setDrilldownSectorTab] = useState<'all' | 'حكومي' | 'أهلي'>('all');
  const [drilldownGovFilter, setDrilldownGovFilter] = useState<string>('الكل');
  const [drilldownSortBy, setDrilldownSortBy] = useState<'closest' | 'min_score' | 'max_score' | 'tuition_asc' | 'alpha'>('closest');

  // Compute effective student score with Iraqi bonuses
  const effectiveScore = useMemo(() => {
    const raw = parseFloat(scoreInput) || 0;
    let total = raw;
    if (profile.firstAttemptBonus) total += 1.0; // درجة الدور الأول في العراق
    if (profile.frenchLanguageBonus) total += 0.8; // إضافة نسبة اللغة الأجنبية
    return parseFloat(total.toFixed(2));
  }, [scoreInput, profile.firstAttemptBonus, profile.frenchLanguageBonus]);

  const handleScoreSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseFloat(scoreInput);
    if (!isNaN(val) && val >= 50 && val <= 105) {
      setProfile((prev) => ({ ...prev, score: val }));
      setHasSearched(true);
      setSelectedSpecialtyId(null); // Reset drilldown on new search
    }
  };

  // 1. Gather all matched university departments based on score and branch
  const allMatchedItems = useMemo<ScoreMatchItem[]>(() => {
    if (!effectiveScore || effectiveScore < 50) return [];

    const results: ScoreMatchItem[] = [];
    const branch = profile.branch;
    const pref = profile.preference;

    const isBranchEligible = (eligible: StudyBranch[]) => {
      if (branch === 'علمي') {
        return (
          eligible.includes('علمي') ||
          eligible.includes('أحيائي') ||
          eligible.includes('تطبيقي')
        );
      }
      return eligible.includes(branch);
    };

    // A. Government Universities
    if (pref === 'الكل' || pref === 'حكومي') {
      GOVERNMENT_UNIVERSITIES.forEach((uni) => {
        if (selectedGovernorate !== 'الكل' && uni.governorate !== selectedGovernorate) {
          return;
        }

        uni.departments.forEach((dept) => {
          if (!isBranchEligible(dept.eligibleBranches)) return;

          const diff = effectiveScore - dept.cutoffMorning;

          // Guaranteed Central
          if (diff >= 0) {
            results.push({
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
              scoreDifference: parseFloat(diff.toFixed(2)),
              eligibleBranches: dept.eligibleBranches,
              shift: dept.shift,
              careerPath: dept.careerPath,
            });
          }
          // Competitive (within 1.5 degrees below central cutoff)
          else if (diff >= -1.5) {
            results.push({
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
              matchTier: 'competitive',
              scoreDifference: parseFloat(diff.toFixed(2)),
              eligibleBranches: dept.eligibleBranches,
              shift: dept.shift,
              careerPath: dept.careerPath,
            });
          }
          // Parallel Option
          else if (dept.cutoffParallel && effectiveScore >= dept.cutoffParallel) {
            results.push({
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
              matchTier: 'parallel',
              scoreDifference: parseFloat((effectiveScore - dept.cutoffParallel).toFixed(2)),
              eligibleBranches: dept.eligibleBranches,
              shift: dept.shift,
              careerPath: dept.careerPath,
            });
          }
        });
      });
    }

    // B. Private Universities (with 2026 regulations: 90% dental/pharm, 95% med, no evening for medical)
    if (pref === 'الكل' || pref === 'أهلي') {
      PRIVATE_UNIVERSITIES.forEach((uni) => {
        if (selectedGovernorate !== 'الكل' && uni.governorate !== selectedGovernorate) {
          return;
        }

        uni.departments.forEach((dept) => {
          if (!isBranchEligible(dept.eligibleBranches)) return;

          const diffMorning = effectiveScore - dept.cutoffMorning;
          const diffEvening = dept.cutoffEvening ? effectiveScore - dept.cutoffEvening : -99;

          if (diffMorning >= 0) {
            results.push({
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
              scoreDifference: parseFloat(diffMorning.toFixed(2)),
              eligibleBranches: dept.eligibleBranches,
              shift: dept.hasEvening ? 'كلاهما' : 'صباحي',
              careerPath: dept.careerPath,
            });
          } else if (dept.cutoffEvening && diffEvening >= 0 && dept.hasEvening) {
            results.push({
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
              matchTier: 'parallel',
              scoreDifference: parseFloat(diffEvening.toFixed(2)),
              eligibleBranches: dept.eligibleBranches,
              shift: 'مسائي',
              careerPath: dept.careerPath,
            });
          }
        });
      });
    }

    return results;
  }, [effectiveScore, profile.branch, profile.preference, selectedGovernorate]);

  // 2. Aggregate matched departments into UNIQUE CANONICAL SPECIALTIES
  // This solves the user's issue: "من اكتب معدلي اجعل فقط التخصص يظهر ومن ادخل على التخصص تظهر الجامعات"
  const matchedSpecialties = useMemo<SpecialtyGroup[]>(() => {
    if (allMatchedItems.length === 0) return [];

    const map = new Map<string, SpecialtyGroup>();

    allMatchedItems.forEach((item) => {
      const meta = getCanonicalSpecialtyMeta(item.name, item.category);

      let group = map.get(meta.id);
      if (!group) {
        group = {
          id: meta.id,
          name: meta.name,
          category: meta.category,
          description: meta.description,
          degreeAwarded: meta.degreeAwarded,
          yearsOfStudy: meta.yearsOfStudy,
          careerPath: meta.careerPath,
          official2026Rule: meta.official2026Rule,
          hasMedicalEveningBan: meta.hasMedicalEveningBan,
          minGovMorning: null,
          minGovParallel: null,
          minPrivateMorning: null,
          minPrivateEvening: null,
          minPrivateTuition: null,
          maxPrivateTuition: null,
          govCount: 0,
          privateCount: 0,
          totalCount: 0,
          matchTier: 'guaranteed',
          scoreDifference: -999,
          offerings: [],
        };
        map.set(meta.id, group);
      }

      group.offerings.push(item);
      group.totalCount++;

      if (item.type === 'حكومي') {
        group.govCount++;
        if (group.minGovMorning === null || item.cutoffMorning < group.minGovMorning) {
          group.minGovMorning = item.cutoffMorning;
        }
        if (item.cutoffParallel && (group.minGovParallel === null || item.cutoffParallel < group.minGovParallel)) {
          group.minGovParallel = item.cutoffParallel;
        }
      } else {
        group.privateCount++;
        if (group.minPrivateMorning === null || item.cutoffMorning < group.minPrivateMorning) {
          group.minPrivateMorning = item.cutoffMorning;
        }
        if (item.cutoffEvening && (group.minPrivateEvening === null || item.cutoffEvening < group.minPrivateEvening)) {
          group.minPrivateEvening = item.cutoffEvening;
        }
        if (item.tuitionFeeMorning) {
          if (group.minPrivateTuition === null || item.tuitionFeeMorning < group.minPrivateTuition) {
            group.minPrivateTuition = item.tuitionFeeMorning;
          }
          if (group.maxPrivateTuition === null || item.tuitionFeeMorning > group.maxPrivateTuition) {
            group.maxPrivateTuition = item.tuitionFeeMorning;
          }
        }
      }

      // Compute student tier for the specialty
      if (item.matchTier === 'guaranteed') {
        group.matchTier = 'guaranteed';
      } else if (group.matchTier !== 'guaranteed' && item.matchTier === 'competitive') {
        group.matchTier = 'competitive';
      } else if (group.matchTier !== 'guaranteed' && group.matchTier !== 'competitive' && item.matchTier === 'parallel') {
        group.matchTier = 'parallel';
      }

      if (item.scoreDifference > group.scoreDifference) {
        group.scoreDifference = item.scoreDifference;
      }
    });

    let list = Array.from(map.values());

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // Tier filter
    if (activeTierFilter !== 'all') {
      list = list.filter((s) => s.matchTier === activeTierFilter);
    }

    // Sort: highest cutoffs first (Medicine, Dentistry, Pharmacy, Engineering, etc.)
    return list.sort((a, b) => {
      const scoreA = a.minGovMorning || a.minPrivateMorning || 0;
      const scoreB = b.minGovMorning || b.minPrivateMorning || 0;
      return scoreB - scoreA;
    });
  }, [allMatchedItems, searchQuery, activeTierFilter]);

  // Currently selected specialty for drilldown
  const activeSpecialty = useMemo<SpecialtyGroup | null>(() => {
    if (!selectedSpecialtyId) return null;
    return matchedSpecialties.find((s) => s.id === selectedSpecialtyId) || null;
  }, [selectedSpecialtyId, matchedSpecialties]);

  // Offerings inside the active specialty filtered by sector, governorate, and sorted
  const drilldownOfferings = useMemo(() => {
    if (!activeSpecialty) return [];

    let list = activeSpecialty.offerings;

    // Filter by sector tab (الكل / حكومي / أهلي)
    if (drilldownSectorTab !== 'all') {
      list = list.filter((item) => item.type === drilldownSectorTab);
    }

    // Filter by governorate
    if (drilldownGovFilter !== 'الكل') {
      list = list.filter((item) => item.governorate === drilldownGovFilter);
    }

    // Sort
    return [...list].sort((a, b) => {
      if (drilldownSortBy === 'closest') {
        return Math.abs(effectiveScore - a.cutoffMorning) - Math.abs(effectiveScore - b.cutoffMorning);
      }
      if (drilldownSortBy === 'min_score') {
        return a.cutoffMorning - b.cutoffMorning;
      }
      if (drilldownSortBy === 'max_score') {
        return b.cutoffMorning - a.cutoffMorning;
      }
      if (drilldownSortBy === 'tuition_asc') {
        const feeA = a.tuitionFeeMorning || 0;
        const feeB = b.tuitionFeeMorning || 0;
        return feeA - feeB;
      }
      if (drilldownSortBy === 'alpha') {
        return a.universityName.localeCompare(b.universityName, 'ar');
      }
      return 0;
    });
  }, [activeSpecialty, drilldownSectorTab, drilldownGovFilter, drilldownSortBy, effectiveScore]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalDepts = allMatchedItems.length;
    const guaranteedCount = matchedSpecialties.filter((m) => m.matchTier === 'guaranteed').length;
    const competitiveCount = matchedSpecialties.filter((m) => m.matchTier === 'competitive').length;
    const parallelCount = matchedSpecialties.filter((m) => m.matchTier === 'parallel').length;
    return { totalDepts, guaranteedCount, competitiveCount, parallelCount };
  }, [allMatchedItems, matchedSpecialties]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header & Score Input Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-[#F5F5F7] border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-10">
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            منصة مَجَرّة • استعلام التخصصات والحدود الدنيا لسنة 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1D1D1F]">
            اكتشف التخصصات المطابقة لمعدلك
          </h1>
          <p className="text-sm sm:text-base text-[#86868B] max-w-2xl mx-auto">
            أدخل معدلك بدقة واستعرض فقط <strong>التخصصات المؤهل لها</strong>، ثم اضغط على التخصص لمشاهدة كافة الجامعات الحكومية والأهلية التي تحتويه مع الحدود الدنيا وأقساط 2026 الرسمية.
          </p>
          <div className="text-xs font-bold text-[#0071E3] pt-1">
            صُنع بواسطة المهندس مهدي عصام
          </div>
        </div>

        {/* The Main Matcher Bar Form */}
        <form onSubmit={handleScoreSubmit} className="max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E5E5EA] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* 1. Score Input */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-semibold text-[#1D1D1F]">
                1. المعدل مع البوينتات:
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="50"
                  max="105"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  placeholder="مثال: 92.40"
                  required
                  className="w-full text-lg font-bold px-4 py-3 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] focus:border-[#0071E3] focus:bg-white focus:outline-none transition-all text-[#1D1D1F]"
                />
                <span className="absolute left-3 top-3.5 text-xs text-[#86868B] font-medium">
                  درجة / %
                </span>
              </div>
            </div>

            {/* 2. Branch */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-semibold text-[#1D1D1F]">
                2. الفرع الدراسي الإعدادي:
              </label>
              <select
                value={profile.branch}
                onChange={(e) => {
                  const val = e.target.value as StudyBranch;
                  setProfile((prev) => ({ ...prev, branch: val }));
                  setSelectedSpecialtyId(null);
                }}
                className="w-full text-xs font-semibold px-3 py-3 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] focus:border-[#0071E3] focus:bg-white focus:outline-none transition-all text-[#1D1D1F]"
              >
                {STUDY_BRANCHES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Sector Preference */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-semibold text-[#1D1D1F]">
                3. قطاع التعليم:
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#F5F5F7] p-1 rounded-xl border border-[#E5E5EA]">
                {(['الكل', 'حكومي', 'أهلي'] as EducationPreference[]).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => {
                      setProfile((p) => ({ ...p, preference: pref }));
                      setSelectedSpecialtyId(null);
                    }}
                    className={`py-2 text-xs font-medium rounded-lg transition-all ${
                      profile.preference === pref
                        ? 'bg-white text-[#0071E3] shadow-xs font-bold'
                        : 'text-[#86868B] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Controls & Iraqi Bonus Badges */}
          <div className="pt-2 border-t border-[#F5F5F7] flex flex-wrap items-center justify-between gap-4">
            {/* Governorate Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#86868B]" />
              <select
                value={selectedGovernorate}
                onChange={(e) => {
                  setSelectedGovernorate(e.target.value);
                  setProfile((p) => ({ ...p, governorate: e.target.value }));
                  setSelectedSpecialtyId(null);
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] focus:outline-none"
              >
                <option value="الكل">جميع محافظات العراق (شامل كردستان)</option>
                {IRAQI_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            {/* Iraqi Bonus points toggles */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#1D1D1F] select-none">
                <input
                  type="checkbox"
                  checked={profile.firstAttemptBonus}
                  onChange={(e) => setProfile((p) => ({ ...p, firstAttemptBonus: e.target.checked }))}
                  className="rounded text-[#0071E3] focus:ring-[#0071E3] w-4 h-4 border-[#E5E5EA]"
                />
                <span>درجة الدور الأول (+1)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#1D1D1F] select-none">
                <input
                  type="checkbox"
                  checked={profile.frenchLanguageBonus}
                  onChange={(e) => setProfile((p) => ({ ...p, frenchLanguageBonus: e.target.checked }))}
                  className="rounded text-[#0071E3] focus:ring-[#0071E3] w-4 h-4 border-[#E5E5EA]"
                />
                <span>اللغة الإضافية (+0.8)</span>
              </label>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 pt-1 text-xs text-[#86868B] overflow-x-auto pb-1">
            <span className="shrink-0 font-medium">معدلات شائعة:</span>
            {[99.5, 96.0, 92.5, 90.0, 84.5, 75.0, 68.5, 59.0].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setScoreInput(preset.toString());
                  setProfile((p) => ({ ...p, score: preset }));
                  setSelectedSpecialtyId(null);
                }}
                className="shrink-0 px-2.5 py-1 rounded-md bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </form>

        {/* Live Calculation Banner */}
        <div className="max-w-4xl mx-auto mt-4 px-4 py-2.5 rounded-xl bg-[#0071E3]/5 border border-[#0071E3]/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#1D1D1F]">
            <Info className="w-4 h-4 text-[#0071E3] shrink-0" />
            <span>
              المعدل المعتمد للمطابقة الذكية:{' '}
              <strong className="text-[#0071E3] font-bold text-sm">{effectiveScore}</strong>
              {(profile.firstAttemptBonus || profile.frenchLanguageBonus) && (
                <span className="text-[#86868B] mr-1">
                  (شامل درجات المفاضلة الرسمية)
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenAssistant(`معدلي هو ${effectiveScore} وفرعي ${profile.branch} في محافظة ${selectedGovernorate}، ما هي نصيحتك لأفضل التخصصات والكليات؟`)}
            className="text-[#0071E3] font-semibold hover:underline flex items-center gap-1"
          >
            استشر الذكاء الاصطناعي
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          VIEW A: DRILLDOWN INTO A SELECTED SPECIALTY (ومن ادخل على التخصص تظهر الجامعات)
          ========================================================================= */}
      {activeSpecialty ? (
        <section className="space-y-6 animate-fadeIn">
          {/* Back Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E5E5EA]">
            <button
              type="button"
              onClick={() => setSelectedSpecialtyId(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] text-xs font-bold transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة إلى قائمة كافة التخصصات ({matchedSpecialties.length})
            </button>

            <div className="text-xs text-[#86868B]">
              استعراض الجامعات التي تحتوي على:{' '}
              <strong className="text-[#1D1D1F] font-bold">{activeSpecialty.name}</strong>
            </div>
          </div>

          {/* Specialty Hero Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5EA] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F7] pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3]">
                    {activeSpecialty.category}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#86868B]">
                    مدة الدراسة: {activeSpecialty.yearsOfStudy} سنوات
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">
                  {activeSpecialty.name}
                </h2>
                <p className="text-sm text-[#86868B] max-w-3xl leading-relaxed">
                  {activeSpecialty.description}
                </p>
              </div>

              {/* Awarded Degree Card */}
              <div className="bg-[#F5F5F7] rounded-2xl p-4 min-w-[260px] border border-[#E5E5EA] space-y-1">
                <div className="text-[11px] text-[#86868B]">الشهادة الممنوحة للخريج:</div>
                <div className="text-xs font-bold text-[#1D1D1F]">
                  {activeSpecialty.degreeAwarded}
                </div>
                <div className="text-[11px] text-[#0071E3] pt-1">
                  متاح في {activeSpecialty.govCount} جامعة حكومية و {activeSpecialty.privateCount} كلية وجامعة أهلية
                </div>
              </div>
            </div>

            {/* Official 2026 Regulation Alert Box if available */}
            {activeSpecialty.official2026Rule && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-900">
                    ضوابط وقرارات وزارة التعليم العالي والبحث العلمي المعتمدة لسنة 2026:
                  </div>
                  <p className="leading-relaxed">{activeSpecialty.official2026Rule}</p>
                </div>
              </div>
            )}

            {/* Sector Tabs: الحكومي / الأهلي / الكل */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs font-bold text-[#1D1D1F]">
                  اختر القطاع لعرض الجامعات التابعة له:
                </div>
                <div className="text-xs text-[#86868B]">
                  معروض حالياً: {drilldownOfferings.length} جامعة وكلية
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDrilldownSectorTab('all')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    drilldownSectorTab === 'all'
                      ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm font-bold'
                      : 'bg-white text-[#1D1D1F] border-[#E5E5EA] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <div className="text-sm font-bold">كافة الجامعات والكليات</div>
                  <div className={`text-xs mt-0.5 ${drilldownSectorTab === 'all' ? 'text-white/80' : 'text-[#86868B]'}`}>
                    {activeSpecialty.offerings.length} مؤسسة تعليمية
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDrilldownSectorTab('حكومي')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    drilldownSectorTab === 'حكومي'
                      ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-sm font-bold'
                      : 'bg-white text-[#0071E3] border-[#0071E3]/30 hover:bg-[#0071E3]/5'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center justify-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    الجامعات الحكومية
                  </div>
                  <div className={`text-xs mt-0.5 ${drilldownSectorTab === 'حكومي' ? 'text-white/80' : 'text-[#86868B]'}`}>
                    {activeSpecialty.govCount} جامعة حكومية
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDrilldownSectorTab('أهلي')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    drilldownSectorTab === 'أهلي'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                      : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center justify-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    الجامعات والكليات الأهلية
                  </div>
                  <div className={`text-xs mt-0.5 ${drilldownSectorTab === 'أهلي' ? 'text-white/80' : 'text-[#86868B]'}`}>
                    {activeSpecialty.privateCount} جامعة وكلية أهلية
                  </div>
                </button>
              </div>
            </div>

            {/* In-view Governorate Filter & Sorter */}
            <div className="pt-4 border-t border-[#F5F5F7] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#86868B]">المحافظة:</span>
                <select
                  value={drilldownGovFilter}
                  onChange={(e) => setDrilldownGovFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] focus:outline-none"
                >
                  <option value="الكل">كل المحافظات</option>
                  {IRAQI_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#86868B]">ترتيب حسب:</span>
                <select
                  value={drilldownSortBy}
                  onChange={(e) => setDrilldownSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] focus:outline-none"
                >
                  <option value="closest">الأقرب لمعدلك ({effectiveScore})</option>
                  <option value="min_score">الأقل معدل قبول</option>
                  <option value="max_score">الأعلى معدل قبول</option>
                  <option value="tuition_asc">الأقل قسطاً سنوياً (للأهلي)</option>
                  <option value="alpha">أبجدياً باسم الجامعة</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Universities Offering this Specialty */}
          {drilldownOfferings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5E5EA] p-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-[#86868B] mx-auto" />
              <h3 className="text-base font-bold text-[#1D1D1F]">
                لا توجد جامعات مطابقة للفلتر المحدد
              </h3>
              <p className="text-xs text-[#86868B]">
                جرب تغيير المحافظة أو التبديل بين قطاع التعليم الحكومي والأهلي.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {drilldownOfferings.map((item) => {
                const isCompared = comparisonItems.some((c) => c.id === item.id);
                const isDrafted = draftItems.some((d) => d.id === item.id);

                return (
                  <div
                    key={`${item.id}-${item.matchTier}`}
                    className={`group relative flex flex-col justify-between rounded-2xl bg-white border p-5 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
                      item.type === 'حكومي'
                        ? 'border-[#E5E5EA] hover:border-[#0071E3]/40'
                        : 'border-[#E5E5EA] hover:border-emerald-500/40'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.type === 'حكومي'
                              ? 'bg-blue-50 text-[#0071E3] border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {item.type === 'حكومي' ? '🏛️ جامعة حكومية' : '🎓 جامعة/كلية أهلية'}
                        </span>

                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#86868B]" />
                          {item.governorate}
                        </span>
                      </div>

                      {/* University & College Name */}
                      <h4 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors line-clamp-1">
                        {item.universityName}
                      </h4>
                      <p className="text-xs text-[#86868B] mt-0.5 line-clamp-1">
                        {item.collegeName} • قسم {item.name}
                      </p>

                      {/* Detailed Sector Information */}
                      <div className="mt-4 p-3.5 rounded-xl bg-[#F5F5F7] space-y-2 text-xs">
                        {item.type === 'حكومي' ? (
                          <>
                            {/* Government Data */}
                            <div className="flex items-center justify-between">
                              <span className="text-[#86868B]">المركزي الصباحي:</span>
                              <span className="font-bold text-[#1D1D1F]">
                                {item.cutoffMorning}%
                                {item.scoreDifference >= 0 ? (
                                  <span className="text-emerald-700 text-[11px] mr-1 font-semibold">
                                    (معدلك أعلى بـ {item.scoreDifference})
                                  </span>
                                ) : (
                                  <span className="text-amber-700 text-[11px] mr-1 font-semibold">
                                    ({item.scoreDifference})
                                  </span>
                                )}
                              </span>
                            </div>

                            {item.cutoffParallel && (
                              <div className="flex items-center justify-between pt-1 border-t border-[#E5E5EA]">
                                <span className="text-[#86868B]">التعليم الموازي:</span>
                                <span className="font-bold text-[#0071E3]">
                                  {item.cutoffParallel}%
                                  {item.tuitionFeeMorning && (
                                    <span className="text-[#86868B] text-[10px] mr-1 font-normal">
                                      ({(item.tuitionFeeMorning / 1000000).toFixed(1)} مليون د.ع)
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-[#E5E5EA] text-[11px]">
                              <span className="text-[#86868B]">الدراسة المسائية:</span>
                              <span className="font-medium text-[#1D1D1F]">
                                {item.cutoffEvening ? `${item.cutoffEvening}%` : 'غير متاحة بالمركزي'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Private Data */}
                            <div className="flex items-center justify-between">
                              <span className="text-[#86868B]">الحد الأدنى للقبول (2026):</span>
                              <span className="font-bold text-emerald-800 text-sm">
                                {item.cutoffMorning}%
                              </span>
                            </div>

                            {item.tuitionFeeMorning && (
                              <div className="flex items-center justify-between pt-1 border-t border-[#E5E5EA]">
                                <span className="text-[#86868B]">القسط السنوي الصباحي:</span>
                                <span className="font-bold text-[#1D1D1F]">
                                  {item.tuitionFeeMorning.toLocaleString('ar-IQ')} د.ع
                                </span>
                              </div>
                            )}

                            {/* Medical Evening Ban Notice vs Available Evening */}
                            <div className="pt-1 border-t border-[#E5E5EA] text-[11px]">
                              {activeSpecialty.hasMedicalEveningBan ? (
                                <div className="text-rose-700 font-semibold flex items-center gap-1">
                                  <span>🚫 المسائي: ملغى بقرار وزاري لسنة 2026</span>
                                </div>
                              ) : item.cutoffEvening ? (
                                <div className="flex items-center justify-between text-[#1D1D1F]">
                                  <span className="text-[#86868B]">المسائي المتاح:</span>
                                  <span className="font-bold text-indigo-700">
                                    {item.cutoffEvening}%
                                    {item.tuitionFeeEvening && (
                                      <span className="text-[#86868B] text-[10px] mr-1 font-normal">
                                        ({(item.tuitionFeeEvening / 1000000).toFixed(1)} م د.ع)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[#86868B]">المسائي: دراسة صباحية فقط</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-[#F5F5F7] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onAddToDraft(item)}
                        disabled={isDrafted}
                        className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                          isDrafted
                            ? 'bg-emerald-50 text-emerald-700 font-semibold'
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
                            إضافة للمسودة
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
                              cutoffEvening: item.cutoffEvening,
                              cutoffParallel: item.cutoffParallel,
                              tuitionFeeMorning: item.tuitionFeeMorning,
                              tuitionFeeEvening: item.tuitionFeeEvening,
                              yearsOfStudy: item.yearsOfStudy,
                              eligibleBranches: item.eligibleBranches,
                              careerPath: item.careerPath,
                            })
                          }
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isCompared
                              ? 'bg-[#1D1D1F] text-white'
                              : 'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F]'
                          }`}
                          title="مقارنة هذه الجامعة"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onOpenAssistant(
                              `أريد معرفة تفاصيل أكثر عن قبول تخصص ${activeSpecialty.name} في ${item.universityName} بمعدلي ${effectiveScore}. ما هي فرص التعيين وفرص العمل؟`
                            )
                          }
                          className="p-1.5 rounded-lg bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] transition-colors"
                          title="اسأل المساعد الذكي عن هذه الجامعة"
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
        </section>
      ) : (
        /* =========================================================================
           VIEW B: UNIQUE SPECIALIZATIONS LIST (فقط التخصص يظهر)
           ========================================================================= */
        hasSearched && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                  التخصصات المتاحة لمعدلك ({matchedSpecialties.length} تخصص أكاديمي)
                </h2>
                <p className="text-xs text-[#86868B]">
                  اضغط على أي تخصص لعرض كافة الجامعات الحكومية والأهلية التي تحتويه مع معدلات القبول وأقساط 2026.
                </p>
              </div>

              {/* Quick Search inside Specialties */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم التخصص (مثلاً: أسنان، تمريض)..."
                  className="w-full text-xs px-3.5 py-2.5 pl-8 rounded-xl bg-white border border-[#E5E5EA] focus:border-[#0071E3] focus:outline-none transition-all"
                />
                <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-3" />
              </div>
            </div>

            {/* Match Tier Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setActiveTierFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeTierFilter === 'all'
                    ? 'bg-[#1D1D1F] text-white shadow-xs'
                    : 'bg-white text-[#86868B] border border-[#E5E5EA] hover:text-[#1D1D1F]'
                }`}
              >
                كافة التخصصات ({matchedSpecialties.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTierFilter('guaranteed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTierFilter === 'guaranteed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                تخصصات مضمونة ومؤكدة ({stats.guaranteedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTierFilter('competitive')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTierFilter === 'competitive'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                تخصصات تنافسية متقاربة ({stats.competitiveCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTierFilter('parallel')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTierFilter === 'parallel'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'bg-white text-[#0071E3] border border-[#0071E3]/20 hover:bg-[#0071E3]/5'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                موازي ومسائي متاح ({stats.parallelCount})
              </button>
            </div>

            {/* Specialties Cards Grid */}
            {matchedSpecialties.length === 0 ? (
              <div className="rounded-3xl bg-white border border-[#E5E5EA] p-12 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-[#86868B] mx-auto" />
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  لا توجد تخصصات مطابقة تماماً للمدخلات
                </h3>
                <p className="text-xs text-[#86868B] max-w-md mx-auto">
                  جرب تغيير قطاع التعليم (حكومي/أهلي) أو إضافة درجات الدور الأول واللغة، أو استفسر من المساعد الذكي.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenAssistant(`معدلي ${effectiveScore} وفرعي ${profile.branch}، ما هي التخصصات المقترحة لي في الجامعات الحكومية والأهلية؟`)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  اسأل مساعد مجرى الذكي
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchedSpecialties.map((spec) => {
                  return (
                    <div
                      key={spec.id}
                      onClick={() => setSelectedSpecialtyId(spec.id)}
                      className="group cursor-pointer flex flex-col justify-between rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] hover:shadow-[0_12px_32px_rgba(0,113,227,0.08)] p-5 transition-all duration-200"
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3]">
                            {spec.category}
                          </span>

                          {spec.matchTier === 'guaranteed' && (
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              مقبول ومضمون
                            </span>
                          )}
                          {spec.matchTier === 'competitive' && (
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              تنافسي
                            </span>
                          )}
                          {spec.matchTier === 'parallel' && (
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              موازي/مسائي
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors line-clamp-1">
                          {spec.name}
                        </h3>
                        <p className="text-xs text-[#86868B] mt-1 line-clamp-2 leading-relaxed">
                          {spec.description}
                        </p>

                        {/* Minimum Cutoffs Breakdown for this Specialty */}
                        <div className="mt-4 p-3 rounded-xl bg-[#F5F5F7] space-y-2 text-xs">
                          {/* Government Cutoff */}
                          <div className="flex items-center justify-between">
                            <span className="text-[#86868B]">الحد الأدنى الحكومي:</span>
                            <span className="font-bold text-[#1D1D1F]">
                              {spec.minGovMorning ? `من ${spec.minGovMorning}%` : 'غير متوفر بالفلتر'}
                            </span>
                          </div>

                          {/* Private Cutoff (with 2026 rule) */}
                          <div className="flex items-center justify-between pt-1 border-t border-[#E5E5EA]">
                            <span className="text-[#86868B]">الحد الأدنى الأهلي (2026):</span>
                            <span className="font-bold text-emerald-800">
                              {spec.minPrivateMorning ? `${spec.minPrivateMorning}%` : 'غير متوفر'}
                              {spec.hasMedicalEveningBan && (
                                <span className="text-rose-600 text-[10px] mr-1 font-normal">
                                  (صباحي فقط)
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Availability counts */}
                          <div className="flex items-center justify-between pt-1 border-t border-[#E5E5EA] text-[11px] text-[#86868B]">
                            <span>المؤسسات المتاحة:</span>
                            <span className="font-semibold text-[#1D1D1F]">
                              {spec.govCount} حكومية • {spec.privateCount} أهلية
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-3 border-t border-[#F5F5F7] flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0071E3] group-hover:underline flex items-center gap-1">
                          استعراض الجامعات والكليات المتاحة ({spec.totalCount})
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center group-hover:bg-[#0071E3] group-hover:text-white transition-colors">
                          <Building2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )
      )}
    </div>
  );
};
