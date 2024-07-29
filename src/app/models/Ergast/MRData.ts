
import { ConstructorsTable } from "../tables/constructors-table";
import { DriverTable } from "../tables/drivers-table";
import { RaceTable } from "../tables/race-table";
import { StandingsTable } from "../tables/standings-table";

export interface MRData {
    xmlns: string,
    series: string,
    url: string,
    limit: string,
    offset: string,
    total: string,
    DriverTable: DriverTable,
    StandingsTable: StandingsTable,
    RaceTable: RaceTable,
    ConstructorTable: ConstructorsTable
  }