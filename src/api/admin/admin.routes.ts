import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pet' },
  {
    path: 'pet',
    loadChildren: () => import('./pet/pet.routes').then(m => m.petRoutes)
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.routes').then(m => m.storeRoutes)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.routes').then(m => m.userRoutes)
  }
];
