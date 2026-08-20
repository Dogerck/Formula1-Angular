import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './core/header/header.component';
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, SidenavComponent, FooterComponent]
})
export class AppComponent {
  title = 'Formula1-Angular';
}
