import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { SidenavDirective } from '../../directives/sidenav.directive';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatSidenavContainer, MatSidenav, SidenavDirective, RouterLink, MatSidenavContent, RouterOutlet]
})
export class SidenavComponent {
  private sidenav = inject(SidenavService);

  public opened: boolean = false;

  menuChangeState() {
    this.sidenav.sidebarChange('toggle');
  }
}
