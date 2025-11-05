import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Subscription } from 'rxjs';
import { PetService } from '../../../services/pet.service';

export interface PetForm {
  additionalMetadata: FormControl<any | null>;
  file: FormControl<any | null>;
  name: FormControl<string | null>;
  status: FormControl<'available' | 'pending' | 'sold' | null>;
  id: FormControl<number | null>;
  category: FormGroup<CategoryForm>;
  photoUrls: FormArray<FormControl<string | null>>;
  tags: FormArray<FormControl<Tag | null>>;
}

interface CategoryForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
}

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatToolbarModule
  ],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent implements OnInit, OnDestroy {
  readonly fb = inject(FormBuilder);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly snackBar = inject(MatSnackBar);
  readonly petService: PetService = inject(PetService);
  form!: FormGroup<PetForm>;
  id = signal<string | null>(null);
  isEditMode = computed(() => !!this.id());
  formTitle = computed(() => this.isEditMode() ? 'Edit Pet' : 'Create Pet');
  subscriptions: Subscription[] = [];
  readonly StatusOptions = ["available", "pending", "sold"];

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
      'additionalMetadata': new FormControl(null),
      'file': new FormControl(null),
      'name': new FormControl(null, [Validators.required]),
      'status': new FormControl(null),
      'id': new FormControl(null),
      'category': this.fb.group({
        'id': new FormControl(null),
        'name': new FormControl(null)
      }),
      'photoUrls': this.fb.array([]),
      'tags': this.fb.array([])
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
