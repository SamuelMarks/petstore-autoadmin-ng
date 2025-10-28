import { Component, OnInit, OnDestroy, inject, input, computed, effect } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from "@angular/forms";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatRadioModule } from "@angular/material/radio";
import * as models from "../../../models";
import { PetService } from "../../../services";

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
    id = input<string | null>(null, { alias: "id" });
    isEditMode = computed(() => !!this.id());
    formTitle = computed(() => this.isEditMode() ? 'Edit Pet' : 'Create Pet');
    static StatusOptions = ["available","pending","sold"];

    constructor() {

                        this.initForm();
                        effect(() => {
                            this.form.reset();
                            const id = this.id();
                            if (this.isEditMode() && id) {
                                this.petService.getPetById(id).subscribe((entity: any) => {
                                   if (entity) this.patchForm(entity as models.Pet);
                                });
                            }
                        });
                    
    }

    private initForm() {
        this.form = new FormGroup({ id: new FormControl(null),
        category: new FormGroup({ id: new FormControl(null),
        name: new FormControl(null) }),
        name: new FormControl(null, [Validators.required]),
        photoUrls: new FormControl(null, [Validators.required]),
        tags: new FormArray([]),
        status: new FormControl(null) });
    }

    get tagsArray(): FormArray {
        return this.form.get('tags') as FormArray;
    }

    createTagsArrayItem(item?: any): FormGroup {
        return new FormGroup({ id: new FormControl(null),
        name: new FormControl(null) });
    }

    addTagsArrayItem() {
        this.tagsArray.push(this.createTagsArrayItem());
    }

    removeTagsArrayItem(index: number) {
        this.tagsArray.removeAt(index);
    }

    patchForm(entity: models.Pet) {

                this.form.patchValue(entity);
                
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
          ? this.petService.updatePet(this.id()!)
          : this.petService.addPet(finalPayload);
        action$.subscribe(() => this.onCancel());
    }

    onCancel() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
