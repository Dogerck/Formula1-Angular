import { Component, OnInit } from '@angular/core';

import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriverStandings } from 'src/app/models/driver-standing';
import { LoaderService } from 'src/app/services/loader-service.service';
import { StandingsService } from 'src/app/services/standings.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  standingsData: DriverStandings[] = [];
  currentYear = new Date().getFullYear()

  constructor(private standingsService: StandingsService, public loaderService: LoaderService) { }

  ngOnInit() {
    this.getStanding()
    
    
  }

  getStanding() {
    this.loaderService.show()
    this.standingsService.getAll<Ergast>('current/driverStandings.json').subscribe({
      next: (data: Ergast) => {
        this.standingsData = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        this.loaderService.hide()
      },
      error: (error) => {
        console.log('Erro:', error);
        this.loaderService.hide()
      }
    })
  }

  getTeamColor(teamName: string): string {
    return this.teamColors[teamName] || '#000000'; // Use uma cor padrão caso a equipe não esteja na lista
  }

  teamColors: { [key: string]: string } = {
    'Mercedes': '#27F4D2',
    'Red Bull': '#3671C6',
    'Aston Martin': '#229971',
    'Ferrari': '#E8002D',
    'McLaren': '#ff8000',
    'Alpine F1 Team': '#FF87BC',
    'Williams': '#64C4FF',
    'Haas F1 Team': '#B6BABD',
    'Sauber': '#52E252',
    'RB F1 Team': '#6692FF'
  };
}