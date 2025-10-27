import { Component, computed, effect, inject, input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as models from "../../../models";
import { UserService } from "../../../services";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: ['@angular/material/common', '@angular/material/button', '@angular/material/formfield', '@angular/material/icon', '@angular/material/input', '@angular/material/reactiveforms', '@angular/material/router'],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  form!: FormGroup;
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  id = input<string | null>(null, { alias: "id" });
  isEditMode = computed(() => !!this.id());
  formTitle = computed(() => this.isEditMode() ? 'Edit User' : 'Create User');

  constructor() {

    this.initForm();
    effect(() => {
      this.form.reset(); // Reset form when id changes to clear old data
      const id = this.id();
      if (this.isEditMode() && id) {
        this.userService.getUserById(id).subscribe((entity: any) => {
          if (entity) this.patchForm(entity as models.User);
        });
      }
    });

  }

  private initForm() {
    this.form = new FormGroup({
      id: new FormControl(null),
      username: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
      phone: new FormControl(null),
      userStatus: new FormControl(null)
    });
  }

  patchForm(entity: models.User) {

    this.form.patchValue(entity);


  }

  onSubmit() {

    if (this.form.invalid) {
      return;
    }
    const finalPayload = this.form.value;
    const action$ = this.isEditMode()
      ? this.userService.updateUser(this.id()!, finalPayload)
      : this.userService.createUser(finalPayload);
    action$.subscribe(() => this.onCancel());

  }

  onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
