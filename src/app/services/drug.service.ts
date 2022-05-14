import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrugService {
  private baseUrl = environment.apiUrl + '/drugs';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl);
  }

  get(id: number) {
    return this.http.get(`${this.baseUrl}/${id}` + '/');
  }

  create(payload: any) {
    return this.http.post(this.baseUrl, payload);
  }

  update(id: number, payload: any) {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  partialUpdate(id: number, payload: any) {
    return this.http.patch(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
