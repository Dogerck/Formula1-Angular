import { Component, OnInit } from '@angular/core';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Drivers } from 'src/app/models/driver';
import { DriversService } from 'src/app/services/drivers.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  
  driversData: Drivers[] = []

  constructor(private driversService: DriversService) {}

  
  getDrivers() {
    this.driversService.getAll<Ergast>('2023/drivers.json').subscribe({
      next: (data: Ergast) => {
        this.driversData = data.MRData.DriverTable.Drivers
        console.log(this.driversData);
        
      }
    })
  }

  ngOnInit(): void {
    this.getDrivers()  
  }
}
