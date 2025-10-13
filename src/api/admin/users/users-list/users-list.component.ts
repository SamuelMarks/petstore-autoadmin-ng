/* eslint-disable */
import { Component, inject, signal, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, of, startWith, switchMap, catchError, map, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../../../services';
import { } from '../../../models';

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatMenuModule, ReactiveFormsModule],
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UserListComponent implements AfterViewInit {
    private readonly svc = inject(UserService);
    private readonly snackBar = inject(MatSnackBar);
    readonly data = signal<[]>([]);
    readonly displayedColumns: string[] = [, 'actions'];
    readonly totalItems = signal(0);
    readonly isLoading = signal(true);




    readonly filterForm = new FormGroup({
        'username': new FormControl(null),
        'password': new FormControl(null)
    });

    ngAfterViewInit(): void {


        const events = [
            ,
            ,
            this.filterForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), tap(() => this.paginator.pageIndex = 0))
        ].filter(Boolean);

        merge(...events).pipe(
            startWith({}),
            switchMap(() => this.loadData()),
        ).subscribe(data => this.data.set(data));
    }

    loadData() {
        this.isLoading.set(true);
        const params: any = this.filterForm.getRawValue();



        return this.svc.loginUser(params as any, 'response').pipe(
            catchError(() => {
                this.isLoading.set(false);
                this.snackBar.open('Failed to load data.', 'OK', { duration: 5000 });
                return of(null);
            }),
            map(res => {
                this.isLoading.set(false);
                if (res) {
                    this.totalItems.set(res.body?.length ?? 0);
                    return res.body as [];
                }
                return [];
            })
        );
    }

    onSortChange() {
        this.paginator.pageIndex = 0;
    }


    resetFilters(): void {
        this.filterForm.reset();
    }


    delete(id: number | string): void {
        if (confirm('Are you sure?')) {
            this.svc.deleteUser({ username: id } as any).subscribe(() => {
                // Refresh data after delete
                this.loadData().subscribe(data => this.data.set(data));
                this.snackBar.open('User deleted.', 'OK', { duration: 3000 });
            });
        }
    }


    readonly collectionActions = JSON.parse('[{"label":"Logs Out Current Logged In User Session","methodName":"logoutUser","level":"collection","path":"/user/logout","method":"GET"},{"label":"Creates List Of Users With Given Input Array","methodName":"createUsersWithArrayInput","level":"collection","path":"/user/createWithArray","method":"POST"},{"label":"Create User","methodName":"createUser","level":"collection","path":"/user","method":"POST"}]');
    executeCollectionAction(action: any): void {
        if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
        switch (action.methodName) {
            case 'logoutUser': this.svc.logoutUser({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            case 'createUsersWithArrayInput': this.svc.createUsersWithArrayInput({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            case 'createUser': this.svc.createUser({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
            default: console.error('Unknown collection action:', action.methodName);
        }
    }
}
