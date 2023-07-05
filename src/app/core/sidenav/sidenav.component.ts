import { Component, Input } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  public opened: boolean = false;

  constructor(private sidenav: SidenavService){}

  menuChangeState() {
    this.sidenav.sidebarChange('toggle');
  }
}
