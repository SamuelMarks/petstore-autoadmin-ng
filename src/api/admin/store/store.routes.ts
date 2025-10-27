import { Routes } from '@angular/router';

import { StoreFormComponent } from './store-form/store-form.component';


export const routes: Routes = [
  { path: 'edit/:id', component: StoreFormComponent }
];
