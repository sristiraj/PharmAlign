import { HCP, Territory, ChartDataPoint } from '../types';

export const mockTerritories: Territory[] = [
  { id: 'T001', name: 'NYC Metro North', countryId: 'US', repName: 'Sarah Jenkins', district: 'Northeast', hcpCount: 145, totalPotential: 890000, workloadIndex: 1.25, geographicSize: 45 },
  { id: 'T002', name: 'Boston Central', countryId: 'US', repName: 'Mike Ross', district: 'Northeast', hcpCount: 110, totalPotential: 650000, workloadIndex: 0.95, geographicSize: 120 },
  { id: 'T003', name: 'Philadelphia West', countryId: 'US', repName: 'Jessica Lee', district: 'Mid-Atlantic', hcpCount: 130, totalPotential: 720000, workloadIndex: 1.05, geographicSize: 85 },
  { id: 'T004', name: 'DC Metro', countryId: 'US', repName: 'David Chen', district: 'Mid-Atlantic', hcpCount: 155, totalPotential: 910000, workloadIndex: 1.35, geographicSize: 60 },
];

export const mockHCPs: HCP[] = [
  { id: 'H001', npi: '1234567890', name: 'Dr. Emily Carter', specialty: 'Cardiology', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', countryId: 'US', potentialScore: 92, decile: 10, trxVolume: 450, nrxGrowth: 12, lastVisitDate: '2023-10-15', nextPlannedVisit: '2023-10-28', territoryId: 'T001' },
  { id: 'H002', npi: '0987654321', name: 'Dr. James Wilson', specialty: 'Endocrinology', address: '456 Park Ave', city: 'New York', state: 'NY', zip: '10002', countryId: 'US', potentialScore: 88, decile: 9, trxVolume: 380, nrxGrowth: 5, lastVisitDate: '2023-10-10', nextPlannedVisit: '2023-10-30', territoryId: 'T001' },
  { id: 'H003', npi: '1122334455', name: 'Dr. Sarah Smith', specialty: 'Internal Medicine', address: '789 Broadway', city: 'Boston', state: 'MA', zip: '02110', countryId: 'US', potentialScore: 75, decile: 7, trxVolume: 210, nrxGrowth: -2, lastVisitDate: '2023-09-25', nextPlannedVisit: '2023-11-01', territoryId: 'T002' },
  { id: 'H004', npi: '5566778899', name: 'Dr. Michael Chang', specialty: 'Cardiology', address: '321 Elm St', city: 'Philadelphia', state: 'PA', zip: '19104', countryId: 'US', potentialScore: 95, decile: 10, trxVolume: 520, nrxGrowth: 15, lastVisitDate: '2023-10-20', nextPlannedVisit: '2023-10-27', territoryId: 'T003' },
  { id: 'H005', npi: '6677889900', name: 'Dr. Linda White', specialty: 'Nephrology', address: '555 Pine St', city: 'Washington', state: 'DC', zip: '20001', countryId: 'US', potentialScore: 82, decile: 8, trxVolume: 310, nrxGrowth: 8, lastVisitDate: '2023-10-05', nextPlannedVisit: '2023-11-05', territoryId: 'T004' },
];

export const performanceData: ChartDataPoint[] = [
  { name: 'Jan', value: 4000, target: 3800, secondary: 120 },
  { name: 'Feb', value: 3000, target: 3900, secondary: 132 },
  { name: 'Mar', value: 4500, target: 4000, secondary: 101 },
  { name: 'Apr', value: 4200, target: 4100, secondary: 134 },
  { name: 'May', value: 4800, target: 4200, secondary: 190 },
  { name: 'Jun', value: 5100, target: 4300, secondary: 230 },
];

export const workloadDistribution: ChartDataPoint[] = [
  { name: 'T001', value: 1.25 },
  { name: 'T002', value: 0.95 },
  { name: 'T003', value: 1.05 },
  { name: 'T004', value: 1.35 },
];