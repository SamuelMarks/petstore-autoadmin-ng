import { Component, inject, input, computed, effect } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import * as models from "../../../models";
import { PetService } from "../../../services";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatRadioModule } from "@angular/material/radio";

@Component({
                selector: 'app-pet-form',
                standalone: true,
                imports: [CommonModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, ReactiveFormsModule, RouterModule],
                templateUrl: './pet-form.component.html',
                styleUrls: ['./pet-form.component.scss']
            })
export class PetFormComponent {
    form!: FormGroup;
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly petService = inject(PetService);
    id = input<string | null>(null);
    isEditMode = computed(() => !!this.id());
    formTitle = computed(() => this.isEditMode() ? 'Edit Pet' : 'Create Pet');
    readonly StatusOptions = ["available","pending","sold"];

    constructor() {

                        this.initForm();
                        effect((onCleanup) => {
                            const id = this.id();
                            // When the id changes, we are in a new state. Reset the form.
                            this.form.reset();

                            if (this.isEditMode() && id) {
                                const sub = this.petService.getPetById(id).subscribe((entity: any) => {
                                   if (entity) this.patchForm(entity as models.Pet);
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
        category: this.fb.group({ id: this.fb.control(null),
        name: this.fb.control(null) }),
        name: this.fb.control(null, [Validators.required]),
        photoUrls: this.fb.control(null, [Validators.required]),
        tags: this.fb.array([]),
        status: this.fb.control(null) });
    }

    get tagsArray(): FormArray {
        return this.form.get('tags') as FormArray;
    }

    createTagsArrayItem(item?: any): FormGroup {
        return this.fb.group({ id: this.fb.control(null),
        name: this.fb.control(null) });
    }

    addTagsArrayItem() {
        this.tagsArray.push(this.createTagsArrayItem());
    }

    removeTagsArrayItem(index: number) {
        this.tagsArray.removeAt(index);
    }

    patchForm(entity: models.Pet) {

                const { tags, ...rest } = entity;
                this.form.patchValue(rest);
                
                    if (entity.tags && Array.isArray(entity.tags)) {
                        this.tagsArray.clear();
                        entity.tags.forEach((item: any) => {
                            const itemGroup = this.createTagsArrayItem(item);
                            itemGroup.patchValue(item);
                            this.tagsArray.push(itemGroup);
                        });
                    }
            
    }

    onSubmit() {

        if (this.form.invalid) { return; }
        const finalPayload = this.form.value;
        const action$ = this.isEditMode()
          ? this.petService.updatePet(this.id()!, finalPayload)
          : this.petService.createPet(finalPayload);
        action$.subscribe(() => this.onCancel());
            
    }

    onCancel() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
