import { Routes } from "@angular/router";

export let routes: Routes = [
    { path: 'create', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) },
    { path: 'edit/:id', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) }
];
