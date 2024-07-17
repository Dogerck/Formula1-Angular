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
  
  nextRaceData: Races | any;
  formattedDateRange!: string;

  constructor(private nextRaceService: NextRaceService) {}
  
  ngOnInit(): void {
    this.nextRace();
  }

  nextRace() {
    this.nextRaceService.getAll<Ergast>('2024/5.json').subscribe({
      next: (data: Ergast) => {
        this.nextRaceData = data.MRData.RaceTable.Races[0];
        this.formattedDateRange = this.formatDateRange(this.nextRaceData.FirstPractice.date, this.nextRaceData.date);
      }
    });
  }

  private convertToLocalTime(utcTime: string): string {
    const date = new Date(`1970-01-01T${utcTime}Z`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
  }
}
