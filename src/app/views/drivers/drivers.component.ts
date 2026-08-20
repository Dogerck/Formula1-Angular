import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Drivers } from 'src/app/models/driver';
import { DriversService } from 'src/app/services/drivers.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrls: ['./drivers.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatProgressSpinner, AsyncPipe]
})
export class DriversComponent implements OnInit {
  private driversService = inject(DriversService);
  loaderService = inject(LoaderService);

  
  driversData: Drivers[] = []
  currentYear = new Date().getFullYear()
  private subscription: Subscription | undefined

  
  getDrivers() {
    this.loaderService.show();
    this.subscription = this.driversService.getAll<Ergast>(this.currentYear + '/drivers.json').subscribe({
      next: (data: Ergast) => {
        this.driversData = data.MRData.DriverTable.Drivers.map(driver => {
          return {
            ...driver,
            driverId: driver.driverId.trim()
          }
        })
        this.loaderService.hide();
      },
      error: (error) => {
        console.log("Erro:", error);
        this.loaderService.hide();
      }
    })
    
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe() 
    } 
  }


  ngOnInit(): void {
    this.getDrivers()
  }
}
