

import { Injectable, OnDestroy } from "@angular/core";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";
import { AbstractControl } from "@angular/forms";

import { Observable, Subject, of } from "rxjs";

import { EditJobService } from "./edit-job.service";
import { JobAdData } from "../ad-job-list.model";

@Injectable()
export class EditJobFacade implements OnDestroy {
  saveJob$: Subject<JobAdData> = new Subject<JobAdData>();

  // unsubscribe cleaner
  private _unsubscribe$ = new Subject<void>();
  
  constructor(private _service: EditJobService) {}

  /**
   * Edit job
   * @returns 
   */
  editJob(): Observable<any> {
    return this.saveJob$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((data: any) =>
        this._service.editJob$(data).pipe(catchError((err: any) => of(err)))
      )
    );
  }

   /**
   * Track form change
   * @param control
   * @returns
    */
   formChanges(form: AbstractControl): Observable<any> {
    return form.valueChanges.pipe(
      takeUntil(this._unsubscribe$),
      map(() => true)
    );
  }
  
  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
