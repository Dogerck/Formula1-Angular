import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { LoaderService } from 'src/app/services/loader-service.service';
import { NextRaceService } from 'src/app/services/next-race.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FlagDirective } from '../../../../directives/flag.directive';
import { SessionTimeDirective } from '../../../../directives/session-time.directive';
import { getCircuitTimezone } from 'src/app/constants/circuit-timezones';
import { CircuitTrackComponent } from 'src/app/shared/circuit-track/circuit-track.component';

type TimeMode = 'local' | 'track';

@Component({
    selector: 'app-next-race',
    templateUrl: './next-race.component.html',
    styleUrls: ['./next-race.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, FlagDirective, SessionTimeDirective, CircuitTrackComponent]
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

  timeMode = signal<TimeMode>('local');

  trackTimezone = computed(() => {
    const race = this.nextRaceData();
    return race ? getCircuitTimezone(race.Circuit.circuitId) : undefined;
  });

  activeTimezone = computed(() => this.timeMode() === 'track' ? this.trackTimezone() : undefined);

  toggleTimeMode(): void {
    this.timeMode.set(this.timeMode() === 'local' ? 'track' : 'local');
  }

  sessionIso(date: string, time: string): string {
    return `${date}T${time}`;
  }

  private formatDateRange(startDate: string, endDate: string): string {
    const end = new Date(endDate + 'T00:00:00Z');
    const start = new Date(startDate + 'T00:00:00Z');
    const localEnd = new Date(end.getTime() + end.getTimezoneOffset() * 60000);
    const localStart = new Date(start.getTime() + start.getTimezoneOffset() * 60000);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${localStart.toLocaleDateString('en-GB', options)} - ${localEnd.toLocaleDateString('en-GB', options)}`;
  }
}
