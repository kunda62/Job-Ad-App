

import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";;

import { JobAdData, PaginationParams } from "./ad-job-list.model";
import { AdJobEntityService } from "./services/ad-job-entity.service";

@Injectable()
export class AdJobListFacade implements OnDestroy {
  jobList$: Subject<PaginationParams> = new Subject<PaginationParams>();
  delete$: Subject<number> = new Subject<number>();

  // unsubscribe cleaner
  private _unsubscribe$ = new Subject<void>();

  constructor(private _service: AdJobEntityService) {}

  /**
   * Load job list
   * @returns
   */
  loadList(): Observable<JobAdData[]> {
    return this.jobList$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((value: PaginationParams | any) =>
        this._service.getWithQuery(value).pipe(
          map((value: any) => value),
          catchError((err) => of(err))
        )
      )
    );
  }

  deleteJob(): Observable<number> {
    return this.delete$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((id: number) =>
        this._service.delete(id).pipe(catchError((err) => of(err)))
      )
    );
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
