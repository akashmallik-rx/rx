import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = environment.apiUrl + '/patients/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  get(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}${id}/`);
  }

  create(payload: any): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}${id}/`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<Patient> {
    return this.http.patch<Patient>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
