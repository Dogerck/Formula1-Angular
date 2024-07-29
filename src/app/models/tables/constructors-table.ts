import { Constructor } from "../constructor";
import { BaseTable } from "./base-table";



export interface ConstructorsTable extends BaseTable { 
    season: string;
    Constructors: Constructor []
}