import { InjectionToken, signal, computed } from '@angular/core';

export interface User {
  id: string;
  name: string;
  roles: string[];
}

export interface AuthSignals {
  accessToken: ReturnType<typeof signal<string | null>>;
  user:        ReturnType<typeof signal<User | null>>;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  logoutLocal: () => void;
}

export const AUTH_STATE = new InjectionToken<AuthSignals>('AUTH_STATE', {
  factory: () => {
    const accessToken = signal<string | null>(null);
    const user = signal<User | null>(null);

    const isAuthenticated = () => !!accessToken();
    const hasRole = (role: string) => !!user()?.roles?.includes(role);

    const logoutLocal = () => {
      accessToken.set(null);
      user.set(null);
    };

    return { accessToken, user, isAuthenticated, hasRole, logoutLocal };
  }
});
