import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StoreService } from "./../../../services";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Order } from "../../../models";

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatRadioModule, MatCheckboxModule],
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly svc: StoreService = inject(StoreService);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = signal<Order | null>(null);
  readonly isEditable = true;
  readonly id = input<string | number>();
  readonly isEditMode = computed(() => this.isEditable && !!this.id());
  readonly isViewMode = computed(() => !this.isEditable && !!this.id());
  readonly isNewMode = computed(() => !this.id());
  readonly form = new FormGroup({
    'id': new FormControl<Order['id'] | null>(null),
    'petId': new FormControl<Order['petId'] | null>(null),
    'quantity': new FormControl<Order['quantity'] | null>(null),
    'shipDate': new FormControl<Order['shipDate'] | null>(null),
    'status': new FormControl<Order['status'] | null>(null),
    'complete': new FormControl<Order['complete'] | null>(null)
  });
  private readonly formEffect = effect(() => {
    const id = this.id();
    const data = this.data();
    if (id && !data) {
      this.svc.getOrderById(id as number).subscribe(d => this.data.set(d));
    } else if (data && this.form) {
      this.form.patchValue(data as any);
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
    const formValue = this.form.getRawValue() as Order;
    const action$ = this.isEditMode() ? null : this.svc.placeOrder();
    action$?.subscribe({
      next: () => {
        this.snackBar.open('Store saved.', 'OK', { duration: 3000 });
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
}
