# Project Rules — ARCHITECTURE / STYLE / GUIDELINES (Cameron Profile App)

Use this file as the single source of truth for the assistant and contributors.  
Copy the whole file and feed it to the assistant/Copilot at the start of a session to ensure it follows these conventions.

---

## High-level goals

- Keep the current **feature-first architecture** (`src/app/features`, `src/app/core`, `src/app/shared`, `src/app/layout`).
- Small, modern, beautiful UI: **Angular Material M3 + design tokens**, mobile-first responsive layout.
- Minimal surface area: keep components **tiny and focused**.
- Use the latest Angular techniques (**signals, standalone components, typed APIs**).
- Consistent, reusable form controls with the **ControlValueAccessor pattern**.
- App must look **premium and deliberate**, not like a default Angular Material demo.

---

## Non-negotiable rules

1. ### OnPush Change Detection Required

   - All components MUST use `changeDetection: ChangeDetectionStrategy.OnPush`.
   - Rely on signals, inputs, and events for updates.
   - Avoid manual change detection triggers.
2. Signals for component state
   - Use `signal`, `computed`, and `effect` for component/local state.
   - Avoid `subscribe()` in components. If you need to convert a stream to signals, do it in a service and expose signals or plain values.
3. Standalone components only
   - Prefer `standalone: true` and import required modules directly on the component.
4. InjectionTokens for global config & state
   - Use `InjectionToken` with a factory when sensible (see `src/app/core/tokens` for examples).
   - Tokens like `DOCS_CONFIG`, `AUTH_STATE`, or `APP_CONFIG` should be used instead of globals.
5. Feature-first file layout
   - Each feature owns its UI and logic. Keep shared primitives in `src/app/shared` and cross-cutting concerns in `src/app/core`.
6. No business logic in templates
   - Templates should remain declarative; move logic to component class or services.
7. No inline styles
   - All styles must use global tokens from `src/styles/_tokens.scss`.
   - Component styles must be in separate SCSS files.
   - No style attributes in templates.

---

## 🔑 Application Bootstrap & APP_INITIALIZER Pattern

### Purpose
Use `APP_INITIALIZER` to run startup logic **before** Angular renders anything.

Typical uses:
- Silent session refresh via HttpOnly cookie
- Loading app config / feature flags
- Preloading user profile or language packs

### Boot order overview
1. CLI builds the bundle (`angular.json`)
2. Browser loads `index.html` → executes `main.ts`
3. Angular builds the DI container
4. `APP_INITIALIZER` runs (startup jobs)
5. AppComponent bootstraps
6. Router + Guards run
7. Components and interceptors operate normally

### Folder structure
```
src/app/core/
  initializers/
    app-init.ts          # Main APP_INITIALIZER provider
    session-init.ts      # Session refresh logic
  tokens/
    app-config.token.ts  # Global config InjectionToken
```

### Example: Session refresh initializer

**src/app/core/initializers/session-init.ts**
```typescript
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AUTH_STATE } from '../tokens/auth-state.token';
import { firstValueFrom } from 'rxjs';

export function initializeSession() {
  const http = inject(HttpClient);
  const auth = inject(AUTH_STATE);

  return async () => {
    try {
      // Attempt silent refresh using HttpOnly cookie
      const response = await firstValueFrom(
        http.post<{ accessToken: string; user: any }>('/api/auth/refresh', {})
      );
      auth.accessToken.set(response.accessToken);
      auth.user.set(response.user);
    } catch {
      // Session expired or not authenticated; continue as guest
      console.log('[Session Init] No active session');
    }
  };
}
```

**src/app/core/initializers/app-init.ts**
```typescript
import { APP_INITIALIZER, Provider } from '@angular/core';
import { initializeSession } from './session-init';

export const APP_INIT_PROVIDERS: Provider[] = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeSession,
    multi: true
  }
];
```

**src/app/app.config.ts**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { APP_INIT_PROVIDERS } from './core/initializers/app-init';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([...])),
    APP_INIT_PROVIDERS
  ]
};
```

### Key rules
- Return a **Promise** or **Observable** from the factory function
- Angular waits for all `APP_INITIALIZER` to complete before bootstrapping
- Use `inject()` inside factory for DI (modern syntax)
- Keep initializers focused: one concern per initializer
- Place in `src/app/core/initializers/`

---

## Form Controls & Value Accessor Pattern

Reusable form controls belong in `src/app/shared/ui/forms/`.

Each custom control must implement `ControlValueAccessor`:

```ts
@Component({
  selector: "app-custom-input",
  standalone: true,
  templateUrl: "./custom-input.component.html",
  styleUrls: ["./custom-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  private readonly value = signal<string>("");
  private onChange: (value: string) => void = () => {};
  private onTouch: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? "");
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state (e.g., track disabled signal and disable inputs)
  }

  // When user types:
  // this.value.set(next); this.onChange(next); this.onTouch();
}
```
