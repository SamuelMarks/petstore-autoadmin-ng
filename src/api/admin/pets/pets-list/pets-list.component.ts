/* eslint-disable */
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { PetService } from '../../../services';
import { Pet } from '../../../models';

@Component({
    selector: 'app-pets-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule],
    templateUrl: './pets-list.component.html',
    styleUrls: ['./pets-list.component.css']
})
export class PetListComponent {
    private readonly svc = inject(PetService);
    private readonly snackBar = inject(MatSnackBar);
    readonly data: WritableSignal<Pet[]> = signal([]);
    readonly displayedColumns: string[] = ['id', 'name', 'status', 'actions'];


    constructor() {
        this.loadData();

    }

    loadData(): void {
        const filters = {};
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') { (acc as any)[key] = value; }
            return acc;
        }, {});
        this.svc.findPetsByStatus(cleanFilters as any).subscribe((d) => this.data.set(d as any[]));
    }


    delete(id: number | string): void {
        if (confirm('Are you sure?')) {
            this.svc.deletePet({ petId: id } as any).subscribe(() => this.loadData());
        }
    }

    readonly collectionActions = JSON.parse('[{"label":"Uploads An Image","methodName":"uploadFile","level":"collection","path":"/pet/{petId}/uploadImage","method":"POST"},{"label":"Update An Existing Pet","methodName":"updatePet","level":"collection","path":"/pet","method":"PUT"},{"label":"Finds  Pets By Tags","methodName":"findPetsByTags","level":"collection","path":"/pet/findByTags","method":"GET"}]');
    executeCollectionAction(action: any): void {
        if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
        switch (action.methodName) {
            case 'uploadFile': this.svc.uploadFile({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); this.loadData(); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            case 'updatePet': this.svc.updatePet({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); this.loadData(); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            case 'findPetsByTags': this.svc.findPetsByTags({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); this.loadData(); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            default: console.error('Unknown collection action:', action.methodName);
        }
    }
}
