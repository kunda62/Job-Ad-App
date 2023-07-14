import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

import { AdJobListFacade } from './ad-job-list-facade';
import { AdJobsListGroup } from './ad-job-list.group';
import { JobAdData, JobAdResponse } from './ad-job-list.model';


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
  filterStatus = '';
  searchTerm = '';
  noDataFound = false;
  
  // pagination settings
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  totalItems = 0;

  filterOptions: string[] = ['All', 'Published', 'Draft', 'Archived'];

  constructor(
    private _facade: AdJobListFacade,
    private _group: AdJobsListGroup,
    private _router: Router,
    private _storageService: LocalStorageService
    ) { 
    this.form = this._group.form;
    this.adJobList = null;
  } 

  ngOnInit(): void {
    this.getDataFromStorage();

    // get ad list and total count
    this._facade.jobListLoad().subscribe({
      next: (res: JobAdResponse) => {
        this.noDataFound = false;

        // get all titles
        this.allTitles = res.data.map((item: JobAdData) => item.title);
        this.totalItems = res.totalCount;
        this.adJobList = res.data;

        !this.adJobList.length ? this.noDataFound = true : null;

        // get total pages 
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

        // reset form before population
        this._group.clearForm();

        // fill the group
        this._group.addJobsGroup(res.data);
      }
    });

    // edit job status
    this._facade.editJobStatus().subscribe({
      next: (res) => {
        if(!res.error) {
          
          // call ad jobs list
          this._facade.jobList$.next({
            _limit: this.itemsPerPage,
            _page: this.currentPage,
            _like: this.filterStatus,
            _q: this.searchTerm
          });
        }
      }
    });

    this._facade.jobDelete().subscribe({
      next: (res) => {
        if (!res.error) {

          // reset current page 
          this.currentPage = 1;
          this._storageService.removeData('currentPage');

          // call ad job list
          this._facade.jobList$.next({
            _limit: this.itemsPerPage,
            _page: 1,
            _like: this.filterStatus,
            _q: this.searchTerm
          });
        }
      }
    });
    
    // inital call for ad list
    this._facade.jobList$.next({
      _limit: this.itemsPerPage,
      _page: this.currentPage,
      _like: this.filterStatus,
      _q: this.searchTerm
    });
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
    const titles = this.allTitles.filter((item: string) => item.toLowerCase().trim() !== value.title.toLowerCase().trim());
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
    if (data.status.toLowerCase() === 'draft') {
      newStatus = 'Published';
    } else if (data.status.toLowerCase() === 'published') {
      newStatus = 'Archived';
    }
    
    // patch new status
    if (newStatus) {
      formArray.at(index)?.get('status')?.patchValue(newStatus, { emitEvent: false });
      this._facade.saveJob$.next(formArray.at(index).value);
    }
  }
  

  /**
   * Handle page change
   * @param page 
   */
  onPageChange(page: number): void {
    if (this.currentPage !== page) {
      this.currentPage = page;

      this._facade.jobList$.next({
        _limit: this.itemsPerPage,
        _page: this.currentPage,
        _like: this.filterStatus,
        _q: this.searchTerm
      });
    }

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
    if (this.filterStatus.toLowerCase() === 'all') {
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
    this._facade.deleteJob$.next(id);
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
 