
export enum Language {
  DE = 'DE',
  EN = 'EN',
  TR = 'TR'
}

export enum CareType {
  LONG_TERM = 'LONG_TERM',
  SHORT_TERM = 'SHORT_TERM',
  DAY_CARE = 'DAY_CARE'
}

export enum CareLevel {
  NONE = 'NONE',
  LEVEL_1 = '1',
  LEVEL_2 = '2',
  LEVEL_3 = '3',
  LEVEL_4 = '4',
  LEVEL_5 = '5'
}

export enum DementiaStatus {
  DEMENTIA = 'DEMENTIA',
  NO_DEMENTIA = 'NO_DEMENTIA',
  UNSURE = 'UNSURE'
}

export interface CareHome {
  id: string;
  name: string;
  zip: string;
  city: string;
  distance: number; // Mocked distance
  supportedTypes: CareType[];
  description?: string;
}

export interface FamilyRequestData {
  careTypes: CareType[];
  careLevel: CareLevel;
  dementiaStatus: DementiaStatus;
  conditions: string[];
  notes: string;
  zip: string;
  city: string;
  radius: number;
  selectedHomes: string[]; // Home IDs
  
  // Patient Data
  firstName: string;
  lastName: string;
  birthDate: string;
  
  // Current Address Split
  currentStreet: string;
  currentHouseNumber: string;
  currentZip: string;
  currentCity: string;
  currentAddressNotes: string;

  insuranceProvider: string;
  insuranceNumber: string;
  
  // Documents & Extras
  docIdCard: boolean;
  docCareLevel: boolean;
  docPowerOfAttorney: boolean;
  
  needsParking: boolean;
  fileDoctorLetter: string | null; // Fake file path/name
  filePowerOfAttorney: string | null; // Fake file path/name
  
  // Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  isLegalGuardian: boolean;
  
  // Consents
  acceptedAGB: boolean;
  acceptedPrivacy: boolean;
  acceptedReliefBilling: boolean; // §45b
  acceptedWaitlist: boolean;
}

export enum AppView {
  LANDING = 'LANDING',
  FAMILY_FLOW = 'FAMILY_FLOW',
  CARE_HOME_PORTAL = 'CARE_HOME_PORTAL'
}

export enum FamilyStep {
  CARE_TYPE = 0,
  MEDICAL_INFO = 1,
  REGION = 2,
  HOME_SELECTION = 3,
  ADMISSION_DATA = 4,
  CONTACT_INFO = 5,
  DOCUMENTS_AND_EXTRAS = 6, // New Step
  CONSENTS = 7,
  SUCCESS = 8
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
