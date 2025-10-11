/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../../services';
import { User } from '../../../../models';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly svc = inject(UserService);
    private readonly snackBar = inject(MatSnackBar);


    readonly data = signal<User | null>(null);
    readonly isEditable = true;


    readonly id = input<string | number>();
    readonly isEditMode = computed(() => this.isEditable && !!this.id());
    readonly isViewMode = computed(() => !this.isEditable && !!this.id());
    readonly isNewMode = computed(() => !this.id());

    readonly form = new FormGroup({
        'id': new FormControl<User['id'] | null>(null),
        'username': new FormControl<User['username'] | null>(null),
        'firstName': new FormControl<User['firstName'] | null>(null),
        'lastName': new FormControl<User['lastName'] | null>(null),
        'email': new FormControl<User['email'] | null>(null),
        'password': new FormControl<User['password'] | null>(null),
        'phone': new FormControl<User['phone'] | null>(null),
        'userStatus': new FormControl<User['userStatus'] | null>(null)
    });
    compareById = (o1: any, o2: any): boolean => o1?.id === o2?.id;


    constructor() {


        effect(() => {
            const currentId = this.id();
            if ((this.isEditMode() || this.isViewMode()) && currentId) {
                this.svc.getUserByName({ username: currentId } as any).subscribe(data => {
                    if (this.isEditable) {

                        this.form.patchValue(data as any);
                    } else {
                        this.data.set(data as any);
                    }
                });
            }
        });
    }


    onSubmit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) {
            this.snackBar.open('Please correct the errors on the form.', 'Dismiss', { duration: 3000 });
            return;
        }
        const formValue = this.form.getRawValue() as User;
        const action$ = this.isEditMode()
            ? this.svc.updateUser({ body: formValue, username: this.id() } as any)
            : this.svc.createUser({ body: formValue } as any);

        action$.subscribe({
            next: () => {
                this.snackBar.open('User saved successfully.', 'Dismiss', { duration: 3000 });
                this.router.navigate(['..'], { relativeTo: this.route });
            },
            error: (err) => {
                console.error('Error saving user:', err);
                this.snackBar.open('Error: User could not be saved.', 'Dismiss', { duration: 5000 });
            }
        });
    }

    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }




}
