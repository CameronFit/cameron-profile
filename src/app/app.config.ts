// src/app/app.config.ts
import { ApplicationConfig, APP_INITIALIZER, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthApiService } from './core/services/auth-api.service';

// Factory to run before first render
function appInit() {
  const auth = inject(AuthApiService);
  return () => auth.refreshOnStartup(); // returns Promise<void>
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: APP_INITIALIZER, multi: true, useFactory: appInit },
  ],
};
