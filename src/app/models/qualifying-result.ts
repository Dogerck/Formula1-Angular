import { Constructor } from './constructor';
import { Drivers } from './driver';

export interface QualifyingResult {
  number: string;
  position: string;
  Driver: Drivers;
  Constructor: Constructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}
