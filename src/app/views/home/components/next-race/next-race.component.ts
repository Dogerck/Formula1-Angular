import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { LoaderService } from 'src/app/services/loader-service.service';
import { NextRaceService } from 'src/app/services/next-race.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ConvertToLocalTimeDirective } from '../../../../directives/convert-to-local-time.directive';
import { FlagDirective } from '../../../../directives/flag.directive';

@Component({
    selector: 'app-next-race',
    templateUrl: './next-race.component.html',
    styleUrls: ['./next-race.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, ConvertToLocalTimeDirective, FlagDirective]
})
export class NextRaceComponent {
  private nextRaceService = inject(NextRaceService);
  loaderService = inject(LoaderService);

  private ergast = toSignal(
    this.nextRaceService.getAll<Ergast>('current/next.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  nextRaceData = computed(() => this.ergast()?.MRData.RaceTable.Races[0] ?? null);

  formattedDateRange = computed(() => {
    const race = this.nextRaceData();
    return race ? this.formatDateRange(race.FirstPractice.date, race.date) : '';
  });

  private formatDateRange(startDate: string, endDate: string): string {
    const end = new Date(endDate + 'T00:00:00Z');
    const start = new Date(startDate + 'T00:00:00Z');
    const localEnd = new Date(end.getTime() + end.getTimezoneOffset() * 60000);
    const localStart = new Date(start.getTime() + start.getTimezoneOffset() * 60000);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${localStart.toLocaleDateString('en-GB', options)} - ${localEnd.toLocaleDateString('en-GB', options)}`;
  }
}
