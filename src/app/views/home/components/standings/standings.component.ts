import { Component, OnInit } from '@angular/core';
import { MRData } from 'src/app/models/Ergast/MRData';
import { Standings } from 'src/app/models/driver-standing';
import { StandingsService } from 'src/app/services/standings.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  standingsData: Standings | undefined;
  
  constructor(private standingsService: StandingsService){}

  ngOnInit() {
    this.getStanding()
  }

  getStanding() {
    this.standingsService.getAll<Standings>('current/driverStandings.json').subscribe({
      next: (data: Standings) => {
        this.standingsData = data
        console.log(data)
        console.log(this.standingsData);
      }
    })
  
}
}