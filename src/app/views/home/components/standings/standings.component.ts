import { Component, OnInit } from '@angular/core';
import { MRData } from 'src/app/models/Ergast/MRData';
import { DriverStanding } from 'src/app/models/driver-standing';
import { StandingsService } from 'src/app/services/standings.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  standingsData: MRData[] = []
  
  constructor(private standingsService: StandingsService){}

  ngOnInit() {
    this.getStanding()
  }

  getStanding() {
    this.standingsService.getAll<MRData>('current/driverStandings.json').subscribe({
      next: (data: MRData) => {
        this.standingsData
        console.log(this.standingsData);
        
      }
    })
  }
}