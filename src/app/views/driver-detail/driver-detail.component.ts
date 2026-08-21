import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriversService } from 'src/app/services/drivers.service';
import { ResultsService } from 'src/app/services/results.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { FavoriteDriverService } from 'src/app/services/favorite-driver.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WikipediaPhotoDirective } from 'src/app/directives/wikipedia-photo.directive';
import { FlagDirective } from 'src/app/directives/flag.directive';
import { getTeamColor } from 'src/app/constants/team-colors';

@Component({
    selector: 'app-driver-detail',
    templateUrl: './driver-detail.component.html',
    styleUrls: ['./driver-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, WikipediaPhotoDirective, FlagDirective, RouterLink]
})
export class DriverDetailComponent {
  private driversService = inject(DriversService);
  private resultsService = inject(ResultsService);
  loaderService = inject(LoaderService);
  favoriteService = inject(FavoriteDriverService);

  currentYear = new Date().getFullYear();

  readonly driverId = input.required<string>();

  private driverErgast = toSignal(
    toObservable(this.driverId).pipe(
      switchMap(driverId => this.driversService.getAll<Ergast>(`${this.currentYear}/drivers/${driverId}.json`)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  driver = computed(() => this.driverErgast()?.MRData.DriverTable.Drivers[0] ?? null);

  private seasonErgast = toSignal(
    toObservable(this.driverId).pipe(
      switchMap(driverId => this.resultsService.getAll<Ergast>(`${this.currentYear}/drivers/${driverId}/results.json`)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  seasonRaces = computed(() => this.seasonErgast()?.MRData.RaceTable.Races ?? []);

  totalPoints = computed(() =>
    this.seasonRaces().reduce((sum, race) => sum + Number(race.Results?.[0]?.points ?? 0), 0)
  );

  currentTeam = computed(() => {
    const races = this.seasonRaces();
    return races.length ? races[races.length - 1].Results?.[0]?.Constructor.name : undefined;
  });

  getTeamColor(teamName: string): string {
    return getTeamColor(teamName);
  }
}
