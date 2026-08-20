import { Constructor } from './constructor';
import { Drivers } from './driver';

export interface Result {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Drivers;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: { time: string };
  };
}
