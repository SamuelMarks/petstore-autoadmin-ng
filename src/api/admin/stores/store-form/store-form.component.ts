/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreService } from '../../../../services';
import { Order } from '../../../../models';

@Component({
    selector: 'app-store-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatRadioModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatSnackBarModule],
    templateUrl: './store-form.component.html',
    styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly svc = inject(StoreService);
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
    compareById = (o1: any, o2: any): boolean => o1?.id === o2?.id;


    constructor() {


        effect(() => {
            const currentId = this.id();
            if ((this.isEditMode() || this.isViewMode()) && currentId) {
                this.svc.getOrderById({ orderId: currentId } as any).subscribe(data => {
                    if (this.isEditable) {

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
        const formValue = this.form.getRawValue() as Order;
        const action$ = this.svc.placeOrder({ body: formValue } as any);

        action$.subscribe({
            next: () => {
                this.snackBar.open('Store saved successfully.', 'Dismiss', { duration: 3000 });
                this.router.navigate(['..'], { relativeTo: this.route });
            },
            error: (err) => {
                console.error('Error saving store:', err);
                this.snackBar.open('Error: Store could not be saved.', 'Dismiss', { duration: 5000 });
            }
        });
    }

    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }




}
