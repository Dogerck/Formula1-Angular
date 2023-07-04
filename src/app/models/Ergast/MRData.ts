import { DriverTable } from "../tables/drivers-table";
import { StandingsTable } from "../tables/standings-table";

export interface MRData {
    xmlns: string,
    series: string,
    url: string,
    limit: string,
    offset: string,
    total: string,
    DriverTable: DriverTable
    StandingsTable: StandingsTable;
  }