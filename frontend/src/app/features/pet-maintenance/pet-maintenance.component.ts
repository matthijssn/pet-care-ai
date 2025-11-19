import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPetDialogComponent } from './add-pet-dialog.component';

import { Pet, PetService } from '../../core';



@Component({
    selector: 'app-pet-maintenance',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule
    ],
    templateUrl: './pet-maintenance.component.html',
    styleUrls: ['./pet-maintenance.component.scss']
})
export class PetMaintenanceComponent implements OnInit {
    displayedColumns: string[] = ['name', 'type', 'birthday', 'breed', 'deceaseddate'];

    dataSource = new MatTableDataSource<Pet>([]);
    selectedPet: Pet | null = null;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private dialog: MatDialog, private petService: PetService) { }

    ngOnInit(): void {
        this.loadPets();
    }

    loadPets() {
        this.petService.getPets().subscribe((pets : Pet[]) => {
            this.dataSource.data = pets;
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    selectPet(pet: Pet) {
        this.selectedPet = pet;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openAddPetDialog() {
        const dialogRef = this.dialog.open(AddPetDialogComponent, { width: '400px' });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.petService.createPet(result).subscribe((newPet: Pet) => {
                    this.dataSource.data = [...this.dataSource.data, newPet];
                });
            }
        });
    }
}