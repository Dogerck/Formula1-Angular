import { Constructor } from "./constructor";
import { Driver } from "./driver";

export interface DriverStanding {
    position: string;
    positionText: string;
    points: string;
    wins: string;
  
    Driver: Driver;
  
    Constructors: Constructor[];
  }