/* eslint-disable */
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { PetService } from '../../../services';
import { Pet } from '../../../models';

@Component({
  selector: 'app-pets-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule, MatMenuModule],
  templateUrl: './pets-list.component.html',
  styleUrls: ['./pets-list.component.css']
})
export class PetListComponent implements AfterViewInit {
  private readonly svc = inject(PetService);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = signal<Pet[]>([]);
  readonly displayedColumns: string[] = ['id', 'name', 'status', 'actions'];
  readonly totalItems = signal(0);
  readonly isLoading = signal(true);


  ngAfterViewInit(): void {


    const events = [
      ,
      ,

    ].filter(Boolean);

    merge(...events).pipe(
      startWith({}),
      switchMap(() => this.loadData()),
    ).subscribe(data => this.data.set(data));
  }

  loadData() {
    this.isLoading.set(true);
    const params: any = {};


    return this.svc.findPetsByStatus(params as any, 'response').pipe(
      catchError(() => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load data.', 'OK', { duration: 5000 });
        return of(null);
      }),
      map(res => {
        this.isLoading.set(false);
        if (res) {
          this.totalItems.set(res.body?.length ?? 0);
          return res.body as Pet[];
        }
        return [];
      })
    );
  }

  onSortChange() {
    this.paginator.pageIndex = 0;
  }


  delete(id: number | string): void {
    if (confirm('Are you sure?')) {
      this.svc.deletePet({ petId: id } as any).subscribe(() => {
        // Refresh data after delete
        this.loadData().subscribe(data => this.data.set(data));
        this.snackBar.open('Pet deleted.', 'OK', { duration: 3000 });
      });
    }
  }


  readonly collectionActions = JSON.parse('[{"label":"Update An Existing Pet","methodName":"updatePet","level":"collection","path":"/pet","method":"PUT"},{"label":"Finds Pets By Tags","methodName":"findPetsByTags","level":"collection","path":"/pet/findByTags","method":"GET"}]');

  executeCollectionAction(action: any): void {
    if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
    switch (action.methodName) {
      case 'updatePet':
        this.svc.updatePet({} as any).subscribe({
          next: () => {
            this.snackBar.open('Action successful.', 'OK', { duration: 3000 });
          }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 })
        });
        break;
      case 'findPetsByTags':
        this.svc.findPetsByTags({} as any).subscribe({
          next: () => {
            this.snackBar.open('Action successful.', 'OK', { duration: 3000 });
          }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 })
        });
        break;
      default:
        console.error('Unknown collection action:', action.methodName);
    }
  }
}
