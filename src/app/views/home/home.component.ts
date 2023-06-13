import { Component, OnInit } from '@angular/core';
import { Standings } from 'src/app/models/standings';
import { StandingsService } from 'src/app/services/standings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit  {

  standings: Standings[] = []

  constructor(private standingsService: StandingsService) {}

  ngOnInit() {
    this.getStandings()
  }

  getStandings() {
    this.standingsService.getAll<Standings>('current/driverStandings.json').subscribe({
      next:(data:Standings) => {
        if(Array.isArray(data.MRData.stadingsTable.standingsLists[0].driverStandings[0])) {
          this.standings = data.MRData.stadingsTable.standingsLists[0].driverStandings[0];
          console.log(data.MRData.stadingsTable.standingsLists[0].driverStandings[0]);
        }
      }
    })
  }
}
