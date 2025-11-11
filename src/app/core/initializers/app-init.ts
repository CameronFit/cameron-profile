// src/app/core/initializers/app-init.ts
import { APP_INITIALIZER, Provider } from '@angular/core';
import { initializeSession } from './session-init';

/**
 * Aggregated APP_INITIALIZER providers for application bootstrap.
 * 
 * All initializers run before Angular renders AppComponent.
 * Add additional initializers here as needed (config loading, feature flags, etc.)
 */
export const APP_INIT_PROVIDERS: Provider[] = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeSession,
    multi: true
  }
];
