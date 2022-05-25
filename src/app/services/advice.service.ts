import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Advice } from '../models/advice';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {
  private baseUrl = environment.apiUrl + '/advices/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Advice[]> {
    return this.http.get<Advice[]>(this.baseUrl);
  }

  get(id: number): Observable<Advice> {
    return this.http.get<Advice>(`${this.baseUrl}${id}/`);
  }

  create(payload: any): Observable<Advice> {
    return this.http.post<Advice>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<Advice> {
    return this.http.put<Advice>(`${this.baseUrl}${id}/`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<Advice> {
    return this.http.patch<Advice>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
