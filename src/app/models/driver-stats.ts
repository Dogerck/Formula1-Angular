export interface DriverStats {
  driverId: string;
  givenName: string;
  familyName: string;
  url: string;
  nationality: string;
  team?: string;
  points: number;
  wins: number;
  podiums: number;
  races: number;
}
