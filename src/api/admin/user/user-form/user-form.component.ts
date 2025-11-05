import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
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
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';

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
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatToolbarModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
  readonly fb = inject(FormBuilder);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly snackBar = inject(MatSnackBar);
  readonly userService: UserService = inject(UserService);
  form!: FormGroup<UserForm>;
  id = signal<string | null>(null);
  isEditMode = computed(() => !!this.id());
  formTitle = computed(() => this.isEditMode() ? 'Edit User' : 'Create User');
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
      'id': new FormControl(null),
      'username': new FormControl(null),
      'firstName': new FormControl(null),
      'lastName': new FormControl(null),
      'email': new FormControl(null),
      'password': new FormControl(null),
      'phone': new FormControl(null),
      'userStatus': new FormControl(null)
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const finalPayload = this.form.getRawValue();
    const action$ = this.isEditMode()
      ? this.userService.updateUser(this.id()!, finalPayload)
      : this.userService.createUser(finalPayload);
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
