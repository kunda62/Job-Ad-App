import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EditJobGroup } from './edit-job.group';
import { EditJobFacade } from './edit-job-facade';
import { JobAdData } from '../ad-job-list.model';

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
    if (this.jobAd.status.toLowerCase() === 'draft') {
      this.statusOptions = [
        { name: 'Publish', value: 'Published' },
        { name: 'Archive', value: 'Archived' },
        { name: 'Draft', value: 'Draft' },
      ];
    } else if (this.jobAd.status.toLowerCase() === 'published') {
      this.statusOptions = [
        { name: 'Archive', value: 'Archived' },
        { name: 'Publish', value: 'Published' },
      ];
    }

    // set same title validator
    this.form.get('title')?.addValidators(this._group.titleExistsValidator(this.allTitles));

    //fill the form
    this._group.setFormValue(this.jobAd);

    // edit job
    this._facade.editJob().subscribe({
      next: (res) => {
        if (!res.error) {

          // reset value change 
          this.formValueChanged = false;

          // navigate to home page
          this._router.navigate(['home']);
        }
      },
    });
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
    this._facade.saveJob$.next(this.form.value);
  }
}
