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
import { StoreService } from '../../../services';
import { Order } from '../../../models';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.css']
})
export class StoreListComponent implements AfterViewInit {
  private readonly svc = inject(StoreService);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = signal<Order[]>([]);
  readonly displayedColumns: string[] = ['id', 'petId', 'quantity', 'shipDate', 'status', 'complete', 'actions'];
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


    return this.svc.getInventory(params as any, 'response').pipe(
      catchError(() => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load data.', 'OK', { duration: 5000 });
        return of(null);
      }),
      map(res => {
        this.isLoading.set(false);
        if (res) {
          this.totalItems.set(res.body?.length ?? 0);
          return res.body as Order[];
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
      this.svc.deleteOrder({ orderId: id } as any).subscribe(() => {
        // Refresh data after delete
        this.loadData().subscribe(data => this.data.set(data));
        this.snackBar.open('Store deleted.', 'OK', { duration: 3000 });
      });
    }
  }


}
