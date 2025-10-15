/* eslint-disable */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, of, startWith, switchMap, catchError, map, debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { StoreService } from '../../../services';
import { Store } from '../../../models';

@Component({
    selector: 'app-stores-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
    templateUrl: './stores-list.component.html',
    styleUrls: ['./stores-list.component.css']
})
export class StoreListComponent {
    private readonly svc = inject(StoreService);
    private readonly snackBar = inject(MatSnackBar);
    readonly data = signal<Store[]>([]);
    readonly displayedColumns: string[] = [, 'actions'];
    readonly totalItems = signal(0);
    readonly isLoading = signal(true);






    constructor() {
        this.isLoading.set(false); // No data to load
    }







    delete(id: number | string): void {
        if (confirm('Are you sure?')) {
            this.svc.deleteOrder(id as number).subscribe(() => { // << THIS IS THE FIX
                // Refresh data after delete
                this.loadData().subscribe(data => this.data.set(data));
                this.snackBar.open('Store deleted.', 'OK', { duration: 3000 });
            });
        }
    }



    readonly collectionActions = JSON.parse('[{"label":"Place an order for a pet","methodName":"placeOrder","level":"collection","idParamName":"id","idParamType":"string","parameters":[{"name":"body","in":"body","required":true,"schema":{"$ref":"#/definitions/Order"},"description":"order placed for purchasing the pet"}]}]');
    executeCollectionAction(action: any): void {
        if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
        switch (action.methodName) {
            case 'placeOrder': this.svc.placeOrder({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); if (this['loadData']) this['loadData']().subscribe((data: any) => this.data.set(data)); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            default: console.error('Unknown collection action:', action.methodName);
        }
    }
}
