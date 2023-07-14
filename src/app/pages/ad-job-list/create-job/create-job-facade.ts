

import { Injectable, OnDestroy } from "@angular/core";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { Observable, Subject, of } from "rxjs";

import { CreateJobService } from "./create-job.service";
import { JobAdData } from "../ad-job-list.model";

@Injectable()
export class CreateJobFacade implements OnDestroy {
  saveJob$: Subject<JobAdData> = new Subject<JobAdData>();

  // unsubscribe cleaner
  private _unsubscribe$ = new Subject<void>();

  constructor(private _service: CreateJobService) {}

  /**
   * Save job
   * @returns 
   */
  saveJob(): Observable<any> {
    return this.saveJob$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((data: any) =>
        this._service.saveJob(data).pipe(catchError((err: any) => of(err)))
      )
    );
  }
  
  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
