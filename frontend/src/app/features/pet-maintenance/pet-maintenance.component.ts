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
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddPetDialogComponent } from './add-pet-dialog.component';
import { PetIllustrationComponent } from './pet-illustration.component';

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
        MatRippleModule,
        MatIconModule,
        MatSnackBarModule,
        PetIllustrationComponent
    ],
    templateUrl: './pet-maintenance.component.html',
    styleUrls: ['./pet-maintenance.component.scss']
})
export class PetMaintenanceComponent implements OnInit {
    displayedColumns: string[] = ['name', 'type', 'birthday', 'breed'];

    dataSource = new MatTableDataSource<Pet>([]);
    selectedPet: Pet | null = null;
    isLoading = true;
    errorMessage: string | null = null;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private petService: PetService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadPets();
    }

    loadPets() {
        this.isLoading = true;
        this.errorMessage = null;
        this.petService.getPets().subscribe({
            next: (pets: Pet[]) => {
                this.dataSource.data = pets;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error loading pets:', error);
                const errorMsg = error?.status === 502 
                    ? 'Backend service is currently unavailable. Please try again later.'
                    : 'Failed to load pets. Please try again.';
                this.errorMessage = errorMsg;
                this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
            }
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