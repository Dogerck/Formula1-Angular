import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './core/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, RouterOutlet, FooterComponent]
})
export class AppComponent {
  title = 'Formula1-Angular';
}
