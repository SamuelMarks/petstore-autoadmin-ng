/* eslint-disable */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-stores-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
    templateUrl: './stores-list.component.html',
    styleUrls: ['./stores-list.component.css']
})
export class StoreListComponent { }
