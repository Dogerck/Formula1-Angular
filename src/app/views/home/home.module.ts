import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { StandingsComponent } from './components/standings/standings.component';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    StandingsComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule
  ],
  exports: [
    StandingsComponent,
  ]
})
export class HomeModule { }
