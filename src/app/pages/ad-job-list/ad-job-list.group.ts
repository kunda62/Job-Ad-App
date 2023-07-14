

import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

import { JobAdData } from "./ad-job-list.model";

@Injectable()
export class AdJobsListGroup {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      adList: this._fb.array([])
    })
  }

  /**
   * Fill jobs ad
   * @param data
   */
  addJobsGroup(data: JobAdData[]): void {
    const array = this.form.get('adList') as FormArray;
    
    if (data && data.length) {
      data.forEach((item: any) => {
        array.push(this._fb.group({
          ...item,
          skills: this._fb.array([...item.skills])
        }))
      });
    }
  }

  /**
   * Clear form
   * @param type
   */
  clearForm(): void {
    const adList = this.form.get('adList') as FormArray;
    adList.clear();
  }
}
