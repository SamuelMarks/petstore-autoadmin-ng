/* eslint-disable */
import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


/* Material imports would be dynamically added here */
import { UserService } from '../../../../services';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, /* Mat modules... */],
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

  readonly form = new FormGroup({});
  compareById = (o1: any, o2: any): boolean => o1?.id === o2?.id;

  effect(

() => {
  const
  id = this.id();
  const
  data = this.data();

  if(id

&& !
  data
) {
  this
.
  svc
.

  getUserByName({ username: id }

  as
  any
).

  subscribe(data

=>
  this
.
  data
.

  set(data)

);
}

else
if (data) {
  this.form.patchValue(data as any);
} else if (!id) {
  this.form.reset();
}
if (this.isViewMode()) {
  this.form.disable();
}
})
;
constructor()
{
}
onSubmit()
:
void {
  this.form.markAllAsTouched(); if(this.form.invalid
)
{
  this.snackBar.open('Please correct the errors on the form.', 'Dismiss', { duration: 3000 });
  return;
}
const formValue = this.form.getRawValue() as;
const action$ = this.isEditMode() ? this.svc.updateUser({
  username: this.id(),
  body: formValue
} as any) : this.svc.createUsersWithListInput({ body: formValue } as any);
action$?.subscribe({
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
onCancel()
:
void { this.router.navigate(['..'], { relativeTo: this.route }); }


}
