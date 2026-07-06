import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'product/:key',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'product-list',
    loadComponent: () => import('./pages/product-list/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.CheckoutComponent),
  },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation').then((m) => m.OrderConfirmationComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFound),
  },
];
