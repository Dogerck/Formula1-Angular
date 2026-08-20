import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { ResultsService } from 'src/app/services/results.service';
import { NextRaceService } from 'src/app/services/next-race.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WikipediaPhotoDirective } from 'src/app/directives/wikipedia-photo.directive';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-latest',
    templateUrl: './latest.component.html',
    styleUrls: ['./latest.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, WikipediaPhotoDirective, RouterLink]
})
export class LatestComponent {
  private resultsService = inject(ResultsService);
  private nextRaceService = inject(NextRaceService);
  loaderService = inject(LoaderService);

  private lastRaceErgast = toSignal(
    this.resultsService.getAll<Ergast>('current/last/results.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  private nextRaceErgast = toSignal(
    this.nextRaceService.getAll<Ergast>('current/next.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  lastRace = computed(() => this.lastRaceErgast()?.MRData.RaceTable.Races[0] ?? null);

  podium = computed(() => this.lastRace()?.Results?.slice(0, 3) ?? []);

  winner = computed(() => this.podium()[0] ?? null);

  margin = computed(() => this.podium()[1]?.Time?.time ?? '');

  nextRace = computed(() => this.nextRaceErgast()?.MRData.RaceTable.Races[0] ?? null);
}
