import { StandingsLists } from "../driver-standing";
import { BaseTable } from "./base-table";

export interface StandingsTable extends BaseTable {
    StandingsLists: StandingsLists []
  }