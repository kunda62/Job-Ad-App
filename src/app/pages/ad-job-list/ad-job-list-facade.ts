

import { Injectable, OnDestroy } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";

import { AdJobListService } from "./ad-job-list.service";
import { HtppResponse, JobAdData, PaginationParams } from "./ad-job-list.model";

@Injectable()
export class AdJobListFacade implements OnDestroy {
  jobList$: Subject<PaginationParams> = new Subject<PaginationParams>();
  deleteJob$: Subject<number> = new Subject <number>();
  saveJob$: Subject<JobAdData> = new Subject<JobAdData>();

  // unsubscribe cleaner
  private _unsubscribe$ = new Subject<void>();

  constructor(private _service: AdJobListService) {}

  /**
   * Load ad jobs list
   * @returns 
   */
  jobListLoad(): Observable<any> {
    return this.jobList$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((params: PaginationParams) => {
        return this._service.getAllAdds$(params).pipe(
          map((response: HtppResponse) => {
            
            // get the total count from the headers
            let totalCount = 0;
            if (response.headers) {
              const totalCountHeader = response.headers.get('X-Total-Count');
              totalCount = totalCountHeader ? +totalCountHeader : 0;
            }
            const data = response.body;
  
            return { totalCount, data };
          }),
          catchError((error: any) => of(error))
        );
      })
    );
  }

  /**
   * Edit job status
   * @returns 
   */
  editJobStatus(): Observable<any> {
    return this.saveJob$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((data: any) =>
        this._service.editJob$(data).pipe(catchError((err: any) => of(err)))
      )
    );
  }

  /**
   * Delete job 
   * @returns 
   */
  jobDelete(): Observable<any> {
    return this.deleteJob$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((id: number) => this._service.deleteJob$(id).pipe(
        catchError(err => of(err))
      ))
    );
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
