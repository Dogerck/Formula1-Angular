import { Races } from "../races";
import { BaseTable } from "./base-table";

export interface RaceTable extends BaseTable {
    Races: Races []
}