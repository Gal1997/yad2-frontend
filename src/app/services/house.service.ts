// src/app/services/house.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import House from '../models/house';


@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private apiUrl = 'http://localhost:3000/api/house';

  constructor(private http: HttpClient) { }

  getAll(): Observable<House[]> {
    return this.http.get<House[]>(this.apiUrl);
  }

  getById(id: string): Observable<House> {
    return this.http.get<House>(`${this.apiUrl}/${id}`);
  }

  create(house: House): Observable<House> {
    return this.http.post<House>(this.apiUrl, house);
  }

  update(id: string, house: Partial<House>): Observable<House> {
    return this.http.put<House>(`${this.apiUrl}/${id}`, house);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
