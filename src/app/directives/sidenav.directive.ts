import { Directive, Input, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { SidenavActions, SidenavService } from '../services/sidenav.service';

@Directive({
  selector: '[appSidenav]'
})
export class SidenavDirective implements OnDestroy{

  @Input()appSidenav!: MatDrawer;
  private sidenavSubscription!: Subscription;

  constructor(private sidenav: SidenavService) {
    this.sidebarController();
   }

   sidebarController() {
    this.sidenavSubscription = this.sidenav.changeMenu$.subscribe((action: SidenavActions) => {
      if(this.appSidenav) {
        switch (action) {
          case 'toggle':
            this.appSidenav.toggle();
            break;
          case 'close':
            this.appSidenav.close();
            break;
          case 'open':
            this.appSidenav.open();
            break;
          default:
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sidenavSubscription.unsubscribe();
  }

}
