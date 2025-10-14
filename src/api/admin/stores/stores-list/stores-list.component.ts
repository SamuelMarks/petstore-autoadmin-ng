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

  
  
  );
}



const events = [
      
      
      )), }
    ].filter(Boolean).filter(e => e); // Ensure no empty slots from template

// If there are no events to merge, just load data once.
if (events.length === 0) {
    this.loadData().subscribe(data => this.data.set(data));
    return;
}

merge(...events).pipe(
    startWith({}),
    switchMap(() => this.loadData()),
).subscribe(data => this.data.set(data));
  }

loadData() {
    this.isLoading.set(true);
    const params: any = {};

}
    
    }

return this.svc.(params as any, 'response').pipe(
    catchError(() => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load data.', 'OK', { duration: 5000 });
        return of(null);
    }),
    map(res => {
        this.isLoading.set(false);
        if (res) {
            this.totalItems.set(res.body?.length ?? 0);
            return res.body as Store[];
        }
        return [];
    })
);
  }
  } @else {
    constructor() {
        this.isLoading.set(false); // No data to load
    }
}

  
  }

  
  }


delete (id: number | string): void {
    if(confirm('Are you sure?')) {
    this.svc.deleteOrder({ orderId: id as any).subscribe(() => {

        this.snackBar.open('Store deleted.', 'OK', { duration: 3000 });
    });
}
  }
  }

  
  readonly collectionActions = JSON.parse('[{"label":"Place an order for a pet","methodName":"placeOrder","level":"collection","idParamName":"id"}]');
executeCollectionAction(action: any): void {
    if(!confirm(`Are you sure you want to run: ${action.label}?`)) return;
switch (action.methodName) {
    case 'placeOrder': this.svc.placeOrder({} as any).subscribe({ next: () => { this.snackBar.open('Action successful.', 'OK', { duration: 3000 }); if (this['loadData']) this['loadData']().subscribe((data: any) => this.data.set(data)); }, error: (e) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 }) }); break;
    default: console.error('Unknown collection action:', action.methodName);
}
}
}
