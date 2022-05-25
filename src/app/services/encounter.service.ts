import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Encounter } from '../models/encounter';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private baseUrl = environment.apiUrl + '/encounters/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(this.baseUrl);
  }

  get(id: number): Observable<Encounter> {
    return this.http.get<Encounter>(`${this.baseUrl}${id}/`);
  }

  create(payload: any): Observable<Encounter> {
    return this.http.post<Encounter>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<Encounter> {
    return this.http.put<Encounter>(`${this.baseUrl}${id}/`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<Encounter> {
    return this.http.patch<Encounter>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
