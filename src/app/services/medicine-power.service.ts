import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MedicinePower } from '../models/medicine-power';

@Injectable({
  providedIn: 'root'
})
export class MedicinePowerService {
  private baseUrl = environment.apiUrl + '/powers';

  constructor(private http: HttpClient) { }

  getAll(): Observable<MedicinePower[]> {
    return this.http.get<MedicinePower[]>(this.baseUrl);
  }

  get(id: number): Observable<MedicinePower> {
    return this.http.get<MedicinePower>(`${this.baseUrl}/${id}` + '/');
  }

  create(payload: any): Observable<MedicinePower> {
    return this.http.post<MedicinePower>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<MedicinePower> {
    return this.http.put<MedicinePower>(`${this.baseUrl}/${id}`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<MedicinePower> {
    return this.http.patch<MedicinePower>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
