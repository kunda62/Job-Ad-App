import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CreateJobGroup {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      id: [null],
      title: [null, Validators.required],
      description: [null, Validators.required, this.descriptionLengthValidator],
      skills: this._fb.array([], Validators.required),
      status: [null, Validators.required],
      skillsValue: [''],
    });
  }

  /**
   * Length validator
   * @param control 
   * @returns 
   */
  descriptionLengthValidator(control: AbstractControl): Observable<any> {
    return of(control.value).pipe(
      map((value: string) => {
        if (value && value.length >= 10) {

          // reset validator
          return null;
        } else {

          // set validator
          return { minLength: true };
        }
      })
    );
  }

  /**
   * Same title validator
   * @param existingTitles 
   * @returns 
   */
  titleExistsValidator(existingTitles: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const newTitle: string = control.value;
      if (existingTitles.some(
          (title: string) => title.trim().toLowerCase() === newTitle?.trim().toLowerCase())
      ) {

        // set validator
        return { titleExists: true };
      }

      // reset validator
      return null;
    };
  }

  /**
   * Add new skill to array
   * @param data 
   */
  addNewSkillToArray(data: string): void {
    const skillsArr = this.form.get('skills') as FormArray;

    skillsArr.push(this._fb.control(data));
  }
}
