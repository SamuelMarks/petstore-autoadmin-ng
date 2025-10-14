/* eslint-disable */
import { Routes } from '@angular/router';
export const STORES_ROUTES: Routes = [{ path: ':orderId', title: 'View Store', loadComponent: () => import('./store-form/store-form.component').then(m => m.StoreFormComponent) }];
