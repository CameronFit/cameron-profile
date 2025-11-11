// src/app/core/initializers/session-init.ts
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AUTH_STATE } from '../tokens/auth-state.token';
import { firstValueFrom } from 'rxjs';
import { delay, of } from 'rxjs';

/**
 * APP_INITIALIZER factory for silent session refresh.
 * Attempts to restore user session via HttpOnly cookie before app renders.
 * 
 * In production, replace mock with real API call:
 *   http.post<AuthResponse>('/api/auth/refresh', {})
 */
export function initializeSession() {
  const http = inject(HttpClient);
  const auth = inject(AUTH_STATE);

  return async () => {
    try {
      console.log('[Session Init] Attempting silent session refresh...');

      // Mock API response with 500ms delay to simulate network call
      const mockResponse = await firstValueFrom(
        of({
          accessToken: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-123',
            name: 'Cameron Young',
            roles: ['user', 'admin']
          }
        }).pipe(delay(500))
      );

      // Update auth state signals
      auth.accessToken.set(mockResponse.accessToken);
      auth.user.set(mockResponse.user);

      console.log('[Session Init] ✓ Session restored:', mockResponse.user.name);
    } catch (error) {
      // Session expired or not authenticated; continue as guest
      console.log('[Session Init] ✗ No active session (guest mode)');
      auth.accessToken.set(null);
      auth.user.set(null);
    }
  };
}
