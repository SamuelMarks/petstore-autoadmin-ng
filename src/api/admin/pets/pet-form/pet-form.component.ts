/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PetService } from '../../../../services';
import { Pet } from '../../../../models';

@Component({
    selector: 'app-pet-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatChipsModule, MatIconModule, MatButtonModule, MatRadioModule, MatSnackBarModule],
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
            'id': new FormControl<Pet['category']['id'] | null>(null),
            'name': new FormControl<Pet['category']['name'] | null>(null)
        }),
        'name': new FormControl<Pet['name']>("", { validators: [Validators.required], nonNullable: true }),
        'photoUrls': new FormControl<Pet['photoUrls']>([], { validators: [Validators.required], nonNullable: true }),
        'tags': new FormArray([]),
        'status': new FormControl<Pet['status'] | null>(null)
    });
    compareById = (o1: any, o2: any): boolean => o1?.id === o2?.id;


    constructor() {


        effect(() => {
            const currentId = this.id();
            if ((this.isEditMode() || this.isViewMode()) && currentId) {
                this.svc.getPetById({ petId: currentId } as any).subscribe(data => {
                    if (this.isEditable) {

                        this.tags.clear();
                        (data as any).tags?.forEach((item: any) => {
                            const formGroup = this.createTag();
                            formGroup.patchValue(item as any);
                            this.tags.push(formGroup);
                        });
                        delete (data as any).tags;
                        this.form.patchValue(data as any);
                    } else {
                        this.data.set(data as any);
                    }
                });
            }
        });
    }


    onSubmit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) {
            this.snackBar.open('Please correct the errors on the form.', 'Dismiss', { duration: 3000 });
            return;
        }
        const formValue = this.form.getRawValue() as Pet;
        const action$ = this.svc.addPet({ body: formValue } as any);

        action$.subscribe({
            next: () => {
                this.snackBar.open('Pet saved successfully.', 'Dismiss', { duration: 3000 });
                this.router.navigate(['..'], { relativeTo: this.route });
            },
            error: (err) => {
                console.error('Error saving pet:', err);
                this.snackBar.open('Error: Pet could not be saved.', 'Dismiss', { duration: 5000 });
            }
        });
    }

    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }


    readonly itemActions = JSON.parse('[{"label":"Updates A Pet In The Store With Form Data","methodName":"updatePetWithForm","level":"item","path":"/pet/{petId}","method":"POST"}]');
    executeItemAction(action: any): void {
        if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
        switch (action.methodName) {
            case 'updatePetWithForm': this.svc.updatePetWithForm({ petId: this.id() } as any).subscribe({ next: () => this.snackBar.open('Action successful.', 'OK', { duration: 3000 }), error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            default: console.error('Unknown item action:', action.methodName);
        }
    }

    get tags(): FormArray { return this.form.get('tags') as FormArray; }
    createTag(): FormGroup {
        return new FormGroup({
            'id': new FormControl<Pet['tags'][0]['id'] | null>(null),
            'name': new FormControl<Pet['tags'][0]['name'] | null>(null)
        });
    }
    addTag(): void { this.tags.push(this.createTag()); }
    removeTag(index: number): void { this.tags.removeAt(index); }
    readonly photoUrlsSignal = (this.form.get('photoUrls')! as any).valueChanges.pipe(startWith(this.form.get('photoUrls')!.value || []));
    addPhotoUrls(event: MatChipInputEvent): void { const value = (event.value || '').trim(); if (value) { const current = this.form.get('photoUrls')!.value; this.form.get('photoUrls')!.setValue([...new Set([...(current || []), value])]); } event.chipInput!.clear(); }
    removePhotoUrls(item: string): void { const current = this.form.get('photoUrls')!.value; this.form.get('photoUrls')!.setValue(current.filter((i: string) => i !== item)); }
}
