import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { ConstructorsService } from 'src/app/services/constructors.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { getTeamColor } from 'src/app/constants/team-colors';

@Component({
    selector: 'app-teams',
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner]
})
export class TeamsComponent {
  private constructorService = inject(ConstructorsService);
  loaderService = inject(LoaderService);

  private ergast = toSignal(
    this.constructorService.getAll<Ergast>('current/constructorStandings.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  standingsData = computed(() => this.ergast()?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings ?? []);

  leaderPoints = computed(() => Number(this.standingsData()[0]?.points ?? 0));

  pointsShare(points: string): number {
    const leader = this.leaderPoints();
    return leader ? (Number(points) / leader) * 100 : 0;
  }

  getTeamColor(teamName: string): string {
    return getTeamColor(teamName);
  }
}
