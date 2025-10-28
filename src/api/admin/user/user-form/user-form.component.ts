import { Component, OnInit, OnDestroy, inject, input, computed, effect } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import * as models from "../../../models";
import { UserService } from "../../../services";

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
    id = input<string | null>(null, { alias: "id" });
    isEditMode = computed(() => !!this.id());
    formTitle = computed(() => this.isEditMode() ? 'Edit User' : 'Create User');

    constructor() {

                        this.initForm();
                        effect(() => {
                            this.form.reset();
                            const id = this.id();
                            if (this.isEditMode() && id) {
                                this.userService.getUserByName(id).subscribe((entity: any) => {
                                   if (entity) this.patchForm(entity as models.User);
                                });
                            }
                        });
                    
    }

    private initForm() {
        this.form = new FormGroup({ id: new FormControl(null),
        username: new FormControl(null),
        firstName: new FormControl(null),
        lastName: new FormControl(null),
        email: new FormControl(null),
        password: new FormControl(null),
        phone: new FormControl(null),
        userStatus: new FormControl(null) });
    }

    patchForm(entity: models.User) {

                this.form.patchValue(entity);
                
            
    }

    onSubmit() {

        if (this.form.invalid) { return; }
        const finalPayload = this.form.value;
        const action$ = this.isEditMode()
          ? this.userService.updateUser(finalPayload, this.id()!)
          : this.userService.createUser(finalPayload);
        action$.subscribe(() => this.onCancel());
    }

    onCancel() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
