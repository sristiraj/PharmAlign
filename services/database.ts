import { Region, Country, Affiliate, Territory, ZipMapping, HCP } from '../types';
import { mockTerritories, mockHCPs } from './mockData';

// Simulating a backend SQL database structure
class DatabaseService {
  private regions: Region[] = [];
  private countries: Country[] = [];
  private affiliates: Affiliate[] = [];
  private territories: Territory[] = [];
  private zipMappings: ZipMapping[] = [];
  private hcps: HCP[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Seed Regions
    this.regions = [
      { id: 'NA', name: 'North America' },
      { id: 'EMEA', name: 'Europe, Middle East & Africa' },
      { id: 'APAC', name: 'Asia Pacific' }
    ];

    // 2. Seed Affiliates (mostly for non-US)
    this.affiliates = [
      { id: 'AFF_UK', name: 'PharmaAlign UK Ltd.', code: 'GB-01', legalEntity: 'Limited', currency: 'GBP' },
      { id: 'AFF_CA', name: 'PharmaAlign Canada Inc.', code: 'CA-01', legalEntity: 'Corporation', currency: 'CAD' },
      { id: 'AFF_DE', name: 'PharmaAlign Deutschland GmbH', code: 'DE-01', legalEntity: 'GmbH', currency: 'EUR' }
    ];

    // 3. Seed Countries
    this.countries = [
      { id: 'US', name: 'United States', regionId: 'NA' }, // US typically manages directly, no separate affiliate object for this demo
      { id: 'GB', name: 'United Kingdom', regionId: 'EMEA', affiliateId: 'AFF_UK' },
      { id: 'CA', name: 'Canada', regionId: 'NA', affiliateId: 'AFF_CA' },
      { id: 'DE', name: 'Germany', regionId: 'EMEA', affiliateId: 'AFF_DE' }
    ];

    // 4. Seed Territories
    // Add US territories from mockData but enrich with countryId
    const usTerritories = mockTerritories.map(t => ({ ...t, countryId: 'US' }));
    
    const intlTerritories: Territory[] = [
      // UK
      { id: 'T_UK_01', name: 'London Central', countryId: 'GB', repName: 'James Sterling', district: 'Greater London', hcpCount: 95, totalPotential: 550000, workloadIndex: 1.1, geographicSize: 25 },
      { id: 'T_UK_02', name: 'Manchester North', countryId: 'GB', repName: 'Sarah Higgins', district: 'North West', hcpCount: 88, totalPotential: 420000, workloadIndex: 0.9, geographicSize: 150 },
      // Canada
      { id: 'T_CA_01', name: 'Toronto Downtown', countryId: 'CA', repName: 'Robert Labelle', district: 'Ontario', hcpCount: 112, totalPotential: 480000, workloadIndex: 1.05, geographicSize: 40 },
      // Germany
      { id: 'T_DE_01', name: 'Berlin Mitte', countryId: 'DE', repName: 'Klaus Muller', district: 'Berlin', hcpCount: 105, totalPotential: 600000, workloadIndex: 1.15, geographicSize: 35 }
    ];

    this.territories = [...usTerritories, ...intlTerritories];

    // 5. Seed Zip/Postal Mappings
    this.zipMappings = [
      { zip: '10001', city: 'New York', territoryId: 'T001', countryId: 'US' },
      { zip: 'SW1A', city: 'London', territoryId: 'T_UK_01', countryId: 'GB' },
      { zip: 'M1 1AA', city: 'Manchester', territoryId: 'T_UK_02', countryId: 'GB' },
      { zip: 'M5V', city: 'Toronto', territoryId: 'T_CA_01', countryId: 'CA' },
      { zip: '10115', city: 'Berlin', territoryId: 'T_DE_01', countryId: 'DE' }
    ];

    // 6. Seed HCPs
    // Migrate mock HCPs
    const usHcps = mockHCPs.map(h => ({ ...h, countryId: 'US' }));
    
    const intlHcps: HCP[] = [
      { id: 'H_UK_01', npi: 'GMC-1234567', name: 'Dr. Arthur Conan', specialty: 'Cardiology', address: '221B Baker St', city: 'London', state: 'LND', zip: 'SW1A', countryId: 'GB', potentialScore: 88, decile: 9, trxVolume: 320, nrxGrowth: 4, lastVisitDate: '2023-10-12', nextPlannedVisit: '2023-11-02', territoryId: 'T_UK_01' },
      { id: 'H_CA_01', npi: 'CPSO-98765', name: 'Dr. Celine Dion', specialty: 'Oncology', address: '123 Yonge St', city: 'Toronto', state: 'ON', zip: 'M5V', countryId: 'CA', potentialScore: 94, decile: 10, trxVolume: 410, nrxGrowth: 8, lastVisitDate: '2023-10-18', nextPlannedVisit: '2023-10-29', territoryId: 'T_CA_01' }
    ];

    this.hcps = [...usHcps, ...intlHcps];
  }

  // --- SQL-like Query Methods ---

  public getRegions(): Region[] {
    return this.regions;
  }

  public getCountries(regionId?: string): Country[] {
    if (regionId) {
      return this.countries.filter(c => c.regionId === regionId);
    }
    return this.countries;
  }

  public getAffiliateByCountry(countryId: string): Affiliate | undefined {
    const country = this.countries.find(c => c.id === countryId);
    if (!country || !country.affiliateId) return undefined;
    return this.affiliates.find(a => a.id === country.affiliateId);
  }

  public getTerritories(countryId: string): Territory[] {
    return this.territories.filter(t => t.countryId === countryId);
  }

  public getAllTerritories(): Territory[] {
    return this.territories;
  }

  public getHCPs(territoryId?: string): HCP[] {
    if (territoryId) {
      return this.hcps.filter(h => h.territoryId === territoryId);
    }
    return this.hcps;
  }

  public getZipMapping(zip: string): ZipMapping | undefined {
    return this.zipMappings.find(z => z.zip === zip);
  }

  // Analytical Queries
  public getCountryStats(countryId: string) {
    const territories = this.getTerritories(countryId);
    const totalPotential = territories.reduce((sum, t) => sum + t.totalPotential, 0);
    const avgWorkload = territories.length > 0 
      ? (territories.reduce((sum, t) => sum + t.workloadIndex, 0) / territories.length).toFixed(2)
      : 0;
    
    return {
      territoryCount: territories.length,
      totalPotential,
      avgWorkload
    };
  }
}

export const db = new DatabaseService();