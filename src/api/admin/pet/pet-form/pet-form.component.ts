import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from 'rxjs';
import { PetService } from '../../../services/pet.service';

export interface PetForm {
  additionalMetadata: FormControl<string | null>;
  file: FormControl<any | null>;
  code: FormControl<number | null>;
  type: FormControl<string | null>;
  message: FormControl<string | null>;
  id: FormControl<number | null>;
  category: FormGroup<CategoryForm>;
  name: FormControl<string | null>;
  photoUrls: FormArray<FormControl<string | null>>;
  tags: FormArray<FormControl<Tag | null>>;
  status: FormControl<string | null>;
}

interface CategoryForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
}

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ...commonStandaloneImports.map(a => a[0])],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent implements OnInit, OnDestroy {
  /** Injects Angular's FormBuilder service. */
  readonly fb = inject(FormBuilder);
  /** Provides access to information about a route associated with a component. */
  readonly route = inject(ActivatedRoute);
  /** Provides navigation and URL manipulation capabilities. */
  readonly router = inject(Router);
  /** Service to dispatch Material Design snack bar messages. */
  readonly snackBar = inject(MatSnackBar);
  /** The generated service for the 'pet' resource. */
  readonly petService: PetService = inject(PetService);
  /** The main reactive form group for this component. */
  form!: FormGroup<PetForm>;
  /** Holds the ID of the resource being edited, or null for creation. */
  id = signal<string | null>(null);
  /** A computed signal that is true if the form is in edit mode. */
  isEditMode = computed(() => !!this.id());
  /** A computed signal for the form's title. */
  formTitle = computed(() => this.isEditMode() ? 'Edit Pet' : 'Create Pet');
  /** A collection of subscriptions to be unsubscribed on component destruction. */
  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      const sub = this.petService.getPetById(id).subscribe(entity => {
        this.form.patchValue(entity as any);
      });
      this.subscriptions.push(sub);
    }
  }

  private initForm() {
    this.form = new FormGroup<PetForm>({
      'additionalMetadata': new FormControl<string | null>(null),
      'file': new FormControl<any | null>(null),
      'code': new FormControl<number | null>(null),
      'type': new FormControl<string | null>(null),
      'message': new FormControl<string | null>(null),
      'id': new FormControl<number | null>(null),
      'category': this.fb.group({
        'id': new FormControl<number | null>(null),
        'name': new FormControl<string | null>(null)
      }),
      'name': new FormControl<string | null>(null, [Validators.required]),
      'photoUrls': this.fb.array([]),
      'tags': this.fb.array([]),
      'status': new FormControl<string | null>(null)
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const finalPayload = this.form.getRawValue();
    if (this.isEditMode()) {
      console.error('Form is in edit mode, but no update operation is available.');
      return;
    }
    const action$ = this.petService.addPet(finalPayload);
    const sub = action$.subscribe({
      next: () => {
        this.snackBar.open('Pet saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error saving Pet', err);
        this.snackBar.open('Error saving Pet', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    });
    this.subscriptions.push(sub);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
