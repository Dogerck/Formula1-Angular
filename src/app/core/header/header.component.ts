import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MobileNavService } from 'src/app/services/mobile-nav.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatToolbar, MatIconButton, MatIcon, RouterLink, RouterLinkActive]
})
export class HeaderComponent {
  mobileNav = inject(MobileNavService);
}
