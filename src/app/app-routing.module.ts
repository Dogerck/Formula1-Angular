import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule) },
  {path: 'teams', loadChildren: () => import('./views/teams/teams.module').then(m => m.TeamsModule) },
  {path: 'latest', loadChildren: () => import('./views/latest/latest.module').then(m => m.LatestModule) },
  {path: 'results', loadChildren: () => import('./views/results/results.module').then(m => m.ResultsModule) },
  {path: 'drivers', loadChildren: () => import('./views/drivers/drivers.module').then(m => m.DriversModule) },
  {path: 'schedule', loadChildren: () => import('./views/schedule/schedule.module').then(m => m.ScheduleModule) },
  {path: 'not-found', loadChildren: () => import('./views/not-found/not-found.module').then(m => m.NotFoundModule) },
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
