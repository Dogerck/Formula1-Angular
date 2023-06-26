import { Component, OnInit } from '@angular/core';
import { DriverStanding } from 'src/app/models/driver-standing';
import { StandingsService } from 'src/app/services/standings.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  standingsData: DriverStanding[] | undefined
  test: any
  constructor(private standingsService: StandingsService){}

  ngOnInit() {
    this.getStanding()
  }

  getStanding() {
    this.standingsService.getAll<DriverStanding>('current/driverStandings.json').subscribe({
      next: (data: DriverStanding) => {
        this.standingsData
        console.log(this.standingsData);
        
      }
    })
  }
}