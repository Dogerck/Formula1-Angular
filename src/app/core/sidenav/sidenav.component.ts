import { Component } from '@angular/core';
import { TriggerService } from 'src/app/services/trigger.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  public opened: boolean = false;

  constructor(private triggerService: TriggerService) {
    this.triggerService.sidenavClose.subscribe(opened => {
      this.opened = opened;
    });
  }
}
