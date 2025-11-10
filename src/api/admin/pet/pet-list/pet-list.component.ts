import { AfterViewInit, Component, effect, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of, startWith, Subscription, switchMap } from 'rxjs';
import { PetService } from '../../../../services/pet.service';
import { ApiResponse } from '../../../../models';
import { CommonModule } from "@angular/common";
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
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [...CommonModule,
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
    MatToolbarModule],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss'
})
export class PetListComponent implements AfterViewInit, OnDestroy {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly snackBar = inject(MatSnackBar);
  readonly petService: PetService = inject(PetService);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  dataSource: MatTableDataSource<ApiResponse> = new MatTableDataSource<ApiResponse>();
  totalItems = signal(0);
  private isViewInitialized = signal(false);
  displayedColumns: string[] = ["id", "name", "status", "code", "type", "message", "actions"];
  idProperty: string = 'id';
  subscriptions: Subscription[] = [];

  constructor() {
    effect(() => {
      if (!this.isViewInitialized()) {
        return;
      }
      const sub = this.paginator.page.pipe(
        startWith({} as PageEvent),
        switchMap((pageEvent: PageEvent) => {
          const page = pageEvent.pageIndex ?? this.paginator.pageIndex;
          const limit = pageEvent.pageSize ?? this.paginator.pageSize;
          const query = { _page: page + 1, _limit: limit };
          return this.petService.findPetsByStatus(query, 'response').pipe(
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
    this.paginator.page.emit({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      const sub = this.petService.deletePet(id).subscribe(() => {
        this.snackBar.open('Item deleted successfully!', 'Close', { duration: 3000 });
        this.refresh();
      });
      this.subscriptions.push(sub);
    }
  }

  uploadFile(id: string) {
    const sub = this.petService.uploadFile(id).pipe(
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

  addPet() {
    const sub = this.petService.addPet().pipe(
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

  updatePet() {
    const sub = this.petService.updatePet().pipe(
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

  updatePetWithForm(id: string) {
    const sub = this.petService.updatePetWithForm(id).pipe(
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
