import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PetService } from '../../core/services/pet.service';

interface SpeciesConfig {
  name: string;
  icon: string;
  requiredFields: string[];
}

@Component({
  selector: 'app-add-pet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-pet-dialog.component.html',
  styleUrls: ['./add-pet-dialog.component.scss']
})
export class AddPetDialogComponent {
  petForm: FormGroup;
  isSubmitting = false;
  
  species: SpeciesConfig[] = [
    { name: 'Dog', icon: 'pets', requiredFields: ['name', 'species', 'breed', 'birthday', 'weight'] },
    { name: 'Cat', icon: 'pets', requiredFields: ['name', 'species', 'breed', 'birthday', 'weight'] },
    { name: 'Bird', icon: 'flutter_dash', requiredFields: ['name', 'species', 'breed', 'birthday'] },
    { name: 'Rabbit', icon: 'pets', requiredFields: ['name', 'species', 'breed', 'birthday', 'weight'] },
    { name: 'Hamster', icon: 'pets', requiredFields: ['name', 'species', 'breed', 'birthday'] },
    { name: 'Fish', icon: 'water', requiredFields: ['name', 'species', 'breed', 'color'] },
    { name: 'Guinea Pig', icon: 'pets', requiredFields: ['name', 'species', 'breed', 'birthday', 'weight'] },
  ];

  speciesEmojis: { [key: string]: string } = {
    'Dog': '🐕',
    'Cat': '🐱',
    'Bird': '🐦',
    'Rabbit': '🐰',
    'Hamster': '🐹',
    'Fish': '🐠',
    'Guinea Pig': '🐹'
  };

  selectedSpecies: SpeciesConfig | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddPetDialogComponent>,
    private fb: FormBuilder,
    private petService: PetService,
    private snackBar: MatSnackBar
  ) {
    this.petForm = this.fb.group({
      name: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(2)]],
      species: [{ value: '', disabled: false }, Validators.required],
      breed: [{ value: '', disabled: false }],
      birthday: [{ value: '', disabled: false }],
      weight: [{ value: '', disabled: false }],
      color: [{ value: '', disabled: false }],
      notes: [{ value: '', disabled: false }]
    });
  }

  onSpeciesChange(speciesName: string) {
    this.selectedSpecies = this.species.find(s => s.name === speciesName) || null;
    this.updateFieldValidators();
  }

  updateFieldValidators() {
    if (!this.selectedSpecies) return;

    const requiredFields = this.selectedSpecies.requiredFields;
    
    Object.keys(this.petForm.controls).forEach(key => {
      const control = this.petForm.get(key);
      if (control) {
        if (requiredFields.includes(key)) {
          // Apply required validator
          control.setValidators([Validators.required]);
        } else {
          // Clear validators for non-required fields
          control.clearValidators();
        }
        control.updateValueAndValidity({ emitEvent: false });
      }
    });

    // Mark all fields as touched to show validation errors
    Object.keys(this.petForm.controls).forEach(key => {
      this.petForm.get(key)?.markAsTouched();
    });
  }

  isFieldRequired(fieldName: string): boolean {
    if (!this.selectedSpecies) return false;
    return this.selectedSpecies.requiredFields.includes(fieldName);
  }

  shouldShowField(fieldName: string): boolean {
    if (!this.selectedSpecies) return fieldName === 'name' || fieldName === 'species';
    return this.selectedSpecies.requiredFields.includes(fieldName);
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  onAdd() {
    if (!this.petForm.valid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    
    // Disable all form controls
    Object.keys(this.petForm.controls).forEach(key => {
      this.petForm.get(key)?.disable();
    });

    // Prepare the pet data
    const formData = this.petForm.getRawValue(); // Use getRawValue to include disabled controls
    
    // Convert birthday to ISO date string if it's a Date object
    if (formData.birthday instanceof Date) {
      formData.birthday = formData.birthday.toISOString().split('T')[0];
    }

    // Remove empty/null values
    const petData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
        acc[key] = formData[key];
      }
      return acc;
    }, {} as any);

    // Call the backend service
    this.petService.createPet(petData).subscribe({
      next: (newPet) => {
        this.isSubmitting = false;
        this.snackBar.open(`${newPet.name} added successfully!`, 'Close', { duration: 2000 });
        this.dialogRef.close(newPet);
      },
      error: (error) => {
        this.isSubmitting = false;
        
        // Re-enable form controls on error
        Object.keys(this.petForm.controls).forEach(key => {
          this.petForm.get(key)?.enable();
        });
        
        console.error('Error creating pet:', error);
        const errorMessage = error?.error?.message || 'Failed to add pet. Please try again.';
        this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
      }
    });
  }
}