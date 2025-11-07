# Project Rules — ARCHITECTURE / STYLE / GUIDELINES

Use this file as the single source of truth for the assistant and contributors. Copy the whole file and feed it to the assistant at the start of a session to ensure it follows your project conventions.

## High-level goals
- Keep the current feature-first architecture (src/app/features, src/app/core, src/app/shared, src/app/layout).
- Small, modern, beautiful UI: Material M3 + design tokens, mobile-first responsive layout.
- Minimal surface area: keep components tiny and focused.
- Use the latest Angular techniques (Signals, standalone components, typed APIs).
- Consistent, reusable form controls with Value Control Accessor (VCA) pattern.

## Non-negotiable rules
1. OnPush Change Detection Required
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

## Form Controls & Value Accessor Pattern
- Create reusable form controls in `shared/ui/forms/`.
- Each custom control must implement `ControlValueAccessor`:
  ```typescript
  @Component({
    selector: 'app-custom-input',
    standalone: true,
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class CustomInputComponent implements ControlValueAccessor {
    private readonly value = signal<string>('');
    private onChange: (value: string) => void = () => {};
    private onTouch: () => void = () => {};

    writeValue(value: string): void {
      this.value.set(value ?? '');
    }

    registerOnChange(fn: (value: string) => void): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
      this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
      // Handle disabled state
    }
  }
  ```

## Component patterns (examples)
- Preferred component contract (inputs / outputs):
  - Inputs: primitive or POJO, strongly typed, non-nullable if possible.
  - Outputs: use `EventEmitter` sparingly; prefer `Router` or shared services.

- Signals example (component):
  ```ts
  @Component({
    // ... other metadata
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class ExampleComponent {
    readonly count = signal(0);
    readonly double = computed(() => this.count() * 2);

    increment() { this.count.update(c => c + 1); }
  }
  ```

## Styling
- NO inline styles allowed in templates (`style=` attribute forbidden).
- NO component-level style overrides of global tokens.
- Use design tokens from `src/styles/_tokens.scss`:
  ```scss
  // Example of proper token usage
  .my-component {
    color: var(--text);
    background: var(--surface);
    border-radius: var(--radius-md);
    padding: var(--spacing-4);
  }
  ```
- Mobile-first responsive rules using provided mixins:
  ```scss
  @include media-breakpoint-up(md) {
    // Styles for medium screens and up
  }
  
  @include media-breakpoint-down(sm) {
    // Styles for small screens and down
  }
  ```
- Theme colors must use Material theme palette or custom palette tokens:
  ```scss
  // Correct
  color: var(--primary);
  background: var(--surface-variant);
  border: 1px solid var(--border-weak);

  // Incorrect
  color: #123456;
  background: rgb(0, 0, 0);
  ```
- **Material M3 Transitions**: Use smooth cubic-bezier easing for professional feel
  ```scss
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transition: background-color 150ms ease;
  ```
- **Active/Hover States**: Always provide visual feedback
  ```scss
  &:hover:not([disabled]) {
    background: var(--hover-bg);
    border-color: var(--primary);
  }
  
  &:active:not([disabled]) {
    transform: scale(0.98);
  }
  ```
- **Scrollbar Styling**: Use WebKit pseudo-elements for custom scrollbars (fallback for older browsers)
  ```scss
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: var(--border-weak); border-radius: 3px; }
  ```

## Services & state
- Services should own I/O and map Observables to signals or plain POJOs.
- Keep business rules and transformations inside services, not components.
- Use `toSignal()` when bridging RxJS -> signals (in services), or use `effect` to reactively update signals.

## Responsive Design & Mobile-First
- **Breakpoints**: Use the responsive mixins from `_responsive.scss`:
  - `xs: 0px` (default mobile)
  - `sm: 600px` (small devices)
  - `md: 960px` (tablets/medium)
  - `lg: 1280px` (desktop)
  - `xl: 1920px` (large desktop)
- **Mobile Detection**: Use `BreakpointObserver` for component logic (sidenav mode toggle, etc.)
  ```typescript
  private breakpointObserver = inject(BreakpointObserver);
  
  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }
  ```
- **Sidenav Patterns**: 
  - Desktop: Fixed side navigation with collapse/expand
  - Mobile: Overlay mode with backdrop, auto-closes after navigation
- **Toolbar Patterns**:
  - Responsive button grouping with smart wrapping
  - Icons on mobile, text labels on desktop
  - Proper touch targets (minimum 44x44px on mobile)
- **Navigation**: Use YouTube-style design with profile photo, active state indicators (golden left border), and smooth animations

## Routing & Guards
- Use `canMatch` for route gating when possible.
- Lazy-load standalone components with `loadComponent`.
- Keep routes simple and testable.

## Tests
- Provide unit tests for services and guards.
- Component tests should mock InjectionTokens and avoid network calls (use HttpClientTestingModule).
- Test signals by reading values synchronously (no async subscriptions required).
- Test custom form controls thoroughly, including all ControlValueAccessor methods.

## Accessibility (a11y)
- All interactive controls must have accessible names (aria-label, aria-labelledby or visible text).
- Landmarks: header, main, nav, footer where appropriate.
- Keyboard navigation and focus management for dialogs/menus.
- Custom form controls must maintain proper ARIA states.
- Use `[attr.aria-current]="isActive ? 'page' : null"` for active navigation items.

## UI Components & Patterns
- **Buttons**: Use Material M3 button variants
  - Primary: `mat-button` with icon
  - Outlined: `[mat-stroked-button]` for secondary actions
  - Icon only: `[mat-icon-button]` for compact actions
- **Navigation Items**: Always include visual indicators
  - Active state: left border (4px) in primary color + background highlight
  - Hover state: subtle background change + smooth transition
  - Example: YouTube-style sidenav with profile photo + menu items
- **Animations & Transitions**:
  - Use Material M3 cubic-bezier: `cubic-bezier(0.4, 0, 0.2, 1)`
  - Smooth hover/active feedback with 150-200ms duration
  - Scale transforms for interactive feedback (scale 0.98 on press)
  - Fade-in animations for content reveal (0.3s)
- **Touch Targets**: Minimum 44x44px on mobile, 36x36px on desktop

## Performance
- OnPush + Signals for optimal change detection.
- Prefer computed signals to avoid unnecessary recalculation.
- Keep bundle sizes small — lazy-load feature routes.
- Avoid large third-party libraries unless critically necessary.

## Dependency & build guidance
- Keep dependencies minimal. Remove unused libraries.
- Ensure `npm run build` and `npm test` pass before merging.

## Commit & PR guidance
- One feature per branch.
- Provide a short changelog/summary in PR description.

## Enforcement / How to feed these rules to the assistant
- At the start of the session, paste the contents of this file to the assistant or say: `Use ARCHITECTURE_RULES.md` and attach or reference the file path.
- If you want the assistant to apply these rules automatically when changing files, say explicitly: "Apply ARCHITECTURE_RULES.md rules to this change." The assistant will then attempt minimal, safe edits to conform.

---

### Minimal code conventions (quick reference)
- All components must use `changeDetection: ChangeDetectionStrategy.OnPush`.
- Prefer `strict` TypeScript settings (noImplicitAny, strictNullChecks).
- Use `readonly` where possible on class properties.
- Keep components < 200 lines where practical.
- Use typed signals: `signal<Type>(initial)`.
- Avoid `any` in new code; use narrow types.
- No inline styles; use SCSS with global tokens.
- Custom form controls must implement ControlValueAccessor.

If you want additional rules (linting rules, prettier/eslint config, or CI gating), tell me and I will add them to this file.