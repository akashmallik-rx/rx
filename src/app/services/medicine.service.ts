import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medicine } from '../models/medicine';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private baseUrl = environment.apiUrl + '/medicines/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.baseUrl);
  }

  get(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.baseUrl}${id}/`);
  }

  create(payload: any): Observable<Medicine> {
    return this.http.post<Medicine>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}${id}/`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<Medicine> {
    return this.http.patch<Medicine>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
