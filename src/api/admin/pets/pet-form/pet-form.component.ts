/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PetService } from '../../../services';
import { Pet, Tag } from '../../../models';
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { startWith } from "rxjs";

export interface PetCategory {
    id?: number;
    name?: string;
}

@Component({
    selector: 'app-pet-form',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatRadioModule, MatButtonModule, MatIconModule],
    templateUrl: './pet-form.component.html',
    styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly svc = inject(PetService);
    private readonly snackBar = inject(MatSnackBar);


    readonly data = signal<Pet | null>(null);
    readonly isEditable = false;

    readonly id = input<string | number>();
    readonly isEditMode = computed(() => this.isEditable && !!this.id());
    readonly isViewMode = computed(() => !this.isEditable && !!this.id());
    readonly isNewMode = computed(() => !this.id());

    readonly form = null as any;
    compareById = (o1: { id: unknown }, o2: { id: unknown }): boolean => o1?.id === o2?.id;

    private readonly formEffect = effect(() => {
        const id = this.id();
        const data = this.data();
        if (id && !data) { this.svc.getPetById(id as number).subscribe(data => this.data.set(data)); }
        else if (data) {
            this.form.patchValue(data); if (data.tags && Array.isArray(data.tags)) {
                this.tags.clear();
                data.tags.forEach((item: Tag) => {
                    const formGroup = this.createTag();
                    formGroup.patchValue(item);
                    this.tags.push(formGroup);
                });
            }
        }
        else if (!id) { this.form.reset(); }
        if (this.isViewMode()) { this.form.disable(); }
    });
    constructor() { }

    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }
    onAction(actionName: string): void {
        const id = this.id(); if (!id) return;
        switch (actionName) {
            case 'uploadFile':
                this.svc.uploadFile(id as number, undefined, undefined).subscribe(() => this.snackBar.open('Uploads An Image completed.', 'Dismiss', { duration: 3000 }));
                break;
            case 'updatePetWithForm':
                this.svc.updatePetWithForm(id as number, undefined, undefined).subscribe(() => this.snackBar.open('Updates A Pet In The Store With Form Data completed.', 'Dismiss', { duration: 3000 }));
                break;
        }
    }


    readonly photoUrlsSignal = (this.form.get('photoUrls') as FormArray<FormControl<string>>).valueChanges.pipe(startWith((this.form.get('photoUrls') as FormArray<FormControl<string>>).value));
    addPhotoUrls(event: MatChipInputEvent): void { const value = (event.value || '').trim(); if (value) { const current = (this.form.get('photoUrls') as FormArray).value; (this.form.get('photoUrls') as FormArray).setValue([...new Set([...(current || []), value])]); } event.chipInput!.clear(); }
    removePhotoUrls(item: string): void { const current = (this.form.get('photoUrls') as FormArray).value; (this.form.get('photoUrls') as FormArray).setValue(current.filter((i: string) => i !== item)); }

    get tags(): FormArray { return this.form.get('tags') as FormArray; }
    createTag(): FormGroup {
        return new FormGroup({
            'id': new FormControl<Tag['id'] | null>(null),
            'name': new FormControl<Tag['name'] | null>(null)
        });
    }
    addTag(): void { this.tags.push(this.createTag()); }
    removeTag(index: number): void { this.tags.removeAt(index); }
}
