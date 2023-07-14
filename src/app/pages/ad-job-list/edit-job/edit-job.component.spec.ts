import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobComponent } from './edit-job.component';

describe('AdJobListComponent', () => {
  let component: EditJobComponent;
  let fixture: ComponentFixture<EditJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditJobComponent]
    });
    fixture = TestBed.createComponent(EditJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
