import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';

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
  st_speed: number | null;
}

export interface OpenF1Driver {
  driver_number: number;
  full_name: string;
  team_name: string;
  team_colour: string;
}

export interface OpenF1Stint {
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
  tyre_age_at_start: number;
}

export interface OpenF1Pit {
  driver_number: number;
  lap_number: number;
  pit_duration: number | null;
}

export interface OpenF1Interval {
  driver_number: number;
  date: string;
  gap_to_leader: number | string | null;
  interval: number | string | null;
}

export interface OpenF1Position {
  driver_number: number;
  date: string;
  position: number;
}

@Injectable({
  providedIn: 'root'
})
export class OpenF1Service {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.openf1.org/v1';

  // Several charts on the same page need the same session's sessions/
  // drivers/laps/stints lookups; OpenF1's free tier rate-limits (429)
  // fairly aggressively, so every GET here is cached and shared rather
  // than re-fetched per chart.
  private sessionsCache = new Map<number, Observable<OpenF1Session[]>>();
  private driversCache = new Map<number, Observable<OpenF1Driver[]>>();
  private lapsCache = new Map<number, Observable<OpenF1Lap[]>>();
  private stintsCache = new Map<number, Observable<OpenF1Stint[]>>();
  private pitsCache = new Map<number, Observable<OpenF1Pit[]>>();
  private intervalsCache = new Map<number, Observable<OpenF1Interval[]>>();
  private positionsCache = new Map<number, Observable<OpenF1Position[]>>();

  getRaceSessions(year: number): Observable<OpenF1Session[]> {
    return this.cached(this.sessionsCache, year, () =>
      this.http.get<OpenF1Session[]>(`${this.apiUrl}/sessions`, { params: { year, session_name: 'Race' } })
    );
  }

  // Ergast identifies a race by season + round; OpenF1 identifies it by its
  // own session_key. They're matched here by year + exact race date, since
  // OpenF1's date_start always falls on the same calendar day as Ergast's
  // race date.
  getSessionKeyForRace(season: string, raceDate: string): Observable<number | null> {
    const year = Number(season);
    if (!year || !raceDate) {
      return of(null);
    }
    return this.getRaceSessions(year).pipe(
      map(sessions => sessions.find(session => session.date_start.startsWith(raceDate))?.session_key ?? null)
    );
  }

  getLaps(sessionKey: number): Observable<OpenF1Lap[]> {
    return this.cached(this.lapsCache, sessionKey, () =>
      this.http.get<OpenF1Lap[]>(`${this.apiUrl}/laps`, { params: { session_key: sessionKey } })
    );
  }

  getDrivers(sessionKey: number): Observable<OpenF1Driver[]> {
    return this.cached(this.driversCache, sessionKey, () =>
      this.http.get<OpenF1Driver[]>(`${this.apiUrl}/drivers`, { params: { session_key: sessionKey } })
    );
  }

  getStints(sessionKey: number): Observable<OpenF1Stint[]> {
    return this.cached(this.stintsCache, sessionKey, () =>
      this.http.get<OpenF1Stint[]>(`${this.apiUrl}/stints`, { params: { session_key: sessionKey } })
    );
  }

  getPits(sessionKey: number): Observable<OpenF1Pit[]> {
    return this.cached(this.pitsCache, sessionKey, () =>
      this.http.get<OpenF1Pit[]>(`${this.apiUrl}/pit`, { params: { session_key: sessionKey } })
    );
  }

  getIntervals(sessionKey: number): Observable<OpenF1Interval[]> {
    return this.cached(this.intervalsCache, sessionKey, () =>
      this.http.get<OpenF1Interval[]>(`${this.apiUrl}/intervals`, { params: { session_key: sessionKey } })
    );
  }

  getPositions(sessionKey: number): Observable<OpenF1Position[]> {
    return this.cached(this.positionsCache, sessionKey, () =>
      this.http.get<OpenF1Position[]>(`${this.apiUrl}/position`, { params: { session_key: sessionKey } })
    );
  }

  private cached<K, T>(cache: Map<K, Observable<T>>, key: K, request: () => Observable<T>): Observable<T> {
    if (!cache.has(key)) {
      cache.set(key, request().pipe(shareReplay(1)));
    }
    return cache.get(key)!;
  }
}
