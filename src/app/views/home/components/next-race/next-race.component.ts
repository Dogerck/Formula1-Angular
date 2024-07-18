import { Component, OnInit } from '@angular/core';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Races } from 'src/app/models/races';
import { LoaderService } from 'src/app/services/loader-service.service';
import { NextRaceService } from 'src/app/services/next-race.service';

@Component({
  selector: 'app-next-race',
  templateUrl: './next-race.component.html',
  styleUrls: ['./next-race.component.scss']
})
export class NextRaceComponent implements OnInit {
  
  nextRaceData: Races | any;
  formattedDateRange!: string;

  constructor(private nextRaceService: NextRaceService, public loaderService: LoaderService) {}
  
  ngOnInit(): void {
    this.nextRace();
  }

  nextRace() {
    this.loaderService.show();
    this.nextRaceService.getAll<Ergast>('current/next.json').subscribe({
      next: (data: Ergast) => {
        this.nextRaceData = data.MRData.RaceTable.Races[0];
        this.formattedDateRange = this.formatDateRange(this.nextRaceData.FirstPractice.date, this.nextRaceData.date);
        this.loaderService.hide();
      },
      error: (error) => {
        console.log('Erro:', error);
        this.loaderService.hide();
      }
    });
  }

  private formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    start.setDate(start.getDate() + 1);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
  }
}
