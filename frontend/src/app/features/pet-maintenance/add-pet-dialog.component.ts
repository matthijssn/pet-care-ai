import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-pet-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Add New Pet</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="pet.name" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Type</mat-label>
        <input matInput [(ngModel)]="pet.type" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Age</mat-label>
        <input matInput type="number" [(ngModel)]="pet.age" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Breed</mat-label>
        <input matInput [(ngModel)]="pet.breed" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onAdd()">Add</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class AddPetDialogComponent {
  pet = { name: '', type: '', age: 0, breed: '' };

  constructor(private dialogRef: MatDialogRef<AddPetDialogComponent>) {}

  onCancel() {
    this.dialogRef.close(null);
  }

  onAdd() {
    this.dialogRef.close(this.pet);
  }
}