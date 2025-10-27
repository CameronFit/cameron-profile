// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AUTH_STATE } from '../tokens/auth-state.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only attach for your demo "protected" endpoints
  if (!req.url.startsWith('/api/')) return next(req);

  const auth = inject(AUTH_STATE);
  const token = auth.accessToken();

  if (!token) return next(req);

  const withAuth = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` } // ← fixed
  });
  return next(withAuth);
};
