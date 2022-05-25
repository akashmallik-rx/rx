import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Symptom } from '../models/symptom';

@Injectable({
  providedIn: 'root'
})
export class SymptomService {
  private baseUrl = environment.apiUrl + '/symptoms/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.baseUrl);
  }

  get(id: number): Observable<Symptom> {
    return this.http.get<Symptom>(`${this.baseUrl}${id}/`);
  }

  create(payload: any): Observable<Symptom> {
    return this.http.post<Symptom>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<Symptom> {
    return this.http.put<Symptom>(`${this.baseUrl}${id}/`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<Symptom> {
    return this.http.patch<Symptom>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
