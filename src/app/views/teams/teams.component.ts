import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constructor } from 'src/app/models/constructor';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { ConstructorsService } from 'src/app/services/constructors.service';
import { LoaderService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {
  constructorsData: Constructor[] = [];
  private subscription: Subscription | undefined;
  
  constructor(private constructorService: ConstructorsService, public loaderService: LoaderService) {}

  ngOnInit() {
    this.getConstructor()
  }

  getConstructor() {
    this.loaderService.show()
    this.subscription = this.constructorService.getAll<Ergast>('current/constructors.json').subscribe({
      next: (data: Ergast) => {
        this.constructorsData = data.MRData.ConstructorTable.Constructors;
        this.loaderService.hide()
      },
      error: (error) => {
        console.log('Erro:', error);
        this.loaderService.hide()
      }
    })
  }

  ngOnDestroy(): void { 
    if (this.subscription) { 
      this.subscription.unsubscribe();
    } 
  }
}
