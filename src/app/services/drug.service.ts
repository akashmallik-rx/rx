import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Drug } from '../models/drug';

@Injectable({
  providedIn: 'root'
})
export class DrugService {
  private baseUrl = environment.apiUrl + '/drugs/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Drug[]> {
    return this.http.get<Drug[]>(this.baseUrl);
  }

  get(id: number): Observable<Drug> {
    return this.http.get<Drug>(`${this.baseUrl}${id}/`);
  }

  create(payload: any): Observable<Drug> {
    return this.http.post<Drug>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<Drug> {
    return this.http.put<Drug>(`${this.baseUrl}${id}/`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<Drug> {
    return this.http.patch<Drug>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
