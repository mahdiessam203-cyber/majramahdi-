import { PrivateUniversity } from '../types';
import { PRIVATE_UNIVERSITIES_PART1 } from './privateUniversitiesPart1';
import { PRIVATE_UNIVERSITIES_PART2 } from './privateUniversitiesPart2';
import { PRIVATE_UNIVERSITIES_PART3 } from './privateUniversitiesPart3';
import { KURDISTAN_UNIVERSITIES } from './kurdistanUniversities';

// 75 Private Universities & Colleges from Federal Iraqi Governorates
export const FEDERAL_PRIVATE_UNIVERSITIES: PrivateUniversity[] = [
  ...PRIVATE_UNIVERSITIES_PART1,
  ...PRIVATE_UNIVERSITIES_PART2,
  ...PRIVATE_UNIVERSITIES_PART3,
];

// Re-export Kurdistan Universities (14)
export { KURDISTAN_UNIVERSITIES } from './kurdistanUniversities';

// Complete Directory of all Private Universities & Colleges in Iraq (75 Federal + 14 Kurdistan = 89)
export const ALL_PRIVATE_UNIVERSITIES: PrivateUniversity[] = [
  ...FEDERAL_PRIVATE_UNIVERSITIES,
  ...KURDISTAN_UNIVERSITIES,
];
