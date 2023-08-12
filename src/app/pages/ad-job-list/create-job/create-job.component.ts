import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { CreateJobGroup } from './create-job.group';
import { CreateJobFacade } from './create-job.facade';
import { AdJobDataService } from '../services/ad-job-data.service';
import { ErrorResponse } from '../ad-job-list.model';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['../edit-job/edit-job.component.scss'],
  providers: [CreateJobFacade, CreateJobGroup],
})
export class CreateJobComponent implements OnInit {
  form: FormGroup;
  inputString = '';
  allTitles: string[] = [];
  
  constructor(
    private _group: CreateJobGroup,
    private _router: Router,
    private _facade: CreateJobFacade,
    private _service: AdJobDataService
  ) {
    this.form = this._group.form;
  }

  ngOnInit(): void {

    // Get titles from the router
    this.allTitles = window.history.state.titles;

    //set validatior for title
    this.form
      .get('title')
      ?.addValidators(this._group.titleExistsValidator(this.allTitles));

    // save job and navigate on success
    this._facade.saveJob().subscribe({
      next: (value: ErrorResponse) => {
        if(!value?.error) {
          this._service.totalJobsCount$.next(this._service.totalJobsCount$.value + 1);
          this._router.navigate(['home']);
        }
      }
    });
  }

  /**
   * Add new skill
   */
  addNewSkill(): void {
    if (this.form.value.skillsValue) {
      this._group.addNewSkillToArray(this.form.get('skillsValue')?.value);

      // reset input value
      this.form.get('skillsValue')?.setValue('');
    }
  }

  /**
   * Delete skill
   * @param index 
   */
  deleteSkil(index: number): void {
    const array = this.form.get('skills') as FormArray;

    array.removeAt(index, { emitEvent: true });
  }

  /**
   * Save job ad
   */
  saveJob(): void {
    this._facade.saveJob$.next(this.form.value)
  }

  /**
   * Get form controls
   * @param name 
   * @returns 
   */
  getControls(name: string): AbstractControl[] {
    return (this.form.get(name) as FormArray).controls;
  }
}
