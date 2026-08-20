import { Directive, OnDestroy, inject, input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { SidenavActions, SidenavService } from '../services/sidenav.service';

@Directive({ selector: '[appSidenav]' })
export class SidenavDirective implements OnDestroy{
  private sidenav = inject(SidenavService);

  readonly appSidenav = input.required<MatDrawer>();
  private sidenavSubscription!: Subscription;

  constructor() {
    this.sidebarController();
   }

   sidebarController() {
    this.sidenavSubscription = this.sidenav.changeMenu$.subscribe((action: SidenavActions) => {
      const drawer = this.appSidenav();
      if(drawer) {
        switch (action) {
          case 'toggle':
            drawer.toggle();
            break;
          case 'close':
            drawer.close();
            break;
          case 'open':
            drawer.open();
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
