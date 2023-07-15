
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginationParams } from './ad-job-list.model';

@Injectable()
export class AdJobListService {
  constructor(private _http: HttpClient) {}

  getAllAdds$(data: PaginationParams): Observable<any> {
    const url = 'http://localhost:3000/jobs';
  
    let params = new HttpParams();
    params = params.append('_limit', data._limit);
    params = params.append('_page', data._page);
    if (data._q) {
      params = params.append('title_like', data._q);
      params = params.append('q', data._q);
    }
    if (data._like) {
      params = params.append('status_like', data._like);
    }
  
    // Set the headers to include for total count
    const headers = new HttpHeaders().set('Accept', 'application/json');
  
    // Make the HTTP GET request with params
    return this._http.get(url, { params, headers, observe: 'response' });
  }


  /**
   * Edit job
   * @param data 
   * @returns 
   */
  editJob$(data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/jobs/${data.id}`, data );
  }

  /**
   * Delete Job
   * @param id 
   * @returns 
   */
  deleteJob$(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/jobs/${id}` );
  }
}
