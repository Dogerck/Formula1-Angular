import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'home', title: 'Formula 1 - Angular', loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule) },
  {path: 'teams', title: 'Teams', loadChildren: () => import('./views/teams/teams.module').then(m => m.TeamsModule) },
  {path: 'latest', title: 'Latest', loadChildren: () => import('./views/latest/latest.module').then(m => m.LatestModule) },
  {path: 'results', title: 'Results', loadChildren: () => import('./views/results/results.module').then(m => m.ResultsModule) },
  {path: 'drivers', title: 'Drivers', loadChildren: () => import('./views/drivers/drivers.module').then(m => m.DriversModule) },
  {path: 'schedule', title: 'Schedule', loadChildren: () => import('./views/schedule/schedule.module').then(m => m.ScheduleModule) },
  {path: 'not-found', title: 'Not Found', loadChildren: () => import('./views/not-found/not-found.module').then(m => m.NotFoundModule) },
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
