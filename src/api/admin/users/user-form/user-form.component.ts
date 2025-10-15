/* eslint-disable */
import { Component, inject, computed, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../../services';
import { User } from '../../../models';



@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatButtonModule, MatIconModule],
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly svc = inject(UserService);
    private readonly snackBar = inject(MatSnackBar);


    readonly data = signal<User | null>(null);
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
        if (id && !data) { this.svc.getUserByName(id as string).subscribe(data => this.data.set(data)); }
        else if (data) { this.form.patchValue(data); }
        else if (!id) { this.form.reset(); }
        if (this.isViewMode()) { this.form.disable(); }
    });
    constructor() { }

    onCancel(): void { this.router.navigate(['..'], { relativeTo: this.route }); }
    onAction(actionName: string): void {
        const id = this.id(); if (!id) return;
        switch (actionName) {
            case 'updateUser':
                this.svc.updateUser(id, undefined).subscribe(() => this.snackBar.open('Updated User completed.', 'Dismiss', { duration: 3000 }));
                break;
        }
    }
}
