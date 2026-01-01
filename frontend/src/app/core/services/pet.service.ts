import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pet } from '../models/pet.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(private http: HttpClient) {}

  private url(path: string) {
    // ensure no double slashes
    return `${environment.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  /** Get all pets */
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.url('api/pets'));
  }

  /** Create a new pet */
  createPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(this.url('api/pets'), pet);
  }

  /** Update an existing pet */
  updatePet(pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.url('api/pets')}/${pet.id}`, pet);
  }
}