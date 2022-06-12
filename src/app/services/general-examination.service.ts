import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeneralExamination } from '../models/general-examination';

@Injectable({
  providedIn: 'root'
})
export class GeneralExaminationService {
  private baseUrl = environment.apiUrl + '/examinations/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<GeneralExamination[]> {
    return this.http.get<GeneralExamination[]>(this.baseUrl);
  }

  get(id: number): Observable<GeneralExamination> {
    return this.http.get<GeneralExamination>(`${this.baseUrl}${id}/`);
  }

  create(payload: any): Observable<GeneralExamination> {
    return this.http.post<GeneralExamination>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<GeneralExamination> {
    return this.http.put<GeneralExamination>(`${this.baseUrl}${id}/`, payload);
  }

  partialUpdate(id: number, payload: any): Observable<GeneralExamination> {
    return this.http.patch<GeneralExamination>(`${this.baseUrl}${id}/`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
