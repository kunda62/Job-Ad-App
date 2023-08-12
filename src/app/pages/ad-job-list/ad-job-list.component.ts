import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

import { AdJobListFacade } from './ad-job-list-facade';
import { AdJobsListGroup } from './ad-job-list.group';
import { ErrorResponse, JobAdData, JobStatus } from './ad-job-list.model';
import { AdJobEntityService } from './services/ad-job-entity.service';
import { AdJobDataService } from './services/ad-job-data.service';

@Component({
  selector: 'app-ad-job-list',
  templateUrl: './ad-job-list.component.html',
  styleUrls: ['./ad-job-list.component.scss'],
  providers: [ AdJobListFacade, AdJobsListGroup ]
})
export class AdJobListComponent implements OnInit {
  form: FormGroup;
  adJobList: JobAdData[] | null;
  allTitles: string[] = [];

  noDataFound = false;
  isLoading: Observable<boolean> | null;
  
  // pagination settings
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  totalItems = 0;
  filterStatus = '';
  searchTerm = '';

  filterOptions: string[] = ['All', 'Published', 'Draft', 'Archived'];

  constructor(
    private _facade: AdJobListFacade,
    private _group: AdJobsListGroup,
    private _router: Router,
    private _storageService: LocalStorageService,
    private _service: AdJobEntityService,
    private _dataService: AdJobDataService
    ) { 
    this.form = this._group.form;
    this.adJobList = null;
    this.isLoading = this._service.loading$;
  } 

  ngOnInit(): void {
    this.getDataFromStorage();
    
    this._service.entities$.subscribe({
      next: (value: JobAdData[]) => {
        
        this.adJobList = value.slice(0, this.itemsPerPage);
        this._group.addJobsGroup(this.adJobList);
        
        this.totalItems = this._dataService.totalJobsCount$.getValue();
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.allTitles = value.map((item: JobAdData) => item.title);
        
        // reset to first page
        if(this.currentPage > 1 && !this.adJobList.length) {
          this.onPageChange(1);
        }
      }
    });

    this._facade.loadList().subscribe({
      next: (value: JobAdData[]) => this._service.addAllToCache(value)
    });
    
    this._facade.deleteJob().subscribe({
      next: (value: ErrorResponse | number | any) => {
        if(!value.error) {
          this._dataService.totalJobsCount$.next(this._dataService.totalJobsCount$.value - 1);
        }
      }
    })
  }

  /**
   * Navigate to create page and send titles array
   */
  navigateToCreatePage(): void {
    const data = { titles: this.allTitles }
    this._router.navigateByUrl('home/add', {state: data});
  }

  /**
   * Navigate to edit page and send the job data nad titles array
   * @param data 
   */
  navigateToEditPage(value: JobAdData) {

    // remove current title from array
    const titles = this.allTitles.filter((item: string) =>
      item.toLowerCase().trim() !== value.title.toLowerCase().trim());

    const data = {data: value, titles: titles};

    this._router.navigateByUrl('home/edit', {state: data});
  }

  /**
   * Update status
   * @param data 
   * @param index 
   */
  updateStatus(data: JobAdData, index: number) {
    const formArray = this.form.get('adList') as FormArray;
    let newStatus: string = '';
    
    // check for status and set the new one
    if (data.status.toLowerCase() === JobStatus.DRAFT) {
      newStatus = 'Published';
    } else if (data.status.toLowerCase() === JobStatus.PUBLISH) {
      newStatus = 'Archived';
    }
    
    // patch new status
    if (newStatus) {
      formArray.at(index)?.get('status')?.patchValue(newStatus, { emitEvent: false });

      this._service.update(formArray.at(index).value)
    }
  }

  /**
   * Handle page change
   * @param page 
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('page: ', page);
    
    this._facade.jobList$.next({
      _limit: this.itemsPerPage,
      _page: this.currentPage,
      _like: this.filterStatus,
      _q: this.searchTerm
    });

    // save current page to local storage
    this._storageService.saveData('currentPage', JSON.stringify(this.currentPage));
  }

  /**
   * Handle pages amount change
   * @param value 
   */
  onShowAmountChanged(value: number) {
    this.itemsPerPage = value;

    // reset current page
    this.currentPage = 1;
    this._storageService.removeData('currentPage');
    
    // get total pages
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this._facade.jobList$.next({
      _limit: this.itemsPerPage,
      _page: 1,
      _like: this.filterStatus,
      _q: this.searchTerm
    });

    // save items per page to local storage
    this._storageService.saveData('itemsPerPage', JSON.stringify(this.itemsPerPage));
  }

  /**
   * Search titles
   * @param value 
   */
  searchTitle(value: string): void {
    if (value.length >= 2) {
      this.searchTerm = value;
    } else {

      if (value. length === 0)
        this.searchTerm = '';
    }

    // reset current page
    this.currentPage = 1;
    this._storageService.removeData('currentPage');

    this._facade.jobList$.next({
      _limit: this.itemsPerPage,
      _page: 1,
      _like: this.filterStatus || '',
      _q: this.searchTerm,
    });
    
    // Save search term to local storage
    this._storageService.saveData('searchTerm', JSON.stringify(this.searchTerm));
  }

  /**
   * Filter by status
   * @param value 
   */
  filterByStatus(value: string): void {
    this.filterStatus = value;
    this.currentPage = 1;

    // reset filter status
    if (this.filterStatus.toLowerCase() === JobStatus.ALL) {
      this.filterStatus = '';
    }

    this._facade.jobList$.next({
      _limit: this.itemsPerPage,
      _page: 1,
      _like: this.filterStatus,
      _q: this.searchTerm
    });

    // save data to local storage
    this._storageService.saveData('filterStatus', JSON.stringify(this.filterStatus));
  }

  /**
   * Delete job ad
   * @param id 
   */
  deleteJob(id: number) {
    this._facade.delete$.next(id);
  }

  /**
   * Get data from local storage
   */
  private getDataFromStorage(): void {
    this.filterStatus = this._storageService.getData('filterStatus') ? this._storageService.getData('filterStatus').replace(/"/g, '') : ''; 
    this.searchTerm = this._storageService.getData('searchTerm') ? this._storageService.getData('searchTerm').replace(/"/g, '') : '';
    this.currentPage = this._storageService.getData('currentPage') ? +this._storageService.getData('currentPage').replace(/"/g, '') : 1;
    this.itemsPerPage = this._storageService.getData('itemsPerPage') ? +this._storageService.getData('itemsPerPage').replace(/"/g, '') : 10;
  }
}
 