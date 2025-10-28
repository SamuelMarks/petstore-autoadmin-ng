
import { Routes } from '@angular/router';

import { PetFormComponent } from './pet-form/pet-form.component';


export const routes: Routes = [
    { path: 'create', component: PetFormComponent },
    { path: 'edit/:id', component: PetFormComponent }
];
