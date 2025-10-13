/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { startWith } from 'rxjs/operators';
import { FormControl, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PetService } from '../../../services';
import { Pet, Tag } from '../../../models';

export interface PetCategory {
    id?: number;
    name?: string;
}

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatChipsModule, MatRadioModule, MatInputModule, MatButtonModule, MatIconModule ],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly svc = inject(PetService);
    private readonly snackBar = inject(MatSnackBar);
    

    readonly data = signal<Pet | null>(null);
    readonly isEditable = true;

    readonly id = input<string | number>();
    readonly isEditMode = computed(() => this.isEditable && !!this.id());
    readonly isViewMode = computed(() => !this.isEditable && !!this.id());
    readonly isNewMode = computed(() => !this.id());

    readonly form = new FormGroup({
        'id': new FormControl<Pet['id'] | null>(null),
    'category': new FormGroup({
    'id': new FormControl<PetCategory['id'] | null>(null),
    'name': new FormControl<PetCategory['name'] | null>(null)
}),
    'name': new FormControl<Pet['name']>('', { validators: [Validators.required], nonNullable: true }),
    'photoUrls': new FormArray([], { validators: [Validators.required] }),
    'tags': new FormArray([]),
    'status': new FormControl<Pet['status'] | null>(null)
    });
    compareById = (o1: { id: unknown }, o2: { id: unknown }): boolean => o1?.id === o2?.id;

    private readonly formEffect = effect(() => {
        const id = this.id();
        const data = this.data();
        if (id && !data) { this.svc.getPetById({ petId: Number(id) }).subscribe(data => this.data.set(data)); }
        else if (data) { this.form.patchValue(data); if (data.tags && Array.isArray(data.tags)) {
            this.tags.clear();
            data.tags.forEach((item: Tag) => {
                const formGroup = this.createTag();
                formGroup.patchValue(item);
                this.tags.push(formGroup);
            });
        } }
        else if (!id) { this.form.reset(); }
        if (this.isViewMode()) { this.form.disable(); }
    });
    constructor() {}
    onSubmit(): void {
        this.form.markAllAsTouched(); if (this.form.invalid) { this.snackBar.open('Please correct the errors on the form.', 'Dismiss', { duration: 3000 }); return; }
        const formValue = this.form.getRawValue() as Pet;
        const action$ = this.isEditMode() ? null : this.svc.addPet({ body: formValue });
        action$?.subscribe({
            next: () => { this.snackBar.open('Pet saved successfully.', 'Dismiss', { duration: 3000 }); this.router.navigate(['..'], { relativeTo: this.route }); },
            error: (err) => { console.error('Error saving pet:', err); this.snackBar.open('Error: pet could not be saved.', 'Dismiss', { duration: 5000 }); }
        });
    }
    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }
    onAction(actionName: string): void {
        const id = this.id(); if (!id) return;
        switch(actionName) {
            case 'uploadFile':
                this.svc.uploadFile({ petId: Number(id) }).subscribe(() => this.snackBar.open('Uploads An Image completed.', 'Dismiss', { duration: 3000 }));
                break;
case 'updatePetWithForm':
                this.svc.updatePetWithForm({ petId: Number(id) }).subscribe(() => this.snackBar.open('Updates A Pet In The Store With Form Data completed.', 'Dismiss', { duration: 3000 }));
                break;
        }
    }

    
    readonly photoUrlsSignal = (this.form.get('photoUrls') as FormArray<FormControl<string>>).valueChanges.pipe(startWith((this.form.get('photoUrls') as FormArray<FormControl<string>>).value));
    addPhotoUrls(event: MatChipInputEvent): void { const value = (event.value || '').trim(); if (value) { const current = (this.form.get('photoUrls') as FormArray).value; (this.form.get('photoUrls') as FormArray).setValue([...new Set([...(current || []), value])]); } event.chipInput!.clear(); }
    removePhotoUrls(item: string): void { const current = (this.form.get('photoUrls') as FormArray).value; (this.form.get('photoUrls') as FormArray).setValue(current.filter((i: string) => i !== item)); }

    get tags(): FormArray { return this.form.get('tags') as FormArray; }
createTag(): FormGroup { return new FormGroup({ 'id': new FormControl<Tag['id'] | null>(null),
    'name': new FormControl<Tag['name'] | null>(null) }); }
addTag(): void { this.tags.push(this.createTag()); }
removeTag(index: number): void { this.tags.removeAt(index); }
}
