/* eslint-disable */
import { Routes } from '@angular/router';
export const STORES_ROUTES: Routes = [{ path: '', title: 'Stores', loadComponent: () => import('./stores-list/stores-list.component').then(m => m.StoreListComponent) },
{ path: 'new', title: 'Create Store', loadComponent: () => import('./store-form/store-form.component').then(m => m.StoreFormComponent) },
{ path: ':orderId', title: 'Edit Store', loadComponent: () => import('./store-form/store-form.component').then(m => m.StoreFormComponent) }];
