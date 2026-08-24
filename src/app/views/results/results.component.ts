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
import { RacePaceChartComponent } from './components/race-pace-chart/race-pace-chart.component';
import { TireStrategyChartComponent } from './components/tire-strategy-chart/tire-strategy-chart.component';
import { SpeedComparisonChartComponent } from './components/speed-comparison-chart/speed-comparison-chart.component';
import { SectorComparisonChartComponent } from './components/sector-comparison-chart/sector-comparison-chart.component';

type ResultsTab = 'race' | 'qualifying';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, RouterLink, RacePaceChartComponent, TireStrategyChartComponent, SpeedComparisonChartComponent, SectorComparisonChartComponent]
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

  topFinisherNumbers = computed(() => new Set(this.results().slice(0, 10).map(result => Number(result.number))));

  finishingOrderNumbers = computed(() => this.results().map(result => Number(result.number)));

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
