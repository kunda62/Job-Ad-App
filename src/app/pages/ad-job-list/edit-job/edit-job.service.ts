import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class EditJobService {
  constructor(private _http: HttpClient) {}

  /**
   * Edit job service
   * @param data 
   * @returns 
   */
  editJob$(data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/jobs/${data.id}`, data );
  }
}
