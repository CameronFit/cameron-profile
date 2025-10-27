import { Routes } from '@angular/router';

// Public-facing pages
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    loadComponent: () =>
      import('./features/public/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/public/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/public/projects/projects.component').then(
        (m) => m.ProjectsComponent
      ),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./features/public/skills/skills.component').then(
        (m) => m.SkillsComponent
      ),
  },
  {
    path: 'timeline',
    loadComponent: () =>
      import('./features/public/timeline/timeline.component').then(
        (m) => m.TimelineComponent
      ),
  },
  {
    path: 'resume',
    loadComponent: () =>
      import('./features/public/resume/resume.component').then(
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
    path: 'architecture',
    loadComponent: () =>
      import('./features/public/architecture/architecture.component').then(
        (m) => m.ArchitectureComponent
      ),
  },
  {
    path: 'portfolio/resume',
    loadComponent: () =>
      import('./features/public/portfolio/resume/resume.component').then(
        (m) => m.ResumeComponent
      ),
  },
  {
    path: 'playground',
    loadComponent: () =>
      import('./features/public/playground/playground.component').then(
        (m) => m.PlaygroundComponent
      ),
  },

  // Admin area (protected)
  {
    path: 'admin',
    canMatch: [
      () => import('./core/guards/auth.guard').then((m) => m.authCanMatch),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        canActivate: [
          () =>
            import('./core/guards/auth.guard').then((m) => m.authCanActivate),
        ],
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'library',
        canActivate: [
          () =>
            import('./core/guards/role.guard').then((m) =>
              m.roleCanMatch('admin')
            ),
        ],
        loadComponent: () =>
          import('./features/admin/library/library.component').then(
            (m) => m.LibraryComponent
          ),
      },
    ],
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'home' },
];
