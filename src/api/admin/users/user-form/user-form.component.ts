import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "./../../../services";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { User } from "../../../models";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly svc: UserService = inject(UserService);
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
  private readonly formEffect = effect(() => {
    const id = this.id();
    const data = this.data();
    if (id && !data) {
      this.svc.getUserByName(id as string).subscribe(d => this.data.set(d));
    } else if (data && this.form) {
      this.form.patchValue(data as any);
    } else if (!id && this.form) {
      this.form.reset();
    }
    if (this.isViewMode() && this.form) {
      this.form.disable();
    }
  });

  onSubmit() {
    if (this.form.invalid) {
      this.snackBar.open('Please correct the errors.', 'Dismiss', { duration: 3000 });
      return;
    }
    const formValue = this.form.getRawValue() as User;
    const action$ = this.isEditMode() ? this.svc.updateUser(this.id() as string, formValue) : this.svc.createUser(formValue);
    action$?.subscribe({
      next: () => {
        this.snackBar.open('User saved.', 'OK', { duration: 3000 });
        this.router.navigate(['..'], { relativeTo: this.route });
      }, error: (err) => {
        this.snackBar.open('Save failed.', 'OK', { duration: 5000 });
        console.error(err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
