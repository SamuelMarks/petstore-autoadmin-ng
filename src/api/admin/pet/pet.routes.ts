import { Routes } from "@angular/router";

export const petRoutes: Routes = [
  { path: 'new', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.PetFormComponent) }
];
