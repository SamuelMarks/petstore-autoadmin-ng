/* eslint-disable */
import { Component, computed, inject, input, signal, startWith } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';

/* Material imports would be dynamically added here */
import { PetService } from '../../../../services';
import { Pet } from '../../../../models';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, /* Mat modules... */],
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
    'name': new FormControl<Pet['name']>('', { validators: [Validators.required], nonNullable: true }),
    'photoUrls': new FormArray([], { validators: [Validators.required] }),
    'tags': new FormArray([]),
    'status': new FormControl<Pet['status'] | null>(null)
  });
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

  getPetById({ petId: id }

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
  if (data.tags && Array.isArray(data.tags)) {
    this.tags.clear();
    data.tags.forEach((item: any) => {
      const formGroup = this.createTag();
      formGroup.patchValue(item);
      this.tags.push(formGroup);
    });
  }
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
const formValue = this.form.getRawValue() as Pet;
const action$ = this.isEditMode() ? null : this.svc.addPet({ body: formValue } as any);
action$?.subscribe({
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
onCancel()
:
void { this.router.navigate(['..'], { relativeTo: this.route }); }

readonly
photoUrlsSignal = (this.form.get('photoUrls')! as any).valueChanges.pipe(startWith(this.form.get('photoUrls')!.value || []));
addPhoto
Urls(event
:
MatChipInputEvent
):
void {
  const value = (event.value || '').trim(); if(value) {
    const current = this.form.get('photoUrls')!.value;
    this.form.get('photoUrls')!.setValue([...new Set([...(current || []), value])]);
  } event.chipInput!.clear();
}
removePhoto
Urls(item
:
string
):
void {
  const current = this.form.get('photoUrls')!.value;
  this
  .form.get('photoUrls')!.setValue(current.filter((i: string) => i !== item));
}
get
tags()
:
FormArray
{
  return this.form.get('tags') as FormArray;
}
createTag()
:
FormGroup
{
  return new FormGroup({
    'id': new FormControl<any>(null),
    'name': new FormControl<any>(null)
  });
}
addTag()
:
void { this.tags.push(this.createTag()); }
removeTag(index
:
number
):
void { this.tags.removeAt(index); }

onAction(actionName
:
string
):
void {
  const id = this.id(); if(!
id
)
return;
switch (actionName) {
  case 'uploadFile':
    this.svc.uploadFile({ petId: id } as any).subscribe(() => this.snackBar.open('Uploads An Image completed.', 'Dismiss', { duration: 3000 }));
    break;
  case 'updatePetWithForm':
    this.svc.updatePetWithForm({ petId: id } as any).subscribe(() => this.snackBar.open('Updates A Pet In The Store With Form Data completed.', 'Dismiss', { duration: 3000 }));
    break;
}
}
}
