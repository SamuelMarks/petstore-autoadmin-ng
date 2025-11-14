import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from 'rxjs';
import { StoreService } from '../../../services/store.service';

export interface OrderForm {
  id: FormControl<number | null>;
  petId: FormControl<number | null>;
  quantity: FormControl<number | null>;
  shipDate: FormControl<Date | null>;
  status: FormControl<'placed' | 'approved' | 'delivered' | null>;
  complete: FormControl<boolean | null>;
}

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ...commonStandaloneImports.map(a => a[0])],
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.scss'
})
export class OrderFormComponent implements OnInit, OnDestroy {
  /** Injects Angular's FormBuilder service. */
  readonly fb = inject(FormBuilder);
  /** Provides access to information about a route associated with a component. */
  readonly route = inject(ActivatedRoute);
  /** Provides navigation and URL manipulation capabilities. */
  readonly router = inject(Router);
  /** Service to dispatch Material Design snack bar messages. */
  readonly snackBar = inject(MatSnackBar);
  /** The generated service for the 'store' resource. */
  readonly storeService: StoreService = inject(StoreService);
  /** The main reactive form group for this component. */
  form!: FormGroup<OrderForm>;
  /** Holds the ID of the resource being edited, or null for creation. */
  id = signal<string | null>(null);
  /** A computed signal that is true if the form is in edit mode. */
  isEditMode = computed(() => !!this.id());
  /** A computed signal for the form's title. */
  formTitle = computed(() => this.isEditMode() ? 'Edit Order' : 'Create Order');
  /** A collection of subscriptions to be unsubscribed on component destruction. */
  subscriptions: Subscription[] = [];
  readonly StatusOptions = ["placed", "approved", "delivered"];

  ngOnInit() {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      const sub = this.storeService.getOrderById(id).subscribe(entity => {
        this.form.patchValue(entity as any);
      });
      this.subscriptions.push(sub);
    }
  }

  private initForm() {
    this.form = new FormGroup<OrderForm>({
      'id': new FormControl<number | null>(null),
      'petId': new FormControl<number | null>(null),
      'quantity': new FormControl<number | null>(null),
      'shipDate': new FormControl<Date | null>(null),
      'status': new FormControl<'placed' | 'approved' | 'delivered' | null>(null),
      'complete': new FormControl<boolean | null>(null)
    });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
