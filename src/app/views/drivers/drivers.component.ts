import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Drivers } from 'src/app/models/driver';
import { DriversService } from 'src/app/services/drivers.service';
import { LoaderService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  
  driversData: Drivers[] = []
  currentYear = new Date().getFullYear()
  private subscription: Subscription | undefined

  constructor(private driversService: DriversService, public loaderService: LoaderService) {}

  
  getDrivers() {
    this.loaderService.show();
    this.subscription = this.driversService.getAll<Ergast>(this.currentYear + '/drvers.json').subscribe({
      next: (data: Ergast) => {
        this.driversData = data.MRData.DriverTable.Drivers
        console.log(this.driversData.map(driver => driver.givenName));
        
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
