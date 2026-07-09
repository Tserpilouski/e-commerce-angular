# Sprint 4: User Profile, Dashboard & Address Management (EPAM-16) — 2026-07-09

- **What was done:**
  - Added a `Profile` shell (`ec-profile`) with a sidebar and `router-outlet`, plus three lazy-loaded child routes: `account`, `dashboard`, `orders`.
  - Made `currentUser` survive a reload: `AuthService` seeds the signal from `sessionStorage` and an `effect()` mirrors changes back. The header now greets the logged-in user instead of showing a generic icon.
  - Built the `Dashboard` page with a Recent Orders panel and a Saved Addresses panel.
  - Built two presentational cards, `ec-recent-orders-card` and `ec-address-card`, both deriving their display strings via `computed`.
  - Built `AddressEditDialog` on `MatDialog` with a nested reactive form. One component handles both editing an existing address and adding a new one.
  - Moved all dashboard interfaces into `dashboard/models/`, one type per `.model.ts` file.
  - Dropped the deprecated `baseUrl` from `tsconfig.json`.

- **Problems:**

  **1. One dialog, two flows**

  Edit and Add need the same form. A second component would duplicate the whole validation setup and every future field.

  **2. Dismissed dialogs write garbage**

  `afterClosed()` is typed `Observable<R | undefined>` — Esc, backdrop click, and Cancel all emit `undefined`. Subscribing naively wipes the address being edited.

  **3. Mutating a signal's array in place**

  Signals compare by reference, so `addresses()[i].city = 'Oakland'` changes the data but never re-renders.

- **Solutions:**
  - Let `MAT_DIALOG_DATA` accept `DeliveryInfo | null`. `null` means "create": the dialog falls back to a `BLANK_DELIVERY` constant and swaps its title and submit label. `Dashboard` shares one `openDialog()` helper between `onEdit()` and `onAdd()` — the only difference is what happens to the result.
  - Guarded each subscription with `if (!result) return;` and typed `dialog.open<AddressEditDialog, DeliveryInfo | null, DeliveryInfo>(...)` with all three generics, so the `undefined` is visible to the type checker instead of collapsing into `any`.
  - Made `addresses` a `signal<DeliveryInfo[]>` and update it immutably via `update(list => list.map(...))`. Also added a stable `id` to `DeliveryInfo` and switched `@for` to `track address.id` — it used to track `label`, the one field the dialog lets you edit.

- **What I learned:**
  `input()` / `output()` aren't just sugar over `@Input` / `@Output` — a signal input can't be written to, which forces every mutation back to whoever owns the data. The card renders an address and says "the user wants to edit this one"; it knows nothing about dialogs or the list it belongs to.

  Also: `MatDialogRef`'s three generics matter. Skip them and `afterClosed()` hands you `any`, which quietly disarms the exact `undefined` check that keeps a dismissed dialog from corrupting state.

- **Time spent:** 5
