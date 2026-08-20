import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MobileNavService } from 'src/app/services/mobile-nav.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatSidenavContainer, MatSidenav, MatSidenavContent, RouterLink, RouterLinkActive, RouterOutlet]
})
export class SidenavComponent {
  mobileNav = inject(MobileNavService);
}
