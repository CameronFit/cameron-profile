import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AUTH_STATE } from '../tokens/auth-state.token';

export const roleCanMatch =
  (role: string): CanMatchFn =>
  () => {
    const auth = inject(AUTH_STATE);
    const router = inject(Router);
    return (
      (auth.isAuthenticated() && auth.hasRole(role)) ||
      router.createUrlTree(['/home'])
    );
  };
