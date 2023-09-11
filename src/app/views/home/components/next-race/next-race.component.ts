import { Component, OnInit } from '@angular/core';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Races } from 'src/app/models/races';
import { NextRaceService } from 'src/app/services/next-race.service';

@Component({
  selector: 'app-next-race',
  templateUrl: './next-race.component.html',
  styleUrls: ['./next-race.component.scss']
})
export class NextRaceComponent implements OnInit {
  
  nextRaceData: Races | any

  constructor(private nextRaceService: NextRaceService) {}
  
  ngOnInit(): void {
    this.nextRace()
  }
  nextRace() {
    this.nextRaceService.getAll<Ergast>('current/next.json').subscribe({
      next: (data: Ergast) => {
        this.nextRaceData = data.MRData.RaceTable.Races[0]
        console.log(this.nextRaceData);
        
      }
    })
  }
}
