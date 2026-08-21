import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { ConstructorsService } from 'src/app/services/constructors.service';
import { ResultsService } from 'src/app/services/results.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FlagDirective } from 'src/app/directives/flag.directive';
import { getTeamColor } from 'src/app/constants/team-colors';

@Component({
    selector: 'app-team-detail',
    templateUrl: './team-detail.component.html',
    styleUrls: ['./team-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, FlagDirective, RouterLink]
})
export class TeamDetailComponent {
  private constructorsService = inject(ConstructorsService);
  private resultsService = inject(ResultsService);
  loaderService = inject(LoaderService);

  currentYear = new Date().getFullYear();

  readonly constructorId = input.required<string>();

  private constructorErgast = toSignal(
    toObservable(this.constructorId).pipe(
      switchMap(id => this.constructorsService.getAll<Ergast>(`${this.currentYear}/constructors/${id}.json`)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  team = computed(() => this.constructorErgast()?.MRData.ConstructorTable.Constructors[0] ?? null);

  private seasonErgast = toSignal(
    toObservable(this.constructorId).pipe(
      switchMap(id => this.resultsService.getAll<Ergast>(`${this.currentYear}/constructors/${id}/results.json`)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  seasonRaces = computed(() => this.seasonErgast()?.MRData.RaceTable.Races ?? []);

  totalPoints = computed(() =>
    this.seasonRaces().reduce((sum, race) => sum + (race.Results ?? []).reduce((raceSum, r) => raceSum + Number(r.points), 0), 0)
  );

  wins = computed(() =>
    this.seasonRaces().reduce((sum, race) => sum + (race.Results ?? []).filter(r => r.position === '1').length, 0)
  );

  currentDrivers = computed(() => {
    const races = this.seasonRaces();
    if (!races.length) {
      return [];
    }
    const lastRaceResults = races[races.length - 1].Results ?? [];
    return lastRaceResults.map(r => `${r.Driver.givenName} ${r.Driver.familyName}`);
  });

  getTeamColor(teamName: string): string {
    return getTeamColor(teamName);
  }
}
