import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PetService } from '../../core';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './add-event-dialog.component.html'
})
export class AddEventDialogComponent {
  pets: any[] = [];
  eventTypes = [
    { value: 'vet', label: 'Vet visit' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'medication', label: 'Medication' },
    { value: 'tank_cleaning', label: 'Tank cleaning' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' }
  ];

  form: any;

  constructor(
    private fb: FormBuilder,
    private petSvc: PetService,
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      date: [this.data?.date || new Date(), Validators.required],
      time: ['12:00'],
      eventType: ['other'],
      petId: [''],
      recurrence: ['none']
    });

    this.loadPets();
  }

  loadPets() {
    this.petSvc.getPets().subscribe(pets => (this.pets = pets));
  }

  save() {
    if (this.form.valid) {
      const raw = this.form.value;
      const due = new Date(raw.date);
      if (raw.time) {
        const [h, m] = raw.time.split(':').map((v: string) => parseInt(v, 10));
        due.setHours(h, m, 0, 0);
      }

      const payload: any = {
        title: raw.title,
        dueAt: due.toISOString(),
        petId: raw.petId || undefined,
        recurrence: raw.recurrence === 'none' ? undefined : raw.recurrence,
        eventType: raw.eventType || 'other'
      };

      this.dialogRef.close(payload);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
