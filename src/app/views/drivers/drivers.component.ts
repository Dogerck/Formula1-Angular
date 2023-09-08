import { Component, OnInit } from '@angular/core';
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

  constructor(private driversService: DriversService, public loaderService: LoaderService) {}

  
  getDrivers() {
    this.loaderService.show();
    this.driversService.getAll<Ergast>(this.currentYear + '/drivers.json').subscribe(
       (data: Ergast) => {
        this.driversData = data.MRData.DriverTable.Drivers
        console.log(this.driversData);
      },(error) => {
        console.log("Erro:", error);
        this.loaderService.hide();
      },
      () => {
      this.loaderService.hide();
     })
    
  }

  ngOnInit(): void {
    this.getDrivers()
  }
}
