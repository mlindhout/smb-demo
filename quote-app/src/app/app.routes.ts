import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customer-list/customer-list').then(m => m.CustomerList),
    canActivate: [authGuard]
  },
  {
    path: 'customers/new',
    loadComponent: () => import('./components/customers/customer-form/customer-form').then(m => m.CustomerForm),
    canActivate: [authGuard]
  },
  {
    path: 'customers/:id',
    loadComponent: () => import('./components/customers/customer-form/customer-form').then(m => m.CustomerForm),
    canActivate: [authGuard]
  },
  {
    path: 'quotes',
    loadComponent: () => import('./components/quotes/quote-list/quote-list').then(m => m.QuoteList),
    canActivate: [authGuard]
  },
  {
    path: 'quotes/new',
    loadComponent: () => import('./components/quotes/quote-form/quote-form').then(m => m.QuoteForm),
    canActivate: [authGuard]
  },
  {
    path: 'quotes/:id',
    loadComponent: () => import('./components/quotes/quote-detail/quote-detail').then(m => m.QuoteDetail),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/orders/order-list/order-list').then(m => m.OrderList),
    canActivate: [authGuard]
  },
  {
    path: 'invoices',
    loadComponent: () => import('./components/invoices/invoice-list/invoice-list').then(m => m.InvoiceList),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
