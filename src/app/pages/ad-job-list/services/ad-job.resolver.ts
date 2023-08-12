import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { AdJobEntityService } from './ad-job-entity.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable()
export class AdJobResolver implements OnDestroy {

  // pagination settings
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  filterStatus = '';
  searchTerm = '';

  private _unsubscribe$ = new Subject<void>();

  constructor(private _jobService: AdJobEntityService,  private _storageService: LocalStorageService) {
    this.getDataFromStorage();
  }

  /**
   * Get data only once when app starts
   * @param route 
   * @param state 
   * @returns 
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._jobService.loaded$.pipe(
      takeUntil(this._unsubscribe$),
      tap((loaded) => {
        if (!loaded) {
          this._jobService.getWithQuery({
            _limit: this.itemsPerPage,
            _page: this.currentPage,
            _like: this.filterStatus,
            _q: this.searchTerm,
          });
        }
      }),
      first()
    );
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  /**
   * Get params for pagination from local storage
   */
  private getDataFromStorage(): void {
    this.filterStatus = this._storageService.getData('filterStatus') ? this._storageService.getData('filterStatus').replace(/"/g, '') : ''; 
    this.searchTerm = this._storageService.getData('searchTerm') ? this._storageService.getData('searchTerm').replace(/"/g, '') : '';
    this.currentPage = this._storageService.getData('currentPage') ? +this._storageService.getData('currentPage').replace(/"/g, '') : 1;
    this.itemsPerPage = this._storageService.getData('itemsPerPage') ? +this._storageService.getData('itemsPerPage').replace(/"/g, '') : 10;
  }
}
