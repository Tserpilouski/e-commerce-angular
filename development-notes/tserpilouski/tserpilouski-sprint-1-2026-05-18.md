# Sprint 1: Project Setup & Team Configuration — 2026-05-18

- **What was done:**
  - Built a reusable `ec-input` component (`shared/components/input`) with `ControlValueAccessor` support for integration with Angular Reactive Forms
  - Added a `status` input (`'default' | 'success' | 'error'`) for visual field state indication
  - Configured `appearance="outline"` on `mat-form-field`
  - Implemented custom component theming via `mat.form-field-overrides()` — the official, type-safe Angular Material API
  - Applied the `host: { '[attr.data-status]': 'status()' }` pattern to bind state to the host element attribute and style via CSS attribute selectors

- **Problems:**

  **1. Component was not integrating with Reactive Forms (main issue)**

  Initially, `ec-input` was written as a plain component with `@Input() value` and `@Output() valueChange` — essentially just a thin wrapper around `<input>`. When the component was connected to a form via `formControlName="email"`, Angular threw no compile-time error, but at runtime the field value never reached the `FormGroup`. `form.value` always returned `null` for that control, and `form.patchValue(...)` had no effect on the displayed value.

  Root cause: Angular Forms looks for an `NG_VALUE_ACCESSOR` provider on the element. If none is found, Angular silently ignores `formControlName` and never establishes a two-way binding. The component looks functional on the surface — you can type into it — but it is completely isolated from the form.

  The fix required implementing the `ControlValueAccessor` interface with four methods and registering the component as an `NG_VALUE_ACCESSOR` provider:
  - `writeValue(value)` — form → component (update the displayed value)
  - `registerOnChange(fn)` — component stores the callback it calls on every user input
  - `registerOnTouched(fn)` — callback to mark the field as "touched" (used for validation display)
  - `setDisabledState(isDisabled)` — lets the form control the disabled state of the field

  Without this contract, any custom wrapper around `<input>` operates in a one-way mode and is not a real participant in Angular Forms.

  **2. Directly overriding MDC classes via `::ng-deep` had no effect**

  Attempting to style `.mdc-notched-outline__leading/notch/trailing` directly did not work — Angular Material's internal styles had higher specificity and overrode the custom rules.

  **3. `--mdc-outlined-text-field-*` CSS variables did not apply when set on `mat-form-field`**

  Variables set via `::ng-deep` on `mat-form-field` did not cascade as expected — Material was reading them from a different scope.

  **4. The `InputStatus` type was accidentally placed between the `@Component` decorator and the class**

  This broke the decorator-to-class binding in TypeScript, producing a cascade of compile errors.

- **Solutions:**

  **1. Implemented `ControlValueAccessor`** — the component was registered as an `NG_VALUE_ACCESSOR` provider via `forwardRef`, and all four interface methods were added. After this, `formControlName` worked correctly: values sync in both directions and the form is aware of the field state (touched, dirty, valid).

  **2. Replaced `::ng-deep` with `mat.form-field-overrides()`** — this mixin generates CSS custom properties directly in the correct scope, bypassing the specificity issue entirely.

  **3. Moved CSS variables to `:host`** (the `<ec-input>` element), from where they cascade naturally into Material's internal elements without conflicts.

  **4. Replaced two `[class.status-*]` bindings** with a single `[attr.data-status]`, and styled via `:host[data-status='success']`.

- **What I learned:**
  - **`ControlValueAccessor` is a mandatory contract** for any custom component that needs to work with Angular Forms. Without it, `formControlName` and `formControl` silently ignore the component. The interface has four methods, each responsible for a distinct communication channel between the component and the form.
  - Angular Material 21 (MDC) provides typed `mat.<component>-overrides()` mixins — token names are validated at build time, eliminating typos.
  - CSS custom properties cascade down the DOM, so they should be set as close to the root of the target subtree as possible, not on deeply nested internal elements.
  - For custom components, the recommended approach is to use `--mat-sys-*` variables (Material's design token system); for overriding styles of specific Material components — use `mat.<component>-overrides()`.
  - A `data-status` attribute on the host element is cleaner than two CSS classes: one line in `host`, instantly readable in DevTools, and trivial to extend with new states.

- **Time spent:** 5h
