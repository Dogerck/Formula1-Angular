import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { StandingsComponent } from './components/standings/standings.component';
import { HomeComponent } from './home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NextRaceComponent } from './components/next-race/next-race.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { LoaderInterceptor } from 'src/app/interceptors/interceptor-loader.interceptor';

@NgModule({
  declarations: [
    StandingsComponent,
    HomeComponent,
    NextRaceComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  exports: [
    StandingsComponent,
  ]
})
export class HomeModule { }
