export interface CurrentDrivers {
    MRData: {
        stadingsTable: StandingsTable
    }
}
export interface StandingsTable {
    season: string,
    standingsList: StandingsList []
}

export interface StandingsList {
    season: string,
    round: string,
    driverStandings: DriverStandings []
}
export interface DriverStandings {
    pistion: string,
    positionText: string,
    points: string,
    wins: string
}