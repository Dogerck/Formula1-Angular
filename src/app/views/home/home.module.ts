import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { StandingsComponent } from './components/standings/standings.component';
import { HomeComponent } from './home.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NextRaceComponent } from './components/next-race/next-race.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { LoaderInterceptor } from 'src/app/interceptors/interceptor-loader.interceptor';
import { ConvertToLocalTimeDirective } from 'src/app/directives/convert-to-local-time.directive';
import { ConvertToLocalDateDirective } from 'src/app/directives/convert-to-local-date.directive';

@NgModule({ declarations: [
        StandingsComponent,
        HomeComponent,
        NextRaceComponent,
        ConvertToLocalTimeDirective,
        ConvertToLocalDateDirective
    ],
    exports: [
        StandingsComponent,
    ], imports: [CommonModule,
        HomeRoutingModule,
        MatProgressSpinnerModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class HomeModule { }
