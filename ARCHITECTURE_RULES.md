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
   - Rely on **signals, inputs, and outputs/events** for updates.
   - Avoid manual change detection triggers (`ChangeDetectorRef.detectChanges` / `markForCheck`) unless there is a very specific performance reason.

2. ### Signals for Component State

   - Use `signal`, `computed`, and `effect` for **local/component state**.
   - Services can expose signals or plain values; components consume them.
   - Avoid `subscribe()` in components. If you need to convert a stream to signals, use:
     - `toSignal(observable$)` **in a service**, or
     - an `effect` that updates signals.
   - RxJS is still allowed in services for HTTP, composition, and side effects.

3. ### Standalone Components Only

   - All UI components must be `standalone: true`.
   - Import all Angular Material / Router / Common modules **directly in the component**.
   - No legacy NgModules for new code.

4. ### InjectionTokens for Global Config & State

   - Use `InjectionToken` with a factory for global config and long-lived state.
   - Examples: `DOCS_CONFIG`, `AUTH_STATE`, `APP_CONFIG`, `PORTFOLIO_CONTENT_CONFIG`.
   - Prefer tokens over global singletons for:
     - base URLs,
     - environment configuration,
     - app-level state objects (auth, docs, static content config).
   - Tokens must live under `src/app/core/tokens`.

5. ### Feature-First File Layout

   - Each feature owns its UI & logic under `src/app/features/<feature-name>`.
   - Shared primitives (buttons, cards, layout helpers) live under `src/app/shared`.
   - Cross-cutting concerns (interceptors, tokens, guards, services, util functions) live under `src/app/core`.
   - Layout primitives (`Shell`, `Header`, `CustomSidenav`) live under `src/app/layout`.

6. ### No Business Logic in Templates

   - Templates should remain **declarative**.
   - Move conditionals, mapping, and branching into the component or service.
   - Only simple pipes/structural directives are allowed in the template.

7. ### No Inline Styles
   - **No `style=` attributes** or inline `<style>` blocks in components.
   - All component styles must be in separate SCSS files.
   - All colors, spacing, radii, and shadows must use global tokens from:
     - `src/styles/_tokens.scss`
     - `src/styles/theme.scss` (Material theme)

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
