
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JobAdData } from '../ad-job-list.model';

@Injectable()
export class CreateJobService {
  constructor(private _http: HttpClient) {}

  /**
   * Save job
   * @param data 
   * @returns 
   */
  saveJob(data: JobAdData): Observable<any> {
    return this._http.post('http://localhost:3000/jobs', data );
  }
}
