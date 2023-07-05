import { Component } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public opened: boolean = false;

  constructor(private sidenav: SidenavService){}
  
  menuChangeState() {
    this.sidenav.sidebarChange('toggle');
  }
}
