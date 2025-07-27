// src/app/services/vehicle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import Vehicle from '../models/vehicle';

interface GovIlResponse {
    result: { records: any[] };
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
    private readonly govAPI = 'https://data.gov.il/api/3/action/datastore_search';
    private apiUrl = 'http://localhost:3000/api/vehicle';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(this.apiUrl);
    }

    getById(id: string): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
    }

    create(vehicle: Vehicle): Observable<Vehicle> {
        return this.http.post<Vehicle>(this.apiUrl, vehicle);
    }

    update(id: string, vehicle: Partial<Vehicle>): Observable<Vehicle> {
        return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicle);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    lookupByPlate(plate: string): Observable<any[]> {
        const filters = JSON.stringify({ mispar_rechev: plate });
        return this.http
            .get<GovIlResponse>(this.govAPI, {
                params: {
                    resource_id: '053cea08-09bc-40ec-8f7a-156f0677aff3',
                    filters
                }
            })
            .pipe(
                map(res => res.result.records)
            );
    }
}
