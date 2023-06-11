import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule) },
  {path: 'latest', loadChildren: () => import('./views/latest/latest.module').then(f => f.LatestModule) },
  {path: 'schedule', loadChildren: () => import('./views/schedule/schedule.module').then(f => f.ScheduleModule) },
  {path: 'results', loadChildren: () => import('./views/results/results.module').then(f => f.ResultsModule) },
  {path: 'drivers', loadChildren: () => import('./views/drivers/drivers.module').then(f => f.DriversModule) },
  {path: 'teams', loadChildren: () => import('./views/teams/teams.module').then(f => f.TeamsModule) },
  {path: '', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
