import { PetService } from "./../../../services";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Component, inject } from "@angular/core";

@Component({
  selector: 'app-pets-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './pets-list.component.html',
  styleUrls: ['./pets-list.component.css']
})
export class PetsListComponent {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly svc: PetService = inject(PetService);
  readonly collectionActions = JSON.parse('[{"label":"Update an existing pet","methodName":"updatePet","level":"collection","idParamName":"id","idParamType":"string","parameters":[{"name":"body","in":"body","required":true,"schema":{"$ref":"#/definitions/Pet"},"description":"Pet object that needs to be added to the store"}]}]');

  executeCollectionAction(action: any) {
    if (!confirm(`Are you sure you want to run: ${action.label}?`)) return;
    switch (action.methodName) {
      case 'updatePet':
        this.svc.updatePet().subscribe({
          next: () => this.snackBar.open('Action successful.', 'OK', { duration: 3000 }),
          error: (e: unknown) => this.snackBar.open('Action failed.', 'OK', { duration: 5000 })
        });
        break;
      default:
        console.error('Unknown collection action:', action.methodName);
    }
  }
}
