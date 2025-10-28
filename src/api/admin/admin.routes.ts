import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'pet' },
    { path: 'pet', loadChildren: () => import('./pet/pet.routes').then(m => m.routes) },
    { path: 'store', loadChildren: () => import('./store/store.routes').then(m => m.routes) },
    { path: 'user', loadChildren: () => import('./user/user.routes').then(m => m.routes) }
];
