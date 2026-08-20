import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { Ergast } from 'src/app/models/Ergast/ergast';
import { LoaderService } from 'src/app/services/loader-service.service';
import { StandingsService } from 'src/app/services/standings.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WikipediaPhotoDirective } from 'src/app/directives/wikipedia-photo.directive';
import { getTeamColor } from 'src/app/constants/team-colors';

@Component({
    selector: 'app-standings',
    templateUrl: './standings.component.html',
    styleUrls: ['./standings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, WikipediaPhotoDirective]
})
export class StandingsComponent {
  private standingsService = inject(StandingsService);
  loaderService = inject(LoaderService);

  currentYear = new Date().getFullYear();

  private ergast = toSignal(
    this.standingsService.getAll<Ergast>('current/driverStandings.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  standingsData = computed(() => this.ergast()?.MRData.StandingsTable.StandingsLists[0].DriverStandings ?? []);

  topThree = computed(() => this.standingsData().slice(0, 3));

  restOfStandings = computed(() => this.standingsData().slice(3));

  getTeamColor(teamName: string): string {
    return getTeamColor(teamName);
  }
}
