import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RemindersService } from '../../core';
import { AddEventDialogComponent } from './add-event-dialog.component';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  selected: Date = new Date();
  events: any[] = [];
  // map 'YYYY-MM-DD' -> events[]
  eventsByDate: Record<string, any[]> = {};

  constructor(private reminders: RemindersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEventsForMonth(this.selected);
  }

  dateChanged(date: Date | null) {
    if (date) {
      this.selected = date;
      this.loadEventsFor(date);
    }
  }

  loadEventsFor(date: Date) {
    const isoDate = date.toISOString().slice(0, 10);
    this.reminders.getEventsForDate(isoDate).subscribe(events => {
      this.events = events || [];
    });
  }

  loadEventsForMonth(date: Date) {
    // compute start and end of month
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startIso = start.toISOString().slice(0, 10);
    const endIso = end.toISOString().slice(0, 10);

    this.reminders.getEventsInRange(startIso, endIso).subscribe(events => {
      this.eventsByDate = {};
      (events || []).forEach((e: any) => {
        const key = (new Date(e.dueAt)).toISOString().slice(0, 10);
        if (!this.eventsByDate[key]) this.eventsByDate[key] = [];
        this.eventsByDate[key].push(e);
      });
      // update currently selected day's list
      this.loadEventsFor(this.selected);
    });
  }

  dateClass = (d: Date) => {
    const key = d.toISOString().slice(0, 10);
    return this.eventsByDate[key] && this.eventsByDate[key].length > 0 ? 'has-events' : '';
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '480px',
      data: { date: this.selected }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const op = result.id ? this.reminders.updateEvent(result.id, result) : this.reminders.createEvent(result);
        op.subscribe(() => {
          this.loadEventsForMonth(this.selected);
        });
      }
    });
  }

  editEvent(ev: any) {
    const dialogRef = this.dialog.open(AddEventDialogComponent, { width: '480px', data: { date: new Date(ev.dueAt), event: ev } });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (result._delete) {
        this.reminders.deleteEvent(ev.id || ev._id).subscribe(() => this.loadEventsForMonth(this.selected));
      } else {
        const id = ev.id || ev._id;
        this.reminders.updateEvent(id, result).subscribe(() => this.loadEventsForMonth(this.selected));
      }
    });
  }
}
