

import { Injectable, OnDestroy } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators";
import { Observable, Subject, of } from "rxjs";

import { JobAdData } from "../ad-job-list.model";
import { AdJobEntityService } from "../services/ad-job-entity.service";

@Injectable()
export class EditJobFacade implements OnDestroy {
  editJob$: Subject<JobAdData> = new Subject<JobAdData>();


  // unsubscribe cleaner
  private _unsubscribe$ = new Subject<void>();
  
  constructor(private _service: AdJobEntityService) { }

  editJob(): Observable<any> {
    return this.editJob$.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((value: JobAdData) => this._service.update(value)),
      catchError(err => of(err))
    )
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
