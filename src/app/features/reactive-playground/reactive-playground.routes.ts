import { Routes } from '@angular/router';

export const REACTIVE_PLAYGROUND_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./reactive-playground.component').then(m => m.ReactivePlaygroundComponent),
  }
];