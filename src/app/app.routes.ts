import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', title: 'Formula 1 - Angular', loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent) },
  { path: 'teams', title: 'Teams', loadComponent: () => import('./views/teams/teams.component').then(m => m.TeamsComponent) },
  { path: 'latest', title: 'Latest', loadComponent: () => import('./views/latest/latest.component').then(m => m.LatestComponent) },
  { path: 'results', title: 'Results', loadComponent: () => import('./views/results/results.component').then(m => m.ResultsComponent) },
  { path: 'drivers', title: 'Drivers', loadComponent: () => import('./views/drivers/drivers.component').then(m => m.DriversComponent) },
  { path: 'schedule', title: 'Schedule', loadComponent: () => import('./views/schedule/schedule.component').then(m => m.ScheduleComponent) },
  { path: 'not-found', title: 'Not Found', loadComponent: () => import('./views/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
