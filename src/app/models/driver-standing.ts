import { Constructor } from "./constructor"
import { Drivers } from "./driver"
import { ConstructorStanding } from "./constructor-standing"

export interface StandingsLists {
  season: string,
  round: string,
  DriverStandings?: DriverStandings [],
  ConstructorStandings?: ConstructorStanding []
}

export interface DriverStandings {
  position: string,
  positionText: string,
  points: string,
  wins: string,
  Driver: Driver,
  Constructors: Constructors []
}

export interface Driver extends Drivers {
  
}

export interface Constructors extends Constructor {

}