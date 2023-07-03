import { Component, OnInit } from '@angular/core';
import { Driver } from 'src/app/models/driver';
import { DriversService } from 'src/app/services/drivers.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  
  driversData: Driver | undefined

  constructor(private driversService: DriversService) {}

  ngOnInit(): void {
    this.getDrivers()  
  }

  getDrivers() {
    this.driversService.getAll<Driver>('2023/drivers.json').subscribe({
      next: (data: Driver) => {
        this.driversData = data 
      }
    })
  }
}
