import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RemindersService {
  private base = `${environment.baseUrl.replace(/\/+$/, '')}/api/reminders`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  getEventsForDate(isoDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}?date=${encodeURIComponent(isoDate)}`);
  }

  /** Fetch events in an ISO date range (inclusive). Pass start/end as YYYY-MM-DD */
  getEventsInRange(startIso: string, endIso: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`);
  }

  createEvent(payload: any) {
    return this.http.post(this.base, payload);
  }

  updateEvent(id: string, payload: any) {
    return this.http.put(`${this.base}/${id}`, payload);
  }

  deleteEvent(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
