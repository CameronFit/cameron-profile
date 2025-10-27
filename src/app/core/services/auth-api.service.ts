// src/app/core/services/auth-api.service.ts
import { inject, Injectable } from '@angular/core';
import { AUTH_STATE, User } from '../tokens/auth-state.token';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private auth = inject(AUTH_STATE);

  /**
   * Called by APP_INITIALIZER before first paint.
   * Simulates restoring a session (front-end demo).
   */
  async refreshOnStartup(): Promise<void> {
    // Simulate a small async call (e.g., /auth/refresh)
    await new Promise(res => setTimeout(res, 120));

    // Set a demo token + user (in-memory only)
    const demoUser: User = {
      id: 'u1',
      name: 'Cameron Young',
      roles: ['public'] // add 'admin' if you want to show admin routes
    };

    this.auth.accessToken.set('demo-access-token');
    this.auth.user.set(demoUser);
  }

  logout(): void {
    this.auth.logoutLocal();
  }

  get token(): string | null {
    return this.auth.accessToken();
  }
}
