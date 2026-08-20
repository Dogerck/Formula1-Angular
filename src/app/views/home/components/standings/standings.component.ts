import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { Ergast } from 'src/app/models/Ergast/ergast';
import { LoaderService } from 'src/app/services/loader-service.service';
import { StandingsService } from 'src/app/services/standings.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-standings',
    templateUrl: './standings.component.html',
    styleUrls: ['./standings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner]
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

  topThree = computed(() => {
    const [first, second, third] = this.standingsData();
    return [second, first, third].filter(Boolean);
  });

  getTeamColor(teamName: string): string {
    return this.teamColors[teamName] || '#000000'; // Use uma cor padrão caso a equipe não esteja na lista
  }

  teamColors: { [key: string]: string } = {
    'Mercedes': '#27F4D2',
    'Red Bull': '#3671C6',
    'Aston Martin': '#229971',
    'Ferrari': '#E8002D',
    'McLaren': '#ff8000',
    'Alpine F1 Team': '#FF87BC',
    'Williams': '#64C4FF',
    'Haas F1 Team': '#B6BABD',
    'Sauber': '#52E252',
    'RB F1 Team': '#6692FF'
  };
}
