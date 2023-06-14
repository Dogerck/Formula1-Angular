export interface Standings {
    MRData: {
    stadingsTable: StandingsTable
    }
}

export interface StandingsTable {
    season: string,
    standingsLists: StandingsLists []
}

export interface StandingsLists {
    season: string,
    round: string,
    driverStandings: DriverStandings []
}
export interface DriverStandings {
    position: string,
    positionText: string,
    points: string,
    wins: string,
    driver: Driver,
    constructors: Constructors []
}

export interface Driver {
    driverId: string,
    permanentNumber: string,
    code: string,
    url: string,
    givenName: string,
    familyName: string,
    dateOfBirth: string,
    nationality: string
}

export interface Constructors {
    constructorId: string,
    url: string,
    name: string,
    nationality: string,
}