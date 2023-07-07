import { Component, OnInit } from '@angular/core';
import { MRData } from 'src/app/models/Ergast/MRData';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriverStandings } from 'src/app/models/driver-standing';
import { StandingsService } from 'src/app/services/standings.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  standingsData: DriverStandings[] | undefined;

  constructor(private standingsService: StandingsService) { }

  ngOnInit() {
    this.getStanding()
  }

  getStanding() {
    this.standingsService.getAll<Ergast>('current/driverStandings.json').subscribe({
      next: (data: Ergast) => {
        this.standingsData = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
      }
    })
  }
}