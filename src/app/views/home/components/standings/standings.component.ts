import { Component, OnInit } from '@angular/core';

import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriverStandings } from 'src/app/models/driver-standing';
import { StandingsService } from 'src/app/services/standings.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  standingsData: DriverStandings[] = [];
  currentYear = new Date().getFullYear()

  constructor(private standingsService: StandingsService) { }

  ngOnInit() {
    this.getStanding()
    
    
  }

  getStanding() {
    this.standingsService.getAll<Ergast>('current/driverStandings.json').subscribe({
      next: (data: Ergast) => {
        this.standingsData = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
        console.log(this.standingsData);
      }
    })
  }

  getTeamColor(teamName: string): string {
    return this.teamColors[teamName] || '#000000'; // Use uma cor padrão caso a equipe não esteja na lista
  }

  teamColors: { [key: string]: string } = {
    'Mercedes': '#6CD3BF',
    'Red Bull': '#3671C6',
    'Aston Martin': '#358C75',
    'Ferrari': '#F91536',
    'McLaren': '#F58020',
    'Alpine F1 Team': '#2293D1',
    'Williams': '#37BEDD',
    'Haas F1 Team': '#B6BABD',
    'Alfa Romeo': '#C92D4B',
    'AlphaTauri': '#5E8FAA'
  };
}