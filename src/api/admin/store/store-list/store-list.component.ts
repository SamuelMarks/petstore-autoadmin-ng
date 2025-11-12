import { Component, OnDestroy, ViewChild, AfterViewInit, effect, inject, signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, of, catchError, startWith, switchMap } from 'rxjs';
import { StoreService } from '../../../../services/store.service';
import { Order } from '../../../../models';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
                        selector: 'app-store-list',
                        standalone: true,
                        imports: [ ...CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatToolbarModule ],
                        templateUrl: './store-list.component.html',
                        styleUrl: './store-list.component.scss'
                    })
export class StoreListComponent implements AfterViewInit, OnDestroy {
    readonly router = inject(Router);
    readonly route = inject(ActivatedRoute);
    readonly snackBar = inject(MatSnackBar);
    readonly storeService: StoreService = inject(StoreService);
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
    totalItems = signal(0);
    private isViewInitialized = signal(false);
    displayedColumns: string[] = ["id","petId","quantity","shipDate","status","complete","actions"];
    idProperty: string = 'id';
    subscriptions: Subscription[] = [];

    constructor() {
        effect(() => {
            if (!this.isViewInitialized()) { return; }
            const sub = this.paginator.page.pipe(
                startWith({} as PageEvent),
                switchMap((pageEvent: PageEvent) => {
                    const page = pageEvent.pageIndex ?? this.paginator.pageIndex;
                    const limit = pageEvent.pageSize ?? this.paginator.pageSize;
                    const query = { _page: page + 1, _limit: limit };
                    return this.storeService.getInventory(query, 'response').pipe(
                        catchError(() => of(null))
                    );
                })
            ).subscribe(response => {
                if (response === null) {
                    this.dataSource.data = [];
                    this.totalItems.set(0);
                    this.snackBar.open('Error fetching data', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
                } else {
                    this.dataSource.data = response.body ?? [];
                    const totalCount = response.headers.get('X-Total-Count');
                    this.totalItems.set(totalCount ? +totalCount : response.body?.length ?? 0);
                }
            });
            this.subscriptions.push(sub);
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.isViewInitialized.set(true);
    }

    refresh() {
        this.paginator.page.emit({ pageIndex: this.paginator.pageIndex, pageSize: this.paginator.pageSize, length: this.paginator.length });
    }

    onDelete(id: string) {
        if (confirm('Are you sure you want to delete this item?')) {
          const sub = this.storeService.deleteOrder(id).subscribe(() => {
            this.snackBar.open('Item deleted successfully!', 'Close', { duration: 3000 });
            this.refresh();
          });
          this.subscriptions.push(sub);
        }
    }

    placeOrder() {
        const sub = this.storeService.placeOrder().pipe(
            catchError((err: any) => {
                console.error('Action failed', err);
                this.snackBar.open('Action failed', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
                return of(null);
            })
        ).subscribe(response => {
            if (response !== null) {
                this.snackBar.open('Action successful!', 'Close', { duration: 3000 });
                this.refresh();
            }
        });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
