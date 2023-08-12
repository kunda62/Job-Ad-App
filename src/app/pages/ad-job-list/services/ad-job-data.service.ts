import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators'

import { HtppResponse, JobAdData, PaginationParams } from '../ad-job-list.model';

@Injectable()
export class AdJobDataService extends DefaultDataService<any> {
  totalJobsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(_http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('AdJob', _http, httpUrlGenerator);
  }

  /**
   * Override getWithQuery function
   * @param queryParams 
   * @returns 
   */
  override getWithQuery(queryParams: PaginationParams | any): Observable<HtppResponse | any> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    let params = new HttpParams();
    params = params.append('_limit', queryParams._limit);
    params = params.append('_page', queryParams._page);

    if (queryParams._q) {
      params = params.append('title_like', queryParams._q);
      params = params.append('q', queryParams._q);
    }

    if (queryParams._like) {
      params = params.append('status_like', queryParams._like);
    }
      
    return this.http.get<PaginationParams>('http://localhost:3000/jobs', { params, headers, observe: 'response' }).pipe(
      map((res: HtppResponse | any) => {
        let totalCount = 0;
        if (res.headers) {
          const totalCountHeader = res.headers.get('X-Total-Count');
          totalCount = totalCountHeader ? +totalCountHeader : 0;
          
          this.totalJobsCount$.next(totalCount);
        }
        return res.body;
      })
    )
}

  /**
   * Override getAll function
   * @returns 
   */
  override getAll(): Observable<JobAdData | any> {
    return this.http.get<JobAdData>('http://localhost:3000/jobs');
  }

  /**
   * Override update function
   * @param update 
   * @returns 
   */
  override update(update: Update<JobAdData>,): Observable<JobAdData> {
    return this.http.put<JobAdData>(`http://localhost:3000/jobs/${update.id}`, update.changes);
  }

  /**
   * Override add function
   * @param entity 
   * @returns 
   */
  override add(entity: JobAdData): Observable<JobAdData> {
    return this.http.post<JobAdData>('http://localhost:3000/jobs', entity); 
  }

  /**
   * Override delete function
   * @param id 
   * @returns 
   */
  override delete(id: number): Observable<number> {
    return this.http.delete<number>(`http://localhost:3000/jobs/${id}`);
  }
}
