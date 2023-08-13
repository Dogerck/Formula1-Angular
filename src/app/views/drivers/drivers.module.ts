import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriversComponent } from './drivers.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from 'src/app/interceptors/interceptor-loader.interceptor';


@NgModule({
  declarations: [
    DriversComponent
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ]
})
export class DriversModule { }
