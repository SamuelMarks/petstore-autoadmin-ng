/* eslint-disable */
import { Routes } from '@angular/router';
export const PETS_ROUTES: Routes = [{ path: '', title: 'Pets', loadComponent: () => import('./pets-list/pets-list.component').then(m => m.PetListComponent) },
{ path: 'new', title: 'Create Pet', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.PetFormComponent) },
{ path: ':petId', title: 'Edit Pet', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.PetFormComponent) }];
