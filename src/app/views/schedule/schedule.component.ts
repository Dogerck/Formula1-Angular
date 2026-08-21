import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Races } from 'src/app/models/races';
import { ScheduleService } from 'src/app/services/schedule.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FlagDirective } from 'src/app/directives/flag.directive';
import { ConvertToLocalDateDirective } from 'src/app/directives/convert-to-local-date.directive';

type RaceStatus = 'done' | 'next' | 'upcoming';

export interface ScheduleRace extends Races {
  status: RaceStatus;
}

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, FlagDirective, ConvertToLocalDateDirective, RouterLink]
})
export class ScheduleComponent {
  private scheduleService = inject(ScheduleService);
  loaderService = inject(LoaderService);

  currentYear = new Date().getFullYear();

  private ergast = toSignal(
    this.scheduleService.getAll<Ergast>(`${this.currentYear}.json`).pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  scheduleData = computed<ScheduleRace[]>(() => {
    const races = this.ergast()?.MRData.RaceTable.Races ?? [];
    const today = new Date().toISOString().slice(0, 10);
    const nextIndex = races.findIndex(race => race.date >= today);

    return races.map((race, index) => {
      const status: RaceStatus =
        nextIndex === -1 ? 'done' :
        index === nextIndex ? 'next' :
        index < nextIndex ? 'done' : 'upcoming';
      return { ...race, status };
    });
  });
}
