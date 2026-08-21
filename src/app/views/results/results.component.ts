import { Component, ChangeDetectionStrategy, computed, inject, input, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { ResultsService } from 'src/app/services/results.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { FavoriteDriverService } from 'src/app/services/favorite-driver.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { getTeamColor } from 'src/app/constants/team-colors';

type ResultsTab = 'race' | 'qualifying';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, RouterLink]
})
export class ResultsComponent {
  private resultsService = inject(ResultsService);
  private scheduleService = inject(ScheduleService);
  loaderService = inject(LoaderService);
  favoriteService = inject(FavoriteDriverService);

  currentYear = new Date().getFullYear();

  readonly round = input<string>();

  activeTab = signal<ResultsTab>('race');

  private endpoint = computed(() => {
    const base = this.round() ? `${this.currentYear}/${this.round()}` : 'current/last';
    return this.activeTab() === 'qualifying' ? `${base}/qualifying.json` : `${base}/results.json`;
  });

  private ergast = toSignal(
    toObservable(this.endpoint).pipe(
      switchMap(url => this.resultsService.getAll<Ergast>(url)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  race = computed(() => this.ergast()?.MRData.RaceTable.Races[0] ?? null);

  results = computed(() => this.race()?.Results ?? []);

  qualifyingResults = computed(() => this.race()?.QualifyingResults ?? []);

  setTab(tab: ResultsTab): void {
    this.activeTab.set(tab);
  }

  private scheduleErgast = toSignal(
    this.scheduleService.getAll<Ergast>(`${this.currentYear}.json`).pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  completedRounds = computed(() => {
    const races = this.scheduleErgast()?.MRData.RaceTable.Races ?? [];
    const today = new Date().toISOString().slice(0, 10);
    return races.filter(race => race.date < today);
  });

  getTeamColor(teamName: string): string {
    return getTeamColor(teamName);
  }
}
