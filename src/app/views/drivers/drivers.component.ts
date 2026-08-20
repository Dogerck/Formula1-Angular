import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriversService } from 'src/app/services/drivers.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrls: ['./drivers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner]
})
export class DriversComponent {
  private driversService = inject(DriversService);
  loaderService = inject(LoaderService);

  currentYear = new Date().getFullYear();

  private ergast = toSignal(
    this.driversService.getAll<Ergast>(`${this.currentYear}/drivers.json`).pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  driversData = computed(() => {
    const drivers = this.ergast()?.MRData.DriverTable.Drivers ?? [];
    return drivers.map(driver => ({ ...driver, driverId: driver.driverId.trim() }));
  });
}
