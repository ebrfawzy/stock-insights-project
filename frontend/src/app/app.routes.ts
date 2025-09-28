import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'insights', loadComponent: () => import('./components/insights/insights.component').then(m => m.InsightsComponent) },
  { path: 'stocks', loadComponent: () => import('./components/stocks/stocks.component').then(m => m.StocksComponent) },
  { path: 'stocks/:symbol', loadComponent: () => import('./components/stock-detail/stock-detail.component').then(m => m.StockDetailComponent) },
  { path: '**', redirectTo: '' }
];
