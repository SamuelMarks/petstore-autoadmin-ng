/* eslint-disable */
import { Routes } from '@angular/router';
export const PETS_ROUTES: Routes = [{ path: ':petId', title: 'View Pet', loadComponent: () => import('./pet-form/pet-form.component').then(m => m.PetFormComponent) }];
