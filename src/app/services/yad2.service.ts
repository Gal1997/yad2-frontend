import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Yad2 from '../models/yad2';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Yad2Service {

  private apiUrl = 'http://localhost:3000/api/yad2';

  constructor(private http: HttpClient) { }


  getAll(): Observable<Yad2[]> {
    return this.http.get<Yad2[]>(this.apiUrl);
  }

  getById(id: string): Observable<Yad2> {
    return this.http.get<Yad2>(`${this.apiUrl}/${id}`);
  }

  create(yad2item: Yad2): Observable<Yad2> {
    return this.http.post<Yad2>(this.apiUrl, yad2item);
  }

  update(id: string, yad2item: Partial<Yad2>): Observable<Yad2> {
    return this.http.put<Yad2>(`${this.apiUrl}/${id}`, yad2item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
