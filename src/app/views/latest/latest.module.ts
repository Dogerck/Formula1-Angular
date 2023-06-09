import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestRoutingModule } from './latest-routing.module';
import { LatestComponent } from './latest.component';


@NgModule({
  declarations: [
    LatestComponent
  ],
  imports: [
    CommonModule,
    LatestRoutingModule
  ]
})
export class LatestModule { }
