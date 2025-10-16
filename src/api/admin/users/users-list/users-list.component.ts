import { UserService } from "./../../../services";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Component, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly svc: UserService = inject(UserService);
  readonly collectionActions = JSON.parse('[{"label":"Creates list of users with given input array","methodName":"createUsersWithListInput","level":"collection","idParamName":"id","idParamType":"string","parameters":[{"name":"body","in":"body","required":true,"schema":{"type":"array","items":{"$ref":"#/definitions/User"}},"description":"List of user object"}]},{"label":"Creates list of users with given input array","methodName":"createUsersWithArrayInput","level":"collection","idParamName":"id","idParamType":"string","parameters":[{"name":"body","in":"body","required":true,"schema":{"type":"array","items":{"$ref":"#/definitions/User"}},"description":"List of user object"}]}]');

  executeCollectionAction(action: any) {
    if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
    switch (action.methodName) {
      case 'createUsersWithListInput':
        this.svc.createUsersWithListInput().subscribe({
          next: () => this.snackBar.open('Action successful.', 'OK', { duration: 3000 }),
          error: (e: unknown) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 })
        });
        break;
      case 'createUsersWithArrayInput':
        this.svc.createUsersWithArrayInput().subscribe({
          next: () => this.snackBar.open('Action successful.', 'OK', { duration: 3000 }),
          error: (e: unknown) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 })
        });
        break;
      default:
        console.error('Unknown collection action:', action.methodName);
    }
  }
}
