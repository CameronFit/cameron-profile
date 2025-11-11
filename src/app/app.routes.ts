import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'profile' },

  {
    path: 'profile',
    loadComponent: () =>
      import('./features/public/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },

  {
    path: 'resume',
    loadComponent: () =>
      import('./features/public/portfolio/resume/resume.component').then(
        (m) => m.ResumeComponent
      ),
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./features/public/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },

  {
    path: 'reactive-playground',
    loadChildren: () =>
      import('./features/reactive-playground/reactive-playground.routes')
        .then(m => m.REACTIVE_PLAYGROUND_ROUTES),
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'profile' },
];
