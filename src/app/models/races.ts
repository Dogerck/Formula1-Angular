import { circuits } from "./circuits";

export interface Races {
    season: string,
    round: string,
    url: string,
    raceName: string,
    Circuit: Circuit,
    date: string,
    time: string,
    FirstPractice: FirstPractice,
    ThirdPractice: ThirdPractice,
    Qualifying: Qualifying,
    Sprint: Sprint,
}

export interface Circuit extends circuits {}

export interface dateTimeGenric {
    date: string,
    time: string
}

export interface FirstPractice extends dateTimeGenric {}
export interface SecondPractice extends dateTimeGenric {}
export interface ThirdPractice extends dateTimeGenric {}
export interface Qualifying extends dateTimeGenric {}
export interface Sprint extends dateTimeGenric {}