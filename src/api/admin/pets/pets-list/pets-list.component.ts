/* eslint-disable */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, of, startWith, switchMap, catchError, map, debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PetService } from '../../../services';
import { Pet } from '../../../models';

@Component({
    selector: 'app-pets-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
    templateUrl: './pets-list.component.html',
    styleUrls: ['./pets-list.component.css']
})
export class PetListComponent {
    private readonly svc = inject(PetService);
    private readonly snackBar = inject(MatSnackBar);
    readonly data = signal<Pet[]>([]);
    readonly displayedColumns: string[] = [, 'actions'];
    readonly totalItems = signal(0);
    readonly isLoading = signal(true);






    constructor() {
        this.isLoading.set(false); // No data to load
    }







    delete(id: number | string): void {
        if (confirm('Are you sure?')) {
            this.svc.deletePet(id as number).subscribe(() => { // << THIS IS THE FIX
                // Refresh data after delete
                this.loadData().subscribe(data => this.data.set(data));
                this.snackBar.open('Pet deleted.', 'OK', { duration: 3000 });
            });
        }
    }



    readonly collectionActions = JSON.parse('[{"label":"Add a new pet to the store","methodName":"addPet","level":"collection","idParamName":"id","idParamType":"string","parameters":[{"name":"body","in":"body","required":true,"schema":{"$ref":"#/definitions/Pet"},"description":"Pet object that needs to be added to the store"}]},{"label":"Update an existing pet","methodName":"updatePet","level":"collection","idParamName":"id","idParamType":"string","parameters":[{"name":"body","in":"body","required":true,"schema":{"$ref":"#/definitions/Pet"},"description":"Pet object that needs to be added to the store"}]}]');
    executeCollectionAction(action: any): void {
        if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
        switch (action.methodName) {
            case 'addPet': this.svc.addPet({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); if (this['loadData']) this['loadData']().subscribe((data: any) => this.data.set(data)); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            case 'updatePet': this.svc.updatePet({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); if (this['loadData']) this['loadData']().subscribe((data: any) => this.data.set(data)); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            default: console.error('Unknown collection action:', action.methodName);
        }
    }
}
