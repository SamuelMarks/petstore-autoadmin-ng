/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { StoreService } from '../../../services';
import { Store } from '../../../models';



@Component({
    selector: 'app-store-form',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './store-form.component.html',
    styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly svc = inject(StoreService);



    readonly data = signal<Store | null>(null);
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
        if (id && !data) { this.svc.getOrderById(id as number).subscribe(data => this.data.set(data)); }
        else if (data) { this.form.patchValue(data); }
        else if (!id) { this.form.reset(); }
        if (this.isViewMode()) { this.form.disable(); }
    });
    constructor() { }

    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }

}
