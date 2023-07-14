import { Injectable } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EditJobGroup {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      id:[null],
      title: [null, Validators.required],
      description: [null, Validators.required, this.descriptionLengthValidator],
      skills: this._fb.array([], Validators.required),
      status: [null, Validators.required],
      skillsValue:['']
    })
  }

  /**
   * Set form values
   * @param values 
   */
  setFormValue(values: any): void {
    const skills = this.form.get('skills') as FormArray;
   
    this.form.patchValue({
      id: values.id,
      title: values.title,
      description: values.description,
      status: values.status,
      skills: values.skills.forEach((item: string) => {
        skills.push(this._fb.control(item))
      })
    });
  }

  /**
   * Description length validator
   * @param control 
   * @returns 
   */
  descriptionLengthValidator(control: AbstractControl): Observable<any>  {
    return of(control.value).pipe(
      map((value: string) => {
        if (value && value.length >= 10) {
          return null;
        } else {
          return { minLength: true }; 
        }
      })
    );
  };

  /**
   * Title exsits validator
   * @param existingTitles 
   * @returns 
   */
  titleExistsValidator(existingTitles: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const newTitle: string = control.value;
      if (
        existingTitles.some(
          (title: string) => title.trim() === newTitle?.trim()
        )) {
        return { titleExists: true };
      }
      return null;
    };
  }

  /**
   * Add new skill
   * @param data 
   */
  addNewSkillToArray(data: string): void {
    const skillsArr = this.form.get('skills') as FormArray;
    skillsArr.push(this._fb.control(data));
  }
}
