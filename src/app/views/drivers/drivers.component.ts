import { Component, OnInit } from '@angular/core';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriversService } from 'src/app/services/drivers.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  
  driversData: Ergast | undefined

  constructor(private driversService: DriversService) {}

  ngOnInit(): void {
    this.getDrivers()  
  }

  getDrivers() {
    this.driversService.getAll<Ergast>('2023/drivers.json').subscribe({
      next: (data: Ergast) => {
        this.driversData = data 
      }
    })
  }
}
