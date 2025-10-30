import { Routes } from "@angular/router";

export let routes: Routes = [
    { path: 'create', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.PetFormComponent) },
    { path: 'edit/:id', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.PetFormComponent) }
];
