import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PetService } from "./../../../services";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatChipsModule } from "@angular/material/chips";
import { MatRadioModule } from "@angular/material/radio";
import { Pet, Tag } from "../../../models";

export interface PetCategory {
  id?: number;
  name?: string;
}

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatRadioModule],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly svc: PetService = inject(PetService);
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
  private readonly formEffect = effect(() => {
    const id = this.id();
    const data = this.data();
    if (id && !data) {
      this.svc.getPetById(id as number).subscribe(d => this.data.set(d));
    } else if (data && this.form) {
      this.form.patchValue(data as any);
      if (data.tags && Array.isArray(data.tags)) {
        this.tags.clear();
        data.tags.forEach(item => {
          const fg = this.createTag();
          fg.patchValue(item as any);
          this.tags.push(fg);
        });
      }
    } else if (!id && this.form) {
      this.form.reset();
    }
    if (this.isViewMode() && this.form) {
      this.form.disable();
    }
  });

  onSubmit() {
    if (this.form.invalid) {
      this.snackBar.open('Please correct the errors.', 'Dismiss', { duration: 3000 });
      return;
    }
    const formValue = this.form.getRawValue() as Pet;
    const action$ = this.isEditMode() ? null : this.svc.addPet();
    action$?.subscribe({
      next: () => {
        this.snackBar.open('Pet saved.', 'OK', { duration: 3000 });
        this.router.navigate(['..'], { relativeTo: this.route });
      }, error: (err) => {
        this.snackBar.open('Save failed.', 'OK', { duration: 5000 });
        console.error(err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onAction(actionName: string) {
    const id = this.id();
    if (!id) return;
    switch (actionName) {
      case 'uploadFile':
        this.svc.uploadFile(id as number, undefined, undefined).subscribe(() => this.snackBar.open('Uploads An Image completed.', 'OK', { duration: 3000 }));
        break;
      case 'updatePetWithForm':
        this.svc.updatePetWithForm(id as number, undefined, undefined).subscribe(() => this.snackBar.open('Updates A Pet In The Store With Form Data completed.', 'OK', { duration: 3000 }));
        break;
    }
  }

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  createTag(): FormGroup {
    return new FormGroup({
      'id': new FormControl<Tag['id'] | null>(null),
      'name': new FormControl<Tag['name'] | null>(null)
    });
  }

  addTag() {
    this.tags.push(this.createTag());
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }
}
