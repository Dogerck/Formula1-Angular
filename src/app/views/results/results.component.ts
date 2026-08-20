import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { ResultsService } from 'src/app/services/results.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { getTeamColor } from 'src/app/constants/team-colors';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner]
})
export class ResultsComponent {
  private resultsService = inject(ResultsService);
  loaderService = inject(LoaderService);

  private ergast = toSignal(
    this.resultsService.getAll<Ergast>('current/last/results.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  race = computed(() => this.ergast()?.MRData.RaceTable.Races[0] ?? null);

  results = computed(() => this.race()?.Results ?? []);

  getTeamColor(teamName: string): string {
    return getTeamColor(teamName);
  }
}
