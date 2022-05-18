import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Examination } from '../models/examination';

@Injectable({
  providedIn: 'root'
})
export class ExaminationService {
  private baseUrl = environment.apiUrl + '/examinations';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Examination[]> {
    return this.http.get<Examination[]>(this.baseUrl);
  }

  get(id: number): Observable<Examination> {
    return this.http.get<Examination>(`${this.baseUrl}/${id}` + '/');
  }

  create(payload: any): Observable<Examination> {
    return this.http.post<Examination>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<Examination> {
    return this.http.put<Examination>(`${this.baseUrl}/${id}`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<Examination> {
    return this.http.patch<Examination>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
