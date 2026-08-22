import { Component, ChangeDetectionStrategy, computed, effect, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Result } from 'src/app/models/result';
import { DriverStats } from 'src/app/models/driver-stats';
import { DriversService } from 'src/app/services/drivers.service';
import { ResultsService } from 'src/app/services/results.service';
import { StandingsService } from 'src/app/services/standings.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WikipediaPhotoDirective } from 'src/app/directives/wikipedia-photo.directive';
import { FlagDirective } from 'src/app/directives/flag.directive';

@Component({
    selector: 'app-compare',
    templateUrl: './compare.component.html',
    styleUrls: ['./compare.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, WikipediaPhotoDirective, FlagDirective]
})
export class CompareComponent {
  private driversService = inject(DriversService);
  private resultsService = inject(ResultsService);
  private standingsService = inject(StandingsService);
  loaderService = inject(LoaderService);

  currentYear = new Date().getFullYear();

  private driversErgast = toSignal(
    this.driversService.getAll<Ergast>(`${this.currentYear}/drivers.json`).pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  driversList = computed(() => (this.driversErgast()?.MRData.DriverTable.Drivers ?? []).filter(driver => driver.url));

  driverAId = signal('');
  driverBId = signal('');

  private standingsErgast = toSignal(
    this.standingsService.getAll<Ergast>('current/driverStandings.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  constructor() {
    effect(() => {
      const standings = this.standingsErgast()?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
      if (standings.length >= 2 && !this.driverAId() && !this.driverBId()) {
        this.driverAId.set(standings[0].Driver.driverId);
        this.driverBId.set(standings[1].Driver.driverId);
      }
    });
  }

  private ergastA = toSignal(
    toObservable(this.driverAId).pipe(
      switchMap(id => id ? this.resultsService.getAll<Ergast>(`${this.currentYear}/drivers/${id}/results.json`) : of(null)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  private ergastB = toSignal(
    toObservable(this.driverBId).pipe(
      switchMap(id => id ? this.resultsService.getAll<Ergast>(`${this.currentYear}/drivers/${id}/results.json`) : of(null)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  statA = computed(() => this.buildStats(this.ergastA()));
  statB = computed(() => this.buildStats(this.ergastB()));

  onSelectA(driverId: string): void {
    this.driverAId.set(driverId);
  }

  onSelectB(driverId: string): void {
    this.driverBId.set(driverId);
  }

  private buildStats(ergast: Ergast | null): DriverStats | null {
    const races = ergast?.MRData.RaceTable.Races ?? [];
    const results = races.map(race => race.Results?.[0]).filter((result): result is Result => !!result);
    if (!results.length) {
      return null;
    }
    const driver = results[0].Driver;
    return {
      driverId: driver.driverId,
      givenName: driver.givenName,
      familyName: driver.familyName,
      url: driver.url,
      nationality: driver.nationality,
      team: results[results.length - 1].Constructor.name,
      points: results.reduce((sum, result) => sum + Number(result.points), 0),
      wins: results.filter(result => result.position === '1').length,
      podiums: results.filter(result => +result.position <= 3).length,
      races: results.length,
    };
  }
}
