import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  date_start: string;
  circuit_short_name: string;
  country_name: string;
  year: number;
}

export interface OpenF1Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  is_pit_out_lap: boolean;
}

export interface OpenF1Driver {
  driver_number: number;
  full_name: string;
  team_name: string;
  team_colour: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpenF1Service {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.openf1.org/v1';

  getRaceSessions(year: number): Observable<OpenF1Session[]> {
    return this.http.get<OpenF1Session[]>(`${this.apiUrl}/sessions`, {
      params: { year, session_name: 'Race' },
    });
  }

  getLaps(sessionKey: number): Observable<OpenF1Lap[]> {
    return this.http.get<OpenF1Lap[]>(`${this.apiUrl}/laps`, {
      params: { session_key: sessionKey },
    });
  }

  getDrivers(sessionKey: number): Observable<OpenF1Driver[]> {
    return this.http.get<OpenF1Driver[]>(`${this.apiUrl}/drivers`, {
      params: { session_key: sessionKey },
    });
  }
}
