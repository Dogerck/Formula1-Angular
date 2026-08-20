import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { ConstructorsService } from 'src/app/services/constructors.service';
import { LoaderService } from 'src/app/services/loader-service.service';

@Component({
    selector: 'app-teams',
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsComponent {
  private constructorService = inject(ConstructorsService);
  loaderService = inject(LoaderService);

  private ergast = toSignal(
    this.constructorService.getAll<Ergast>('current/constructors.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  constructorsData = computed(() => this.ergast()?.MRData.ConstructorTable.Constructors ?? []);
}
