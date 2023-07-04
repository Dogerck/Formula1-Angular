import { Component } from '@angular/core';
import { TriggerService } from 'src/app/services/trigger.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public opened: boolean = false;

  constructor(private triggerService: TriggerService){}
  
  toggleSidenav() {
    this.triggerService.toggleSidenav();
  }
}
