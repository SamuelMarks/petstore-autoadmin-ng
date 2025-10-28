
import { Routes } from '@angular/router';

import { UserFormComponent } from './user-form/user-form.component';


export const routes: Routes = [
    { path: 'create', component: UserFormComponent },
    { path: 'edit/:id', component: UserFormComponent }
];
