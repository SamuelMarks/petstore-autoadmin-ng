/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormControl, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../../services';
import { any } from '../../../models';



@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly svc = inject(UserService);
    private readonly snackBar = inject(MatSnackBar);
    

    readonly data = signal<any | null>(null);
    readonly isEditable = true;

    readonly id = input<string | number>();
    readonly isEditMode = computed(() => this.isEditable && !!this.id());
    readonly isViewMode = computed(() => !this.isEditable && !!this.id());
    readonly isNewMode = computed(() => !this.id());

    readonly form = new FormGroup({
        
    });
    compareById = (o1: { id: unknown }, o2: { id: unknown }): boolean => o1?.id === o2?.id;

    private readonly formEffect = effect(() => {
        const id = this.id();
        const data = this.data();
        if (id && !data) { this.svc.getUserByName({ username: Number(id) }).subscribe(data => this.data.set(data)); }
        else if (data) { this.form.patchValue(data);  }
        else if (!id) { this.form.reset(); }
        if (this.isViewMode()) { this.form.disable(); }
    });
    constructor() {}
    onSubmit(): void {
        this.form.markAllAsTouched(); if (this.form.invalid) { this.snackBar.open('Please correct the errors on the form.', 'Dismiss', { duration: 3000 }); return; }
        const formValue = this.form.getRawValue() as ;
        const action$ = this.isEditMode() ? this.svc.updateUser({ username: Number(this.id()), body: formValue }) : this.svc.createUsersWithListInput({ body: formValue });
        action$?.subscribe({
            next: () => { this.snackBar.open('User saved successfully.', 'Dismiss', { duration: 3000 }); this.router.navigate(['..'], { relativeTo: this.route }); },
            error: (err) => { console.error('Error saving user:', err); this.snackBar.open('Error: user could not be saved.', 'Dismiss', { duration: 5000 }); }
        });
    }
    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }
    
}
