import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then((m) => m.Profile),
    children: [
      {
        path: 'account',
        loadComponent: () => import('./account/account.component').then((m) => m.Account),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.Dashboard),
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/orders.component').then((m) => m.Orders),
      },
    ],
  },
];
