import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { LoaderService } from 'src/app/services/loader-service.service';
import { NextRaceService } from 'src/app/services/next-race.service';
import { WeatherService } from 'src/app/services/weather.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FlagDirective } from '../../../../directives/flag.directive';
import { SessionTimeDirective } from '../../../../directives/session-time.directive';
import { getCircuitTimezone } from 'src/app/constants/circuit-timezones';
import { getWeatherInfo } from 'src/app/constants/weather-codes';
import { CircuitTrackComponent } from 'src/app/shared/circuit-track/circuit-track.component';
import { CircuitMapComponent } from 'src/app/shared/circuit-map/circuit-map.component';
import { CountdownComponent } from 'src/app/shared/countdown/countdown.component';

type TimeMode = 'local' | 'track';

@Component({
    selector: 'app-next-race',
    templateUrl: './next-race.component.html',
    styleUrls: ['./next-race.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, FlagDirective, SessionTimeDirective, CircuitTrackComponent, CircuitMapComponent, CountdownComponent]
})
export class NextRaceComponent {
  private nextRaceService = inject(NextRaceService);
  private weatherService = inject(WeatherService);
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

  private forecast = toSignal(
    toObservable(this.nextRaceData).pipe(
      switchMap(race => race
        ? this.weatherService.getForecast(race.Circuit.Location.lat, race.Circuit.Location.long, race.FirstPractice.date, race.date)
        : of(null)
      ),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  weekendForecast = computed(() => {
    const days = this.forecast() ?? [];
    return days.map(day => ({
      ...day,
      ...getWeatherInfo(day.weatherCode),
      weekday: this.weekdayLabel(day.date),
      tempMax: Math.round(day.tempMax),
      tempMin: Math.round(day.tempMin),
    }));
  });

  nextSessionIso = computed(() => {
    const race = this.nextRaceData();
    if (!race) {
      return null;
    }
    const sessions = [
      { date: race.FirstPractice.date, time: race.FirstPractice.time },
      race.SprintQualifying?.time ? { date: race.SprintQualifying.date, time: race.SprintQualifying.time } : { date: race.SecondPractice.date, time: race.SecondPractice.time },
      race.ThirdPractice?.time ? { date: race.ThirdPractice.date, time: race.ThirdPractice.time } : null,
      race.Sprint?.time ? { date: race.Sprint.date, time: race.Sprint.time } : null,
      { date: race.Qualifying.date, time: race.Qualifying.time },
      { date: race.date, time: race.time },
    ];

    const now = Date.now();
    const upcoming = sessions
      .filter((session): session is { date: string; time: string } => !!session)
      .map(session => this.sessionIso(session.date, session.time))
      .filter(iso => new Date(iso).getTime() > now)
      .sort();

    return upcoming[0] ?? null;
  });

  toggleTimeMode(): void {
    this.timeMode.set(this.timeMode() === 'local' ? 'track' : 'local');
  }

  sessionIso(date: string, time: string): string {
    return `${date}T${time}`;
  }

  private weekdayLabel(date: string): string {
    return new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
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
