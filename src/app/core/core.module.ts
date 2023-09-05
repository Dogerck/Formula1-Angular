import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavDirective } from '../directives/sidenav.directive';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidenavComponent,
    SidenavDirective
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    MatMenuModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidenavComponent
  ]
})
export class CoreModule { }
