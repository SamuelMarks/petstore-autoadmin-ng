import { Routes } from "@angular/router";

export let routes: Routes = [
    { path: 'edit/:id', loadComponent: () => import('./store-form/store-form.component').then(m => m.StoreFormComponent) }
];
