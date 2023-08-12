import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {  Router } from '@angular/router';

import { EditJobGroup } from './edit-job.group';
import { EditJobFacade } from './edit-job-facade';
import { ErrorResponse, JobAdData, JobStatus } from '../ad-job-list.model';
import { AdJobEntityService } from '../services/ad-job-entity.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss'],
  providers: [EditJobFacade, EditJobGroup],
})
export class EditJobComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  jobAd: JobAdData | null;
  statusOptions: any[] = [];
  allTitles: string[] = [];
  formValueChanged = false;

  constructor(
    private _facade: EditJobFacade,
    private _group: EditJobGroup,
    private _router: Router
  ) {
    this.form = this._group.form;
    this.jobAd = null;
  }

  ngOnInit(): void {

    // get data from the router
    this.jobAd = window.history.state.data as JobAdData;
    this.allTitles = window.history.state.titles;

    if (!this.jobAd) {
      window.history.back();
      return;
    }
    // set the status options
    if (this.jobAd.status.toLowerCase() === JobStatus.DRAFT) {
      this.statusOptions = ['Published', 'Archived', 'Draft'];
    } else if (this.jobAd.status.toLowerCase() === JobStatus.PUBLISH) {
      this.statusOptions = [ 'Archived', 'Published'];
    }

    // set same title validator
    this.form.get('title')?.addValidators(this._group.titleExistsValidator(this.allTitles));

    //fill the form
    this._group.setFormValue(this.jobAd);

    // edit job and navigate on success
    this._facade.editJob().subscribe({
      next: (value: ErrorResponse) => {
        if(!value.error) {
          this._router.navigate(['home']);
        }
      }
    })
  }

  ngAfterViewInit(): void {

    // listen for value changes
    this._facade.formChanges(this.form).subscribe({
      next: () => this.formValueChanged = true
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
  deleteSkill(index: number): void {
    const array = this.form.get('skills') as FormArray;
    
    array.removeAt(index, { emitEvent: true });
  }

  /**
   * Save job
   */
  saveJob(): void {
    this._facade.editJob$.next(this.form.value);
  }
}
