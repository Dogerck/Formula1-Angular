import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriversService } from 'src/app/services/drivers.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { FavoriteDriverService } from 'src/app/services/favorite-driver.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WikipediaPhotoDirective } from 'src/app/directives/wikipedia-photo.directive';
import { FlagDirective } from 'src/app/directives/flag.directive';

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrls: ['./drivers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, WikipediaPhotoDirective, FlagDirective, RouterLink]
})
export class DriversComponent {
  private driversService = inject(DriversService);
  loaderService = inject(LoaderService);
  favoriteService = inject(FavoriteDriverService);

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
    return drivers
      // current/drivers.json also includes reserve drivers who only did a practice
      // session, with no url/nationality/number/dateOfBirth - keep only full profiles
      .filter(driver => driver.url)
      .map(driver => ({ ...driver, driverId: driver.driverId.trim() }));
  });

  toggleFavorite(event: Event, driverId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteService.toggle(driverId);
  }
}
