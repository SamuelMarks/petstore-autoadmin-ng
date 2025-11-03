import { Routes } from "@angular/router";

export const userRoutes: Routes = [
  { path: 'new', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) }
];
