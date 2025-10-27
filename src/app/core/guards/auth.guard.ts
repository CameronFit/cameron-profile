import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AUTH_STATE } from '../tokens/auth-state.token';

// Blocks route loading & navigation for lazy routes
export const authCanMatch: CanMatchFn = () => {
  const auth = inject(AUTH_STATE);
  const router = inject(Router);
  return auth.isAuthenticated() || router.createUrlTree(['/home']);
};

// For non-lazy (or extra belt-and-braces)
export const authCanActivate: CanActivateFn = () => {
  const auth = inject(AUTH_STATE);
  const router = inject(Router);
  return auth.isAuthenticated() || router.createUrlTree(['/home']);
};
