import { Component, OnInit, OnDestroy, computed, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models';

export interface UserForm {
    id: FormControl<number | null>;
    username: FormControl<string | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    phone: FormControl<string | null>;
    userStatus: FormControl<number | null>;
}

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, ...commonStandaloneImports.map(a => a[0])],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
    /** Injects Angular's FormBuilder service. */
    readonly fb = inject(FormBuilder);
    /** Provides access to information about a route associated with a component. */
    readonly route = inject(ActivatedRoute);
    /** Provides navigation and URL manipulation capabilities. */
    readonly router = inject(Router);
    /** Service to dispatch Material Design snack bar messages. */
    readonly snackBar = inject(MatSnackBar);
    /** The generated service for the 'user' resource. */
    readonly userService: UserService = inject(UserService);
    /** The main reactive form group for this component. */
    form!: FormGroup<UserForm>;
    /** Holds the ID of the resource being edited, or null for creation. */
    id = signal<string | null>(null);
    /** A computed signal that is true if the form is in edit mode. */
    isEditMode = computed(() => !!this.id());
    /** A computed signal for the form's title. */
    formTitle = computed(() => this.isEditMode() ? 'Edit User' : 'Create User');
    /** A collection of subscriptions to be unsubscribed on component destruction. */
    subscriptions: Subscription[] = [];

    ngOnInit() {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.id.set(id);
            const sub = this.userService.getUserByName(id).subscribe(entity => {
                this.form.patchValue(entity as any);
            });
            this.subscriptions.push(sub);
        }
    }

    private initForm() {
        this.form = new FormGroup<UserForm>({
            'id': new FormControl<number | null>(null),
            'username': new FormControl<string | null>(null),
            'firstName': new FormControl<string | null>(null),
            'lastName': new FormControl<string | null>(null),
            'email': new FormControl<string | null>(null),
            'password': new FormControl<string | null>(null),
            'phone': new FormControl<string | null>(null),
            'userStatus': new FormControl<number | null>(null)
        });
    }

    onSubmit() {
        if (!this.form.valid) { return; }
        const finalPayload = this.form.getRawValue();
        const action$ = this.isEditMode()
            ? this.userService.updateUser(this.id()!, finalPayload)
            : this.userService.createUsersWithListInput(finalPayload);
        const sub = action$.subscribe({
            next: () => {
                this.snackBar.open('User saved successfully!', 'Close', { duration: 3000 });
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: (err) => {
                console.error('Error saving User', err);
                this.snackBar.open('Error saving User', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
            }
        });
        this.subscriptions.push(sub);
    }

    onCancel() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
