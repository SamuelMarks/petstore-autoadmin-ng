import { Routes } from "@angular/router";

export const USERS_ROUTES: Routes = [{ path: '', redirectTo: 'new', pathMatch: 'full' },
  {
    path: 'new',
    title: 'Create User',
    loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: ':username',
    title: 'Edit User',
    loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent)
  }];
