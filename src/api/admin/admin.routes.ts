import { Routes } from "@angular/router";

export const ADMIN_ROUTES: Routes = [{ path: '', redirectTo: 'pets', pathMatch: 'full' },
  { path: 'pets', loadChildren: () => import('./pets/pets.routes').then(m => m.PETS_ROUTES) },
  { path: 'stores', loadChildren: () => import('./stores/stores.routes').then(m => m.STORES_ROUTES) },
  { path: 'users', loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES) }];
