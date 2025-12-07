export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TERRITORY_MAP = 'TERRITORY_MAP',
  REP_360 = 'REP_360',
  AI_ADVISOR = 'AI_ADVISOR',
  CALL_PLANNER = 'CALL_PLANNER',
  SCENARIO_SIMULATOR = 'SCENARIO_SIMULATOR'
}

export interface Region {
  id: string;
  name: string;
}

export interface Affiliate {
  id: string;
  name: string; // e.g., "Pharma UK Ltd"
  code: string;
  legalEntity: string;
  currency: string;
}

export interface Country {
  id: string;
  name: string;
  regionId: string;
  affiliateId?: string; // Link to affiliate for non-US
}

export interface ZipMapping {
  zip: string;
  city: string;
  territoryId: string;
  countryId: string;
}

export interface HCP {
  id: string;
  npi: string; // Or local ID for non-US
  name: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  countryId: string;
  potentialScore: number; // 0-100
  decile: number; // 1-10
  trxVolume: number;
  nrxGrowth: number;
  lastVisitDate: string;
  nextPlannedVisit: string;
  territoryId: string;
}

export interface Territory {
  id: string;
  name: string;
  countryId: string;
  repName: string;
  district: string;
  hcpCount: number;
  totalPotential: number;
  workloadIndex: number; // 0-1.5 (1.0 is balanced)
  geographicSize: number; // sq miles
}

export interface ChartDataPoint {
  name: string;
  value: number;
  target?: number;
  secondary?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}