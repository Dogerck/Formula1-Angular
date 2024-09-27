import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  private subscription: Subscription | undefined;

  constructor(private nextRaceService: NextRaceService, public loaderService: LoaderService) {}
  
  ngOnInit(): void {
    this.nextRace();
  }

  nextRace() {
    this.loaderService.show();
    this.subscription = this.nextRaceService.getAll<Ergast>('current/next.json').subscribe({
      next: (data: Ergast) => {
        this.nextRaceData = data.MRData.RaceTable.Races[0];
        this.formattedDateRange = this.formatDateRange(this.nextRaceData.FirstPractice.date, this.nextRaceData.date);
        this.loaderService.hide();
        console.log(this.nextRaceData);
        
      },
      error: (error) => {
        console.log('Erro:', error);
        this.loaderService.hide();
      }
    });
  }
  ngOnDestroy(): void { 
    if (this.subscription) { 
      this.subscription.unsubscribe(); 
    } 
  }

  private formatDateRange(startDate: string, endDate: string): string {
    const end = new Date(endDate + 'T00:00:00Z');
    const start = new Date(startDate + 'T00:00:00Z');
    const localEnd = new Date(end.getTime() + end.getTimezoneOffset() * 60000);
    const localStart = new Date(start.getTime() + start.getTimezoneOffset() * 60000);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${localStart.toLocaleDateString('en-GB', options)} - ${localEnd.toLocaleDateString('en-GB', options)}`;
  }
}
