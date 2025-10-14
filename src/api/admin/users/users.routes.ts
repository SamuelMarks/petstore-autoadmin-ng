/* eslint-disable */
import { Routes } from '@angular/router';
export const USERS_ROUTES: Routes = [{ path: ':username', title: 'View User', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) }];
