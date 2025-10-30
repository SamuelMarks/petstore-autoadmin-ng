import { Component, inject, input, computed, effect } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import * as models from "../../../models";
import { UserService } from "../../../services";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";

@Component({
                selector: 'app-user-form',
                standalone: true,
                imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, RouterModule],
                templateUrl: './user-form.component.html',
                styleUrls: ['./user-form.component.scss']
            })
export class UserFormComponent {
    form!: FormGroup;
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly userService = inject(UserService);
    id = input<string | null>(null);
    isEditMode = computed(() => !!this.id());
    formTitle = computed(() => this.isEditMode() ? 'Edit User' : 'Create User');

    constructor() {

                        this.initForm();
                        effect((onCleanup) => {
                            const id = this.id();
                            // When the id changes, we are in a new state. Reset the form.
                            this.form.reset();

                            if (this.isEditMode() && id) {
                                const sub = this.userService.getUserById(id).subscribe((entity: any) => {
                                   if (entity) this.patchForm(entity as models.User);
                                });
                                onCleanup(() => sub.unsubscribe());
                            }

                            // For polymorphic forms, set up a subscription to the discriminator field
                            if (false) {
                                 const discriminatorCtrl = this.form.get('undefined');
                                 if (discriminatorCtrl) {
                                     const sub = discriminatorCtrl.valueChanges.subscribe(type => {
                                         this.updateFormForPetType(type);
                                     });
                                     onCleanup(() => sub.unsubscribe());
                                 }
                            }
                        });
                    
    }

    private initForm() {
        this.form = this.fb.group({ id: this.fb.control(null),
        username: this.fb.control(null),
        firstName: this.fb.control(null),
        lastName: this.fb.control(null),
        email: this.fb.control(null),
        password: this.fb.control(null),
        phone: this.fb.control(null),
        userStatus: this.fb.control(null) });
    }

    patchForm(entity: models.User) {

                const { , ...rest } = entity;
                this.form.patchValue(rest);
                
            
    }

    onSubmit() {

        if (this.form.invalid) { return; }
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
