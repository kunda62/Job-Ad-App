

import { Injectable, OnDestroy } from "@angular/core";
import { catchError, takeUntil, switchMap } from "rxjs/operators";
import { Observable, Subject, of } from "rxjs";

import { JobAdData } from "../ad-job-list.model";
import { AdJobEntityService } from "../services/ad-job-entity.service";
import { MergeStrategy } from "@ngrx/data";

@Injectable()
export class CreateJobFacade implements OnDestroy {
  saveJob$: Subject<JobAdData> = new Subject<JobAdData>();

  // unsubscribe cleaner
  private _unsubscribe$ = new Subject<void>();

  constructor(private _service: AdJobEntityService) {}

  /**
   * Save job
   * @returns 
   */
  saveJob(): Observable<any> {
    return this.saveJob$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((value: JobAdData) => this._service.add(value, {
        mergeStrategy: MergeStrategy.PreserveChanges,
      })),
      catchError(err => of(err))
    )
  }
  
  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
