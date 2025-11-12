import { Routes } from "@angular/router";

export const storeRoutes: Routes = [
      { path: '', loadComponent: () => import('./store-list/store-list.component').then(m => m.OrderListComponent) },
      { path: ':id/edit', loadComponent: () => import('./store-form/store-form.component').then(m => m.OrderFormComponent) }
    ];
