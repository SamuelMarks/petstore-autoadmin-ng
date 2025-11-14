import { Routes } from "@angular/router";

export const petRoutes: Routes = [
  { path: '', loadComponent: () => import('./pet-list/pet-list.component').then(m => m.ApiResponseListComponent) },
  { path: 'new', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.ApiResponseFormComponent) },
  {
    path: ':id/edit',
    loadComponent: () => import('./pet-form/pet-form.component').then(m => m.ApiResponseFormComponent)
  }
];
