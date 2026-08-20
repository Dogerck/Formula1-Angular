import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatToolbar, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, RouterLink, RouterLinkActive]
})
export class HeaderComponent {
  public opened: boolean = false;

  constructor(private sidenav: SidenavService){}
  
  menuChangeState() {
    this.sidenav.sidebarChange('toggle');
  }
}
